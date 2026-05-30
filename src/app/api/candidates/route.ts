import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { DEMO_CANDIDATES } from '@/lib/demo-data';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const jobId = url.searchParams.get('jobId');
    const search = url.searchParams.get('search');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (jobId) where.jobId = jobId;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
        { currentCompany: { contains: search } },
      ];
    }

    const [candidates, total] = await Promise.all([
      db.candidate.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          job: { select: { id: true, title: true, department: true } },
          _count: { select: { interviews: true } },
        },
      }),
      db.candidate.count({ where }),
    ]);

    return NextResponse.json({
      data: candidates,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Candidates GET error:', error);
    // Fallback to DEMO_CANDIDATES from demo-data.ts
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const jobId = url.searchParams.get('jobId');
    const search = url.searchParams.get('search');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');

    let filtered = [...DEMO_CANDIDATES];
    if (status) filtered = filtered.filter(c => c.status === status);
    if (jobId) filtered = filtered.filter(c => c.jobId === jobId);
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(c =>
        c.firstName.toLowerCase().includes(s) ||
        c.lastName.toLowerCase().includes(s) ||
        c.email.toLowerCase().includes(s) ||
        c.currentCompany.toLowerCase().includes(s)
      );
    }

    return NextResponse.json({
      data: filtered,
      pagination: { page, limit, total: filtered.length, totalPages: Math.ceil(filtered.length / limit) },
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      firstName, lastName, email, phone, resume,
      currentCompany, currentTitle, experience, expectedSalary,
      noticePeriod, status, source, aiScore, skillMatch,
      cultureFitScore, notes, jobId,
    } = body;

    if (!firstName || !lastName || !email || !jobId) {
      return NextResponse.json(
        { error: 'Missing required fields: firstName, lastName, email, jobId' },
        { status: 400 }
      );
    }

    const candidate = await db.candidate.create({
      data: {
        firstName, lastName, email, phone, resume,
        currentCompany, currentTitle, experience, expectedSalary,
        noticePeriod, status: status || 'applied', source,
        aiScore, skillMatch, cultureFitScore, notes, jobId,
      },
      include: { job: true },
    });

    await db.auditLog.create({
      data: {
        action: 'CREATE',
        entity: 'Candidate',
        entityId: candidate.id,
        userId: body.createdBy,
        details: `Added candidate ${firstName} ${lastName} for job`,
      },
    });

    return NextResponse.json(candidate, { status: 201 });
  } catch (error) {
    console.error('Candidates POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Candidate ID is required' }, { status: 400 });
    }

    const existing = await db.candidate.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
    }

    const candidate = await db.candidate.update({
      where: { id },
      data: updateData,
      include: { job: true, _count: { select: { interviews: true } } },
    });

    await db.auditLog.create({
      data: {
        action: 'UPDATE',
        entity: 'Candidate',
        entityId: id,
        userId: body.updatedBy,
        details: `Updated candidate ${existing.firstName} ${existing.lastName}`,
      },
    });

    return NextResponse.json(candidate);
  } catch (error) {
    console.error('Candidates PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
