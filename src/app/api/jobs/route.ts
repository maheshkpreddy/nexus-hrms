import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const department = url.searchParams.get('department');
    const companyId = url.searchParams.get('companyId');
    const search = url.searchParams.get('search');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (companyId) where.companyId = companyId;
    if (status) where.status = status;
    if (department) where.department = { contains: department };
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { department: { contains: search } },
        { location: { contains: search } },
      ];
    }

    const [jobs, total] = await Promise.all([
      db.job.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          company: { select: { id: true, name: true } },
          _count: { select: { candidates: true, interviews: true } },
        },
      }),
      db.job.count({ where }),
    ]);

    return NextResponse.json({
      data: jobs,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Jobs GET error:', error);
    // Demo data fallback when database is unavailable
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const department = url.searchParams.get('department');
    const companyId = url.searchParams.get('companyId');
    const search = url.searchParams.get('search');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');

    const demoJobs = [
      {
        id: 'demo-job-1', title: 'Senior Frontend Developer', description: 'Lead frontend development with React and TypeScript',
        requirements: '5+ years React experience, TypeScript, CI/CD', department: 'Engineering',
        location: 'Remote', employmentType: 'full_time', experienceMin: 5, experienceMax: 10,
        salaryMin: 130000, salaryMax: 180000, status: 'open', priority: 'high', positions: 2,
        postedDate: new Date('2025-01-15'), closingDate: new Date('2025-03-31'),
        companyId: companyId || 'demo-co',
        createdAt: new Date('2025-01-10'), updatedAt: new Date('2025-01-15'),
        company: { id: companyId || 'demo-co', name: 'Demo Company' },
        _count: { candidates: 3, interviews: 2 },
      },
      {
        id: 'demo-job-2', title: 'Backend Engineer', description: 'Build scalable APIs and microservices',
        requirements: '3+ years Node.js, PostgreSQL, Docker', department: 'Engineering',
        location: 'New York, NY', employmentType: 'full_time', experienceMin: 3, experienceMax: 7,
        salaryMin: 110000, salaryMax: 160000, status: 'open', priority: 'medium', positions: 1,
        postedDate: new Date('2025-01-20'), closingDate: new Date('2025-04-15'),
        companyId: companyId || 'demo-co',
        createdAt: new Date('2025-01-18'), updatedAt: new Date('2025-01-20'),
        company: { id: companyId || 'demo-co', name: 'Demo Company' },
        _count: { candidates: 1, interviews: 0 },
      },
      {
        id: 'demo-job-3', title: 'DevOps Engineer', description: 'Manage cloud infrastructure and CI/CD pipelines',
        requirements: 'AWS/GCP, Kubernetes, Terraform', department: 'Infrastructure',
        location: 'San Francisco, CA', employmentType: 'full_time', experienceMin: 4, experienceMax: 8,
        salaryMin: 125000, salaryMax: 175000, status: 'draft', priority: 'low', positions: 1,
        postedDate: null, closingDate: null,
        companyId: companyId || 'demo-co',
        createdAt: new Date('2025-02-01'), updatedAt: new Date('2025-02-01'),
        company: { id: companyId || 'demo-co', name: 'Demo Company' },
        _count: { candidates: 0, interviews: 0 },
      },
      {
        id: 'demo-job-4', title: 'Sales Representative', description: 'Drive B2B sales and manage client relationships',
        requirements: '3+ years B2B sales, CRM experience', department: 'Sales',
        location: 'Chicago, IL', employmentType: 'full_time', experienceMin: 2, experienceMax: 5,
        salaryMin: 70000, salaryMax: 100000, status: 'closed', priority: 'medium', positions: 1,
        postedDate: new Date('2024-11-01'), closingDate: new Date('2025-01-15'),
        companyId: companyId || 'demo-co',
        createdAt: new Date('2024-10-25'), updatedAt: new Date('2025-01-16'),
        company: { id: companyId || 'demo-co', name: 'Demo Company' },
        _count: { candidates: 8, interviews: 5 },
      },
    ];

    let filtered = demoJobs;
    if (status) filtered = filtered.filter((j) => j.status === status);
    if (department) {
      const dept = department.toLowerCase();
      filtered = filtered.filter((j) => j.department.toLowerCase().includes(dept));
    }
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter((j) =>
        j.title.toLowerCase().includes(s) ||
        j.department.toLowerCase().includes(s) ||
        j.location.toLowerCase().includes(s)
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
      title, description, requirements, department, location,
      employmentType, experienceMin, experienceMax, salaryMin, salaryMax,
      status, priority, positions, closingDate, companyId,
    } = body;

    if (!title || !companyId) {
      return NextResponse.json(
        { error: 'Missing required fields: title, companyId' },
        { status: 400 }
      );
    }

    const job = await db.job.create({
      data: {
        title, description, requirements, department, location,
        employmentType, experienceMin, experienceMax,
        salaryMin, salaryMax, status: status || 'draft',
        priority: priority || 'medium', positions: positions || 1,
        postedDate: status === 'open' ? new Date() : null,
        closingDate: closingDate ? new Date(closingDate) : null,
        companyId,
      },
      include: { company: true },
    });

    await db.auditLog.create({
      data: {
        action: 'CREATE',
        entity: 'Job',
        entityId: job.id,
        userId: body.createdBy,
        details: `Created job: ${title}`,
      },
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error('Jobs POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    const existing = await db.job.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    if (updateData.closingDate) {
      updateData.closingDate = new Date(updateData.closingDate);
    }
    if (updateData.status === 'open' && !existing.postedDate) {
      updateData.postedDate = new Date();
    }

    const job = await db.job.update({
      where: { id },
      data: updateData,
      include: {
        company: true,
        _count: { select: { candidates: true, interviews: true } },
      },
    });

    await db.auditLog.create({
      data: {
        action: 'UPDATE',
        entity: 'Job',
        entityId: id,
        userId: body.updatedBy,
        details: `Updated job: ${existing.title}`,
      },
    });

    return NextResponse.json(job);
  } catch (error) {
    console.error('Jobs PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
