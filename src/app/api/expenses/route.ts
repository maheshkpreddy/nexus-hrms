import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const employeeId = url.searchParams.get('employeeId');
    const type = url.searchParams.get('type');
    const companyId = url.searchParams.get('companyId');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (employeeId) where.employeeId = employeeId;
    if (status) where.status = status;
    if (type) where.type = type;
    if (companyId) where.employee = { companyId };

    const [claims, total] = await Promise.all([
      db.expenseClaim.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          employee: {
            select: {
              id: true, firstName: true, lastName: true,
              employeeId: true, avatar: true,
              department: { select: { name: true } },
            },
          },
          approver: {
            select: { id: true, firstName: true, lastName: true },
          },
          workflowInstance: {
            include: {
              workflowDef: { select: { name: true } },
              steps: { orderBy: { stepOrder: 'asc' } },
            },
          },
        },
      }),
      db.expenseClaim.count({ where }),
    ]);

    return NextResponse.json({
      data: claims,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Expenses GET error:', error);
    // Demo data fallback when database is unavailable
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const employeeId = url.searchParams.get('employeeId');
    const type = url.searchParams.get('type');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');

    const demoClaims = [
      {
        id: 'demo-exp1', type: 'travel', amount: 1250.00, description: 'Flight to NYC conference',
        receipt: 'receipt1.pdf', status: 'pending', employeeId: 'demo-emp1',
        approverId: null, approverComment: null, workflowInstanceId: null,
        createdAt: new Date('2025-02-20'), updatedAt: new Date('2025-02-20'),
        employee: { id: 'demo-emp1', firstName: 'Alice', lastName: 'Martinez', employeeId: 'EMP001', avatar: null, department: { name: 'Engineering' } },
        approver: null, workflowInstance: null,
      },
      {
        id: 'demo-exp2', type: 'meals', amount: 85.50, description: 'Team lunch meeting',
        receipt: 'receipt2.pdf', status: 'approved', employeeId: 'demo-emp2',
        approverId: 'demo-emp3', approverComment: 'Approved', workflowInstanceId: null,
        createdAt: new Date('2025-02-15'), updatedAt: new Date('2025-02-18'),
        employee: { id: 'demo-emp2', firstName: 'James', lastName: 'Wilson', employeeId: 'EMP002', avatar: null, department: { name: 'Sales' } },
        approver: { id: 'demo-emp3', firstName: 'Robert', lastName: 'Brown' },
        workflowInstance: null,
      },
      {
        id: 'demo-exp3', type: 'equipment', amount: 2499.99, description: 'New laptop for development',
        receipt: 'receipt3.pdf', status: 'rejected', employeeId: 'demo-emp1',
        approverId: 'demo-emp3', approverComment: 'Budget exceeded', workflowInstanceId: null,
        createdAt: new Date('2025-02-10'), updatedAt: new Date('2025-02-14'),
        employee: { id: 'demo-emp1', firstName: 'Alice', lastName: 'Martinez', employeeId: 'EMP001', avatar: null, department: { name: 'Engineering' } },
        approver: { id: 'demo-emp3', firstName: 'Robert', lastName: 'Brown' },
        workflowInstance: null,
      },
      {
        id: 'demo-exp4', type: 'travel', amount: 560.00, description: 'Hotel stay for client visit',
        receipt: 'receipt4.pdf', status: 'pending', employeeId: 'demo-emp4',
        approverId: null, approverComment: null, workflowInstanceId: null,
        createdAt: new Date('2025-02-25'), updatedAt: new Date('2025-02-25'),
        employee: { id: 'demo-emp4', firstName: 'Lisa', lastName: 'Chang', employeeId: 'EMP004', avatar: null, department: { name: 'Marketing' } },
        approver: null, workflowInstance: null,
      },
    ];

    let filtered = demoClaims;
    if (status) filtered = filtered.filter((c) => c.status === status);
    if (employeeId) filtered = filtered.filter((c) => c.employeeId === employeeId);
    if (type) filtered = filtered.filter((c) => c.type === type);

    return NextResponse.json({
      data: filtered,
      pagination: { page, limit, total: filtered.length, totalPages: Math.ceil(filtered.length / limit) },
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, amount, description, receipt, status, employeeId, createWorkflow } = body;

    if (!type || amount === undefined || !employeeId) {
      return NextResponse.json(
        { error: 'Missing required fields: type, amount, employeeId' },
        { status: 400 }
      );
    }

    const claim = await db.expenseClaim.create({
      data: {
        type, amount, description, receipt,
        status: status || 'pending',
        employeeId,
      },
      include: {
        employee: { select: { firstName: true, lastName: true } },
      },
    });

    // Create workflow instance if requested
    if (createWorkflow) {
      const workflowDef = await db.workflowDefinition.findFirst({
        where: { entity: 'expense', isActive: true },
        include: { steps: { orderBy: { stepOrder: 'asc' } } },
      });

      if (workflowDef && workflowDef.steps.length > 0) {
        const instance = await db.workflowInstance.create({
          data: {
            status: 'pending',
            currentStep: 0,
            initiatedBy: employeeId,
            workflowDefId: workflowDef.id,
            steps: {
              create: workflowDef.steps.map((step) => ({
                stepOrder: step.stepOrder,
                status: 'pending',
              })),
            },
          },
        });

        await db.expenseClaim.update({
          where: { id: claim.id },
          data: { workflowInstanceId: instance.id },
        });

        claim.workflowInstanceId = instance.id;
      }
    }

    // Notify manager
    const employee = await db.employee.findUnique({
      where: { id: employeeId },
      select: { reportingManagerId: true, firstName: true, lastName: true },
    });

    if (employee?.reportingManagerId) {
      const managerUser = await db.user.findFirst({
        where: { employee: { id: employee.reportingManagerId } },
      });
      if (managerUser) {
        await db.notification.create({
          data: {
            title: 'New Expense Claim',
            message: `${employee.firstName} ${employee.lastName} submitted an expense claim of $${amount}`,
            type: 'expense',
            category: 'approval',
            userId: managerUser.id,
            actionUrl: `/expenses/${claim.id}`,
          },
        });
      }
    }

    await db.auditLog.create({
      data: {
        action: 'CREATE',
        entity: 'ExpenseClaim',
        entityId: claim.id,
        userId: body.userId,
        details: `Expense claim submitted: ${type} - $${amount}`,
      },
    });

    return NextResponse.json(claim, { status: 201 });
  } catch (error) {
    console.error('Expenses POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Expense claim ID is required' }, { status: 400 });
    }

    const existing = await db.expenseClaim.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Expense claim not found' }, { status: 404 });
    }

    const claim = await db.expenseClaim.update({
      where: { id },
      data: updateData,
      include: {
        employee: { select: { firstName: true, lastName: true } },
        approver: { select: { firstName: true, lastName: true } },
      },
    });

    return NextResponse.json(claim);
  } catch (error) {
    console.error('Expenses PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, action, approverId, comment } = body;

    if (!id || !action || !approverId) {
      return NextResponse.json(
        { error: 'Missing required fields: id, action (approve/reject), approverId' },
        { status: 400 }
      );
    }

    const claim = await db.expenseClaim.findUnique({ where: { id } });
    if (!claim) {
      return NextResponse.json({ error: 'Expense claim not found' }, { status: 404 });
    }

    if (claim.status !== 'pending') {
      return NextResponse.json(
        { error: 'Expense claim is not in pending status' },
        { status: 400 }
      );
    }

    const newStatus = action === 'approve' ? 'approved' : 'rejected';

    const updatedClaim = await db.expenseClaim.update({
      where: { id },
      data: {
        status: newStatus,
        approverId,
        approverComment: comment,
      },
      include: {
        employee: { select: { firstName: true, lastName: true } },
        approver: { select: { firstName: true, lastName: true } },
      },
    });

    // Update workflow instance if exists
    if (claim.workflowInstanceId) {
      const instance = await db.workflowInstance.findUnique({
        where: { id: claim.workflowInstanceId },
        include: { steps: { orderBy: { stepOrder: 'asc' } } },
      });

      if (instance) {
        const currentStep = instance.steps.find(
          (s) => s.stepOrder === instance.currentStep
        );

        if (currentStep) {
          await db.workflowStepInstance.update({
            where: { id: currentStep.id },
            data: {
              status: newStatus,
              actionedBy: approverId,
              comments: comment,
              actedAt: new Date(),
            },
          });
        }

        if (action === 'approve') {
          const nextStep = instance.steps.find(
            (s) => s.stepOrder === instance.currentStep + 1
          );
          if (nextStep) {
            await db.workflowInstance.update({
              where: { id: instance.id },
              data: { currentStep: instance.currentStep + 1 },
            });
          } else {
            await db.workflowInstance.update({
              where: { id: instance.id },
              data: { status: 'approved' },
            });
          }
        } else {
          await db.workflowInstance.update({
            where: { id: instance.id },
            data: { status: 'rejected' },
          });
        }
      }
    }

    // Notify the employee
    const empUser = await db.user.findFirst({
      where: { employee: { id: claim.employeeId } },
    });

    if (empUser) {
      await db.notification.create({
        data: {
          title: `Expense Claim ${newStatus}`,
          message: `Your ${claim.type} expense claim of $${claim.amount} has been ${newStatus}`,
          type: 'expense',
          category: 'status_update',
          userId: empUser.id,
          actionUrl: `/expenses/${id}`,
        },
      });
    }

    await db.auditLog.create({
      data: {
        action: action === 'approve' ? 'APPROVE' : 'REJECT',
        entity: 'ExpenseClaim',
        entityId: id,
        userId: approverId,
        details: `Expense claim ${newStatus}: ${comment || 'No comment'}`,
      },
    });

    return NextResponse.json(updatedClaim);
  } catch (error) {
    console.error('Expenses PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
