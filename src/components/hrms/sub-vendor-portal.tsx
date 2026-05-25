'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Briefcase, Users, Send, Eye, DollarSign, TrendingUp } from 'lucide-react';

const ASSIGNED_JOBS = [
  { id: 'j1', title: 'Senior Full-Stack Developer', department: 'Engineering', location: 'San Francisco, CA', priority: 'high', deadline: 'Feb 15, 2025', submissions: 3, maxSubmissions: 5 },
  { id: 'j4', title: 'Production Supervisor', department: 'Operations', location: 'Mumbai, India', priority: 'urgent', deadline: 'Feb 10, 2025', submissions: 5, maxSubmissions: 5 },
  { id: 'j6', title: 'Registered Nurse', department: 'Clinical', location: 'London, UK', priority: 'high', deadline: 'Feb 20, 2025', submissions: 1, maxSubmissions: 3 },
];

const MY_CANDIDATES = [
  { id: 'sc1', name: 'Alex Turner', job: 'Senior Full-Stack Developer', status: 'interviewing', submittedDate: 'Jan 10, 2025' },
  { id: 'sc2', name: 'Maria Garcia', job: 'Senior Full-Stack Developer', status: 'screening', submittedDate: 'Jan 15, 2025' },
  { id: 'sc3', name: 'Raj Krishnan', job: 'Production Supervisor', status: 'shortlisted', submittedDate: 'Jan 8, 2025' },
  { id: 'sc4', name: 'Lily Chen', job: 'Production Supervisor', status: 'rejected', submittedDate: 'Jan 12, 2025' },
  { id: 'sc5', name: 'Tom Wilson', job: 'Registered Nurse', status: 'applied', submittedDate: 'Jan 20, 2025' },
];

const COMMISSION_DATA = [
  { month: 'Oct 2024', earned: 1200, pending: 300, paid: 900 },
  { month: 'Nov 2024', earned: 1800, pending: 500, paid: 1300 },
  { month: 'Dec 2024', earned: 1500, pending: 200, paid: 1300 },
  { month: 'Jan 2025', earned: 2200, pending: 800, paid: 1400 },
];

export function SubVendorPortal() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Sub-Vendor Portal</h1>
        <p className="text-muted-foreground text-sm">Manage your candidate submissions and commissions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Briefcase className="h-5 w-5 mx-auto text-emerald-600 mb-1" />
            <p className="text-2xl font-bold">{ASSIGNED_JOBS.length}</p>
            <p className="text-xs text-muted-foreground">Assigned Jobs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-5 w-5 mx-auto text-blue-600 mb-1" />
            <p className="text-2xl font-bold">{MY_CANDIDATES.length}</p>
            <p className="text-xs text-muted-foreground">Candidates Submitted</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-5 w-5 mx-auto text-amber-600 mb-1" />
            <p className="text-2xl font-bold">{Math.round(MY_CANDIDATES.filter(c => c.status === 'shortlisted' || c.status === 'interviewing').length / MY_CANDIDATES.length * 100)}%</p>
            <p className="text-xs text-muted-foreground">Shortlist Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-5 w-5 mx-auto text-purple-600 mb-1" />
            <p className="text-2xl font-bold">$2.2K</p>
            <p className="text-xs text-muted-foreground">This Month Commission</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Assigned Jobs */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Assigned Jobs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ASSIGNED_JOBS.map(job => (
              <div key={job.id} className="p-3 rounded-lg border border-border">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm">{job.title}</h3>
                  <Badge className={`text-[10px] ${job.priority === 'urgent' ? 'bg-red-100 text-red-800' : job.priority === 'high' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'}`}>
                    {job.priority}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{job.department} · {job.location}</p>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span>Submissions: {job.submissions}/{job.maxSubmissions}</span>
                      <span className="text-muted-foreground">Deadline: {job.deadline}</span>
                    </div>
                    <Progress value={(job.submissions / job.maxSubmissions) * 100} className="h-1.5" />
                  </div>
                  {job.submissions < job.maxSubmissions && (
                    <Button size="sm" variant="outline" className="ml-2 h-7"><Send className="h-3 w-3 mr-1" /> Submit</Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* My Candidates */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Candidate Submissions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-96 overflow-y-auto">
            {MY_CANDIDATES.map(candidate => (
              <div key={candidate.id} className="p-3 rounded-lg border border-border hover:bg-accent/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{candidate.name}</p>
                    <p className="text-xs text-muted-foreground">{candidate.job}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-[10px] ${
                      candidate.status === 'shortlisted' ? 'bg-purple-100 text-purple-800' :
                      candidate.status === 'interviewing' ? 'bg-amber-100 text-amber-800' :
                      candidate.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      candidate.status === 'screening' ? 'bg-blue-100 text-blue-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>{candidate.status}</Badge>
                    <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">Submitted: {candidate.submittedDate}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Commission Tracking */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-emerald-600" /> Commission Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {COMMISSION_DATA.map(comm => (
              <div key={comm.month} className="flex items-center gap-4 p-2 rounded-lg">
                <span className="text-sm font-medium w-24">{comm.month}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>Earned: ${comm.earned.toLocaleString()}</span>
                        <span className="text-emerald-600">Paid: ${comm.paid.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${(comm.paid / comm.earned) * 100}%` }} />
                      </div>
                    </div>
                    <Badge className={`text-[10px] ${comm.pending > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                      {comm.pending > 0 ? `$${comm.pending} pending` : 'Fully paid'}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
