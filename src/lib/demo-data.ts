// ==================== NEXUS HRMS COMPREHENSIVE DEMO DATA ====================
// Product: NEXUS HRMS — AI-Powered Enterprise HR Platform
// This module provides realistic sample data for ALL modules across ALL companies.
// Used as fallback when the database is unavailable.

// ==================== COMPANIES ====================
export const DEMO_COMPANIES = [
  { id: 'comp-tcg', name: 'TechCorp Global', code: 'TCG', industry: 'IT Services', country: 'US', currency: 'USD', timezone: 'America/New_York', isActive: true, _count: { employees: 12 } },
  { id: 'comp-mpi', name: 'ManufactPro Industries', code: 'MPI', industry: 'Manufacturing', country: 'IN', currency: 'INR', timezone: 'Asia/Kolkata', isActive: true, _count: { employees: 8 } },
  { id: 'comp-hfs', name: 'HealthFirst Solutions', code: 'HFS', industry: 'Healthcare', country: 'GB', currency: 'GBP', timezone: 'Europe/London', isActive: true, _count: { employees: 6 } },
  { id: 'comp-rmg', name: 'RetailMax Group', code: 'RMG', industry: 'Retail', country: 'DE', currency: 'EUR', timezone: 'Europe/Berlin', isActive: true, _count: { employees: 5 } },
  { id: 'comp-ltw', name: 'LogiTrans Worldwide', code: 'LTW', industry: 'Logistics', country: 'SG', currency: 'SGD', timezone: 'Asia/Singapore', isActive: true, _count: { employees: 4 } },
];

// ==================== BRANCHES ====================
export const DEMO_BRANCHES = [
  { id: 'br-tcg-sf', name: 'HQ San Francisco', code: 'TCG-SF', city: 'San Francisco', state: 'CA', country: 'US', isActive: true, companyId: 'comp-tcg' },
  { id: 'br-tcg-ny', name: 'NYC Office', code: 'TCG-NY', city: 'New York', state: 'NY', country: 'US', isActive: true, companyId: 'comp-tcg' },
  { id: 'br-tcg-blr', name: 'Bangalore Tech Center', code: 'TCG-BLR', city: 'Bangalore', state: 'KA', country: 'IN', isActive: true, companyId: 'comp-tcg' },
  { id: 'br-mpi-mum', name: 'Mumbai HQ', code: 'MPI-MUM', city: 'Mumbai', state: 'MH', country: 'IN', isActive: true, companyId: 'comp-mpi' },
  { id: 'br-mpi-del', name: 'Delhi Factory', code: 'MPI-DEL', city: 'New Delhi', state: 'DL', country: 'IN', isActive: true, companyId: 'comp-mpi' },
  { id: 'br-hfs-lon', name: 'London Office', code: 'HFS-LON', city: 'London', state: 'England', country: 'GB', isActive: true, companyId: 'comp-hfs' },
  { id: 'br-rmg-ber', name: 'Berlin HQ', code: 'RMG-BER', city: 'Berlin', state: 'Berlin', country: 'DE', isActive: true, companyId: 'comp-rmg' },
  { id: 'br-ltw-sg', name: 'Singapore HQ', code: 'LTW-SG', city: 'Singapore', state: 'Central', country: 'SG', isActive: true, companyId: 'comp-ltw' },
];

// ==================== DEPARTMENTS ====================
export const DEMO_DEPARTMENTS = [
  { id: 'dept-tcg-eng', name: 'Engineering', code: 'ENG', description: 'Software engineering and development', isActive: true, companyId: 'comp-tcg' },
  { id: 'dept-tcg-hr', name: 'Human Resources', code: 'HR', description: 'People operations and HR management', isActive: true, companyId: 'comp-tcg' },
  { id: 'dept-tcg-design', name: 'Design', code: 'DSG', description: 'Product design and UX research', isActive: true, companyId: 'comp-tcg' },
  { id: 'dept-tcg-fin', name: 'Finance', code: 'FIN', description: 'Financial planning and accounting', isActive: true, companyId: 'comp-tcg' },
  { id: 'dept-tcg-ops', name: 'Operations', code: 'OPS', description: 'Business operations and strategy', isActive: true, companyId: 'comp-tcg' },
  { id: 'dept-tcg-sales', name: 'Sales', code: 'SAL', description: 'Sales and business development', isActive: true, companyId: 'comp-tcg' },
  { id: 'dept-tcg-ana', name: 'Analytics', code: 'ANA', description: 'Data analytics and BI', isActive: true, companyId: 'comp-tcg' },
  { id: 'dept-mpi-prod', name: 'Production', code: 'PRD', description: 'Manufacturing production', isActive: true, companyId: 'comp-mpi' },
  { id: 'dept-mpi-qual', name: 'Quality', code: 'QAT', description: 'Quality assurance and control', isActive: true, companyId: 'comp-mpi' },
  { id: 'dept-mpi-ops', name: 'Operations', code: 'OPS', description: 'Plant operations', isActive: true, companyId: 'comp-mpi' },
  { id: 'dept-hfs-clin', name: 'Clinical', code: 'CLI', description: 'Clinical services', isActive: true, companyId: 'comp-hfs' },
  { id: 'dept-hfs-admin', name: 'Administration', code: 'ADM', description: 'Hospital administration', isActive: true, companyId: 'comp-hfs' },
  { id: 'dept-rmg-retail', name: 'Retail Operations', code: 'RTL', description: 'Store operations', isActive: true, companyId: 'comp-rmg' },
  { id: 'dept-ltw-log', name: 'Logistics', code: 'LOG', description: 'Fleet and logistics', isActive: true, companyId: 'comp-ltw' },
];

// ==================== EMPLOYEES ====================
export const DEMO_EMPLOYEES = [
  // TechCorp Global
  { id: 'emp-tcg-1', employeeId: 'TCG001', firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.j@techcorp.com', phone: '+1-415-555-0101', designation: 'Senior Software Engineer', jobTitle: 'Senior Developer', employmentType: 'full-time', status: 'active', joiningDate: '2022-03-15', department: { id: 'dept-tcg-eng', name: 'Engineering' }, branch: { id: 'br-tcg-sf', name: 'HQ San Francisco' }, company: { id: 'comp-tcg', name: 'TechCorp Global' } },
  { id: 'emp-tcg-2', employeeId: 'TCG002', firstName: 'Raj', lastName: 'Patel', email: 'raj.p@techcorp.com', phone: '+1-415-555-0102', designation: 'HR Manager', jobTitle: 'HR Manager', employmentType: 'full-time', status: 'active', joiningDate: '2021-07-01', department: { id: 'dept-tcg-hr', name: 'Human Resources' }, branch: { id: 'br-tcg-sf', name: 'HQ San Francisco' }, company: { id: 'comp-tcg', name: 'TechCorp Global' } },
  { id: 'emp-tcg-3', employeeId: 'TCG003', firstName: 'Emily', lastName: 'Chen', email: 'emily.c@techcorp.com', phone: '+1-415-555-0103', designation: 'Product Designer', jobTitle: 'Lead Designer', employmentType: 'full-time', status: 'active', joiningDate: '2023-01-10', department: { id: 'dept-tcg-design', name: 'Design' }, branch: { id: 'br-tcg-sf', name: 'HQ San Francisco' }, company: { id: 'comp-tcg', name: 'TechCorp Global' } },
  { id: 'emp-tcg-4', employeeId: 'TCG004', firstName: 'Michael', lastName: 'Brown', email: 'michael.b@techcorp.com', phone: '+1-212-555-0104', designation: 'DevOps Lead', jobTitle: 'DevOps Lead', employmentType: 'full-time', status: 'probation', joiningDate: '2024-09-01', department: { id: 'dept-tcg-eng', name: 'Engineering' }, branch: { id: 'br-tcg-ny', name: 'NYC Office' }, company: { id: 'comp-tcg', name: 'TechCorp Global' } },
  { id: 'emp-tcg-5', employeeId: 'TCG005', firstName: 'Lisa', lastName: 'Anderson', email: 'lisa.a@techcorp.com', phone: '+1-212-555-0105', designation: 'Finance Analyst', jobTitle: 'Senior Analyst', employmentType: 'full-time', status: 'active', joiningDate: '2022-08-22', department: { id: 'dept-tcg-fin', name: 'Finance' }, branch: { id: 'br-tcg-ny', name: 'NYC Office' }, company: { id: 'comp-tcg', name: 'TechCorp Global' } },
  { id: 'emp-tcg-6', employeeId: 'TCG006', firstName: 'Arjun', lastName: 'Menon', email: 'arjun.m@techcorp.com', phone: '+91-80-555-0106', designation: 'QA Engineer', jobTitle: 'QA Lead', employmentType: 'full-time', status: 'active', joiningDate: '2022-09-20', department: { id: 'dept-tcg-eng', name: 'Engineering' }, branch: { id: 'br-tcg-blr', name: 'Bangalore Tech Center' }, company: { id: 'comp-tcg', name: 'TechCorp Global' } },
  { id: 'emp-tcg-7', employeeId: 'TCG007', firstName: 'Deepa', lastName: 'Iyer', email: 'deepa.i@techcorp.com', phone: '+91-80-555-0107', designation: 'Sales Executive', jobTitle: 'Sales Lead', employmentType: 'full-time', status: 'active', joiningDate: '2023-11-01', department: { id: 'dept-tcg-sales', name: 'Sales' }, branch: { id: 'br-tcg-blr', name: 'Bangalore Tech Center' }, company: { id: 'comp-tcg', name: 'TechCorp Global' } },
  { id: 'emp-tcg-8', employeeId: 'TCG008', firstName: 'Vikram', lastName: 'Singh', email: 'vikram.s@techcorp.com', phone: '+91-80-555-0108', designation: 'Data Scientist', jobTitle: 'ML Engineer', employmentType: 'full-time', status: 'active', joiningDate: '2023-04-15', department: { id: 'dept-tcg-ana', name: 'Analytics' }, branch: { id: 'br-tcg-blr', name: 'Bangalore Tech Center' }, company: { id: 'comp-tcg', name: 'TechCorp Global' } },
  { id: 'emp-tcg-9', employeeId: 'TCG009', firstName: 'Ananya', lastName: 'Gupta', email: 'ananya.g@techcorp.com', phone: '+91-80-555-0109', designation: 'Marketing Lead', jobTitle: 'Marketing Manager', employmentType: 'full-time', status: 'active', joiningDate: '2023-07-15', department: { id: 'dept-tcg-ops', name: 'Operations' }, branch: { id: 'br-tcg-blr', name: 'Bangalore Tech Center' }, company: { id: 'comp-tcg', name: 'TechCorp Global' } },
  { id: 'emp-tcg-10', employeeId: 'TCG010', firstName: 'Kiran', lastName: 'Nair', email: 'kiran.n@techcorp.com', phone: '+1-415-555-0110', designation: 'Backend Developer', jobTitle: 'Senior Backend Dev', employmentType: 'full-time', status: 'on_leave', joiningDate: '2022-04-15', department: { id: 'dept-tcg-eng', name: 'Engineering' }, branch: { id: 'br-tcg-sf', name: 'HQ San Francisco' }, company: { id: 'comp-tcg', name: 'TechCorp Global' } },
  { id: 'emp-tcg-11', employeeId: 'TCG011', firstName: 'Meera', lastName: 'Joshi', email: 'meera.j@techcorp.com', phone: '+91-80-555-0111', designation: 'Senior Accountant', jobTitle: 'Accountant', employmentType: 'full-time', status: 'active', joiningDate: '2022-11-10', department: { id: 'dept-tcg-fin', name: 'Finance' }, branch: { id: 'br-tcg-blr', name: 'Bangalore Tech Center' }, company: { id: 'comp-tcg', name: 'TechCorp Global' } },
  { id: 'emp-tcg-12', employeeId: 'TCG012', firstName: 'Sneha', lastName: 'Reddy', email: 'sneha.r@techcorp.com', phone: '+91-80-555-0112', designation: 'Recruitment Specialist', jobTitle: 'Recruiter', employmentType: 'full-time', status: 'active', joiningDate: '2024-01-08', department: { id: 'dept-tcg-hr', name: 'Human Resources' }, branch: { id: 'br-tcg-blr', name: 'Bangalore Tech Center' }, company: { id: 'comp-tcg', name: 'TechCorp Global' } },
  // ManufactPro Industries
  { id: 'emp-mpi-1', employeeId: 'MPI001', firstName: 'Priya', lastName: 'Sharma', email: 'priya.s@manufactpro.com', phone: '+91-22-555-0201', designation: 'Production Manager', jobTitle: 'Production Head', employmentType: 'full-time', status: 'active', joiningDate: '2020-11-20', department: { id: 'dept-mpi-prod', name: 'Production' }, branch: { id: 'br-mpi-mum', name: 'Mumbai HQ' }, company: { id: 'comp-mpi', name: 'ManufactPro Industries' } },
  { id: 'emp-mpi-2', employeeId: 'MPI002', firstName: 'Arjun', lastName: 'Kumar', email: 'arjun.k@manufactpro.com', phone: '+91-22-555-0202', designation: 'Quality Inspector', jobTitle: 'QA Inspector', employmentType: 'full-time', status: 'active', joiningDate: '2023-04-01', department: { id: 'dept-mpi-qual', name: 'Quality' }, branch: { id: 'br-mpi-mum', name: 'Mumbai HQ' }, company: { id: 'comp-mpi', name: 'ManufactPro Industries' } },
  { id: 'emp-mpi-3', employeeId: 'MPI003', firstName: 'Rakesh', lastName: 'Verma', email: 'rakesh.v@manufactpro.com', phone: '+91-11-555-0203', designation: 'Shift Supervisor', jobTitle: 'Night Shift Lead', employmentType: 'full-time', status: 'active', joiningDate: '2021-06-15', department: { id: 'dept-mpi-prod', name: 'Production' }, branch: { id: 'br-mpi-del', name: 'Delhi Factory' }, company: { id: 'comp-mpi', name: 'ManufactPro Industries' } },
  { id: 'emp-mpi-4', employeeId: 'MPI004', firstName: 'Neha', lastName: 'Gupta', email: 'neha.g@manufactpro.com', phone: '+91-22-555-0204', designation: 'Safety Officer', jobTitle: 'HSE Officer', employmentType: 'full-time', status: 'active', joiningDate: '2022-01-10', department: { id: 'dept-mpi-ops', name: 'Operations' }, branch: { id: 'br-mpi-mum', name: 'Mumbai HQ' }, company: { id: 'comp-mpi', name: 'ManufactPro Industries' } },
  { id: 'emp-mpi-5', employeeId: 'MPI005', firstName: 'Suresh', lastName: 'Patil', email: 'suresh.p@manufactpro.com', phone: '+91-22-555-0205', designation: 'Machine Operator', jobTitle: 'CNC Operator', employmentType: 'contract', status: 'active', joiningDate: '2023-09-01', department: { id: 'dept-mpi-prod', name: 'Production' }, branch: { id: 'br-mpi-del', name: 'Delhi Factory' }, company: { id: 'comp-mpi', name: 'ManufactPro Industries' } },
  { id: 'emp-mpi-6', employeeId: 'MPI006', firstName: 'Amit', lastName: 'Das', email: 'amit.d@manufactpro.com', phone: '+91-11-555-0206', designation: 'Quality Analyst', jobTitle: 'Lab Analyst', employmentType: 'full-time', status: 'notice_period', joiningDate: '2021-03-20', department: { id: 'dept-mpi-qual', name: 'Quality' }, branch: { id: 'br-mpi-del', name: 'Delhi Factory' }, company: { id: 'comp-mpi', name: 'ManufactPro Industries' } },
  { id: 'emp-mpi-7', employeeId: 'MPI007', firstName: 'Pooja', lastName: 'Mehta', email: 'pooja.m@manufactpro.com', phone: '+91-22-555-0207', designation: 'HR Executive', jobTitle: 'HR Business Partner', employmentType: 'full-time', status: 'active', joiningDate: '2022-07-01', department: { id: 'dept-mpi-ops', name: 'Operations' }, branch: { id: 'br-mpi-mum', name: 'Mumbai HQ' }, company: { id: 'comp-mpi', name: 'ManufactPro Industries' } },
  { id: 'emp-mpi-8', employeeId: 'MPI008', firstName: 'Vijay', lastName: 'Rao', email: 'vijay.r@manufactpro.com', phone: '+91-22-555-0208', designation: 'Maintenance Engineer', jobTitle: 'Plant Maintenance', employmentType: 'full-time', status: 'active', joiningDate: '2020-05-10', department: { id: 'dept-mpi-ops', name: 'Operations' }, branch: { id: 'br-mpi-mum', name: 'Mumbai HQ' }, company: { id: 'comp-mpi', name: 'ManufactPro Industries' } },
  // HealthFirst Solutions
  { id: 'emp-hfs-1', employeeId: 'HFS001', firstName: 'David', lastName: 'Wilson', email: 'david.w@healthfirst.com', phone: '+44-20-555-0301', designation: 'Nurse Practitioner', jobTitle: 'Senior NP', employmentType: 'full-time', status: 'on_leave', joiningDate: '2019-05-15', department: { id: 'dept-hfs-clin', name: 'Clinical' }, branch: { id: 'br-hfs-lon', name: 'London Office' }, company: { id: 'comp-hfs', name: 'HealthFirst Solutions' } },
  { id: 'emp-hfs-2', employeeId: 'HFS002', firstName: 'Emma', lastName: 'Thompson', email: 'emma.t@healthfirst.com', phone: '+44-20-555-0302', designation: 'Hospital Administrator', jobTitle: 'Admin Director', employmentType: 'full-time', status: 'active', joiningDate: '2020-01-20', department: { id: 'dept-hfs-admin', name: 'Administration' }, branch: { id: 'br-hfs-lon', name: 'London Office' }, company: { id: 'comp-hfs', name: 'HealthFirst Solutions' } },
  { id: 'emp-hfs-3', employeeId: 'HFS003', firstName: 'James', lastName: 'Okafor', email: 'james.o@healthfirst.com', phone: '+44-20-555-0303', designation: 'Lab Technician', jobTitle: 'Pathology Tech', employmentType: 'full-time', status: 'active', joiningDate: '2022-03-10', department: { id: 'dept-hfs-clin', name: 'Clinical' }, branch: { id: 'br-hfs-lon', name: 'London Office' }, company: { id: 'comp-hfs', name: 'HealthFirst Solutions' } },
  { id: 'emp-hfs-4', employeeId: 'HFS004', firstName: 'Fatima', lastName: 'Khan', email: 'fatima.k@healthfirst.com', phone: '+44-20-555-0304', designation: 'Pharmacist', jobTitle: 'Chief Pharmacist', employmentType: 'full-time', status: 'active', joiningDate: '2021-08-15', department: { id: 'dept-hfs-clin', name: 'Clinical' }, branch: { id: 'br-hfs-lon', name: 'London Office' }, company: { id: 'comp-hfs', name: 'HealthFirst Solutions' } },
  { id: 'emp-hfs-5', employeeId: 'HFS005', firstName: 'Robert', lastName: 'Clarke', email: 'robert.c@healthfirst.com', phone: '+44-20-555-0305', designation: 'Finance Manager', jobTitle: 'CFO', employmentType: 'full-time', status: 'active', joiningDate: '2020-06-01', department: { id: 'dept-hfs-admin', name: 'Administration' }, branch: { id: 'br-hfs-lon', name: 'London Office' }, company: { id: 'comp-hfs', name: 'HealthFirst Solutions' } },
  { id: 'emp-hfs-6', employeeId: 'HFS006', firstName: 'Sarah', lastName: 'Mitchell', email: 'sarah.m@healthfirst.com', phone: '+44-20-555-0306', designation: 'Registered Nurse', jobTitle: 'ICU Nurse', employmentType: 'full-time', status: 'probation', joiningDate: '2024-10-01', department: { id: 'dept-hfs-clin', name: 'Clinical' }, branch: { id: 'br-hfs-lon', name: 'London Office' }, company: { id: 'comp-hfs', name: 'HealthFirst Solutions' } },
  // RetailMax Group
  { id: 'emp-rmg-1', employeeId: 'RMG001', firstName: 'Carlos', lastName: 'Rodriguez', email: 'carlos.r@retailmax.com', phone: '+49-30-555-0401', designation: 'Store Manager', jobTitle: 'Regional Manager', employmentType: 'full-time', status: 'notice_period', joiningDate: '2021-02-10', department: { id: 'dept-rmg-retail', name: 'Retail Operations' }, branch: { id: 'br-rmg-ber', name: 'Berlin HQ' }, company: { id: 'comp-rmg', name: 'RetailMax Group' } },
  { id: 'emp-rmg-2', employeeId: 'RMG002', firstName: 'Anna', lastName: 'Mueller', email: 'anna.m@retailmax.com', phone: '+49-30-555-0402', designation: 'Visual Merchandiser', jobTitle: 'Merch Lead', employmentType: 'full-time', status: 'active', joiningDate: '2022-05-01', department: { id: 'dept-rmg-retail', name: 'Retail Operations' }, branch: { id: 'br-rmg-ber', name: 'Berlin HQ' }, company: { id: 'comp-rmg', name: 'RetailMax Group' } },
  { id: 'emp-rmg-3', employeeId: 'RMG003', firstName: 'Lars', lastName: 'Schmidt', email: 'lars.s@retailmax.com', phone: '+49-30-555-0403', designation: 'Inventory Analyst', jobTitle: 'Supply Chain Analyst', employmentType: 'full-time', status: 'active', joiningDate: '2023-01-15', department: { id: 'dept-rmg-retail', name: 'Retail Operations' }, branch: { id: 'br-rmg-ber', name: 'Berlin HQ' }, company: { id: 'comp-rmg', name: 'RetailMax Group' } },
  { id: 'emp-rmg-4', employeeId: 'RMG004', firstName: 'Maria', lastName: 'Weber', email: 'maria.w@retailmax.com', phone: '+49-30-555-0404', designation: 'Cashier Lead', jobTitle: 'Front End Lead', employmentType: 'part-time', status: 'active', joiningDate: '2022-11-20', department: { id: 'dept-rmg-retail', name: 'Retail Operations' }, branch: { id: 'br-rmg-ber', name: 'Berlin HQ' }, company: { id: 'comp-rmg', name: 'RetailMax Group' } },
  { id: 'emp-rmg-5', employeeId: 'RMG005', firstName: 'Hans', lastName: 'Braun', email: 'hans.b@retailmax.com', phone: '+49-30-555-0405', designation: 'E-commerce Manager', jobTitle: 'Digital Commerce Lead', employmentType: 'full-time', status: 'active', joiningDate: '2023-06-01', department: { id: 'dept-rmg-retail', name: 'Retail Operations' }, branch: { id: 'br-rmg-ber', name: 'Berlin HQ' }, company: { id: 'comp-rmg', name: 'RetailMax Group' } },
  // LogiTrans Worldwide
  { id: 'emp-ltw-1', employeeId: 'LTW001', firstName: 'Aiko', lastName: 'Tanaka', email: 'aiko.t@logitrans.com', phone: '+65-555-0501', designation: 'Fleet Coordinator', jobTitle: 'Fleet Manager', employmentType: 'full-time', status: 'active', joiningDate: '2023-06-01', department: { id: 'dept-ltw-log', name: 'Logistics' }, branch: { id: 'br-ltw-sg', name: 'Singapore HQ' }, company: { id: 'comp-ltw', name: 'LogiTrans Worldwide' } },
  { id: 'emp-ltw-2', employeeId: 'LTW002', firstName: 'Wei', lastName: 'Lim', email: 'wei.l@logitrans.com', phone: '+65-555-0502', designation: 'Supply Chain Analyst', jobTitle: 'SCM Lead', employmentType: 'full-time', status: 'active', joiningDate: '2022-09-15', department: { id: 'dept-ltw-log', name: 'Logistics' }, branch: { id: 'br-ltw-sg', name: 'Singapore HQ' }, company: { id: 'comp-ltw', name: 'LogiTrans Worldwide' } },
  { id: 'emp-ltw-3', employeeId: 'LTW003', firstName: 'Ravi', lastName: 'Krishnan', email: 'ravi.k@logitrans.com', phone: '+65-555-0503', designation: 'Warehouse Manager', jobTitle: 'WH Operations', employmentType: 'full-time', status: 'active', joiningDate: '2021-12-01', department: { id: 'dept-ltw-log', name: 'Logistics' }, branch: { id: 'br-ltw-sg', name: 'Singapore HQ' }, company: { id: 'comp-ltw', name: 'LogiTrans Worldwide' } },
  { id: 'emp-ltw-4', employeeId: 'LTW004', firstName: 'Siti', lastName: 'Rahman', email: 'siti.r@logitrans.com', phone: '+65-555-0504', designation: 'Customs Officer', jobTitle: 'Trade Compliance', employmentType: 'full-time', status: 'probation', joiningDate: '2024-08-15', department: { id: 'dept-ltw-log', name: 'Logistics' }, branch: { id: 'br-ltw-sg', name: 'Singapore HQ' }, company: { id: 'comp-ltw', name: 'LogiTrans Worldwide' } },
];

// ==================== JOBS ====================
export const DEMO_JOBS = [
  { id: 'job-tcg-1', title: 'Senior Full-Stack Developer', department: 'Engineering', location: 'San Francisco, CA', employmentType: 'Full-time', experienceMin: 5, experienceMax: 8, salaryMin: 140000, salaryMax: 180000, status: 'open', priority: 'high', positions: 2, filledPositions: 0, postedDate: '2024-12-01', closingDate: '2025-02-01', companyId: 'comp-tcg', _count: { candidates: 3 } },
  { id: 'job-tcg-2', title: 'HR Business Partner', department: 'Human Resources', location: 'New York, NY', employmentType: 'Full-time', experienceMin: 7, experienceMax: 10, salaryMin: 95000, salaryMax: 120000, status: 'open', priority: 'medium', positions: 1, filledPositions: 0, postedDate: '2024-11-28', closingDate: '2025-01-28', companyId: 'comp-tcg', _count: { candidates: 2 } },
  { id: 'job-tcg-3', title: 'UX Research Lead', department: 'Design', location: 'Remote', employmentType: 'Full-time', experienceMin: 6, experienceMax: 9, salaryMin: 120000, salaryMax: 150000, status: 'interviewing', priority: 'high', positions: 1, filledPositions: 0, postedDate: '2024-11-15', closingDate: '2025-01-15', companyId: 'comp-tcg', _count: { candidates: 2 } },
  { id: 'job-mpi-1', title: 'Production Supervisor', department: 'Production', location: 'Mumbai, India', employmentType: 'Full-time', experienceMin: 8, experienceMax: 12, salaryMin: 1500000, salaryMax: 2200000, status: 'open', priority: 'urgent', positions: 3, filledPositions: 1, postedDate: '2024-12-05', closingDate: '2025-02-05', companyId: 'comp-mpi', _count: { candidates: 2 } },
  { id: 'job-hfs-1', title: 'Registered Nurse', department: 'Clinical', location: 'London, UK', employmentType: 'Full-time', experienceMin: 2, experienceMax: 5, salaryMin: 35000, salaryMax: 45000, status: 'open', priority: 'high', positions: 5, filledPositions: 2, postedDate: '2024-12-03', closingDate: '2025-02-03', companyId: 'comp-hfs', _count: { candidates: 2 } },
  { id: 'job-tcg-4', title: 'Data Scientist', department: 'Analytics', location: 'Austin, TX', employmentType: 'Full-time', experienceMin: 3, experienceMax: 5, salaryMin: 110000, salaryMax: 145000, status: 'draft', priority: 'medium', positions: 1, filledPositions: 0, postedDate: null, closingDate: null, companyId: 'comp-tcg', _count: { candidates: 1 } },
  { id: 'job-ltw-1', title: 'Cloud Infrastructure Engineer', department: 'Engineering', location: 'Singapore', employmentType: 'Full-time', experienceMin: 4, experienceMax: 7, salaryMin: 8000, salaryMax: 12000, status: 'on_hold', priority: 'low', positions: 1, filledPositions: 0, postedDate: '2024-11-20', closingDate: '2025-01-20', companyId: 'comp-ltw', _count: { candidates: 1 } },
  { id: 'job-rmg-1', title: 'E-commerce Director', department: 'Retail Operations', location: 'Berlin, Germany', employmentType: 'Full-time', experienceMin: 8, experienceMax: 12, salaryMin: 90000, salaryMax: 120000, status: 'open', priority: 'high', positions: 1, filledPositions: 0, postedDate: '2024-12-10', closingDate: '2025-02-10', companyId: 'comp-rmg', _count: { candidates: 2 } },
];

// ==================== CANDIDATES ====================
export const DEMO_CANDIDATES = [
  { id: 'cand-1', firstName: 'Alex', lastName: 'Turner', email: 'alex.t@email.com', phone: '+1-555-2001', currentCompany: 'Google', currentTitle: 'Software Engineer', experience: 6, expectedSalary: 160000, noticePeriod: '30 days', status: 'interviewing', source: 'LinkedIn', aiScore: 92, skillMatch: 88, cultureFitScore: 85, notes: 'Strong full-stack skills', jobId: 'job-tcg-1' },
  { id: 'cand-2', firstName: 'Maya', lastName: 'Singh', email: 'maya.s@email.com', phone: '+1-555-2002', currentCompany: 'Amazon', currentTitle: 'Senior Developer', experience: 8, expectedSalary: 175000, noticePeriod: '60 days', status: 'shortlisted', source: 'Naukri', aiScore: 89, skillMatch: 91, cultureFitScore: 80, notes: 'Backend specialist', jobId: 'job-tcg-1' },
  { id: 'cand-3', firstName: 'James', lastName: 'Williams', email: 'james.w@email.com', phone: '+1-555-2003', currentCompany: 'Microsoft', currentTitle: 'HR Manager', experience: 9, expectedSalary: 110000, noticePeriod: '30 days', status: 'offered', source: 'Referral', aiScore: 95, skillMatch: 94, cultureFitScore: 90, notes: 'Excellent HR background', jobId: 'job-tcg-2' },
  { id: 'cand-4', firstName: 'Sophie', lastName: 'Martin', email: 'sophie.m@email.com', phone: '+44-555-2004', currentCompany: 'Meta', currentTitle: 'UX Researcher', experience: 7, expectedSalary: 140000, noticePeriod: '45 days', status: 'screening', source: 'Portal', aiScore: 78, skillMatch: 82, cultureFitScore: 88, notes: 'Mixed methods expert', jobId: 'job-tcg-3' },
  { id: 'cand-5', firstName: 'Wei', lastName: 'Zhang', email: 'wei.z@email.com', phone: '+86-555-2005', currentCompany: 'ByteDance', currentTitle: 'Data Engineer', experience: 4, expectedSalary: 135000, noticePeriod: '30 days', status: 'applied', source: 'Indeed', aiScore: 72, skillMatch: 68, cultureFitScore: 75, notes: 'ML pipeline experience', jobId: 'job-tcg-4' },
  { id: 'cand-6', firstName: 'Rajesh', lastName: 'Kumar', email: 'rajesh.k@email.com', phone: '+91-555-2006', currentCompany: 'Tata Steel', currentTitle: 'Shift Manager', experience: 10, expectedSalary: 1800000, noticePeriod: '90 days', status: 'interviewing', source: 'Naukri', aiScore: 85, skillMatch: 90, cultureFitScore: 82, notes: 'Heavy industry background', jobId: 'job-mpi-1' },
  { id: 'cand-7', firstName: 'Priya', lastName: 'Nair', email: 'priya.n@email.com', phone: '+91-555-2007', currentCompany: 'Reliance', currentTitle: 'Quality Manager', experience: 8, expectedSalary: 1600000, noticePeriod: '60 days', status: 'shortlisted', source: 'Referral', aiScore: 88, skillMatch: 85, cultureFitScore: 90, notes: 'Six Sigma certified', jobId: 'job-mpi-1' },
  { id: 'cand-8', firstName: 'Grace', lastName: 'Okonkwo', email: 'grace.o@email.com', phone: '+44-555-2008', currentCompany: 'NHS', currentTitle: 'Staff Nurse', experience: 5, expectedSalary: 40000, noticePeriod: '30 days', status: 'interviewing', source: 'NHS Jobs', aiScore: 90, skillMatch: 92, cultureFitScore: 88, notes: 'ICU experience', jobId: 'job-hfs-1' },
  { id: 'cand-9', firstName: 'Thomas', lastName: 'Mueller', email: 'thomas.m@email.com', phone: '+49-555-2009', currentCompany: 'Zalando', currentTitle: 'E-commerce Lead', experience: 9, expectedSalary: 105000, noticePeriod: '45 days', status: 'applied', source: 'LinkedIn', aiScore: 82, skillMatch: 80, cultureFitScore: 78, notes: 'Fashion retail experience', jobId: 'job-rmg-1' },
  { id: 'cand-10', firstName: 'Yuki', lastName: 'Tanaka', email: 'yuki.t@email.com', phone: '+81-555-2010', currentCompany: 'NTT Data', currentTitle: 'Cloud Architect', experience: 6, expectedSalary: 10000, noticePeriod: '30 days', status: 'screening', source: 'Portal', aiScore: 76, skillMatch: 80, cultureFitScore: 72, notes: 'AWS certified', jobId: 'job-ltw-1' },
  { id: 'cand-11', firstName: 'Olivia', lastName: 'Brown', email: 'olivia.b@email.com', phone: '+1-555-2011', currentCompany: 'Apple', currentTitle: 'Product Designer', experience: 5, expectedSalary: 145000, noticePeriod: '30 days', status: 'applied', source: 'LinkedIn', aiScore: 84, skillMatch: 86, cultureFitScore: 82, notes: 'Design systems expert', jobId: 'job-tcg-3' },
  { id: 'cand-12', firstName: 'Claire', lastName: 'Dubois', email: 'claire.d@email.com', phone: '+33-555-2012', currentCompany: 'Carrefour', currentTitle: 'Regional Director', experience: 12, expectedSalary: 110000, noticePeriod: '60 days', status: 'interviewing', source: 'Referral', aiScore: 87, skillMatch: 84, cultureFitScore: 86, notes: 'Multi-country retail exp', jobId: 'job-rmg-1' },
  { id: 'cand-13', firstName: 'Aisha', lastName: 'Patel', email: 'aisha.p@email.com', phone: '+44-555-2013', currentCompany: 'Bupa', currentTitle: 'Nurse Practitioner', experience: 4, expectedSalary: 42000, noticePeriod: '30 days', status: 'shortlisted', source: 'NHS Jobs', aiScore: 91, skillMatch: 93, cultureFitScore: 87, notes: 'Emergency care specialist', jobId: 'job-hfs-1' },
];

// ==================== INTERVIEWS ====================
export const DEMO_INTERVIEWS = [
  { id: 'int-1', type: 'technical', scheduledAt: '2025-01-22T10:00:00', duration: 60, status: 'scheduled', feedback: null, rating: null, meetingLink: 'https://meet.nexushrms.com/int-1', aiTranscript: null, candidateId: 'cand-1', jobId: 'job-tcg-1', candidate: { id: 'cand-1', firstName: 'Alex', lastName: 'Turner', email: 'alex.t@email.com' } },
  { id: 'int-2', type: 'hr', scheduledAt: '2025-01-23T14:00:00', duration: 45, status: 'scheduled', feedback: null, rating: null, meetingLink: 'https://meet.nexushrms.com/int-2', aiTranscript: null, candidateId: 'cand-1', jobId: 'job-tcg-1', candidate: { id: 'cand-1', firstName: 'Alex', lastName: 'Turner', email: 'alex.t@email.com' } },
  { id: 'int-3', type: 'manager', scheduledAt: '2025-01-20T11:00:00', duration: 60, status: 'completed', feedback: 'Strong technical skills, good culture fit. Recommended for next round.', rating: 4, meetingLink: null, aiTranscript: 'AI Interview Transcript: Candidate showed strong problem-solving...', candidateId: 'cand-3', jobId: 'job-tcg-2', candidate: { id: 'cand-3', firstName: 'James', lastName: 'Williams', email: 'james.w@email.com' } },
  { id: 'int-4', type: 'coding', scheduledAt: '2025-01-21T09:00:00', duration: 90, status: 'completed', feedback: 'Excellent coding skills. Solved 3/3 problems. Strong system design.', rating: 5, meetingLink: null, aiTranscript: null, candidateId: 'cand-2', jobId: 'job-tcg-1', candidate: { id: 'cand-2', firstName: 'Maya', lastName: 'Singh', email: 'maya.s@email.com' } },
  { id: 'int-5', type: 'behavioral', scheduledAt: '2025-01-25T15:00:00', duration: 45, status: 'scheduled', feedback: null, rating: null, meetingLink: 'https://meet.nexushrms.com/int-5', aiTranscript: null, candidateId: 'cand-6', jobId: 'job-mpi-1', candidate: { id: 'cand-6', firstName: 'Rajesh', lastName: 'Kumar', email: 'rajesh.k@email.com' } },
  { id: 'int-6', type: 'technical', scheduledAt: '2025-01-24T10:30:00', duration: 60, status: 'cancelled', feedback: 'Candidate withdrew application.', rating: null, meetingLink: null, aiTranscript: null, candidateId: 'cand-5', jobId: 'job-tcg-4', candidate: { id: 'cand-5', firstName: 'Wei', lastName: 'Zhang', email: 'wei.z@email.com' } },
  { id: 'int-7', type: 'mcq', scheduledAt: '2025-01-26T11:00:00', duration: 45, status: 'scheduled', feedback: null, rating: null, meetingLink: null, aiTranscript: null, candidateId: 'cand-8', jobId: 'job-hfs-1', candidate: { id: 'cand-8', firstName: 'Grace', lastName: 'Okonkwo', email: 'grace.o@email.com' } },
];

// ==================== ATTENDANCE ====================
export const DEMO_ATTENDANCE = [
  { id: 'att-1', date: '2025-01-20', checkIn: '09:02', checkOut: '18:15', workHours: 8.5, status: 'present', source: 'biometric', employeeId: 'emp-tcg-1' },
  { id: 'att-2', date: '2025-01-20', checkIn: '09:35', checkOut: '18:30', workHours: 8.0, status: 'late', source: 'mobile', employeeId: 'emp-tcg-2' },
  { id: 'att-3', date: '2025-01-20', checkIn: '08:50', checkOut: '17:45', workHours: 8.0, status: 'present', source: 'gps', employeeId: 'emp-tcg-3' },
  { id: 'att-4', date: '2025-01-20', checkIn: null, checkOut: null, workHours: 0, status: 'absent', source: 'system', employeeId: 'emp-hfs-1' },
  { id: 'att-5', date: '2025-01-20', checkIn: '09:00', checkOut: '14:00', workHours: 4.0, status: 'half_day', source: 'web', employeeId: 'emp-mpi-1' },
  { id: 'att-6', date: '2025-01-20', checkIn: '08:45', checkOut: '18:00', workHours: 8.5, status: 'present', source: 'rfid', employeeId: 'emp-ltw-1' },
  { id: 'att-7', date: '2025-01-19', checkIn: '09:00', checkOut: '18:00', workHours: 8.0, status: 'present', source: 'biometric', employeeId: 'emp-tcg-1' },
  { id: 'att-8', date: '2025-01-19', checkIn: '09:10', checkOut: '18:20', workHours: 8.0, status: 'present', source: 'mobile', employeeId: 'emp-tcg-2' },
  { id: 'att-9', date: '2025-01-19', checkIn: null, checkOut: null, workHours: 0, status: 'absent', source: 'system', employeeId: 'emp-tcg-10' },
  { id: 'att-10', date: '2025-01-18', checkIn: '09:05', checkOut: '17:30', workHours: 7.5, status: 'present', source: 'web', employeeId: 'emp-tcg-5' },
  { id: 'att-11', date: '2025-01-18', checkIn: '10:00', checkOut: '19:00', workHours: 8.0, status: 'late', source: 'mobile', employeeId: 'emp-rmg-1' },
  { id: 'att-12', date: '2025-01-17', checkIn: '08:30', checkOut: '17:45', workHours: 8.25, status: 'present', source: 'biometric', employeeId: 'emp-mpi-2' },
];

// ==================== LEAVES ====================
export const DEMO_LEAVES = [
  { id: 'leave-1', type: 'Casual Leave', startDate: '2025-01-22', endDate: '2025-01-23', totalDays: 2, reason: 'Personal work', status: 'approved', approverComment: 'Approved', employeeId: 'emp-tcg-1', employee: { id: 'emp-tcg-1', firstName: 'Sarah', lastName: 'Johnson' } },
  { id: 'leave-2', type: 'Sick Leave', startDate: '2025-01-20', endDate: '2025-01-21', totalDays: 2, reason: 'Not feeling well', status: 'pending', approverComment: null, employeeId: 'emp-tcg-2', employee: { id: 'emp-tcg-2', firstName: 'Raj', lastName: 'Patel' } },
  { id: 'leave-3', type: 'Earned Leave', startDate: '2025-02-10', endDate: '2025-02-14', totalDays: 5, reason: 'Family vacation', status: 'pending', approverComment: null, employeeId: 'emp-tcg-3', employee: { id: 'emp-tcg-3', firstName: 'Emily', lastName: 'Chen' } },
  { id: 'leave-4', type: 'Maternity Leave', startDate: '2025-01-15', endDate: '2025-07-15', totalDays: 182, reason: 'Maternity', status: 'approved', approverComment: 'Approved per policy', employeeId: 'emp-tcg-5', employee: { id: 'emp-tcg-5', firstName: 'Lisa', lastName: 'Anderson' } },
  { id: 'leave-5', type: 'Comp Off', startDate: '2025-01-25', endDate: '2025-01-25', totalDays: 1, reason: 'Weekend work compensation', status: 'approved', approverComment: null, employeeId: 'emp-mpi-2', employee: { id: 'emp-mpi-2', firstName: 'Arjun', lastName: 'Kumar' } },
  { id: 'leave-6', type: 'Sick Leave', startDate: '2025-01-18', endDate: '2025-01-19', totalDays: 2, reason: 'Flu', status: 'approved', approverComment: null, employeeId: 'emp-hfs-1', employee: { id: 'emp-hfs-1', firstName: 'David', lastName: 'Wilson' } },
  { id: 'leave-7', type: 'Casual Leave', startDate: '2025-02-01', endDate: '2025-02-03', totalDays: 3, reason: 'Personal errands', status: 'pending', approverComment: null, employeeId: 'emp-rmg-2', employee: { id: 'emp-rmg-2', firstName: 'Anna', lastName: 'Mueller' } },
  { id: 'leave-8', type: 'Earned Leave', startDate: '2025-03-01', endDate: '2025-03-07', totalDays: 5, reason: 'International travel', status: 'pending', approverComment: null, employeeId: 'emp-ltw-1', employee: { id: 'emp-ltw-1', firstName: 'Aiko', lastName: 'Tanaka' } },
];

// ==================== PAYROLL ====================
export const DEMO_PAYROLL = [
  { id: 'pay-1', month: 1, year: 2025, basicPay: 8000, grossSalary: 12000, totalDeductions: 3200, netSalary: 8800, status: 'paid', paymentDate: '2025-01-31', employeeId: 'emp-tcg-1', employee: { id: 'emp-tcg-1', firstName: 'Sarah', lastName: 'Johnson' } },
  { id: 'pay-2', month: 1, year: 2025, basicPay: 7500, grossSalary: 11000, totalDeductions: 2900, netSalary: 8100, status: 'paid', paymentDate: '2025-01-31', employeeId: 'emp-tcg-2', employee: { id: 'emp-tcg-2', firstName: 'Raj', lastName: 'Patel' } },
  { id: 'pay-3', month: 1, year: 2025, basicPay: 6500, grossSalary: 9500, totalDeductions: 2500, netSalary: 7000, status: 'processed', paymentDate: null, employeeId: 'emp-tcg-3', employee: { id: 'emp-tcg-3', firstName: 'Emily', lastName: 'Chen' } },
  { id: 'pay-4', month: 1, year: 2025, basicPay: 9000, grossSalary: 13500, totalDeductions: 3600, netSalary: 9900, status: 'draft', paymentDate: null, employeeId: 'emp-tcg-4', employee: { id: 'emp-tcg-4', firstName: 'Michael', lastName: 'Brown' } },
  { id: 'pay-5', month: 1, year: 2025, basicPay: 5500, grossSalary: 8200, totalDeductions: 2100, netSalary: 6100, status: 'paid', paymentDate: '2025-01-31', employeeId: 'emp-tcg-5', employee: { id: 'emp-tcg-5', firstName: 'Lisa', lastName: 'Anderson' } },
  { id: 'pay-6', month: 1, year: 2025, basicPay: 60000, grossSalary: 85000, totalDeductions: 22000, netSalary: 63000, status: 'paid', paymentDate: '2025-01-31', employeeId: 'emp-mpi-1', employee: { id: 'emp-mpi-1', firstName: 'Priya', lastName: 'Sharma' } },
  { id: 'pay-7', month: 1, year: 2025, basicPay: 3000, grossSalary: 4500, totalDeductions: 1200, netSalary: 3300, status: 'processed', paymentDate: null, employeeId: 'emp-hfs-1', employee: { id: 'emp-hfs-1', firstName: 'David', lastName: 'Wilson' } },
  { id: 'pay-8', month: 1, year: 2025, basicPay: 4000, grossSalary: 6000, totalDeductions: 1600, netSalary: 4400, status: 'paid', paymentDate: '2025-01-31', employeeId: 'emp-rmg-1', employee: { id: 'emp-rmg-1', firstName: 'Carlos', lastName: 'Rodriguez' } },
];

// ==================== GOALS ====================
export const DEMO_GOALS = [
  { id: 'goal-1', title: 'Complete AWS Certification', description: 'Obtain AWS Solutions Architect certification', type: 'individual', category: 'learning', progress: 75, status: 'in_progress', startDate: '2025-01-01', endDate: '2025-03-31', employeeId: 'emp-tcg-1', employee: { id: 'emp-tcg-1', firstName: 'Sarah', lastName: 'Johnson' } },
  { id: 'goal-2', title: 'Reduce Hiring Time-to-Fill', description: 'Reduce average hiring time from 45 to 30 days', type: 'team', category: 'operational', progress: 40, status: 'in_progress', startDate: '2025-01-01', endDate: '2025-06-30', employeeId: 'emp-tcg-2', employee: { id: 'emp-tcg-2', firstName: 'Raj', lastName: 'Patel' } },
  { id: 'goal-3', title: 'Launch Design System 2.0', description: 'Complete the redesign of the component library', type: 'individual', category: 'project', progress: 60, status: 'in_progress', startDate: '2025-01-15', endDate: '2025-04-30', employeeId: 'emp-tcg-3', employee: { id: 'emp-tcg-3', firstName: 'Emily', lastName: 'Chen' } },
  { id: 'goal-4', title: 'Improve Production Yield', description: 'Increase production yield by 5% through process optimization', type: 'team', category: 'operational', progress: 30, status: 'in_progress', startDate: '2025-01-01', endDate: '2025-06-30', employeeId: 'emp-mpi-1', employee: { id: 'emp-mpi-1', firstName: 'Priya', lastName: 'Sharma' } },
  { id: 'goal-5', title: 'Zero Safety Incidents', description: 'Maintain zero safety incidents in Q1', type: 'team', category: 'compliance', progress: 90, status: 'in_progress', startDate: '2025-01-01', endDate: '2025-03-31', employeeId: 'emp-mpi-4', employee: { id: 'emp-mpi-4', firstName: 'Neha', lastName: 'Gupta' } },
  { id: 'goal-6', title: 'Patient Satisfaction Score 4.5+', description: 'Achieve patient satisfaction score of 4.5 or higher', type: 'team', category: 'quality', progress: 85, status: 'in_progress', startDate: '2025-01-01', endDate: '2025-03-31', employeeId: 'emp-hfs-1', employee: { id: 'emp-hfs-1', firstName: 'David', lastName: 'Wilson' } },
  { id: 'goal-7', title: 'Reduce Fleet Downtime 15%', description: 'Reduce fleet vehicle downtime by 15% through predictive maintenance', type: 'individual', category: 'operational', progress: 50, status: 'in_progress', startDate: '2025-01-01', endDate: '2025-06-30', employeeId: 'emp-ltw-1', employee: { id: 'emp-ltw-1', firstName: 'Aiko', lastName: 'Tanaka' } },
  { id: 'goal-8', title: 'CI/CD Pipeline Optimization', description: 'Reduce build times by 40% and deployment frequency by 2x', type: 'individual', category: 'project', progress: 20, status: 'not_started', startDate: '2025-02-01', endDate: '2025-05-31', employeeId: 'emp-tcg-4', employee: { id: 'emp-tcg-4', firstName: 'Michael', lastName: 'Brown' } },
];

// ==================== ASSETS ====================
export const DEMO_ASSETS = [
  { id: 'asset-1', assetType: 'laptop', assetName: 'MacBook Pro 16"', assetCode: 'TCG-LAP-001', serialNumber: 'MBP2024-001', status: 'allocated', allocatedAt: '2024-01-15', returnedAt: null, notes: 'M3 Pro, 36GB RAM', employeeId: 'emp-tcg-1', employee: { id: 'emp-tcg-1', firstName: 'Sarah', lastName: 'Johnson' } },
  { id: 'asset-2', assetType: 'laptop', assetName: 'Dell Latitude 5540', assetCode: 'TCG-LAP-002', serialNumber: 'DL5540-002', status: 'allocated', allocatedAt: '2024-02-01', returnedAt: null, notes: 'i7, 16GB RAM', employeeId: 'emp-tcg-2', employee: { id: 'emp-tcg-2', firstName: 'Raj', lastName: 'Patel' } },
  { id: 'asset-3', assetType: 'monitor', assetName: 'Dell UltraSharp 27"', assetCode: 'TCG-MON-001', serialNumber: 'DU2700-001', status: 'allocated', allocatedAt: '2024-01-15', returnedAt: null, notes: '4K USB-C', employeeId: 'emp-tcg-3', employee: { id: 'emp-tcg-3', firstName: 'Emily', lastName: 'Chen' } },
  { id: 'asset-4', assetType: 'phone', assetName: 'iPhone 15 Pro', assetCode: 'TCG-PHN-001', serialNumber: 'IP15P-001', status: 'allocated', allocatedAt: '2024-03-01', returnedAt: null, notes: 'Company phone', employeeId: 'emp-tcg-5', employee: { id: 'emp-tcg-5', firstName: 'Lisa', lastName: 'Anderson' } },
  { id: 'asset-5', assetType: 'equipment', assetName: 'CNC Machine Access Card', assetCode: 'MPI-EQP-001', serialNumber: 'CNC-ACC-001', status: 'allocated', allocatedAt: '2024-06-01', returnedAt: null, notes: 'Production floor access', employeeId: 'emp-mpi-5', employee: { id: 'emp-mpi-5', firstName: 'Suresh', lastName: 'Patil' } },
  { id: 'asset-6', assetType: 'vehicle', assetName: 'Toyota Hiace Van', assetCode: 'LTW-VHC-001', serialNumber: 'TH-2024-001', status: 'allocated', allocatedAt: '2024-01-10', returnedAt: null, notes: 'Delivery vehicle', employeeId: 'emp-ltw-1', employee: { id: 'emp-ltw-1', firstName: 'Aiko', lastName: 'Tanaka' } },
  { id: 'asset-7', assetType: 'laptop', assetName: 'Lenovo ThinkPad X1', assetCode: 'HFS-LAP-001', serialNumber: 'LTP-X1-001', status: 'returned', allocatedAt: '2023-06-01', returnedAt: '2025-01-10', notes: 'Returned upon leave', employeeId: 'emp-hfs-1', employee: { id: 'emp-hfs-1', firstName: 'David', lastName: 'Wilson' } },
  { id: 'asset-8', assetType: 'equipment', assetName: 'POS Terminal', assetCode: 'RMG-POS-001', serialNumber: 'POS-2024-001', status: 'allocated', allocatedAt: '2024-04-01', returnedAt: null, notes: 'Store checkout terminal', employeeId: 'emp-rmg-4', employee: { id: 'emp-rmg-4', firstName: 'Maria', lastName: 'Weber' } },
];

// ==================== TRAVEL ====================
export const DEMO_TRAVEL = [
  { id: 'travel-1', purpose: 'Client meeting with Acme Corp', destination: 'New York, NY', departureDate: '2025-02-05', returnDate: '2025-02-07', estimatedCost: 2500, approvedCost: 2500, status: 'approved', approverComment: 'Approved - critical client meeting', employeeId: 'emp-tcg-1', employee: { id: 'emp-tcg-1', firstName: 'Sarah', lastName: 'Johnson' } },
  { id: 'travel-2', purpose: 'Factory audit - Delhi plant', destination: 'New Delhi, India', departureDate: '2025-02-10', returnDate: '2025-02-12', estimatedCost: 1500, approvedCost: null, status: 'pending', approverComment: null, employeeId: 'emp-mpi-1', employee: { id: 'emp-mpi-1', firstName: 'Priya', lastName: 'Sharma' } },
  { id: 'travel-3', purpose: 'Medical conference attendance', destination: 'Edinburgh, UK', departureDate: '2025-03-01', returnDate: '2025-03-03', estimatedCost: 1800, approvedCost: null, status: 'pending', approverComment: null, employeeId: 'emp-hfs-2', employee: { id: 'emp-hfs-2', firstName: 'Emma', lastName: 'Thompson' } },
  { id: 'travel-4', purpose: 'Regional retail expansion site visit', destination: 'Munich, Germany', departureDate: '2025-01-28', returnDate: '2025-01-29', estimatedCost: 800, approvedCost: 800, status: 'approved', approverComment: 'Within budget', employeeId: 'emp-rmg-1', employee: { id: 'emp-rmg-1', firstName: 'Carlos', lastName: 'Rodriguez' } },
  { id: 'travel-5', purpose: 'Supply chain partner meeting', destination: 'Jakarta, Indonesia', departureDate: '2025-02-15', returnDate: '2025-02-18', estimatedCost: 3200, approvedCost: null, status: 'rejected', approverComment: 'Virtual meeting recommended instead', employeeId: 'emp-ltw-1', employee: { id: 'emp-ltw-1', firstName: 'Aiko', lastName: 'Tanaka' } },
];

// ==================== EXPENSES ====================
export const DEMO_EXPENSES = [
  { id: 'exp-1', type: 'travel', amount: 450, description: 'Flight to NYC for client meeting', receipt: 'receipt-flight-001.pdf', status: 'approved', approverComment: 'Approved', employeeId: 'emp-tcg-1', employee: { id: 'emp-tcg-1', firstName: 'Sarah', lastName: 'Johnson' } },
  { id: 'exp-2', type: 'meals', amount: 85, description: 'Team lunch for sprint planning', receipt: 'receipt-lunch-001.pdf', status: 'pending', approverComment: null, employeeId: 'emp-tcg-2', employee: { id: 'emp-tcg-2', firstName: 'Raj', lastName: 'Patel' } },
  { id: 'exp-3', type: 'equipment', amount: 250, description: 'External monitor for home office', receipt: 'receipt-monitor-001.pdf', status: 'pending', approverComment: null, employeeId: 'emp-tcg-3', employee: { id: 'emp-tcg-3', firstName: 'Emily', lastName: 'Chen' } },
  { id: 'exp-4', type: 'training', amount: 1200, description: 'AWS Certification exam fee', receipt: 'receipt-aws-001.pdf', status: 'approved', approverComment: 'Pre-approved L&D budget', employeeId: 'emp-tcg-1', employee: { id: 'emp-tcg-1', firstName: 'Sarah', lastName: 'Johnson' } },
  { id: 'exp-5', type: 'travel', amount: 600, description: 'Factory audit travel expenses', receipt: 'receipt-travel-002.pdf', status: 'rejected', approverComment: 'Exceeds per diem policy', employeeId: 'emp-mpi-1', employee: { id: 'emp-mpi-1', firstName: 'Priya', lastName: 'Sharma' } },
  { id: 'exp-6', type: 'office', amount: 150, description: 'Medical supplies for clinic', receipt: 'receipt-supplies-001.pdf', status: 'pending', approverComment: null, employeeId: 'emp-hfs-2', employee: { id: 'emp-hfs-2', firstName: 'Emma', lastName: 'Thompson' } },
];

// ==================== LEARNING ====================
export const DEMO_LEARNING = [
  { id: 'learn-1', courseName: 'AWS Solutions Architect', provider: 'Udemy', type: 'e_learning', status: 'in_progress', completedAt: null, score: null, certificate: null, employeeId: 'emp-tcg-1', employee: { id: 'emp-tcg-1', firstName: 'Sarah', lastName: 'Johnson' } },
  { id: 'learn-2', courseName: 'People Management Essentials', provider: 'LinkedIn Learning', type: 'e_learning', status: 'completed', completedAt: '2024-12-15', score: 92, certificate: 'cert-pm-001.pdf', employeeId: 'emp-tcg-2', employee: { id: 'emp-tcg-2', firstName: 'Raj', lastName: 'Patel' } },
  { id: 'learn-3', courseName: 'Design Systems Masterclass', provider: 'Coursera', type: 'e_learning', status: 'in_progress', completedAt: null, score: null, certificate: null, employeeId: 'emp-tcg-3', employee: { id: 'emp-tcg-3', firstName: 'Emily', lastName: 'Chen' } },
  { id: 'learn-4', courseName: 'Six Sigma Green Belt', provider: 'ASQ', type: 'certification', status: 'completed', completedAt: '2024-11-30', score: 88, certificate: 'cert-sixsigma-001.pdf', employeeId: 'emp-mpi-1', employee: { id: 'emp-mpi-1', firstName: 'Priya', lastName: 'Sharma' } },
  { id: 'learn-5', courseName: 'Advanced Cardiac Life Support', provider: 'AHA', type: 'certification', status: 'completed', completedAt: '2024-10-01', score: 95, certificate: 'cert-acls-001.pdf', employeeId: 'emp-hfs-1', employee: { id: 'emp-hfs-1', firstName: 'David', lastName: 'Wilson' } },
  { id: 'learn-6', courseName: 'Kubernetes Administration', provider: 'CNCF', type: 'certification', status: 'enrolled', completedAt: null, score: null, certificate: null, employeeId: 'emp-tcg-4', employee: { id: 'emp-tcg-4', firstName: 'Michael', lastName: 'Brown' } },
  { id: 'learn-7', courseName: 'Supply Chain Management', provider: 'edX', type: 'e_learning', status: 'in_progress', completedAt: null, score: null, certificate: null, employeeId: 'emp-ltw-2', employee: { id: 'emp-ltw-2', firstName: 'Wei', lastName: 'Lim' } },
  { id: 'learn-8', courseName: 'Fire Safety Training', provider: 'Internal', type: 'workshop', status: 'completed', completedAt: '2025-01-10', score: 100, certificate: null, employeeId: 'emp-mpi-4', employee: { id: 'emp-mpi-4', firstName: 'Neha', lastName: 'Gupta' } },
];

// ==================== TICKETS ====================
export const DEMO_TICKETS = [
  { id: 'ticket-1', subject: 'VPN connection failing', description: 'Unable to connect to VPN since this morning. Getting error code 691.', category: 'IT', priority: 'high', status: 'open', resolution: null, assignedTo: 'emp-tcg-6', employeeId: 'emp-tcg-1', employee: { id: 'emp-tcg-1', firstName: 'Sarah', lastName: 'Johnson' } },
  { id: 'ticket-2', subject: 'Payroll discrepancy for December', description: 'December payroll showing incorrect deductions for health insurance.', category: 'Payroll', priority: 'high', status: 'in_progress', resolution: null, assignedTo: 'emp-tcg-11', employeeId: 'emp-tcg-5', employee: { id: 'emp-tcg-5', firstName: 'Lisa', lastName: 'Anderson' } },
  { id: 'ticket-3', subject: 'New laptop request', description: 'Current laptop is 4 years old and running slow. Requesting upgrade.', category: 'IT', priority: 'medium', status: 'open', resolution: null, assignedTo: null, employeeId: 'emp-tcg-3', employee: { id: 'emp-tcg-3', firstName: 'Emily', lastName: 'Chen' } },
  { id: 'ticket-4', subject: 'Parking space allocation', description: 'Need a permanent parking spot at the Mumbai office.', category: 'Facilities', priority: 'low', status: 'resolved', resolution: 'Allocated Spot B-14', assignedTo: 'emp-mpi-7', employeeId: 'emp-mpi-1', employee: { id: 'emp-mpi-1', firstName: 'Priya', lastName: 'Sharma' } },
  { id: 'ticket-5', subject: 'Badge access not working', description: 'Building access badge not scanning at the main entrance.', category: 'IT', priority: 'urgent', status: 'open', resolution: null, assignedTo: 'emp-tcg-6', employeeId: 'emp-rmg-1', employee: { id: 'emp-rmg-1', firstName: 'Carlos', lastName: 'Rodriguez' } },
  { id: 'ticket-6', subject: 'Benefits enrollment question', description: 'Need help understanding the new dental plan options.', category: 'HR', priority: 'medium', status: 'resolved', resolution: 'Provided benefits comparison document', assignedTo: 'emp-tcg-2', employeeId: 'emp-tcg-4', employee: { id: 'emp-tcg-4', firstName: 'Michael', lastName: 'Brown' } },
  { id: 'ticket-7', subject: 'Safety equipment request', description: 'Need new PPE for the production floor.', category: 'Facilities', priority: 'high', status: 'in_progress', resolution: null, assignedTo: 'emp-mpi-4', employeeId: 'emp-mpi-5', employee: { id: 'emp-mpi-5', firstName: 'Suresh', lastName: 'Patil' } },
  { id: 'ticket-8', subject: 'E-learning platform access', description: 'Cannot log into the learning management system.', category: 'IT', priority: 'medium', status: 'resolved', resolution: 'Password reset and 2FA reconfigured', assignedTo: 'emp-tcg-6', employeeId: 'emp-ltw-2', employee: { id: 'emp-ltw-2', firstName: 'Wei', lastName: 'Lim' } },
];

// ==================== CLIENTS ====================
export const DEMO_CLIENTS = [
  { id: 'client-1', name: 'Acme Corp', email: 'hr@acme.com', phone: '+1-555-8001', clientCompany: 'Acme Corporation', industry: 'Technology', contractStart: '2024-01-01', contractEnd: '2025-12-31', status: 'active', companyId: 'comp-tcg' },
  { id: 'client-2', name: 'GlobalTech Inc', email: 'talent@globaltech.com', phone: '+1-555-8002', clientCompany: 'GlobalTech Inc', industry: 'Software', contractStart: '2024-06-01', contractEnd: '2025-05-31', status: 'active', companyId: 'comp-tcg' },
  { id: 'client-3', name: 'BuildRight Construction', email: 'hr@buildright.com', phone: '+91-555-8003', clientCompany: 'BuildRight', industry: 'Construction', contractStart: '2023-09-01', contractEnd: '2025-08-31', status: 'active', companyId: 'comp-mpi' },
  { id: 'client-4', name: 'MedSupply Global', email: 'contracts@medsupply.com', phone: '+44-555-8004', clientCompany: 'MedSupply Global', industry: 'Healthcare', contractStart: '2024-03-01', contractEnd: '2026-02-28', status: 'active', companyId: 'comp-hfs' },
  { id: 'client-5', name: 'EuroRetail Partners', email: 'partners@euroretail.de', phone: '+49-555-8005', clientCompany: 'EuroRetail Partners', industry: 'Retail', contractStart: '2024-01-15', contractEnd: '2025-12-31', status: 'active', companyId: 'comp-rmg' },
  { id: 'client-6', name: 'APAC Logistics Group', email: 'biz@apaclogistics.sg', phone: '+65-555-8006', clientCompany: 'APAC Logistics', industry: 'Logistics', contractStart: '2024-04-01', contractEnd: '2025-03-31', status: 'expired', companyId: 'comp-ltw' },
];

// ==================== VENDORS ====================
export const DEMO_VENDORS = [
  { id: 'vendor-1', name: 'TalentHunt Agency', email: 'info@talenthunt.com', phone: '+1-555-9001', vendorCompany: 'TalentHunt', serviceType: 'recruitment', status: 'active', rating: 4.5, companyId: 'comp-tcg', subVendors: [
    { id: 'subvendor-1', name: 'TalentHunt East', email: 'east@talenthunt.com', phone: '+1-555-9002', company: 'TalentHunt East', status: 'active', vendorId: 'vendor-1' },
    { id: 'subvendor-2', name: 'TalentHunt West', email: 'west@talenthunt.com', phone: '+1-555-9003', company: 'TalentHunt West', status: 'active', vendorId: 'vendor-1' },
  ]},
  { id: 'vendor-2', name: 'StaffPro Solutions', email: 'contact@staffpro.com', phone: '+1-555-9004', vendorCompany: 'StaffPro', serviceType: 'staffing', status: 'active', rating: 4.2, companyId: 'comp-tcg', subVendors: [
    { id: 'subvendor-3', name: 'StaffPro India', email: 'india@staffpro.com', phone: '+91-555-9005', company: 'StaffPro India', status: 'active', vendorId: 'vendor-2' },
  ]},
  { id: 'vendor-3', name: 'VerifyRight BGV', email: 'team@verifyright.com', phone: '+1-555-9006', vendorCompany: 'VerifyRight', serviceType: 'bgv', status: 'active', rating: 4.8, companyId: 'comp-tcg', subVendors: [] },
  { id: 'vendor-4', name: 'SafeWork Consultants', email: 'info@safework.com', phone: '+91-555-9007', vendorCompany: 'SafeWork', serviceType: 'compliance', status: 'active', rating: 4.6, companyId: 'comp-mpi', subVendors: [] },
  { id: 'vendor-5', name: 'MedEquip Services', email: 'supply@medequip.co.uk', phone: '+44-555-9008', vendorCompany: 'MedEquip', serviceType: 'equipment', status: 'active', rating: 4.3, companyId: 'comp-hfs', subVendors: [] },
];

// ==================== COMPLIANCE ====================
export const DEMO_COMPLIANCE = [
  { id: 'comp-1', title: 'Annual Fire Safety Audit', description: 'Complete annual fire safety audit for all offices', category: 'safety', dueDate: '2025-03-31', status: 'pending', assignee: 'Neha Gupta', companyId: 'comp-mpi' },
  { id: 'comp-2', title: 'GDPR Data Protection Review', description: 'Review and update data protection policies for EU operations', category: 'legal', dueDate: '2025-02-28', status: 'in_progress', assignee: 'Anna Mueller', companyId: 'comp-rmg' },
  { id: 'comp-3', title: 'ISO 27001 Certification Renewal', description: 'Renew ISO 27001 information security certification', category: 'certification', dueDate: '2025-06-30', status: 'pending', assignee: 'Michael Brown', companyId: 'comp-tcg' },
  { id: 'comp-4', title: 'CQC Compliance Check', description: 'Care Quality Commission compliance verification', category: 'regulatory', dueDate: '2025-04-15', status: 'pending', assignee: 'Emma Thompson', companyId: 'comp-hfs' },
  { id: 'comp-5', title: 'Employee Background Verification', description: 'Complete BGV for all employees hired in Q4 2024', category: 'hr', dueDate: '2025-02-15', status: 'completed', assignee: 'Sneha Reddy', companyId: 'comp-tcg' },
  { id: 'comp-6', title: 'Workplace Safety Training', description: 'Mandatory safety training for all factory workers', category: 'safety', dueDate: '2025-01-31', status: 'completed', assignee: 'Neha Gupta', companyId: 'comp-mpi' },
  { id: 'comp-7', title: 'Tax Compliance Filing', description: 'Annual tax compliance filing and review', category: 'finance', dueDate: '2025-04-30', status: 'pending', assignee: 'Meera Joshi', companyId: 'comp-tcg' },
];

// ==================== WORKFLOWS ====================
export const DEMO_WORKFLOWS = [
  { id: 'wf-1', name: 'Leave Approval Workflow', type: 'approval', entity: 'leave', description: 'Standard leave approval: Manager → HR', isActive: true, companyId: 'comp-tcg', steps: [
    { id: 'wf-step-1', name: 'Manager Approval', stepOrder: 0, approverRole: 'manager', approverType: 'role', autoApprove: false, action: 'approve_reject' },
    { id: 'wf-step-2', name: 'HR Review', stepOrder: 1, approverRole: 'hr', approverType: 'role', autoApprove: false, action: 'approve_reject' },
  ]},
  { id: 'wf-2', name: 'Expense Claim Approval', type: 'approval', entity: 'expense', description: 'Expense approval: Manager → Finance', isActive: true, companyId: 'comp-tcg', steps: [
    { id: 'wf-step-3', name: 'Manager Approval', stepOrder: 0, approverRole: 'manager', approverType: 'role', autoApprove: false, action: 'approve_reject' },
    { id: 'wf-step-4', name: 'Finance Approval', stepOrder: 1, approverRole: 'finance', approverType: 'role', autoApprove: false, action: 'approve_reject' },
  ]},
  { id: 'wf-3', name: 'Recruitment Pipeline', type: 'approval', entity: 'recruitment', description: 'HR Screening → Technical Interview → Offer', isActive: true, companyId: 'comp-tcg', steps: [
    { id: 'wf-step-5', name: 'HR Screening', stepOrder: 0, approverRole: 'hr', approverType: 'role', autoApprove: false, action: 'approve_reject' },
    { id: 'wf-step-6', name: 'Technical Interview', stepOrder: 1, approverRole: 'manager', approverType: 'role', autoApprove: false, action: 'approve_reject' },
    { id: 'wf-step-7', name: 'Offer Approval', stepOrder: 2, approverRole: 'admin', approverType: 'role', autoApprove: false, action: 'approve_reject' },
  ]},
];

// ==================== SURVEYS ====================
export const DEMO_SURVEYS = [
  { id: 'survey-1', title: 'Q1 2025 Employee Engagement Pulse', description: 'Quick pulse check on employee engagement and satisfaction', type: 'pulse', status: 'active', startDate: '2025-01-15', endDate: '2025-01-31', companyId: 'comp-tcg', questions: [
    { id: 'sq-1', question: 'How satisfied are you with your current role?', type: 'rating', options: null, required: true, order: 0 },
    { id: 'sq-2', question: 'Do you feel your work is recognized?', type: 'rating', options: null, required: true, order: 1 },
    { id: 'sq-3', question: 'How would you rate team collaboration?', type: 'rating', options: null, required: true, order: 2 },
    { id: 'sq-4', question: 'What can we improve?', type: 'text', options: null, required: false, order: 3 },
  ]},
  { id: 'survey-2', title: 'Workplace Safety Feedback', description: 'Safety culture and compliance feedback for factory workers', type: 'feedback', status: 'draft', startDate: null, endDate: null, companyId: 'comp-mpi', questions: [
    { id: 'sq-5', question: 'How safe do you feel at work?', type: 'rating', options: null, required: true, order: 0 },
    { id: 'sq-6', question: 'Are safety procedures clearly communicated?', type: 'mcq', options: 'Always,Mostly,Sometimes,Never', required: true, order: 1 },
  ]},
];

// ==================== SHIFTS ====================
export const DEMO_SHIFTS = [
  { id: 'shift-1', name: 'Morning Shift', startTime: '06:00', endTime: '14:00', breakMinutes: 30, isActive: true, companyId: 'comp-tcg' },
  { id: 'shift-2', name: 'General Shift', startTime: '09:00', endTime: '18:00', breakMinutes: 60, isActive: true, companyId: 'comp-tcg' },
  { id: 'shift-3', name: 'Night Shift', startTime: '22:00', endTime: '06:00', breakMinutes: 30, isActive: true, companyId: 'comp-mpi' },
  { id: 'shift-4', name: 'Factory Day Shift', startTime: '07:00', endTime: '15:00', breakMinutes: 45, isActive: true, companyId: 'comp-mpi' },
  { id: 'shift-5', name: 'Clinical Day Shift', startTime: '07:00', endTime: '19:00', breakMinutes: 60, isActive: true, companyId: 'comp-hfs' },
  { id: 'shift-6', name: 'Retail Morning', startTime: '08:00', endTime: '16:00', breakMinutes: 30, isActive: true, companyId: 'comp-rmg' },
  { id: 'shift-7', name: 'Retail Evening', startTime: '14:00', endTime: '22:00', breakMinutes: 30, isActive: true, companyId: 'comp-rmg' },
];

// ==================== ONBOARDING ====================
export const DEMO_ONBOARDING = [
  { id: 'onboard-1', title: 'IT Setup - Laptop & Access', description: 'Provision laptop, email, and system access', category: 'it', status: 'completed', dueDate: '2024-09-02', completedAt: '2024-09-01', assignedTo: 'IT Team', employeeId: 'emp-tcg-4', employee: { id: 'emp-tcg-4', firstName: 'Michael', lastName: 'Brown' } },
  { id: 'onboard-2', title: 'HR Orientation', description: 'Complete HR orientation and policy review', category: 'hr', status: 'completed', dueDate: '2024-09-03', completedAt: '2024-09-02', assignedTo: 'HR Team', employeeId: 'emp-tcg-4', employee: { id: 'emp-tcg-4', firstName: 'Michael', lastName: 'Brown' } },
  { id: 'onboard-3', title: 'Department Introduction', description: 'Meet the engineering team and review projects', category: 'department', status: 'in_progress', dueDate: '2024-09-10', completedAt: null, assignedTo: 'Engineering Manager', employeeId: 'emp-tcg-4', employee: { id: 'emp-tcg-4', firstName: 'Michael', lastName: 'Brown' } },
  { id: 'onboard-4', title: 'Safety Training', description: 'Complete mandatory workplace safety training', category: 'compliance', status: 'pending', dueDate: '2025-01-15', completedAt: null, assignedTo: 'Safety Officer', employeeId: 'emp-hfs-6', employee: { id: 'emp-hfs-6', firstName: 'Sarah', lastName: 'Mitchell' } },
  { id: 'onboard-5', title: 'Clinical Onboarding', description: 'Hospital orientation and clinical protocols review', category: 'department', status: 'in_progress', dueDate: '2025-01-20', completedAt: null, assignedTo: 'Clinical Lead', employeeId: 'emp-hfs-6', employee: { id: 'emp-hfs-6', firstName: 'Sarah', lastName: 'Mitchell' } },
  { id: 'onboard-6', title: 'IT Setup - Access Badge', description: 'Issue access badge and system credentials', category: 'it', status: 'pending', dueDate: '2025-01-12', completedAt: null, assignedTo: 'IT Team', employeeId: 'emp-ltw-4', employee: { id: 'emp-ltw-4', firstName: 'Siti', lastName: 'Rahman' } },
];

// ==================== NOTIFICATIONS ====================
export const DEMO_NOTIFICATIONS = [
  { id: 'notif-1', title: 'Leave Request Approved', message: 'Your casual leave request for Jan 22-23 has been approved by Raj Patel.', type: 'success', category: 'leave', isRead: false, actionUrl: '/leave', userId: 'demo-admin' },
  { id: 'notif-2', title: 'New Candidate Applied', message: 'Alex Turner has applied for Senior Full-Stack Developer position.', type: 'info', category: 'recruitment', isRead: false, actionUrl: '/recruitment', userId: 'demo-admin' },
  { id: 'notif-3', title: 'Payroll Processed', message: 'January 2025 payroll has been processed for TechCorp Global.', type: 'success', category: 'payroll', isRead: true, actionUrl: '/payroll', userId: 'demo-admin' },
  { id: 'notif-4', title: 'Interview Scheduled', message: 'Technical interview with Alex Turner scheduled for Jan 22 at 10:00 AM.', type: 'info', category: 'interview', isRead: false, actionUrl: '/ai_interview', userId: 'demo-admin' },
  { id: 'notif-5', title: 'Expense Claim Rejected', message: 'Your travel expense claim of $600 has been rejected. Reason: Exceeds per diem policy.', type: 'warning', category: 'expense', isRead: false, actionUrl: '/travel_expense', userId: 'demo-admin' },
  { id: 'notif-6', title: 'Goal Deadline Approaching', message: 'Your goal "Complete AWS Certification" is due in 7 days.', type: 'warning', category: 'goal', isRead: false, actionUrl: '/performance', userId: 'demo-admin' },
  { id: 'notif-7', title: 'Compliance Alert', message: 'GDPR Data Protection Review is overdue. Please take action.', type: 'error', category: 'compliance', isRead: false, actionUrl: '/compliance', userId: 'demo-admin' },
  { id: 'notif-8', title: 'New Ticket Assigned', message: 'Ticket #5 "Badge access not working" has been assigned to you.', type: 'info', category: 'helpdesk', isRead: true, actionUrl: '/helpdesk', userId: 'demo-admin' },
];

// ==================== AUDIT LOGS ====================
export const DEMO_AUDIT_LOGS = [
  { id: 'audit-1', action: 'CREATE', entity: 'Employee', entityId: 'emp-tcg-12', details: 'Created employee Sneha Reddy (TCG012)', userId: 'demo-admin', ipAddress: '192.168.1.100', createdAt: '2025-01-20T09:00:00' },
  { id: 'audit-2', action: 'UPDATE', entity: 'Leave', entityId: 'leave-1', details: 'Approved casual leave for Sarah Johnson', userId: 'demo-admin', ipAddress: '192.168.1.100', createdAt: '2025-01-20T09:15:00' },
  { id: 'audit-3', action: 'CREATE', entity: 'Job', entityId: 'job-tcg-1', details: 'Created job posting: Senior Full-Stack Developer', userId: 'demo-admin', ipAddress: '192.168.1.101', createdAt: '2025-01-19T14:00:00' },
  { id: 'audit-4', action: 'LOGIN', entity: 'User', entityId: 'demo-admin', details: 'Admin Nexus logged in', userId: 'demo-admin', ipAddress: '192.168.1.100', createdAt: '2025-01-20T08:30:00' },
  { id: 'audit-5', action: 'UPDATE', entity: 'Employee', entityId: 'emp-tcg-4', details: 'Updated employee Michael Brown - set probation end date', userId: 'demo-admin', ipAddress: '192.168.1.100', createdAt: '2025-01-19T16:00:00' },
  { id: 'audit-6', action: 'CREATE', entity: 'Interview', entityId: 'int-1', details: 'Scheduled technical interview with Alex Turner', userId: 'demo-admin', ipAddress: '192.168.1.101', createdAt: '2025-01-19T10:00:00' },
  { id: 'audit-7', action: 'DELETE', entity: 'Candidate', entityId: 'cand-old-1', details: 'Removed duplicate candidate record', userId: 'demo-admin', ipAddress: '192.168.1.100', createdAt: '2025-01-18T11:00:00' },
  { id: 'audit-8', action: 'UPDATE', entity: 'ExpenseClaim', entityId: 'exp-1', details: 'Approved travel expense claim for Sarah Johnson', userId: 'demo-admin', ipAddress: '192.168.1.100', createdAt: '2025-01-18T09:30:00' },
  { id: 'audit-9', action: 'CREATE', entity: 'Company', entityId: 'comp-rmg', details: 'Created company RetailMax Group', userId: 'demo-admin', ipAddress: '192.168.1.100', createdAt: '2025-01-15T08:00:00' },
  { id: 'audit-10', action: 'UPDATE', entity: 'Workflow', entityId: 'wf-1', details: 'Updated Leave Approval Workflow steps', userId: 'demo-admin', ipAddress: '192.168.1.101', createdAt: '2025-01-15T14:00:00' },
];

// ==================== ALUMNI ====================
export const DEMO_ALUMNI = [
  { id: 'alumni-1', exitReason: 'Better opportunity elsewhere', rehireEligible: true, alumniEmail: 'john.d.personal@email.com', joinedAlumniAt: '2024-12-01', employeeId: 'emp-old-1', employee: { id: 'emp-old-1', employeeId: 'TCG013', firstName: 'John', lastName: 'Doe', email: 'john.d@techcorp.com', designation: 'Junior Developer', status: 'inactive' } },
  { id: 'alumni-2', exitReason: 'Relocation to another country', rehireEligible: true, alumniEmail: 'maria.s.personal@email.com', joinedAlumniAt: '2024-11-15', employeeId: 'emp-old-2', employee: { id: 'emp-old-2', employeeId: 'MPI009', firstName: 'Maria', lastName: 'Santos', email: 'maria.s@manufactpro.com', designation: 'HR Coordinator', status: 'inactive' } },
  { id: 'alumni-3', exitReason: 'Termination - performance', rehireEligible: false, alumniEmail: 'tom.w.personal@email.com', joinedAlumniAt: '2024-10-01', employeeId: 'emp-old-3', employee: { id: 'emp-old-3', employeeId: 'HFS007', firstName: 'Tom', lastName: 'Williams', email: 'tom.w@healthfirst.com', designation: 'Lab Assistant', status: 'inactive' } },
];

// ==================== DASHBOARD STATS ====================
export const DEMO_DASHBOARD_STATS = {
  totalEmployees: 35,
  activeEmployees: 30,
  newHires: 3,
  openPositions: 8,
  attritionRate: 2.4,
  attendanceRate: 88,
  pendingApprovals: 5,
  departmentDistribution: [
    { name: 'Engineering', value: 680, color: '#059669' },
    { name: 'Sales', value: 420, color: '#f59e0b' },
    { name: 'Operations', value: 380, color: '#ef4444' },
    { name: 'HR', value: 150, color: '#8b5cf6' },
    { name: 'Finance', value: 120, color: '#06b6d4' },
    { name: 'Design', value: 90, color: '#f97316' },
    { name: 'Others', value: 610, color: '#6b7280' },
  ],
  recentActivities: [
    { id: 'ra-1', action: 'CREATE', entity: 'Employee', details: 'New employee Sneha Reddy onboarded (TCG012)', createdAt: '2025-01-20T09:00:00', user: { name: 'Admin Nexus', email: 'admin@nexushrms.com' } },
    { id: 'ra-2', action: 'UPDATE', entity: 'Leave', details: 'Leave request approved for Sarah Johnson', createdAt: '2025-01-20T09:15:00', user: { name: 'Raj Patel', email: 'raj.p@techcorp.com' } },
    { id: 'ra-3', action: 'CREATE', entity: 'Job', details: 'New job posting: Senior Full-Stack Developer', createdAt: '2025-01-19T14:00:00', user: { name: 'Sneha Reddy', email: 'sneha.r@techcorp.com' } },
    { id: 'ra-4', action: 'CREATE', entity: 'Interview', details: 'Interview scheduled with Alex Turner', createdAt: '2025-01-19T10:00:00', user: { name: 'Sneha Reddy', email: 'sneha.r@techcorp.com' } },
    { id: 'ra-5', action: 'UPDATE', entity: 'ExpenseClaim', details: 'Travel expense approved for Sarah Johnson ($450)', createdAt: '2025-01-18T09:30:00', user: { name: 'Raj Patel', email: 'raj.p@techcorp.com' } },
  ],
};
