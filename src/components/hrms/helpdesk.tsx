'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Headphones, Plus, Search, Clock, CheckCircle2, AlertCircle,
  MessageSquare, ArrowUp, ArrowRight, ArrowDown, Filter
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const TICKETS = [
  { id: 'TK-001', subject: 'Unable to access VPN', category: 'IT Support', priority: 'high', status: 'open', created: '2 hours ago', assignee: 'IT Team', sla: '2h remaining' },
  { id: 'TK-002', subject: 'Payroll discrepancy for December', category: 'Payroll', priority: 'high', status: 'in_progress', created: '4 hours ago', assignee: 'Finance Team', sla: '1h remaining' },
  { id: 'TK-003', subject: 'Leave balance not updated', category: 'HR', priority: 'medium', status: 'open', created: '6 hours ago', assignee: 'HR Team', sla: '6h remaining' },
  { id: 'TK-004', subject: 'Laptop keyboard not working', category: 'IT Support', priority: 'medium', status: 'in_progress', created: '1 day ago', assignee: 'IT Team', sla: '4h remaining' },
  { id: 'TK-005', subject: 'New badge request', category: 'Admin', priority: 'low', status: 'resolved', created: '2 days ago', assignee: 'Admin Team', sla: 'Met' },
  { id: 'TK-006', subject: 'Benefits enrollment question', category: 'HR', priority: 'low', status: 'resolved', created: '3 days ago', assignee: 'HR Team', sla: 'Met' },
  { id: 'TK-007', subject: 'Expense approval delay', category: 'Finance', priority: 'medium', status: 'open', created: '5 hours ago', assignee: 'Finance Team', sla: '12h remaining' },
  { id: 'TK-008', subject: 'Office temperature issue - Floor 3', category: 'Facilities', priority: 'low', status: 'open', created: '1 day ago', assignee: 'Facilities', sla: '24h remaining' },
];

const PRIORITY_CONFIG: Record<string, { icon: React.ReactNode; color: string }> = {
  high: { icon: <ArrowUp className="h-3.5 w-3.5" />, color: 'bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400' },
  medium: { icon: <ArrowRight className="h-3.5 w-3.5" />, color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400' },
  low: { icon: <ArrowDown className="h-3.5 w-3.5" />, color: 'bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400' },
};

const STATUS_COLORS: Record<string, string> = {
  open: 'bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400',
  in_progress: 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400',
  resolved: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400',
  closed: 'bg-slate-100 text-slate-800 dark:bg-slate-950/30 dark:text-slate-400',
};

const CATEGORY_DATA = [
  { name: 'IT Support', value: 35, color: '#059669' },
  { name: 'HR', value: 25, color: '#3b82f6' },
  { name: 'Finance', value: 15, color: '#f59e0b' },
  { name: 'Admin', value: 15, color: '#8b5cf6' },
  { name: 'Facilities', value: 10, color: '#ef4444' },
];

export function Helpdesk() {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filteredTickets = TICKETS.filter(t => {
    const matchesSearch = t.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Helpdesk</h1>
          <p className="text-muted-foreground text-sm">Manage support tickets and SLA compliance</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-2" /> Create Ticket
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <AlertCircle className="h-5 w-5 mx-auto text-blue-600 mb-1" />
            <p className="text-2xl font-bold">{TICKETS.filter(t => t.status === 'open').length}</p>
            <p className="text-xs text-muted-foreground">Open Tickets</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-5 w-5 mx-auto text-amber-600 mb-1" />
            <p className="text-2xl font-bold">{TICKETS.filter(t => t.status === 'in_progress').length}</p>
            <p className="text-xs text-muted-foreground">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="h-5 w-5 mx-auto text-emerald-600 mb-1" />
            <p className="text-2xl font-bold">{TICKETS.filter(t => t.status === 'resolved').length}</p>
            <p className="text-xs text-muted-foreground">Resolved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <MessageSquare className="h-5 w-5 mx-auto text-teal-600 mb-1" />
            <p className="text-2xl font-bold">92%</p>
            <p className="text-xs text-muted-foreground">SLA Compliance</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Ticket List */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search tickets..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full sm:w-36">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto space-y-2">
            {filteredTickets.map(ticket => (
              <div key={ticket.id} className="p-3 rounded-lg border border-border hover:bg-accent/30 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">{ticket.id}</span>
                    <Badge className={`text-[10px] ${PRIORITY_CONFIG[ticket.priority].color}`}>
                      {PRIORITY_CONFIG[ticket.priority].icon} {ticket.priority}
                    </Badge>
                    <Badge className={`text-[10px] ${STATUS_COLORS[ticket.status]}`}>{ticket.status.replace('_', ' ')}</Badge>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{ticket.created}</span>
                </div>
                <p className="text-sm font-medium">{ticket.subject}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span>{ticket.category}</span>
                  <span>·</span>
                  <span>{ticket.assignee}</span>
                  <span>·</span>
                  <span className={ticket.sla === 'Met' ? 'text-emerald-600' : ticket.sla.includes('1h') ? 'text-red-600' : 'text-amber-600'}>
                    SLA: {ticket.sla}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={CATEGORY_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={85} dataKey="value" paddingAngle={2}>
                  {CATEGORY_DATA.map((entry, index) => (
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
    </div>
  );
}
