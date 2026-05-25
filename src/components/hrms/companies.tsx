'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store/app-store';
import type { CompanyInfo } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Building, Plus, Building2, Users, MapPin, Globe,
  Pencil, Eye, ChevronRight
} from 'lucide-react';

const BRANCHES: Record<string, { name: string; location: string; employees: number }[]> = {
  'c1': [
    { name: 'San Francisco HQ', location: 'San Francisco, CA', employees: 1200 },
    { name: 'New York Office', location: 'New York, NY', employees: 600 },
    { name: 'Austin Tech Hub', location: 'Austin, TX', employees: 400 },
    { name: 'London Office', location: 'London, UK', employees: 250 },
  ],
  'c2': [
    { name: 'Mumbai HQ', location: 'Mumbai, India', employees: 3200 },
    { name: 'Pune Factory', location: 'Pune, India', employees: 1800 },
    { name: 'Chennai Plant', location: 'Chennai, India', employees: 800 },
  ],
  'c3': [
    { name: 'London HQ', location: 'London, UK', employees: 600 },
    { name: 'Manchester Clinic', location: 'Manchester, UK', employees: 400 },
    { name: 'Birmingham Center', location: 'Birmingham, UK', employees: 200 },
  ],
};

export function Companies() {
  const { companies } = useAppStore();
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Companies</h1>
          <p className="text-muted-foreground text-sm">Manage multi-company setup (Super Admin only)</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setShowAddCompany(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Company
        </Button>
      </div>

      {/* Company Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {companies.map(company => (
          <Card key={company.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
                  {company.code.slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{company.name}</h3>
                  <p className="text-xs text-muted-foreground">{company.code} · {company.industry}</p>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" /> {company.country} · {company.currency}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-3.5 w-3.5" /> {company.employeeCount.toLocaleString()} employees
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <Badge className={`text-[10px] ${company.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                  {company.isActive ? 'Active' : 'Inactive'}
                </Badge>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedCompany(company.id)}>
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Branch Management */}
      {selectedCompany && BRANCHES[selectedCompany] && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-4 w-4 text-emerald-600" /> Branch Management
            </CardTitle>
            <CardDescription>
              {companies.find(c => c.id === selectedCompany)?.name} branches
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {BRANCHES[selectedCompany].map(branch => (
              <div key={branch.name} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/30 transition-colors">
                <div>
                  <p className="text-sm font-medium">{branch.name}</p>
                  <p className="text-xs text-muted-foreground">{branch.location}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-[10px]">
                    <Users className="h-3 w-3 mr-1" />{branch.employees}
                  </Badge>
                  <Button variant="ghost" size="sm"><Pencil className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-2"><Plus className="h-3.5 w-3.5 mr-1" /> Add Branch</Button>
          </CardContent>
        </Card>
      )}

      {/* Add Company Dialog */}
      <Dialog open={showAddCompany} onOpenChange={setShowAddCompany}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Company</DialogTitle>
            <DialogDescription>Register a new company in the NEXUS HRMS platform</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-sm">Company Name</Label>
              <Input placeholder="Enter company name" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-sm">Company Code</Label>
                <Input placeholder="e.g. TCG" />
              </div>
              <div className="space-y-1">
                <Label className="text-sm">Industry</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="it">IT Services</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="logistics">Logistics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-sm">Country</Label>
                <Input placeholder="Country" />
              </div>
              <div className="space-y-1">
                <Label className="text-sm">Currency</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="INR">INR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="SGD">SGD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Add Company</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
