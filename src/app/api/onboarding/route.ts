import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

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
    // Demo data fallback when database is unavailable
    const url = new URL(req.url);
    const employeeId = url.searchParams.get('employeeId');
    const status = url.searchParams.get('status');
    const category = url.searchParams.get('category');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');

    const demoTasks = [
      {
        id: 'demo-ot1', title: 'Complete IT Setup', description: 'Set up laptop, email, and VPN access',
        category: 'it', status: 'completed', dueDate: new Date('2025-01-10'), assignedTo: 'IT Department',
        employeeId: 'demo-emp1', completedAt: new Date('2025-01-09'),
        createdAt: new Date('2025-01-05'), updatedAt: new Date('2025-01-09'),
        employee: { id: 'demo-emp1', firstName: 'Alice', lastName: 'Martinez', employeeId: 'EMP001', avatar: null, department: { name: 'Engineering' } },
      },
      {
        id: 'demo-ot2', title: 'HR Orientation', description: 'Attend HR orientation and complete paperwork',
        category: 'hr', status: 'in_progress', dueDate: new Date('2025-01-15'), assignedTo: 'HR Team',
        employeeId: 'demo-emp1', completedAt: null,
        createdAt: new Date('2025-01-05'), updatedAt: new Date('2025-01-08'),
        employee: { id: 'demo-emp1', firstName: 'Alice', lastName: 'Martinez', employeeId: 'EMP001', avatar: null, department: { name: 'Engineering' } },
      },
      {
        id: 'demo-ot3', title: 'Security Training', description: 'Complete mandatory security awareness training',
        category: 'compliance', status: 'pending', dueDate: new Date('2025-02-01'), assignedTo: 'Security Team',
        employeeId: 'demo-emp2', completedAt: null,
        createdAt: new Date('2025-01-15'), updatedAt: new Date('2025-01-15'),
        employee: { id: 'demo-emp2', firstName: 'James', lastName: 'Wilson', employeeId: 'EMP002', avatar: null, department: { name: 'Sales' } },
      },
      {
        id: 'demo-ot4', title: 'Team Introduction', description: 'Meet with team members and key stakeholders',
        category: 'general', status: 'pending', dueDate: new Date('2025-01-20'), assignedTo: 'Manager',
        employeeId: 'demo-emp2', completedAt: null,
        createdAt: new Date('2025-01-15'), updatedAt: new Date('2025-01-15'),
        employee: { id: 'demo-emp2', firstName: 'James', lastName: 'Wilson', employeeId: 'EMP002', avatar: null, department: { name: 'Sales' } },
      },
      {
        id: 'demo-ot5', title: 'Benefits Enrollment', description: 'Enroll in health and retirement benefits',
        category: 'hr', status: 'overdue', dueDate: new Date('2025-01-10'), assignedTo: 'HR Team',
        employeeId: 'demo-emp3', completedAt: null,
        createdAt: new Date('2025-01-02'), updatedAt: new Date('2025-01-02'),
        employee: { id: 'demo-emp3', firstName: 'Robert', lastName: 'Brown', employeeId: 'EMP003', avatar: null, department: { name: 'Finance' } },
      },
    ];

    let filtered = demoTasks;
    if (employeeId) filtered = filtered.filter((t) => t.employeeId === employeeId);
    if (status) filtered = filtered.filter((t) => t.status === status);
    if (category) filtered = filtered.filter((t) => t.category === category);

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
