'use client';

import React, { useState } from 'react';
import { MOCK_JOBS, MOCK_CANDIDATES } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Briefcase, Users, Search, Filter, Plus, MapPin, DollarSign,
  Clock, Star, Brain, ChevronRight, Eye, MessageSquare, CheckCircle2,
  UserPlus, XCircle, Send, Award
} from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  open: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400',
  interviewing: 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400',
  draft: 'bg-slate-100 text-slate-800 dark:bg-slate-950/30 dark:text-slate-400',
  on_hold: 'bg-orange-100 text-orange-800 dark:bg-orange-950/30 dark:text-orange-400',
  closed: 'bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400',
};

const PRIORITY_COLORS: Record<string, string> = {
  urgent: 'bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400',
  high: 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400',
  medium: 'bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400',
  low: 'bg-slate-100 text-slate-800 dark:bg-slate-950/30 dark:text-slate-400',
};

const PIPELINE_COLUMNS = [
  { key: 'applied', label: 'Applied', icon: <Send className="h-3.5 w-3.5" />, color: 'border-t-blue-500' },
  { key: 'screening', label: 'Screening', icon: <Search className="h-3.5 w-3.5" />, color: 'border-t-amber-500' },
  { key: 'shortlisted', label: 'Shortlisted', icon: <Star className="h-3.5 w-3.5" />, color: 'border-t-purple-500' },
  { key: 'interviewing', label: 'Interviewing', icon: <MessageSquare className="h-3.5 w-3.5" />, color: 'border-t-teal-500' },
  { key: 'offered', label: 'Offered', icon: <Award className="h-3.5 w-3.5" />, color: 'border-t-emerald-500' },
  { key: 'hired', label: 'Hired', icon: <CheckCircle2 className="h-3.5 w-3.5" />, color: 'border-t-green-600' },
];

export function Recruitment() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');

  const filteredJobs = MOCK_JOBS.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    const matchesDept = deptFilter === 'all' || job.department === deptFilter;
    return matchesSearch && matchesStatus && matchesDept;
  });

  const departments = [...new Set(MOCK_JOBS.map(j => j.department))];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Recruitment (ATS)</h1>
          <p className="text-muted-foreground text-sm">Manage job openings and candidate pipeline</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-2" /> New Job Posting
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Briefcase className="h-5 w-5 mx-auto text-emerald-600 mb-1" />
            <p className="text-2xl font-bold">{MOCK_JOBS.filter(j => j.status === 'open').length}</p>
            <p className="text-xs text-muted-foreground">Open Positions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-5 w-5 mx-auto text-blue-600 mb-1" />
            <p className="text-2xl font-bold">{MOCK_CANDIDATES.length}</p>
            <p className="text-xs text-muted-foreground">Active Candidates</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-5 w-5 mx-auto text-amber-600 mb-1" />
            <p className="text-2xl font-bold">{MOCK_CANDIDATES.filter(c => c.status === 'interviewing').length}</p>
            <p className="text-xs text-muted-foreground">In Interview</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="h-5 w-5 mx-auto text-teal-600 mb-1" />
            <p className="text-2xl font-bold">{MOCK_CANDIDATES.filter(c => c.status === 'offered').length}</p>
            <p className="text-xs text-muted-foreground">Offers Extended</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="jobs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="jobs">Job Listings</TabsTrigger>
          <TabsTrigger value="pipeline">Candidate Pipeline</TabsTrigger>
          <TabsTrigger value="ai_scores">AI Scores</TabsTrigger>
        </TabsList>

        {/* Jobs Tab */}
        <TabsContent value="jobs" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="interviewing">Interviewing</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
            <Select value={deptFilter} onValueChange={setDeptFilter}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Job Cards */}
          <div className="space-y-3">
            {filteredJobs.map(job => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm">{job.title}</h3>
                        <Badge className={`text-[10px] ${STATUS_COLORS[job.status] || ''}`}>{job.status}</Badge>
                        <Badge className={`text-[10px] ${PRIORITY_COLORS[job.priority] || ''}`}>{job.priority}</Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{job.department}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                        <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{job.salary}</span>
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" />{job.applicants} applicants</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-3.5 w-3.5 mr-1" /> View
                      </Button>
                      <Button variant="outline" size="sm">
                        <UserPlus className="h-3.5 w-3.5 mr-1" /> Add Candidate
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Pipeline Tab - Kanban */}
        <TabsContent value="pipeline">
          <div className="overflow-x-auto">
            <div className="flex gap-4 min-w-[900px] pb-4">
              {PIPELINE_COLUMNS.map(column => {
                const candidates = MOCK_CANDIDATES.filter(c => c.status === column.key);
                return (
                  <div key={column.key} className="flex-1 min-w-[200px]">
                    <div className={`border-t-4 ${column.color} rounded-t-lg`}>
                      <div className="bg-card border border-t-0 border-border rounded-b-lg">
                        <div className="p-3 border-b border-border flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {column.icon}
                            <span className="text-sm font-medium">{column.label}</span>
                          </div>
                          <Badge variant="secondary" className="text-xs h-5">{candidates.length}</Badge>
                        </div>
                        <div className="p-2 space-y-2 max-h-96 overflow-y-auto">
                          {candidates.map(candidate => (
                            <Card key={candidate.id} className="hover:shadow-md transition-shadow cursor-pointer">
                              <CardContent className="p-3">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                                    {candidate.firstName[0]}{candidate.lastName[0]}
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">{candidate.firstName} {candidate.lastName}</p>
                                    <p className="text-[10px] text-muted-foreground">{candidate.currentTitle}</p>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-[10px] text-muted-foreground">{candidate.currentCompany}</span>
                                  <Badge variant="secondary" className="text-[10px] h-5">
                                    Score: {candidate.aiScore}
                                  </Badge>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                          {candidates.length === 0 && (
                            <div className="text-center py-6 text-muted-foreground text-xs">
                              No candidates
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* AI Scores Tab */}
        <TabsContent value="ai_scores" className="space-y-4">
          {MOCK_CANDIDATES.map(candidate => (
            <Card key={candidate.id}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      {candidate.firstName[0]}{candidate.lastName[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{candidate.firstName} {candidate.lastName}</p>
                      <p className="text-xs text-muted-foreground">{candidate.currentTitle} at {candidate.currentCompany}</p>
                    </div>
                  </div>
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>Skill Match</span>
                        <span className="font-medium">{candidate.skillMatch}%</span>
                      </div>
                      <Progress value={candidate.skillMatch} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>Culture Fit</span>
                        <span className="font-medium">{candidate.cultureFit}%</span>
                      </div>
                      <Progress value={candidate.cultureFit} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>AI Score</span>
                        <span className="font-medium">{candidate.aiScore}%</span>
                      </div>
                      <Progress value={candidate.aiScore} className="h-2" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${candidate.aiScore >= 90 ? 'bg-emerald-100 text-emerald-800' : candidate.aiScore >= 80 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'}`}>
                      <Brain className="h-3 w-3 mr-1" /> {candidate.aiScore >= 90 ? 'Strong Match' : candidate.aiScore >= 80 ? 'Good Match' : 'Fair Match'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
