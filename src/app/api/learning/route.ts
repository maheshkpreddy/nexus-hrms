import { NextRequest, NextResponse } from 'next/server';
import { DEMO_LEARNING } from '@/lib/demo-data';

function filterDemoLearning(params: { employeeId?: string | null; status?: string | null; type?: string | null; page: number; limit: number }) {
  let filtered = [...DEMO_LEARNING];
  if (params.employeeId) filtered = filtered.filter(r => r.employeeId === params.employeeId);
  if (params.status) filtered = filtered.filter(r => r.status === params.status);
  if (params.type) filtered = filtered.filter(r => r.type === params.type);
  return NextResponse.json({
    data: filtered,
    pagination: { page: params.page, limit: params.limit, total: filtered.length, totalPages: Math.ceil(filtered.length / params.limit) },
  });
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const employeeId = url.searchParams.get('employeeId');
  const status = url.searchParams.get('status');
  const type = url.searchParams.get('type');
  const companyId = url.searchParams.get('companyId');
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '20');

  try {
    const { db } = await import('@/lib/db');
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (employeeId) where.employeeId = employeeId;
    if (status) where.status = status;
    if (type) where.type = type;
    if (companyId) where.employee = { companyId };

    const [records, total] = await Promise.all([
      db.learningRecord.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          employee: {
            select: {
              id: true, firstName: true, lastName: true,
              employeeId: true,
              department: { select: { name: true } },
            },
          },
        },
      }),
      db.learningRecord.count({ where }),
    ]);

    // If DB has real data, return it
    if (records.length > 0 || total > 0) {
      return NextResponse.json({
        data: records,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      });
    }
  } catch (error) {
    console.error('Learning GET error, using demo data:', error);
  }

  // Demo data fallback (when DB is empty or unavailable)
  return filterDemoLearning({ employeeId, status, type, page, limit });
}

export async function POST(req: NextRequest) {
  try {
    const { db } = await import('@/lib/db');
    const body = await req.json();
    const { courseName, provider, type, status, completedAt, score, certificate, employeeId } = body;

    if (!courseName || !employeeId) {
      return NextResponse.json(
        { error: 'Missing required fields: courseName, employeeId' },
        { status: 400 }
      );
    }

    const record = await db.learningRecord.create({
      data: {
        courseName, provider,
        type: type || 'e_learning',
        status: status || 'enrolled',
        completedAt: completedAt ? new Date(completedAt) : null,
        score, certificate, employeeId,
      },
      include: {
        employee: { select: { firstName: true, lastName: true } },
      },
    });

    await db.auditLog.create({
      data: {
        action: 'CREATE',
        entity: 'LearningRecord',
        entityId: record.id,
        userId: body.createdBy,
        details: `Enrolled in course: ${courseName}`,
      },
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error('Learning POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { db } = await import('@/lib/db');
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Learning record ID is required' }, { status: 400 });
    }

    const existing = await db.learningRecord.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Learning record not found' }, { status: 404 });
    }

    if (updateData.completedAt) {
      updateData.completedAt = new Date(updateData.completedAt);
    }

    // Auto-set completedAt if status changes to completed
    if (updateData.status === 'completed' && !updateData.completedAt) {
      updateData.completedAt = new Date();
    }

    const record = await db.learningRecord.update({
      where: { id },
      data: updateData,
      include: {
        employee: { select: { firstName: true, lastName: true } },
      },
    });

    await db.auditLog.create({
      data: {
        action: 'UPDATE',
        entity: 'LearningRecord',
        entityId: id,
        userId: body.updatedBy,
        details: `Updated learning record: ${existing.courseName}`,
      },
    });

    return NextResponse.json(record);
  } catch (error) {
    console.error('Learning PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
