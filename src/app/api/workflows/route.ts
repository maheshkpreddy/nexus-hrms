import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { DEMO_WORKFLOWS } from '@/lib/demo-data';

// GET: List workflow definitions and instances
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const type = url.searchParams.get('type'); // 'definitions' or 'instances'
    const companyId = url.searchParams.get('companyId');
    const entity = url.searchParams.get('entity');
    const status = url.searchParams.get('status');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    if (type === 'definitions' || !type) {
      // List workflow definitions
      const where: Record<string, unknown> = {};
      if (companyId) where.companyId = companyId;
      if (entity) where.entity = entity;

      const [definitions, total] = await Promise.all([
        db.workflowDefinition.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            company: { select: { id: true, name: true } },
            steps: { orderBy: { stepOrder: 'asc' } },
            _count: { select: { instances: true } },
          },
        }),
        db.workflowDefinition.count({ where }),
      ]);

      return NextResponse.json({
        data: definitions,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      });
    } else {
      // List workflow instances
      const where: Record<string, unknown> = {};
      if (status) where.status = status;
      if (companyId) where.workflowDef = { companyId };

      const [instances, total] = await Promise.all([
        db.workflowInstance.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            workflowDef: {
              select: { id: true, name: true, entity: true },
            },
            steps: { orderBy: { stepOrder: 'asc' } },
          },
        }),
        db.workflowInstance.count({ where }),
      ]);

      return NextResponse.json({
        data: instances,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      });
    }
  } catch (error) {
    console.error('Workflows GET error:', error);
    // Fallback to DEMO_WORKFLOWS from demo-data.ts
    const url = new URL(req.url);
    const type = url.searchParams.get('type');
    const companyId = url.searchParams.get('companyId');
    const entity = url.searchParams.get('entity');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');

    if (type === 'definitions' || !type) {
      let filtered = [...DEMO_WORKFLOWS];
      if (companyId) filtered = filtered.filter(d => d.companyId === companyId);
      if (entity) filtered = filtered.filter(d => d.entity === entity);

      return NextResponse.json({
        data: filtered,
        pagination: { page, limit, total: filtered.length, totalPages: Math.ceil(filtered.length / limit) },
      });
    } else {
      // For instances fallback, return empty since we don't have demo instances
      return NextResponse.json({
        data: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
      });
    }
  }
}

// POST: Create a workflow definition or initiate a workflow instance
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.action === 'create_definition') {
      // Create a new workflow definition
      const { name, type, entity, description, isActive, companyId, steps } = body;

      if (!name || !entity || !companyId) {
        return NextResponse.json(
          { error: 'Missing required fields: name, entity, companyId' },
          { status: 400 }
        );
      }

      const definition = await db.workflowDefinition.create({
        data: {
          name,
          type: type || 'approval',
          entity,
          description,
          isActive: isActive !== undefined ? isActive : true,
          companyId,
          steps: steps ? {
            create: steps.map((step: { name: string; stepOrder: number; approverRole?: string; approverType?: string; autoApprove?: boolean; action?: string }) => ({
              name: step.name,
              stepOrder: step.stepOrder,
              approverRole: step.approverRole,
              approverType: step.approverType || 'role',
              autoApprove: step.autoApprove || false,
              action: step.action || 'approve_reject',
            })),
          } : undefined,
        },
        include: {
          company: true,
          steps: { orderBy: { stepOrder: 'asc' } },
        },
      });

      await db.auditLog.create({
        data: {
          action: 'CREATE',
          entity: 'WorkflowDefinition',
          entityId: definition.id,
          userId: body.createdBy,
          details: `Workflow definition created: ${name}`,
        },
      });

      return NextResponse.json(definition, { status: 201 });
    } else {
      // Initiate a workflow instance
      const { workflowDefId, initiatedBy, entityId, entityType } = body;

      if (!workflowDefId || !initiatedBy) {
        return NextResponse.json(
          { error: 'Missing required fields: workflowDefId, initiatedBy' },
          { status: 400 }
        );
      }

      const definition = await db.workflowDefinition.findUnique({
        where: { id: workflowDefId },
        include: { steps: { orderBy: { stepOrder: 'asc' } } },
      });

      if (!definition) {
        return NextResponse.json(
          { error: 'Workflow definition not found' },
          { status: 404 }
        );
      }

      if (!definition.isActive) {
        return NextResponse.json(
          { error: 'Workflow definition is not active' },
          { status: 400 }
        );
      }

      if (definition.steps.length === 0) {
        return NextResponse.json(
          { error: 'Workflow definition has no steps' },
          { status: 400 }
        );
      }

      const instance = await db.workflowInstance.create({
        data: {
          status: 'pending',
          currentStep: 0,
          initiatedBy,
          workflowDefId,
          steps: {
            create: definition.steps.map((step) => ({
              stepOrder: step.stepOrder,
              status: 'pending',
            })),
          },
        },
        include: {
          workflowDef: true,
          steps: { orderBy: { stepOrder: 'asc' } },
        },
      });

      // Link the workflow instance to the entity
      if (entityId && entityType) {
        switch (entityType) {
          case 'leave':
            await db.leave.update({
              where: { id: entityId },
              data: { workflowInstanceId: instance.id },
            });
            break;
          case 'travel':
            await db.travelRequest.update({
              where: { id: entityId },
              data: { workflowInstanceId: instance.id },
            });
            break;
          case 'expense':
            await db.expenseClaim.update({
              where: { id: entityId },
              data: { workflowInstanceId: instance.id },
            });
            break;
        }
      }

      // Notify approvers for the first step
      const firstStepDef = definition.steps[0];
      if (firstStepDef?.approverRole) {
        const approvers = await db.user.findMany({
          where: { role: firstStepDef.approverRole },
        });

        for (const approver of approvers) {
          await db.notification.create({
            data: {
              title: 'Workflow Action Required',
              message: `A ${definition.name} workflow requires your approval (Step: ${firstStepDef.name})`,
              type: 'workflow',
              category: 'approval',
              userId: approver.id,
              actionUrl: `/workflows/${instance.id}`,
            },
          });
        }
      }

      await db.auditLog.create({
        data: {
          action: 'CREATE',
          entity: 'WorkflowInstance',
          entityId: instance.id,
          userId: initiatedBy,
          details: `Workflow instance initiated: ${definition.name}`,
        },
      });

      return NextResponse.json(instance, { status: 201 });
    }
  } catch (error) {
    console.error('Workflows POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH: Process a workflow step (approve/reject)
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { instanceId, action, actionedBy, comments } = body;

    if (!instanceId || !action || !actionedBy) {
      return NextResponse.json(
        { error: 'Missing required fields: instanceId, action (approve/reject), actionedBy' },
        { status: 400 }
      );
    }

    const instance = await db.workflowInstance.findUnique({
      where: { id: instanceId },
      include: {
        workflowDef: {
          include: { steps: { orderBy: { stepOrder: 'asc' } } },
        },
        steps: { orderBy: { stepOrder: 'asc' } },
      },
    });

    if (!instance) {
      return NextResponse.json(
        { error: 'Workflow instance not found' },
        { status: 404 }
      );
    }

    if (instance.status !== 'pending') {
      return NextResponse.json(
        { error: 'Workflow instance is not in pending status' },
        { status: 400 }
      );
    }

    const currentStepInstance = instance.steps.find(
      (s) => s.stepOrder === instance.currentStep
    );

    if (!currentStepInstance) {
      return NextResponse.json(
        { error: 'Current step not found' },
        { status: 400 }
      );
    }

    if (currentStepInstance.status !== 'pending') {
      return NextResponse.json(
        { error: 'Current step has already been processed' },
        { status: 400 }
      );
    }

    const stepStatus = action === 'approve' ? 'approved' : 'rejected';

    // Update the current step
    await db.workflowStepInstance.update({
      where: { id: currentStepInstance.id },
      data: {
        status: stepStatus,
        actionedBy,
        comments,
        actedAt: new Date(),
      },
    });

    if (action === 'approve') {
      // Check if there's a next step
      const nextStepInstance = instance.steps.find(
        (s) => s.stepOrder === instance.currentStep + 1
      );

      if (nextStepInstance) {
        // Advance to next step
        await db.workflowInstance.update({
          where: { id: instanceId },
          data: { currentStep: instance.currentStep + 1 },
        });

        // Notify approvers for the next step
        const nextStepDef = instance.workflowDef.steps.find(
          (s) => s.stepOrder === instance.currentStep + 1
        );

        if (nextStepDef?.approverRole) {
          const approvers = await db.user.findMany({
            where: { role: nextStepDef.approverRole },
          });

          for (const approver of approvers) {
            await db.notification.create({
              data: {
                title: 'Workflow Action Required',
                message: `A ${instance.workflowDef.name} workflow requires your approval (Step: ${nextStepDef.name})`,
                type: 'workflow',
                category: 'approval',
                userId: approver.id,
                actionUrl: `/workflows/${instanceId}`,
              },
            });
          }
        }
      } else {
        // No more steps - complete the workflow
        await db.workflowInstance.update({
          where: { id: instanceId },
          data: { status: 'approved' },
        });

        // Update the related entity status
        const entity = instance.workflowDef.entity;
        await updateEntityStatus(entity, instanceId, 'approved');
      }
    } else {
      // Rejected - mark the instance as rejected
      await db.workflowInstance.update({
        where: { id: instanceId },
        data: { status: 'rejected' },
      });

      // Update the related entity status
      const entity = instance.workflowDef.entity;
      await updateEntityStatus(entity, instanceId, 'rejected');
    }

    // Notify the initiator
    const initiatorUser = await db.user.findFirst({
      where: { employee: { id: instance.initiatedBy } },
    });

    if (initiatorUser) {
      const isComplete = action === 'approve'
        ? !instance.steps.find((s) => s.stepOrder === instance.currentStep + 1)
        : true;

      if (isComplete) {
        await db.notification.create({
          data: {
            title: `Workflow ${action === 'approve' ? 'Approved' : 'Rejected'}`,
            message: `Your ${instance.workflowDef.name} workflow has been ${action === 'approve' ? 'approved' : 'rejected'}`,
            type: 'workflow',
            category: 'status_update',
            userId: initiatorUser.id,
            actionUrl: `/workflows/${instanceId}`,
          },
        });
      }
    }

    // Fetch the updated instance
    const updatedInstance = await db.workflowInstance.findUnique({
      where: { id: instanceId },
      include: {
        workflowDef: true,
        steps: { orderBy: { stepOrder: 'asc' } },
      },
    });

    await db.auditLog.create({
      data: {
        action: action === 'approve' ? 'APPROVE' : 'REJECT',
        entity: 'WorkflowInstance',
        entityId: instanceId,
        userId: actionedBy,
        details: `Workflow step ${stepStatus}: ${comments || 'No comment'}`,
      },
    });

    return NextResponse.json(updatedInstance);
  } catch (error) {
    console.error('Workflows PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to update entity status based on workflow entity type
async function updateEntityStatus(entity: string, workflowInstanceId: string, status: string) {
  switch (entity) {
    case 'leave': {
      const leave = await db.leave.findFirst({
        where: { workflowInstanceId },
      });
      if (leave) {
        await db.leave.update({
          where: { id: leave.id },
          data: { status },
        });
      }
      break;
    }
    case 'travel': {
      const travel = await db.travelRequest.findFirst({
        where: { workflowInstanceId },
      });
      if (travel) {
        await db.travelRequest.update({
          where: { id: travel.id },
          data: { status },
        });
      }
      break;
    }
    case 'expense': {
      const expense = await db.expenseClaim.findFirst({
        where: { workflowInstanceId },
      });
      if (expense) {
        await db.expenseClaim.update({
          where: { id: expense.id },
          data: { status },
        });
      }
      break;
    }
  }
}
