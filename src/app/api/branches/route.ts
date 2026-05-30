import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { DEMO_BRANCHES } from '@/lib/demo-data';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const companyId = url.searchParams.get('companyId');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '100');

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

    return NextResponse.json({
      data: branches,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Branches GET error:', error);
    // Fallback to DEMO_BRANCHES from demo-data.ts
    const url = new URL(req.url);
    const companyId = url.searchParams.get('companyId');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '100');

    let filtered = [...DEMO_BRANCHES];
    if (companyId) filtered = filtered.filter(b => b.companyId === companyId);

    return NextResponse.json({
      data: filtered,
      pagination: { page, limit, total: filtered.length, totalPages: Math.ceil(filtered.length / limit) },
    });
  }
}
