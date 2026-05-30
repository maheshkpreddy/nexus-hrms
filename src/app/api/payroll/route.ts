import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { DEMO_PAYROLL } from '@/lib/demo-data';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const employeeId = url.searchParams.get('employeeId');
    const month = url.searchParams.get('month');
    const year = url.searchParams.get('year');
    const status = url.searchParams.get('status');
    const companyId = url.searchParams.get('companyId');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (employeeId) where.employeeId = employeeId;
    if (month) where.month = parseInt(month);
    if (year) where.year = parseInt(year);
    if (status) where.status = status;
    if (companyId) where.employee = { companyId };

    const [records, total] = await Promise.all([
      db.payrollRecord.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ year: 'desc' }, { month: 'desc' }],
        include: {
          employee: {
            select: {
              id: true, firstName: true, lastName: true,
              employeeId: true, designation: true,
              department: { select: { name: true } },
            },
          },
        },
      }),
      db.payrollRecord.count({ where }),
    ]);

    // Summary stats
    const summary = await db.payrollRecord.aggregate({
      where,
      _sum: { grossSalary: true, totalDeductions: true, netSalary: true },
      _count: true,
    });

    // If DB returns empty, use demo data fallback
    if (records.length === 0 && total === 0) {
      let filtered = [...DEMO_PAYROLL];
      if (employeeId) filtered = filtered.filter(r => r.employeeId === employeeId);
      if (month) filtered = filtered.filter(r => r.month === parseInt(month));
      if (year) filtered = filtered.filter(r => r.year === parseInt(year));
      if (status) filtered = filtered.filter(r => r.status === status);

      const totalGross = filtered.reduce((s, r) => s + r.grossSalary, 0);
      const totalDed = filtered.reduce((s, r) => s + r.totalDeductions, 0);
      const totalNet = filtered.reduce((s, r) => s + r.netSalary, 0);
      return NextResponse.json({
        data: filtered,
        pagination: { page, limit, total: filtered.length, totalPages: Math.ceil(filtered.length / limit) },
        summary: { totalGross, totalDeductions: totalDed, totalNet, recordCount: filtered.length },
      });
    }

    return NextResponse.json({
      data: records,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      summary: {
        totalGross: summary._sum.grossSalary || 0,
        totalDeductions: summary._sum.totalDeductions || 0,
        totalNet: summary._sum.netSalary || 0,
        recordCount: summary._count,
      },
    });
  } catch (error) {
    console.error('Payroll GET error:', error);
    // Fallback to DEMO_PAYROLL from demo-data.ts
    const url = new URL(req.url);
    const employeeId = url.searchParams.get('employeeId');
    const month = url.searchParams.get('month');
    const year = url.searchParams.get('year');
    const status = url.searchParams.get('status');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');

    let filtered = [...DEMO_PAYROLL];
    if (employeeId) filtered = filtered.filter(r => r.employeeId === employeeId);
    if (month) filtered = filtered.filter(r => r.month === parseInt(month));
    if (year) filtered = filtered.filter(r => r.year === parseInt(year));
    if (status) filtered = filtered.filter(r => r.status === status);

    const totalGross = filtered.reduce((s, r) => s + r.grossSalary, 0);
    const totalDed = filtered.reduce((s, r) => s + r.totalDeductions, 0);
    const totalNet = filtered.reduce((s, r) => s + r.netSalary, 0);
    return NextResponse.json({
      data: filtered,
      pagination: { page, limit, total: filtered.length, totalPages: Math.ceil(filtered.length / limit) },
      summary: { totalGross, totalDeductions: totalDed, totalNet, recordCount: filtered.length },
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      employeeId, month, year, basicPay, grossSalary,
      totalDeductions, netSalary, status, paymentDate,
    } = body;

    if (!employeeId || !month || !year || basicPay === undefined || grossSalary === undefined || netSalary === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: employeeId, month, year, basicPay, grossSalary, netSalary' },
        { status: 400 }
      );
    }

    // Check for duplicate
    const existing = await db.payrollRecord.findUnique({
      where: { employeeId_month_year: { employeeId, month, year } },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Payroll record already exists for this employee/month/year' },
        { status: 400 }
      );
    }

    const record = await db.payrollRecord.create({
      data: {
        employeeId, month, year, basicPay, grossSalary,
        totalDeductions: totalDeductions || 0, netSalary,
        status: status || 'processed',
        paymentDate: paymentDate ? new Date(paymentDate) : null,
      },
      include: {
        employee: {
          select: { firstName: true, lastName: true, employeeId: true },
        },
      },
    });

    await db.auditLog.create({
      data: {
        action: 'CREATE',
        entity: 'PayrollRecord',
        entityId: record.id,
        userId: body.createdBy,
        details: `Payroll processed for ${month}/${year}`,
      },
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error('Payroll POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Payroll record ID is required' }, { status: 400 });
    }

    const existing = await db.payrollRecord.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Payroll record not found' }, { status: 404 });
    }

    if (updateData.paymentDate) {
      updateData.paymentDate = new Date(updateData.paymentDate);
    }

    const record = await db.payrollRecord.update({
      where: { id },
      data: updateData,
      include: {
        employee: {
          select: { firstName: true, lastName: true, employeeId: true },
        },
      },
    });

    await db.auditLog.create({
      data: {
        action: 'UPDATE',
        entity: 'PayrollRecord',
        entityId: id,
        userId: body.updatedBy,
        details: `Payroll record updated`,
      },
    });

    return NextResponse.json(record);
  } catch (error) {
    console.error('Payroll PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
