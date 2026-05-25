'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plane, Receipt, Plus, CheckCircle2, XCircle, Clock, AlertCircle,
  MapPin, DollarSign, ShieldCheck, Download
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const TRAVEL_REQUESTS = [
  { id: 'tr1', employee: 'Sarah Johnson', destination: 'San Francisco, CA', purpose: 'Client Meeting', dates: 'Jan 25-27, 2025', estimatedCost: 2500, status: 'approved', policyCompliant: true },
  { id: 'tr2', employee: 'Raj Patel', destination: 'Mumbai, India', purpose: 'HR Conference', dates: 'Feb 5-8, 2025', estimatedCost: 3200, status: 'pending', policyCompliant: true },
  { id: 'tr3', employee: 'Emily Chen', destination: 'London, UK', purpose: 'Design Workshop', dates: 'Feb 15-18, 2025', estimatedCost: 4500, status: 'pending', policyCompliant: false },
  { id: 'tr4', employee: 'Michael Brown', destination: 'Singapore', purpose: 'Tech Summit', dates: 'Mar 1-3, 2025', estimatedCost: 2800, status: 'rejected', policyCompliant: false },
];

const EXPENSE_CLAIMS = [
  { id: 'ex1', employee: 'Sarah Johnson', category: 'Flight', amount: 850, date: 'Jan 25, 2025', receipt: 'uploaded', status: 'approved' },
  { id: 'ex2', employee: 'Sarah Johnson', category: 'Hotel', amount: 720, date: 'Jan 25, 2025', receipt: 'uploaded', status: 'approved' },
  { id: 'ex3', employee: 'Raj Patel', category: 'Flight', amount: 1200, date: 'Jan 20, 2025', receipt: 'uploaded', status: 'pending' },
  { id: 'ex4', employee: 'Raj Patel', category: 'Meals', amount: 150, date: 'Jan 20, 2025', receipt: 'missing', status: 'pending' },
  { id: 'ex5', employee: 'Emily Chen', category: 'Conference', amount: 2000, date: 'Jan 15, 2025', receipt: 'uploaded', status: 'rejected' },
];

const EXPENSE_BY_CATEGORY = [
  { name: 'Flight', value: 8200, color: '#059669' },
  { name: 'Hotel', value: 5400, color: '#10b981' },
  { name: 'Meals', value: 2100, color: '#f59e0b' },
  { name: 'Transport', value: 1800, color: '#3b82f6' },
  { name: 'Conference', value: 3500, color: '#8b5cf6' },
  { name: 'Other', value: 900, color: '#6b7280' },
];

const monthlyExpenseData = [
  { month: 'Aug', amount: 12500 },
  { month: 'Sep', amount: 15200 },
  { month: 'Oct', amount: 11800 },
  { month: 'Nov', amount: 18500 },
  { month: 'Dec', amount: 14200 },
  { month: 'Jan', amount: 16800 },
];

const STATUS_COLORS: Record<string, string> = {
  approved: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400',
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400',
};

const RECEIPT_COLORS: Record<string, string> = {
  uploaded: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400',
  missing: 'bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400',
};

export function TravelExpense() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Travel & Expense</h1>
          <p className="text-muted-foreground text-sm">Manage travel requests and expense claims</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Plane className="h-4 w-4 mr-2" /> Travel Request</Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700"><Receipt className="h-4 w-4 mr-2" /> Expense Claim</Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Plane className="h-5 w-5 mx-auto text-emerald-600 mb-1" />
            <p className="text-2xl font-bold">{TRAVEL_REQUESTS.length}</p>
            <p className="text-xs text-muted-foreground">Travel Requests</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Receipt className="h-5 w-5 mx-auto text-blue-600 mb-1" />
            <p className="text-2xl font-bold">${EXPENSE_CLAIMS.reduce((s, e) => s + e.amount, 0).toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Pending Claims</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <ShieldCheck className="h-5 w-5 mx-auto text-teal-600 mb-1" />
            <p className="text-2xl font-bold">{Math.round(TRAVEL_REQUESTS.filter(t => t.policyCompliant).length / TRAVEL_REQUESTS.length * 100)}%</p>
            <p className="text-xs text-muted-foreground">Policy Compliance</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-5 w-5 mx-auto text-amber-600 mb-1" />
            <p className="text-2xl font-bold">{TRAVEL_REQUESTS.filter(t => t.status === 'pending').length}</p>
            <p className="text-xs text-muted-foreground">Pending Approval</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="travel" className="space-y-4">
        <TabsList>
          <TabsTrigger value="travel">Travel Requests</TabsTrigger>
          <TabsTrigger value="expenses">Expense Claims</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="travel">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Est. Cost</TableHead>
                      <TableHead>Policy</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {TRAVEL_REQUESTS.map(req => (
                      <TableRow key={req.id}>
                        <TableCell className="font-medium">{req.employee}</TableCell>
                        <TableCell className="flex items-center gap-1"><MapPin className="h-3 w-3" />{req.destination}</TableCell>
                        <TableCell>{req.purpose}</TableCell>
                        <TableCell>{req.dates}</TableCell>
                        <TableCell>${req.estimatedCost.toLocaleString()}</TableCell>
                        <TableCell>
                          {req.policyCompliant ? (
                            <Badge className="text-[10px] bg-emerald-100 text-emerald-800"><CheckCircle2 className="h-3 w-3 mr-1" />Compliant</Badge>
                          ) : (
                            <Badge className="text-[10px] bg-red-100 text-red-800"><AlertCircle className="h-3 w-3 mr-1" />Violation</Badge>
                          )}
                        </TableCell>
                        <TableCell><Badge className={`text-[10px] ${STATUS_COLORS[req.status]}`}>{req.status}</Badge></TableCell>
                        <TableCell>
                          {req.status === 'pending' && (
                            <div className="flex gap-1">
                              <Button size="icon" variant="ghost" className="h-7 w-7 text-emerald-600"><CheckCircle2 className="h-4 w-4" /></Button>
                              <Button size="icon" variant="ghost" className="h-7 w-7 text-red-600"><XCircle className="h-4 w-4" /></Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Receipt</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {EXPENSE_CLAIMS.map(claim => (
                      <TableRow key={claim.id}>
                        <TableCell className="font-medium">{claim.employee}</TableCell>
                        <TableCell>{claim.category}</TableCell>
                        <TableCell>${claim.amount.toLocaleString()}</TableCell>
                        <TableCell>{claim.date}</TableCell>
                        <TableCell>
                          <Badge className={`text-[10px] ${RECEIPT_COLORS[claim.receipt]}`}>
                            {claim.receipt === 'uploaded' ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
                            {claim.receipt}
                          </Badge>
                        </TableCell>
                        <TableCell><Badge className={`text-[10px] ${STATUS_COLORS[claim.status]}`}>{claim.status}</Badge></TableCell>
                        <TableCell>
                          {claim.status === 'pending' && (
                            <div className="flex gap-1">
                              <Button size="icon" variant="ghost" className="h-7 w-7 text-emerald-600"><CheckCircle2 className="h-4 w-4" /></Button>
                              <Button size="icon" variant="ghost" className="h-7 w-7 text-red-600"><XCircle className="h-4 w-4" /></Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Expense by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={EXPENSE_BY_CATEGORY} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" paddingAngle={2}>
                      {EXPENSE_BY_CATEGORY.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Monthly Expense Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={monthlyExpenseData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Expense']} />
                    <Bar dataKey="amount" fill="#059669" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
