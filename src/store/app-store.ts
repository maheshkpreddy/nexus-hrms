import { create } from 'zustand';
import type { UserRole, ModuleKey, CompanyInfo } from '@/lib/types';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyId: string | null;
  avatar: string | null;
  employeeId?: string;
  employeeName?: string;
  companyName?: string;
  companyCode?: string;
  companyCurrency?: string;
}

interface AppState {
  // Auth
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  user: AuthUser | null;
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
  login: (email: string, password: string) => Promise<void>;
  demoLogin: (role: UserRole, name: string, email: string) => void;
  logout: () => void;
  setActiveModule: (module: ModuleKey) => void;
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCurrentCompany: (company: CompanyInfo) => void;
  toggleDarkMode: () => void;
  setNotificationCount: (count: number) => void;
  setCompanies: (companies: CompanyInfo[]) => void;
}

const DEMO_COMPANIES: CompanyInfo[] = [
  { id: 'comp-tcg', name: 'TechCorp Global', code: 'TCG', industry: 'IT Services', country: 'US', currency: 'USD', employeeCount: 12, isActive: true },
  { id: 'comp-mpi', name: 'ManufactPro Industries', code: 'MPI', industry: 'Manufacturing', country: 'IN', currency: 'INR', employeeCount: 8, isActive: true },
  { id: 'comp-hfs', name: 'HealthFirst Solutions', code: 'HFS', industry: 'Healthcare', country: 'GB', currency: 'GBP', employeeCount: 6, isActive: true },
  { id: 'comp-rmg', name: 'RetailMax Group', code: 'RMG', industry: 'Retail', country: 'DE', currency: 'EUR', employeeCount: 5, isActive: true },
  { id: 'comp-ltw', name: 'LogiTrans Worldwide', code: 'LTW', industry: 'Logistics', country: 'SG', currency: 'SGD', employeeCount: 4, isActive: true },
];

export const useAppStore = create<AppState>((set, get) => ({
  isAuthenticated: false,
  isLoading: false,
  authError: null,
  user: null,
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
  notificationCount: 0,
  
  login: async (email: string, password: string) => {
    set({ isLoading: true, authError: null });
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        set({ isLoading: false, authError: data.error || 'Login failed' });
        return;
      }
      
      const apiUser = data.user;
      const apiEmployee = apiUser.employee;
      const apiCompany = apiUser.company;

      const user: AuthUser = {
        id: apiUser.id,
        email: apiUser.email,
        name: apiUser.name,
        role: apiUser.role as UserRole,
        companyId: apiUser.companyId,
        avatar: apiUser.avatar,
        employeeId: apiEmployee?.employeeId,
        employeeName: apiEmployee ? `${apiEmployee.firstName} ${apiEmployee.lastName}` : apiUser.name,
        companyName: apiCompany?.name,
        companyCode: apiCompany?.code,
        companyCurrency: apiCompany?.currency,
      };
      
      // Use company from API data, or fall back to first demo company
      // If the API company doesn't have a valid ID, try to find matching company from companies API
      let company = apiCompany ? {
        id: apiCompany.id,
        name: apiCompany.name,
        code: apiCompany.code || '',
        industry: apiCompany.industry || '',
        country: apiCompany.country || '',
        currency: apiCompany.currency || 'USD',
        employeeCount: 0,
        isActive: true,
      } : DEMO_COMPANIES[0];
      
      set({
        isAuthenticated: true,
        isLoading: false,
        authError: null,
        user,
        userRole: user.role,
        userName: user.employeeName || user.name,
        userEmail: user.email,
        currentCompany: company,
        activeModule: 'dashboard',
      });

      // Fetch companies list after login for the company switcher
      try {
        const companiesRes = await fetch('/api/companies');
        if (companiesRes.ok) {
          const companiesData = await companiesRes.json();
          const apiCompanies = Array.isArray(companiesData) ? companiesData : (companiesData.data || []);
          const mappedCompanies: CompanyInfo[] = apiCompanies.map((c: Record<string, unknown>) => ({
            id: (c.id as string) || '',
            name: (c.name as string) || '',
            code: (c.code as string) || '',
            industry: (c.industry as string) || '',
            country: (c.country as string) || '',
            currency: (c.currency as string) || 'USD',
            employeeCount: (c._count as Record<string, number>)?.employees || 0,
            isActive: (c.isActive as boolean) ?? true,
          })).filter((c: CompanyInfo) => c.id && c.id.trim() !== '');
          if (mappedCompanies.length > 0) {
            set({ companies: mappedCompanies });
            // Update currentCompany to match a real company from the database
            const matchingCompany = mappedCompanies.find((c: CompanyInfo) => c.id === company.id);
            if (!matchingCompany && mappedCompanies.length > 0) {
              // Try to match by name or code
              const nameMatch = mappedCompanies.find((c: CompanyInfo) => 
                c.name === company.name || c.code === company.code
              );
              set({ currentCompany: nameMatch || mappedCompanies[0] });
            }
          }
        }
      } catch {
        // Silently fail - use default companies
      }
    } catch {
      set({ isLoading: false, authError: 'Network error. Please try again.' });
    }
  },
  
  demoLogin: (role, name, email) => {
    const user: AuthUser = {
      id: 'demo',
      email,
      name,
      role,
      companyId: DEMO_COMPANIES[0].id,
      avatar: null,
    };
    set({
      isAuthenticated: true,
      isLoading: false,
      authError: null,
      user,
      userRole: role,
      userName: name,
      userEmail: email,
      activeModule: 'dashboard',
    });
  },
  
  logout: () => set({
    isAuthenticated: false,
    isLoading: false,
    authError: null,
    user: null,
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
  setNotificationCount: (count) => set({ notificationCount: count }),
  setCompanies: (companies) => set({ companies }),
}));
