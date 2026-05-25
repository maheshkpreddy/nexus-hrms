'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Monitor, Laptop, Smartphone, Printer, Wifi, Server, Plus, RotateCcw, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ASSET_TYPES = [
  { type: 'Laptops', count: 450, allocated: 420, available: 30, icon: <Laptop className="h-5 w-5" />, color: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600' },
  { type: 'Desktops', count: 200, allocated: 185, available: 15, icon: <Monitor className="h-5 w-5" />, color: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600' },
  { type: 'Mobile Phones', count: 300, allocated: 280, available: 20, icon: <Smartphone className="h-5 w-5" />, color: 'bg-purple-50 dark:bg-purple-950/30 text-purple-600' },
  { type: 'Printers', count: 50, allocated: 48, available: 2, icon: <Printer className="h-5 w-5" />, color: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600' },
  { type: 'Network Devices', count: 120, allocated: 120, available: 0, icon: <Wifi className="h-5 w-5" />, color: 'bg-red-50 dark:bg-red-950/30 text-red-600' },
  { type: 'Servers', count: 30, allocated: 30, available: 0, icon: <Server className="h-5 w-5" />, color: 'bg-teal-50 dark:bg-teal-950/30 text-teal-600' },
];

const ASSET_ALLOCATIONS = [
  { id: 'a001', asset: 'MacBook Pro 16"', type: 'Laptop', serial: 'MBP-2024-0042', assignedTo: 'Sarah Johnson', allocatedDate: '2024-01-15', status: 'allocated', condition: 'good' },
  { id: 'a002', asset: 'Dell Latitude 5540', type: 'Laptop', serial: 'DL-2024-0118', assignedTo: 'Raj Patel', allocatedDate: '2024-02-01', status: 'allocated', condition: 'good' },
  { id: 'a003', asset: 'iPhone 15 Pro', type: 'Mobile Phone', serial: 'IP-2024-0089', assignedTo: 'Emily Chen', allocatedDate: '2024-03-10', status: 'allocated', condition: 'excellent' },
  { id: 'a004', asset: 'HP EliteBook 840', type: 'Laptop', serial: 'HP-2023-0256', assignedTo: 'Michael Brown', allocatedDate: '2023-09-01', status: 'damaged', condition: 'needs_repair' },
  { id: 'a005', asset: 'ThinkPad X1 Carbon', type: 'Laptop', serial: 'TP-2024-0077', assignedTo: 'Unallocated', allocatedDate: '', status: 'available', condition: 'good' },
  { id: 'a006', asset: 'iPad Pro 12.9"', type: 'Mobile Phone', serial: 'IPD-2024-0033', assignedTo: 'Lisa Anderson', allocatedDate: '2024-06-15', status: 'return_requested', condition: 'good' },
];

const STATUS_COLORS: Record<string, string> = {
  allocated: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400',
  available: 'bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400',
  damaged: 'bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400',
  return_requested: 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400',
};

const ASSET_DISTRIBUTION = [
  { name: 'Allocated', value: 1083, color: '#059669' },
  { name: 'Available', value: 67, color: '#3b82f6' },
  { name: 'Damaged', value: 12, color: '#ef4444' },
  { name: 'In Repair', value: 8, color: '#f59e0b' },
];

export function Assets() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Asset Management</h1>
          <p className="text-muted-foreground text-sm">Track and manage company assets</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-2" /> Add Asset
        </Button>
      </div>

      {/* Asset Type Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {ASSET_TYPES.map(asset => (
          <Card key={asset.type}>
            <CardContent className="p-4 text-center">
              <div className={`w-10 h-10 mx-auto rounded-lg flex items-center justify-center mb-2 ${asset.color}`}>
                {asset.icon}
              </div>
              <p className="text-lg font-bold">{asset.count}</p>
              <p className="text-xs text-muted-foreground">{asset.type}</p>
              <div className="flex items-center justify-center gap-2 mt-2 text-[10px]">
                <span className="text-emerald-600">{asset.allocated} used</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-blue-600">{asset.available} free</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Asset Table */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Asset Allocations</CardTitle>
            <CardDescription>Current asset assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset</TableHead>
                    <TableHead>Serial</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ASSET_ALLOCATIONS.map(asset => (
                    <TableRow key={asset.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{asset.asset}</p>
                          <p className="text-xs text-muted-foreground">{asset.type}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-mono">{asset.serial}</TableCell>
                      <TableCell>{asset.assignedTo}</TableCell>
                      <TableCell>
                        <Badge className={`text-[10px] ${STATUS_COLORS[asset.status]}`}>{asset.status.replace('_', ' ')}</Badge>
                      </TableCell>
                      <TableCell>
                        {asset.status === 'available' ? (
                          <Button size="sm" variant="outline">Allocate</Button>
                        ) : asset.status === 'return_requested' ? (
                          <Button size="sm" variant="outline"><RotateCcw className="h-3 w-3 mr-1" />Accept Return</Button>
                        ) : asset.status === 'allocated' ? (
                          <Button size="sm" variant="ghost"><RotateCcw className="h-3 w-3 mr-1" />Return</Button>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Asset Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={ASSET_DISTRIBUTION} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" paddingAngle={2}>
                  {ASSET_DISTRIBUTION.map((entry, index) => (
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
