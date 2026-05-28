import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const employeeId = url.searchParams.get('employeeId');
    const status = url.searchParams.get('status');
    const type = url.searchParams.get('type');
    const category = url.searchParams.get('category');
    const companyId = url.searchParams.get('companyId');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
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

    return NextResponse.json({
      data: goals,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Goals GET error:', error);
    // Demo data fallback when database is unavailable
    const url = new URL(req.url);
    const employeeId = url.searchParams.get('employeeId');
    const status = url.searchParams.get('status');
    const type = url.searchParams.get('type');
    const category = url.searchParams.get('category');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');

    const demoGoals = [
      {
        id: 'goal-1', title: 'Improve Code Quality', description: 'Reduce bug rate by 30% through code reviews and testing',
        type: 'individual', category: 'engineering', progress: 65, status: 'in_progress',
        startDate: new Date('2025-01-01'), endDate: new Date('2025-06-30'), employeeId: 'demo-1',
        createdAt: new Date('2025-01-01'), updatedAt: new Date('2025-02-15'),
        employee: { id: 'demo-1', firstName: 'Rajesh', lastName: 'Kumar', department: { name: 'Engineering' } },
      },
      {
        id: 'goal-2', title: 'Increase Sales Revenue', description: 'Achieve 20% growth in Q1 sales revenue',
        type: 'team', category: 'sales', progress: 40, status: 'in_progress',
        startDate: new Date('2025-01-01'), endDate: new Date('2025-03-31'), employeeId: 'demo-8',
        createdAt: new Date('2025-01-01'), updatedAt: new Date('2025-02-20'),
        employee: { id: 'demo-8', firstName: 'Deepa', lastName: 'Iyer', department: { name: 'Sales' } },
      },
      {
        id: 'goal-3', title: 'Complete AWS Certification', description: 'Obtain AWS Solutions Architect certification',
        type: 'individual', category: 'development', progress: 100, status: 'completed',
        startDate: new Date('2024-10-01'), endDate: new Date('2025-01-31'), employeeId: 'demo-1',
        createdAt: new Date('2024-10-01'), updatedAt: new Date('2025-01-28'),
        employee: { id: 'demo-1', firstName: 'Rajesh', lastName: 'Kumar', department: { name: 'Engineering' } },
      },
      {
        id: 'goal-4', title: 'Reduce Operating Costs', description: 'Cut departmental operating costs by 15%',
        type: 'department', category: 'finance', progress: 20, status: 'in_progress',
        startDate: new Date('2025-01-01'), endDate: new Date('2025-12-31'), employeeId: 'demo-10',
        createdAt: new Date('2025-01-01'), updatedAt: new Date('2025-02-01'),
        employee: { id: 'demo-10', firstName: 'Meera', lastName: 'Joshi', department: { name: 'Finance' } },
      },
      {
        id: 'goal-5', title: 'Launch Digital Marketing Campaign', description: 'Execute Q1 digital marketing campaign for product launch',
        type: 'team', category: 'marketing', progress: 0, status: 'not_started',
        startDate: new Date('2025-03-01'), endDate: new Date('2025-05-31'), employeeId: 'demo-6',
        createdAt: new Date('2025-02-01'), updatedAt: new Date('2025-02-01'),
        employee: { id: 'demo-6', firstName: 'Ananya', lastName: 'Gupta', department: { name: 'Marketing' } },
      },
      {
        id: 'goal-6', title: 'Improve Employee Satisfaction', description: 'Achieve 85% employee satisfaction score in Q1 survey',
        type: 'department', category: 'hr', progress: 50, status: 'in_progress',
        startDate: new Date('2025-01-01'), endDate: new Date('2025-03-31'), employeeId: 'demo-2',
        createdAt: new Date('2025-01-05'), updatedAt: new Date('2025-02-15'),
        employee: { id: 'demo-2', firstName: 'Priya', lastName: 'Sharma', department: { name: 'Human Resources' } },
      },
      {
        id: 'goal-7', title: 'Streamline Onboarding Process', description: 'Reduce onboarding time from 14 days to 7 days',
        type: 'team', category: 'operations', progress: 75, status: 'in_progress',
        startDate: new Date('2025-01-01'), endDate: new Date('2025-04-30'), employeeId: 'demo-9',
        createdAt: new Date('2025-01-10'), updatedAt: new Date('2025-03-01'),
        employee: { id: 'demo-9', firstName: 'Arjun', lastName: 'Menon', department: { name: 'Operations' } },
      },
    ];

    let filtered = demoGoals;
    if (employeeId) filtered = filtered.filter((g) => g.employeeId === employeeId);
    if (status) filtered = filtered.filter((g) => g.status === status);
    if (type) filtered = filtered.filter((g) => g.type === type);
    if (category) filtered = filtered.filter((g) => g.category === category);

    return NextResponse.json({
      data: filtered,
      pagination: { page, limit, total: filtered.length, totalPages: Math.ceil(filtered.length / limit) },
    });
  }
}

export async function POST(req: NextRequest) {
  try {
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
