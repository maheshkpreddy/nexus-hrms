'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Heart, TrendingUp, MessageSquare, Award, ThumbsUp, Send, Star } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const PULSE_SURVEYS = [
  { id: 1, question: 'How satisfied are you with your work environment?', score: 4.2, responses: 89, trend: 'up' },
  { id: 2, question: 'Do you feel recognized for your contributions?', score: 3.8, responses: 85, trend: 'up' },
  { id: 3, question: 'How would you rate work-life balance?', score: 3.5, responses: 92, trend: 'down' },
  { id: 4, question: 'Do you have growth opportunities?', score: 4.0, responses: 87, trend: 'stable' },
  { id: 5, question: 'How effective is team communication?', score: 3.9, responses: 90, trend: 'up' },
];

const SENTIMENT_DATA = [
  { month: 'Aug', positive: 72, neutral: 18, negative: 10 },
  { month: 'Sep', positive: 75, neutral: 16, negative: 9 },
  { month: 'Oct', positive: 73, neutral: 17, negative: 10 },
  { month: 'Nov', positive: 78, neutral: 14, negative: 8 },
  { month: 'Dec', positive: 76, neutral: 15, negative: 9 },
  { month: 'Jan', positive: 80, neutral: 13, negative: 7 },
];

const RECOGNITION_WALL = [
  { from: 'Sarah Johnson', to: 'Raj Patel', message: 'Outstanding leadership during the HR transformation project!', badge: '🏆 Leadership', date: '2 hours ago' },
  { from: 'Emily Chen', to: 'Michael Brown', message: 'Great job on the new product design launch!', badge: '⭐ Innovation', date: '5 hours ago' },
  { from: 'Raj Patel', to: 'Emily Chen', message: 'Always willing to help team members. True team player!', badge: '🤝 Teamwork', date: '1 day ago' },
  { from: 'Priya Sharma', to: 'Arjun Kumar', message: 'Exceeded quality targets for 3 consecutive months!', badge: '🎯 Excellence', date: '2 days ago' },
];

const eNPSData = [
  { month: 'Aug', score: 42 },
  { month: 'Sep', score: 45 },
  { month: 'Oct', score: 43 },
  { month: 'Nov', score: 48 },
  { month: 'Dec', score: 50 },
  { month: 'Jan', score: 52 },
];

export function Engagement() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Employee Engagement</h1>
          <p className="text-muted-foreground text-sm">Measure and improve employee satisfaction</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Send className="h-4 w-4 mr-2" /> Launch Pulse Survey
        </Button>
      </div>

      {/* Engagement Score */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
          <CardContent className="p-4">
            <Heart className="h-6 w-6 mb-2 opacity-80" />
            <p className="text-3xl font-bold">78</p>
            <p className="text-sm opacity-80">Engagement Score</p>
            <p className="text-xs opacity-70 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> +3 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="h-5 w-5 mx-auto text-amber-600 mb-1" />
            <p className="text-2xl font-bold">52</p>
            <p className="text-xs text-muted-foreground">eNPS Score</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <MessageSquare className="h-5 w-5 mx-auto text-blue-600 mb-1" />
            <p className="text-2xl font-bold">89%</p>
            <p className="text-xs text-muted-foreground">Survey Participation</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <ThumbsUp className="h-5 w-5 mx-auto text-emerald-600 mb-1" />
            <p className="text-2xl font-bold">80%</p>
            <p className="text-xs text-muted-foreground">Positive Sentiment</p>
          </CardContent>
        </Card>
      </div>

      {/* Sentiment Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Employee Sentiment Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={SENTIMENT_DATA}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="positive" stackId="a" fill="#059669" radius={[0, 0, 0, 0]} />
                <Bar dataKey="neutral" stackId="a" fill="#f59e0b" />
                <Bar dataKey="negative" stackId="a" fill="#ef4444" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">eNPS Score Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={eNPSData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#059669" strokeWidth={2} dot={{ fill: '#059669', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pulse Surveys */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Pulse Survey Results</CardTitle>
            <CardDescription>Latest survey responses</CardDescription>
          </CardHeader>
          <CardContent className="max-h-80 overflow-y-auto space-y-3">
            {PULSE_SURVEYS.map(survey => (
              <div key={survey.id} className="p-3 rounded-lg border border-border">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">{survey.question}</p>
                  <Badge variant="secondary" className={`text-[10px] ${
                    survey.trend === 'up' ? 'bg-emerald-100 text-emerald-800' :
                    survey.trend === 'down' ? 'bg-red-100 text-red-800' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {survey.trend === 'up' ? '↑' : survey.trend === 'down' ? '↓' : '→'} {survey.trend}
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Progress value={survey.score * 20} className="h-2" />
                  </div>
                  <span className="text-sm font-semibold">{survey.score}/5</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{survey.responses} responses</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recognition Wall */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-500" /> Recognition Wall
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-80 overflow-y-auto space-y-3">
            {RECOGNITION_WALL.map((rec, i) => (
              <div key={i} className="p-3 rounded-lg border border-border hover:bg-accent/30 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="text-[10px]">{rec.badge}</Badge>
                  <span className="text-xs text-muted-foreground">{rec.date}</span>
                </div>
                <p className="text-sm">{rec.message}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="font-medium text-foreground">{rec.from}</span> → <span className="font-medium text-foreground">{rec.to}</span>
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
