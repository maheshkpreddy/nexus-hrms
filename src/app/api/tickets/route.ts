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
        id: 'tkt-1', subject: 'VPN Connection Issues', description: 'Unable to connect to VPN since morning',
        category: 'it', priority: 'high', status: 'open', assignedTo: 'demo-7',
        employeeId: 'demo-1', createdAt: new Date('2025-02-20'), updatedAt: new Date('2025-02-20'),
        employee: { id: 'demo-1', firstName: 'Rajesh', lastName: 'Kumar', employeeId: 'EMP001', department: { name: 'Engineering' } },
      },
      {
        id: 'tkt-2', subject: 'New Access Card Request', description: 'Need access card for Building B',
        category: 'facilities', priority: 'medium', status: 'in_progress', assignedTo: 'demo-9',
        employeeId: 'demo-8', createdAt: new Date('2025-02-18'), updatedAt: new Date('2025-02-19'),
        employee: { id: 'demo-8', firstName: 'Deepa', lastName: 'Iyer', employeeId: 'EMP008', department: { name: 'Sales' } },
      },
      {
        id: 'tkt-3', subject: 'Payroll Discrepancy', description: 'January paycheck missing overtime bonus',
        category: 'hr', priority: 'high', status: 'open', assignedTo: 'demo-2',
        employeeId: 'demo-10', createdAt: new Date('2025-02-15'), updatedAt: new Date('2025-02-15'),
        employee: { id: 'demo-10', firstName: 'Meera', lastName: 'Joshi', employeeId: 'EMP010', department: { name: 'Finance' } },
      },
      {
        id: 'tkt-4', subject: 'Printer Not Working', description: '3rd floor printer jammed',
        category: 'it', priority: 'low', status: 'resolved', assignedTo: 'demo-7',
        employeeId: 'demo-4', createdAt: new Date('2025-02-10'), updatedAt: new Date('2025-02-11'),
        employee: { id: 'demo-4', firstName: 'Sneha', lastName: 'Reddy', employeeId: 'EMP004', department: { name: 'Finance' } },
      },
      {
        id: 'tkt-5', subject: 'Software License Renewal', description: 'Adobe Creative Cloud license expiring',
        category: 'it', priority: 'medium', status: 'closed', assignedTo: 'demo-5',
        employeeId: 'demo-3', createdAt: new Date('2025-02-05'), updatedAt: new Date('2025-02-08'),
        employee: { id: 'demo-3', firstName: 'Amit', lastName: 'Patel', employeeId: 'EMP003', department: { name: 'Design' } },
      },
      {
        id: 'tkt-6', subject: 'Cabin Reassignment Request', description: 'Requesting move to quieter workspace for focused work',
        category: 'facilities', priority: 'low', status: 'open', assignedTo: 'demo-9',
        employeeId: 'demo-6', createdAt: new Date('2025-03-01'), updatedAt: new Date('2025-03-01'),
        employee: { id: 'demo-6', firstName: 'Ananya', lastName: 'Gupta', employeeId: 'EMP006', department: { name: 'Marketing' } },
      },
      {
        id: 'tkt-7', subject: 'Email Configuration Issue', description: 'Outlook not syncing with company calendar',
        category: 'it', priority: 'high', status: 'in_progress', assignedTo: 'demo-5',
        employeeId: 'demo-9', createdAt: new Date('2025-03-02'), updatedAt: new Date('2025-03-03'),
        employee: { id: 'demo-9', firstName: 'Arjun', lastName: 'Menon', employeeId: 'EMP009', department: { name: 'Operations' } },
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
