import { NextRequest, NextResponse } from 'next/server';
import { DEMO_AUDIT_LOGS } from '@/lib/demo-data';

function filterDemoAuditLogs(params: { userId?: string | null; action?: string | null; entity?: string | null; page: number; limit: number }) {
  let filtered = [...DEMO_AUDIT_LOGS];
  if (params.userId) filtered = filtered.filter(l => l.userId === params.userId);
  if (params.action) filtered = filtered.filter(l => l.action === params.action);
  if (params.entity) filtered = filtered.filter(l => l.entity === params.entity);

  // Build summary from filtered data
  const byAction: Record<string, number> = {};
  const byEntity: Record<string, number> = {};
  for (const log of filtered) {
    byAction[log.action] = (byAction[log.action] || 0) + 1;
    byEntity[log.entity] = (byEntity[log.entity] || 0) + 1;
  }

  return NextResponse.json({
    data: filtered,
    pagination: { page: params.page, limit: params.limit, total: filtered.length, totalPages: Math.ceil(filtered.length / params.limit) },
    summary: {
      byAction: Object.entries(byAction).map(([a, count]) => ({ action: a, count })),
      byEntity: Object.entries(byEntity).map(([e, count]) => ({ entity: e, count })),
    },
  });
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const userId = url.searchParams.get('userId');
  const action = url.searchParams.get('action');
  const entity = url.searchParams.get('entity');
  const entityId = url.searchParams.get('entityId');
  const startDate = url.searchParams.get('startDate');
  const endDate = url.searchParams.get('endDate');
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '20');

  try {
    const { db } = await import('@/lib/db');
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (userId) where.userId = userId;
    if (action) where.action = action;
    if (entity) where.entity = entity;
    if (entityId) where.entityId = entityId;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) (where.createdAt as Record<string, unknown>).gte = new Date(startDate);
      if (endDate) (where.createdAt as Record<string, unknown>).lte = new Date(endDate);
    }

    const [logs, total] = await Promise.all([
      db.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, name: true, email: true, avatar: true },
          },
        },
      }),
      db.auditLog.count({ where }),
    ]);

    // Action type summary
    const actionSummary = await db.auditLog.groupBy({
      by: ['action'],
      where,
      _count: { id: true },
    });

    // Entity type summary
    const entitySummary = await db.auditLog.groupBy({
      by: ['entity'],
      where,
      _count: { id: true },
    });

    // If DB has real data, return it
    if (logs.length > 0 || total > 0) {
      return NextResponse.json({
        data: logs,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        summary: {
          byAction: actionSummary.map((a) => ({ action: a.action, count: a._count.id })),
          byEntity: entitySummary.map((e) => ({ entity: e.entity, count: e._count.id })),
        },
      });
    }
  } catch (error) {
    console.error('Audit GET error, using demo data:', error);
  }

  // Demo data fallback (when DB is empty or unavailable)
  return filterDemoAuditLogs({ userId, action, entity, page, limit });
}

export async function POST(req: NextRequest) {
  try {
    const { db } = await import('@/lib/db');
    const body = await req.json();
    const { action, entity, entityId, details, userId, ipAddress } = body;

    if (!action || !entity) {
      return NextResponse.json(
        { error: 'Missing required fields: action, entity' },
        { status: 400 }
      );
    }

    const log = await db.auditLog.create({
      data: {
        action,
        entity,
        entityId,
        details,
        userId,
        ipAddress,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    console.error('Audit POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
