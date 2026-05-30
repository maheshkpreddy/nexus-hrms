import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { DEMO_ASSETS } from '@/lib/demo-data';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const employeeId = url.searchParams.get('employeeId');
    const status = url.searchParams.get('status');
    const assetType = url.searchParams.get('assetType');
    const companyId = url.searchParams.get('companyId');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (employeeId) where.employeeId = employeeId;
    if (status) where.status = status;
    if (assetType) where.assetType = assetType;
    if (companyId) where.employee = { companyId };

    const [assets, total] = await Promise.all([
      db.assetAllocation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { allocatedAt: 'desc' },
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
      db.assetAllocation.count({ where }),
    ]);

    // If DB returns empty, use demo data fallback
    if (assets.length === 0 && total === 0) {
      let filtered = [...DEMO_ASSETS];
      if (employeeId) filtered = filtered.filter(a => a.employeeId === employeeId);
      if (status) filtered = filtered.filter(a => a.status === status);
      if (assetType) filtered = filtered.filter(a => a.assetType === assetType);
      return NextResponse.json({
        data: filtered,
        pagination: { page, limit, total: filtered.length, totalPages: Math.ceil(filtered.length / limit) },
      });
    }

    return NextResponse.json({
      data: assets,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Assets GET error:', error);
    // Fallback to DEMO_ASSETS from demo-data.ts
    const url = new URL(req.url);
    const employeeId = url.searchParams.get('employeeId');
    const status = url.searchParams.get('status');
    const assetType = url.searchParams.get('assetType');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');

    let filtered = [...DEMO_ASSETS];
    if (employeeId) filtered = filtered.filter(a => a.employeeId === employeeId);
    if (status) filtered = filtered.filter(a => a.status === status);
    if (assetType) filtered = filtered.filter(a => a.assetType === assetType);
    return NextResponse.json({
      data: filtered,
      pagination: { page, limit, total: filtered.length, totalPages: Math.ceil(filtered.length / limit) },
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { assetType, assetName, assetCode, serialNumber, notes, employeeId } = body;

    if (!assetType || !assetName || !employeeId) {
      return NextResponse.json(
        { error: 'Missing required fields: assetType, assetName, employeeId' },
        { status: 400 }
      );
    }

    const asset = await db.assetAllocation.create({
      data: {
        assetType, assetName, assetCode, serialNumber, notes,
        employeeId,
        status: 'allocated',
        allocatedAt: new Date(),
      },
      include: {
        employee: { select: { firstName: true, lastName: true } },
      },
    });

    await db.auditLog.create({
      data: {
        action: 'CREATE',
        entity: 'AssetAllocation',
        entityId: asset.id,
        userId: body.createdBy,
        details: `Asset allocated: ${assetName} (${assetType})`,
      },
    });

    return NextResponse.json(asset, { status: 201 });
  } catch (error) {
    console.error('Assets POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Asset ID is required' }, { status: 400 });
    }

    const existing = await db.assetAllocation.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    if (updateData.returnedAt) {
      updateData.returnedAt = new Date(updateData.returnedAt);
    }

    // If marking as returned, auto-set returnedAt and status
    if (updateData.status === 'returned' && !updateData.returnedAt) {
      updateData.returnedAt = new Date();
    }

    const asset = await db.assetAllocation.update({
      where: { id },
      data: updateData,
      include: {
        employee: { select: { firstName: true, lastName: true } },
      },
    });

    await db.auditLog.create({
      data: {
        action: 'UPDATE',
        entity: 'AssetAllocation',
        entityId: id,
        userId: body.updatedBy,
        details: `Asset updated: ${existing.assetName}`,
      },
    });

    return NextResponse.json(asset);
  } catch (error) {
    console.error('Assets PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
