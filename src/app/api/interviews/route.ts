import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const candidateId = url.searchParams.get('candidateId');
    const jobId = url.searchParams.get('jobId');
    const type = url.searchParams.get('type');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (candidateId) where.candidateId = candidateId;
    if (jobId) where.jobId = jobId;
    if (status) where.status = status;
    if (type) where.type = type;

    const [interviews, total] = await Promise.all([
      db.interview.findMany({
        where,
        skip,
        take: limit,
        orderBy: { scheduledAt: 'asc' },
        include: {
          candidate: { select: { id: true, firstName: true, lastName: true, email: true } },
          job: { select: { id: true, title: true, department: true } },
        },
      }),
      db.interview.count({ where }),
    ]);

    return NextResponse.json({
      data: interviews,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Interviews GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      type, scheduledAt, duration, status, feedback, rating,
      meetingLink, aiTranscript, candidateId, jobId,
    } = body;

    if (!scheduledAt || !candidateId || !jobId) {
      return NextResponse.json(
        { error: 'Missing required fields: scheduledAt, candidateId, jobId' },
        { status: 400 }
      );
    }

    const interview = await db.interview.create({
      data: {
        type: type || 'technical',
        scheduledAt: new Date(scheduledAt),
        duration,
        status: status || 'scheduled',
        feedback, rating, meetingLink, aiTranscript,
        candidateId, jobId,
      },
      include: {
        candidate: true,
        job: true,
      },
    });

    await db.auditLog.create({
      data: {
        action: 'CREATE',
        entity: 'Interview',
        entityId: interview.id,
        userId: body.createdBy,
        details: `Scheduled interview for candidate`,
      },
    });

    return NextResponse.json(interview, { status: 201 });
  } catch (error) {
    console.error('Interviews POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Interview ID is required' }, { status: 400 });
    }

    const existing = await db.interview.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }

    if (updateData.scheduledAt) {
      updateData.scheduledAt = new Date(updateData.scheduledAt);
    }

    const interview = await db.interview.update({
      where: { id },
      data: updateData,
      include: { candidate: true, job: true },
    });

    await db.auditLog.create({
      data: {
        action: 'UPDATE',
        entity: 'Interview',
        entityId: id,
        userId: body.updatedBy,
        details: `Updated interview`,
      },
    });

    return NextResponse.json(interview);
  } catch (error) {
    console.error('Interviews PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
