'use client';

import { useAppStore } from '@/store/app-store';
import { LoginScreen } from '@/components/hrms/login-screen';
import { HRMSLayout } from '@/components/hrms/hrms-layout';

export default function Home() {
  const { isAuthenticated } = useAppStore();

  return isAuthenticated ? <HRMSLayout /> : <LoginScreen />;
}
