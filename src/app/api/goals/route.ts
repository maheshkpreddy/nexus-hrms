import { NextRequest, NextResponse } from 'next/server';
import { DEMO_GOALS } from '@/lib/demo-data';

function filterDemoGoals(params: { employeeId?: string | null; status?: string | null; type?: string | null; category?: string | null; page: number; limit: number }) {
  let filtered = [...DEMO_GOALS];
  if (params.employeeId) filtered = filtered.filter(g => g.employeeId === params.employeeId);
  if (params.status) filtered = filtered.filter(g => g.status === params.status);
  if (params.type) filtered = filtered.filter(g => g.type === params.type);
  if (params.category) filtered = filtered.filter(g => g.category === params.category);
  return NextResponse.json({
    data: filtered,
    pagination: { page: params.page, limit: params.limit, total: filtered.length, totalPages: Math.ceil(filtered.length / params.limit) },
  });
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const employeeId = url.searchParams.get('employeeId');
  const status = url.searchParams.get('status');
  const type = url.searchParams.get('type');
  const category = url.searchParams.get('category');
  const companyId = url.searchParams.get('companyId');
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '20');

  try {
    const { db } = await import('@/lib/db');
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (employeeId) where.employeeId = employeeId;
    if (status) where.status = status;
    if (type) where.type = type;
    if (category) where.category = category;
    if (companyId) where.employee = { companyId };

    const [goals, total] = await Promise.all([
      db.goal.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          employee: {
            select: {
              id: true, firstName: true, lastName: true,
              department: { select: { name: true } },
            },
          },
        },
      }),
      db.goal.count({ where }),
    ]);

    // If DB has real data, return it
    if (goals.length > 0 || total > 0) {
      return NextResponse.json({
        data: goals,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      });
    }
  } catch (error) {
    console.error('Goals GET error, using demo data:', error);
  }

  // Demo data fallback (when DB is empty or unavailable)
  return filterDemoGoals({ employeeId, status, type, category, page, limit });
}

export async function POST(req: NextRequest) {
  try {
    const { db } = await import('@/lib/db');
    const body = await req.json();
    const { title, description, type, category, progress, status, startDate, endDate, employeeId } = body;

    if (!title || !startDate || !endDate || !employeeId) {
      return NextResponse.json(
        { error: 'Missing required fields: title, startDate, endDate, employeeId' },
        { status: 400 }
      );
    }

    const goal = await db.goal.create({
      data: {
        title, description,
        type: type || 'individual',
        category,
        progress: progress || 0,
        status: status || 'not_started',
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        employeeId,
      },
      include: {
        employee: { select: { firstName: true, lastName: true } },
      },
    });

    await db.auditLog.create({
      data: {
        action: 'CREATE',
        entity: 'Goal',
        entityId: goal.id,
        userId: body.createdBy,
        details: `Created goal: ${title}`,
      },
    });

    return NextResponse.json(goal, { status: 201 });
  } catch (error) {
    console.error('Goals POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { db } = await import('@/lib/db');
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Goal ID is required' }, { status: 400 });
    }

    const existing = await db.goal.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
    if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);

    // Auto-update status based on progress
    if (updateData.progress !== undefined) {
      if (updateData.progress >= 100) {
        updateData.status = 'completed';
      } else if (updateData.progress > 0) {
        updateData.status = 'in_progress';
      }
    }

    const goal = await db.goal.update({
      where: { id },
      data: updateData,
      include: {
        employee: { select: { firstName: true, lastName: true } },
      },
    });

    await db.auditLog.create({
      data: {
        action: 'UPDATE',
        entity: 'Goal',
        entityId: id,
        userId: body.updatedBy,
        details: `Updated goal: ${existing.title}`,
      },
    });

    return NextResponse.json(goal);
  } catch (error) {
    console.error('Goals PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
