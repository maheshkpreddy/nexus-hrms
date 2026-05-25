'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ShieldCheck, AlertTriangle, FileText, CheckCircle2, XCircle,
  Clock, RefreshCw, ExternalLink, Bell
} from 'lucide-react';

const COMPLIANCE_ITEMS = [
  { id: 1, title: 'Annual Fire Safety Inspection', category: 'Safety', dueDate: '2025-02-15', status: 'pending', priority: 'high' },
  { id: 2, title: 'GDPR Data Protection Audit', category: 'Data Privacy', dueDate: '2025-03-01', status: 'in_progress', priority: 'high' },
  { id: 3, title: 'Employee Background Verification (Batch Q1)', category: 'HR', dueDate: '2025-01-31', status: 'completed', priority: 'medium' },
  { id: 4, title: 'SOX Compliance Review', category: 'Financial', dueDate: '2025-04-15', status: 'pending', priority: 'high' },
  { id: 5, title: 'Workplace Harassment Training (Annual)', category: 'Training', dueDate: '2025-02-28', status: 'in_progress', priority: 'medium' },
  { id: 6, title: 'ISO 27001 Certification Renewal', category: 'Security', dueDate: '2025-06-30', status: 'pending', priority: 'high' },
  { id: 7, title: 'Tax Compliance Filing', category: 'Financial', dueDate: '2025-03-31', status: 'completed', priority: 'medium' },
  { id: 8, title: 'Diversity & Inclusion Report', category: 'HR', dueDate: '2025-05-01', status: 'pending', priority: 'low' },
];

const REGULATORY_ALERTS = [
  { id: 1, title: 'New Labor Law Amendment Effective March 2025', description: 'Updated overtime regulations require policy changes', severity: 'high', date: '2 days ago' },
  { id: 2, title: 'Data Localization Requirements Updated', description: 'New requirements for storing employee data within country borders', severity: 'medium', date: '5 days ago' },
  { id: 3, title: 'Annual PF Contribution Rate Change', description: 'Provident Fund contribution rates updated for FY 2025-26', severity: 'medium', date: '1 week ago' },
  { id: 4, title: 'POSH Committee Renewal Reminder', description: 'Internal Complaints Committee membership needs renewal', severity: 'low', date: '2 weeks ago' },
];

const AUDIT_STATUS = [
  { name: 'Internal Audit Q4 2024', status: 'completed', findings: 5, resolved: 5, date: 'Dec 2024' },
  { name: 'Statutory Audit FY 2024', status: 'completed', findings: 3, resolved: 2, date: 'Jan 2025' },
  { name: 'IT Security Audit', status: 'in_progress', findings: 8, resolved: 3, date: 'Feb 2025' },
  { name: 'HR Compliance Audit', status: 'scheduled', findings: 0, resolved: 0, date: 'Mar 2025' },
];

const DOCUMENT_RETENTION = [
  { type: 'Employee Records', retention: '7 years after exit', status: 'compliant', documents: 12500 },
  { type: 'Financial Records', retention: '10 years', status: 'compliant', documents: 8900 },
  { type: 'Tax Documents', retention: '7 years', status: 'compliant', documents: 4200 },
  { type: 'Contract Documents', retention: '5 years after expiry', status: 'action_needed', documents: 3100 },
  { type: 'Safety Records', retention: '5 years', status: 'compliant', documents: 1800 },
  { type: 'Training Records', retention: '3 years', status: 'action_needed', documents: 5600 },
];

export function Compliance() {
  const completedCount = COMPLIANCE_ITEMS.filter(i => i.status === 'completed').length;
  const complianceScore = Math.round((completedCount / COMPLIANCE_ITEMS.length) * 100);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Compliance</h1>
          <p className="text-muted-foreground text-sm">Track regulatory compliance and audits</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <RefreshCw className="h-4 w-4 mr-2" /> Run Compliance Check
        </Button>
      </div>

      {/* Score Card */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
          <CardContent className="p-4">
            <ShieldCheck className="h-6 w-6 mb-2 opacity-80" />
            <p className="text-3xl font-bold">{complianceScore}%</p>
            <p className="text-sm opacity-80">Compliance Score</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="h-5 w-5 mx-auto text-emerald-600 mb-1" />
            <p className="text-2xl font-bold">{completedCount}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-5 w-5 mx-auto text-amber-600 mb-1" />
            <p className="text-2xl font-bold">{COMPLIANCE_ITEMS.filter(i => i.status === 'in_progress' || i.status === 'pending').length}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-5 w-5 mx-auto text-red-600 mb-1" />
            <p className="text-2xl font-bold">{REGULATORY_ALERTS.filter(a => a.severity === 'high').length}</p>
            <p className="text-xs text-muted-foreground">Critical Alerts</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="checklist" className="space-y-4">
        <TabsList>
          <TabsTrigger value="checklist">Compliance Checklist</TabsTrigger>
          <TabsTrigger value="alerts">Regulatory Alerts</TabsTrigger>
          <TabsTrigger value="audit">Audit Status</TabsTrigger>
          <TabsTrigger value="retention">Document Retention</TabsTrigger>
        </TabsList>

        <TabsContent value="checklist" className="space-y-3">
          {COMPLIANCE_ITEMS.map(item => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    {item.status === 'completed' ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                    ) : item.status === 'in_progress' ? (
                      <Clock className="h-5 w-5 text-amber-600 shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-slate-400 shrink-0" />
                    )}
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <span>{item.category}</span>
                        <span>·</span>
                        <span>Due: {item.dueDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-[10px] ${
                      item.priority === 'high' ? 'bg-red-100 text-red-800' : item.priority === 'medium' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
                    }`}>{item.priority}</Badge>
                    <Badge className={`text-[10px] ${
                      item.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : item.status === 'in_progress' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
                    }`}>{item.status.replace('_', ' ')}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="alerts" className="space-y-3">
          {REGULATORY_ALERTS.map(alert => (
            <Card key={alert.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg shrink-0 ${
                    alert.severity === 'high' ? 'bg-red-50 dark:bg-red-950/30' : alert.severity === 'medium' ? 'bg-amber-50 dark:bg-amber-950/30' : 'bg-blue-50 dark:bg-blue-950/30'
                  }`}>
                    <Bell className={`h-4 w-4 ${
                      alert.severity === 'high' ? 'text-red-600' : alert.severity === 'medium' ? 'text-amber-600' : 'text-blue-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium">{alert.title}</p>
                      <Badge className={`text-[10px] ${
                        alert.severity === 'high' ? 'bg-red-100 text-red-800' : alert.severity === 'medium' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                      }`}>{alert.severity}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{alert.description}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{alert.date}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="shrink-0"><ExternalLink className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="audit" className="space-y-3">
          {AUDIT_STATUS.map(audit => (
            <Card key={audit.name}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{audit.name}</p>
                    <p className="text-xs text-muted-foreground">{audit.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-xs">
                      <span className="text-muted-foreground">Findings: </span>
                      <span className="font-medium">{audit.findings}</span>
                      <span className="text-muted-foreground ml-2">Resolved: </span>
                      <span className="font-medium text-emerald-600">{audit.resolved}</span>
                    </div>
                    <Badge className={`text-[10px] ${
                      audit.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : audit.status === 'in_progress' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                    }`}>{audit.status.replace('_', ' ')}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="retention" className="space-y-3">
          {DOCUMENT_RETENTION.map(doc => (
            <Card key={doc.type}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{doc.type}</p>
                      <p className="text-xs text-muted-foreground">Retention: {doc.retention} · {doc.documents.toLocaleString()} documents</p>
                    </div>
                  </div>
                  <Badge className={`text-[10px] ${
                    doc.status === 'compliant' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {doc.status === 'compliant' ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <AlertTriangle className="h-3 w-3 mr-1" />}
                    {doc.status === 'compliant' ? 'Compliant' : 'Action Needed'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
