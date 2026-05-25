'use client';

import React, { useState } from 'react';
import { MOCK_JOBS } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Search, MapPin, DollarSign, Briefcase, Star, Bookmark,
  Zap, Clock, Building2, ArrowRight, Filter, Sparkles
} from 'lucide-react';

const FEATURED_JOBS = [
  { id: 'fj1', title: 'Senior AI/ML Engineer', company: 'TechCorp Global', location: 'San Francisco, CA', salary: '$180K - $240K', match: 95, tags: ['AI/ML', 'Python', 'TensorFlow'] },
  { id: 'fj2', title: 'Product Design Lead', company: 'TechCorp Global', location: 'Remote', salary: '$140K - $180K', match: 88, tags: ['Design', 'Figma', 'Leadership'] },
  { id: 'fj3', title: 'DevOps Architect', company: 'ManufactPro Industries', location: 'Mumbai, India', salary: '₹35L - ₹50L', match: 82, tags: ['AWS', 'Kubernetes', 'CI/CD'] },
];

const AI_RECOMMENDATIONS = [
  { reason: 'Based on your skills in React and TypeScript', match: 92 },
  { reason: 'Matches your experience level (5+ years)', match: 85 },
  { reason: 'Aligned with your location preferences', match: 78 },
];

export function JobPortal() {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');

  const filteredJobs = MOCK_JOBS.filter(j => j.status === 'open' || j.status === 'interviewing').filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = locationFilter === 'all' || job.location.toLowerCase().includes(locationFilter.toLowerCase());
    return matchesSearch && matchesLocation;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Job Portal</h1>
        <p className="text-muted-foreground text-sm">Find your next career opportunity</p>
      </div>

      {/* Search Bar */}
      <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-800">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Search jobs by title, skill, or keyword..." className="pl-10 h-11" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-full sm:w-48 h-11">
                <MapPin className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="san francisco">San Francisco</SelectItem>
                <SelectItem value="new york">New York</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="mumbai">Mumbai</SelectItem>
                <SelectItem value="london">London</SelectItem>
                <SelectItem value="singapore">Singapore</SelectItem>
              </SelectContent>
            </Select>
            <Button className="h-11 bg-emerald-600 hover:bg-emerald-700 px-8">
              <Search className="h-4 w-4 mr-2" /> Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Featured Jobs */}
      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Star className="h-5 w-5 text-amber-500" /> Featured Jobs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURED_JOBS.map(job => (
            <Card key={job.id} className="hover:shadow-md transition-shadow border-amber-200 dark:border-amber-800/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400 text-[10px]">
                    <Zap className="h-3 w-3 mr-1" /> Featured
                  </Badge>
                  <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400 text-[10px]">
                    {job.match}% Match
                  </Badge>
                </div>
                <h3 className="font-semibold text-sm mb-1">{job.title}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1"><Building2 className="h-3 w-3" />{job.company}</p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                  <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{job.salary}</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {job.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
                  ))}
                </div>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700" size="sm">
                  Apply Now <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-600" /> AI Job Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            {AI_RECOMMENDATIONS.map((rec, i) => (
              <div key={i} className="p-3 rounded-lg border border-border bg-emerald-50/50 dark:bg-emerald-950/20">
                <p className="text-xs text-muted-foreground mb-1">{rec.reason}</p>
                <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">{rec.match}% match</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Job Listings */}
      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-emerald-600" /> All Open Positions ({filteredJobs.length})
        </h2>
        <div className="space-y-3">
          {filteredJobs.map(job => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm">{job.title}</h3>
                      <Badge className={`text-[10px] ${job.status === 'open' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{job.status}</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{job.department}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                      <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{job.salary}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{job.experience}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-9 w-9"><Bookmark className="h-4 w-4" /></Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700" size="sm">
                      One-Click Apply <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
