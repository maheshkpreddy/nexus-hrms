import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// ==================== HELPER: Idempotent find-or-create ====================

async function findOrCreateBranch(data: {
  name: string;
  code: string;
  city?: string;
  state?: string;
  country?: string;
  companyId: string;
}) {
  const existing = await db.branch.findFirst({
    where: { code: data.code, companyId: data.companyId },
  });
  if (existing) return existing;
  return db.branch.create({ data });
}

async function findOrCreateDepartment(data: {
  name: string;
  code: string;
  description?: string;
  companyId: string;
  parentId?: string;
}) {
  const existing = await db.department.findFirst({
    where: { code: data.code, companyId: data.companyId },
  });
  if (existing) return existing;
  return db.department.create({ data });
}

async function findOrCreateJob(data: {
  title: string;
  description?: string;
  requirements?: string;
  department?: string;
  location?: string;
  employmentType?: string;
  experienceMin?: number;
  experienceMax?: number;
  salaryMin?: number;
  salaryMax?: number;
  status?: string;
  priority?: string;
  positions?: number;
  filledPositions?: number;
  postedDate?: Date;
  closingDate?: Date;
  companyId: string;
}) {
  const existing = await db.job.findFirst({
    where: { title: data.title, companyId: data.companyId, status: data.status },
  });
  if (existing) return existing;
  return db.job.create({ data });
}

async function findOrCreateCandidate(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  currentCompany?: string;
  currentTitle?: string;
  experience?: number;
  expectedSalary?: number;
  noticePeriod?: string;
  status?: string;
  source?: string;
  aiScore?: number;
  skillMatch?: number;
  cultureFitScore?: number;
  notes?: string;
  jobId: string;
}) {
  const existing = await db.candidate.findFirst({
    where: { email: data.email, jobId: data.jobId },
  });
  if (existing) return existing;
  return db.candidate.create({ data });
}

async function findOrCreateWorkflowDef(data: {
  name: string;
  type: string;
  entity: string;
  description?: string;
  isActive: boolean;
  companyId: string;
  steps: { name: string; stepOrder: number; approverRole?: string; approverType: string; autoApprove?: boolean; action: string }[];
}) {
  const existing = await db.workflowDefinition.findFirst({
    where: { entity: data.entity, companyId: data.companyId },
    include: { steps: true },
  });
  if (existing) return existing;
  return db.workflowDefinition.create({
    data: {
      name: data.name,
      type: data.type,
      entity: data.entity,
      description: data.description,
      isActive: data.isActive,
      companyId: data.companyId,
      steps: {
        create: data.steps,
      },
    },
    include: { steps: true },
  });
}

/**
 * Alias for findOrCreateWorkflowDef — creates a workflow definition with steps
 * if one with the same entity + companyId does not already exist.
 */
async function findOrCreateWorkflow(data: {
  name: string;
  type: string;
  entity: string;
  description?: string;
  isActive: boolean;
  companyId: string;
  steps: { name: string; stepOrder: number; approverRole?: string; approverType: string; autoApprove?: boolean; action: string }[];
}) {
  return findOrCreateWorkflowDef(data);
}

async function findOrCreateSurvey(data: {
  title: string;
  description?: string;
  type: string;
  status: string;
  startDate?: Date;
  endDate?: Date;
  companyId: string;
}) {
  const existing = await db.survey.findFirst({
    where: { title: data.title, companyId: data.companyId },
  });
  if (existing) return existing;
  return db.survey.create({ data });
}

async function findOrCreateShift(data: {
  name: string;
  startTime: string;
  endTime: string;
  breakMinutes: number;
  isActive: boolean;
  companyId: string;
}) {
  const existing = await db.shift.findFirst({
    where: { name: data.name, companyId: data.companyId },
  });
  if (existing) return existing;
  return db.shift.create({ data });
}

// ==================== WORKFLOW DEFINITION TEMPLATES ====================
// These are the 7 major HRMS workflow templates applied to every company.

function getWorkflowTemplates(companyId: string) {
  return [
    // 1. Leave Approval Workflow — entity: "leave", 3 steps
    {
      name: 'Leave Approval Workflow',
      type: 'approval',
      entity: 'leave',
      description: 'Standard leave approval: Direct Manager → HR Review → Auto-approve if both approved',
      isActive: true,
      companyId,
      steps: [
        { name: 'Direct Manager Approval', stepOrder: 0, approverRole: 'manager', approverType: 'role', action: 'approve_reject' },
        { name: 'HR Review', stepOrder: 1, approverRole: 'hr', approverType: 'role', action: 'approve_reject' },
        { name: 'Auto-approve', stepOrder: 2, approverType: 'system', autoApprove: true, action: 'approve_reject' },
      ],
    },
    // 2. Travel Request Approval — entity: "travel", 2 steps
    {
      name: 'Travel Request Approval',
      type: 'approval',
      entity: 'travel',
      description: 'Travel request approval: Manager → Finance',
      isActive: true,
      companyId,
      steps: [
        { name: 'Manager Approval', stepOrder: 0, approverRole: 'manager', approverType: 'role', action: 'approve_reject' },
        { name: 'Finance Approval', stepOrder: 1, approverRole: 'finance', approverType: 'role', action: 'approve_reject' },
      ],
    },
    // 3. Expense Claim Approval — entity: "expense", 2 steps
    {
      name: 'Expense Claim Approval',
      type: 'approval',
      entity: 'expense',
      description: 'Expense claim approval: Manager → Finance',
      isActive: true,
      companyId,
      steps: [
        { name: 'Manager Approval', stepOrder: 0, approverRole: 'manager', approverType: 'role', action: 'approve_reject' },
        { name: 'Finance Approval', stepOrder: 1, approverRole: 'finance', approverType: 'role', action: 'approve_reject' },
      ],
    },
    // 4. Recruitment Pipeline — entity: "recruitment", 4 steps
    {
      name: 'Recruitment Pipeline',
      type: 'approval',
      entity: 'recruitment',
      description: 'Recruitment pipeline: HR Screening → Technical Interview → HR Interview → Offer Approval',
      isActive: true,
      companyId,
      steps: [
        { name: 'HR Screening', stepOrder: 0, approverRole: 'hr', approverType: 'role', action: 'approve_reject' },
        { name: 'Technical Interview', stepOrder: 1, approverRole: 'manager', approverType: 'role', action: 'approve_reject' },
        { name: 'HR Interview', stepOrder: 2, approverRole: 'hr', approverType: 'role', action: 'approve_reject' },
        { name: 'Offer Approval', stepOrder: 3, approverRole: 'admin', approverType: 'role', action: 'approve_reject' },
      ],
    },
    // 5. Performance Review — entity: "performance", 3 steps
    {
      name: 'Performance Review',
      type: 'review',
      entity: 'performance',
      description: 'Performance review: Self Assessment → Manager Review → HR Calibration',
      isActive: true,
      companyId,
      steps: [
        { name: 'Self Assessment', stepOrder: 0, approverType: 'self', autoApprove: true, action: 'approve_reject' },
        { name: 'Manager Review', stepOrder: 1, approverRole: 'manager', approverType: 'role', action: 'approve_reject' },
        { name: 'HR Calibration', stepOrder: 2, approverRole: 'hr', approverType: 'role', action: 'approve_reject' },
      ],
    },
    // 6. Onboarding Workflow — entity: "onboarding", 3 steps
    {
      name: 'Onboarding Workflow',
      type: 'approval',
      entity: 'onboarding',
      description: 'Onboarding: IT Setup → HR Orientation → Department Introduction',
      isActive: true,
      companyId,
      steps: [
        { name: 'IT Setup', stepOrder: 0, approverType: 'system', autoApprove: true, action: 'complete' },
        { name: 'HR Orientation', stepOrder: 1, approverType: 'system', autoApprove: true, action: 'complete' },
        { name: 'Department Introduction', stepOrder: 2, approverType: 'system', autoApprove: true, action: 'complete' },
      ],
    },
    // 7. Offboarding Workflow — entity: "offboarding", 4 steps
    {
      name: 'Offboarding Workflow',
      type: 'approval',
      entity: 'offboarding',
      description: 'Offboarding: Manager Clearance → IT Asset Recovery → Finance Clearance → HR Exit Interview',
      isActive: true,
      companyId,
      steps: [
        { name: 'Manager Clearance', stepOrder: 0, approverRole: 'manager', approverType: 'role', action: 'approve_reject' },
        { name: 'IT Asset Recovery', stepOrder: 1, approverRole: 'admin', approverType: 'role', action: 'approve_reject' },
        { name: 'Finance Clearance', stepOrder: 2, approverRole: 'finance', approverType: 'role', action: 'approve_reject' },
        { name: 'HR Exit Interview', stepOrder: 3, approverRole: 'hr', approverType: 'role', action: 'approve_reject' },
      ],
    },
  ];
}

// ==================== LEAVE POLICY TEMPLATES ====================

function getLeavePolicyTemplates(companyId: string) {
  return [
    { name: 'Casual Leave', type: 'casual', totalDays: 12, carryForward: true, maxCarryDays: 3, isPaid: true, companyId },
    { name: 'Sick Leave', type: 'sick', totalDays: 10, carryForward: false, isPaid: true, companyId },
    { name: 'Earned Leave', type: 'earned', totalDays: 15, carryForward: true, maxCarryDays: 5, isPaid: true, companyId },
    { name: 'Maternity Leave', type: 'maternity', totalDays: 182, carryForward: false, isPaid: true, companyId },
    { name: 'Paternity Leave', type: 'paternity', totalDays: 15, carryForward: false, isPaid: true, companyId },
  ];
}

// ==================== PAYROLL STRUCTURE TEMPLATES ====================

function getPayrollStructureTemplates(companyId: string) {
  return [
    { name: 'Standard Salaried', basicPay: 8000, hra: 3200, da: 800, transportAllowance: 1500, medicalAllowance: 500, specialAllowance: 2000, pfEmployee: 960, pfEmployer: 960, esiEmployee: 200, esiEmployer: 550, taxDeduction: 1200, companyId },
  ];
}

// ==================== SHIFT TEMPLATES ====================

function getShiftTemplates(companyId: string) {
  return [
    { name: 'Morning Shift', startTime: '06:00', endTime: '14:00', breakMinutes: 30, isActive: true, companyId },
    { name: 'Evening Shift', startTime: '14:00', endTime: '22:00', breakMinutes: 30, isActive: true, companyId },
    { name: 'Night Shift', startTime: '22:00', endTime: '06:00', breakMinutes: 30, isActive: true, companyId },
    { name: 'General Shift', startTime: '09:00', endTime: '18:00', breakMinutes: 60, isActive: true, companyId },
  ];
}

// ==================== MAIN SEED FUNCTION ====================

export async function POST() {
  const log: string[] = [];
  const created: Record<string, number> = {};

  try {
    // ==================== COMPANIES (upsert by unique `code`) ====================
    log.push('--- Seeding Companies ---');
    const companies = await Promise.all([
      db.company.upsert({
        where: { code: 'TCG' },
        update: {},
        create: { name: 'TechCorp Global', code: 'TCG', industry: 'IT Services', country: 'US', currency: 'USD', timezone: 'America/New_York', isActive: true },
      }),
      db.company.upsert({
        where: { code: 'MPI' },
        update: {},
        create: { name: 'ManufactPro Industries', code: 'MPI', industry: 'Manufacturing', country: 'IN', currency: 'INR', timezone: 'Asia/Kolkata', isActive: true },
      }),
      db.company.upsert({
        where: { code: 'HFS' },
        update: {},
        create: { name: 'HealthFirst Solutions', code: 'HFS', industry: 'Healthcare', country: 'GB', currency: 'GBP', timezone: 'Europe/London', isActive: true },
      }),
      db.company.upsert({
        where: { code: 'RMG' },
        update: {},
        create: { name: 'RetailMax Group', code: 'RMG', industry: 'Retail', country: 'DE', currency: 'EUR', timezone: 'Europe/Berlin', isActive: true },
      }),
      db.company.upsert({
        where: { code: 'LTW' },
        update: {},
        create: { name: 'LogiTrans Worldwide', code: 'LTW', industry: 'Logistics', country: 'SG', currency: 'SGD', timezone: 'Asia/Singapore', isActive: true },
      }),
    ]);
    created.companies = companies.length;
    log.push(`Companies: ${companies.length} ensured`);

    const tcg = companies[0];
    const mpi = companies[1];
    const hfs = companies[2];
    const rmg = companies[3];
    const ltw = companies[4];

    // ==================== BRANCHES (find by code+companyId) ====================
    log.push('--- Seeding Branches ---');
    const existingBranchCount = await db.branch.count();
    if (existingBranchCount < 8) {
      const branches = await Promise.all([
        findOrCreateBranch({ name: 'HQ San Francisco', code: 'TCG-SF', city: 'San Francisco', state: 'CA', country: 'US', companyId: tcg.id }),
        findOrCreateBranch({ name: 'NYC Office', code: 'TCG-NY', city: 'New York', state: 'NY', country: 'US', companyId: tcg.id }),
        findOrCreateBranch({ name: 'Bangalore Tech Center', code: 'TCG-BLR', city: 'Bangalore', state: 'KA', country: 'IN', companyId: tcg.id }),
        findOrCreateBranch({ name: 'Mumbai HQ', code: 'MPI-MUM', city: 'Mumbai', state: 'MH', country: 'IN', companyId: mpi.id }),
        findOrCreateBranch({ name: 'Delhi Factory', code: 'MPI-DEL', city: 'New Delhi', state: 'DL', country: 'IN', companyId: mpi.id }),
        findOrCreateBranch({ name: 'London Office', code: 'HFS-LON', city: 'London', state: 'England', country: 'GB', companyId: hfs.id }),
        findOrCreateBranch({ name: 'Berlin HQ', code: 'RMG-BER', city: 'Berlin', state: 'Berlin', country: 'DE', companyId: rmg.id }),
        findOrCreateBranch({ name: 'Singapore HQ', code: 'LTW-SG', city: 'Singapore', state: 'Central', country: 'SG', companyId: ltw.id }),
      ]);
      created.branches = branches.length;
      log.push(`Branches: ${branches.length} ensured`);
    } else {
      created.branches = existingBranchCount;
      log.push(`Branches: already exist (${existingBranchCount}), skipped`);
    }

    // Re-fetch branches for references
    const branchSF = await db.branch.findFirst({ where: { code: 'TCG-SF' } });
    const branchNY = await db.branch.findFirst({ where: { code: 'TCG-NY' } });
    const branchBLR = await db.branch.findFirst({ where: { code: 'TCG-BLR' } });
    const branchMUM = await db.branch.findFirst({ where: { code: 'MPI-MUM' } });
    const branchDEL = await db.branch.findFirst({ where: { code: 'MPI-DEL' } });
    const branchLON = await db.branch.findFirst({ where: { code: 'HFS-LON' } });
    const branchBER = await db.branch.findFirst({ where: { code: 'RMG-BER' } });
    const branchSG = await db.branch.findFirst({ where: { code: 'LTW-SG' } });

    // ==================== DEPARTMENTS (find by code+companyId) ====================
    log.push('--- Seeding Departments ---');
    const existingDeptCount = await db.department.count();
    if (existingDeptCount < 14) {
      const departments = await Promise.all([
        findOrCreateDepartment({ name: 'Engineering', code: 'ENG', description: 'Software engineering and development', companyId: tcg.id }),
        findOrCreateDepartment({ name: 'Human Resources', code: 'HR', description: 'People operations and HR management', companyId: tcg.id }),
        findOrCreateDepartment({ name: 'Design', code: 'DSG', description: 'Product design and UX research', companyId: tcg.id }),
        findOrCreateDepartment({ name: 'Finance', code: 'FIN', description: 'Financial planning and accounting', companyId: tcg.id }),
        findOrCreateDepartment({ name: 'Operations', code: 'OPS', description: 'Business operations and strategy', companyId: tcg.id }),
        findOrCreateDepartment({ name: 'Sales', code: 'SAL', description: 'Sales and business development', companyId: tcg.id }),
        findOrCreateDepartment({ name: 'Analytics', code: 'ANA', description: 'Data analytics and BI', companyId: tcg.id }),
        findOrCreateDepartment({ name: 'Production', code: 'PRD', description: 'Manufacturing production', companyId: mpi.id }),
        findOrCreateDepartment({ name: 'Quality', code: 'QAT', description: 'Quality assurance and control', companyId: mpi.id }),
        findOrCreateDepartment({ name: 'Operations', code: 'MOPS', description: 'Plant operations', companyId: mpi.id }),
        findOrCreateDepartment({ name: 'Clinical', code: 'CLI', description: 'Clinical services', companyId: hfs.id }),
        findOrCreateDepartment({ name: 'Administration', code: 'ADM', description: 'Hospital administration', companyId: hfs.id }),
        findOrCreateDepartment({ name: 'Retail Operations', code: 'RTL', description: 'Store operations', companyId: rmg.id }),
        findOrCreateDepartment({ name: 'Logistics', code: 'LOG', description: 'Fleet and logistics', companyId: ltw.id }),
      ]);
      created.departments = departments.length;
      log.push(`Departments: ${departments.length} ensured`);
    } else {
      created.departments = existingDeptCount;
      log.push(`Departments: already exist (${existingDeptCount}), skipped`);
    }

    // Re-fetch departments for references
    const engDept = await db.department.findFirst({ where: { code: 'ENG', companyId: tcg.id } });
    const hrDept = await db.department.findFirst({ where: { code: 'HR', companyId: tcg.id } });
    const designDept = await db.department.findFirst({ where: { code: 'DSG', companyId: tcg.id } });
    const finDept = await db.department.findFirst({ where: { code: 'FIN', companyId: tcg.id } });
    const opsDept = await db.department.findFirst({ where: { code: 'OPS', companyId: tcg.id } });
    const salesDept = await db.department.findFirst({ where: { code: 'SAL', companyId: tcg.id } });
    const anaDept = await db.department.findFirst({ where: { code: 'ANA', companyId: tcg.id } });
    const prodDept = await db.department.findFirst({ where: { code: 'PRD', companyId: mpi.id } });
    const qualDept = await db.department.findFirst({ where: { code: 'QAT', companyId: mpi.id } });
    const mpiOpsDept = await db.department.findFirst({ where: { code: 'MOPS', companyId: mpi.id } });
    const clinDept = await db.department.findFirst({ where: { code: 'CLI', companyId: hfs.id } });
    const adminDept = await db.department.findFirst({ where: { code: 'ADM', companyId: hfs.id } });
    const retailDept = await db.department.findFirst({ where: { code: 'RTL', companyId: rmg.id } });
    const logDept = await db.department.findFirst({ where: { code: 'LOG', companyId: ltw.id } });

    // ==================== USERS (upsert by unique `email`) ====================
    log.push('--- Seeding Users ---');
    const users = await Promise.all([
      db.user.upsert({
        where: { email: 'admin@nexushrms.com' },
        update: {},
        create: { email: 'admin@nexushrms.com', password: 'admin123', name: 'Admin Nexus', role: 'super_admin', isActive: true },
      }),
      db.user.upsert({
        where: { email: 'sarah.j@techcorp.com' },
        update: {},
        create: { email: 'sarah.j@techcorp.com', password: 'sarah123', name: 'Sarah Johnson', role: 'company_hr_admin', companyId: tcg.id, isActive: true },
      }),
      db.user.upsert({
        where: { email: 'raj.p@techcorp.com' },
        update: {},
        create: { email: 'raj.p@techcorp.com', password: 'raj123', name: 'Raj Patel', role: 'employee', companyId: tcg.id, isActive: true },
      }),
      db.user.upsert({
        where: { email: 'emily.c@techcorp.com' },
        update: {},
        create: { email: 'emily.c@techcorp.com', password: 'emily123', name: 'Emily Chen', role: 'employee', companyId: tcg.id, isActive: true },
      }),
      db.user.upsert({
        where: { email: 'michael.b@techcorp.com' },
        update: {},
        create: { email: 'michael.b@techcorp.com', password: 'michael123', name: 'Michael Brown', role: 'employee', companyId: tcg.id, isActive: true },
      }),
      db.user.upsert({
        where: { email: 'priya.s@manufactpro.com' },
        update: {},
        create: { email: 'priya.s@manufactpro.com', password: 'priya123', name: 'Priya Sharma', role: 'reporting_manager', companyId: mpi.id, isActive: true },
      }),
      db.user.upsert({
        where: { email: 'david.w@healthfirst.com' },
        update: {},
        create: { email: 'david.w@healthfirst.com', password: 'david123', name: 'David Wilson', role: 'employee', companyId: hfs.id, isActive: true },
      }),
      db.user.upsert({
        where: { email: 'aiko.t@logitrans.com' },
        update: {},
        create: { email: 'aiko.t@logitrans.com', password: 'aiko123', name: 'Aiko Tanaka', role: 'employee', companyId: ltw.id, isActive: true },
      }),
      db.user.upsert({
        where: { email: 'carlos.r@retailmax.com' },
        update: {},
        create: { email: 'carlos.r@retailmax.com', password: 'carlos123', name: 'Carlos Rodriguez', role: 'employee', companyId: rmg.id, isActive: true },
      }),
      db.user.upsert({
        where: { email: 'lisa.a@techcorp.com' },
        update: {},
        create: { email: 'lisa.a@techcorp.com', password: 'lisa123', name: 'Lisa Anderson', role: 'finance', companyId: tcg.id, isActive: true },
      }),
      db.user.upsert({
        where: { email: 'arjun.k@manufactpro.com' },
        update: {},
        create: { email: 'arjun.k@manufactpro.com', password: 'arjun123', name: 'Arjun Kumar', role: 'employee', companyId: mpi.id, isActive: true },
      }),
      db.user.upsert({
        where: { email: 'hr@acme.com' },
        update: {},
        create: { email: 'hr@acme.com', password: 'acme123', name: 'Acme Corp', role: 'client', companyId: tcg.id, isActive: true },
      }),
      db.user.upsert({
        where: { email: 'info@talenthunt.com' },
        update: {},
        create: { email: 'info@talenthunt.com', password: 'thunt123', name: 'TalentHunt Agency', role: 'vendor', companyId: tcg.id, isActive: true },
      }),
      db.user.upsert({
        where: { email: 'recruiter@techcorp.com' },
        update: {},
        create: { email: 'recruiter@techcorp.com', password: 'recruit123', name: 'Recruiter Kim', role: 'recruiter', companyId: tcg.id, isActive: true },
      }),
    ]);
    created.users = users.length;
    log.push(`Users: ${users.length} ensured`);

    // ==================== EMPLOYEES (upsert by unique `email`) ====================
    log.push('--- Seeding Employees ---');
    const existingEmpCount = await db.employee.count();

    if (existingEmpCount < 35 && engDept && hrDept && designDept && finDept && opsDept && salesDept && anaDept && prodDept && qualDept && mpiOpsDept && clinDept && adminDept && retailDept && logDept) {
      // Helper to safely upsert employee
      const empUpsert = async (email: string, data: Parameters<typeof db.employee.upsert>[0]['create']) => {
        try { return await db.employee.upsert({ where: { email }, update: {}, create: data }); } catch (e) { console.error(`Failed to upsert ${email}:`, e); return null; }
      };
      const empResults = await Promise.all([
        // TechCorp Global (12 employees)
        empUpsert('sarah.j@techcorp.com', { employeeId: 'TCG001', firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.j@techcorp.com', phone: '+1-415-555-0101', designation: 'Senior Software Engineer', jobTitle: 'Senior Developer', employmentType: 'full-time', status: 'active', joiningDate: new Date('2022-03-15'), companyId: tcg.id, branchId: branchSF?.id, departmentId: engDept.id }),
        empUpsert('raj.p@techcorp.com', { employeeId: 'TCG002', firstName: 'Raj', lastName: 'Patel', email: 'raj.p@techcorp.com', phone: '+1-415-555-0102', designation: 'HR Manager', jobTitle: 'HR Manager', employmentType: 'full-time', status: 'active', joiningDate: new Date('2021-07-01'), companyId: tcg.id, branchId: branchSF?.id, departmentId: hrDept.id }),
        empUpsert('emily.c@techcorp.com', { employeeId: 'TCG003', firstName: 'Emily', lastName: 'Chen', email: 'emily.c@techcorp.com', phone: '+1-415-555-0103', designation: 'Product Designer', jobTitle: 'Lead Designer', employmentType: 'full-time', status: 'active', joiningDate: new Date('2023-01-10'), companyId: tcg.id, branchId: branchSF?.id, departmentId: designDept.id }),
        empUpsert('michael.b@techcorp.com', { employeeId: 'TCG004', firstName: 'Michael', lastName: 'Brown', email: 'michael.b@techcorp.com', phone: '+1-212-555-0104', designation: 'DevOps Lead', jobTitle: 'DevOps Lead', employmentType: 'full-time', status: 'probation', joiningDate: new Date('2024-09-01'), probationEnd: new Date('2025-03-01'), companyId: tcg.id, branchId: branchNY?.id, departmentId: engDept.id }),
        empUpsert('lisa.a@techcorp.com', { employeeId: 'TCG005', firstName: 'Lisa', lastName: 'Anderson', email: 'lisa.a@techcorp.com', phone: '+1-212-555-0105', designation: 'Finance Analyst', jobTitle: 'Senior Analyst', employmentType: 'full-time', status: 'active', joiningDate: new Date('2022-08-22'), companyId: tcg.id, branchId: branchNY?.id, departmentId: finDept.id }),
        empUpsert('arjun.m@techcorp.com', { employeeId: 'TCG006', firstName: 'Arjun', lastName: 'Menon', email: 'arjun.m@techcorp.com', phone: '+91-80-555-0106', designation: 'QA Engineer', jobTitle: 'QA Lead', employmentType: 'full-time', status: 'active', joiningDate: new Date('2022-09-20'), companyId: tcg.id, branchId: branchBLR?.id, departmentId: engDept.id }),
        empUpsert('deepa.i@techcorp.com', { employeeId: 'TCG007', firstName: 'Deepa', lastName: 'Iyer', email: 'deepa.i@techcorp.com', phone: '+91-80-555-0107', designation: 'Sales Executive', jobTitle: 'Sales Lead', employmentType: 'full-time', status: 'active', joiningDate: new Date('2023-11-01'), companyId: tcg.id, branchId: branchBLR?.id, departmentId: salesDept.id }),
        empUpsert('vikram.s@techcorp.com', { employeeId: 'TCG008', firstName: 'Vikram', lastName: 'Singh', email: 'vikram.s@techcorp.com', phone: '+91-80-555-0108', designation: 'Data Scientist', jobTitle: 'ML Engineer', employmentType: 'full-time', status: 'active', joiningDate: new Date('2023-04-15'), companyId: tcg.id, branchId: branchBLR?.id, departmentId: anaDept.id }),
        empUpsert('ananya.g@techcorp.com', { employeeId: 'TCG009', firstName: 'Ananya', lastName: 'Gupta', email: 'ananya.g@techcorp.com', phone: '+91-80-555-0109', designation: 'Marketing Lead', jobTitle: 'Marketing Manager', employmentType: 'full-time', status: 'active', joiningDate: new Date('2023-07-15'), companyId: tcg.id, branchId: branchBLR?.id, departmentId: opsDept.id }),
        empUpsert('kiran.n@techcorp.com', { employeeId: 'TCG010', firstName: 'Kiran', lastName: 'Nair', email: 'kiran.n@techcorp.com', phone: '+1-415-555-0110', designation: 'Backend Developer', jobTitle: 'Senior Backend Dev', employmentType: 'full-time', status: 'on_leave', joiningDate: new Date('2022-04-15'), companyId: tcg.id, branchId: branchSF?.id, departmentId: engDept.id }),
        empUpsert('meera.j@techcorp.com', { employeeId: 'TCG011', firstName: 'Meera', lastName: 'Joshi', email: 'meera.j@techcorp.com', phone: '+91-80-555-0111', designation: 'Senior Accountant', jobTitle: 'Accountant', employmentType: 'full-time', status: 'active', joiningDate: new Date('2022-11-10'), companyId: tcg.id, branchId: branchBLR?.id, departmentId: finDept.id }),
        empUpsert('sneha.r@techcorp.com', { employeeId: 'TCG012', firstName: 'Sneha', lastName: 'Reddy', email: 'sneha.r@techcorp.com', phone: '+91-80-555-0112', designation: 'Recruitment Specialist', jobTitle: 'Recruiter', employmentType: 'full-time', status: 'active', joiningDate: new Date('2024-01-08'), companyId: tcg.id, branchId: branchBLR?.id, departmentId: hrDept.id }),
        // ManufactPro Industries (8 employees)
        empUpsert('priya.s@manufactpro.com', { employeeId: 'MPI001', firstName: 'Priya', lastName: 'Sharma', email: 'priya.s@manufactpro.com', phone: '+91-22-555-0201', designation: 'Production Manager', jobTitle: 'Production Head', employmentType: 'full-time', status: 'active', joiningDate: new Date('2020-11-20'), companyId: mpi.id, branchId: branchMUM?.id, departmentId: prodDept.id }),
        empUpsert('arjun.k@manufactpro.com', { employeeId: 'MPI002', firstName: 'Arjun', lastName: 'Kumar', email: 'arjun.k@manufactpro.com', phone: '+91-22-555-0202', designation: 'Quality Inspector', jobTitle: 'QA Inspector', employmentType: 'full-time', status: 'active', joiningDate: new Date('2023-04-01'), companyId: mpi.id, branchId: branchMUM?.id, departmentId: qualDept.id }),
        empUpsert('rakesh.v@manufactpro.com', { employeeId: 'MPI003', firstName: 'Rakesh', lastName: 'Verma', email: 'rakesh.v@manufactpro.com', phone: '+91-11-555-0203', designation: 'Shift Supervisor', jobTitle: 'Night Shift Lead', employmentType: 'full-time', status: 'active', joiningDate: new Date('2021-06-15'), companyId: mpi.id, branchId: branchDEL?.id, departmentId: prodDept.id }),
        empUpsert('neha.g@manufactpro.com', { employeeId: 'MPI004', firstName: 'Neha', lastName: 'Gupta', email: 'neha.g@manufactpro.com', phone: '+91-22-555-0204', designation: 'Safety Officer', jobTitle: 'HSE Officer', employmentType: 'full-time', status: 'active', joiningDate: new Date('2022-01-10'), companyId: mpi.id, branchId: branchMUM?.id, departmentId: mpiOpsDept.id }),
        empUpsert('suresh.p@manufactpro.com', { employeeId: 'MPI005', firstName: 'Suresh', lastName: 'Patil', email: 'suresh.p@manufactpro.com', phone: '+91-22-555-0205', designation: 'Machine Operator', jobTitle: 'CNC Operator', employmentType: 'contract', status: 'active', joiningDate: new Date('2023-09-01'), companyId: mpi.id, branchId: branchDEL?.id, departmentId: prodDept.id }),
        empUpsert('amit.d@manufactpro.com', { employeeId: 'MPI006', firstName: 'Amit', lastName: 'Das', email: 'amit.d@manufactpro.com', phone: '+91-11-555-0206', designation: 'Quality Analyst', jobTitle: 'Lab Analyst', employmentType: 'full-time', status: 'notice_period', joiningDate: new Date('2021-03-20'), companyId: mpi.id, branchId: branchDEL?.id, departmentId: qualDept.id }),
        empUpsert('pooja.m@manufactpro.com', { employeeId: 'MPI007', firstName: 'Pooja', lastName: 'Mehta', email: 'pooja.m@manufactpro.com', phone: '+91-22-555-0207', designation: 'HR Executive', jobTitle: 'HR Business Partner', employmentType: 'full-time', status: 'active', joiningDate: new Date('2022-07-01'), companyId: mpi.id, branchId: branchMUM?.id, departmentId: mpiOpsDept.id }),
        empUpsert('vijay.r@manufactpro.com', { employeeId: 'MPI008', firstName: 'Vijay', lastName: 'Rao', email: 'vijay.r@manufactpro.com', phone: '+91-22-555-0208', designation: 'Maintenance Engineer', jobTitle: 'Plant Maintenance', employmentType: 'full-time', status: 'active', joiningDate: new Date('2020-05-10'), companyId: mpi.id, branchId: branchMUM?.id, departmentId: mpiOpsDept.id }),
        // HealthFirst Solutions (6 employees)
        empUpsert('david.w@healthfirst.com', { employeeId: 'HFS001', firstName: 'David', lastName: 'Wilson', email: 'david.w@healthfirst.com', phone: '+44-20-555-0301', designation: 'Nurse Practitioner', jobTitle: 'Senior NP', employmentType: 'full-time', status: 'on_leave', joiningDate: new Date('2019-05-15'), companyId: hfs.id, branchId: branchLON?.id, departmentId: clinDept.id }),
        empUpsert('emma.t@healthfirst.com', { employeeId: 'HFS002', firstName: 'Emma', lastName: 'Thompson', email: 'emma.t@healthfirst.com', phone: '+44-20-555-0302', designation: 'Hospital Administrator', jobTitle: 'Admin Director', employmentType: 'full-time', status: 'active', joiningDate: new Date('2020-01-20'), companyId: hfs.id, branchId: branchLON?.id, departmentId: adminDept.id }),
        empUpsert('james.o@healthfirst.com', { employeeId: 'HFS003', firstName: 'James', lastName: 'Okafor', email: 'james.o@healthfirst.com', phone: '+44-20-555-0303', designation: 'Lab Technician', jobTitle: 'Pathology Tech', employmentType: 'full-time', status: 'active', joiningDate: new Date('2022-03-10'), companyId: hfs.id, branchId: branchLON?.id, departmentId: clinDept.id }),
        empUpsert('fatima.k@healthfirst.com', { employeeId: 'HFS004', firstName: 'Fatima', lastName: 'Khan', email: 'fatima.k@healthfirst.com', phone: '+44-20-555-0304', designation: 'Pharmacist', jobTitle: 'Chief Pharmacist', employmentType: 'full-time', status: 'active', joiningDate: new Date('2021-08-15'), companyId: hfs.id, branchId: branchLON?.id, departmentId: clinDept.id }),
        empUpsert('robert.c@healthfirst.com', { employeeId: 'HFS005', firstName: 'Robert', lastName: 'Clarke', email: 'robert.c@healthfirst.com', phone: '+44-20-555-0305', designation: 'Finance Manager', jobTitle: 'CFO', employmentType: 'full-time', status: 'active', joiningDate: new Date('2020-06-01'), companyId: hfs.id, branchId: branchLON?.id, departmentId: adminDept.id }),
        empUpsert('sarah.m@healthfirst.com', { employeeId: 'HFS006', firstName: 'Sarah', lastName: 'Mitchell', email: 'sarah.m@healthfirst.com', phone: '+44-20-555-0306', designation: 'Registered Nurse', jobTitle: 'ICU Nurse', employmentType: 'full-time', status: 'probation', joiningDate: new Date('2024-10-01'), companyId: hfs.id, branchId: branchLON?.id, departmentId: clinDept.id }),
        // RetailMax Group (5 employees)
        empUpsert('carlos.r@retailmax.com', { employeeId: 'RMG001', firstName: 'Carlos', lastName: 'Rodriguez', email: 'carlos.r@retailmax.com', phone: '+49-30-555-0401', designation: 'Store Manager', jobTitle: 'Regional Manager', employmentType: 'full-time', status: 'notice_period', joiningDate: new Date('2021-02-10'), companyId: rmg.id, branchId: branchBER?.id, departmentId: retailDept.id }),
        empUpsert('anna.m@retailmax.com', { employeeId: 'RMG002', firstName: 'Anna', lastName: 'Mueller', email: 'anna.m@retailmax.com', phone: '+49-30-555-0402', designation: 'Visual Merchandiser', jobTitle: 'Merch Lead', employmentType: 'full-time', status: 'active', joiningDate: new Date('2022-05-01'), companyId: rmg.id, branchId: branchBER?.id, departmentId: retailDept.id }),
        empUpsert('lars.s@retailmax.com', { employeeId: 'RMG003', firstName: 'Lars', lastName: 'Schmidt', email: 'lars.s@retailmax.com', phone: '+49-30-555-0403', designation: 'Inventory Analyst', jobTitle: 'Supply Chain Analyst', employmentType: 'full-time', status: 'active', joiningDate: new Date('2023-01-15'), companyId: rmg.id, branchId: branchBER?.id, departmentId: retailDept.id }),
        empUpsert('maria.w@retailmax.com', { employeeId: 'RMG004', firstName: 'Maria', lastName: 'Weber', email: 'maria.w@retailmax.com', phone: '+49-30-555-0404', designation: 'Cashier Lead', jobTitle: 'Front End Lead', employmentType: 'part-time', status: 'active', joiningDate: new Date('2022-11-20'), companyId: rmg.id, branchId: branchBER?.id, departmentId: retailDept.id }),
        empUpsert('hans.b@retailmax.com', { employeeId: 'RMG005', firstName: 'Hans', lastName: 'Braun', email: 'hans.b@retailmax.com', phone: '+49-30-555-0405', designation: 'E-commerce Manager', jobTitle: 'Digital Commerce Lead', employmentType: 'full-time', status: 'active', joiningDate: new Date('2023-06-01'), companyId: rmg.id, branchId: branchBER?.id, departmentId: retailDept.id }),
        // LogiTrans Worldwide (4 employees)
        empUpsert('aiko.t@logitrans.com', { employeeId: 'LTW001', firstName: 'Aiko', lastName: 'Tanaka', email: 'aiko.t@logitrans.com', phone: '+65-555-0501', designation: 'Fleet Coordinator', jobTitle: 'Fleet Manager', employmentType: 'full-time', status: 'active', joiningDate: new Date('2023-06-01'), companyId: ltw.id, branchId: branchSG?.id, departmentId: logDept.id }),
        empUpsert('wei.l@logitrans.com', { employeeId: 'LTW002', firstName: 'Wei', lastName: 'Lim', email: 'wei.l@logitrans.com', phone: '+65-555-0502', designation: 'Supply Chain Analyst', jobTitle: 'SCM Lead', employmentType: 'full-time', status: 'active', joiningDate: new Date('2022-09-15'), companyId: ltw.id, branchId: branchSG?.id, departmentId: logDept.id }),
        empUpsert('ravi.k@logitrans.com', { employeeId: 'LTW003', firstName: 'Ravi', lastName: 'Krishnan', email: 'ravi.k@logitrans.com', phone: '+65-555-0503', designation: 'Warehouse Manager', jobTitle: 'WH Operations', employmentType: 'full-time', status: 'active', joiningDate: new Date('2021-12-01'), companyId: ltw.id, branchId: branchSG?.id, departmentId: logDept.id }),
        empUpsert('siti.r@logitrans.com', { employeeId: 'LTW004', firstName: 'Siti', lastName: 'Rahman', email: 'siti.r@logitrans.com', phone: '+65-555-0504', designation: 'Customs Officer', jobTitle: 'Trade Compliance', employmentType: 'full-time', status: 'probation', joiningDate: new Date('2024-08-15'), companyId: ltw.id, branchId: branchSG?.id, departmentId: logDept.id }),
      ]);

      created.employees = empResults.filter(Boolean).length;
      log.push(`Employees: ${created.employees} ensured`);
    } else {
      created.employees = existingEmpCount;
      log.push(`Employees: already exist (${existingEmpCount}), skipped`);
    }

    // Re-fetch employees for references by email
    const empSarah = await db.employee.findFirst({ where: { email: 'sarah.j@techcorp.com' } });
    const empRaj = await db.employee.findFirst({ where: { email: 'raj.p@techcorp.com' } });
    const empEmily = await db.employee.findFirst({ where: { email: 'emily.c@techcorp.com' } });
    const empMichael = await db.employee.findFirst({ where: { email: 'michael.b@techcorp.com' } });
    const empPriya = await db.employee.findFirst({ where: { email: 'priya.s@manufactpro.com' } });
    const empDavid = await db.employee.findFirst({ where: { email: 'david.w@healthfirst.com' } });
    const empAiko = await db.employee.findFirst({ where: { email: 'aiko.t@logitrans.com' } });
    const empLisa = await db.employee.findFirst({ where: { email: 'lisa.a@techcorp.com' } });
    const empArjun = await db.employee.findFirst({ where: { email: 'arjun.k@manufactpro.com' } });
    const empCarlos = await db.employee.findFirst({ where: { email: 'carlos.r@retailmax.com' } });

    // ==================== JOBS ====================
    log.push('--- Seeding Jobs ---');
    const existingJobCount = await db.job.count();
    if (existingJobCount < 8) {
      const jobs = await Promise.all([
        findOrCreateJob({
          title: 'Senior Full-Stack Developer', description: 'We are looking for a senior full-stack developer to join our engineering team.',
          requirements: 'React, Node.js, TypeScript, 5+ years experience', department: 'Engineering',
          location: 'San Francisco, CA', employmentType: 'Full-time', experienceMin: 5, experienceMax: 8,
          salaryMin: 140000, salaryMax: 180000, status: 'open', priority: 'high', positions: 2,
          postedDate: new Date('2024-12-01'), companyId: tcg.id,
        }),
        findOrCreateJob({
          title: 'HR Business Partner', description: 'Seeking an experienced HR business partner.',
          requirements: '7+ years HR experience, PHR certification preferred', department: 'Human Resources',
          location: 'New York, NY', employmentType: 'Full-time', experienceMin: 7, experienceMax: 10,
          salaryMin: 95000, salaryMax: 120000, status: 'open', priority: 'medium', positions: 1,
          postedDate: new Date('2024-11-28'), companyId: tcg.id,
        }),
        findOrCreateJob({
          title: 'UX Research Lead', description: 'Lead UX research initiatives across products.',
          requirements: '6+ years UX research, mixed methods expertise', department: 'Design',
          location: 'Remote', employmentType: 'Full-time', experienceMin: 6, experienceMax: 9,
          salaryMin: 120000, salaryMax: 150000, status: 'open', priority: 'high', positions: 1,
          postedDate: new Date('2024-11-15'), companyId: tcg.id,
        }),
        findOrCreateJob({
          title: 'Production Supervisor', description: 'Oversee daily production operations.',
          requirements: '8+ years in manufacturing, Six Sigma preferred', department: 'Operations',
          location: 'Mumbai, India', employmentType: 'Full-time', experienceMin: 8, experienceMax: 12,
          salaryMin: 1500000, salaryMax: 2200000, status: 'open', priority: 'urgent', positions: 3,
          postedDate: new Date('2024-12-05'), companyId: mpi.id,
        }),
        findOrCreateJob({
          title: 'Data Scientist', description: 'Build ML models for business insights.',
          requirements: 'Python, TensorFlow, 3+ years experience', department: 'Analytics',
          location: 'Austin, TX', employmentType: 'Full-time', experienceMin: 3, experienceMax: 5,
          salaryMin: 110000, salaryMax: 145000, status: 'draft', priority: 'medium', positions: 1,
          companyId: tcg.id,
        }),
        findOrCreateJob({
          title: 'Registered Nurse', description: 'Join our clinical team.',
          requirements: 'RN license, BLS/ACLS certified, 2+ years', department: 'Clinical',
          location: 'London, UK', employmentType: 'Full-time', experienceMin: 2, experienceMax: 5,
          salaryMin: 35000, salaryMax: 45000, status: 'open', priority: 'high', positions: 5,
          postedDate: new Date('2024-12-03'), companyId: hfs.id,
        }),
        findOrCreateJob({
          title: 'Cloud Infrastructure Engineer', description: 'Design and maintain cloud infrastructure.',
          requirements: 'AWS/Azure, Terraform, Kubernetes, 4+ years', department: 'Engineering',
          location: 'Singapore', employmentType: 'Full-time', experienceMin: 4, experienceMax: 7,
          salaryMin: 8000, salaryMax: 12000, status: 'on_hold', priority: 'low', positions: 1,
          postedDate: new Date('2024-11-20'), companyId: ltw.id,
        }),
        findOrCreateJob({
          title: 'E-commerce Director', description: 'Lead our digital commerce strategy.',
          requirements: '8+ years e-commerce, multi-market experience', department: 'Retail Operations',
          location: 'Berlin, Germany', employmentType: 'Full-time', experienceMin: 8, experienceMax: 12,
          salaryMin: 90000, salaryMax: 120000, status: 'open', priority: 'high', positions: 1,
          postedDate: new Date('2024-12-10'), companyId: rmg.id,
        }),
      ]);
      created.jobs = jobs.length;
      log.push(`Jobs: ${jobs.length} ensured`);
    } else {
      created.jobs = existingJobCount;
      log.push(`Jobs: already exist (${existingJobCount}), skipped`);
    }

    // Re-fetch jobs for references
    const jobFullStack = await db.job.findFirst({ where: { title: 'Senior Full-Stack Developer', companyId: tcg.id } });
    const jobHR = await db.job.findFirst({ where: { title: 'HR Business Partner', companyId: tcg.id } });
    const jobUX = await db.job.findFirst({ where: { title: 'UX Research Lead', companyId: tcg.id } });
    const jobDataSci = await db.job.findFirst({ where: { title: 'Data Scientist', companyId: tcg.id } });
    const jobProdSup = await db.job.findFirst({ where: { title: 'Production Supervisor', companyId: mpi.id } });
    const jobNurse = await db.job.findFirst({ where: { title: 'Registered Nurse', companyId: hfs.id } });
    const jobCloud = await db.job.findFirst({ where: { title: 'Cloud Infrastructure Engineer', companyId: ltw.id } });
    const jobEcom = await db.job.findFirst({ where: { title: 'E-commerce Director', companyId: rmg.id } });

    // ==================== CANDIDATES ====================
    log.push('--- Seeding Candidates ---');
    const existingCandidateCount = await db.candidate.count();
    if (existingCandidateCount < 13 && jobFullStack && jobHR && jobUX && jobDataSci) {
      const extraJobs = { jobProdSup, jobNurse, jobCloud, jobEcom };
      const candidates = await Promise.all([
        findOrCreateCandidate({ firstName: 'Alex', lastName: 'Turner', email: 'alex.t@email.com', currentCompany: 'Google', currentTitle: 'Software Engineer', experience: 6, expectedSalary: 160000, noticePeriod: '30 days', status: 'interviewing', source: 'LinkedIn', aiScore: 92, skillMatch: 88, cultureFitScore: 85, notes: 'Strong full-stack skills', jobId: jobFullStack.id }),
        findOrCreateCandidate({ firstName: 'Maya', lastName: 'Singh', email: 'maya.s@email.com', currentCompany: 'Amazon', currentTitle: 'Senior Developer', experience: 8, expectedSalary: 175000, noticePeriod: '60 days', status: 'shortlisted', source: 'Naukri', aiScore: 89, skillMatch: 91, cultureFitScore: 80, notes: 'Backend specialist', jobId: jobFullStack.id }),
        findOrCreateCandidate({ firstName: 'James', lastName: 'Williams', email: 'james.w@email.com', currentCompany: 'Microsoft', currentTitle: 'HR Manager', experience: 9, expectedSalary: 110000, noticePeriod: '30 days', status: 'offered', source: 'Referral', aiScore: 95, skillMatch: 94, cultureFitScore: 90, notes: 'Excellent HR background', jobId: jobHR.id }),
        findOrCreateCandidate({ firstName: 'Sophie', lastName: 'Martin', email: 'sophie.m@email.com', currentCompany: 'Meta', currentTitle: 'UX Researcher', experience: 7, expectedSalary: 140000, noticePeriod: '45 days', status: 'screening', source: 'Portal', aiScore: 78, skillMatch: 82, cultureFitScore: 88, notes: 'Mixed methods expert', jobId: jobUX.id }),
        findOrCreateCandidate({ firstName: 'Wei', lastName: 'Zhang', email: 'wei.z@email.com', currentCompany: 'ByteDance', currentTitle: 'Data Engineer', experience: 4, expectedSalary: 135000, noticePeriod: '30 days', status: 'applied', source: 'Indeed', aiScore: 72, skillMatch: 68, cultureFitScore: 75, notes: 'ML pipeline experience', jobId: jobDataSci.id }),
        ...(extraJobs.jobProdSup ? [findOrCreateCandidate({ firstName: 'Rajesh', lastName: 'Kumar', email: 'rajesh.k@email.com', currentCompany: 'Tata Steel', currentTitle: 'Shift Manager', experience: 10, expectedSalary: 1800000, noticePeriod: '90 days', status: 'interviewing', source: 'Naukri', aiScore: 85, skillMatch: 90, cultureFitScore: 82, notes: 'Heavy industry background', jobId: extraJobs.jobProdSup.id })] : []),
        ...(extraJobs.jobProdSup ? [findOrCreateCandidate({ firstName: 'Priya', lastName: 'Nair', email: 'priya.n@email.com', currentCompany: 'Reliance', currentTitle: 'Quality Manager', experience: 8, expectedSalary: 1600000, noticePeriod: '60 days', status: 'shortlisted', source: 'Referral', aiScore: 88, skillMatch: 85, cultureFitScore: 90, notes: 'Six Sigma certified', jobId: extraJobs.jobProdSup.id })] : []),
        ...(extraJobs.jobNurse ? [findOrCreateCandidate({ firstName: 'Grace', lastName: 'Okonkwo', email: 'grace.o@email.com', currentCompany: 'NHS', currentTitle: 'Staff Nurse', experience: 5, expectedSalary: 40000, noticePeriod: '30 days', status: 'interviewing', source: 'NHS Jobs', aiScore: 90, skillMatch: 92, cultureFitScore: 88, notes: 'ICU experience', jobId: extraJobs.jobNurse.id })] : []),
        ...(extraJobs.jobEcom ? [findOrCreateCandidate({ firstName: 'Thomas', lastName: 'Mueller', email: 'thomas.m@email.com', currentCompany: 'Zalando', currentTitle: 'E-commerce Lead', experience: 9, expectedSalary: 105000, noticePeriod: '45 days', status: 'applied', source: 'LinkedIn', aiScore: 82, skillMatch: 80, cultureFitScore: 78, notes: 'Fashion retail experience', jobId: extraJobs.jobEcom.id })] : []),
        ...(extraJobs.jobCloud ? [findOrCreateCandidate({ firstName: 'Yuki', lastName: 'Tanaka', email: 'yuki.t@email.com', currentCompany: 'NTT Data', currentTitle: 'Cloud Architect', experience: 6, expectedSalary: 10000, noticePeriod: '30 days', status: 'screening', source: 'Portal', aiScore: 76, skillMatch: 80, cultureFitScore: 72, notes: 'AWS certified', jobId: extraJobs.jobCloud.id })] : []),
        ...(jobUX ? [findOrCreateCandidate({ firstName: 'Olivia', lastName: 'Brown', email: 'olivia.b@email.com', currentCompany: 'Apple', currentTitle: 'Product Designer', experience: 5, expectedSalary: 145000, noticePeriod: '30 days', status: 'applied', source: 'LinkedIn', aiScore: 84, skillMatch: 86, cultureFitScore: 82, notes: 'Design systems expert', jobId: jobUX.id })] : []),
        ...(extraJobs.jobEcom ? [findOrCreateCandidate({ firstName: 'Claire', lastName: 'Dubois', email: 'claire.d@email.com', currentCompany: 'Carrefour', currentTitle: 'Regional Director', experience: 12, expectedSalary: 110000, noticePeriod: '60 days', status: 'interviewing', source: 'Referral', aiScore: 87, skillMatch: 84, cultureFitScore: 86, notes: 'Multi-country retail exp', jobId: extraJobs.jobEcom.id })] : []),
        ...(extraJobs.jobNurse ? [findOrCreateCandidate({ firstName: 'Aisha', lastName: 'Patel', email: 'aisha.p@email.com', currentCompany: 'Bupa', currentTitle: 'Nurse Practitioner', experience: 4, expectedSalary: 42000, noticePeriod: '30 days', status: 'shortlisted', source: 'NHS Jobs', aiScore: 91, skillMatch: 93, cultureFitScore: 87, notes: 'Emergency care specialist', jobId: extraJobs.jobNurse.id })] : []),
      ]);
      created.candidates = candidates.length;
      log.push(`Candidates: ${candidates.length} ensured`);
    } else {
      created.candidates = existingCandidateCount;
      log.push(`Candidates: already exist (${existingCandidateCount}), skipped`);
    }

    // Re-fetch candidates
    const candAlex = await db.candidate.findFirst({ where: { email: 'alex.t@email.com' } });
    const candMaya = await db.candidate.findFirst({ where: { email: 'maya.s@email.com' } });
    const candJames = await db.candidate.findFirst({ where: { email: 'james.w@email.com' } });
    const candWei = await db.candidate.findFirst({ where: { email: 'wei.z@email.com' } });
    const candRajesh = await db.candidate.findFirst({ where: { email: 'rajesh.k@email.com' } });
    const candGrace = await db.candidate.findFirst({ where: { email: 'grace.o@email.com' } });

    // ==================== INTERVIEWS ====================
    log.push('--- Seeding Interviews ---');
    const existingInterviewCount = await db.interview.count();
    if (existingInterviewCount < 7) {
      const ivData: { type: string; scheduledAt: Date; duration: number; status: string; feedback?: string; rating?: number; meetingLink?: string; aiTranscript?: string; candidateId: string; jobId: string }[] = [];
      if (candAlex && jobFullStack) {
        ivData.push({ type: 'technical', scheduledAt: new Date('2025-01-22T10:00:00'), duration: 60, status: 'scheduled', meetingLink: 'https://meet.nexushrms.com/int-1', candidateId: candAlex.id, jobId: jobFullStack.id });
        ivData.push({ type: 'hr', scheduledAt: new Date('2025-01-23T14:00:00'), duration: 45, status: 'scheduled', candidateId: candAlex.id, jobId: jobFullStack.id });
      }
      if (candMaya && jobFullStack) {
        ivData.push({ type: 'coding', scheduledAt: new Date('2025-01-21T09:00:00'), duration: 90, status: 'completed', feedback: 'Excellent coding skills. Solved 3/3 problems. Strong system design.', rating: 5, aiTranscript: 'AI Analysis: Candidate demonstrated exceptional problem-solving ability...', candidateId: candMaya.id, jobId: jobFullStack.id });
      }
      if (candJames && jobHR) {
        ivData.push({ type: 'manager', scheduledAt: new Date('2025-01-20T11:00:00'), duration: 60, status: 'completed', feedback: 'Strong technical skills, good culture fit. Recommended for next round.', rating: 4, aiTranscript: 'AI Interview Transcript: Candidate showed strong problem-solving ability and excellent communication skills. Recommended for final round.', candidateId: candJames.id, jobId: jobHR.id });
      }
      if (candRajesh && jobProdSup) {
        ivData.push({ type: 'behavioral', scheduledAt: new Date('2025-01-25T15:00:00'), duration: 45, status: 'scheduled', meetingLink: 'https://meet.nexushrms.com/int-5', candidateId: candRajesh.id, jobId: jobProdSup.id });
      }
      if (candWei && jobDataSci) {
        ivData.push({ type: 'technical', scheduledAt: new Date('2025-01-24T10:30:00'), duration: 60, status: 'cancelled', feedback: 'Candidate withdrew application.', candidateId: candWei.id, jobId: jobDataSci.id });
      }
      if (candGrace && jobNurse) {
        ivData.push({ type: 'mcq', scheduledAt: new Date('2025-01-26T11:00:00'), duration: 45, status: 'scheduled', candidateId: candGrace.id, jobId: jobNurse.id });
      }
      for (const iv of ivData) { try { await db.interview.create({ data: iv }); } catch (_) { /* skip */ } }
      created.interviews = ivData.length;
      log.push(`Interviews: ${ivData.length} ensured`);
    } else {
      created.interviews = existingInterviewCount;
      log.push(`Interviews: already exist (${existingInterviewCount}), skipped`);
    }

    // ==================== ATTENDANCE ====================
    log.push('--- Seeding Attendance ---');
    const existingAttendanceCount = await db.attendance.count();
    if (existingAttendanceCount < 6 && empSarah && empRaj && empEmily && empDavid && empPriya && empAiko) {
      const today = new Date('2025-01-20');
      await Promise.all([
        db.attendance.upsert({
          where: { employeeId_date: { employeeId: empSarah.id, date: today } },
          update: {},
          create: { date: today, checkIn: new Date('2025-01-20T09:02:00'), checkOut: new Date('2025-01-20T18:15:00'), workHours: 8.5, status: 'present', source: 'biometric', employeeId: empSarah.id },
        }),
        db.attendance.upsert({
          where: { employeeId_date: { employeeId: empRaj.id, date: today } },
          update: {},
          create: { date: today, checkIn: new Date('2025-01-20T09:35:00'), checkOut: new Date('2025-01-20T18:30:00'), workHours: 8.0, status: 'late', source: 'mobile', employeeId: empRaj.id },
        }),
        db.attendance.upsert({
          where: { employeeId_date: { employeeId: empEmily.id, date: today } },
          update: {},
          create: { date: today, checkIn: new Date('2025-01-20T08:50:00'), checkOut: new Date('2025-01-20T17:45:00'), workHours: 8.0, status: 'present', source: 'gps', employeeId: empEmily.id },
        }),
        db.attendance.upsert({
          where: { employeeId_date: { employeeId: empDavid.id, date: today } },
          update: {},
          create: { date: today, status: 'absent', source: 'web', employeeId: empDavid.id },
        }),
        db.attendance.upsert({
          where: { employeeId_date: { employeeId: empPriya.id, date: today } },
          update: {},
          create: { date: today, checkIn: new Date('2025-01-20T09:00:00'), checkOut: new Date('2025-01-20T14:00:00'), workHours: 4.0, status: 'half_day', source: 'web', employeeId: empPriya.id },
        }),
        db.attendance.upsert({
          where: { employeeId_date: { employeeId: empAiko.id, date: today } },
          update: {},
          create: { date: today, checkIn: new Date('2025-01-20T08:45:00'), checkOut: new Date('2025-01-20T18:00:00'), workHours: 8.5, status: 'present', source: 'rfid', employeeId: empAiko.id },
        }),
      ]);
      created.attendance = 6;
      log.push('Attendance: 6 ensured');
    } else {
      created.attendance = existingAttendanceCount;
      log.push(`Attendance: already exist (${existingAttendanceCount}), skipped`);
    }

    // ==================== LEAVE POLICIES (for each company) ====================
    log.push('--- Seeding Leave Policies ---');
    let totalLeavePoliciesEnsured = 0;
    for (const company of companies) {
      const policyTemplates = getLeavePolicyTemplates(company.id);
      for (const policy of policyTemplates) {
        const existing = await db.leavePolicy.findFirst({ where: { type: policy.type, companyId: policy.companyId } });
        if (!existing) {
          await db.leavePolicy.create({ data: policy });
          totalLeavePoliciesEnsured++;
        }
      }
    }
    created.leavePolicies = await db.leavePolicy.count();
    log.push(`Leave Policies: ${totalLeavePoliciesEnsured} new, total ${created.leavePolicies} (Casual, Sick, Earned, Maternity, Paternity per company)`);

    // ==================== LEAVES ====================
    log.push('--- Seeding Leaves ---');
    const existingLeaveCount = await db.leave.count();
    if (existingLeaveCount < 5 && empSarah && empRaj && empEmily && empLisa && empArjun) {
      const leaveSarah = await db.leave.create({
        data: { type: 'casual', startDate: new Date('2025-01-22'), endDate: new Date('2025-01-23'), totalDays: 2, reason: 'Personal work', status: 'approved', approverId: empRaj.id, employeeId: empSarah.id },
      });
      const leaveRaj = await db.leave.create({
        data: { type: 'sick', startDate: new Date('2025-01-20'), endDate: new Date('2025-01-21'), totalDays: 2, reason: 'Not feeling well', status: 'pending', employeeId: empRaj.id },
      });
      await db.leave.create({
        data: { type: 'paid', startDate: new Date('2025-02-10'), endDate: new Date('2025-02-14'), totalDays: 5, reason: 'Family vacation', status: 'pending', employeeId: empEmily.id },
      });
      await db.leave.create({
        data: { type: 'maternity', startDate: new Date('2025-01-15'), endDate: new Date('2025-07-15'), totalDays: 182, reason: 'Maternity', status: 'approved', approverId: empRaj.id, employeeId: empLisa.id },
      });
      await db.leave.create({
        data: { type: 'comp_off', startDate: new Date('2025-01-25'), endDate: new Date('2025-01-25'), totalDays: 1, reason: 'Weekend work compensation', status: 'approved', approverId: empMichael?.id, employeeId: empArjun.id },
      });
      created.leaves = 5;
      log.push('Leaves: 5 created');

      // ==================== AUDIT LOGS (need leave IDs) ====================
      log.push('--- Seeding Audit Logs ---');
      const existingAuditCount = await db.auditLog.count();
      if (existingAuditCount < 4) {
        await Promise.all([
          db.auditLog.create({ data: { action: 'LOGIN', entity: 'User', entityId: users[1].id, details: 'Sarah Johnson logged in', userId: users[1].id, ipAddress: '192.168.1.100' } }),
          db.auditLog.create({ data: { action: 'CREATE', entity: 'Leave', entityId: leaveSarah.id, details: 'Leave request created by Sarah Johnson', userId: users[1].id } }),
          db.auditLog.create({ data: { action: 'UPDATE', entity: 'Leave', entityId: leaveRaj.id, details: 'Leave approved by Raj Patel', userId: users[2].id } }),
          db.auditLog.create({ data: { action: 'CREATE', entity: 'Employee', entityId: empMichael?.id || '', details: 'New employee Michael Brown added', userId: users[1].id } }),
        ]);
        created.auditLogs = 4;
        log.push('Audit Logs: 4 created');
      } else {
        created.auditLogs = existingAuditCount;
        log.push(`Audit Logs: already exist (${existingAuditCount}), skipped`);
      }
    } else {
      created.leaves = existingLeaveCount;
      log.push(`Leaves: already exist (${existingLeaveCount}), skipped`);
      // Still check audit logs
      const existingAuditCount = await db.auditLog.count();
      created.auditLogs = existingAuditCount;
    }

    // ==================== PAYROLL STRUCTURES (for each company) ====================
    log.push('--- Seeding Payroll ---');
    let totalPayrollStructuresEnsured = 0;
    for (const company of companies) {
      const structTemplates = getPayrollStructureTemplates(company.id);
      for (const struct of structTemplates) {
        const existing = await db.payrollStructure.findFirst({ where: { name: struct.name, companyId: struct.companyId } });
        if (!existing) {
          await db.payrollStructure.create({ data: struct });
          totalPayrollStructuresEnsured++;
        }
      }
    }
    created.payrollStructures = await db.payrollStructure.count();
    log.push(`Payroll Structures: ${totalPayrollStructuresEnsured} new, total ${created.payrollStructures} (Standard Salaried per company)`);

    if (empSarah && empRaj && empEmily && empMichael) {
      const existingPayrollRecCount = await db.payrollRecord.count();
      if (existingPayrollRecCount < 4) {
        await Promise.all([
          db.payrollRecord.upsert({
            where: { employeeId_month_year: { employeeId: empSarah.id, month: 1, year: 2025 } },
            update: {},
            create: { month: 1, year: 2025, basicPay: 8000, grossSalary: 12000, totalDeductions: 3200, netSalary: 8800, status: 'paid', paymentDate: new Date('2025-01-31'), employeeId: empSarah.id },
          }),
          db.payrollRecord.upsert({
            where: { employeeId_month_year: { employeeId: empRaj.id, month: 1, year: 2025 } },
            update: {},
            create: { month: 1, year: 2025, basicPay: 7500, grossSalary: 11000, totalDeductions: 2900, netSalary: 8100, status: 'paid', paymentDate: new Date('2025-01-31'), employeeId: empRaj.id },
          }),
          db.payrollRecord.upsert({
            where: { employeeId_month_year: { employeeId: empEmily.id, month: 1, year: 2025 } },
            update: {},
            create: { month: 1, year: 2025, basicPay: 6500, grossSalary: 9500, totalDeductions: 2500, netSalary: 7000, status: 'processed', employeeId: empEmily.id },
          }),
          db.payrollRecord.upsert({
            where: { employeeId_month_year: { employeeId: empMichael.id, month: 1, year: 2025 } },
            update: {},
            create: { month: 1, year: 2025, basicPay: 9000, grossSalary: 13500, totalDeductions: 3600, netSalary: 9900, status: 'draft', employeeId: empMichael.id },
          }),
        ]);
        created.payrollRecords = 4;
        log.push('Payroll Records: 4 ensured');
      } else {
        created.payrollRecords = existingPayrollRecCount;
        log.push(`Payroll Records: already exist (${existingPayrollRecCount}), skipped`);
      }
    }

    // ==================== GOALS ====================
    log.push('--- Seeding Goals ---');
    const existingGoalCount = await db.goal.count();
    if (existingGoalCount < 4 && empSarah && empRaj && empEmily && empMichael) {
      await Promise.all([
        db.goal.create({ data: { title: 'Complete React 19 Migration', description: 'Migrate all frontend apps to React 19', type: 'individual', category: 'okr', progress: 65, status: 'in_progress', startDate: new Date('2025-01-01'), endDate: new Date('2025-03-31'), employeeId: empSarah.id } }),
        db.goal.create({ data: { title: 'Reduce Hiring Time-to-Fill', description: 'Reduce average time-to-fill from 45 to 30 days', type: 'department', category: 'kpi', progress: 40, status: 'in_progress', startDate: new Date('2025-01-01'), endDate: new Date('2025-06-30'), employeeId: empRaj.id } }),
        db.goal.create({ data: { title: 'Improve Design System Coverage', description: 'Achieve 90% component coverage in design system', type: 'individual', category: 'smart', progress: 80, status: 'in_progress', startDate: new Date('2025-01-01'), endDate: new Date('2025-02-28'), employeeId: empEmily.id } }),
        db.goal.create({ data: { title: 'Achieve 99.9% Uptime', description: 'Maintain 99.9% uptime for all production services', type: 'team', category: 'kpi', progress: 95, status: 'in_progress', startDate: new Date('2025-01-01'), endDate: new Date('2025-12-31'), employeeId: empMichael.id } }),
      ]);
      created.goals = 4;
      log.push('Goals: 4 created');
    } else {
      created.goals = existingGoalCount;
      log.push(`Goals: already exist (${existingGoalCount}), skipped`);
    }

    // ==================== ASSETS ====================
    log.push('--- Seeding Assets ---');
    const existingAssetCount = await db.assetAllocation.count();
    if (existingAssetCount < 4 && empSarah && empRaj && empEmily && empMichael) {
      await Promise.all([
        db.assetAllocation.create({ data: { assetType: 'laptop', assetName: 'MacBook Pro 16"', assetCode: 'LTP-0042', serialNumber: 'MBP16-2024-0042', status: 'allocated', employeeId: empSarah.id } }),
        db.assetAllocation.create({ data: { assetType: 'phone', assetName: 'iPhone 15 Pro', assetCode: 'PHN-0088', status: 'allocated', employeeId: empRaj.id } }),
        db.assetAllocation.create({ data: { assetType: 'access_card', assetName: 'Access Card - Floor 5', assetCode: 'AC-1025', status: 'allocated', employeeId: empEmily.id } }),
        db.assetAllocation.create({ data: { assetType: 'laptop', assetName: 'Dell XPS 15', assetCode: 'LTP-0045', status: 'allocated', notes: 'On loan from IT pool', employeeId: empMichael.id } }),
      ]);
      created.assets = 4;
      log.push('Assets: 4 created');
    } else {
      created.assets = existingAssetCount;
      log.push(`Assets: already exist (${existingAssetCount}), skipped`);
    }

    // ==================== TRAVEL & EXPENSE ====================
    log.push('--- Seeding Travel & Expense ---');
    const existingTravelCount = await db.travelRequest.count();
    if (existingTravelCount < 2 && empSarah && empEmily) {
      await Promise.all([
        db.travelRequest.create({ data: { purpose: 'Client Meeting - Acme Corp', destination: 'New York, NY', departureDate: new Date('2025-02-15'), returnDate: new Date('2025-02-17'), estimatedCost: 2500, status: 'pending', employeeId: empSarah.id } }),
        db.travelRequest.create({ data: { purpose: 'Tech Conference 2025', destination: 'Las Vegas, NV', departureDate: new Date('2025-03-10'), returnDate: new Date('2025-03-13'), estimatedCost: 4000, approvedCost: 3800, status: 'approved', employeeId: empEmily.id } }),
      ]);
      created.travelRequests = 2;
      log.push('Travel Requests: 2 created');
    } else {
      created.travelRequests = existingTravelCount;
      log.push(`Travel Requests: already exist (${existingTravelCount}), skipped`);
    }

    const existingExpenseCount = await db.expenseClaim.count();
    if (existingExpenseCount < 3 && empSarah && empRaj && empEmily) {
      await Promise.all([
        db.expenseClaim.create({ data: { type: 'travel', amount: 450, description: 'Taxi to airport', status: 'pending', employeeId: empSarah.id } }),
        db.expenseClaim.create({ data: { type: 'food', amount: 120, description: 'Team lunch meeting', status: 'approved', employeeId: empRaj.id } }),
        db.expenseClaim.create({ data: { type: 'communication', amount: 85, description: 'International calls for project', status: 'reimbursed', employeeId: empEmily.id } }),
      ]);
      created.expenseClaims = 3;
      log.push('Expense Claims: 3 created');
    } else {
      created.expenseClaims = existingExpenseCount;
      log.push(`Expense Claims: already exist (${existingExpenseCount}), skipped`);
    }

    // ==================== LEARNING ====================
    log.push('--- Seeding Learning ---');
    const existingLearningCount = await db.learningRecord.count();
    if (existingLearningCount < 3 && empSarah && empRaj && empEmily) {
      await Promise.all([
        db.learningRecord.create({ data: { courseName: 'Advanced React Patterns', provider: 'Frontend Masters', type: 'e_learning', status: 'in_progress', employeeId: empSarah.id } }),
        db.learningRecord.create({ data: { courseName: 'HR Analytics Fundamentals', provider: 'Coursera', type: 'certification', status: 'completed', completedAt: new Date('2024-12-15'), score: 92, certificate: 'cert-hr-analytics-2024', employeeId: empRaj.id } }),
        db.learningRecord.create({ data: { courseName: 'Design Systems Workshop', provider: 'Internal', type: 'workshop', status: 'enrolled', employeeId: empEmily.id } }),
      ]);
      created.learning = 3;
      log.push('Learning Records: 3 created');
    } else {
      created.learning = existingLearningCount;
      log.push(`Learning Records: already exist (${existingLearningCount}), skipped`);
    }

    // ==================== TICKETS ====================
    log.push('--- Seeding Tickets ---');
    const existingTicketCount = await db.ticket.count();
    if (existingTicketCount < 3 && empSarah && empRaj && empMichael) {
      await Promise.all([
        db.ticket.create({ data: { subject: 'VPN Connection Issue', description: 'Cannot connect to VPN since morning', category: 'it', priority: 'high', status: 'in_progress', employeeId: empSarah.id } }),
        db.ticket.create({ data: { subject: 'Payroll Discrepancy', description: 'December salary has incorrect deduction', category: 'payroll', priority: 'urgent', status: 'open', employeeId: empRaj.id } }),
        db.ticket.create({ data: { subject: 'Access Request - Production DB', description: 'Need read access to production database for debugging', category: 'it', priority: 'medium', status: 'resolved', resolution: 'Access granted by IT admin', employeeId: empMichael.id } }),
      ]);
      created.tickets = 3;
      log.push('Tickets: 3 created');
    } else {
      created.tickets = existingTicketCount;
      log.push(`Tickets: already exist (${existingTicketCount}), skipped`);
    }

    // ==================== CLIENTS & VENDORS ====================
    log.push('--- Seeding Clients & Vendors ---');
    const existingClientCount = await db.client.count();
    if (existingClientCount < 3) {
      await Promise.all([
        db.client.create({ data: { name: 'Acme Corp', email: 'hr@acme.com', clientCompany: 'Acme Corporation', industry: 'Technology', contractStart: new Date('2024-01-01'), contractEnd: new Date('2025-12-31'), status: 'active', companyId: tcg.id } }),
        db.client.create({ data: { name: 'GlobalTech Inc', email: 'talent@globaltech.com', clientCompany: 'GlobalTech Inc', industry: 'Software', contractStart: new Date('2024-06-01'), contractEnd: new Date('2025-05-31'), status: 'active', companyId: tcg.id } }),
        db.client.create({ data: { name: 'BuildRight Construction', email: 'hr@buildright.com', clientCompany: 'BuildRight', industry: 'Construction', contractStart: new Date('2023-09-01'), contractEnd: new Date('2024-08-31'), status: 'active', companyId: tcg.id } }),
      ]);
      created.clients = 3;
      log.push('Clients: 3 created');
    } else {
      created.clients = existingClientCount;
      log.push(`Clients: already exist (${existingClientCount}), skipped`);
    }

    const existingVendorCount = await db.vendor.count();
    if (existingVendorCount < 3) {
      const vendors = await Promise.all([
        db.vendor.create({ data: { name: 'TalentHunt Agency', email: 'info@talenthunt.com', vendorCompany: 'TalentHunt', serviceType: 'recruitment', status: 'active', rating: 4.5, companyId: tcg.id } }),
        db.vendor.create({ data: { name: 'StaffPro Solutions', email: 'contact@staffpro.com', vendorCompany: 'StaffPro', serviceType: 'staffing', status: 'active', rating: 4.2, companyId: tcg.id } }),
        db.vendor.create({ data: { name: 'VerifyRight BGV', email: 'team@verifyright.com', vendorCompany: 'VerifyRight', serviceType: 'bgv', status: 'active', rating: 4.8, companyId: tcg.id } }),
      ]);
      created.vendors = vendors.length;

      // Sub-vendors
      const existingSubVendorCount = await db.subVendor.count();
      if (existingSubVendorCount < 2) {
        await Promise.all([
          db.subVendor.create({ data: { name: 'QuickHire Regional', email: 'hire@quickhire.com', company: 'QuickHire', status: 'active', vendorId: vendors[0].id } }),
          db.subVendor.create({ data: { name: 'TalentBridge East', email: 'east@talentbridge.com', company: 'TalentBridge', status: 'active', vendorId: vendors[1].id } }),
        ]);
        created.subVendors = 2;
        log.push('Vendors: 3 created, Sub-vendors: 2 created');
      } else {
        created.subVendors = existingSubVendorCount;
        log.push(`Vendors: 3 created, Sub-vendors: already exist`);
      }
    } else {
      created.vendors = existingVendorCount;
      created.subVendors = await db.subVendor.count();
      log.push(`Vendors: already exist (${existingVendorCount}), Sub-vendors: already exist`);
    }

    // ==================== WORKFLOW DEFINITIONS (7 comprehensive workflows per company) ====================
    log.push('--- Seeding Workflow Definitions ---');
    let totalWorkflowsEnsured = 0;
    for (const company of companies) {
      const workflowTemplates = getWorkflowTemplates(company.id);
      for (const wf of workflowTemplates) {
        await findOrCreateWorkflow(wf);
        totalWorkflowsEnsured++;
      }
    }
    created.workflows = await db.workflowDefinition.count();
    log.push(`Workflow Definitions: ${totalWorkflowsEnsured} templates across ${companies.length} companies, total ${created.workflows} (Leave, Travel, Expense, Recruitment, Performance, Onboarding, Offboarding)`);

    // ==================== SURVEYS ====================
    log.push('--- Seeding Surveys ---');
    const existingSurveyCount = await db.survey.count();
    if (existingSurveyCount < 1) {
      const survey = await findOrCreateSurvey({
        title: 'Q1 2025 Employee Engagement Pulse',
        description: 'Quarterly pulse survey to measure employee engagement and satisfaction.',
        type: 'pulse', status: 'active',
        startDate: new Date('2025-01-15'), endDate: new Date('2025-01-31'),
        companyId: tcg.id,
      });

      const surveyQuestions = await Promise.all([
        db.surveyQuestion.create({ data: { question: 'How satisfied are you with your current role?', type: 'rating', order: 0, surveyId: survey.id } }),
        db.surveyQuestion.create({ data: { question: 'Do you feel your work is recognized?', type: 'rating', order: 1, surveyId: survey.id } }),
        db.surveyQuestion.create({ data: { question: 'How would you rate team collaboration?', type: 'rating', order: 2, surveyId: survey.id } }),
        db.surveyQuestion.create({ data: { question: 'What could we improve?', type: 'text', required: false, order: 3, surveyId: survey.id } }),
        db.surveyQuestion.create({ data: { question: 'Would you recommend this company as a workplace?', type: 'rating', order: 4, surveyId: survey.id } }),
      ]);

      // Survey responses
      if (empSarah && empRaj) {
        await Promise.all([
          db.surveyResponse.create({ data: { answer: '4', questionId: surveyQuestions[0].id, employeeId: empSarah.id } }),
          db.surveyResponse.create({ data: { answer: '3', questionId: surveyQuestions[1].id, employeeId: empSarah.id } }),
          db.surveyResponse.create({ data: { answer: '5', questionId: surveyQuestions[2].id, employeeId: empSarah.id } }),
          db.surveyResponse.create({ data: { answer: '4', questionId: surveyQuestions[0].id, employeeId: empRaj.id } }),
          db.surveyResponse.create({ data: { answer: '4', questionId: surveyQuestions[1].id, employeeId: empRaj.id } }),
        ]);
      }
      created.surveys = 1;
      created.surveyQuestions = 5;
      created.surveyResponses = 5;
      log.push('Surveys: 1 with 5 questions and 5 responses created');
    } else {
      created.surveys = existingSurveyCount;
      created.surveyQuestions = await db.surveyQuestion.count();
      created.surveyResponses = await db.surveyResponse.count();
      log.push(`Surveys: already exist (${existingSurveyCount}), skipped`);
    }

    // ==================== ONBOARDING TASKS ====================
    log.push('--- Seeding Onboarding Tasks ---');
    const existingOnboardingCount = await db.onboardingTask.count();
    if (existingOnboardingCount < 5 && empMichael) {
      await Promise.all([
        db.onboardingTask.create({ data: { title: 'Complete IT Setup', description: 'Laptop, email, VPN access setup', category: 'it', status: 'completed', completedAt: new Date('2024-09-02'), employeeId: empMichael.id } }),
        db.onboardingTask.create({ data: { title: 'HR Orientation', description: 'Company policies, benefits overview', category: 'hr', status: 'completed', completedAt: new Date('2024-09-03'), employeeId: empMichael.id } }),
        db.onboardingTask.create({ data: { title: 'Team Introduction', description: 'Meet the engineering team', category: 'team', status: 'completed', completedAt: new Date('2024-09-04'), employeeId: empMichael.id } }),
        db.onboardingTask.create({ data: { title: 'Codebase Walkthrough', description: 'Overview of the main repositories', category: 'training', status: 'in_progress', employeeId: empMichael.id } }),
        db.onboardingTask.create({ data: { title: 'First Project Assignment', description: 'Assign first development task', category: 'training', status: 'pending', employeeId: empMichael.id } }),
      ]);
      created.onboardingTasks = 5;
      log.push('Onboarding Tasks: 5 created');
    } else {
      created.onboardingTasks = existingOnboardingCount;
      log.push(`Onboarding Tasks: already exist (${existingOnboardingCount}), skipped`);
    }

    // ==================== SHIFTS (for each company) ====================
    log.push('--- Seeding Shifts ---');
    let totalShiftsEnsured = 0;
    for (const company of companies) {
      const shiftTemplates = getShiftTemplates(company.id);
      for (const shiftData of shiftTemplates) {
        await findOrCreateShift(shiftData);
        totalShiftsEnsured++;
      }
    }
    created.shifts = await db.shift.count();
    log.push(`Shifts: ${totalShiftsEnsured} templates across ${companies.length} companies, total ${created.shifts} (Morning, Evening, Night, General per company)`);

    // Shift members (TCG employees on General Shift)
    if (empSarah && empRaj && empEmily) {
      const tcgGeneralShift = await db.shift.findFirst({ where: { name: 'General Shift', companyId: tcg.id } });
      if (tcgGeneralShift) {
        const effectiveDate = new Date('2025-01-01');
        for (const emp of [empSarah, empRaj, empEmily]) {
          try {
            await db.shiftMember.upsert({
              where: { employeeId_effectiveDate_shiftId: { employeeId: emp.id, effectiveDate, shiftId: tcgGeneralShift.id } },
              update: {},
              create: { effectiveDate, shiftId: tcgGeneralShift.id, employeeId: emp.id },
            });
          } catch {
            // Skip if already exists
          }
        }
      }
    }
    created.shiftMembers = await db.shiftMember.count();

    // ==================== COMPLIANCE ITEMS ====================
    log.push('--- Seeding Compliance Items ---');
    const existingComplianceCount = await db.complianceItem.count();
    if (existingComplianceCount < 3) {
      await Promise.all([
        db.complianceItem.create({ data: { title: 'Annual Fire Safety Training', description: 'Mandatory fire safety training for all employees', category: 'safety', dueDate: new Date('2025-03-31'), status: 'pending', companyId: tcg.id } }),
        db.complianceItem.create({ data: { title: 'POPI Act Compliance Review', description: 'Review data protection compliance', category: 'regulatory', dueDate: new Date('2025-06-30'), status: 'pending', companyId: tcg.id } }),
        db.complianceItem.create({ data: { title: 'Quarterly Tax Filing', description: 'Q4 2024 tax filing', category: 'tax', dueDate: new Date('2025-01-31'), status: 'completed', companyId: tcg.id } }),
      ]);
      created.complianceItems = 3;
      log.push('Compliance Items: 3 created');
    } else {
      created.complianceItems = existingComplianceCount;
      log.push(`Compliance Items: already exist (${existingComplianceCount}), skipped`);
    }

    // ==================== NOTIFICATIONS ====================
    log.push('--- Seeding Notifications ---');
    const existingNotifCount = await db.notification.count();
    if (existingNotifCount < 8) {
      await Promise.all([
        db.notification.create({ data: { title: 'Leave Request', message: 'Raj Patel has submitted a sick leave request', type: 'info', category: 'leave', userId: users[1].id } }),
        db.notification.create({ data: { title: 'New Candidate', message: 'Alex Turner applied for Senior Full-Stack Developer', type: 'success', category: 'recruitment', userId: users[1].id } }),
        db.notification.create({ data: { title: 'Payroll Processed', message: 'January 2025 payroll has been processed', type: 'success', category: 'payroll', userId: users[1].id } }),
        db.notification.create({ data: { title: 'Attendance Alert', message: 'David Wilson is absent today without prior notice', type: 'warning', category: 'attendance', userId: users[1].id } }),
        db.notification.create({ data: { title: 'Expense Approval', message: 'You have 2 pending expense approvals', type: 'info', category: 'expense', userId: users[1].id } }),
        db.notification.create({ data: { title: 'Probation Ending', message: 'Michael Brown probation ends on March 1, 2025', type: 'warning', category: 'employee', userId: users[1].id } }),
        db.notification.create({ data: { title: 'New Ticket', message: 'VPN Connection Issue reported by Sarah Johnson', type: 'info', category: 'helpdesk', userId: users[1].id } }),
        db.notification.create({ data: { title: 'Interview Scheduled', message: 'Technical interview with Alex Turner on Jan 22', type: 'info', category: 'recruitment', userId: users[13].id } }),
      ]);
      created.notifications = 8;
      log.push('Notifications: 8 created');
    } else {
      created.notifications = existingNotifCount;
      log.push(`Notifications: already exist (${existingNotifCount}), skipped`);
    }

    // Ensure audit logs count is set
    if (!created.auditLogs) {
      created.auditLogs = await db.auditLog.count();
    }

    log.push('\n=== Database seeding completed successfully! ===');

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      created,
      log,
    });
  } catch (error) {
    console.error('Seed error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? errorStack : undefined,
        created,
        log,
      },
      { status: 500 }
    );
  }
}
