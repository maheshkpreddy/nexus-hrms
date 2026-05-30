import { NextRequest, NextResponse } from 'next/server';
import { DEMO_SHIFTS } from '@/lib/demo-data';

function filterDemoShifts(params: { companyId?: string | null; isActive?: string | null; page: number; limit: number }) {
  let filtered = [...DEMO_SHIFTS];
  if (params.companyId) filtered = filtered.filter(s => s.companyId === params.companyId);
  if (params.isActive !== null && params.isActive !== undefined) {
    const active = params.isActive === 'true';
    filtered = filtered.filter(s => s.isActive === active);
  }
  return NextResponse.json({
    data: filtered,
    pagination: { page: params.page, limit: params.limit, total: filtered.length, totalPages: Math.ceil(filtered.length / params.limit) },
  });
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const companyId = url.searchParams.get('companyId');
  const isActive = url.searchParams.get('isActive');
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '20');

  try {
    const { db } = await import('@/lib/db');
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

    // If DB has real data, return it
    if (shifts.length > 0 || total > 0) {
      return NextResponse.json({
        data: shifts,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      });
    }
  } catch (error) {
    console.error('Shifts GET error, using demo data:', error);
  }

  // Demo data fallback (when DB is empty or unavailable)
  return filterDemoShifts({ companyId, isActive, page, limit });
}

export async function POST(req: NextRequest) {
  try {
    const { db } = await import('@/lib/db');
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
    const { db } = await import('@/lib/db');
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
