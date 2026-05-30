import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { DEMO_ONBOARDING } from '@/lib/demo-data';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const employeeId = url.searchParams.get('employeeId');
    const status = url.searchParams.get('status');
    const category = url.searchParams.get('category');
    const companyId = url.searchParams.get('companyId');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
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

    return NextResponse.json({
      data: tasks,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Onboarding GET error:', error);
    // Fallback to DEMO_ONBOARDING from demo-data.ts
    const url = new URL(req.url);
    const employeeId = url.searchParams.get('employeeId');
    const status = url.searchParams.get('status');
    const category = url.searchParams.get('category');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');

    let filtered = [...DEMO_ONBOARDING];
    if (employeeId) filtered = filtered.filter(t => t.employeeId === employeeId);
    if (status) filtered = filtered.filter(t => t.status === status);
    if (category) filtered = filtered.filter(t => t.category === category);

    return NextResponse.json({
      data: filtered,
      pagination: { page, limit, total: filtered.length, totalPages: Math.ceil(filtered.length / limit) },
    });
  }
}

export async function POST(req: NextRequest) {
  try {
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
