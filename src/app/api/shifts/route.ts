import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { DEMO_SHIFTS } from '@/lib/demo-data';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const companyId = url.searchParams.get('companyId');
    const isActive = url.searchParams.get('isActive');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (companyId) where.companyId = companyId;
    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const [shifts, total] = await Promise.all([
      db.shift.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          company: { select: { id: true, name: true } },
          members: {
            include: {
              employee: {
                select: {
                  id: true, firstName: true, lastName: true,
                  employeeId: true,
                  department: { select: { name: true } },
                },
              },
            },
          },
          _count: { select: { members: true } },
        },
      }),
      db.shift.count({ where }),
    ]);

    // If DB returns empty, use demo data fallback
    if (shifts.length === 0 && total === 0) {
      let filtered = [...DEMO_SHIFTS];
      if (companyId) filtered = filtered.filter(s => s.companyId === companyId);
      if (isActive !== null && isActive !== undefined) {
        const active = isActive === 'true';
        filtered = filtered.filter(s => s.isActive === active);
      }
      return NextResponse.json({
        data: filtered,
        pagination: { page, limit, total: filtered.length, totalPages: Math.ceil(filtered.length / limit) },
      });
    }

    return NextResponse.json({
      data: shifts,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Shifts GET error:', error);
    // Fallback to DEMO_SHIFTS from demo-data.ts
    const url = new URL(req.url);
    const companyId = url.searchParams.get('companyId');
    const isActiveParam = url.searchParams.get('isActive');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');

    let filtered = [...DEMO_SHIFTS];
    if (companyId) filtered = filtered.filter(s => s.companyId === companyId);
    if (isActiveParam !== null && isActiveParam !== undefined) {
      const active = isActiveParam === 'true';
      filtered = filtered.filter(s => s.isActive === active);
    }

    return NextResponse.json({
      data: filtered,
      pagination: { page, limit, total: filtered.length, totalPages: Math.ceil(filtered.length / limit) },
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, startTime, endTime, breakMinutes, isActive, companyId, members } = body;

    if (!name || !startTime || !endTime || !companyId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, startTime, endTime, companyId' },
        { status: 400 }
      );
    }

    const shift = await db.shift.create({
      data: {
        name, startTime, endTime,
        breakMinutes: breakMinutes || 30,
        isActive: isActive !== undefined ? isActive : true,
        companyId,
        members: members ? {
          create: members.map((m: { employeeId: string; effectiveDate: string }) => ({
            employeeId: m.employeeId,
            effectiveDate: new Date(m.effectiveDate),
          })),
        } : undefined,
      },
      include: {
        company: true,
        members: {
          include: {
            employee: { select: { firstName: true, lastName: true } },
          },
        },
      },
    });

    await db.auditLog.create({
      data: {
        action: 'CREATE',
        entity: 'Shift',
        entityId: shift.id,
        userId: body.createdBy,
        details: `Shift created: ${name} (${startTime} - ${endTime})`,
      },
    });

    return NextResponse.json(shift, { status: 201 });
  } catch (error) {
    console.error('Shifts POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, members, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Shift ID is required' }, { status: 400 });
    }

    const existing = await db.shift.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Shift not found' }, { status: 404 });
    }

    // Update members if provided
    if (members && Array.isArray(members)) {
      await db.shiftMember.deleteMany({ where: { shiftId: id } });
      await db.shift.update({
        where: { id },
        data: {
          ...updateData,
          members: {
            create: members.map((m: { employeeId: string; effectiveDate: string }) => ({
              employeeId: m.employeeId,
              effectiveDate: new Date(m.effectiveDate),
            })),
          },
        },
      });
    } else {
      await db.shift.update({
        where: { id },
        data: updateData,
      });
    }

    const shift = await db.shift.findUnique({
      where: { id },
      include: {
        company: true,
        members: {
          include: {
            employee: {
              select: { firstName: true, lastName: true, employeeId: true },
            },
          },
        },
      },
    });

    await db.auditLog.create({
      data: {
        action: 'UPDATE',
        entity: 'Shift',
        entityId: id,
        userId: body.updatedBy,
        details: `Shift updated: ${existing.name}`,
      },
    });

    return NextResponse.json(shift);
  } catch (error) {
    console.error('Shifts PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
