'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Target, Award, Brain, ChevronRight, Star, Users, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const OKRS = [
  { id: 1, objective: 'Improve Engineering Team Productivity', keyResults: [
    { kr: 'Reduce sprint cycle time by 20%', progress: 75 },
    { kr: 'Increase code review turnaround by 30%', progress: 60 },
    { kr: 'Achieve 95% sprint completion rate', progress: 88 },
  ], owner: 'Sarah Johnson', overall: 74 },
  { id: 2, objective: 'Enhance Employee Engagement Score', keyResults: [
    { kr: 'Achieve eNPS score of 50+', progress: 65 },
    { kr: 'Reduce voluntary attrition by 15%', progress: 50 },
    { kr: 'Complete 90% pulse survey participation', progress: 82 },
  ], owner: 'Raj Patel', overall: 66 },
  { id: 3, objective: 'Streamline Recruitment Process', keyResults: [
    { kr: 'Reduce time-to-hire to 25 days', progress: 70 },
    { kr: 'Increase offer acceptance rate to 85%', progress: 90 },
    { kr: 'Achieve 80% AI screening accuracy', progress: 85 },
  ], owner: 'Emily Chen', overall: 82 },
];

const REVIEW_CYCLES = [
  { name: 'Q4 2024 Performance Review', period: 'Oct - Dec 2024', status: 'completed', completion: 100 },
  { name: 'Q1 2025 Mid-Year Review', period: 'Jan - Mar 2025', status: 'in_progress', completion: 45 },
  { name: 'Q2 2025 Annual Review', period: 'Apr - Jun 2025', status: 'upcoming', completion: 0 },
];

const PERFORMANCE_DISTRIBUTION = [
  { rating: 'Exceptional', count: 8, color: '#059669' },
  { rating: 'Exceeds', count: 22, color: '#10b981' },
  { rating: 'Meets', count: 45, color: '#f59e0b' },
  { rating: 'Needs Improvement', count: 15, color: '#f97316' },
  { rating: 'Below', count: 5, color: '#ef4444' },
];

const performanceTrendData = [
  { quarter: 'Q1 2024', avg: 3.6 },
  { quarter: 'Q2 2024', avg: 3.7 },
  { quarter: 'Q3 2024', avg: 3.8 },
  { quarter: 'Q4 2024', avg: 3.9 },
  { quarter: 'Q1 2025', avg: 4.0 },
];

export function Performance() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Performance Management</h1>
          <p className="text-muted-foreground text-sm">Track OKRs, manage reviews, and drive growth</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Target className="h-4 w-4 mr-2" /> Create OKR
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-5 w-5 mx-auto text-emerald-600 mb-1" />
            <p className="text-2xl font-bold">{OKRS.length}</p>
            <p className="text-xs text-muted-foreground">Active OKRs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="h-5 w-5 mx-auto text-amber-600 mb-1" />
            <p className="text-2xl font-bold">4.0</p>
            <p className="text-xs text-muted-foreground">Avg Rating</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-5 w-5 mx-auto text-blue-600 mb-1" />
            <p className="text-2xl font-bold">45%</p>
            <p className="text-xs text-muted-foreground">Review Completion</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="h-5 w-5 mx-auto text-purple-600 mb-1" />
            <p className="text-2xl font-bold">8</p>
            <p className="text-xs text-muted-foreground">Top Performers</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="okrs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="okrs">OKR Tracking</TabsTrigger>
          <TabsTrigger value="reviews">Review Cycles</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="okrs" className="space-y-4">
          {OKRS.map(okr => (
            <Card key={okr.id}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-semibold text-sm">{okr.objective}</h3>
                    <p className="text-xs text-muted-foreground">Owner: {okr.owner}</p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400">
                    {okr.overall}% Complete
                  </Badge>
                </div>
                <div className="space-y-2">
                  {okr.keyResults.map((kr, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">{kr.kr}</span>
                        <span className="font-medium">{kr.progress}%</span>
                      </div>
                      <Progress value={kr.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          {REVIEW_CYCLES.map(cycle => (
            <Card key={cycle.name}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-sm">{cycle.name}</h3>
                    <p className="text-xs text-muted-foreground">{cycle.period}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={
                      cycle.status === 'completed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400' :
                      cycle.status === 'in_progress' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400' :
                      'bg-slate-100 text-slate-800 dark:bg-slate-950/30 dark:text-slate-400'
                    }>
                      {cycle.status.replace('_', ' ')}
                    </Badge>
                    <div className="w-32">
                      <Progress value={cycle.completion} className="h-2" />
                    </div>
                    <span className="text-xs text-muted-foreground">{cycle.completion}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Performance Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={PERFORMANCE_DISTRIBUTION} cx="50%" cy="50%" outerRadius={90} dataKey="count" nameKey="rating" paddingAngle={2}>
                      {PERFORMANCE_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Performance Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={performanceTrendData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="quarter" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="avg" fill="#059669" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Brain className="h-4 w-4 text-emerald-600" /> AI Performance Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg border border-border bg-emerald-50/50 dark:bg-emerald-950/20">
                <p className="text-sm font-medium">🎯 High Potential Identified</p>
                <p className="text-xs text-muted-foreground mt-1">3 employees in Engineering show exceptional growth trajectory. Recommend for leadership development program.</p>
              </div>
              <div className="p-3 rounded-lg border border-border bg-amber-50/50 dark:bg-amber-950/20">
                <p className="text-sm font-medium">⚠️ Performance Risk</p>
                <p className="text-xs text-muted-foreground mt-1">5 employees have declining performance scores over 2 quarters. Suggest intervention meetings.</p>
              </div>
              <div className="p-3 rounded-lg border border-border bg-blue-50/50 dark:bg-blue-950/20">
                <p className="text-sm font-medium">📊 Calibration Recommendation</p>
                <p className="text-xs text-muted-foreground mt-1">Sales team ratings are 15% above company average. Consider calibration session for consistency.</p>
              </div>
              <div className="p-3 rounded-lg border border-border bg-purple-50/50 dark:bg-purple-950/20">
                <p className="text-sm font-medium">💡 Skill Development</p>
                <p className="text-xs text-muted-foreground mt-1">Leadership skills gap identified in 12 mid-level managers. Recommend enrolling in management training.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
