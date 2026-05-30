'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { getInterviews, createInterview, getCandidates } from '@/lib/api';
import { useAppStore } from '@/store/app-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Bot, Video, Mic, Type, Code, CheckSquare, Play, Eye,
  Star, Clock, User, Brain, Loader2, Sparkles, MessageSquare,
} from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { toast } from 'sonner';

// ==================== DEMO DATA ====================
// Comprehensive demo data used as fallback when API calls fail

const DEMO_CANDIDATES = [
  {
    id: 'demo-cand-1', firstName: 'Alex', lastName: 'Turner', email: 'alex.turner@example.com',
    phone: '+1-555-0101', currentTitle: 'Senior Full-Stack Developer', status: 'interviewing',
    aiScore: 92, skillMatch: 88, cultureFitScore: 85, jobId: 'demo-job-1',
    job: { id: 'demo-job-1', title: 'Senior Full-Stack Developer' },
  },
  {
    id: 'demo-cand-2', firstName: 'Maya', lastName: 'Singh', email: 'maya.singh@example.com',
    phone: '+1-555-0102', currentTitle: 'Backend Engineer', status: 'shortlisted',
    aiScore: 89, skillMatch: 91, cultureFitScore: 80, jobId: 'demo-job-2',
    job: { id: 'demo-job-2', title: 'Backend Engineer' },
  },
  {
    id: 'demo-cand-3', firstName: 'James', lastName: 'Williams', email: 'james.w@example.com',
    phone: '+1-555-0103', currentTitle: 'HR Manager', status: 'offered',
    aiScore: 95, skillMatch: 94, cultureFitScore: 90, jobId: 'demo-job-3',
    job: { id: 'demo-job-3', title: 'HR Business Partner' },
  },
  {
    id: 'demo-cand-4', firstName: 'Sophie', lastName: 'Martin', email: 'sophie.m@example.com',
    phone: '+1-555-0104', currentTitle: 'UX Researcher', status: 'screening',
    aiScore: 78, skillMatch: 82, cultureFitScore: 88, jobId: 'demo-job-4',
    job: { id: 'demo-job-4', title: 'UX Research Lead' },
  },
  {
    id: 'demo-cand-5', firstName: 'Wei', lastName: 'Zhang', email: 'wei.z@example.com',
    phone: '+1-555-0105', currentTitle: 'Data Scientist', status: 'applied',
    aiScore: 72, skillMatch: 68, cultureFitScore: 75, jobId: 'demo-job-5',
    job: { id: 'demo-job-5', title: 'Data Scientist' },
  },
  {
    id: 'demo-cand-6', firstName: 'Priya', lastName: 'Sharma', email: 'priya.s@example.com',
    phone: '+1-555-0106', currentTitle: 'Cloud Architect', status: 'interviewing',
    aiScore: 87, skillMatch: 90, cultureFitScore: 82, jobId: 'demo-job-6',
    job: { id: 'demo-job-6', title: 'Cloud Infrastructure Engineer' },
  },
  {
    id: 'demo-cand-7', firstName: 'Carlos', lastName: 'Rodriguez', email: 'carlos.r@example.com',
    phone: '+1-555-0107', currentTitle: 'DevOps Lead', status: 'shortlisted',
    aiScore: 83, skillMatch: 79, cultureFitScore: 86, jobId: 'demo-job-7',
    job: { id: 'demo-job-7', title: 'DevOps Engineer' },
  },
];

const DEMO_INTERVIEWS = [
  {
    id: 'demo-int-1', type: 'text', scheduledAt: '2025-03-01T10:00:00Z',
    duration: 60, status: 'completed', feedback: 'Strong problem-solving skills, excellent React and Node.js knowledge',
    rating: 4, meetingLink: 'https://meet.nexushrms.com/int1', aiTranscript: null,
    candidateId: 'demo-cand-1', jobId: 'demo-job-1',
    candidate: { id: 'demo-cand-1', firstName: 'Alex', lastName: 'Turner', email: 'alex.turner@example.com' },
  },
  {
    id: 'demo-int-2', type: 'voice', scheduledAt: '2025-03-05T14:00:00Z',
    duration: 45, status: 'scheduled', feedback: null, rating: null,
    meetingLink: 'https://meet.nexushrms.com/int2', aiTranscript: null,
    candidateId: 'demo-cand-2', jobId: 'demo-job-2',
    candidate: { id: 'demo-cand-2', firstName: 'Maya', lastName: 'Singh', email: 'maya.singh@example.com' },
  },
  {
    id: 'demo-int-3', type: 'video', scheduledAt: '2025-03-10T09:00:00Z',
    duration: 90, status: 'completed', feedback: 'Excellent system design and communication skills',
    rating: 5, meetingLink: 'https://meet.nexushrms.com/int3', aiTranscript: null,
    candidateId: 'demo-cand-3', jobId: 'demo-job-3',
    candidate: { id: 'demo-cand-3', firstName: 'James', lastName: 'Williams', email: 'james.w@example.com' },
  },
  {
    id: 'demo-int-4', type: 'mcq', scheduledAt: '2025-03-12T11:00:00Z',
    duration: 30, status: 'in_progress', feedback: null, rating: null,
    meetingLink: null, aiTranscript: null,
    candidateId: 'demo-cand-4', jobId: 'demo-job-4',
    candidate: { id: 'demo-cand-4', firstName: 'Sophie', lastName: 'Martin', email: 'sophie.m@example.com' },
  },
  {
    id: 'demo-int-5', type: 'coding', scheduledAt: '2025-03-15T10:30:00Z',
    duration: 60, status: 'scheduled', feedback: null, rating: null,
    meetingLink: 'https://meet.nexushrms.com/int5', aiTranscript: null,
    candidateId: 'demo-cand-6', jobId: 'demo-job-6',
    candidate: { id: 'demo-cand-6', firstName: 'Priya', lastName: 'Sharma', email: 'priya.s@example.com' },
  },
  {
    id: 'demo-int-6', type: 'text', scheduledAt: '2025-03-20T15:00:00Z',
    duration: 45, status: 'completed', feedback: 'Good technical depth, needs improvement in communication',
    rating: 3, meetingLink: 'https://meet.nexushrms.com/int6', aiTranscript: null,
    candidateId: 'demo-cand-7', jobId: 'demo-job-7',
    candidate: { id: 'demo-cand-7', firstName: 'Carlos', lastName: 'Rodriguez', email: 'carlos.r@example.com' },
  },
];

// ==================== INTERVIEW TYPES ====================

const INTERVIEW_TYPES = [
  { id: 'text', label: 'Text Chat', description: 'AI conducts a text-based interview with smart follow-up questions', icon: <Type className="h-6 w-6" />, color: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600', enabled: true },
  { id: 'voice', label: 'Voice Interview', description: 'AI conducts a voice-based interview with speech analysis', icon: <Mic className="h-6 w-6" />, color: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600', enabled: true },
  { id: 'video', label: 'Video Interview', description: 'AI conducts a video interview with facial expression analysis', icon: <Video className="h-6 w-6" />, color: 'bg-purple-50 dark:bg-purple-950/30 text-purple-600', enabled: true },
  { id: 'mcq', label: 'MCQ Assessment', description: 'AI generates adaptive multiple-choice questions', icon: <CheckSquare className="h-6 w-6" />, color: 'bg-teal-50 dark:bg-teal-950/30 text-teal-600', enabled: true },
  { id: 'coding', label: 'Coding Challenge', description: 'AI evaluates code submissions with test cases', icon: <Code className="h-6 w-6" />, color: 'bg-rose-50 dark:bg-rose-950/30 text-rose-600', enabled: true },
];

// ==================== TRANSCRIPT DATA ====================

interface TranscriptMessage {
  role: 'ai' | 'candidate';
  text: string;
}

const TRANSCRIPT_DATA: Record<string, { title: string; duration: string; type: string; messages: TranscriptMessage[] }> = {
  'demo-cand-1': {
    title: 'Senior Full-Stack Developer',
    duration: '25 min',
    type: 'Text Chat',
    messages: [
      { role: 'ai', text: 'Hello Alex! I\'m your NEXUS AI interviewer today for the Senior Full-Stack Developer position. Let\'s start with your experience. Can you tell me about a complex system you\'ve designed recently?' },
      { role: 'candidate', text: 'I recently designed a microservices architecture for an e-commerce platform handling 10K+ requests per second. I used event-driven patterns with Kafka and implemented circuit breakers for resilience.' },
      { role: 'ai', text: 'That sounds impressive! Can you elaborate on how you handled the circuit breaker pattern and what fallback strategies you implemented?' },
      { role: 'candidate', text: 'We used the Hystrix pattern with three fallback levels: cache-first, then degraded service, and finally a graceful error response. This reduced our error rate by 95% during peak loads.' },
      { role: 'ai', text: 'Excellent explanation. Now, let\'s move to a system design question. How would you design a URL shortener service that can handle 100M URLs?' },
      { role: 'candidate', text: 'I\'d use a distributed key-value store like DynamoDB for the mapping, with a hash-based ID generation using base62 encoding. For read-heavy traffic, I\'d add Redis caching with a TTL strategy. The API layer would be behind a load balancer with horizontal scaling.' },
      { role: 'ai', text: 'Great approach! How would you handle hash collisions and ensure uniqueness at scale?' },
      { role: 'candidate', text: 'I\'d use a pre-generated pool of unique IDs maintained by a distributed counter service, similar to Snowflake ID generation. This avoids collision detection entirely and guarantees uniqueness.' },
      { role: 'ai', text: 'That\'s a solid solution. Let\'s talk about React. Can you explain the difference between useMemo and useCallback, and when you\'d use each?' },
      { role: 'candidate', text: 'useMemo memoizes a computed value, while useCallback memoizes a function reference. I\'d use useMemo for expensive calculations like filtering large lists, and useCallback for passing stable function references to child components to prevent unnecessary re-renders.' },
    ],
  },
  'demo-cand-2': {
    title: 'Backend Engineer',
    duration: '30 min',
    type: 'Voice Interview',
    messages: [
      { role: 'ai', text: 'Welcome Maya! I\'m the NEXUS AI interviewer for the Backend Engineer role. Let\'s begin with your experience with distributed systems. What messaging queues have you worked with?' },
      { role: 'candidate', text: 'I\'ve worked extensively with RabbitMQ and Apache Kafka. For high-throughput event streaming, Kafka is my go-to, while RabbitMQ is better for task queues with complex routing requirements.' },
      { role: 'ai', text: 'How would you ensure exactly-once processing in a Kafka consumer?' },
      { role: 'candidate', text: 'I\'d use Kafka\'s transactional API with idempotent consumers. The key is to make the processing and offset commit atomic by using Kafka\'s transaction coordinator.' },
      { role: 'ai', text: 'Good answer. Can you describe how you\'d design an API rate limiter for a public REST API?' },
      { role: 'candidate', text: 'I\'d implement a sliding window counter using Redis. Each request increments a key with a TTL, and we check the count against the limit. For distributed systems, I\'d use Redis Lua scripts to ensure atomicity.' },
    ],
  },
  'demo-cand-3': {
    title: 'HR Business Partner',
    duration: '35 min',
    type: 'Video Interview',
    messages: [
      { role: 'ai', text: 'Hello James! Welcome to your NEXUS AI interview for the HR Business Partner role. To start, can you describe a time you successfully resolved a conflict between management and employees?' },
      { role: 'candidate', text: 'At my previous company, there was a dispute about remote work policy. Management wanted full return-to-office while employees preferred hybrid. I facilitated focus groups, compiled data on productivity metrics, and proposed a 3-day hybrid model that satisfied both parties.' },
      { role: 'ai', text: 'That\'s a great example of mediation. How do you approach building trust with both leadership and employees simultaneously?' },
      { role: 'candidate', text: 'Transparency is key. I ensure both parties have access to the same information. I also maintain confidentiality where needed but never make promises I can\'t keep. Regular check-ins and being visible on the floor help build that trust organically.' },
      { role: 'ai', text: 'How do you measure the effectiveness of HR initiatives you implement?' },
      { role: 'candidate', text: 'I use a combination of quantitative metrics like retention rates, time-to-hire, and engagement scores, along with qualitative feedback from pulse surveys. I believe in setting clear KPIs before launching any initiative.' },
    ],
  },
};

// Default transcript for candidates without specific ones
const DEFAULT_TRANSCRIPT = {
  title: 'Technical Position',
  duration: '20 min',
  type: 'Text Chat',
  messages: [
    { role: 'ai', text: 'Hello! I\'m your NEXUS AI interviewer today. Let\'s start with a brief introduction. Can you tell me about yourself and what interests you about this role?' },
    { role: 'candidate', text: 'I\'m a passionate professional with experience in building scalable applications. This role excites me because of the opportunity to work on challenging problems and grow with the team.' },
    { role: 'ai', text: 'Great! Can you describe a recent project you\'re particularly proud of?' },
    { role: 'candidate', text: 'I led the migration of a legacy monolith to a microservices architecture. We reduced deployment time by 70% and improved system reliability from 99.5% to 99.99% uptime.' },
    { role: 'ai', text: 'Impressive results! How did you handle the team dynamics during such a major migration?' },
    { role: 'candidate', text: 'I organized knowledge-sharing sessions and paired senior engineers with juniors. We used a strangler fig pattern to migrate incrementally, which reduced risk and kept the team confident throughout the process.' },
  ],
};

// ==================== INTERFACES ====================

interface CandidateData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  currentTitle: string | null;
  status: string;
  aiScore: number | null;
  skillMatch: number | null;
  cultureFitScore: number | null;
  jobId: string;
  job?: { id: string; title: string };
}

interface InterviewData {
  id: string;
  type: string;
  scheduledAt: string;
  duration: number | null;
  status: string;
  feedback: string | null;
  rating: number | null;
  meetingLink: string | null;
  aiTranscript: string | null;
  candidateId: string;
  jobId: string;
  candidate?: { id: string; firstName: string; lastName: string; email: string };
}

// ==================== HELPERS ====================

function getOverallScore(candidate: CandidateData): number {
  const scores = [candidate.aiScore, candidate.skillMatch, candidate.cultureFitScore].filter((s): s is number => s !== null && s !== undefined);
  if (scores.length === 0) return 0;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

function getTypeLabel(type: string): string {
  const map: Record<string, string> = {
    text: 'Text Chat', voice: 'Voice', video: 'Video', mcq: 'MCQ', coding: 'Coding',
    technical: 'Technical', hr: 'HR', behavioral: 'Behavioral',
  };
  return map[type] || type;
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'completed': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400';
    case 'scheduled': return 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400';
    case 'in_progress': return 'bg-teal-100 text-teal-800 dark:bg-teal-950/30 dark:text-teal-400';
    case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400';
    default: return 'bg-slate-100 text-slate-800 dark:bg-slate-950/30 dark:text-slate-400';
  }
}

function getScoreColor(score: number): string {
  if (score >= 85) return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400';
  if (score >= 75) return 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400';
  return 'bg-slate-100 text-slate-800 dark:bg-slate-950/30 dark:text-slate-400';
}

// ==================== COMPONENT ====================

export function AIInterview() {
  const { currentCompany } = useAppStore();

  // Data state
  const [candidates, setCandidates] = useState<CandidateData[]>(DEMO_CANDIDATES);
  const [interviews, setInterviews] = useState<InterviewData[]>(DEMO_INTERVIEWS);
  const [loading, setLoading] = useState(true);
  const [usingDemoData, setUsingDemoData] = useState(false);

  // UI state
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateData | null>(null);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedTranscriptCandidate, setSelectedTranscriptCandidate] = useState<CandidateData | null>(null);

  const [scheduleForm, setScheduleForm] = useState({
    candidateId: '',
    jobId: '',
    type: 'text',
    scheduledAt: '',
    duration: '60',
    meetingLink: '',
  });

  // ==================== DATA FETCHING ====================

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [candidatesRes, interviewsRes] = await Promise.all([
        getCandidates({ limit: 50 }),
        getInterviews({}),
      ]);

      const fetchedCandidates: CandidateData[] = (candidatesRes as { data?: CandidateData[] })?.data || [];
      const fetchedInterviews: InterviewData[] = (interviewsRes as { data?: InterviewData[] })?.data || [];

      if (fetchedCandidates.length > 0) {
        setCandidates(fetchedCandidates);
        setUsingDemoData(false);
      } else {
        setCandidates(DEMO_CANDIDATES);
        setUsingDemoData(true);
      }

      if (fetchedInterviews.length > 0) {
        setInterviews(fetchedInterviews);
      } else {
        setInterviews(DEMO_INTERVIEWS);
      }
    } catch (error) {
      console.error('Failed to load interview data, using demo data:', error);
      setCandidates(DEMO_CANDIDATES);
      setInterviews(DEMO_INTERVIEWS);
      setUsingDemoData(true);
      toast.info('Using demo data — API connection unavailable');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Set default selected candidate when data loads
  useEffect(() => {
    if (candidates.length > 0 && !selectedCandidate) {
      setSelectedCandidate(candidates[0]);
    }
  }, [candidates, selectedCandidate]);

  // ==================== SCHEDULE INTERVIEW ====================

  const handleScheduleInterview = async () => {
    if (!scheduleForm.candidateId || !scheduleForm.jobId || !scheduleForm.scheduledAt) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);

      if (usingDemoData) {
        // Demo mode: create a local interview entry
        const candidate = candidates.find(c => c.id === scheduleForm.candidateId);
        const newInterview: InterviewData = {
          id: `demo-int-${Date.now()}`,
          type: scheduleForm.type,
          scheduledAt: scheduleForm.scheduledAt,
          duration: parseInt(scheduleForm.duration, 10) || 60,
          status: 'scheduled',
          feedback: null,
          rating: null,
          meetingLink: scheduleForm.meetingLink || null,
          aiTranscript: null,
          candidateId: scheduleForm.candidateId,
          jobId: scheduleForm.jobId,
          candidate: candidate
            ? { id: candidate.id, firstName: candidate.firstName, lastName: candidate.lastName, email: candidate.email }
            : undefined,
        };
        setInterviews(prev => [newInterview, ...prev]);
        toast.success('Interview scheduled successfully (demo mode)');
      } else {
        await createInterview({
          candidateId: scheduleForm.candidateId,
          jobId: scheduleForm.jobId,
          type: scheduleForm.type,
          scheduledAt: scheduleForm.scheduledAt,
          duration: parseInt(scheduleForm.duration, 10),
          meetingLink: scheduleForm.meetingLink || undefined,
        });
        toast.success('Interview scheduled successfully');
        // Refresh data from API
        fetchData();
      }

      setScheduleDialogOpen(false);
      setScheduleForm({ candidateId: '', jobId: '', type: 'text', scheduledAt: '', duration: '60', meetingLink: '' });
    } catch (error) {
      console.error('Failed to schedule interview:', error);
      toast.error('Failed to schedule interview. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ==================== DERIVED DATA ====================

  const radarData = selectedCandidate
    ? [
        { subject: 'AI Score', A: selectedCandidate.aiScore ?? 0, fullMark: 100 },
        { subject: 'Skill Match', A: selectedCandidate.skillMatch ?? 0, fullMark: 100 },
        { subject: 'Culture Fit', A: selectedCandidate.cultureFitScore ?? 0, fullMark: 100 },
        { subject: 'Communication', A: Math.min(100, Math.round((selectedCandidate.aiScore ?? 0) * 0.9 + (selectedCandidate.cultureFitScore ?? 0) * 0.1)), fullMark: 100 },
        { subject: 'Technical Depth', A: Math.min(100, Math.round((selectedCandidate.skillMatch ?? 0) * 0.85 + (selectedCandidate.aiScore ?? 0) * 0.15)), fullMark: 100 },
      ]
    : [];

  const overallScore = selectedCandidate ? getOverallScore(selectedCandidate) : 0;

  const transcriptInfo = selectedTranscriptCandidate
    ? (TRANSCRIPT_DATA[selectedTranscriptCandidate.id] || DEFAULT_TRANSCRIPT)
    : DEFAULT_TRANSCRIPT;

  // Stats
  const totalInterviews = interviews.length;
  const completedInterviews = interviews.filter(i => i.status === 'completed').length;
  const scheduledInterviews = interviews.filter(i => i.status === 'scheduled').length;
  const avgRating = interviews.filter(i => i.rating).length > 0
    ? (interviews.filter(i => i.rating).reduce((sum, i) => sum + (i.rating || 0), 0) / interviews.filter(i => i.rating).length).toFixed(1)
    : '0';

  // ==================== LOADING STATE ====================

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-44" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}><CardContent className="p-4"><Skeleton className="h-16 w-full" /></CardContent></Card>
          ))}
        </div>
        <Skeleton className="h-10 w-72" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}><CardContent className="p-5"><Skeleton className="h-40 w-full" /></CardContent></Card>
          ))}
        </div>
      </div>
    );
  }

  // ==================== RENDER ====================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-emerald-600" />
            AI Interview
          </h1>
          <p className="text-muted-foreground text-sm">Conduct AI-powered interviews with smart evaluation</p>
          {usingDemoData && (
            <Badge variant="outline" className="mt-1 text-[10px] border-amber-300 text-amber-700 dark:text-amber-400">
              Demo Mode — API unavailable
            </Badge>
          )}
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setScheduleDialogOpen(true)}>
          <Play className="h-4 w-4 mr-2" /> Schedule Interview
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <MessageSquare className="h-5 w-5 mx-auto text-emerald-600 mb-1" />
            <p className="text-2xl font-bold text-emerald-600">{totalInterviews}</p>
            <p className="text-xs text-muted-foreground">Total Interviews</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckSquare className="h-5 w-5 mx-auto text-teal-600 mb-1" />
            <p className="text-2xl font-bold text-teal-600">{completedInterviews}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-5 w-5 mx-auto text-amber-600 mb-1" />
            <p className="text-2xl font-bold text-amber-600">{scheduledInterviews}</p>
            <p className="text-xs text-muted-foreground">Scheduled</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="h-5 w-5 mx-auto text-rose-600 mb-1" />
            <p className="text-2xl font-bold text-rose-600">{avgRating}</p>
            <p className="text-xs text-muted-foreground">Avg Rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Schedule Interview Dialog */}
      <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Interview</DialogTitle>
            <DialogDescription>Create a new AI interview session for a candidate.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Candidate *</Label>
              <Select
                value={scheduleForm.candidateId}
                onValueChange={(value) => {
                  const cand = candidates.find((c) => c.id === value);
                  setScheduleForm((prev) => ({
                    ...prev,
                    candidateId: value,
                    jobId: cand?.jobId || prev.jobId,
                  }));
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select candidate" />
                </SelectTrigger>
                <SelectContent>
                  {candidates.filter((c) => c.id && c.id.trim()).map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.firstName} {c.lastName}
                    </SelectItem>
                  ))}
                  {candidates.filter((c) => c.id && c.id.trim()).length === 0 && (
                    <SelectItem value="_empty" disabled>No candidates available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Job *</Label>
              <Input
                value={scheduleForm.jobId
                  ? candidates.find(c => c.id === scheduleForm.candidateId)?.job?.title || scheduleForm.jobId
                  : ''}
                onChange={(e) => setScheduleForm((prev) => ({ ...prev, jobId: e.target.value }))}
                placeholder="Auto-filled from candidate"
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label>Interview Type *</Label>
              <Select
                value={scheduleForm.type}
                onValueChange={(value) => setScheduleForm((prev) => ({ ...prev, type: value }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text Chat</SelectItem>
                  <SelectItem value="voice">Voice Interview</SelectItem>
                  <SelectItem value="video">Video Interview</SelectItem>
                  <SelectItem value="mcq">MCQ Assessment</SelectItem>
                  <SelectItem value="coding">Coding Challenge</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                  <SelectItem value="behavioral">Behavioral</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Scheduled Date & Time *</Label>
              <Input
                type="datetime-local"
                value={scheduleForm.scheduledAt}
                onChange={(e) => setScheduleForm((prev) => ({ ...prev, scheduledAt: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Duration (min)</Label>
                <Input
                  type="number"
                  value={scheduleForm.duration}
                  onChange={(e) => setScheduleForm((prev) => ({ ...prev, duration: e.target.value }))}
                  placeholder="60"
                />
              </div>
              <div className="space-y-2">
                <Label>Meeting Link</Label>
                <Input
                  value={scheduleForm.meetingLink}
                  onChange={(e) => setScheduleForm((prev) => ({ ...prev, meetingLink: e.target.value }))}
                  placeholder="https://meet.example.com/..."
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleDialogOpen(false)}>Cancel</Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={handleScheduleInterview}
              disabled={submitting}
            >
              {submitting ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Scheduling...</>
              ) : (
                <><Play className="h-4 w-4 mr-2" /> Schedule</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main Tabs */}
      <Tabs defaultValue="types" className="space-y-4">
        <TabsList>
          <TabsTrigger value="types">Interview Types</TabsTrigger>
          <TabsTrigger value="scores">Score Cards</TabsTrigger>
          <TabsTrigger value="transcript">Transcript View</TabsTrigger>
        </TabsList>

        {/* ===== Interview Types Tab ===== */}
        <TabsContent value="types">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {INTERVIEW_TYPES.map(type => (
              <Card key={type.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${type.color}`}>
                    {type.icon}
                  </div>
                  <h3 className="font-semibold mb-1">{type.label}</h3>
                  <p className="text-xs text-muted-foreground mb-4">{type.description}</p>
                  <div className="flex items-center gap-2">
                    <Button
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                      size="sm"
                      onClick={() => {
                        setScheduleForm(prev => ({ ...prev, type: type.id }));
                        setScheduleDialogOpen(true);
                      }}
                    >
                      <Play className="h-3.5 w-3.5 mr-1" /> Configure
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const candidate = candidates.find(c => TRANSCRIPT_DATA[c.id]);
                        if (candidate) {
                          setSelectedTranscriptCandidate(candidate);
                        } else {
                          setSelectedTranscriptCandidate(candidates[0] || null);
                        }
                      }}
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" /> Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Interviews List */}
          <Card className="mt-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-600" /> Recent Interviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              {interviews.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No interviews scheduled yet.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => setScheduleDialogOpen(true)}
                  >
                    <Play className="h-3.5 w-3.5 mr-1" /> Schedule First Interview
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {interviews.map((interview) => (
                    <div
                      key={interview.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center">
                          <User className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {interview.candidate ? `${interview.candidate.firstName} ${interview.candidate.lastName}` : 'Unknown Candidate'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {getTypeLabel(interview.type)} · {interview.duration || 60} min · {new Date(interview.scheduledAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {interview.rating && (
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${i < (interview.rating || 0) ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`}
                              />
                            ))}
                          </div>
                        )}
                        <Badge className={`text-[10px] ${getStatusColor(interview.status)}`}>
                          {interview.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== Score Cards Tab ===== */}
        <TabsContent value="scores" className="space-y-4">
          {candidates.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Brain className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No candidates found. Add candidates to see AI evaluation scores.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Candidate List */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Candidates</CardTitle>
                  <CardDescription>{candidates.length} candidates evaluated</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                  {candidates.map(candidate => {
                    const score = getOverallScore(candidate);
                    return (
                      <div
                        key={candidate.id}
                        onClick={() => setSelectedCandidate(candidate)}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedCandidate?.id === candidate.id
                            ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                            : 'border-border hover:bg-accent/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                              {candidate.firstName[0]}{candidate.lastName[0]}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{candidate.firstName} {candidate.lastName}</p>
                              <p className="text-[10px] text-muted-foreground">{candidate.currentTitle || 'No title'}</p>
                            </div>
                          </div>
                          <Badge className={`text-[10px] ${getScoreColor(score)}`}>
                            <Brain className="h-3 w-3 mr-1" />{score}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Radar Chart */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Evaluation Radar</CardTitle>
                  <CardDescription>
                    {selectedCandidate ? `${selectedCandidate.firstName} ${selectedCandidate.lastName}` : 'No candidate selected'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedCandidate ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart data={radarData}>
                        <PolarGrid strokeDasharray="3 3" />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                        <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9 }} />
                        <Radar
                          name="Score"
                          dataKey="A"
                          stroke="#059669"
                          fill="#059669"
                          fillOpacity={0.2}
                          strokeWidth={2}
                        />
                        <Tooltip
                          formatter={(value: number) => [`${value}%`, 'Score']}
                          contentStyle={{ fontSize: 12, borderRadius: 8 }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center">
                      <p className="text-sm text-muted-foreground">Select a candidate to view scores</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Score Breakdown */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Score Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedCandidate ? (
                    <>
                      {/* Candidate Header */}
                      <div className="flex items-center gap-3 pb-3 border-b">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold">
                          {selectedCandidate.firstName[0]}{selectedCandidate.lastName[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{selectedCandidate.firstName} {selectedCandidate.lastName}</p>
                          <p className="text-xs text-muted-foreground">{selectedCandidate.currentTitle || 'N/A'}</p>
                          {selectedCandidate.job && (
                            <p className="text-[10px] text-emerald-600">{selectedCandidate.job.title}</p>
                          )}
                        </div>
                      </div>

                      {/* Score Bars */}
                      {[
                        { label: 'AI Score', value: selectedCandidate.aiScore ?? 0, color: 'bg-emerald-500' },
                        { label: 'Skill Match', value: selectedCandidate.skillMatch ?? 0, color: 'bg-teal-500' },
                        { label: 'Culture Fit', value: selectedCandidate.cultureFitScore ?? 0, color: 'bg-amber-500' },
                      ].map(skill => (
                        <div key={skill.label}>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">{skill.label}</span>
                            <span className="font-semibold">{skill.value}%</span>
                          </div>
                          <div className="relative h-2 w-full rounded-full bg-muted overflow-hidden">
                            <div
                              className={`absolute left-0 top-0 h-full rounded-full ${skill.color} transition-all duration-500`}
                              style={{ width: `${skill.value}%` }}
                            />
                          </div>
                        </div>
                      ))}

                      {/* Overall Score */}
                      <div className="pt-3 border-t mt-3">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm">Overall Score</span>
                          <Badge className={`text-sm px-3 py-1 ${getScoreColor(overallScore)}`}>
                            <Star className="h-3.5 w-3.5 mr-1" />{overallScore}/100
                          </Badge>
                        </div>
                      </div>

                      {/* Recommendation */}
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs font-medium mb-1">AI Recommendation</p>
                        <p className="text-xs text-muted-foreground">
                          {overallScore >= 90
                            ? 'Strong hire — Exceptional candidate with excellent alignment across all dimensions.'
                            : overallScore >= 80
                              ? 'Recommend hire — Good fit for the role with solid technical and cultural alignment.'
                            : overallScore >= 70
                              ? 'Conditional — Shows potential but may need further evaluation in specific areas.'
                              : 'Not recommended — Significant gaps identified. Consider other candidates.'}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="py-8 text-center">
                      <p className="text-sm text-muted-foreground">Select a candidate to view breakdown</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* ===== Transcript View Tab ===== */}
        <TabsContent value="transcript">
          {/* Candidate selector for transcripts */}
          <div className="mb-4">
            <Label className="text-sm mb-2 block">Select Candidate Transcript</Label>
            <Select
              value={selectedTranscriptCandidate?.id || ''}
              onValueChange={(value) => {
                const cand = candidates.find(c => c.id === value);
                setSelectedTranscriptCandidate(cand || null);
              }}
            >
              <SelectTrigger className="w-full sm:w-80">
                <SelectValue placeholder="Choose a candidate" />
              </SelectTrigger>
              <SelectContent>
                {candidates.map(c => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.firstName} {c.lastName} — {c.currentTitle || 'N/A'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Bot className="h-4 w-4 text-emerald-600" /> Interview Transcript
              </CardTitle>
              <CardDescription>
                {transcriptInfo.title} · {transcriptInfo.type} · {transcriptInfo.duration}
              </CardDescription>
            </CardHeader>
            <CardContent className="max-h-[500px] overflow-y-auto space-y-3">
              {transcriptInfo.messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    msg.role === 'ai'
                      ? 'bg-muted rounded-tl-none'
                      : 'bg-emerald-600 text-white rounded-tr-none'
                  }`}>
                    <div className="flex items-center gap-1.5 mb-1">
                      {msg.role === 'ai' ? (
                        <><Bot className="h-3.5 w-3.5" /><span className="text-[10px] font-medium">NEXUS AI Interviewer</span></>
                      ) : (
                        <><User className="h-3.5 w-3.5" /><span className="text-[10px] font-medium">Candidate</span></>
                      )}
                    </div>
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}

              {/* Transcript footer / AI analysis */}
              <div className="mt-4 pt-4 border-t">
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-emerald-600" />
                    <span className="text-xs font-semibold">NEXUS AI Analysis</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-[10px] text-muted-foreground">Communication</p>
                      <p className="text-sm font-semibold text-emerald-600">
                        {selectedTranscriptCandidate ? Math.round((selectedTranscriptCandidate.aiScore ?? 0) * 0.9 + (selectedTranscriptCandidate.cultureFitScore ?? 0) * 0.1) : 0}%
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Technical Depth</p>
                      <p className="text-sm font-semibold text-teal-600">
                        {selectedTranscriptCandidate ? Math.round((selectedTranscriptCandidate.skillMatch ?? 0) * 0.85 + (selectedTranscriptCandidate.aiScore ?? 0) * 0.15) : 0}%
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Confidence</p>
                      <p className="text-sm font-semibold text-amber-600">
                        {selectedTranscriptCandidate ? Math.round((selectedTranscriptCandidate.aiScore ?? 0) * 0.8 + (selectedTranscriptCandidate.cultureFitScore ?? 0) * 0.2) : 0}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
