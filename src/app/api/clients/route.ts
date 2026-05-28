import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

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

    return NextResponse.json({
      data: clients,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Clients GET error:', error);
    // Demo data fallback when database is unavailable
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const companyId = url.searchParams.get('companyId');
    const search = url.searchParams.get('search');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');

    const demoClients = [
      {
        id: 'cl-1', name: 'Acme Corp', email: 'contact@acme.in', phone: '+91-11-2345-6789',
        clientCompany: 'Acme Corporation India', industry: 'Technology',
        contractStart: new Date('2024-01-01'), contractEnd: new Date('2025-12-31'),
        status: 'active', companyId: companyId || 'comp-1',
        createdAt: new Date('2024-01-01'), updatedAt: new Date('2025-01-15'),
        company: { id: companyId || 'comp-1', name: 'Nexus Technologies' },
      },
      {
        id: 'cl-2', name: 'GlobalTech Industries', email: 'info@globaltech.in', phone: '+91-22-3456-7890',
        clientCompany: 'GlobalTech Industries India', industry: 'Manufacturing',
        contractStart: new Date('2024-06-01'), contractEnd: new Date('2025-05-31'),
        status: 'active', companyId: companyId || 'comp-1',
        createdAt: new Date('2024-06-01'), updatedAt: new Date('2024-12-10'),
        company: { id: companyId || 'comp-1', name: 'Nexus Technologies' },
      },
      {
        id: 'cl-3', name: 'Pinnacle Financial', email: 'hello@pinnacle.in', phone: '+91-80-4567-8901',
        clientCompany: 'Pinnacle Financial Group', industry: 'Finance',
        contractStart: new Date('2023-03-15'), contractEnd: new Date('2024-03-14'),
        status: 'expired', companyId: companyId || 'comp-1',
        createdAt: new Date('2023-03-15'), updatedAt: new Date('2024-03-15'),
        company: { id: companyId || 'comp-1', name: 'Nexus Technologies' },
      },
      {
        id: 'cl-4', name: 'MediCare Solutions', email: 'partners@medicare.in', phone: '+91-40-5678-9012',
        clientCompany: 'MediCare Solutions India', industry: 'Healthcare',
        contractStart: new Date('2025-01-01'), contractEnd: new Date('2026-12-31'),
        status: 'active', companyId: companyId || 'comp-1',
        createdAt: new Date('2025-01-01'), updatedAt: new Date('2025-01-01'),
        company: { id: companyId || 'comp-1', name: 'Nexus Technologies' },
      },
      {
        id: 'cl-5', name: 'RetailMax India', email: 'b2b@retailmax.in', phone: '+91-80-6789-0123',
        clientCompany: 'RetailMax India Pvt Ltd', industry: 'Retail',
        contractStart: new Date('2024-09-01'), contractEnd: new Date('2025-08-31'),
        status: 'active', companyId: companyId || 'comp-1',
        createdAt: new Date('2024-09-01'), updatedAt: new Date('2024-09-01'),
        company: { id: companyId || 'comp-1', name: 'Nexus Technologies' },
      },
      {
        id: 'cl-6', name: 'EduSpark Learning', email: 'tech@eduspark.in', phone: '+91-11-7890-1234',
        clientCompany: 'EduSpark Learning Pvt Ltd', industry: 'Education',
        contractStart: new Date('2025-02-01'), contractEnd: new Date('2026-01-31'),
        status: 'active', companyId: companyId || 'comp-1',
        createdAt: new Date('2025-02-01'), updatedAt: new Date('2025-02-01'),
        company: { id: companyId || 'comp-1', name: 'Nexus Technologies' },
      },
    ];

    let filtered = demoClients;
    if (status) filtered = filtered.filter((c) => c.status === status);
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter((c) =>
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
