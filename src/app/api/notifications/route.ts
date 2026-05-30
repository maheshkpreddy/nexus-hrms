import { NextRequest, NextResponse } from 'next/server';
import { DEMO_NOTIFICATIONS } from '@/lib/demo-data';

function filterDemoNotifications(params: { userId?: string | null; isRead?: string | null; type?: string | null; category?: string | null; page: number; limit: number }) {
  let filtered = DEMO_NOTIFICATIONS.map(n => ({ ...n, userId: params.userId || 'demo-admin' }));
  if (params.isRead !== null && params.isRead !== undefined) {
    const isReadVal = params.isRead === 'true';
    filtered = filtered.filter(n => n.isRead === isReadVal);
  }
  if (params.type) filtered = filtered.filter(n => n.type === params.type);
  if (params.category) filtered = filtered.filter(n => n.category === params.category);

  const unreadCount = filtered.filter(n => !n.isRead).length;
  return NextResponse.json({
    data: filtered,
    unreadCount,
    pagination: { page: params.page, limit: params.limit, total: filtered.length, totalPages: Math.ceil(filtered.length / params.limit) },
  });
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const userId = url.searchParams.get('userId');
  const isRead = url.searchParams.get('isRead');
  const type = url.searchParams.get('type');
  const category = url.searchParams.get('category');
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '20');

  try {
    const { db } = await import('@/lib/db');
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

    // If DB has real data, return it
    if (notifications.length > 0 || total > 0) {
      return NextResponse.json({
        data: notifications,
        unreadCount,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      });
    }
  } catch (error) {
    console.error('Notifications GET error, using demo data:', error);
  }

  // Demo data fallback (when DB is empty or unavailable)
  return filterDemoNotifications({ userId, isRead, type, category, page, limit });
}

export async function PATCH(req: NextRequest) {
  try {
    const { db } = await import('@/lib/db');
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
    const { db } = await import('@/lib/db');
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
