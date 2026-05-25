'use client';

import React from 'react';
import { useAppStore } from '@/store/app-store';
import { ANALYTICS_DATA, MOCK_EMPLOYEES, MOCK_JOBS, MOCK_ATTENDANCE, MOCK_LEAVES } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Users, UserPlus, Briefcase, TrendingDown, Clock, CheckSquare,
  Brain, ArrowUpRight, ArrowDownRight, Activity, Sparkles, Zap,
  CalendarCheck, DollarSign, BarChart3
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';

const KPI_CARDS = [
  { label: 'Total Employees', value: '2,450', change: 4.2, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
  { label: 'New Hires (This Month)', value: '24', change: 12.5, icon: UserPlus, color: 'text-teal-600', bg: 'bg-teal-50 dark:bg-teal-950/30' },
  { label: 'Open Positions', value: '18', change: -8.3, icon: Briefcase, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/30' },
  { label: 'Attrition Rate', value: '2.4%', change: -0.8, icon: TrendingDown, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950/30' },
  { label: 'Attendance Today', value: '88%', change: 1.2, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/30' },
  { label: 'Pending Approvals', value: '12', change: -25, icon: CheckSquare, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950/30' },
];

const QUICK_ACTIONS = [
  { label: 'Add Employee', icon: UserPlus, module: 'employees' as const },
  { label: 'Post Job', icon: Briefcase, module: 'recruitment' as const },
  { label: 'Run Payroll', icon: DollarSign, module: 'payroll' as const },
  { label: 'View Reports', icon: BarChart3, module: 'analytics' as const },
  { label: 'Leave Requests', icon: CalendarCheck, module: 'leave' as const },
  { label: 'AI Assistant', icon: Brain, module: 'ai_chatbot' as const },
];

const RECENT_ACTIVITIES = [
  { text: 'Sarah Johnson submitted a leave request', time: '2 min ago', type: 'info' },
  { text: 'New candidate Alex Turner applied for Senior Developer', time: '15 min ago', type: 'success' },
  { text: 'Payroll for January 2025 processed successfully', time: '1 hour ago', type: 'success' },
  { text: 'Attendance anomaly detected for David Wilson', time: '2 hours ago', type: 'warning' },
  { text: 'Raj Patel completed Performance Review', time: '3 hours ago', type: 'info' },
  { text: 'Emily Chen enrolled in Leadership Program', time: '4 hours ago', type: 'info' },
  { text: 'Asset laptop-0045 allocated to Michael Brown', time: '5 hours ago', type: 'info' },
  { text: '3 new onboarding tasks created', time: '6 hours ago', type: 'success' },
];

const AI_INSIGHTS = [
  { title: 'Attrition Risk Alert', description: '5 employees in Engineering show high attrition risk based on engagement scores and activity patterns.', severity: 'high' },
  { title: 'Hiring Prediction', description: 'Based on current pipeline, expect 22 hires this month — 8% above target.', severity: 'medium' },
  { title: 'Payroll Anomaly', description: 'Overtime costs increased 15% in Operations department. Recommend review.', severity: 'medium' },
  { title: 'Skill Gap Detected', description: 'Cloud Architecture skills deficit in Engineering. Suggest upskilling program.', severity: 'low' },
];

export function Dashboard() {
  const { setActiveModule } = useAppStore();

  const headcountData = ANALYTICS_DATA.headcount.months.map((m, i) => ({
    name: m,
    count: ANALYTICS_DATA.headcount.values[i],
  }));

  const hiringData = ANALYTICS_DATA.hiring.months.map((m, i) => ({
    name: m,
    Applied: ANALYTICS_DATA.hiring.applied[i],
    Interviewed: ANALYTICS_DATA.hiring.interviewed[i],
    Hired: ANALYTICS_DATA.hiring.hired[i],
  }));

  const payrollData = ANALYTICS_DATA.payrollCost.months.map((m, i) => ({
    name: m,
    cost: ANALYTICS_DATA.payrollCost.values[i],
  }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Welcome back! Here&apos;s your HR overview.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800">
            <Activity className="h-3 w-3 mr-1" /> Live
          </Badge>
          <Badge variant="secondary">Jan 2025</Badge>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {KPI_CARDS.map((kpi) => (
          <Card key={kpi.label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${kpi.bg}`}>
                  <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                </div>
                <span className={`text-xs font-medium flex items-center gap-0.5 ${kpi.change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {kpi.change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {Math.abs(kpi.change)}%
                </span>
              </div>
              <p className="text-2xl font-bold">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Headcount Trend */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Headcount Trend</CardTitle>
            <CardDescription>7-month employee headcount trend</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={headcountData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#059669" strokeWidth={2} dot={{ fill: '#059669', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Department Distribution</CardTitle>
            <CardDescription>Employee distribution by department</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={ANALYTICS_DATA.departmentDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {ANALYTICS_DATA.departmentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value} employees`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Hiring Funnel */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Hiring Funnel</CardTitle>
            <CardDescription>Application to hire conversion</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={hiringData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Applied" fill="#94a3b8" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Interviewed" fill="#f59e0b" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Hired" fill="#059669" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payroll Cost Trend */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Payroll Cost Trend</CardTitle>
            <CardDescription>Monthly payroll expenditure (in millions)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={payrollData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value: number) => [`$${value}M`, 'Cost']} />
                <Area type="monotone" dataKey="cost" stroke="#059669" fill="#059669" fillOpacity={0.2} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions + Recent Activities + AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-600" /> Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_ACTIONS.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  className="h-auto py-3 flex flex-col items-center gap-1.5 hover:bg-emerald-50 hover:border-emerald-300 dark:hover:bg-emerald-950/30"
                  onClick={() => setActiveModule(action.module)}
                >
                  <action.icon className="h-5 w-5 text-emerald-600" />
                  <span className="text-xs">{action.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-600" /> Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-72 overflow-y-auto">
            <div className="space-y-3">
              {RECENT_ACTIVITIES.map((activity, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    activity.type === 'success' ? 'bg-emerald-500' :
                    activity.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-snug">{activity.text}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-600" /> AI Insights
            </CardTitle>
            <CardDescription>AI-powered predictions and alerts</CardDescription>
          </CardHeader>
          <CardContent className="max-h-72 overflow-y-auto">
            <div className="space-y-3">
              {AI_INSIGHTS.map((insight, i) => (
                <div key={i} className="p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className={`text-[10px] h-5 ${
                      insight.severity === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400' :
                      insight.severity === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400' :
                      'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400'
                    }`}>
                      {insight.severity}
                    </Badge>
                    <span className="text-sm font-medium">{insight.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{insight.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
