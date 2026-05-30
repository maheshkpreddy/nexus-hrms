import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { DEMO_VENDORS } from '@/lib/demo-data';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const companyId = url.searchParams.get('companyId');
    const search = url.searchParams.get('search');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (companyId) where.companyId = companyId;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { vendorCompany: { contains: search } },
        { serviceType: { contains: search } },
      ];
    }

    const [vendors, total] = await Promise.all([
      db.vendor.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          company: { select: { id: true, name: true } },
          subVendors: true,
        },
      }),
      db.vendor.count({ where }),
    ]);

    // If DB returns empty, use demo data fallback
    if (vendors.length === 0 && total === 0) {
      let filtered = [...DEMO_VENDORS];
      if (status) filtered = filtered.filter(v => v.status === status);
      if (companyId) filtered = filtered.filter(v => v.companyId === companyId);
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(v =>
          v.name.toLowerCase().includes(s) ||
          v.email.toLowerCase().includes(s) ||
          v.vendorCompany.toLowerCase().includes(s) ||
          v.serviceType.toLowerCase().includes(s)
        );
      }
      return NextResponse.json({
        data: filtered,
        pagination: { page, limit, total: filtered.length, totalPages: Math.ceil(filtered.length / limit) },
      });
    }

    return NextResponse.json({
      data: vendors,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Vendors GET error:', error);
    // Fallback to DEMO_VENDORS from demo-data.ts
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const companyId = url.searchParams.get('companyId');
    const search = url.searchParams.get('search');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');

    let filtered = [...DEMO_VENDORS];
    if (status) filtered = filtered.filter(v => v.status === status);
    if (companyId) filtered = filtered.filter(v => v.companyId === companyId);
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(v =>
        v.name.toLowerCase().includes(s) ||
        v.email.toLowerCase().includes(s) ||
        v.vendorCompany.toLowerCase().includes(s) ||
        v.serviceType.toLowerCase().includes(s)
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
    const { name, email, phone, vendorCompany, serviceType, status, rating, companyId, subVendors } = body;

    if (!name || !companyId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, companyId' },
        { status: 400 }
      );
    }

    const vendor = await db.vendor.create({
      data: {
        name, email, phone, vendorCompany, serviceType,
        status: status || 'active', rating, companyId,
        subVendors: subVendors ? {
          create: subVendors.map((sv: { name: string; email?: string; phone?: string; company?: string; status?: string }) => ({
            name: sv.name,
            email: sv.email,
            phone: sv.phone,
            company: sv.company,
            status: sv.status || 'active',
          })),
        } : undefined,
      },
      include: {
        company: true,
        subVendors: true,
      },
    });

    await db.auditLog.create({
      data: {
        action: 'CREATE',
        entity: 'Vendor',
        entityId: vendor.id,
        userId: body.createdBy,
        details: `Vendor created: ${name}`,
      },
    });

    return NextResponse.json(vendor, { status: 201 });
  } catch (error) {
    console.error('Vendors POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, subVendors, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Vendor ID is required' }, { status: 400 });
    }

    const existing = await db.vendor.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    // Update sub-vendors if provided
    if (subVendors && Array.isArray(subVendors)) {
      // Delete existing sub-vendors and recreate
      await db.subVendor.deleteMany({ where: { vendorId: id } });
      await db.vendor.update({
        where: { id },
        data: {
          ...updateData,
          subVendors: {
            create: subVendors.map((sv: { name: string; email?: string; phone?: string; company?: string; status?: string }) => ({
              name: sv.name,
              email: sv.email,
              phone: sv.phone,
              company: sv.company,
              status: sv.status || 'active',
            })),
          },
        },
      });
    } else {
      await db.vendor.update({
        where: { id },
        data: updateData,
      });
    }

    const vendor = await db.vendor.findUnique({
      where: { id },
      include: { company: true, subVendors: true },
    });

    await db.auditLog.create({
      data: {
        action: 'UPDATE',
        entity: 'Vendor',
        entityId: id,
        userId: body.updatedBy,
        details: `Vendor updated: ${existing.name}`,
      },
    });

    return NextResponse.json(vendor);
  } catch (error) {
    console.error('Vendors PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
