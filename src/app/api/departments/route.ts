import { NextRequest, NextResponse } from 'next/server';
import { DEMO_DEPARTMENTS } from '@/lib/demo-data';

function filterDemoDepartments(params: { companyId?: string | null; page: number; limit: number }) {
  let filtered = [...DEMO_DEPARTMENTS];
  if (params.companyId) filtered = filtered.filter(d => d.companyId === params.companyId);
  return NextResponse.json({
    data: filtered,
    pagination: { page: params.page, limit: params.limit, total: filtered.length, totalPages: Math.ceil(filtered.length / params.limit) },
  });
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const companyId = url.searchParams.get('companyId');
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '100');

  try {
    const { db } = await import('@/lib/db');

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

    // If DB has real data, return it
    if (departments.length > 0 || total > 0) {
      return NextResponse.json({
        data: departments,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      });
    }
  } catch (error) {
    console.error('Departments GET error, using demo data:', error);
  }

  // Demo data fallback (when DB is empty or unavailable)
  return filterDemoDepartments({ companyId, page, limit });
}
