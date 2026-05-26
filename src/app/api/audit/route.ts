import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    const action = url.searchParams.get('action');
    const entity = url.searchParams.get('entity');
    const entityId = url.searchParams.get('entityId');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
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

    return NextResponse.json({
      data: logs,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      summary: {
        byAction: actionSummary.map((a) => ({ action: a.action, count: a._count.id })),
        byEntity: entitySummary.map((e) => ({ entity: e.entity, count: e._count.id })),
      },
    });
  } catch (error) {
    console.error('Audit GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
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
