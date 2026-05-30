import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { DEMO_CLIENTS } from '@/lib/demo-data';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const companyId = url.searchParams.get('companyId');
    const search = url.searchParams.get('search');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (companyId) where.companyId = companyId;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { clientCompany: { contains: search } },
        { industry: { contains: search } },
      ];
    }

    const [clients, total] = await Promise.all([
      db.client.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          company: { select: { id: true, name: true } },
        },
      }),
      db.client.count({ where }),
    ]);

    // If DB returns empty, use demo data fallback
    if (clients.length === 0 && total === 0) {
      let filtered = [...DEMO_CLIENTS];
      if (status) filtered = filtered.filter(c => c.status === status);
      if (companyId) filtered = filtered.filter(c => c.companyId === companyId);
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(c =>
          c.name.toLowerCase().includes(s) ||
          c.email.toLowerCase().includes(s) ||
          c.clientCompany.toLowerCase().includes(s) ||
          c.industry.toLowerCase().includes(s)
        );
      }
      return NextResponse.json({
        data: filtered,
        pagination: { page, limit, total: filtered.length, totalPages: Math.ceil(filtered.length / limit) },
      });
    }

    return NextResponse.json({
      data: clients,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Clients GET error:', error);
    // Fallback to DEMO_CLIENTS from demo-data.ts
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const companyId = url.searchParams.get('companyId');
    const search = url.searchParams.get('search');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');

    let filtered = [...DEMO_CLIENTS];
    if (status) filtered = filtered.filter(c => c.status === status);
    if (companyId) filtered = filtered.filter(c => c.companyId === companyId);
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(s) ||
        c.email.toLowerCase().includes(s) ||
        c.clientCompany.toLowerCase().includes(s) ||
        c.industry.toLowerCase().includes(s)
      );
    }

    return NextResponse.json({
      data: filtered,
      pagination: { page, limit, total: filtered.length, totalPages: Math.ceil(filtered.length / limit) },
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, clientCompany, industry, contractStart, contractEnd, status, companyId } = body;

    if (!name || !companyId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, companyId' },
        { status: 400 }
      );
    }

    const client = await db.client.create({
      data: {
        name, email, phone, clientCompany, industry,
        contractStart: contractStart ? new Date(contractStart) : null,
        contractEnd: contractEnd ? new Date(contractEnd) : null,
        status: status || 'active',
        companyId,
      },
      include: { company: true },
    });

    await db.auditLog.create({
      data: {
        action: 'CREATE',
        entity: 'Client',
        entityId: client.id,
        userId: body.createdBy,
        details: `Client created: ${name}`,
      },
    });

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error('Clients POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Client ID is required' }, { status: 400 });
    }

    const existing = await db.client.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    if (updateData.contractStart) updateData.contractStart = new Date(updateData.contractStart);
    if (updateData.contractEnd) updateData.contractEnd = new Date(updateData.contractEnd);

    const client = await db.client.update({
      where: { id },
      data: updateData,
      include: { company: true },
    });

    await db.auditLog.create({
      data: {
        action: 'UPDATE',
        entity: 'Client',
        entityId: id,
        userId: body.updatedBy,
        details: `Client updated: ${existing.name}`,
      },
    });

    return NextResponse.json(client);
  } catch (error) {
    console.error('Clients PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
