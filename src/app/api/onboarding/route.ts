import { NextRequest, NextResponse } from 'next/server';
import { DEMO_ONBOARDING } from '@/lib/demo-data';

function filterDemoOnboarding(params: { employeeId?: string | null; status?: string | null; category?: string | null; page: number; limit: number }) {
  let filtered = [...DEMO_ONBOARDING];
  if (params.employeeId) filtered = filtered.filter(t => t.employeeId === params.employeeId);
  if (params.status) filtered = filtered.filter(t => t.status === params.status);
  if (params.category) filtered = filtered.filter(t => t.category === params.category);
  return NextResponse.json({
    data: filtered,
    pagination: { page: params.page, limit: params.limit, total: filtered.length, totalPages: Math.ceil(filtered.length / params.limit) },
  });
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const employeeId = url.searchParams.get('employeeId');
  const status = url.searchParams.get('status');
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
    if (category) where.category = category;
    if (companyId) where.employee = { companyId };

    const [tasks, total] = await Promise.all([
      db.onboardingTask.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          employee: {
            select: {
              id: true, firstName: true, lastName: true,
              employeeId: true, avatar: true,
              department: { select: { name: true } },
            },
          },
        },
      }),
      db.onboardingTask.count({ where }),
    ]);

    // If DB has real data, return it
    if (tasks.length > 0 || total > 0) {
      return NextResponse.json({
        data: tasks,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      });
    }
  } catch (error) {
    console.error('Onboarding GET error, using demo data:', error);
  }

  // Demo data fallback (when DB is empty or unavailable)
  return filterDemoOnboarding({ employeeId, status, category, page, limit });
}

export async function POST(req: NextRequest) {
  try {
    const { db } = await import('@/lib/db');
    const body = await req.json();
    const { title, description, category, status, dueDate, assignedTo, employeeId } = body;

    if (!title || !employeeId) {
      return NextResponse.json(
        { error: 'Missing required fields: title, employeeId' },
        { status: 400 }
      );
    }

    const task = await db.onboardingTask.create({
      data: {
        title, description,
        category: category || 'general',
        status: status || 'pending',
        dueDate: dueDate ? new Date(dueDate) : null,
        assignedTo, employeeId,
      },
      include: {
        employee: { select: { firstName: true, lastName: true } },
      },
    });

    await db.auditLog.create({
      data: {
        action: 'CREATE',
        entity: 'OnboardingTask',
        entityId: task.id,
        userId: body.createdBy,
        details: `Onboarding task created: ${title}`,
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Onboarding POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { db } = await import('@/lib/db');
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    const existing = await db.onboardingTask.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Onboarding task not found' }, { status: 404 });
    }

    if (updateData.dueDate) {
      updateData.dueDate = new Date(updateData.dueDate);
    }

    // Auto-set completedAt if status changes to completed
    if (updateData.status === 'completed' && !updateData.completedAt) {
      updateData.completedAt = new Date();
    }

    const task = await db.onboardingTask.update({
      where: { id },
      data: updateData,
      include: {
        employee: { select: { firstName: true, lastName: true } },
      },
    });

    await db.auditLog.create({
      data: {
        action: 'UPDATE',
        entity: 'OnboardingTask',
        entityId: id,
        userId: body.updatedBy,
        details: `Onboarding task updated: ${existing.title}`,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Onboarding PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
