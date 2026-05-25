import { create } from 'zustand';
import type { UserRole, ModuleKey, CompanyInfo } from '@/lib/types';

interface AppState {
  // Auth
  isAuthenticated: boolean;
  userRole: UserRole;
  userName: string;
  userEmail: string;
  userAvatar: string;
  
  // Company context
  currentCompany: CompanyInfo | null;
  companies: CompanyInfo[];
  
  // Navigation
  activeModule: ModuleKey;
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  
  // Theme
  darkMode: boolean;
  
  // Notifications
  notificationCount: number;
  
  // Actions
  login: (role: UserRole, name: string, email: string) => void;
  logout: () => void;
  setActiveModule: (module: ModuleKey) => void;
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCurrentCompany: (company: CompanyInfo) => void;
  toggleDarkMode: () => void;
}

const DEMO_COMPANIES: CompanyInfo[] = [
  { id: 'c1', name: 'TechCorp Global', code: 'TCG', industry: 'IT Services', country: 'US', currency: 'USD', employeeCount: 2450, isActive: true },
  { id: 'c2', name: 'ManufactPro Industries', code: 'MPI', industry: 'Manufacturing', country: 'IN', currency: 'INR', employeeCount: 5800, isActive: true },
  { id: 'c3', name: 'HealthFirst Solutions', code: 'HFS', industry: 'Healthcare', country: 'GB', currency: 'GBP', employeeCount: 1200, isActive: true },
  { id: 'c4', name: 'RetailMax Group', code: 'RMG', industry: 'Retail', country: 'DE', currency: 'EUR', employeeCount: 8900, isActive: true },
  { id: 'c5', name: 'LogiTrans Worldwide', code: 'LTW', industry: 'Logistics', country: 'SG', currency: 'SGD', employeeCount: 3200, isActive: true },
];

export const useAppStore = create<AppState>((set) => ({
  isAuthenticated: false,
  userRole: 'employee',
  userName: '',
  userEmail: '',
  userAvatar: '',
  
  currentCompany: DEMO_COMPANIES[0],
  companies: DEMO_COMPANIES,
  
  activeModule: 'dashboard',
  sidebarOpen: true,
  sidebarCollapsed: false,
  
  darkMode: false,
  notificationCount: 12,
  
  login: (role, name, email) => set({
    isAuthenticated: true,
    userRole: role,
    userName: name,
    userEmail: email,
    activeModule: 'dashboard',
  }),
  
  logout: () => set({
    isAuthenticated: false,
    userRole: 'employee',
    userName: '',
    userEmail: '',
    activeModule: 'dashboard',
  }),
  
  setActiveModule: (module) => set({ activeModule: module }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setCurrentCompany: (company) => set({ currentCompany: company }),
  toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
}));
