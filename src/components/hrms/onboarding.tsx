'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  UserPlus, CheckCircle2, Clock, FileText, Laptop,
  Users, BookOpen, ClipboardList, ChevronRight, Plus
} from 'lucide-react';

const ONBOARDING_EMPLOYEES = [
  { id: 'ob1', name: 'Michael Brown', designation: 'DevOps Lead', department: 'Engineering', startDate: '2024-09-01', progress: 75, status: 'in_progress', tasks: { total: 12, completed: 9 } },
  { id: 'ob2', name: 'Sarah Miller', designation: 'Marketing Manager', department: 'Marketing', startDate: '2025-02-01', progress: 20, status: 'in_progress', tasks: { total: 12, completed: 2 } },
  { id: 'ob3', name: 'Kevin Zhang', designation: 'Data Analyst', department: 'Analytics', startDate: '2025-02-10', progress: 0, status: 'upcoming', tasks: { total: 12, completed: 0 } },
  { id: 'ob4', name: 'Amy Johnson', designation: 'UX Designer', department: 'Design', startDate: '2024-12-01', progress: 100, status: 'completed', tasks: { total: 12, completed: 12 } },
];

const ONBOARDING_TASKS = [
  { id: 't1', category: 'Documentation', task: 'Complete employment contract signing', assignee: 'HR', status: 'completed', icon: <FileText className="h-4 w-4" /> },
  { id: 't2', category: 'Documentation', task: 'Submit ID documents and tax forms', assignee: 'Employee', status: 'completed', icon: <FileText className="h-4 w-4" /> },
  { id: 't3', category: 'IT Setup', task: 'Provision laptop and accounts', assignee: 'IT', status: 'completed', icon: <Laptop className="h-4 w-4" /> },
  { id: 't4', category: 'IT Setup', task: 'Email and Slack access', assignee: 'IT', status: 'completed', icon: <Laptop className="h-4 w-4" /> },
  { id: 't5', category: 'Orientation', task: 'Company culture presentation', assignee: 'HR', status: 'completed', icon: <Users className="h-4 w-4" /> },
  { id: 't6', category: 'Orientation', task: 'Office tour and team introductions', assignee: 'Manager', status: 'completed', icon: <Users className="h-4 w-4" /> },
  { id: 't7', category: 'Training', task: 'Complete compliance training', assignee: 'Employee', status: 'in_progress', icon: <BookOpen className="h-4 w-4" /> },
  { id: 't8', category: 'Training', task: 'Department-specific onboarding', assignee: 'Manager', status: 'pending', icon: <BookOpen className="h-4 w-4" /> },
  { id: 't9', category: 'Setup', task: 'Benefits enrollment', assignee: 'HR', status: 'pending', icon: <ClipboardList className="h-4 w-4" /> },
  { id: 't10', category: 'Setup', task: 'Emergency contacts setup', assignee: 'Employee', status: 'pending', icon: <ClipboardList className="h-4 w-4" /> },
  { id: 't11', category: 'Review', task: '30-day check-in meeting', assignee: 'Manager', status: 'pending', icon: <CheckCircle2 className="h-4 w-4" /> },
  { id: 't12', category: 'Review', task: 'Probation goals setting', assignee: 'Manager', status: 'pending', icon: <CheckCircle2 className="h-4 w-4" /> },
];

const STATUS_COLORS: Record<string, string> = {
  completed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400',
  in_progress: 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400',
  pending: 'bg-slate-100 text-slate-800 dark:bg-slate-950/30 dark:text-slate-400',
  upcoming: 'bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400',
};

const TASK_STATUS_COLORS: Record<string, string> = {
  completed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400',
  in_progress: 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400',
  pending: 'bg-slate-100 text-slate-800 dark:bg-slate-950/30 dark:text-slate-400',
};

export function Onboarding() {
  const [selectedEmployee, setSelectedEmployee] = useState(ONBOARDING_EMPLOYEES[0]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Onboarding</h1>
          <p className="text-muted-foreground text-sm">Manage new employee onboarding process</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-2" /> Start Onboarding
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <UserPlus className="h-5 w-5 mx-auto text-emerald-600 mb-1" />
            <p className="text-2xl font-bold">{ONBOARDING_EMPLOYEES.filter(e => e.status === 'in_progress').length}</p>
            <p className="text-xs text-muted-foreground">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-5 w-5 mx-auto text-blue-600 mb-1" />
            <p className="text-2xl font-bold">{ONBOARDING_EMPLOYEES.filter(e => e.status === 'upcoming').length}</p>
            <p className="text-xs text-muted-foreground">Upcoming</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="h-5 w-5 mx-auto text-teal-600 mb-1" />
            <p className="text-2xl font-bold">{ONBOARDING_EMPLOYEES.filter(e => e.status === 'completed').length}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <ClipboardList className="h-5 w-5 mx-auto text-amber-600 mb-1" />
            <p className="text-2xl font-bold">75%</p>
            <p className="text-xs text-muted-foreground">Avg Completion</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Employee List */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">New Hires</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-96 overflow-y-auto">
            {ONBOARDING_EMPLOYEES.map(emp => (
              <div
                key={emp.id}
                onClick={() => setSelectedEmployee(emp)}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedEmployee.id === emp.id ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20' : 'border-border hover:bg-accent/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <p className="text-sm font-medium">{emp.name}</p>
                    <p className="text-xs text-muted-foreground">{emp.designation} · {emp.department}</p>
                  </div>
                  <Badge className={`text-[10px] ${STATUS_COLORS[emp.status]}`}>{emp.status.replace('_', ' ')}</Badge>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Progress value={emp.progress} className="h-1.5 flex-1" />
                  <span className="text-[10px] text-muted-foreground">{emp.progress}%</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">Start: {emp.startDate} · {emp.tasks.completed}/{emp.tasks.total} tasks</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Task Checklist */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Onboarding Checklist — {selectedEmployee.name}</CardTitle>
                <CardDescription>{selectedEmployee.designation} · {selectedEmployee.department}</CardDescription>
              </div>
              <Badge className={STATUS_COLORS[selectedEmployee.status]}>{selectedEmployee.status.replace('_', ' ')}</Badge>
            </div>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto space-y-2">
            {ONBOARDING_TASKS.map(task => (
              <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/30 transition-colors">
                <button className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  task.status === 'completed' ? 'bg-emerald-500 border-emerald-500' :
                  task.status === 'in_progress' ? 'border-amber-500' : 'border-muted-foreground/30'
                }`}>
                  {task.status === 'completed' && <CheckCircle2 className="h-3 w-3 text-white" />}
                  {task.status === 'in_progress' && <div className="w-2 h-2 rounded-full bg-amber-500" />}
                </button>
                <div className="flex-1">
                  <p className={`text-sm ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>{task.task}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary" className="text-[10px] h-4">{task.category}</Badge>
                    <span>Assignee: {task.assignee}</span>
                  </div>
                </div>
                <Badge className={`text-[10px] ${TASK_STATUS_COLORS[task.status]}`}>{task.status.replace('_', ' ')}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
