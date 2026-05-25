'use client';

import React, { useState } from 'react';
import { ANALYTICS_DATA } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Brain, Download, TrendingUp, Users, DollarSign, Heart, Briefcase } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const ATTRITION_BY_DEPT = [
  { department: 'Engineering', rate: 3.5 },
  { department: 'Sales', rate: 5.2 },
  { department: 'Operations', rate: 4.1 },
  { department: 'HR', rate: 2.8 },
  { department: 'Finance', rate: 1.9 },
  { department: 'Design', rate: 3.2 },
];

const DIVERSITY_DATA = [
  { category: 'Gender', distribution: [
    { name: 'Male', value: 58, color: '#059669' },
    { name: 'Female', value: 37, color: '#f59e0b' },
    { name: 'Non-Binary', value: 5, color: '#8b5cf6' },
  ]},
  { category: 'Age Group', distribution: [
    { name: '18-25', value: 12, color: '#10b981' },
    { name: '26-35', value: 42, color: '#059669' },
    { name: '36-45', value: 30, color: '#f59e0b' },
    { name: '46-55', value: 12, color: '#3b82f6' },
    { name: '55+', value: 4, color: '#8b5cf6' },
  ]},
];

const ENGAGEMENT_ANALYTICS = [
  { month: 'Aug', score: 72, eNPS: 42 },
  { month: 'Sep', score: 75, eNPS: 45 },
  { month: 'Oct', score: 73, eNPS: 43 },
  { month: 'Nov', score: 76, eNPS: 48 },
  { month: 'Dec', score: 78, eNPS: 50 },
  { month: 'Jan', score: 80, eNPS: 52 },
];

const SALARY_DISTRIBUTION = [
  { range: '<30K', count: 120 },
  { range: '30-50K', count: 380 },
  { range: '50-80K', count: 520 },
  { range: '80-120K', count: 450 },
  { range: '120-180K', count: 320 },
  { range: '180K+', count: 180 },
];

export function Analytics() {
  const [activeTab, setActiveTab] = useState('workforce');

  const headcountData = ANALYTICS_DATA.headcount.months.map((m, i) => ({
    name: m, count: ANALYTICS_DATA.headcount.values[i],
  }));

  const attritionData = ANALYTICS_DATA.attrition.months.map((m, i) => ({
    name: m, rate: ANALYTICS_DATA.attrition.values[i],
  }));

  const hiringData = ANALYTICS_DATA.hiring.months.map((m, i) => ({
    name: m,
    Applied: ANALYTICS_DATA.hiring.applied[i],
    Interviewed: ANALYTICS_DATA.hiring.interviewed[i],
    Hired: ANALYTICS_DATA.hiring.hired[i],
  }));

  const payrollData = ANALYTICS_DATA.payrollCost.months.map((m, i) => ({
    name: m, cost: ANALYTICS_DATA.payrollCost.values[i],
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground text-sm">Comprehensive workforce insights and predictions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export Report</Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700"><Brain className="h-4 w-4 mr-2" /> AI Predictions</Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="workforce" className="text-xs">Workforce</TabsTrigger>
          <TabsTrigger value="attrition" className="text-xs">Attrition</TabsTrigger>
          <TabsTrigger value="hiring" className="text-xs">Hiring</TabsTrigger>
          <TabsTrigger value="payroll" className="text-xs">Payroll</TabsTrigger>
          <TabsTrigger value="diversity" className="text-xs">Diversity</TabsTrigger>
          <TabsTrigger value="engagement" className="text-xs">Engagement</TabsTrigger>
        </TabsList>

        {/* Workforce Analytics */}
        <TabsContent value="workforce" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base">Headcount Trend</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={headcountData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="count" stroke="#059669" fill="#059669" fillOpacity={0.15} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base">Department Distribution</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={ANALYTICS_DATA.departmentDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                      {ANALYTICS_DATA.departmentDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Brain className="h-4 w-4 text-emerald-600" /> AI Workforce Predictions</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg border bg-emerald-50/50 dark:bg-emerald-950/20">
                <p className="text-sm font-medium">📈 Growth Forecast</p>
                <p className="text-xs text-muted-foreground mt-1">Projected headcount of 2,650 by end of Q2 2025 based on current hiring pipeline and attrition trends.</p>
              </div>
              <div className="p-3 rounded-lg border bg-amber-50/50 dark:bg-amber-950/20">
                <p className="text-sm font-medium">⚠️ Capacity Alert</p>
                <p className="text-xs text-muted-foreground mt-1">Engineering department approaching 95% capacity. Consider hiring acceleration.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attrition Analytics */}
        <TabsContent value="attrition" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base">Attrition Rate Trend</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={attritionData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} domain={[0, 5]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="rate" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base">Attrition by Department</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={ATTRITION_BY_DEPT}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="department" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 12 }} domain={[0, 6]} />
                    <Tooltip />
                    <Bar dataKey="rate" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Hiring Analytics */}
        <TabsContent value="hiring" className="space-y-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Hiring Funnel</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
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
        </TabsContent>

        {/* Payroll Analytics */}
        <TabsContent value="payroll" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base">Payroll Cost Trend</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={payrollData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value: number) => [`$${value}M`, 'Cost']} />
                    <Area type="monotone" dataKey="cost" stroke="#059669" fill="#059669" fillOpacity={0.15} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base">Salary Distribution</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={SALARY_DISTRIBUTION}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#059669" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Diversity Analytics */}
        <TabsContent value="diversity" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {DIVERSITY_DATA.map(category => (
              <Card key={category.category}>
                <CardHeader className="pb-2"><CardTitle className="text-base">{category.category} Distribution</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={category.distribution} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={2} dataKey="value">
                        {category.distribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [`${value}%`, 'Percentage']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Engagement Analytics */}
        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Engagement Score & eNPS Trend</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={ENGAGEMENT_ANALYTICS}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="score" stroke="#059669" strokeWidth={2} dot={{ fill: '#059669', r: 4 }} name="Engagement Score" />
                  <Line type="monotone" dataKey="eNPS" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 4 }} name="eNPS" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
