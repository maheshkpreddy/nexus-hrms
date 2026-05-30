import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { DEMO_DEPARTMENTS } from '@/lib/demo-data';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const companyId = url.searchParams.get('companyId');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '100');

    const where: Record<string, unknown> = { isActive: true };
    if (companyId) where.companyId = companyId;

    const departments = await db.department.findMany({
      where,
      orderBy: { name: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        code: true,
        description: true,
        isActive: true,
        companyId: true,
      },
    });

    const total = await db.department.count({ where });

    return NextResponse.json({
      data: departments,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Departments GET error:', error);
    // Fallback to DEMO_DEPARTMENTS from demo-data.ts
    const url = new URL(req.url);
    const companyId = url.searchParams.get('companyId');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '100');

    let filtered = [...DEMO_DEPARTMENTS];
    if (companyId) filtered = filtered.filter(d => d.companyId === companyId);

    return NextResponse.json({
      data: filtered,
      pagination: { page, limit, total: filtered.length, totalPages: Math.ceil(filtered.length / limit) },
    });
  }
}
