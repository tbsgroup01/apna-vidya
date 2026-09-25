const { sequelize } = require("./db");
const Role = require("../models/Role");
const Permission = require("../models/Permission");
const RolePermission = require("../models/RolePermission");
const User = require("../models/User");
const Lead = require("../models/Lead");
const LeadNote = require("../models/LeadNote");
const LeadActivity = require("../models/LeadActivity");
const Student = require("../models/Student");
const StudentCourse = require("../models/StudentCourse");
const StudentBatch = require("../models/StudentBatch");
const CourseCategory = require("../models/CourseCategory");
const Course = require("../models/Course");
const CourseModule = require("../models/CourseModule");
const CourseLesson = require("../models/CourseLesson");
const Batch = require("../models/Batch");
const CourseMaterial = require("../models/CourseMaterial");
const Syllabus = require("../models/Syllabus");
const Award = require("../models/Award");
const Blog = require("../models/Blog");
const HeroSlider = require("../models/HeroSlider");
const AboutContent = require("../models/AboutContent");
const { DEFAULT_ABOUT } = require("../controllers/aboutController");
const PlatformSetting = require("../models/PlatformSetting");
const { DEFAULT_SETTINGS } = require("../controllers/settingController");

User.belongsTo(Role, { foreignKey: "roleId", as: "role" });
Role.hasMany(User, { foreignKey: "roleId", as: "users" });

Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: "roleId",
  otherKey: "permissionId",
  as: "permissions",
});

Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: "permissionId",
  otherKey: "roleId",
  as: "roles",
});

Lead.hasMany(LeadNote, { foreignKey: "leadId", as: "notes", onDelete: "CASCADE" });
LeadNote.belongsTo(Lead, { foreignKey: "leadId", as: "lead" });

Lead.hasMany(LeadActivity, { foreignKey: "leadId", as: "timeline", onDelete: "CASCADE" });
LeadActivity.belongsTo(Lead, { foreignKey: "leadId", as: "lead" });

CourseCategory.hasMany(Course, { foreignKey: "categoryId", as: "courses" });
Course.belongsTo(CourseCategory, { foreignKey: "categoryId", as: "category" });

Course.hasMany(CourseModule, { foreignKey: "courseId", as: "modules", onDelete: "CASCADE" });
CourseModule.belongsTo(Course, { foreignKey: "courseId", as: "course" });

CourseModule.hasMany(CourseLesson, { foreignKey: "moduleId", as: "lessons", onDelete: "CASCADE" });
CourseLesson.belongsTo(CourseModule, { foreignKey: "moduleId", as: "module" });

Course.hasMany(Batch, { foreignKey: "courseId", as: "batches" });
Batch.belongsTo(Course, { foreignKey: "courseId", as: "course" });

Student.belongsToMany(Course, {
  through: StudentCourse,
  foreignKey: "studentId",
  otherKey: "courseId",
  as: "enrolledCourses",
});
Course.belongsToMany(Student, {
  through: StudentCourse,
  foreignKey: "courseId",
  otherKey: "studentId",
  as: "enrolledStudents",
});

Student.belongsToMany(Batch, {
  through: StudentBatch,
  foreignKey: "studentId",
  otherKey: "batchId",
  as: "enrolledBatches",
});
Batch.belongsToMany(Student, {
  through: StudentBatch,
  foreignKey: "batchId",
  otherKey: "studentId",
  as: "batchStudents",
});

Course.hasMany(CourseMaterial, { foreignKey: "courseId", as: "materials" });
CourseMaterial.belongsTo(Course, { foreignKey: "courseId", as: "course" });

CourseModule.hasMany(CourseMaterial, { foreignKey: "moduleId", as: "materials", onDelete: "SET NULL" });
CourseMaterial.belongsTo(CourseModule, { foreignKey: "moduleId", as: "module" });

Course.hasMany(Syllabus, { foreignKey: "courseId", as: "syllabusList" });
Syllabus.belongsTo(Course, { foreignKey: "courseId", as: "course" });

const defaultRoles = [
  {
    name: "Super Admin",
    description: "Complete system access and privilege management",
  },
  {
    name: "Admin",
    description: "Institutional management and academic operations",
  },
  {
    name: "Counsellor",
    description: "Lead pipeline, student inquiries, and admissions guidance",
  },
  {
    name: "Accountant",
    description: "Tuition fee collections, invoices, and transaction audits",
  },
  {
    name: "Content Manager",
    description: "Course catalogs, blog articles, and portal content management",
  },
  {
    name: "Student",
    description: "Enrolled learner with access to courses, materials, schedules, and certificates",
  },
];

const defaultPermissions = [
  { name: "dashboard.view", module: "Dashboard", description: "View analytics dashboard" },
  { name: "leads.view", module: "Leads", description: "View lead inquiries" },
  { name: "leads.create", module: "Leads", description: "Create and assign leads" },
  { name: "leads.edit", module: "Leads", description: "Update lead status and notes" },
  { name: "leads.delete", module: "Leads", description: "Delete leads" },
  { name: "students.view", module: "Students", description: "View enrolled student profiles" },
  { name: "students.create", module: "Students", description: "Enroll new students" },
  { name: "students.edit", module: "Students", description: "Update student details" },
  { name: "students.delete", module: "Students", description: "Archive or delete students" },
  { name: "courses.view", module: "Courses", description: "Browse course programs" },
  { name: "courses.create", module: "Courses", description: "Publish new course programs" },
  { name: "courses.edit", module: "Courses", description: "Edit course curriculum and fees" },
  { name: "courses.delete", module: "Courses", description: "Delete course programs" },
  { name: "batches.view", module: "Batches", description: "View active learning batches" },
  { name: "batches.create", module: "Batches", description: "Schedule new batches" },
  { name: "batches.edit", module: "Batches", description: "Modify batch schedule and trainers" },
  { name: "batches.delete", module: "Batches", description: "Cancel or remove batches" },
  { name: "materials.view", module: "Materials", description: "Browse course materials" },
  { name: "materials.create", module: "Materials", description: "Upload course materials" },
  { name: "materials.edit", module: "Materials", description: "Edit course materials" },
  { name: "materials.delete", module: "Materials", description: "Delete course materials" },
  { name: "syllabus.view", module: "Syllabus", description: "View syllabus documents" },
  { name: "syllabus.create", module: "Syllabus", description: "Upload syllabus documents" },
  { name: "syllabus.edit", module: "Syllabus", description: "Update syllabus documents" },
  { name: "syllabus.delete", module: "Syllabus", description: "Delete syllabus documents" },
  { name: "payments.view", module: "Payments", description: "View financial payment records" },
  { name: "payments.create", module: "Payments", description: "Record offline or custom payments" },
  { name: "payments.refund", module: "Payments", description: "Initiate fee refunds" },
  { name: "content.view", module: "Content", description: "View CMS content and blogs" },
  { name: "content.create", module: "Content", description: "Create blog posts and sliders" },
  { name: "content.edit", module: "Content", description: "Update blogs and homepage banners" },
  { name: "content.delete", module: "Content", description: "Delete blog posts and sliders" },
  { name: "settings.view", module: "Settings", description: "View system configurations" },
  { name: "settings.edit", module: "Settings", description: "Update institutional settings" },
  { name: "users.manage", module: "Users", description: "Create and manage staff accounts" },
  { name: "certificates.view", module: "Certificates", description: "View institutional awards and certificates" },
  { name: "certificates.create", module: "Certificates", description: "Add new institutional award or certificate" },
  { name: "certificates.edit", module: "Certificates", description: "Edit institutional awards and certificates" },
  { name: "certificates.delete", module: "Certificates", description: "Delete institutional awards" },
];

const seedDatabase = async () => {
  const roleMap = {};
  for (const roleDef of defaultRoles) {
    const [role] = await Role.findOrCreate({
      where: { name: roleDef.name },
      defaults: roleDef,
    });
    roleMap[role.name] = role;
  }

  const permMap = {};
  for (const permDef of defaultPermissions) {
    const [perm] = await Permission.findOrCreate({
      where: { name: permDef.name },
      defaults: permDef,
    });
    permMap[perm.name] = perm;
  }

  const superAdminRole = roleMap["Super Admin"];
  const allPerms = Object.values(permMap);
  if (superAdminRole && allPerms.length > 0) {
    await superAdminRole.setPermissions(allPerms);
  }

  const adminRole = roleMap["Admin"];
  if (adminRole) {
    const adminPerms = allPerms.filter((p) => p.name !== "users.manage");
    await adminRole.setPermissions(adminPerms);
  }

  const counsellorRole = roleMap["Counsellor"];
  if (counsellorRole) {
    const counsellorPerms = allPerms.filter(
      (p) =>
        p.name.startsWith("leads.") ||
        p.name === "students.view" ||
        p.name === "courses.view" ||
        p.name === "dashboard.view"
    );
    await counsellorRole.setPermissions(counsellorPerms);
  }

  const accountantRole = roleMap["Accountant"];
  if (accountantRole) {
    const accountantPerms = allPerms.filter(
      (p) =>
        p.name.startsWith("payments.") ||
        p.name === "students.view" ||
        p.name === "dashboard.view"
    );
    await accountantRole.setPermissions(accountantPerms);
  }

  const contentRole = roleMap["Content Manager"];
  if (contentRole) {
    const contentPerms = allPerms.filter(
      (p) =>
        p.name.startsWith("content.") ||
        p.name.startsWith("materials.") ||
        p.name.startsWith("syllabus.") ||
        p.name === "courses.view" ||
        p.name === "dashboard.view"
    );
    await contentRole.setPermissions(contentPerms);
  }

  const studentRole = roleMap["Student"];
  if (studentRole) {
    const studentPerms = allPerms.filter(
      (p) =>
        p.name === "courses.view" ||
        p.name === "batches.view" ||
        p.name === "materials.view" ||
        p.name === "syllabus.view" ||
        p.name === "content.view"
    );
    await studentRole.setPermissions(studentPerms);
  }

  const superAdminEmail = process.env.SUPERADMIN_EMAIL || "admin@apnavidya.com";
  const existingSuperAdmin = await User.findOne({ where: { email: superAdminEmail } });

  if (!existingSuperAdmin && superAdminRole) {
    await User.create({
      name: process.env.SUPERADMIN_NAME || "Super Admin",
      email: superAdminEmail,
      phone: "+91 98765 43210",
      password: process.env.SUPERADMIN_PASSWORD || "Admin@12345",
      roleId: superAdminRole.id,
      status: "Active",
      profileImage:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    });
    console.log(`Initial Super Admin created: ${superAdminEmail}`);
  }

  const studentEmail = "student@apnavidya.com";
  const existingStudent = await User.findOne({ where: { email: studentEmail } });

  if (!existingStudent && studentRole) {
    await User.create({
      name: "Rahul Sharma",
      email: studentEmail,
      phone: "+91 98711 22334",
      password: "Student@12345",
      roleId: studentRole.id,
      status: "Active",
      profileImage:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    });
    console.log(`Initial Student created: ${studentEmail}`);
  }

  const catCount = await CourseCategory.count();
  if (catCount === 0) {
    const webCat = await CourseCategory.create({
      name: "Web Development",
      slug: "web-development",
      description: "Full Stack, Frontend, Backend & API Engineering Programs",
      icon: "Code2",
    });
    const dataCat = await CourseCategory.create({
      name: "Data Science & AI",
      slug: "data-science-ai",
      description: "Machine Learning, Artificial Intelligence, and Big Data Analytics",
      icon: "Brain",
    });
    const appCat = await CourseCategory.create({
      name: "Mobile App Development",
      slug: "mobile-development",
      description: "Cross-platform mobile apps using Flutter and React Native",
      icon: "Smartphone",
    });

    const mernCourse = await Course.create({
      name: "Full Stack Web Development",
      slug: "full-stack-web-development",
      description: "Master modern web development with React, Node.js, Express, and MySQL.",
      image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=800&q=80",
      duration: "6 Months",
      level: "Intermediate",
      fees: 32000,
      categoryId: webCat.id,
      status: "Active",
      featured: true,
    });

    const dsCourse = await Course.create({
      name: "Data Science & AI",
      slug: "data-science-and-ai",
      description: "Master Data Analysis, Python, Machine Learning Models, and Deep Learning.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      duration: "7 Months",
      level: "All Levels",
      fees: 38000,
      categoryId: dataCat.id,
      status: "Active",
      featured: true,
    });

    const mod1 = await CourseModule.create({
      courseId: mernCourse.id,
      title: "Module 1: Modern Frontend & Responsive Design",
      duration: "4 Weeks",
      orderIndex: 1,
    });
    const mod2 = await CourseModule.create({
      courseId: mernCourse.id,
      title: "Module 2: Advanced React, State & Single Page Apps",
      duration: "5 Weeks",
      orderIndex: 2,
    });
    const mod3 = await CourseModule.create({
      courseId: mernCourse.id,
      title: "Module 3: Backend REST APIs & Sequelize ORM",
      duration: "5 Weeks",
      orderIndex: 3,
    });

    await CourseLesson.create({
      moduleId: mod1.id,
      title: "HTML5 Semantic Standards & Responsive CSS",
      duration: "45 mins",
      type: "Video",
      orderIndex: 1,
    });
    await CourseLesson.create({
      moduleId: mod1.id,
      title: "CSS Flexbox, Grid & Tailwind CSS Architecture",
      duration: "60 mins",
      type: "Video",
      orderIndex: 2,
    });
    await CourseLesson.create({
      moduleId: mod2.id,
      title: "React Components, Custom Hooks & State Flow",
      duration: "75 mins",
      type: "Live Class",
      orderIndex: 1,
    });
    await CourseLesson.create({
      moduleId: mod3.id,
      title: "Express.js Routing, Middleware & Error Handlers",
      duration: "60 mins",
      type: "Video",
      orderIndex: 1,
    });
    await CourseLesson.create({
      moduleId: mod3.id,
      title: "JWT Authentication, Cookies & Password Hashing",
      duration: "90 mins",
      type: "Live Class",
      orderIndex: 2,
    });

    const b1 = await Batch.create({
      name: "FS-JUL-26 (Weekend Live)",
      courseId: mernCourse.id,
      trainer: "Dr. Vikramaditya Sen",
      startDate: "2026-07-04",
      endDate: "2026-12-28",
      startTime: "10:00 AM",
      endTime: "01:00 PM",
      days: "Sat, Sun",
      capacity: 40,
      enrolledCount: 1,
      status: "Active",
      meetLink: "https://meet.apnavidya.com/fs-jul-26",
    });

    const b2 = await Batch.create({
      name: "DS-AUG-26 (Evening Track)",
      courseId: dsCourse.id,
      trainer: "Er. Neha Kashyap",
      startDate: "2026-08-10",
      endDate: "2027-03-15",
      startTime: "07:30 PM",
      endTime: "09:30 PM",
      days: "Mon, Wed, Fri",
      capacity: 35,
      enrolledCount: 1,
      status: "Active",
      meetLink: "https://meet.apnavidya.com/ds-aug-26",
    });

    const stu1 = await Student.create({
      name: "Rahul Sharma",
      email: "student@apnavidya.com",
      phone: "+91 98711 22334",
      dob: "2002-05-14",
      gender: "Male",
      address: "B-42, Sector 62, Noida, UP - 201301",
      profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      admissionDate: "2026-07-02",
      status: "Active",
      totalFees: 32000,
      paidFees: 32000,
      pendingFees: 0,
      paymentStatus: "Paid",
      attendance: 94,
      notes: "Top performer in capstone module.",
    });

    const stu2 = await Student.create({
      name: "Rhea Deshmukh",
      email: "rhea.d@gmail.com",
      phone: "+91 97654 32190",
      dob: "2003-11-20",
      gender: "Female",
      address: "Flat 402, Green Glen Layout, Bellandur, Bengaluru",
      profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
      admissionDate: "2026-08-10",
      status: "Active",
      totalFees: 38000,
      paidFees: 20000,
      pendingFees: 18000,
      paymentStatus: "Partial",
      attendance: 88,
      notes: "Second installment scheduled for next month.",
    });

    await StudentCourse.create({ studentId: stu1.id, courseId: mernCourse.id });
    await StudentBatch.create({ studentId: stu1.id, batchId: b1.id });
    await StudentCourse.create({ studentId: stu2.id, courseId: dsCourse.id });
    await StudentBatch.create({ studentId: stu2.id, batchId: b2.id });

    const l1 = await Lead.create({
      name: "Aarav Sharma",
      phone: "+91 98765 43210",
      email: "aarav.sharma@gmail.com",
      course: "Full Stack Web Development",
      source: "Demo Class",
      status: "Interested",
      assignedTo: "Priya Malhotra",
      city: "New Delhi",
      qualification: "B.Tech CSE (3rd Year)",
    });

    await LeadNote.create({
      leadId: l1.id,
      author: "Priya Malhotra",
      text: "Attended demo class. Highly impressed with React live coding module.",
    });
    await LeadActivity.create({
      leadId: l1.id,
      action: "Lead Created",
      detail: "Registered via free demo booking modal",
    });
    await LeadActivity.create({
      leadId: l1.id,
      action: "Contacted",
      detail: "Introductory WhatsApp info pack sent",
    });

    const l2 = await Lead.create({
      name: "Sneha Mukherjee",
      phone: "+91 98234 56789",
      email: "sneha.m@outlook.com",
      course: "Data Science & AI",
      source: "Course Enquiry",
      status: "New",
      assignedTo: "Rahul Sen",
      city: "Kolkata",
      qualification: "B.Sc Statistics",
    });
    await LeadActivity.create({
      leadId: l2.id,
      action: "Lead Created",
      detail: "Form submission on Course Details page",
    });

    const l3 = await Lead.create({
      name: "Vikram Chauhan",
      phone: "+91 97123 45678",
      email: "vikram.chauhan@gmail.com",
      course: "Full Stack Web Development",
      source: "Contact Form",
      status: "Follow-up",
      assignedTo: "Priya Malhotra",
      city: "Jaipur",
      qualification: "BCA Graduate",
    });
    await LeadNote.create({
      leadId: l3.id,
      author: "Priya Malhotra",
      text: "Wants weekend batch due to ongoing internship.",
    });
    await LeadActivity.create({
      leadId: l3.id,
      action: "Lead Created",
      detail: "Contact inquiry regarding batch timings",
    });

    await CourseMaterial.create({
      title: "React 19 Complete Architecture & Hooks CheatSheet",
      courseId: mernCourse.id,
      moduleId: mod2.id,
      description: "Quick reference guide for React 19 server actions and client hooks.",
      file: "https://documents.apnavidya.com/materials/react19-cheatsheet.pdf",
      fileType: "PDF Document",
      fileSize: "4.8 MB",
      uploadedBy: "Dr. Vikramaditya Sen",
      downloadsCount: 1420,
      status: "Published",
      visibility: "Enrolled Students",
    });

    await CourseMaterial.create({
      title: "Node.js & MySQL Production Capstone Starter Repo",
      courseId: mernCourse.id,
      moduleId: mod3.id,
      description: "Production template featuring Sequelize ORM, JWT, and cookies.",
      file: "https://github.com/apnavidya/mern-capstone-starter",
      fileType: "Source Code Archive",
      fileSize: "18.2 MB",
      uploadedBy: "Rahul Verma",
      downloadsCount: 890,
      status: "Published",
      visibility: "Enrolled Students",
    });

    await Syllabus.create({
      courseId: mernCourse.id,
      title: "Full Stack Web Development Curriculum v4.3",
      pdf: "https://documents.apnavidya.com/syllabus/mern-syllabus-v4.pdf",
      version: "v4.3",
      fileSize: "3.5 MB",
      downloadsCount: 3850,
      status: "Active",
    });

    await Syllabus.create({
      courseId: dsCourse.id,
      title: "Data Science & AI Complete Master Syllabus v3.1",
      pdf: "https://documents.apnavidya.com/syllabus/ds-ai-syllabus-v3.pdf",
      version: "v3.1",
      fileSize: "4.1 MB",
      downloadsCount: 2210,
      status: "Active",
    });
  }

  const awardCount = await Award.count();
  if (awardCount === 0) {
    await Award.create({
      title: "ISO 9001:2015 Quality Management Standard",
      issuer: "Bureau Veritas Certification",
      category: "Quality Standard",
      year: "2024 - 2027",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80",
      verificationUrl: "https://cert.bureauveritas.com/verify/ISO-9001-APNAVIDYA",
      description: "Internationally recognized certification for premier tech pedagogy, continuous curriculum review, and learning outcome excellence.",
      status: "Active",
      featured: true,
      orderIndex: 1,
    });
    await Award.create({
      title: "National EdTech Excellence Award 2025",
      issuer: "Confederation of Indian Industry (CII)",
      category: "Excellence Award",
      year: "2025",
      image: "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&w=600&q=80",
      verificationUrl: "https://cii.in/awards/edtech-2025-winners",
      description: "Conferred for exceptional career transformation rates, industry-aligned live projects, and dedicated placement support.",
      status: "Active",
      featured: true,
      orderIndex: 2,
    });
    await Award.create({
      title: "Authorized Training Partner & Assessment Center",
      issuer: "NASSCOM FutureSkills Prime",
      category: "Industry Partnership",
      year: "2024 - 2026",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80",
      verificationUrl: "https://futureskillsprime.in/partners/apna-vidya",
      description: "Accredited institutional partner for delivery of certified competencies in Cloud Architecture, AI, and Full Stack Engineering.",
      status: "Active",
      featured: true,
      orderIndex: 3,
    });
    await Award.create({
      title: "Recognized Startup India Innovation Laureate",
      issuer: "DPIIT, Ministry of Commerce & Industry",
      category: "Accreditation",
      year: "2023 - Present",
      image: "https://images.unsplash.com/photo-1569098644584-210bcd375b59?auto=format&fit=crop&w=600&q=80",
      verificationUrl: "https://www.startupindia.gov.in/recognition/DPIIT98412",
      description: "National initiative recognition honoring scalable technical upskilling and rural digital empowerment.",
      status: "Active",
      featured: true,
      orderIndex: 4,
    });
  }

  const blogCount = await Blog.count();
  if (blogCount === 0) {
    await Blog.create({
      title: "Top 10 Full-Stack Web Development Trends in 2026",
      slug: "top-10-web-development-trends-2026",
      category: "Technology",
      author: "Dr. Vikramaditya Sen",
      authorRole: "Chief Academic Officer",
      publishedDate: new Date().toISOString().split("T")[0],
      readTime: "5 min read",
      featuredImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
      excerpt: "From Next.js Server Actions and edge functions to autonomous coding assistants, explore the architectural patterns defining modern web software engineering.",
      content: "<h2>The Next Evolution of Web Software</h2><p>Modern web development has transitioned rapidly from heavy client-side rendering toward streamlined edge runtimes, progressive hydration, and modular serverless backends. Understanding these shifts separates junior builders from senior architectural leaders.</p><h3>1. Edge Computing & Hybrid Hydration</h3><p>Server-side execution close to the client eliminates geographic latency. Applications now serve pre-rendered HTML shells instantly while dynamic micro-states load asynchronously.</p><h3>2. AI-Assisted Development Workflows</h3><p>Engineers leveraging autonomous agents, schema-driven scaffolding, and automated unit test generation ship production code up to 4x faster with fewer regression errors.</p><blockquote>The competitive differentiator for developers is no longer merely writing syntax, but architecting robust data flow, validation pipelines, and resilient state machines.</blockquote><p>At Apna Vidya, our curriculum directly mirrors these production realities with live capstone repositories.</p>",
      tags: "WebDev, React, NextJS, Cloud",
      status: "Published",
      featured: true,
      views: 1420,
      seoTitle: "Top 10 Full-Stack Web Development Trends in 2026 | Apna Vidya",
      seoDescription: "Explore the most influential engineering trends shaping the web development landscape in 2026.",
    });

    await Blog.create({
      title: "How to Crack Your First High-Paying Software Engineering Job",
      slug: "how-to-crack-first-software-job",
      category: "Career Guide",
      author: "Neha Kashyap",
      authorRole: "Lead Career Strategist",
      publishedDate: new Date().toISOString().split("T")[0],
      readTime: "6 min read",
      featuredImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
      excerpt: "A practical blueprint covering system design fundamentals, production-ready portfolio projects, and behavioral interview mastery.",
      content: "<h2>Demystifying the Tech Hiring Pipeline</h2><p>Landing an entry-to-mid level engineering role in today's market requires more than passing boilerplate algorithmic quizzes. Hiring managers seek demonstrable proof of real-world software craft.</p><h3>Key Pillars of a Winning Candidacy</h3><ul><li><strong>Production-Grade GitHub Repositories:</strong> Deploy live applications with comprehensive README documentation, CI/CD pipelines, and authentication.</li><li><strong>Clean Database Schemas:</strong> Demonstrate proficiency in normalization, relational indexes, and ORM query optimization.</li><li><strong>Effective Communication:</strong> Articulate architectural trade-offs during live technical rounds.</li></ul><p>Focus on depth over breadth: master one modern stack completely rather than sampling five superficially.</p>",
      tags: "Career, Interviews, Placement, TechJobs",
      status: "Published",
      featured: false,
      views: 980,
      seoTitle: "How to Crack Your First Software Job | Career Guide",
      seoDescription: "Learn proven strategies to land high-paying software developer roles with portfolio and interview prep.",
    });

    await Blog.create({
      title: "Mastering Modern Data Science & AI: A Complete Roadmap",
      slug: "roadmap-to-mastering-data-science-ai",
      category: "Artificial Intelligence",
      author: "Aman Verma",
      authorRole: "Principal Data Scientist",
      publishedDate: new Date().toISOString().split("T")[0],
      readTime: "7 min read",
      featuredImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      excerpt: "Step-by-step guidance on Python mathematics, feature engineering, neural network architectures, and production LLM orchestration.",
      content: "<h2>The Convergence of Data Engineering and AI</h2><p>Artificial Intelligence has evolved from theoretical academic models into accessible production infrastructure. Building enduring AI applications requires strong data foundations.</p><h3>Phase 1: Mathematical & Computational Foundations</h3><p>Establish fluency in linear algebra, multivariable calculus, probability, and vectorized data structures with Python and NumPy.</p><h3>Phase 2: Machine Learning to Deep Learning</h3><p>Progress from regression and decision forests to convolutional and transformer neural networks using PyTorch.</p><h3>Phase 3: LLMs & Retrieval Augmented Generation (RAG)</h3><p>Implement vector embeddings, semantic search caches, and orchestration pipelines to build intelligent enterprise solutions.</p>",
      tags: "DataScience, AI, MachineLearning, Python",
      status: "Published",
      featured: false,
      views: 820,
      seoTitle: "Data Science and AI Complete Roadmap | Apna Vidya",
      seoDescription: "Step-by-step career path to becoming a proficient Data Scientist and Machine Learning engineer.",
    });
  }

  const sliderCount = await HeroSlider.count();
  if (sliderCount === 0) {
    await HeroSlider.create({
      title: "Master Software Engineering with 1-on-1 Live Mentorship",
      subtitle: "From Zero to Full Stack Developer with Industry Projects",
      description: "Build real production applications and land your dream software job with our structured 2026 curriculum.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
      buttonText: "Explore Courses",
      buttonUrl: "/courses",
      secondaryButtonText: "Book a Demo Class",
      secondaryButtonUrl: "/demo-class",
      displayOrder: 1,
      startDate: new Date().toISOString().split("T")[0],
      endDate: "2026-12-31",
      status: "Active",
    });

    await HeroSlider.create({
      title: "Weekend Batch Admissions Now Open for Working Professionals",
      subtitle: "Upgrade your tech stack without quitting your current job",
      description: "Evening and weekend live sessions designed specifically for working individuals seeking high-growth tech transitions.",
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
      buttonText: "Book Free Demo",
      buttonUrl: "/demo-class",
      secondaryButtonText: "View Curriculum",
      secondaryButtonUrl: "/syllabus",
      displayOrder: 2,
      startDate: new Date().toISOString().split("T")[0],
      endDate: "2026-10-31",
      status: "Active",
    });

    await HeroSlider.create({
      title: "Diwali Special Scholarship Program: Up to 40% Off",
      subtitle: "Limited seats available across all certified courses",
      description: "Take the test, qualify for early-bird admission vouchers, and start learning with India's highest-rated mentors.",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
      buttonText: "Claim Scholarship",
      buttonUrl: "/courses",
      secondaryButtonText: "Contact Admissions",
      secondaryButtonUrl: "/contact",
      displayOrder: 3,
      startDate: new Date().toISOString().split("T")[0],
      endDate: "2026-11-05",
      status: "Draft",
    });
  }

  const aboutCount = await AboutContent.count();
  if (aboutCount === 0) {
    await AboutContent.create(DEFAULT_ABOUT);
  }

  const settingCount = await PlatformSetting.count();
  if (settingCount === 0) {
    await PlatformSetting.create(DEFAULT_SETTINGS);
  }
};

const initDb = async () => {
  try {
    await sequelize.sync();
    try {
      await sequelize.query(
        "ALTER TABLE students ADD COLUMN registrationNumber VARCHAR(50) NULL"
      );
    } catch (e) {}
    try {
      await sequelize.query(
        "UPDATE students SET registrationNumber = CONCAT('AV-STU-', LPAD(id, 4, '0')) WHERE registrationNumber IS NULL OR registrationNumber = ''"
      );
    } catch (e) {}
    try {
      await sequelize.query("ALTER TABLE users ADD COLUMN bio TEXT NULL");
    } catch (e) {}
    try {
      await sequelize.query("ALTER TABLE users ADD COLUMN designation VARCHAR(150) NULL");
    } catch (e) {}
    console.log("Database models synchronized successfully.");
    await seedDatabase();
    console.log("Database seeded successfully.");
  } catch (err) {
    console.error("Database initialization error:", err);
    throw err;
  }
};

module.exports = {
  initDb,
  User,
  Role,
  Permission,
  RolePermission,
  Lead,
  LeadNote,
  LeadActivity,
  Student,
  StudentCourse,
  StudentBatch,
  CourseCategory,
  Course,
  CourseModule,
  CourseLesson,
  Batch,
  CourseMaterial,
  Syllabus,
  Award,
  Blog,
  HeroSlider,
  AboutContent,
  PlatformSetting,
};
