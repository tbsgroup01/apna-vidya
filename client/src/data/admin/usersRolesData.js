export const initialAdminUsers = [
  {
    id: "USR-01",
    name: "Dr. Vikramaditya Sen",
    email: "vikram@apnavidya.com",
    role: "Super Admin",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    lastLogin: "2026-09-22 11:42",
    createdAt: "2025-01-10",
    phone: "+91 98111 22334"
  },
  {
    id: "USR-02",
    name: "Pooja Sharma",
    email: "pooja.s@apnavidya.com",
    role: "Admin",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    lastLogin: "2026-09-22 09:15",
    createdAt: "2025-02-15",
    phone: "+91 98222 33445"
  },
  {
    id: "USR-03",
    name: "Priya Malhotra",
    email: "priya.m@apnavidya.com",
    role: "Counsellor",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
    lastLogin: "2026-09-22 12:05",
    createdAt: "2025-04-10",
    phone: "+91 98333 44556"
  },
  {
    id: "USR-04",
    name: "Ramesh Aggarwal",
    email: "ramesh.a@apnavidya.com",
    role: "Accountant",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
    lastLogin: "2026-09-21 17:30",
    createdAt: "2025-03-01",
    phone: "+91 98444 55667"
  },
  {
    id: "USR-05",
    name: "Amitabh Roy",
    email: "amitabh.r@apnavidya.com",
    role: "Content Manager",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    lastLogin: "2026-09-20 14:10",
    createdAt: "2025-05-20",
    phone: "+91 98555 66778"
  },
  {
    id: "USR-06",
    name: "Sanjay Dixit",
    email: "sanjay.d@apnavidya.com",
    role: "Counsellor",
    status: "Disabled",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    lastLogin: "2026-08-15 10:00",
    createdAt: "2025-06-12",
    phone: "+91 98666 77889"
  }
];

export const initialRoles = [
  {
    id: "ROL-1",
    name: "Super Admin",
    description: "Full access to system configurations, billing, users and modules.",
    usersAssigned: 1,
    permissions: {
      dashboard: { view: true, create: true, edit: true, delete: true },
      leads: { view: true, create: true, edit: true, delete: true },
      students: { view: true, create: true, edit: true, delete: true },
      courses: { view: true, create: true, edit: true, delete: true },
      batches: { view: true, create: true, edit: true, delete: true },
      payments: { view: true, create: true, edit: true, delete: true },
      certificates: { view: true, create: true, edit: true, delete: true },
      blogs: { view: true, create: true, edit: true, delete: true },
      settings: { view: true, create: true, edit: true, delete: true }
    }
  },
  {
    id: "ROL-2",
    name: "Admin",
    description: "Management of courses, students, batches, leads and content without root billing settings.",
    usersAssigned: 1,
    permissions: {
      dashboard: { view: true, create: true, edit: true, delete: false },
      leads: { view: true, create: true, edit: true, delete: true },
      students: { view: true, create: true, edit: true, delete: false },
      courses: { view: true, create: true, edit: true, delete: false },
      batches: { view: true, create: true, edit: true, delete: false },
      payments: { view: true, create: false, edit: false, delete: false },
      certificates: { view: true, create: true, edit: true, delete: false },
      blogs: { view: true, create: true, edit: true, delete: true },
      settings: { view: true, create: false, edit: false, delete: false }
    }
  },
  {
    id: "ROL-3",
    name: "Counsellor",
    description: "Lead follow-up, student admissions, demo class schedule and inquiries.",
    usersAssigned: 2,
    permissions: {
      dashboard: { view: true, create: false, edit: false, delete: false },
      leads: { view: true, create: true, edit: true, delete: false },
      students: { view: true, create: true, edit: false, delete: false },
      courses: { view: true, create: false, edit: false, delete: false },
      batches: { view: true, create: false, edit: false, delete: false },
      payments: { view: false, create: false, edit: false, delete: false },
      certificates: { view: true, create: false, edit: false, delete: false },
      blogs: { view: false, create: false, edit: false, delete: false },
      settings: { view: false, create: false, edit: false, delete: false }
    }
  },
  {
    id: "ROL-4",
    name: "Accountant",
    description: "Fee records, payment gateways, receipts and financial audit tables.",
    usersAssigned: 1,
    permissions: {
      dashboard: { view: true, create: false, edit: false, delete: false },
      leads: { view: false, create: false, edit: false, delete: false },
      students: { view: true, create: false, edit: false, delete: false },
      courses: { view: true, create: false, edit: false, delete: false },
      batches: { view: true, create: false, edit: false, delete: false },
      payments: { view: true, create: true, edit: true, delete: false },
      certificates: { view: false, create: false, edit: false, delete: false },
      blogs: { view: false, create: false, edit: false, delete: false },
      settings: { view: false, create: false, edit: false, delete: false }
    }
  },
  {
    id: "ROL-5",
    name: "Content Manager",
    description: "Blogs, course descriptions, hero sliders and site notifications.",
    usersAssigned: 1,
    permissions: {
      dashboard: { view: true, create: false, edit: false, delete: false },
      leads: { view: false, create: false, edit: false, delete: false },
      students: { view: false, create: false, edit: false, delete: false },
      courses: { view: true, create: false, edit: true, delete: false },
      batches: { view: false, create: false, edit: false, delete: false },
      payments: { view: false, create: false, edit: false, delete: false },
      certificates: { view: false, create: false, edit: false, delete: false },
      blogs: { view: true, create: true, edit: true, delete: true },
      settings: { view: false, create: false, edit: false, delete: false }
    }
  }
];

export const initialActivityLogs = [
  {
    id: "LOG-5001",
    admin: "Dr. Vikramaditya Sen",
    action: "Published New Course",
    module: "Courses",
    description: "Created and published 'Full Stack Web Development' (CRS-101)",
    ip: "103.21.144.20",
    date: "2026-09-22",
    time: "11:42 AM"
  },
  {
    id: "LOG-5002",
    admin: "Ramesh Aggarwal",
    action: "Recorded Payment",
    module: "Payments",
    description: "Approved payment receipt PAY-10892 for student Aman Singhania (₹16,000)",
    ip: "182.72.10.45",
    date: "2026-09-22",
    time: "10:15 AM"
  },
  {
    id: "LOG-5003",
    admin: "Priya Malhotra",
    action: "Updated Lead Status",
    module: "Leads",
    description: "Moved lead LD-1004 (Meera Krishnan) to 'Converted'",
    ip: "122.161.88.9",
    date: "2026-09-21",
    time: "04:30 PM"
  },
  {
    id: "LOG-5004",
    admin: "Amitabh Roy",
    action: "Scheduled Blog Post",
    module: "Blogs",
    description: "Scheduled blog 'Generative AI & LLMs in Production' for Sep 25",
    ip: "103.24.12.78",
    date: "2026-09-21",
    time: "02:10 PM"
  },
  {
    id: "LOG-5005",
    admin: "Dr. Vikramaditya Sen",
    action: "Issued Digital Certificate",
    module: "Certificates",
    description: "Generated and digitally signed certificate AV-2025-0842",
    ip: "103.21.144.20",
    date: "2026-09-20",
    time: "05:18 PM"
  },
  {
    id: "LOG-5006",
    admin: "Pooja Sharma",
    action: "Created Batch Schedule",
    module: "Batches",
    description: "Added upcoming batch FS-OCT-26 with capacity of 45 seats",
    ip: "115.111.90.14",
    date: "2026-09-19",
    time: "01:25 PM"
  }
];
