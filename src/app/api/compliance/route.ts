import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { DEMO_COMPLIANCE } from '@/lib/demo-data';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const companyId = url.searchParams.get('companyId');
    const status = url.searchParams.get('status');
    const category = url.searchParams.get('category');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (companyId) where.companyId = companyId;
    if (status) where.status = status;
    if (category) where.category = category;

    const [items, total] = await Promise.all([
      db.complianceItem.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      db.complianceItem.count({ where }),
    ]);

    // Compute overdue count
    const overdueCount = await db.complianceItem.count({
      where: {
        ...where,
        status: 'pending',
        dueDate: { lt: new Date() },
      },
    });

    // If DB returns empty, use demo data fallback
    if (items.length === 0 && total === 0) {
      let filtered = [...DEMO_COMPLIANCE];
      if (companyId) filtered = filtered.filter(i => i.companyId === companyId);
      if (status) filtered = filtered.filter(i => i.status === status);
      if (category) filtered = filtered.filter(i => i.category === category);

      const demoOverdueCount = filtered.filter(i => i.status === 'pending' && i.dueDate && new Date(i.dueDate) < new Date()).length;
      return NextResponse.json({
        data: filtered,
        overdueCount: demoOverdueCount,
        pagination: { page, limit, total: filtered.length, totalPages: Math.ceil(filtered.length / limit) },
      });
    }

    return NextResponse.json({
      data: items,
      overdueCount,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Compliance GET error:', error);
    // Fallback to DEMO_COMPLIANCE from demo-data.ts
    const url = new URL(req.url);
    const companyId = url.searchParams.get('companyId');
    const status = url.searchParams.get('status');
    const category = url.searchParams.get('category');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');

    let filtered = [...DEMO_COMPLIANCE];
    if (companyId) filtered = filtered.filter(i => i.companyId === companyId);
    if (status) filtered = filtered.filter(i => i.status === status);
    if (category) filtered = filtered.filter(i => i.category === category);

    const overdueCount = filtered.filter(i => i.status === 'pending' && i.dueDate && new Date(i.dueDate) < new Date()).length;

    return NextResponse.json({
      data: filtered,
      overdueCount,
      pagination: { page, limit, total: filtered.length, totalPages: Math.ceil(filtered.length / limit) },
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, category, dueDate, status, assignee, companyId } = body;

    if (!title || !category || !companyId) {
      return NextResponse.json(
        { error: 'Missing required fields: title, category, companyId' },
        { status: 400 }
      );
    }

    const item = await db.complianceItem.create({
      data: {
        title, description, category,
        dueDate: dueDate ? new Date(dueDate) : null,
        status: status || 'pending',
        assignee, companyId,
      },
    });

    await db.auditLog.create({
      data: {
        action: 'CREATE',
        entity: 'ComplianceItem',
        entityId: item.id,
        userId: body.createdBy,
        details: `Compliance item created: ${title}`,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Compliance POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Compliance item ID is required' }, { status: 400 });
    }

    const existing = await db.complianceItem.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Compliance item not found' }, { status: 404 });
    }

    if (updateData.dueDate) {
      updateData.dueDate = new Date(updateData.dueDate);
    }

    const item = await db.complianceItem.update({
      where: { id },
      data: updateData,
    });

    await db.auditLog.create({
      data: {
        action: 'UPDATE',
        entity: 'ComplianceItem',
        entityId: id,
        userId: body.updatedBy,
        details: `Compliance item updated: ${existing.title}`,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error('Compliance PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
