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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
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
