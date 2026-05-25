'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Workflow, Play, Pause, Plus, Zap, ArrowRight, CheckCircle2,
  Clock, Settings, GripVertical, Eye, BarChart3
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const WORKFLOW_TEMPLATES = [
  { id: 1, name: 'Employee Onboarding', description: 'Complete onboarding flow with IT setup, HR docs, and manager tasks', steps: 8, category: 'HR', usageCount: 45 },
  { id: 2, name: 'Leave Approval', description: 'Multi-level leave approval with auto-escalation', steps: 4, category: 'HR', usageCount: 120 },
  { id: 3, name: 'Expense Claim Processing', description: 'Expense submission, verification, and payment', steps: 5, category: 'Finance', usageCount: 89 },
  { id: 4, name: 'Performance Review Cycle', description: '360-degree review collection and calibration', steps: 6, category: 'HR', usageCount: 34 },
  { id: 5, name: 'Asset Allocation', description: 'Asset request, approval, allocation, and tracking', steps: 5, category: 'IT', usageCount: 67 },
  { id: 6, name: 'Offboarding Process', description: 'Complete exit workflow with knowledge transfer', steps: 10, category: 'HR', usageCount: 23 },
];

const ACTIVE_WORKFLOWS = [
  { id: 'aw1', name: 'Onboarding: Michael Brown', type: 'Employee Onboarding', currentStep: 3, totalSteps: 8, status: 'active', startedAt: 'Jan 15, 2025' },
  { id: 'aw2', name: 'Leave: Sarah Johnson', type: 'Leave Approval', currentStep: 2, totalSteps: 4, status: 'waiting', startedAt: 'Jan 20, 2025' },
  { id: 'aw3', name: 'Expense: Raj Patel', type: 'Expense Claim Processing', currentStep: 4, totalSteps: 5, status: 'active', startedAt: 'Jan 18, 2025' },
  { id: 'aw4', name: 'Offboarding: Carlos Rodriguez', type: 'Offboarding Process', currentStep: 5, totalSteps: 10, status: 'active', startedAt: 'Jan 10, 2025' },
  { id: 'aw5', name: 'Asset: Emily Chen', type: 'Asset Allocation', currentStep: 2, totalSteps: 5, status: 'waiting', startedAt: 'Jan 22, 2025' },
];

const workflowAnalytics = [
  { name: 'Onboarding', completed: 42, pending: 3, avgDays: 5.2 },
  { name: 'Leave', completed: 118, pending: 5, avgDays: 1.5 },
  { name: 'Expense', completed: 85, pending: 7, avgDays: 3.1 },
  { name: 'Performance', completed: 30, pending: 8, avgDays: 12 },
  { name: 'Asset', completed: 62, pending: 4, avgDays: 2.3 },
  { name: 'Offboarding', completed: 20, pending: 2, avgDays: 8.5 },
];

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400',
  waiting: 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400',
  paused: 'bg-slate-100 text-slate-800 dark:bg-slate-950/30 dark:text-slate-400',
  completed: 'bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400',
};

export function Workflow() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Workflow Builder</h1>
          <p className="text-muted-foreground text-sm">Automate HR processes with visual workflows</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-2" /> Create Workflow
        </Button>
      </div>

      <Tabs defaultValue="builder" className="space-y-4">
        <TabsList>
          <TabsTrigger value="builder">Visual Builder</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="active">Active Workflows</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Visual Builder Placeholder */}
        <TabsContent value="builder">
          <Card>
            <CardContent className="p-8">
              <div className="border-2 border-dashed border-emerald-300 dark:border-emerald-700 rounded-xl p-8 text-center bg-emerald-50/50 dark:bg-emerald-950/10">
                <Workflow className="h-16 w-16 mx-auto text-emerald-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Drag & Drop Workflow Builder</h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                  Build automated workflows by dragging action blocks, conditions, and triggers onto the canvas.
                  Connect steps to create powerful HR process automations.
                </p>
                <div className="flex flex-wrap justify-center gap-3 mb-6">
                  {['Trigger', 'Condition', 'Action', 'Delay', 'Approval', 'Notification'].map(step => (
                    <div key={step} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-lg border border-border shadow-sm cursor-grab hover:shadow-md transition-shadow">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{step}</span>
                    </div>
                  ))}
                </div>
                {/* Visual Flow Preview */}
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <div className="px-4 py-2 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 rounded-lg text-sm font-medium border border-emerald-200 dark:border-emerald-800">
                    🚀 Trigger
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <div className="px-4 py-2 bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-medium border border-blue-200 dark:border-blue-800">
                    ❓ Condition
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <div className="px-4 py-2 bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 rounded-lg text-sm font-medium border border-amber-200 dark:border-amber-800">
                    ✅ Approval
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <div className="px-4 py-2 bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 rounded-lg text-sm font-medium border border-purple-200 dark:border-purple-800">
                    📧 Notify
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <div className="px-4 py-2 bg-teal-100 dark:bg-teal-950/30 text-teal-700 dark:text-teal-400 rounded-lg text-sm font-medium border border-teal-200 dark:border-teal-800">
                    🎯 Action
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {WORKFLOW_TEMPLATES.map(template => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-[10px]">{template.category}</Badge>
                    <span className="text-xs text-muted-foreground">{template.steps} steps</span>
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{template.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{template.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Used {template.usageCount} times</span>
                    <Button size="sm" variant="outline">Use Template</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-3">
          {ACTIVE_WORKFLOWS.map(wf => (
            <Card key={wf.id}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-sm">{wf.name}</h3>
                    <p className="text-xs text-muted-foreground">{wf.type} · Started {wf.startedAt}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: wf.totalSteps }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-3 rounded-full ${
                            i < wf.currentStep ? 'bg-emerald-500' : 'bg-muted'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">Step {wf.currentStep}/{wf.totalSteps}</span>
                    <Badge className={`text-[10px] ${STATUS_COLORS[wf.status]}`}>{wf.status}</Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-emerald-600" /> Workflow Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={workflowAnalytics}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="completed" fill="#059669" radius={[2, 2, 0, 0]} name="Completed" />
                  <Bar dataKey="pending" fill="#f59e0b" radius={[2, 2, 0, 0]} name="Pending" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
