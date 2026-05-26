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
      return NextResponse.json(
        { error: 'userId query parameter is required' },
        { status: 400 }
      );
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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
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
