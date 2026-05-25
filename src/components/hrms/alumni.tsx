'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  UserMinus, Search, Mail, Users, Star, Gift,
  RefreshCw, Heart, MessageSquare, Briefcase
} from 'lucide-react';

const ALUMNI_LIST = [
  { id: 'al1', name: 'Jennifer Lee', email: 'jennifer.lee@email.com', department: 'Engineering', designation: 'Tech Lead', exitDate: '2024-06-30', tenure: '4 years', rehireEligible: true, reason: 'Relocation', currentCompany: 'Stripe' },
  { id: 'al2', name: 'Marcus Williams', email: 'marcus.w@email.com', department: 'Sales', designation: 'Sales Director', exitDate: '2024-03-15', tenure: '6 years', rehireEligible: true, reason: 'Career growth', currentCompany: 'Salesforce' },
  { id: 'al3', name: 'Sofia Rodriguez', email: 'sofia.r@email.com', department: 'Design', designation: 'Senior Designer', exitDate: '2024-08-20', tenure: '3 years', rehireEligible: true, reason: 'Better opportunity', currentCompany: 'Figma' },
  { id: 'al4', name: 'David Kim', email: 'david.k@email.com', department: 'Finance', designation: 'Finance Manager', exitDate: '2023-12-31', tenure: '5 years', rehireEligible: false, reason: 'Performance', currentCompany: 'Unknown' },
  { id: 'al5', name: 'Nina Patel', email: 'nina.p@email.com', department: 'HR', designation: 'HR Specialist', exitDate: '2024-09-01', tenure: '2 years', rehireEligible: true, reason: 'Personal', currentCompany: 'Google' },
  { id: 'al6', name: 'Tom Anderson', email: 'tom.a@email.com', department: 'Operations', designation: 'Operations Lead', exitDate: '2024-01-15', tenure: '7 years', rehireEligible: true, reason: 'Retirement', currentCompany: 'N/A' },
];

const REFERRALS = [
  { id: 'rf1', referrer: 'Jennifer Lee', candidate: 'Lisa Park', position: 'Frontend Developer', status: 'hired', date: '2024-11-15', reward: '$2000' },
  { id: 'rf2', referrer: 'Marcus Williams', candidate: 'James Brown', position: 'Account Executive', status: 'interviewing', date: '2025-01-05', reward: 'Pending' },
  { id: 'rf3', referrer: 'Sofia Rodriguez', candidate: 'Anna Chen', position: 'UX Designer', status: 'applied', date: '2025-01-18', reward: 'Pending' },
];

const COMMUNITY_POSTS = [
  { author: 'Jennifer Lee', content: 'Great to see TechCorp expanding to Singapore! Miss the team. 🌏', date: '2 days ago', likes: 12, comments: 3 },
  { author: 'Marcus Williams', content: 'Happy to refer candidates for the new Sales Director role. DM me!', date: '5 days ago', likes: 8, comments: 5 },
  { author: 'Tom Anderson', content: 'Retirement is great but I miss the annual team offsites. 😄', date: '1 week ago', likes: 24, comments: 7 },
];

export function Alumni() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAlumni = ALUMNI_LIST.filter(a =>
    `${a.name} ${a.department} ${a.designation}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Alumni Network</h1>
        <p className="text-muted-foreground text-sm">Stay connected with former employees</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <UserMinus className="h-5 w-5 mx-auto text-emerald-600 mb-1" />
            <p className="text-2xl font-bold">{ALUMNI_LIST.length}</p>
            <p className="text-xs text-muted-foreground">Total Alumni</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <RefreshCw className="h-5 w-5 mx-auto text-blue-600 mb-1" />
            <p className="text-2xl font-bold">{ALUMNI_LIST.filter(a => a.rehireEligible).length}</p>
            <p className="text-xs text-muted-foreground">Rehire Eligible</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Gift className="h-5 w-5 mx-auto text-amber-600 mb-1" />
            <p className="text-2xl font-bold">{REFERRALS.length}</p>
            <p className="text-xs text-muted-foreground">Referrals</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="h-5 w-5 mx-auto text-purple-600 mb-1" />
            <p className="text-2xl font-bold">4.2</p>
            <p className="text-xs text-muted-foreground">Avg Rating</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="directory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="directory">Alumni Directory</TabsTrigger>
          <TabsTrigger value="rehire">Rehire Eligibility</TabsTrigger>
          <TabsTrigger value="referrals">Referral Tracking</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
        </TabsList>

        <TabsContent value="directory" className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search alumni..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAlumni.map(alumni => (
              <Card key={alumni.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
                      {alumni.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{alumni.name}</p>
                      <p className="text-xs text-muted-foreground">{alumni.designation}</p>
                    </div>
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>Dept: {alumni.department} · Tenure: {alumni.tenure}</p>
                    <p>Exit: {alumni.exitDate} · Reason: {alumni.reason}</p>
                    <p>Now at: {alumni.currentCompany}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge className={`text-[10px] ${alumni.rehireEligible ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                      {alumni.rehireEligible ? 'Rehire Eligible' : 'Not Eligible'}
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-7 w-7"><Mail className="h-3.5 w-3.5" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rehire" className="space-y-3">
          {ALUMNI_LIST.filter(a => a.rehireEligible).map(alumni => (
            <Card key={alumni.id}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                      {alumni.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{alumni.name}</p>
                      <p className="text-xs text-muted-foreground">{alumni.designation} · {alumni.tenure} tenure</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="text-[10px] bg-emerald-100 text-emerald-800">Rehire Eligible</Badge>
                    <Button variant="outline" size="sm"><RefreshCw className="h-3.5 w-3.5 mr-1" /> Initiate Rehire</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="referrals" className="space-y-3">
          {REFERRALS.map(ref => (
            <Card key={ref.id}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-sm">{ref.candidate}</p>
                    <p className="text-xs text-muted-foreground">
                      Referred by {ref.referrer} for {ref.position} · {ref.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-[10px] ${
                      ref.status === 'hired' ? 'bg-emerald-100 text-emerald-800' :
                      ref.status === 'interviewing' ? 'bg-amber-100 text-amber-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>{ref.status}</Badge>
                    <Badge variant="secondary" className="text-[10px]">
                      <Gift className="h-3 w-3 mr-1" /> {ref.reward}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="community" className="space-y-3">
          {COMMUNITY_POSTS.map((post, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-xs">
                    {post.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{post.author}</p>
                    <p className="text-[10px] text-muted-foreground">{post.date}</p>
                  </div>
                </div>
                <p className="text-sm mb-3">{post.content}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <button className="flex items-center gap-1 hover:text-red-500 transition-colors"><Heart className="h-3.5 w-3.5" /> {post.likes}</button>
                  <button className="flex items-center gap-1 hover:text-blue-500 transition-colors"><MessageSquare className="h-3.5 w-3.5" /> {post.comments}</button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
