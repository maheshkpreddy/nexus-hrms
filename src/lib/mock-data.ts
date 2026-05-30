// Backward compatibility - re-exports from demo-data.ts
// Product: NEXUS HRMS
export { DEMO_COMPANIES, DEMO_BRANCHES, DEMO_DEPARTMENTS, DEMO_EMPLOYEES, DEMO_JOBS, DEMO_CANDIDATES, DEMO_INTERVIEWS, DEMO_ATTENDANCE, DEMO_LEAVES, DEMO_PAYROLL, DEMO_GOALS, DEMO_ASSETS, DEMO_TRAVEL, DEMO_EXPENSES, DEMO_LEARNING, DEMO_TICKETS, DEMO_CLIENTS, DEMO_VENDORS, DEMO_COMPLIANCE, DEMO_WORKFLOWS, DEMO_SURVEYS, DEMO_SHIFTS, DEMO_ONBOARDING, DEMO_NOTIFICATIONS, DEMO_AUDIT_LOGS, DEMO_ALUMNI, DEMO_DASHBOARD_STATS } from './demo-data';

// Legacy aliases for backward compatibility with components that still import these names
import { DEMO_EMPLOYEES, DEMO_JOBS, DEMO_CANDIDATES, DEMO_ATTENDANCE, DEMO_LEAVES, DEMO_PAYROLL, DEMO_CLIENTS, DEMO_VENDORS } from './demo-data';

export const MOCK_EMPLOYEES = DEMO_EMPLOYEES;
export const MOCK_JOBS = DEMO_JOBS;
export const MOCK_CANDIDATES = DEMO_CANDIDATES;
export const MOCK_ATTENDANCE = DEMO_ATTENDANCE;
export const MOCK_LEAVES = DEMO_LEAVES;
export const MOCK_PAYROLL = DEMO_PAYROLL;
export const MOCK_CLIENTS = DEMO_CLIENTS;
export const MOCK_VENDORS = DEMO_VENDORS;

export const ANALYTICS_DATA = {
  headcount: {
    months: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
    values: [2200, 2280, 2310, 2380, 2420, 2440, 2450],
  },
  attrition: {
    months: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
    values: [3.2, 2.8, 3.5, 2.9, 3.1, 2.7, 2.4],
  },
  hiring: {
    months: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
    applied: [320, 280, 350, 410, 380, 290, 340],
    interviewed: [85, 72, 90, 105, 98, 75, 88],
    hired: [22, 18, 25, 30, 28, 20, 24],
  },
  departmentDistribution: [
    { name: 'Engineering', value: 680, color: '#10b981' },
    { name: 'Sales', value: 420, color: '#f59e0b' },
    { name: 'Operations', value: 380, color: '#ef4444' },
    { name: 'HR', value: 150, color: '#8b5cf6' },
    { name: 'Finance', value: 120, color: '#06b6d4' },
    { name: 'Design', value: 90, color: '#f97316' },
    { name: 'Others', value: 610, color: '#6b7280' },
  ],
  attendanceOverview: [
    { name: 'Present', value: 88, color: '#10b981' },
    { name: 'Absent', value: 4, color: '#ef4444' },
    { name: 'Late', value: 3, color: '#f59e0b' },
    { name: 'On Leave', value: 5, color: '#3b82f6' },
  ],
  payrollCost: {
    months: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
    values: [2.8, 2.85, 2.9, 2.95, 3.0, 3.05, 3.1],
  },
};
