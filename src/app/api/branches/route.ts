import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

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

    return NextResponse.json(branches);
  } catch (error) {
    console.error('Branches GET error:', error);
    // Demo data fallback when database is unavailable
    return NextResponse.json([
      { id: 'branch-1', name: 'Hyderabad HQ', code: 'HYD', city: 'Hyderabad', country: 'India', isActive: true, companyId: companyId || 'comp-1' },
      { id: 'branch-2', name: 'Bangalore Office', code: 'BLR', city: 'Bangalore', country: 'India', isActive: true, companyId: companyId || 'comp-1' },
      { id: 'branch-3', name: 'Mumbai Branch', code: 'MUM', city: 'Mumbai', country: 'India', isActive: true, companyId: companyId || 'comp-1' },
      { id: 'branch-4', name: 'Delhi NCR Office', code: 'DEL', city: 'New Delhi', country: 'India', isActive: true, companyId: companyId || 'comp-1' },
    ]);
  }
}
