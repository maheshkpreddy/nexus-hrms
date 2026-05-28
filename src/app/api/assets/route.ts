import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

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

    return NextResponse.json({
      data: assets,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Assets GET error:', error);
    // Demo data fallback when database is unavailable
    const demoAssets = [
      { id: 'asset-1', assetType: 'laptop', assetName: 'MacBook Pro 14"', assetCode: 'LT-001', serialNumber: 'MBP14-2024-001', status: 'allocated', allocatedAt: '2024-01-15', returnedAt: null, notes: 'M3 Pro, 18GB RAM', employeeId: 'demo-1', employee: { id: 'demo-1', firstName: 'Rajesh', lastName: 'Kumar', employeeId: 'EMP001', department: { name: 'Engineering' } } },
      { id: 'asset-2', assetType: 'laptop', assetName: 'Dell XPS 15', assetCode: 'LT-002', serialNumber: 'DX15-2024-002', status: 'allocated', allocatedAt: '2024-02-01', returnedAt: null, notes: 'i7, 16GB RAM', employeeId: 'demo-3', employee: { id: 'demo-3', firstName: 'Amit', lastName: 'Patel', employeeId: 'EMP003', department: { name: 'Design' } } },
      { id: 'asset-3', assetType: 'mobile', assetName: 'iPhone 15', assetCode: 'PH-001', serialNumber: 'IP15-2024-001', status: 'allocated', allocatedAt: '2024-03-10', returnedAt: null, notes: 'Company phone', employeeId: 'demo-6', employee: { id: 'demo-6', firstName: 'Ananya', lastName: 'Gupta', employeeId: 'EMP006', department: { name: 'Marketing' } } },
      { id: 'asset-4', assetType: 'desktop', assetName: 'HP Workstation', assetCode: 'DT-001', serialNumber: 'HPW-2024-001', status: 'returned', allocatedAt: '2023-06-01', returnedAt: '2024-12-15', notes: 'Returned after upgrade', employeeId: 'demo-5', employee: { id: 'demo-5', firstName: 'Vikram', lastName: 'Singh', employeeId: 'EMP005', department: { name: 'Engineering' } } },
      { id: 'asset-5', assetType: 'laptop', assetName: 'ThinkPad X1 Carbon', assetCode: 'LT-003', serialNumber: 'TPX1-2024-003', status: 'allocated', allocatedAt: '2024-06-20', returnedAt: null, notes: 'i7, 16GB RAM, Business class', employeeId: 'demo-9', employee: { id: 'demo-9', firstName: 'Arjun', lastName: 'Menon', employeeId: 'EMP009', department: { name: 'Operations' } } },
      { id: 'asset-6', assetType: 'monitor', assetName: 'Dell 27" 4K Monitor', assetCode: 'MN-001', serialNumber: 'DM27-2024-001', status: 'allocated', allocatedAt: '2024-01-15', returnedAt: null, notes: 'External monitor', employeeId: 'demo-1', employee: { id: 'demo-1', firstName: 'Rajesh', lastName: 'Kumar', employeeId: 'EMP001', department: { name: 'Engineering' } } },
      { id: 'asset-7', assetType: 'mobile', assetName: 'Samsung Galaxy S24', assetCode: 'PH-002', serialNumber: 'SGS24-2024-001', status: 'allocated', allocatedAt: '2024-04-01', returnedAt: null, notes: 'Sales team phone', employeeId: 'demo-8', employee: { id: 'demo-8', firstName: 'Deepa', lastName: 'Iyer', employeeId: 'EMP008', department: { name: 'Sales' } } },
      { id: 'asset-8', assetType: 'laptop', assetName: 'MacBook Air M2', assetCode: 'LT-004', serialNumber: 'MBA-2024-004', status: 'allocated', allocatedAt: '2024-08-22', returnedAt: null, notes: 'M2, 16GB RAM', employeeId: 'demo-10', employee: { id: 'demo-10', firstName: 'Meera', lastName: 'Joshi', employeeId: 'EMP010', department: { name: 'Finance' } } },
    ];
    let filtered = demoAssets;
    if (employeeId) filtered = filtered.filter(a => a.employeeId === employeeId);
    if (status) filtered = filtered.filter(a => a.status === status);
    if (assetType) filtered = filtered.filter(a => a.assetType === assetType);
    return NextResponse.json({
      data: filtered,
      pagination: { page, limit, total: filtered.length, totalPages: 1 },
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
