import { NextRequest, NextResponse } from 'next/server';
import { DEMO_COMPANIES } from '@/lib/demo-data';

function filterDemoCompanies(params: { isActive?: string | null; search?: string | null; page: number; limit: number }) {
  let filtered = [...DEMO_COMPANIES];
  if (params.isActive !== null && params.isActive !== undefined) {
    filtered = filtered.filter(c => c.isActive === (params.isActive === 'true'));
  }
  if (params.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(c => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || (c.industry || '').toLowerCase().includes(q));
  }
  return NextResponse.json({
    data: filtered,
    pagination: { page: params.page, limit: params.limit, total: filtered.length, totalPages: Math.ceil(filtered.length / params.limit) },
  });
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const isActive = url.searchParams.get('isActive');
  const search = url.searchParams.get('search');
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '20');

  try {
    const { db } = await import('@/lib/db');
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === 'true';
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { code: { contains: search } },
        { industry: { contains: search } },
        { domain: { contains: search } },
      ];
    }

    const [companies, total] = await Promise.all([
      db.company.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { employees: true, departments: true, branches: true },
          },
          parent: { select: { id: true, name: true } },
        },
      }),
      db.company.count({ where }),
    ]);

    // If DB has real data, return it
    if (companies.length > 0 || total > 0) {
      return NextResponse.json({
        data: companies,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      });
    }
  } catch (error) {
    console.error('Companies GET error, using demo data:', error);
  }

  // Demo data fallback (when DB is empty or unavailable)
  return filterDemoCompanies({ isActive, search, page, limit });
}

export async function POST(req: NextRequest) {
  try {
    const { db } = await import('@/lib/db');
    const body = await req.json();
    const { name, code, industry, logo, domain, country, currency, timezone, isActive, parentId } = body;

    if (!name || !code) {
      return NextResponse.json(
        { error: 'Missing required fields: name, code' },
        { status: 400 }
      );
    }

    // Check unique code
    const existing = await db.company.findUnique({ where: { code } });
    if (existing) {
      return NextResponse.json(
        { error: 'Company code already exists' },
        { status: 400 }
      );
    }

    const company = await db.company.create({
      data: {
        name, code, industry, logo, domain, country,
        currency: currency || 'USD',
        timezone: timezone || 'UTC',
        isActive: isActive !== undefined ? isActive : true,
        parentId,
      },
      include: {
        _count: { select: { employees: true, departments: true, branches: true } },
        parent: true,
      },
    });

    await db.auditLog.create({
      data: {
        action: 'CREATE',
        entity: 'Company',
        entityId: company.id,
        userId: body.createdBy,
        details: `Company created: ${name} (${code})`,
      },
    });

    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    console.error('Companies POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { db } = await import('@/lib/db');
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 });
    }

    const existing = await db.company.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    // Check code uniqueness if being updated
    if (updateData.code && updateData.code !== existing.code) {
      const codeExists = await db.company.findUnique({ where: { code: updateData.code } });
      if (codeExists) {
        return NextResponse.json(
          { error: 'Company code already exists' },
          { status: 400 }
        );
      }
    }

    const company = await db.company.update({
      where: { id },
      data: updateData,
      include: {
        _count: { select: { employees: true, departments: true, branches: true } },
        parent: true,
      },
    });

    await db.auditLog.create({
      data: {
        action: 'UPDATE',
        entity: 'Company',
        entityId: id,
        userId: body.updatedBy,
        details: `Company updated: ${existing.name}`,
      },
    });

    return NextResponse.json(company);
  } catch (error) {
    console.error('Companies PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
