import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const employeeId = url.searchParams.get('employeeId');
    const status = url.searchParams.get('status');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const companyId = url.searchParams.get('companyId');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (employeeId) where.employeeId = employeeId;
    if (status) where.status = status;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) (where.date as Record<string, unknown>).gte = new Date(startDate);
      if (endDate) (where.date as Record<string, unknown>).lte = new Date(endDate);
    }
    if (companyId) {
      where.employee = { companyId };
    }

    const [records, total] = await Promise.all([
      db.attendance.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: 'desc' },
        include: {
          employee: {
            select: {
              id: true, firstName: true, lastName: true,
              employeeId: true, department: { select: { name: true } },
            },
          },
        },
      }),
      db.attendance.count({ where }),
    ]);

    return NextResponse.json({
      data: records,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Attendance GET error:', error);
    // Demo data fallback when database is unavailable
    const demoRecords = [
      { id: 'att-1', employeeId: 'demo-1', date: '2025-05-28', checkIn: '2025-05-28T09:00:00', checkOut: '2025-05-28T18:00:00', status: 'present', workHours: 9, breakDuration: 60, source: 'web', notes: null, employee: { id: 'demo-1', firstName: 'Rajesh', lastName: 'Kumar', employeeId: 'EMP001', department: { name: 'Engineering' } } },
      { id: 'att-2', employeeId: 'demo-2', date: '2025-05-28', checkIn: '2025-05-28T09:15:00', checkOut: '2025-05-28T17:45:00', status: 'present', workHours: 8.5, breakDuration: 60, source: 'web', notes: null, employee: { id: 'demo-2', firstName: 'Priya', lastName: 'Sharma', employeeId: 'EMP002', department: { name: 'Human Resources' } } },
      { id: 'att-3', employeeId: 'demo-3', date: '2025-05-28', checkIn: '2025-05-28T10:00:00', checkOut: '2025-05-28T18:30:00', status: 'present', workHours: 8.5, breakDuration: 60, source: 'web', notes: 'Late check-in', employee: { id: 'demo-3', firstName: 'Amit', lastName: 'Patel', employeeId: 'EMP003', department: { name: 'Design' } } },
      { id: 'att-4', employeeId: 'demo-7', date: '2025-05-28', checkIn: null, checkOut: null, status: 'on_leave', workHours: 0, breakDuration: 0, source: 'system', notes: null, employee: { id: 'demo-7', firstName: 'Kiran', lastName: 'Nair', employeeId: 'EMP007', department: { name: 'Engineering' } } },
      { id: 'att-5', employeeId: 'demo-4', date: '2025-05-28', checkIn: '2025-05-28T08:45:00', checkOut: '2025-05-28T17:30:00', status: 'present', workHours: 8.75, breakDuration: 60, source: 'web', notes: null, employee: { id: 'demo-4', firstName: 'Sneha', lastName: 'Reddy', employeeId: 'EMP004', department: { name: 'Finance' } } },
      { id: 'att-6', employeeId: 'demo-6', date: '2025-05-28', checkIn: '2025-05-28T09:00:00', checkOut: '2025-05-28T18:15:00', status: 'present', workHours: 9.25, breakDuration: 60, source: 'web', notes: null, employee: { id: 'demo-6', firstName: 'Ananya', lastName: 'Gupta', employeeId: 'EMP006', department: { name: 'Marketing' } } },
      { id: 'att-7', employeeId: 'demo-8', date: '2025-05-28', checkIn: '2025-05-28T09:30:00', checkOut: null, status: 'present', workHours: 0, breakDuration: 0, source: 'web', notes: null, employee: { id: 'demo-8', firstName: 'Deepa', lastName: 'Iyer', employeeId: 'EMP008', department: { name: 'Sales' } } },
      { id: 'att-8', employeeId: 'demo-9', date: '2025-05-28', checkIn: '2025-05-28T08:30:00', checkOut: '2025-05-28T17:30:00', status: 'present', workHours: 9, breakDuration: 60, source: 'web', notes: null, employee: { id: 'demo-9', firstName: 'Arjun', lastName: 'Menon', employeeId: 'EMP009', department: { name: 'Operations' } } },
      { id: 'att-9', employeeId: 'demo-10', date: '2025-05-28', checkIn: '2025-05-28T09:00:00', checkOut: '2025-05-28T18:00:00', status: 'present', workHours: 9, breakDuration: 60, source: 'web', notes: null, employee: { id: 'demo-10', firstName: 'Meera', lastName: 'Joshi', employeeId: 'EMP010', department: { name: 'Finance' } } },
      { id: 'att-10', employeeId: 'demo-5', date: '2025-05-27', checkIn: '2025-05-27T10:15:00', checkOut: '2025-05-27T19:00:00', status: 'present', workHours: 8.75, breakDuration: 60, source: 'web', notes: 'Late arrival - probation period', employee: { id: 'demo-5', firstName: 'Vikram', lastName: 'Singh', employeeId: 'EMP005', department: { name: 'Engineering' } } },
    ];
    let filtered = demoRecords;
    if (employeeId) filtered = filtered.filter(r => r.employeeId === employeeId);
    if (status) filtered = filtered.filter(r => r.status === status);
    return NextResponse.json({
      data: filtered,
      pagination: { page, limit, total: filtered.length, totalPages: 1 },
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { employeeId, date, checkIn, source, notes } = body;

    if (!employeeId) {
      return NextResponse.json(
        { error: 'Employee ID is required' },
        { status: 400 }
      );
    }

    const attendanceDate = date ? new Date(date) : new Date();
    attendanceDate.setHours(0, 0, 0, 0);

    // Check if attendance already exists for this date
    const existing = await db.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId,
          date: attendanceDate,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Attendance record already exists for this date. Use PUT to check out.' },
        { status: 400 }
      );
    }

    const checkInTime = checkIn ? new Date(checkIn) : new Date();

    const attendance = await db.attendance.create({
      data: {
        employeeId,
        date: attendanceDate,
        checkIn: checkInTime,
        status: 'present',
        source: source || 'web',
        notes,
      },
      include: {
        employee: {
          select: { id: true, firstName: true, lastName: true, employeeId: true },
        },
      },
    });

    await db.auditLog.create({
      data: {
        action: 'CHECK_IN',
        entity: 'Attendance',
        entityId: attendance.id,
        userId: body.userId,
        details: `Check-in recorded`,
      },
    });

    return NextResponse.json(attendance, { status: 201 });
  } catch (error) {
    console.error('Attendance POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, employeeId, date, checkOut, breakDuration, notes } = body;

    if (!id && !employeeId) {
      return NextResponse.json(
        { error: 'Attendance ID or employee ID is required' },
        { status: 400 }
      );
    }

    let attendance;
    if (id) {
      attendance = await db.attendance.findUnique({ where: { id } });
    } else if (employeeId && date) {
      const attendanceDate = new Date(date);
      attendanceDate.setHours(0, 0, 0, 0);
      attendance = await db.attendance.findUnique({
        where: { employeeId_date: { employeeId, date: attendanceDate } },
      });
    } else {
      // Try today's record
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      attendance = await db.attendance.findUnique({
        where: { employeeId_date: { employeeId: employeeId!, date: today } },
      });
    }

    if (!attendance) {
      return NextResponse.json(
        { error: 'Attendance record not found' },
        { status: 404 }
      );
    }

    const checkOutTime = checkOut ? new Date(checkOut) : new Date();
    const updateData: Record<string, unknown> = { checkOut: checkOutTime };

    if (breakDuration) updateData.breakDuration = breakDuration;
    if (notes) updateData.notes = notes;

    // Calculate work hours
    if (attendance.checkIn) {
      const workMs = checkOutTime.getTime() - new Date(attendance.checkIn).getTime();
      const breakMs = (breakDuration || attendance.breakDuration || 0) * 60 * 1000;
      const netWorkMs = workMs - breakMs;
      updateData.workHours = Math.round((netWorkMs / (1000 * 60 * 60)) * 100) / 100;
    }

    const updated = await db.attendance.update({
      where: { id: attendance.id },
      data: updateData,
      include: {
        employee: {
          select: { id: true, firstName: true, lastName: true, employeeId: true },
        },
      },
    });

    await db.auditLog.create({
      data: {
        action: 'CHECK_OUT',
        entity: 'Attendance',
        entityId: attendance.id,
        userId: body.userId,
        details: `Check-out recorded, work hours: ${updateData.workHours || 'N/A'}`,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Attendance PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
