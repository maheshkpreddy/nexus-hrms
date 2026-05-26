import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const companyId = url.searchParams.get('companyId');

    const companyFilter = companyId ? { companyId } : {};

    // Total employees
    const totalEmployees = await db.employee.count({
      where: { ...companyFilter, status: 'active' },
    });

    // New hires this month
    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const newHires = await db.employee.count({
      where: {
        ...companyFilter,
        joiningDate: { gte: firstOfMonth },
      },
    });

    // Open positions
    const openPositions = await db.job.count({
      where: {
        ...companyFilter,
        status: 'open',
      },
    });

    // Attendance rate for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const totalAttendanceToday = await db.attendance.count({
      where: {
        date: { gte: today },
        status: 'present',
        employee: companyFilter,
      },
    });
    const expectedAttendance = totalEmployees || 1;
    const attendanceRate = Math.round((totalAttendanceToday / expectedAttendance) * 100);

    // Pending approvals (leaves, expenses, travel)
    const pendingLeaves = await db.leave.count({
      where: {
        status: 'pending',
        employee: companyFilter,
      },
    });
    const pendingExpenses = await db.expenseClaim.count({
      where: {
        status: 'pending',
        employee: companyFilter,
      },
    });
    const pendingTravel = await db.travelRequest.count({
      where: {
        status: 'pending',
        employee: companyFilter,
      },
    });
    const pendingApprovals = pendingLeaves + pendingExpenses + pendingTravel;

    // Recent activities from audit logs
    const recentActivities = await db.auditLog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true, avatar: true },
        },
      },
    });

    // Notifications count (for a specific user if provided)
    const userId = url.searchParams.get('userId');
    let unreadNotifications = 0;
    let recentNotifications: unknown[] = [];
    if (userId) {
      unreadNotifications = await db.notification.count({
        where: { userId, isRead: false },
      });
      recentNotifications = await db.notification.findMany({
        where: { userId },
        take: 5,
        orderBy: { createdAt: 'desc' },
      });
    }

    // Department distribution
    const departmentDistribution = await db.employee.groupBy({
      by: ['departmentId'],
      where: { ...companyFilter, status: 'active' },
      _count: { id: true },
    });

    // Get department names
    const departments = await db.department.findMany({
      where: companyId ? { companyId } : {},
      select: { id: true, name: true },
    });
    const deptMap = new Map(departments.map((d) => [d.id, d.name]));

    const departmentStats = departmentDistribution.map((d) => ({
      departmentId: d.departmentId,
      departmentName: deptMap.get(d.departmentId) || 'Unknown',
      count: d._count.id,
    }));

    return NextResponse.json({
      stats: {
        totalEmployees,
        newHires,
        openPositions,
        attendanceRate,
        pendingApprovals,
        unreadNotifications,
      },
      recentActivities,
      recentNotifications,
      departmentStats,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
