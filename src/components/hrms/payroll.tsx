'use client';

import React, { useState } from 'react';
import { MOCK_PAYROLL, ANALYTICS_DATA } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  DollarSign, TrendingUp, TrendingDown, CreditCard, Wallet,
  CheckCircle2, Clock, FileText, Download
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const PAYROLL_STATUS_COLORS: Record<string, string> = {
  paid: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400',
  processed: 'bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400',
  draft: 'bg-slate-100 text-slate-800 dark:bg-slate-950/30 dark:text-slate-400',
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400',
};

export function Payroll() {
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [selectedYear, setSelectedYear] = useState('2025');

  const totalPayout = MOCK_PAYROLL.reduce((sum, p) => sum + p.netSalary, 0);
  const totalDeductions = MOCK_PAYROLL.reduce((sum, p) => sum + p.totalDeductions, 0);
  const totalGross = MOCK_PAYROLL.reduce((sum, p) => sum + p.grossSalary, 0);

  const payrollCostData = ANALYTICS_DATA.payrollCost.months.map((m, i) => ({
    name: m,
    cost: ANALYTICS_DATA.payrollCost.values[i],
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payroll</h1>
          <p className="text-muted-foreground text-sm">Process and manage employee compensation</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <CreditCard className="h-4 w-4 mr-2" /> Run Payroll
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
              <Wallet className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">${totalGross.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Gross Salary</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/30">
              <TrendingDown className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">${totalDeductions.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Deductions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-teal-50 dark:bg-teal-950/30">
              <DollarSign className="h-5 w-5 text-teal-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">${totalPayout.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Net Payout</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/30">
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{MOCK_PAYROLL.filter(p => p.status === 'paid').length}/{MOCK_PAYROLL.length}</p>
              <p className="text-xs text-muted-foreground">Payments Processed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payroll Cost Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Payroll Cost Trend (in $M)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={payrollCostData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => [`$${value}M`, 'Cost']} />
              <Area type="monotone" dataKey="cost" stroke="#059669" fill="#059669" fillOpacity={0.15} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Payroll Table */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Payroll Details — {selectedMonth} {selectedYear}</CardTitle>
              <CardDescription>Individual employee payroll breakdown</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-3.5 w-3.5 mr-1" /> Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Basic Pay</TableHead>
                  <TableHead>Gross Salary</TableHead>
                  <TableHead>Deductions</TableHead>
                  <TableHead>Net Salary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_PAYROLL.map(record => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.employee}</TableCell>
                    <TableCell>${record.basicPay.toLocaleString()}</TableCell>
                    <TableCell>${record.grossSalary.toLocaleString()}</TableCell>
                    <TableCell className="text-red-600">-${record.totalDeductions.toLocaleString()}</TableCell>
                    <TableCell className="font-semibold">${record.netSalary.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={`text-[10px] ${PAYROLL_STATUS_COLORS[record.status]}`}>
                        {record.status === 'paid' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                        {record.status === 'processed' && <Clock className="h-3 w-3 mr-1" />}
                        {record.status === 'draft' && <FileText className="h-3 w-3 mr-1" />}
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{record.paymentDate || '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
