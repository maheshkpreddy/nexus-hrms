import { NextRequest, NextResponse } from 'next/server';
import { DEMO_TRAVEL } from '@/lib/demo-data';

function filterDemoTravel(params: { status?: string | null; employeeId?: string | null; page: number; limit: number }) {
  let filtered = [...DEMO_TRAVEL];
  if (params.status) filtered = filtered.filter(r => r.status === params.status);
  if (params.employeeId) filtered = filtered.filter(r => r.employeeId === params.employeeId);
  return NextResponse.json({
    data: filtered,
    pagination: { page: params.page, limit: params.limit, total: filtered.length, totalPages: Math.ceil(filtered.length / params.limit) },
  });
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const status = url.searchParams.get('status');
  const employeeId = url.searchParams.get('employeeId');
  const companyId = url.searchParams.get('companyId');
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '20');

  try {
    const { db } = await import('@/lib/db');
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (employeeId) where.employeeId = employeeId;
    if (status) where.status = status;
    if (companyId) where.employee = { companyId };

    const [requests, total] = await Promise.all([
      db.travelRequest.findMany({
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
      db.travelRequest.count({ where }),
    ]);

    // If DB has real data, return it
    if (requests.length > 0 || total > 0) {
      return NextResponse.json({
        data: requests,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      });
    }
  } catch (error) {
    console.error('Travel GET error, using demo data:', error);
  }

  // Demo data fallback (when DB is empty or unavailable)
  return filterDemoTravel({ status, employeeId, page, limit });
}

export async function POST(req: NextRequest) {
  try {
    const { db } = await import('@/lib/db');
    const body = await req.json();
    const {
      purpose, destination, departureDate, returnDate,
      estimatedCost, status, employeeId, createWorkflow,
    } = body;

    if (!purpose || !destination || !departureDate || !returnDate || !employeeId) {
      return NextResponse.json(
        { error: 'Missing required fields: purpose, destination, departureDate, returnDate, employeeId' },
        { status: 400 }
      );
    }

    const travel = await db.travelRequest.create({
      data: {
        purpose, destination,
        departureDate: new Date(departureDate),
        returnDate: new Date(returnDate),
        estimatedCost,
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
        where: { entity: 'travel', isActive: true },
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

        await db.travelRequest.update({
          where: { id: travel.id },
          data: { workflowInstanceId: instance.id },
        });

        travel.workflowInstanceId = instance.id;
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
            title: 'New Travel Request',
            message: `${employee.firstName} ${employee.lastName} requested travel to ${destination}`,
            type: 'travel',
            category: 'approval',
            userId: managerUser.id,
            actionUrl: `/travel/${travel.id}`,
          },
        });
      }
    }

    await db.auditLog.create({
      data: {
        action: 'CREATE',
        entity: 'TravelRequest',
        entityId: travel.id,
        userId: body.userId,
        details: `Travel request to ${destination}`,
      },
    });

    return NextResponse.json(travel, { status: 201 });
  } catch (error) {
    console.error('Travel POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { db } = await import('@/lib/db');
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Travel request ID is required' }, { status: 400 });
    }

    const existing = await db.travelRequest.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Travel request not found' }, { status: 404 });
    }

    if (updateData.departureDate) updateData.departureDate = new Date(updateData.departureDate);
    if (updateData.returnDate) updateData.returnDate = new Date(updateData.returnDate);

    const travel = await db.travelRequest.update({
      where: { id },
      data: updateData,
      include: {
        employee: { select: { firstName: true, lastName: true } },
        approver: { select: { firstName: true, lastName: true } },
      },
    });

    return NextResponse.json(travel);
  } catch (error) {
    console.error('Travel PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { db } = await import('@/lib/db');
    const body = await req.json();
    const { id, action, approverId, comment, approvedCost } = body;

    if (!id || !action || !approverId) {
      return NextResponse.json(
        { error: 'Missing required fields: id, action (approve/reject), approverId' },
        { status: 400 }
      );
    }

    const travel = await db.travelRequest.findUnique({ where: { id } });
    if (!travel) {
      return NextResponse.json({ error: 'Travel request not found' }, { status: 404 });
    }

    if (travel.status !== 'pending') {
      return NextResponse.json(
        { error: 'Travel request is not in pending status' },
        { status: 400 }
      );
    }

    const newStatus = action === 'approve' ? 'approved' : 'rejected';

    const updatedTravel = await db.travelRequest.update({
      where: { id },
      data: {
        status: newStatus,
        approverId,
        approverComment: comment,
        approvedCost: action === 'approve' ? (approvedCost || travel.estimatedCost) : undefined,
      },
      include: {
        employee: { select: { firstName: true, lastName: true } },
        approver: { select: { firstName: true, lastName: true } },
      },
    });

    // Update workflow instance if exists
    if (travel.workflowInstanceId) {
      const instance = await db.workflowInstance.findUnique({
        where: { id: travel.workflowInstanceId },
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
      where: { employee: { id: travel.employeeId } },
    });

    if (empUser) {
      await db.notification.create({
        data: {
          title: `Travel Request ${newStatus}`,
          message: `Your travel request to ${travel.destination} has been ${newStatus}`,
          type: 'travel',
          category: 'status_update',
          userId: empUser.id,
          actionUrl: `/travel/${id}`,
        },
      });
    }

    await db.auditLog.create({
      data: {
        action: action === 'approve' ? 'APPROVE' : 'REJECT',
        entity: 'TravelRequest',
        entityId: id,
        userId: approverId,
        details: `Travel request ${newStatus}: ${comment || 'No comment'}`,
      },
    });

    return NextResponse.json(updatedTravel);
  } catch (error) {
    console.error('Travel PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
