import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

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
    // Demo data fallback when database is unavailable
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const jobId = url.searchParams.get('jobId');
    const search = url.searchParams.get('search');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');

    const demoCandidates = [
      {
        id: 'demo-c1', firstName: 'Sarah', lastName: 'Chen', email: 'sarah.chen@example.com',
        phone: '+1-555-0101', resume: null, currentCompany: 'TechCorp', currentTitle: 'Senior Developer',
        experience: 8, expectedSalary: 150000, noticePeriod: 30, status: 'interviewed',
        source: 'linkedin', aiScore: 92, skillMatch: 88, cultureFitScore: 85, notes: 'Strong technical skills',
        jobId: 'demo-job-1', createdAt: new Date('2025-01-10'), updatedAt: new Date('2025-01-15'),
        job: { id: 'demo-job-1', title: 'Senior Frontend Developer', department: 'Engineering' },
        _count: { interviews: 2 },
      },
      {
        id: 'demo-c2', firstName: 'Michael', lastName: 'Rivera', email: 'michael.r@example.com',
        phone: '+1-555-0102', resume: null, currentCompany: 'DataSoft', currentTitle: 'Backend Engineer',
        experience: 5, expectedSalary: 120000, noticePeriod: 15, status: 'applied',
        source: 'referral', aiScore: 78, skillMatch: 82, cultureFitScore: 70, notes: 'Good potential',
        jobId: 'demo-job-2', createdAt: new Date('2025-01-12'), updatedAt: new Date('2025-01-12'),
        job: { id: 'demo-job-2', title: 'Backend Engineer', department: 'Engineering' },
        _count: { interviews: 0 },
      },
      {
        id: 'demo-c3', firstName: 'Emily', lastName: 'Johnson', email: 'emily.j@example.com',
        phone: '+1-555-0103', resume: null, currentCompany: 'CloudNine', currentTitle: 'Product Manager',
        experience: 10, expectedSalary: 180000, noticePeriod: 60, status: 'offered',
        source: 'headhunter', aiScore: 95, skillMatch: 91, cultureFitScore: 93, notes: 'Excellent fit',
        jobId: 'demo-job-1', createdAt: new Date('2025-01-05'), updatedAt: new Date('2025-01-20'),
        job: { id: 'demo-job-1', title: 'Senior Frontend Developer', department: 'Engineering' },
        _count: { interviews: 3 },
      },
      {
        id: 'demo-c4', firstName: 'David', lastName: 'Kim', email: 'david.kim@example.com',
        phone: '+1-555-0104', resume: null, currentCompany: 'FinTech Inc', currentTitle: 'DevOps Lead',
        experience: 7, expectedSalary: 140000, noticePeriod: 30, status: 'shortlisted',
        source: 'website', aiScore: 85, skillMatch: 80, cultureFitScore: 78, notes: 'Strong DevOps background',
        jobId: 'demo-job-3', createdAt: new Date('2025-01-14'), updatedAt: new Date('2025-01-18'),
        job: { id: 'demo-job-3', title: 'DevOps Engineer', department: 'Infrastructure' },
        _count: { interviews: 1 },
      },
    ];

    let filtered = demoCandidates;
    if (status) filtered = filtered.filter((c) => c.status === status);
    if (jobId) filtered = filtered.filter((c) => c.jobId === jobId);
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter((c) =>
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
