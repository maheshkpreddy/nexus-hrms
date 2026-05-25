'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/app-store';
import { ROLE_LABELS, type UserRole } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, UserCheck, Building2, Truck, Hexagon, ArrowRight, Sparkles } from 'lucide-react';

const DEMO_LOGINS: { role: UserRole; name: string; email: string; icon: React.ReactNode; color: string }[] = [
  { role: 'super_admin', name: 'Admin Nexus', email: 'admin@nexushrms.com', icon: <Shield className="h-4 w-4" />, color: 'bg-red-500 hover:bg-red-600' },
  { role: 'company_hr_admin', name: 'Sarah Johnson', email: 'sarah.j@techcorp.com', icon: <Users className="h-4 w-4" />, color: 'bg-purple-500 hover:bg-purple-600' },
  { role: 'employee', name: 'Raj Patel', email: 'raj.p@techcorp.com', icon: <UserCheck className="h-4 w-4" />, color: 'bg-emerald-500 hover:bg-emerald-600' },
  { role: 'client', name: 'Acme Corp', email: 'hr@acme.com', icon: <Building2 className="h-4 w-4" />, color: 'bg-amber-500 hover:bg-amber-600' },
  { role: 'vendor', name: 'TalentHunt', email: 'info@talenthunt.com', icon: <Truck className="h-4 w-4" />, color: 'bg-teal-500 hover:bg-teal-600' },
];

export function LoginScreen() {
  const { login } = useAppStore();
  const [selectedRole, setSelectedRole] = useState<UserRole>('employee');
  const [name, setName] = useState('Raj Patel');
  const [email, setEmail] = useState('raj.p@techcorp.com');

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    const demo = DEMO_LOGINS.find(d => d.role === role);
    if (demo) {
      setName(demo.name);
      setEmail(demo.email);
    }
  };

  const handleLogin = () => {
    if (name && email) {
      login(selectedRole, name, email);
    }
  };

  const handleQuickLogin = (role: UserRole, name: string, email: string) => {
    login(role, name, email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900" />
      
      {/* Animated background shapes */}
      <motion.div
        className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-400/5 rounded-full blur-3xl"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo and Branding */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl shadow-2xl shadow-emerald-500/30 mb-4"
            animate={{ rotateY: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <Hexagon className="h-10 w-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-white tracking-tight">NEXUS HRMS</h1>
          <p className="text-emerald-200/80 mt-2 text-sm">AI-Powered Enterprise Human Resource Management</p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-white text-xl flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-400" />
                Sign In to NEXUS HRMS
              </CardTitle>
              <CardDescription className="text-emerald-200/70">
                Select your role and enter your credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-emerald-100 text-sm font-medium">Role</Label>
                <Select value={selectedRole} onValueChange={(v) => handleRoleChange(v as UserRole)}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    {Object.entries(ROLE_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key} className="text-white focus:bg-emerald-600 focus:text-white">
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-emerald-100 text-sm font-medium">Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="bg-white/10 border-white/20 text-white placeholder:text-emerald-200/50 focus:border-emerald-400"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-emerald-100 text-sm font-medium">Email</Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  type="email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-emerald-200/50 focus:border-emerald-400"
                />
              </div>

              <Button
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold h-11 shadow-lg shadow-emerald-500/30"
                disabled={!name || !email}
              >
                Sign In <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-transparent px-2 text-emerald-200/70">Quick Demo Login</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {DEMO_LOGINS.map((demo) => (
                  <motion.button
                    key={demo.role}
                    onClick={() => handleQuickLogin(demo.role, demo.name, demo.email)}
                    className={`${demo.color} text-white rounded-lg px-3 py-2.5 text-xs font-medium flex items-center gap-2 transition-all shadow-md hover:shadow-lg`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {demo.icon}
                    {ROLE_LABELS[demo.role]}
                  </motion.button>
                ))}
              </div>

              <p className="text-center text-emerald-200/50 text-xs mt-2">
                Demo mode — No real authentication required
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-emerald-200/40 text-xs mt-6"
        >
          © 2025 NEXUS HRMS. AI-Powered Enterprise HR Platform.
        </motion.p>
      </div>
    </div>
  );
}
