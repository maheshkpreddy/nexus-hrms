'use client';

import React from 'react';
import { useAppStore } from '@/store/app-store';
import { cn } from '@/lib/utils';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { Dashboard } from './dashboard';
import { Recruitment } from './recruitment';
import { Employees } from './employees';
import { Attendance } from './attendance';
import { Leave } from './leave';
import { Payroll } from './payroll';
import { Performance } from './performance';
import { Learning } from './learning';
import { Engagement } from './engagement';
import { TravelExpense } from './travel-expense';
import { Assets } from './assets';
import { Helpdesk } from './helpdesk';
import { Compliance } from './compliance';
import { Workflow } from './workflow';
import { Analytics } from './analytics';
import { ClientPortal } from './client-portal';
import { VendorPortal } from './vendor-portal';
import { SubVendorPortal } from './sub-vendor-portal';
import { JobPortal } from './job-portal';
import { AIInterview } from './ai-interview';
import { AIChatbot } from './ai-chatbot';
import { Alumni } from './alumni';
import { Companies } from './companies';
import { Settings } from './settings';
import { Onboarding } from './onboarding';

const MODULE_COMPONENTS: Record<string, React.ComponentType> = {
  dashboard: Dashboard,
  recruitment: Recruitment,
  employees: Employees,
  attendance: Attendance,
  leave: Leave,
  payroll: Payroll,
  performance: Performance,
  learning: Learning,
  engagement: Engagement,
  travel_expense: TravelExpense,
  assets: Assets,
  helpdesk: Helpdesk,
  compliance: Compliance,
  workflow: Workflow,
  analytics: Analytics,
  client_portal: ClientPortal,
  vendor_portal: VendorPortal,
  sub_vendor_portal: SubVendorPortal,
  job_portal: JobPortal,
  ai_interview: AIInterview,
  ai_chatbot: AIChatbot,
  alumni: Alumni,
  companies: Companies,
  settings: Settings,
  onboarding: Onboarding,
};

export function HRMSLayout() {
  const { activeModule, sidebarCollapsed, darkMode } = useAppStore();

  const ActiveComponent = MODULE_COMPONENTS[activeModule] || Dashboard;

  return (
    <div className={cn('min-h-screen bg-background', darkMode && 'dark')}>
      <Sidebar />
      <div className={cn(
        'transition-all duration-300',
        sidebarCollapsed ? 'lg:ml-[68px]' : 'lg:ml-64'
      )}>
        <Header />
        <main className="p-4 md:p-6">
          <ActiveComponent />
        </main>
      </div>
    </div>
  );
}
