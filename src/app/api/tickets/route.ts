import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { DEMO_TICKETS } from '@/lib/demo-data';

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

    // If DB returns empty, use demo data fallback
    if (tickets.length === 0 && total === 0) {
      let filtered = [...DEMO_TICKETS];
      if (status) filtered = filtered.filter(t => t.status === status);
      if (category) filtered = filtered.filter(t => t.category === category);
      if (priority) filtered = filtered.filter(t => t.priority === priority);
      if (employeeId) filtered = filtered.filter(t => t.employeeId === employeeId);
      return NextResponse.json({
        data: filtered,
        pagination: { page, limit, total: filtered.length, totalPages: Math.ceil(filtered.length / limit) },
      });
    }

    return NextResponse.json({
      data: tickets,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Tickets GET error:', error);
    // Fallback to DEMO_TICKETS from demo-data.ts
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const category = url.searchParams.get('category');
    const priority = url.searchParams.get('priority');
    const employeeId = url.searchParams.get('employeeId');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');

    let filtered = [...DEMO_TICKETS];
    if (status) filtered = filtered.filter(t => t.status === status);
    if (category) filtered = filtered.filter(t => t.category === category);
    if (priority) filtered = filtered.filter(t => t.priority === priority);
    if (employeeId) filtered = filtered.filter(t => t.employeeId === employeeId);

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
