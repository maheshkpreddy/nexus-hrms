'use client';

import dynamic from 'next/dynamic';
import { useAppStore } from '@/store/app-store';
import { LoginScreen } from '@/components/hrms/login-screen';

// Dynamic import HRMSLayout with ssr:false to avoid hydration issues
// and reduce initial bundle size for the login page
const HRMSLayout = dynamic(
  () => import('@/components/hrms/hrms-layout').then(mod => ({ default: mod.HRMSLayout })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground text-sm">Loading NEXUS HRMS...</p>
        </div>
      </div>
    ),
  }
);

export default function Home() {
  const { isAuthenticated } = useAppStore();

  return isAuthenticated ? <HRMSLayout /> : <LoginScreen />;
}
