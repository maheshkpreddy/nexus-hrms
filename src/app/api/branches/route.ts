import { NextRequest, NextResponse } from 'next/server';
import { DEMO_BRANCHES } from '@/lib/demo-data';

function filterDemoBranches(params: { companyId?: string | null; page: number; limit: number }) {
  let filtered = [...DEMO_BRANCHES];
  if (params.companyId) filtered = filtered.filter(b => b.companyId === params.companyId);
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

    const branches = await db.branch.findMany({
      where,
      orderBy: { name: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        code: true,
        city: true,
        country: true,
        isActive: true,
        companyId: true,
      },
    });

    const total = await db.branch.count({ where });

    // If DB has real data, return it
    if (branches.length > 0 || total > 0) {
      return NextResponse.json({
        data: branches,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      });
    }
  } catch (error) {
    console.error('Branches GET error, using demo data:', error);
  }

  // Demo data fallback (when DB is empty or unavailable)
  return filterDemoBranches({ companyId, page, limit });
}
