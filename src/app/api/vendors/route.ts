import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

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

    return NextResponse.json({
      data: vendors,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Vendors GET error:', error);
    // Demo data fallback when database is unavailable
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const companyId = url.searchParams.get('companyId');
    const search = url.searchParams.get('search');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');

    const demoVendors = [
      {
        id: 'vnd-1', name: 'CloudTech Solutions', email: 'contact@cloudtech.in', phone: '+91-80-4567-8901',
        vendorCompany: 'CloudTech Solutions Pvt Ltd', serviceType: 'cloud_infrastructure', status: 'active', rating: 4.5,
        companyId: companyId || 'comp-1', createdAt: new Date('2024-06-15'), updatedAt: new Date('2024-06-15'),
        company: { id: companyId || 'comp-1', name: 'Nexus Technologies' },
        subVendors: [],
      },
      {
        id: 'vnd-2', name: 'SecureGuard India', email: 'info@secureguard.in', phone: '+91-22-2345-6789',
        vendorCompany: 'SecureGuard India Ltd', serviceType: 'security', status: 'active', rating: 4.2,
        companyId: companyId || 'comp-1', createdAt: new Date('2024-08-01'), updatedAt: new Date('2024-08-01'),
        company: { id: companyId || 'comp-1', name: 'Nexus Technologies' },
        subVendors: [{ id: 'sv-1', name: 'SecureGuard West', email: 'west@secureguard.in', phone: '+91-20-3456-7890', company: 'SecureGuard India Ltd', status: 'active', vendorId: 'vnd-2' }],
      },
      {
        id: 'vnd-3', name: 'CleanSpace Services', email: 'hello@cleanspace.in', phone: '+91-80-5678-9012',
        vendorCompany: 'CleanSpace Services Pvt Ltd', serviceType: 'facilities', status: 'inactive', rating: 3.8,
        companyId: companyId || 'comp-1', createdAt: new Date('2024-03-01'), updatedAt: new Date('2025-01-20'),
        company: { id: companyId || 'comp-1', name: 'Nexus Technologies' },
        subVendors: [],
      },
      {
        id: 'vnd-4', name: 'DataVault Analytics', email: 'sales@datavault.in', phone: '+91-80-6789-0123',
        vendorCompany: 'DataVault Analytics Pvt Ltd', serviceType: 'data_analytics', status: 'active', rating: 4.7,
        companyId: companyId || 'comp-1', createdAt: new Date('2025-01-10'), updatedAt: new Date('2025-01-10'),
        company: { id: companyId || 'comp-1', name: 'Nexus Technologies' },
        subVendors: [],
      },
      {
        id: 'vnd-5', name: 'TechPrint Solutions', email: 'orders@techprint.in', phone: '+91-22-7890-1234',
        vendorCompany: 'TechPrint Solutions Pvt Ltd', serviceType: 'printing', status: 'active', rating: 4.0,
        companyId: companyId || 'comp-1', createdAt: new Date('2024-09-15'), updatedAt: new Date('2024-09-15'),
        company: { id: companyId || 'comp-1', name: 'Nexus Technologies' },
        subVendors: [],
      },
      {
        id: 'vnd-6', name: 'QuickFix IT Services', email: 'support@quickfix.in', phone: '+91-40-8901-2345',
        vendorCompany: 'QuickFix IT Services Pvt Ltd', serviceType: 'it_support', status: 'active', rating: 3.9,
        companyId: companyId || 'comp-1', createdAt: new Date('2024-11-01'), updatedAt: new Date('2024-11-01'),
        company: { id: companyId || 'comp-1', name: 'Nexus Technologies' },
        subVendors: [],
      },
    ];

    let filtered = demoVendors;
    if (status) filtered = filtered.filter((v) => v.status === status);
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter((v) =>
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
