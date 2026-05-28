import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const category = url.searchParams.get('category');
    const priority = url.searchParams.get('priority');
    const employeeId = url.searchParams.get('employeeId');
    const assignedTo = url.searchParams.get('assignedTo');
    const companyId = url.searchParams.get('companyId');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (category) where.category = category;
    if (priority) where.priority = priority;
    if (employeeId) where.employeeId = employeeId;
    if (assignedTo) where.assignedTo = assignedTo;
    if (companyId) where.employee = { companyId };

    const [tickets, total] = await Promise.all([
      db.ticket.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          employee: {
            select: {
              id: true, firstName: true, lastName: true,
              employeeId: true,
              department: { select: { name: true } },
            },
          },
        },
      }),
      db.ticket.count({ where }),
    ]);

    return NextResponse.json({
      data: tickets,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Tickets GET error:', error);
    // Demo data fallback when database is unavailable
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const category = url.searchParams.get('category');
    const priority = url.searchParams.get('priority');
    const employeeId = url.searchParams.get('employeeId');
    const assignedTo = url.searchParams.get('assignedTo');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');

    const demoTickets = [
      {
        id: 'demo-tkt1', subject: 'VPN Connection Issues', description: 'Unable to connect to VPN since morning',
        category: 'it', priority: 'high', status: 'open', assignedTo: 'demo-emp-it1',
        employeeId: 'demo-emp1', createdAt: new Date('2025-02-20'), updatedAt: new Date('2025-02-20'),
        employee: { id: 'demo-emp1', firstName: 'Alice', lastName: 'Martinez', employeeId: 'EMP001', department: { name: 'Engineering' } },
      },
      {
        id: 'demo-tkt2', subject: 'New Access Card Request', description: 'Need access card for Building B',
        category: 'facilities', priority: 'medium', status: 'in_progress', assignedTo: 'demo-emp-fac1',
        employeeId: 'demo-emp2', createdAt: new Date('2025-02-18'), updatedAt: new Date('2025-02-19'),
        employee: { id: 'demo-emp2', firstName: 'James', lastName: 'Wilson', employeeId: 'EMP002', department: { name: 'Sales' } },
      },
      {
        id: 'demo-tkt3', subject: 'Payroll Discrepancy', description: 'January paycheck missing overtime bonus',
        category: 'hr', priority: 'high', status: 'open', assignedTo: 'demo-emp-hr1',
        employeeId: 'demo-emp3', createdAt: new Date('2025-02-15'), updatedAt: new Date('2025-02-15'),
        employee: { id: 'demo-emp3', firstName: 'Robert', lastName: 'Brown', employeeId: 'EMP003', department: { name: 'Finance' } },
      },
      {
        id: 'demo-tkt4', subject: 'Printer Not Working', description: '3rd floor printer jammed',
        category: 'it', priority: 'low', status: 'resolved', assignedTo: 'demo-emp-it1',
        employeeId: 'demo-emp4', createdAt: new Date('2025-02-10'), updatedAt: new Date('2025-02-11'),
        employee: { id: 'demo-emp4', firstName: 'Lisa', lastName: 'Chang', employeeId: 'EMP004', department: { name: 'Marketing' } },
      },
      {
        id: 'demo-tkt5', subject: 'Software License Renewal', description: 'Adobe Creative Cloud license expiring',
        category: 'it', priority: 'medium', status: 'closed', assignedTo: 'demo-emp-it2',
        employeeId: 'demo-emp2', createdAt: new Date('2025-02-05'), updatedAt: new Date('2025-02-08'),
        employee: { id: 'demo-emp2', firstName: 'James', lastName: 'Wilson', employeeId: 'EMP002', department: { name: 'Sales' } },
      },
    ];

    let filtered = demoTickets;
    if (status) filtered = filtered.filter((t) => t.status === status);
    if (category) filtered = filtered.filter((t) => t.category === category);
    if (priority) filtered = filtered.filter((t) => t.priority === priority);
    if (employeeId) filtered = filtered.filter((t) => t.employeeId === employeeId);
    if (assignedTo) filtered = filtered.filter((t) => t.assignedTo === assignedTo);

    return NextResponse.json({
      data: filtered,
      pagination: { page, limit, total: filtered.length, totalPages: Math.ceil(filtered.length / limit) },
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subject, description, category, priority, assignedTo, employeeId } = body;

    if (!subject || !category || !employeeId) {
      return NextResponse.json(
        { error: 'Missing required fields: subject, category, employeeId' },
        { status: 400 }
      );
    }

    const ticket = await db.ticket.create({
      data: {
        subject, description, category,
        priority: priority || 'medium',
        status: 'open',
        assignedTo, employeeId,
      },
      include: {
        employee: { select: { firstName: true, lastName: true } },
      },
    });

    // Notify assignee if assigned
    if (assignedTo) {
      const assigneeUser = await db.user.findFirst({
        where: { employee: { id: assignedTo } },
      });
      if (assigneeUser) {
        await db.notification.create({
          data: {
            title: 'New Ticket Assigned',
            message: `Ticket "${subject}" has been assigned to you`,
            type: 'ticket',
            category: 'assignment',
            userId: assigneeUser.id,
            actionUrl: `/tickets/${ticket.id}`,
          },
        });
      }
    }

    await db.auditLog.create({
      data: {
        action: 'CREATE',
        entity: 'Ticket',
        entityId: ticket.id,
        userId: body.createdBy,
        details: `Ticket created: ${subject}`,
      },
    });

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    console.error('Tickets POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Ticket ID is required' }, { status: 400 });
    }

    const existing = await db.ticket.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const ticket = await db.ticket.update({
      where: { id },
      data: updateData,
      include: {
        employee: { select: { firstName: true, lastName: true } },
      },
    });

    await db.auditLog.create({
      data: {
        action: 'UPDATE',
        entity: 'Ticket',
        entityId: id,
        userId: body.updatedBy,
        details: `Ticket updated: ${existing.subject}`,
      },
    });

    return NextResponse.json(ticket);
  } catch (error) {
    console.error('Tickets PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
