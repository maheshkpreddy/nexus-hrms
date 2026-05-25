'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store/app-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  User, Bell, Palette, Key, Plug, Shield, Save, Camera
} from 'lucide-react';

export function Settings() {
  const { userName, userEmail, userRole, darkMode, toggleDarkMode } = useAppStore();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    leave: true,
    payroll: true,
    recruitment: true,
    weekly_digest: false,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your account and application preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="profile" className="text-xs">Profile</TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs">Notifications</TabsTrigger>
          <TabsTrigger value="theme" className="text-xs">Theme</TabsTrigger>
          <TabsTrigger value="api" className="text-xs">API Keys</TabsTrigger>
          <TabsTrigger value="integrations" className="text-xs">Integrations</TabsTrigger>
        </TabsList>

        {/* Profile */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><User className="h-4 w-4" /> Profile Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-2xl font-bold">
                  {userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <Button variant="outline" size="sm"><Camera className="h-3.5 w-3.5 mr-1" /> Change Avatar</Button>
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm">Full Name</Label>
                  <Input defaultValue={userName} />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">Email</Label>
                  <Input defaultValue={userEmail} type="email" />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">Role</Label>
                  <Input value={userRole} disabled />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">Phone</Label>
                  <Input placeholder="Enter phone number" />
                </div>
              </div>
              <Button className="bg-emerald-600 hover:bg-emerald-700"><Save className="h-4 w-4 mr-2" /> Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><Bell className="h-4 w-4" /> Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'email', label: 'Email Notifications', description: 'Receive notifications via email' },
                { key: 'push', label: 'Push Notifications', description: 'Browser push notifications' },
                { key: 'leave', label: 'Leave Updates', description: 'Leave request and approval updates' },
                { key: 'payroll', label: 'Payroll Alerts', description: 'Payroll processing and payment notifications' },
                { key: 'recruitment', label: 'Recruitment Updates', description: 'New applications and interview schedules' },
                { key: 'weekly_digest', label: 'Weekly Digest', description: 'Summary of weekly HR activities' },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <Switch
                    checked={notifications[item.key as keyof typeof notifications]}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, [item.key]: checked }))}
                  />
                </div>
              ))}
              <Button className="bg-emerald-600 hover:bg-emerald-700"><Save className="h-4 w-4 mr-2" /> Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Theme */}
        <TabsContent value="theme" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><Palette className="h-4 w-4" /> Theme Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Dark Mode</p>
                  <p className="text-xs text-muted-foreground">Toggle dark mode for the application</p>
                </div>
                <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-3">Accent Color</p>
                <div className="flex gap-2">
                  {['#059669', '#0d9488', '#0891b2', '#7c3aed', '#db2777', '#ea580c'].map(color => (
                    <button
                      key={color}
                      className="w-8 h-8 rounded-full border-2 border-transparent hover:border-foreground/30 transition-colors"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-3">Font Size</p>
                <div className="flex gap-2">
                  {['Small', 'Medium', 'Large'].map(size => (
                    <Button key={size} variant={size === 'Medium' ? 'default' : 'outline'} size="sm">{size}</Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Keys */}
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><Key className="h-4 w-4" /> API Keys</CardTitle>
              <CardDescription>Manage your API keys for integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg border border-border flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Production API Key</p>
                  <p className="text-xs text-muted-foreground font-mono">nxs_prod_****************************a7f3</p>
                </div>
                <Button variant="outline" size="sm">Regenerate</Button>
              </div>
              <div className="p-3 rounded-lg border border-border flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Sandbox API Key</p>
                  <p className="text-xs text-muted-foreground font-mono">nxs_test_****************************b2e8</p>
                </div>
                <Button variant="outline" size="sm">Regenerate</Button>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Shield className="h-3 w-3" /> API keys are encrypted and never shown in full
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><Plug className="h-4 w-4" /> Integration Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: 'Slack', description: 'Send HR notifications to Slack channels', connected: true },
                { name: 'Google Workspace', description: 'Sync calendars and manage email', connected: true },
                { name: 'Jira', description: 'Sync project management tasks', connected: false },
                { name: 'Salesforce', description: 'Sync CRM data and contacts', connected: false },
                { name: 'DocuSign', description: 'Digital signature for documents', connected: true },
              ].map(integration => (
                <div key={integration.name} className="p-3 rounded-lg border border-border flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{integration.name}</p>
                    <p className="text-xs text-muted-foreground">{integration.description}</p>
                  </div>
                  <Button variant={integration.connected ? 'outline' : 'default'} size="sm"
                    className={integration.connected ? '' : 'bg-emerald-600 hover:bg-emerald-700'}>
                    {integration.connected ? 'Disconnect' : 'Connect'}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
