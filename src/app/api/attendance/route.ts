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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
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
