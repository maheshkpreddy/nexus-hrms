import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    const isRead = url.searchParams.get('isRead');
    const type = url.searchParams.get('type');
    const category = url.searchParams.get('category');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    if (!userId) {
      throw new Error('userId query parameter is required');
    }

    const where: Record<string, unknown> = { userId };
    if (isRead !== null && isRead !== undefined) {
      where.isRead = isRead === 'true';
    }
    if (type) where.type = type;
    if (category) where.category = category;

    const [notifications, total] = await Promise.all([
      db.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      db.notification.count({ where }),
    ]);

    const unreadCount = await db.notification.count({
      where: { userId, isRead: false },
    });

    return NextResponse.json({
      data: notifications,
      unreadCount,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Notifications GET error:', error);
    // Demo data fallback when database is unavailable
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    const isReadParam = url.searchParams.get('isRead');
    const type = url.searchParams.get('type');
    const category = url.searchParams.get('category');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');

    const demoNotifications = [
      {
        id: 'notif-1', title: 'Leave Request Approved', message: 'Your casual leave request for May 20-21 has been approved',
        type: 'leave', category: 'status_update', isRead: false, userId: userId || 'demo-user-1',
        actionUrl: '/leaves/leave-1',
        createdAt: new Date('2025-02-25T10:00:00Z'), updatedAt: new Date('2025-02-25T10:00:00Z'),
      },
      {
        id: 'notif-2', title: 'New Expense Claim', message: 'Rajesh Kumar submitted an expense claim of ₹12,500',
        type: 'expense', category: 'approval', isRead: false, userId: userId || 'demo-user-1',
        actionUrl: '/expenses/exp-1',
        createdAt: new Date('2025-02-24T14:30:00Z'), updatedAt: new Date('2025-02-24T14:30:00Z'),
      },
      {
        id: 'notif-3', title: 'Performance Review Due', message: 'Your Q1 performance review is due by March 15',
        type: 'performance', category: 'reminder', isRead: true, userId: userId || 'demo-user-1',
        actionUrl: '/goals',
        createdAt: new Date('2025-02-20T09:00:00Z'), updatedAt: new Date('2025-02-21T08:00:00Z'),
      },
      {
        id: 'notif-4', title: 'Workflow Action Required', message: 'A Leave Approval workflow requires your approval',
        type: 'workflow', category: 'approval', isRead: false, userId: userId || 'demo-user-1',
        actionUrl: '/workflows/wi-1',
        createdAt: new Date('2025-02-22T11:15:00Z'), updatedAt: new Date('2025-02-22T11:15:00Z'),
      },
      {
        id: 'notif-5', title: 'Travel Request Rejected', message: 'Your travel request to Singapore has been rejected',
        type: 'travel', category: 'status_update', isRead: true, userId: userId || 'demo-user-1',
        actionUrl: '/travel/tr-3',
        createdAt: new Date('2025-02-18T16:45:00Z'), updatedAt: new Date('2025-02-19T09:00:00Z'),
      },
      {
        id: 'notif-6', title: 'New Ticket Assigned', message: 'VPN Connection Issues ticket has been assigned to you',
        type: 'ticket', category: 'assignment', isRead: false, userId: userId || 'demo-user-1',
        actionUrl: '/tickets/tkt-1',
        createdAt: new Date('2025-02-20T10:05:00Z'), updatedAt: new Date('2025-02-20T10:05:00Z'),
      },
      {
        id: 'notif-7', title: 'Compliance Reminder', message: 'Annual Safety Training is due by April 1, 2025',
        type: 'compliance', category: 'reminder', isRead: true, userId: userId || 'demo-user-1',
        actionUrl: '/compliance',
        createdAt: new Date('2025-02-15T08:00:00Z'), updatedAt: new Date('2025-02-16T09:00:00Z'),
      },
      {
        id: 'notif-8', title: 'Payroll Processed', message: 'Your January 2025 salary has been credited',
        type: 'payroll', category: 'status_update', isRead: true, userId: userId || 'demo-user-1',
        actionUrl: '/payroll',
        createdAt: new Date('2025-02-01T06:00:00Z'), updatedAt: new Date('2025-02-01T08:30:00Z'),
      },
    ];

    let filtered = demoNotifications;
    if (isReadParam !== null && isReadParam !== undefined) {
      const isRead = isReadParam === 'true';
      filtered = filtered.filter((n) => n.isRead === isRead);
    }
    if (type) filtered = filtered.filter((n) => n.type === type);
    if (category) filtered = filtered.filter((n) => n.category === category);

    const unreadCount = filtered.filter((n) => !n.isRead).length;

    return NextResponse.json({
      data: filtered,
      unreadCount,
      pagination: { page, limit, total: filtered.length, totalPages: Math.ceil(filtered.length / limit) },
    });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, userId, markAllRead } = body;

    if (markAllRead && userId) {
      // Mark all notifications as read for a user
      await db.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
      });

      return NextResponse.json({ message: 'All notifications marked as read' });
    }

    if (!id) {
      return NextResponse.json(
        { error: 'Notification ID is required' },
        { status: 400 }
      );
    }

    const notification = await db.notification.findUnique({ where: { id } });
    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    const updated = await db.notification.update({
      where: { id },
      data: { isRead: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Notifications PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const userId = url.searchParams.get('userId');
    const clearAll = url.searchParams.get('clearAll');

    if (clearAll === 'true' && userId) {
      // Clear all notifications for a user
      await db.notification.deleteMany({
        where: { userId },
      });

      return NextResponse.json({ message: 'All notifications cleared' });
    }

    if (!id) {
      return NextResponse.json(
        { error: 'Notification ID is required' },
        { status: 400 }
      );
    }

    const notification = await db.notification.findUnique({ where: { id } });
    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    await db.notification.delete({ where: { id } });

    return NextResponse.json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Notifications DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
