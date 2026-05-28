import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get('search');
    const departmentId = url.searchParams.get('departmentId');
    const status = url.searchParams.get('status');
    const companyId = url.searchParams.get('companyId');
    const branchId = url.searchParams.get('branchId');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (companyId) where.companyId = companyId;
    if (departmentId) where.departmentId = departmentId;
    if (status) where.status = status;
    if (branchId) where.branchId = branchId;
    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
        { employeeId: { contains: search } },
        { designation: { contains: search } },
      ];
    }

    const [employees, total] = await Promise.all([
      db.employee.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          department: { select: { id: true, name: true } },
          branch: { select: { id: true, name: true } },
          company: { select: { id: true, name: true } },
          reportingManager: { select: { id: true, firstName: true, lastName: true } },
        },
      }),
      db.employee.count({ where }),
    ]);

    return NextResponse.json({
      data: employees,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Employees GET error:', error);
    // Demo data fallback when database is unavailable
    const demoEmployees = [
      { id: 'demo-1', employeeId: 'EMP001', firstName: 'Rajesh', lastName: 'Kumar', email: 'rajesh@nexushrms.com', phone: '+91-9876543210', designation: 'Senior Developer', jobTitle: 'Senior Developer', employmentType: 'full-time', status: 'active', joiningDate: '2023-01-15', department: { id: 'dept-1', name: 'Engineering' }, branch: { id: 'branch-1', name: 'Hyderabad HQ' }, company: { id: 'comp-1', name: 'Nexus Technologies' } },
      { id: 'demo-2', employeeId: 'EMP002', firstName: 'Priya', lastName: 'Sharma', email: 'priya@nexushrms.com', phone: '+91-9876543211', designation: 'HR Manager', jobTitle: 'HR Manager', employmentType: 'full-time', status: 'active', joiningDate: '2022-06-01', department: { id: 'dept-2', name: 'Human Resources' }, branch: { id: 'branch-1', name: 'Hyderabad HQ' }, company: { id: 'comp-1', name: 'Nexus Technologies' } },
      { id: 'demo-3', employeeId: 'EMP003', firstName: 'Amit', lastName: 'Patel', email: 'amit@nexushrms.com', phone: '+91-9876543212', designation: 'Product Designer', jobTitle: 'Product Designer', employmentType: 'full-time', status: 'active', joiningDate: '2023-03-20', department: { id: 'dept-3', name: 'Design' }, branch: { id: 'branch-2', name: 'Bangalore Office' }, company: { id: 'comp-1', name: 'Nexus Technologies' } },
      { id: 'demo-4', employeeId: 'EMP004', firstName: 'Sneha', lastName: 'Reddy', email: 'sneha@nexushrms.com', phone: '+91-9876543213', designation: 'Finance Analyst', jobTitle: 'Finance Analyst', employmentType: 'full-time', status: 'active', joiningDate: '2022-11-10', department: { id: 'dept-4', name: 'Finance' }, branch: { id: 'branch-1', name: 'Hyderabad HQ' }, company: { id: 'comp-1', name: 'Nexus Technologies' } },
      { id: 'demo-5', employeeId: 'EMP005', firstName: 'Vikram', lastName: 'Singh', email: 'vikram@nexushrms.com', phone: '+91-9876543214', designation: 'DevOps Engineer', jobTitle: 'DevOps Engineer', employmentType: 'contract', status: 'probation', joiningDate: '2024-01-08', department: { id: 'dept-1', name: 'Engineering' }, branch: { id: 'branch-2', name: 'Bangalore Office' }, company: { id: 'comp-1', name: 'Nexus Technologies' } },
      { id: 'demo-6', employeeId: 'EMP006', firstName: 'Ananya', lastName: 'Gupta', email: 'ananya@nexushrms.com', phone: '+91-9876543215', designation: 'Marketing Lead', jobTitle: 'Marketing Lead', employmentType: 'full-time', status: 'active', joiningDate: '2023-07-15', department: { id: 'dept-5', name: 'Marketing' }, branch: { id: 'branch-1', name: 'Hyderabad HQ' }, company: { id: 'comp-1', name: 'Nexus Technologies' } },
      { id: 'demo-7', employeeId: 'EMP007', firstName: 'Kiran', lastName: 'Nair', email: 'kiran@nexushrms.com', phone: '+91-9876543216', designation: 'QA Engineer', jobTitle: 'QA Engineer', employmentType: 'full-time', status: 'on_leave', joiningDate: '2022-09-20', department: { id: 'dept-1', name: 'Engineering' }, branch: { id: 'branch-1', name: 'Hyderabad HQ' }, company: { id: 'comp-1', name: 'Nexus Technologies' } },
      { id: 'demo-8', employeeId: 'EMP008', firstName: 'Deepa', lastName: 'Iyer', email: 'deepa@nexushrms.com', phone: '+91-9876543217', designation: 'Sales Executive', jobTitle: 'Sales Executive', employmentType: 'full-time', status: 'active', joiningDate: '2023-11-01', department: { id: 'dept-6', name: 'Sales' }, branch: { id: 'branch-2', name: 'Bangalore Office' }, company: { id: 'comp-1', name: 'Nexus Technologies' } },
    ];
    // Apply search filter to demo data
    let filtered = demoEmployees;
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(e => e.firstName.toLowerCase().includes(q) || e.lastName.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || e.designation.toLowerCase().includes(q));
    }
    if (status) filtered = filtered.filter(e => e.status === status);
    if (departmentId) filtered = filtered.filter(e => e.department.id === departmentId);
    if (companyId) filtered = filtered.filter(e => e.company.id === companyId);
    return NextResponse.json({
      data: filtered,
      pagination: { page, limit, total: filtered.length, totalPages: 1 },
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      employeeId, firstName, lastName, email, phone, avatar,
      dateOfBirth, gender, maritalStatus, nationality, address,
      city, state, country, zipCode, emergencyContact, emergencyPhone,
      designation, jobTitle, employmentType, status, joiningDate,
      exitDate, probationEnd, reportingManagerId, companyId,
      branchId, departmentId, userId,
    } = body;

    if (!employeeId || !firstName || !lastName || !email || !designation || !joiningDate || !companyId || !departmentId) {
      return NextResponse.json(
        { error: 'Missing required fields: employeeId, firstName, lastName, email, designation, joiningDate, companyId, departmentId' },
        { status: 400 }
      );
    }

    // Check unique constraints
    const existingEmployee = await db.employee.findFirst({
      where: { OR: [{ employeeId }, { email }] },
    });
    if (existingEmployee) {
      return NextResponse.json(
        { error: 'Employee ID or email already exists' },
        { status: 400 }
      );
    }

    const employee = await db.employee.create({
      data: {
        employeeId, firstName, lastName, email, phone, avatar,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender, maritalStatus, nationality, address,
        city, state, country, zipCode, emergencyContact, emergencyPhone,
        designation, jobTitle, employmentType: employmentType || 'full-time',
        status: status || 'active',
        joiningDate: new Date(joiningDate),
        exitDate: exitDate ? new Date(exitDate) : null,
        probationEnd: probationEnd ? new Date(probationEnd) : null,
        reportingManagerId,
        companyId, branchId, departmentId, userId,
      },
      include: {
        department: true,
        branch: true,
        company: true,
      },
    });

    // Audit log
    await db.auditLog.create({
      data: {
        action: 'CREATE',
        entity: 'Employee',
        entityId: employee.id,
        userId: body.createdBy,
        details: `Created employee ${firstName} ${lastName}`,
      },
    });

    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    console.error('Employees POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Employee ID is required' },
        { status: 400 }
      );
    }

    const existing = await db.employee.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    // Convert date fields
    const dateFields = ['dateOfBirth', 'joiningDate', 'exitDate', 'probationEnd'];
    for (const field of dateFields) {
      if (updateData[field]) {
        updateData[field] = new Date(updateData[field]);
      }
    }

    const employee = await db.employee.update({
      where: { id },
      data: updateData,
      include: {
        department: true,
        branch: true,
        company: true,
        reportingManager: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    // Audit log
    await db.auditLog.create({
      data: {
        action: 'UPDATE',
        entity: 'Employee',
        entityId: id,
        userId: body.updatedBy,
        details: `Updated employee ${existing.firstName} ${existing.lastName}`,
      },
    });

    return NextResponse.json(employee);
  } catch (error) {
    console.error('Employees PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
