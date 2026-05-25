'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Bot, Video, Mic, Type, Code, CheckSquare, Play, Eye,
  Star, Clock, User, Brain, ChevronRight
} from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';

const INTERVIEW_TYPES = [
  { id: 'text', label: 'Text Chat', description: 'AI conducts a text-based interview with smart follow-up questions', icon: <Type className="h-6 w-6" />, color: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600', enabled: true },
  { id: 'voice', label: 'Voice Interview', description: 'AI conducts a voice-based interview with speech analysis', icon: <Mic className="h-6 w-6" />, color: 'bg-purple-50 dark:bg-purple-950/30 text-purple-600', enabled: true },
  { id: 'video', label: 'Video Interview', description: 'AI conducts a video interview with facial expression analysis', icon: <Video className="h-6 w-6" />, color: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600', enabled: true },
  { id: 'mcq', label: 'MCQ Assessment', description: 'AI generates adaptive multiple-choice questions', icon: <CheckSquare className="h-6 w-6" />, color: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600', enabled: true },
  { id: 'coding', label: 'Coding Challenge', description: 'AI evaluates code submissions with test cases', icon: <Code className="h-6 w-6" />, color: 'bg-teal-50 dark:bg-teal-950/30 text-teal-600', enabled: true },
];

const CANDIDATE_SCORES = [
  { candidate: 'Alex Turner', job: 'Senior Full-Stack Developer', technical: 92, communication: 85, problemSolving: 88, cultureFit: 80, leadership: 75, overall: 84 },
  { candidate: 'Maya Singh', job: 'Senior Full-Stack Developer', technical: 85, communication: 90, problemSolving: 82, cultureFit: 88, leadership: 80, overall: 85 },
  { candidate: 'James Williams', job: 'HR Business Partner', technical: 70, communication: 95, problemSolving: 85, cultureFit: 92, leadership: 90, overall: 86 },
];

const EVALUATION_RADAR_DATA = [
  { subject: 'Technical', A: 92 },
  { subject: 'Communication', A: 85 },
  { subject: 'Problem Solving', A: 88 },
  { subject: 'Culture Fit', A: 80 },
  { subject: 'Leadership', A: 75 },
];

const TRANSCRIPT_EXCERPT = [
  { role: 'ai', text: 'Hello Alex! I\'m your AI interviewer today for the Senior Full-Stack Developer position. Let\'s start with your experience. Can you tell me about a complex system you\'ve designed recently?' },
  { role: 'candidate', text: 'I recently designed a microservices architecture for an e-commerce platform handling 10K+ requests per second. I used event-driven patterns with Kafka and implemented circuit breakers for resilience.' },
  { role: 'ai', text: 'That sounds impressive! Can you elaborate on how you handled the circuit breaker pattern and what fallback strategies you implemented?' },
  { role: 'candidate', text: 'We used the Hystrix pattern with three fallback levels: cache-first, then degraded service, and finally a graceful error response. This reduced our error rate by 95% during peak loads.' },
  { role: 'ai', text: 'Excellent explanation. Now, let\'s move to a system design question. How would you design a URL shortener service that can handle 100M URLs?' },
];

export function AIInterview() {
  const [selectedCandidate, setSelectedCandidate] = useState(CANDIDATE_SCORES[0]);

  const radarData = [
    { subject: 'Technical', A: selectedCandidate.technical },
    { subject: 'Communication', A: selectedCandidate.communication },
    { subject: 'Problem Solving', A: selectedCandidate.problemSolving },
    { subject: 'Culture Fit', A: selectedCandidate.cultureFit },
    { subject: 'Leadership', A: selectedCandidate.leadership },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Interview</h1>
          <p className="text-muted-foreground text-sm">Conduct AI-powered interviews with smart evaluation</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Play className="h-4 w-4 mr-2" /> Schedule Interview
        </Button>
      </div>

      <Tabs defaultValue="types" className="space-y-4">
        <TabsList>
          <TabsTrigger value="types">Interview Types</TabsTrigger>
          <TabsTrigger value="scores">Score Cards</TabsTrigger>
          <TabsTrigger value="transcript">Transcript View</TabsTrigger>
        </TabsList>

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
                    <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700" size="sm">
                      <Play className="h-3.5 w-3.5 mr-1" /> Configure
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-3.5 w-3.5 mr-1" /> Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scores" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Candidate List */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Candidates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                {CANDIDATE_SCORES.map(candidate => (
                  <div
                    key={candidate.candidate}
                    onClick={() => setSelectedCandidate(candidate)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedCandidate.candidate === candidate.candidate ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20' : 'border-border hover:bg-accent/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{candidate.candidate}</p>
                        <p className="text-xs text-muted-foreground">{candidate.job}</p>
                      </div>
                      <Badge className={`text-[10px] ${
                        candidate.overall >= 85 ? 'bg-emerald-100 text-emerald-800' :
                        candidate.overall >= 75 ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        <Brain className="h-3 w-3 mr-1" />{candidate.overall}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Radar Chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Evaluation Radar</CardTitle>
                <CardDescription>{selectedCandidate.candidate}</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                    <PolarRadiusAxis domain={[0, 100]} />
                    <Radar name="Score" dataKey="A" stroke="#059669" fill="#059669" fillOpacity={0.2} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Score Breakdown */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Score Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: 'Technical', value: selectedCandidate.technical },
                  { label: 'Communication', value: selectedCandidate.communication },
                  { label: 'Problem Solving', value: selectedCandidate.problemSolving },
                  { label: 'Culture Fit', value: selectedCandidate.cultureFit },
                  { label: 'Leadership', value: selectedCandidate.leadership },
                ].map(skill => (
                  <div key={skill.label}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span>{skill.label}</span>
                      <span className="font-medium">{skill.value}%</span>
                    </div>
                    <Progress value={skill.value} className="h-2" />
                  </div>
                ))}
                <div className="pt-3 border-t mt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">Overall Score</span>
                    <Badge className={`text-sm px-3 py-1 ${
                      selectedCandidate.overall >= 85 ? 'bg-emerald-100 text-emerald-800' :
                      selectedCandidate.overall >= 75 ? 'bg-amber-100 text-amber-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      <Star className="h-3.5 w-3.5 mr-1" />{selectedCandidate.overall}/100
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transcript">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Bot className="h-4 w-4 text-emerald-600" /> Interview Transcript — Alex Turner
              </CardTitle>
              <CardDescription>Senior Full-Stack Developer · Text Interview · 25 min</CardDescription>
            </CardHeader>
            <CardContent className="max-h-96 overflow-y-auto space-y-3">
              {TRANSCRIPT_EXCERPT.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    msg.role === 'ai'
                      ? 'bg-muted rounded-tl-none'
                      : 'bg-emerald-600 text-white rounded-tr-none'
                  }`}>
                    <div className="flex items-center gap-1.5 mb-1">
                      {msg.role === 'ai' ? (
                        <><Bot className="h-3.5 w-3.5" /><span className="text-[10px] font-medium">AI Interviewer</span></>
                      ) : (
                        <><User className="h-3.5 w-3.5" /><span className="text-[10px] font-medium">Alex Turner</span></>
                      )}
                    </div>
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
