import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get('search');
    const departmentId = url.searchParams.get('departmentId');
    const status = url.searchParams.get('status');
    const companyId = url.searchParams.get('companyId');
    const branchId = url.searchParams.get('branchId');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (companyId) where.companyId = companyId;
    if (departmentId) where.departmentId = departmentId;
    if (status) where.status = status;
    if (branchId) where.branchId = branchId;
    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
        { employeeId: { contains: search } },
        { designation: { contains: search } },
      ];
    }

    const [employees, total] = await Promise.all([
      db.employee.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          department: { select: { id: true, name: true } },
          branch: { select: { id: true, name: true } },
          company: { select: { id: true, name: true } },
          reportingManager: { select: { id: true, firstName: true, lastName: true } },
        },
      }),
      db.employee.count({ where }),
    ]);

    return NextResponse.json({
      data: employees,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Employees GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      employeeId, firstName, lastName, email, phone, avatar,
      dateOfBirth, gender, maritalStatus, nationality, address,
      city, state, country, zipCode, emergencyContact, emergencyPhone,
      designation, jobTitle, employmentType, status, joiningDate,
      exitDate, probationEnd, reportingManagerId, companyId,
      branchId, departmentId, userId,
    } = body;

    if (!employeeId || !firstName || !lastName || !email || !designation || !joiningDate || !companyId || !departmentId) {
      return NextResponse.json(
        { error: 'Missing required fields: employeeId, firstName, lastName, email, designation, joiningDate, companyId, departmentId' },
        { status: 400 }
      );
    }

    // Check unique constraints
    const existingEmployee = await db.employee.findFirst({
      where: { OR: [{ employeeId }, { email }] },
    });
    if (existingEmployee) {
      return NextResponse.json(
        { error: 'Employee ID or email already exists' },
        { status: 400 }
      );
    }

    const employee = await db.employee.create({
      data: {
        employeeId, firstName, lastName, email, phone, avatar,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender, maritalStatus, nationality, address,
        city, state, country, zipCode, emergencyContact, emergencyPhone,
        designation, jobTitle, employmentType: employmentType || 'full-time',
        status: status || 'active',
        joiningDate: new Date(joiningDate),
        exitDate: exitDate ? new Date(exitDate) : null,
        probationEnd: probationEnd ? new Date(probationEnd) : null,
        reportingManagerId,
        companyId, branchId, departmentId, userId,
      },
      include: {
        department: true,
        branch: true,
        company: true,
      },
    });

    // Audit log
    await db.auditLog.create({
      data: {
        action: 'CREATE',
        entity: 'Employee',
        entityId: employee.id,
        userId: body.createdBy,
        details: `Created employee ${firstName} ${lastName}`,
      },
    });

    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    console.error('Employees POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Employee ID is required' },
        { status: 400 }
      );
    }

    const existing = await db.employee.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    // Convert date fields
    const dateFields = ['dateOfBirth', 'joiningDate', 'exitDate', 'probationEnd'];
    for (const field of dateFields) {
      if (updateData[field]) {
        updateData[field] = new Date(updateData[field]);
      }
    }

    const employee = await db.employee.update({
      where: { id },
      data: updateData,
      include: {
        department: true,
        branch: true,
        company: true,
        reportingManager: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    // Audit log
    await db.auditLog.create({
      data: {
        action: 'UPDATE',
        entity: 'Employee',
        entityId: id,
        userId: body.updatedBy,
        details: `Updated employee ${existing.firstName} ${existing.lastName}`,
      },
    });

    return NextResponse.json(employee);
  } catch (error) {
    console.error('Employees PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
