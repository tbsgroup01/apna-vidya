const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
require("dotenv").config();

const Award = require("../models/Award");
const CourseCategory = require("../models/CourseCategory");
const Course = require("../models/Course");
const Testimonial = require("../models/Testimonial");
const Blog = require("../models/Blog");
const { sequelize } = require("./db");

// ==========================================
// 1. SEED DATA DEFINITIONS
// ==========================================

const SEED_CERTIFICATES = [
  {
    title: "Certificate of Academic Excellence (ISO 9001:2015)",
    issuer: "International Academic Standards Organization",
    category: "Quality Certification",
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1589330694653-dad6d3240e87?auto=format&fit=crop&w=800&q=80",
    verificationUrl: "https://apnavidya.com/verify/ISO-9001-2025",
    description:
      "Certified for maintaining benchmark quality management standards in digital education, practical training methodologies, and mentor-led curriculums.",
    status: "Active",
    featured: true,
    orderIndex: 1,
  },
  {
    title: "National Ed-Tech Innovation Award",
    issuer: "National Council for Skill Advancement",
    category: "Innovation & Excellence",
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=800&q=80",
    verificationUrl: "https://apnavidya.com/verify/EDTECH-INNOV-2025",
    description:
      "Awarded in recognition of innovative live online mentoring, interactive doubt resolution windows, and student placement empowerment across tier-1 and tier-2 cities.",
    status: "Active",
    featured: true,
    orderIndex: 2,
  },
  {
    title: "Authorized Technology Learning Partner",
    issuer: "Global Tech Education Consortium",
    category: "Industry Partnership",
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1579389083078-4e7018379f7e?auto=format&fit=crop&w=800&q=80",
    verificationUrl: "https://apnavidya.com/verify/TECH-PARTNER-2025",
    description:
      "Official academic accreditation verifying curriculum alignment with current industry-demanded tech competencies, modern cloud platforms, and full stack frameworks.",
    status: "Active",
    featured: true,
    orderIndex: 3,
  },
  {
    title: "Certified Professional Skill Development Institute",
    issuer: "Skill India Development Forum",
    category: "Career Empowerment",
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
    verificationUrl: "https://apnavidya.com/verify/SKILL-INDIA-2025",
    description:
      "Honored for empowering over 5,000+ learners across India with job-ready tech proficiencies, practical coding portfolios, and verifiable career credentials.",
    status: "Active",
    featured: true,
    orderIndex: 4,
  },
];

const SEED_COURSE_CATEGORIES = [
  {
    name: "Web & Software Development",
    slug: "web-development",
    description:
      "Full stack web engineering, modern JavaScript frameworks, enterprise software architecture, and cloud deployment.",
    icon: "Code",
  },
  {
    name: "Data Science & Artificial Intelligence",
    slug: "data-science-ai",
    description:
      "Machine learning pipelines, Python data analytics, neural networks, predictive modeling, and generative AI.",
    icon: "Brain",
  },
  {
    name: "Mobile App Development",
    slug: "mobile-development",
    description:
      "Cross-platform iOS and Android mobile applications using Flutter and React Native from a single codebase.",
    icon: "Smartphone",
  },
  {
    name: "Cloud Computing & DevOps",
    slug: "cloud-devops",
    description:
      "AWS, Docker, Kubernetes, CI/CD automation pipelines, and scalable cloud infrastructure management.",
    icon: "Cloud",
  },
];

const SEED_COURSES = [
  {
    name: "Full Stack Development",
    slug: "full-stack-development",
    categorySlug: "web-development",
    duration: "6 Months",
    level: "Beginner to Advanced",
    fees: 24999,
    image:
      "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?auto=format&fit=crop&w=800&q=80",
    description:
      "Master modern web development from ground up. Learn React, Node.js, Express, MongoDB/SQL, and build 10+ real-world production projects.",
    learningOutcomes: [
      "Build scalable full-stack web applications with React & Node.js",
      "Design robust REST APIs, authentication, and database schemas",
      "Deploy containerized applications on AWS and modern cloud platforms",
      "Master Git workflows, clean code architecture, and testing",
    ],
    prerequisites:
      "Basic logical thinking and computer literacy. No prior coding experience required.",
    certificateInfo:
      "Industry-recognized Certificate of Completion with verifiable credentials.",
    classFormat: "100% Live Online + Recorded Sessions",
    batchTiming: "Weekday Evening / Weekend Batches",
    lmsAccess: "Lifetime Validity",
    doubtResolution: "Daily Live 1-on-1 Mentor Windows",
    featured: true,
    status: "Active",
    fullOverview:
      "Our Full Stack Development program is curated by experienced senior engineers to take you from fundamentals to enterprise-ready developer. You will build comprehensive portfolio projects, learn Git best practices, containerization, and prepare for tech interviews.",
  },
  {
    name: "Data Science & Artificial Intelligence",
    slug: "data-science-ai",
    categorySlug: "data-science-ai",
    duration: "6 Months",
    level: "Intermediate to Advanced",
    fees: 29999,
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    description:
      "Master Python, Pandas, Machine Learning algorithms, Deep Learning models, and predictive analytics with hands-on enterprise datasets.",
    learningOutcomes: [
      "Analyze complex business data using Python, NumPy & Pandas",
      "Build supervised and unsupervised Machine Learning models",
      "Understand Deep Learning concepts, NLP, and neural networks",
      "Create interactive dashboards and executive visual reports",
    ],
    prerequisites:
      "Basic understanding of high school mathematics or statistics.",
    certificateInfo:
      "Recognized Data Science Professional Certification with portfolio project validation.",
    classFormat: "Live Interactive Masterclasses + Capstone Projects",
    batchTiming: "Weekend Batches (Sat & Sun)",
    lmsAccess: "Lifetime Validity",
    doubtResolution: "Dedicated TA Support on Slack & Zoom",
    featured: true,
    status: "Active",
    fullOverview:
      "Step into the future of data. This comprehensive curriculum covers exploratory data analysis, feature engineering, predictive models with Scikit-Learn, deep learning with TensorFlow, and deploying ML models as web APIs.",
  },
  {
    name: "Web Development Masterclass",
    slug: "web-development",
    categorySlug: "web-development",
    duration: "4 Months",
    level: "Beginner",
    fees: 14999,
    image:
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    description:
      "Master HTML5, CSS3, modern JavaScript (ES6+), Tailwind CSS, and React.js to craft high-converting, accessible user interfaces.",
    learningOutcomes: [
      "Build pixel-perfect responsive web layouts with Tailwind CSS",
      "Write clean asynchronous JavaScript and interact with APIs",
      "Create reusable, performant React component architectures",
      "Optimize web applications for performance and SEO",
    ],
    prerequisites: "Curiosity to learn and a laptop with internet connection.",
    certificateInfo: "Certified Frontend Web Developer Credential.",
    classFormat: "Live Online with Daily Practical Coding Assignments",
    batchTiming: "Weekday Mornings / Evenings",
    lmsAccess: "Lifetime Validity",
    doubtResolution: "Daily Live Mentor Support",
    featured: true,
    status: "Active",
    fullOverview:
      "Learn how to build stunning, responsive, interactive web applications from scratch. This course focuses heavily on practical coding, modern frontend best practices, state management, and real-world deployment.",
  },
  {
    name: "Cross-Platform Mobile App Development",
    slug: "app-development",
    categorySlug: "mobile-development",
    duration: "5 Months",
    level: "Intermediate",
    fees: 21999,
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80",
    description:
      "Develop beautiful native mobile applications for both iOS and Android using React Native and Flutter from a single codebase.",
    learningOutcomes: [
      "Build responsive cross-platform mobile apps for Android & iOS",
      "Integrate native device features: Camera, GPS, Push Notifications",
      "Manage complex app states with Redux Toolkit and Context API",
      "Publish finished applications to Google Play Store and Apple App Store",
    ],
    prerequisites: "Basic knowledge of JavaScript or any programming language.",
    certificateInfo: "Certified Mobile Application Developer Credential.",
    classFormat: "Live Interactive Weekend Classes",
    batchTiming: "Saturday & Sunday Evenings",
    lmsAccess: "Lifetime Validity",
    doubtResolution: "Daily Live Doubt Resolution Windows",
    featured: true,
    status: "Active",
    fullOverview:
      "Turn your ideas into mobile apps published on the App Store and Google Play. Learn mobile UI design patterns, smooth animations, native device bridges, offline persistence, and seamless backend API integrations.",
  },
  {
    name: "Cloud Computing & DevOps Engineering",
    slug: "cloud-devops",
    categorySlug: "cloud-devops",
    duration: "5 Months",
    level: "Intermediate to Advanced",
    fees: 27999,
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    description:
      "Learn AWS Core Services, Docker containerization, Kubernetes orchestration, CI/CD pipeline automation, and Terraform infrastructure as code.",
    learningOutcomes: [
      "Architect highly available, secure infrastructure on AWS",
      "Containerize distributed applications using Docker & Kubernetes",
      "Automate deployment pipelines using GitHub Actions and Jenkins",
      "Implement Infrastructure as Code using Terraform",
    ],
    prerequisites: "Basic command line familiarity and Linux basics.",
    certificateInfo: "Certified Cloud & DevOps Specialist Credential.",
    classFormat: "Hands-on Live Labs + Real-World Infrastructure Scenarios",
    batchTiming: "Weekend Morning Batches",
    lmsAccess: "Lifetime Validity",
    doubtResolution: "1-on-1 Mentor Guidance & Mock Technical Interviews",
    featured: false,
    status: "Active",
    fullOverview:
      "Master the operational backbone of modern tech companies. Build scalable cloud environments on AWS, configure microservices with Docker and Kubernetes, and implement continuous integration and continuous deployment pipelines.",
  },
];

const SEED_TESTIMONIALS = [
  {
    name: "Rohan Kulkarni",
    role: "Full Stack Engineer at Innovaccer",
    course: "Full Stack Development",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    review:
      "Coming from a non-CS background, I was terrified of learning React and Node.js. ApnaVidya's daily doubt clearance and mentor code reviews gave me the exact confidence I needed. Cracked a 9 LPA package within 5 months!",
    company: "Innovaccer",
    displayOrder: 1,
    status: "Active",
  },
  {
    name: "Ananya Deshmukh",
    role: "Frontend Developer at Razorpay",
    course: "Web Development",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    review:
      "The practical projects in the Web Dev course are genuinely industry-grade. The mentors don't just explain concepts, they teach how to debug like a senior engineer. Best investment I made in my career.",
    company: "Razorpay",
    displayOrder: 2,
    status: "Active",
  },
  {
    name: "Aditya Verma",
    role: "Scored 96.4% in CBSE Class 12 Boards",
    course: "School Curriculum",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80",
    review:
      "The chapter-wise formula cheat sheets and mock test evaluations pinpointed exactly where I was losing marks. My physics and maths marks improved dramatically in just 3 months!",
    company: "CBSE Topper",
    displayOrder: 3,
    status: "Active",
  },
  {
    name: "Pooja Sharma",
    role: "Data Analyst at Infosys",
    course: "Data Science & AI",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    review:
      "The structured curriculum covering SQL, Python, and Tableau helped me transition smoothly from non-tech to analytics. Highly recommended for beginners and working professionals!",
    company: "Infosys",
    displayOrder: 4,
    status: "Active",
  },
  {
    name: "Vikram Rathore",
    role: "Cloud Engineer at TCS",
    course: "Cloud & DevOps",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    review:
      "Hands-on labs on AWS and Docker gave me real-world problem-solving skills. The mentors guided me through mock interviews until I felt 100% prepared.",
    company: "TCS",
    displayOrder: 5,
    status: "Active",
  },
];

const SEED_BLOGS = [
  {
    title: "How to Become a Full Stack Developer in 2026: The Ultimate Roadmap",
    slug: "how-to-become-a-full-stack-developer-2026",
    category: "Career Guide",
    author: "Rahul Sharma",
    authorRole: "Principal Tech Mentor",
    publishedDate: "2026-01-15",
    readTime: "7 min read",
    featuredImage:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    excerpt:
      "A complete, step-by-step roadmap to mastering frontend, backend, databases, and DevOps in 2026. Discover the exact technologies hiring managers are looking for.",
    tags: "fullstack, webdev, react, nodejs, career-roadmap",
    status: "Published",
    featured: true,
    views: 1240,
    seoTitle: "Full Stack Developer Roadmap 2026 | ApnaVidya",
    seoDescription:
      "Step-by-step guide to becoming a high-earning full stack software developer in 2026.",
    content: `
      <h2>The Evolution of Full Stack Engineering</h2>
      <p>The tech landscape in 2026 demands developers who understand not only how to write user interfaces or REST APIs, but how the entire modern web pipeline operates together. Gone are the days when knowing simple HTML and jQuery was enough to land a frontend role.</p>
      
      <h3>Phase 1: Foundations of Modern Frontend</h3>
      <p>Begin with semantic HTML5, modern CSS3 (Flexbox, Grid, CSS Variables), and deep ECMAScript knowledge. Master JavaScript concepts like closures, promises, event loop, and async/await before jumping into frameworks.</p>
      <ul>
        <li><strong>Component Architecture:</strong> React 19 is the undisputed industry standard for frontend state and composition.</li>
        <li><strong>Utility-First Styling:</strong> Tailwind CSS dramatically speeds up interface design and design consistency.</li>
        <li><strong>State Management:</strong> Master React Context and Zustand for lightweight, predictable data flows.</li>
      </ul>

      <h3>Phase 2: Scalable Backend Services</h3>
      <p>Node.js with Express or Nest.js remains the dominant choice for microservices and API gateways. Key backend competencies include:</p>
      <ul>
        <li>RESTful API design and OpenAPI documentation standards</li>
        <li>Authentication using JWT, refresh tokens, and OAuth2</li>
        <li>Database modeling with Sequelize, Prisma, or TypeORM</li>
      </ul>

      <h3>Phase 3: Database & Cloud Deployment</h3>
      <p>Every full stack developer should know both relational (PostgreSQL, MySQL) and document-based (MongoDB) databases. Pair your backend with Docker containers, CI/CD automated deployment pipelines on AWS or DigitalOcean, and you will stand out to hiring managers.</p>
    `,
  },
  {
    title: "Demystifying Artificial Intelligence & Machine Learning: A Beginner's Guide",
    slug: "demystifying-ai-and-ml-beginners-guide",
    category: "Data & AI",
    author: "Dr. Sneha Verma",
    authorRole: "AI Research Advisor",
    publishedDate: "2026-01-28",
    readTime: "6 min read",
    featuredImage:
      "https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&w=1200&q=80",
    excerpt:
      "Confused about the difference between AI, Machine Learning, and Deep Learning? Here is a clear, jargon-free breakdown of core concepts and practical starting points.",
    tags: "ai, machinelearning, python, datascience, deeplearning",
    status: "Published",
    featured: true,
    views: 980,
    seoTitle: "AI & ML Beginner Guide | ApnaVidya",
    seoDescription:
      "A complete beginner breakdown of Artificial Intelligence, Machine Learning, and how to start coding ML models.",
    content: `
      <h2>Cutting Through the AI Hype</h2>
      <p>Artificial Intelligence (AI) has become the defining technology of the 2020s. However, beginners often get overwhelmed by mathematical formulas and buzzwords like LLMs, neural nets, and transformers. Let's break down what actually matters.</p>

      <h3>The Hierarchy: AI vs. Machine Learning vs. Deep Learning</h3>
      <p>Think of concentric circles: <strong>Artificial Intelligence</strong> is the broad umbrella of machines executing tasks that require human intelligence. <strong>Machine Learning</strong> is a subset where algorithms learn patterns from data rather than following static rules. <strong>Deep Learning</strong> is a specialized subset of ML utilizing multi-layered neural networks inspired by the human brain.</p>

      <h3>Your 4-Step Starting Strategy</h3>
      <ol>
        <li><strong>Python Mastery:</strong> Python is the lingua franca of data science. Learn syntax, list comprehensions, and virtual environments.</li>
        <li><strong>Data Manipulation:</strong> Get hands-on with NumPy for vectorized math and Pandas for tabular data wrangling.</li>
        <li><strong>Classic Algorithms:</strong> Implement Linear Regression, Decision Trees, and Random Forests using Scikit-Learn.</li>
        <li><strong>Real Projects:</strong> Build real-world models, such as house price predictors, sentiment analysis bots, or customer churn classifiers.</li>
      </ol>
    `,
  },
  {
    title: "Mastering React 19: New Hooks, Actions, and Server Components Explained",
    slug: "mastering-react-19-hooks-actions-server-components",
    category: "Web Development",
    author: "Amit Patel",
    authorRole: "Senior Frontend Architect",
    publishedDate: "2026-02-10",
    readTime: "8 min read",
    featuredImage:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80",
    excerpt:
      "React 19 introduces game-changing features like useActionState, useOptimistic, and streamlined Server Components. Learn how to write cleaner, faster React apps.",
    tags: "react, javascript, frontend, react19, webdevelopment",
    status: "Published",
    featured: false,
    views: 820,
    seoTitle: "React 19 Features & Complete Guide | ApnaVidya",
    seoDescription:
      "Deep dive into React 19 new features: useActionState, useOptimistic, Server Actions, and compiler improvements.",
    content: `
      <h2>React 19: The New Era of Frontend</h2>
      <p>React 19 is officially here, and it dramatically simplifies state handling, asynchronous mutations, and document metadata. If you've been managing loading spinners, form error states, and optimistic UI manually with boilerplate useEffects, React 19 is a breath of fresh air.</p>

      <h3>1. The Magic of Actions with useActionState</h3>
      <p>Handling form submissions previously required useState for error, useState for isPending, and manual try/catch wrappers. With <code>useActionState</code>, React handles all pending states and error returns automatically:</p>
      <pre><code>const [state, formAction, isPending] = useActionState(updateName, null);</code></pre>

      <h3>2. Built-in Document Metadata</h3>
      <p>Say goodbye to external packages like react-helmet. React 19 lets you render <code>&lt;title&gt;</code> and <code>&lt;meta&gt;</code> tags directly inside your component hierarchy, and React will automatically hoist them to the HTML <code>&lt;head&gt;</code>.</p>

      <h3>3. Optimistic UI with useOptimistic</h3>
      <p>Show users immediate feedback before the network request finishes. If the request succeeds, state updates seamlessly; if it fails, React rolls back to the prior state automatically.</p>
    `,
  },
  {
    title: "Top 10 High-Paying IT Certifications to Boost Your Career in 2026",
    slug: "top-high-paying-it-certifications-2026",
    category: "Certifications",
    author: "Priyanka Mehra",
    authorRole: "Career Counsellor",
    publishedDate: "2026-02-20",
    readTime: "5 min read",
    featuredImage:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    excerpt:
      "Looking to level up your resume? Explore the top-paying global certifications in Cloud, Cyber Security, Full Stack, and Data Science that recruiters value most.",
    tags: "certifications, career, aws, cloud, devops, salary",
    status: "Published",
    featured: false,
    views: 1450,
    seoTitle: "High-Paying IT Certifications 2026 | ApnaVidya",
    seoDescription:
      "Discover the best IT certifications that boost salary and career advancement in 2026.",
    content: `
      <h2>Why Certifications Matter More Than Ever</h2>
      <p>With thousands of applicants competing for every tech role, verified certifications serve as proof of work. They demonstrate commitment to lifelong learning, domain competence, and proficiency with real tools.</p>

      <h3>Top In-Demand Certifications for 2026</h3>
      <ul>
        <li><strong>AWS Certified Solutions Architect:</strong> Remains the gold standard for cloud architects and backend engineers worldwide.</li>
        <li><strong>Certified Kubernetes Administrator (CKA):</strong> Crucial for modern DevOps practitioners running containerized microservices.</li>
        <li><strong>ApnaVidya Full Stack Developer Credential:</strong> Validates practical development skills through evaluated capstone projects and mentor code reviews.</li>
        <li><strong>Google Professional Data Engineer:</strong> Highly sought after by companies leveraging Big Data pipelines and cloud analytics.</li>
        <li><strong>Certified Information Systems Security Professional (CISSP):</strong> Premium cybersecurity certification with top-tier salary benchmarks.</li>
      </ul>
    `,
  },
  {
    title: "5 Proven Study Techniques to Master Coding Faster Without Burnout",
    slug: "proven-study-techniques-to-master-coding-faster",
    category: "Learning Tips",
    author: "Vikramaditya Sen",
    authorRole: "Academic Director",
    publishedDate: "2026-03-02",
    readTime: "6 min read",
    featuredImage:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80",
    excerpt:
      "Tired of tutorial hell? Discover how active recall, spaced repetition, and project-based experimentation can help you retain programming concepts 3x faster.",
    tags: "learning, productivity, coding, students, study-tips",
    status: "Published",
    featured: false,
    views: 1100,
    seoTitle: "Study Techniques for Coders | ApnaVidya",
    seoDescription:
      "Learn how to escape tutorial hell and master programming efficiently with cognitive study methods.",
    content: `
      <h2>Escaping the Tutorial Hell Trap</h2>
      <p>Many aspiring developers fall into the 'passive learning' trap: watching 40-hour video tutorials and following along line-by-line, only to realize they cannot build a project from a blank text editor. To retain syntax and programming patterns, you need active cognitive engagement.</p>

      <h3>1. The Feynman Technique</h3>
      <p>Whenever you learn a concept (e.g. JavaScript closures, SQL joins, or Redux store), try explaining it out loud in simple terms as if teaching a 12-year-old. Gaps in your explanation reveal exactly what you need to review.</p>

      <h3>2. The 80/20 Project Rule</h3>
      <p>Spend 20% of your time consuming instructional content and 80% writing code. Break features into small tasks and implement them without watching the instructor code them first.</p>

      <h3>3. Spaced Repetition for Syntax</h3>
      <p>Review key syntax snippets and design patterns at increasing intervals (Day 1, Day 3, Day 7, Day 21). This moves technical knowledge from short-term memory to long-term intuition.</p>
    `,
  },
];

// ==========================================
// 2. EMPTY TABLES FUNCTION
// ==========================================

/**
 * emptyTables()
 * Empties all content and catalog tables safely with foreign key checks disabled.
 */
const emptyTables = async () => {
  console.log("🧹 Emptying all tables before seeding...");
  try {
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0;");

    const tablesToEmpty = [
      "awards_and_certificates",
      "course_lessons",
      "course_modules",
      "course_materials",
      "syllabus",
      "batches",
      "student_batches",
      "student_courses",
      "courses",
      "course_categories",
      "testimonials",
      "blogs",
    ];

    for (const table of tablesToEmpty) {
      try {
        await sequelize.query(`TRUNCATE TABLE \`${table}\`;`);
      } catch (e) {
        try {
          await sequelize.query(`DELETE FROM \`${table}\`;`);
        } catch (err) {
          // Table may not exist yet, ignore
        }
      }
    }

    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1;");
    console.log("✅ All target tables emptied and reset successfully.");
  } catch (err) {
    console.error("⚠️ Error while emptying tables:", err.message);
    try {
      await sequelize.query("SET FOREIGN_KEY_CHECKS = 1;");
    } catch {}
  }
};

// ==========================================
// 3. MASTER SEED DATA FUNCTION
// ==========================================

/**
 * seedData({ emptyFirst = true })
 * 1. First empties all tables (certificates, courses, testimonials, blogs)
 * 2. Feeds Certificates (Award model)
 * 3. Feeds Courses & Categories (CourseCategory & Course models)
 * 4. Feeds Testimonials (Testimonial model)
 * 5. Feeds 5 Blogs (Blog model)
 */
const seedData = async ({ emptyFirst = true } = {}) => {
  console.log("------------------------------------------");
  console.log("🌱 Starting ApnaVidya Data Seeder...");
  console.log("------------------------------------------");

  // Step 1: First empty all target tables
  if (emptyFirst) {
    await emptyTables();
  }

  const results = {
    certificates: 0,
    categories: 0,
    courses: 0,
    testimonials: 0,
    blogs: 0,
  };

  try {
    // ----------------------------------------------------
    // 1. SEED CERTIFICATES / AWARDS
    // ----------------------------------------------------
    for (const cert of SEED_CERTIFICATES) {
      await Award.create(cert);
      results.certificates++;
    }
    console.log(`✅ Seeded ${results.certificates} Certificates & Awards.`);

    // ----------------------------------------------------
    // 2. SEED COURSE CATEGORIES & COURSES
    // ----------------------------------------------------
    const categoryMap = {};
    for (const catDef of SEED_COURSE_CATEGORIES) {
      const [cat] = await CourseCategory.findOrCreate({
        where: { slug: catDef.slug },
        defaults: catDef,
      });
      categoryMap[cat.slug] = cat;
      results.categories++;
    }

    for (const courseDef of SEED_COURSES) {
      const { categorySlug, ...courseData } = courseDef;
      const category = categoryMap[categorySlug];
      if (category) {
        courseData.categoryId = category.id;
      }
      await Course.create(courseData);
      results.courses++;
    }
    console.log(`✅ Seeded ${results.courses} Courses across ${results.categories} Categories.`);

    // ----------------------------------------------------
    // 3. SEED TESTIMONIALS
    // ----------------------------------------------------
    for (const testDef of SEED_TESTIMONIALS) {
      await Testimonial.create(testDef);
      results.testimonials++;
    }
    console.log(`✅ Seeded ${results.testimonials} Testimonials.`);

    // ----------------------------------------------------
    // 4. SEED 5 BLOGS
    // ----------------------------------------------------
    for (const blogDef of SEED_BLOGS) {
      await Blog.create(blogDef);
      results.blogs++;
    }
    console.log(`✅ Seeded ${results.blogs} Educational Blog Posts.`);

    console.log("------------------------------------------");
    console.log("🎉 ApnaVidya Data Seeding Completed Successfully!");
    console.log("------------------------------------------");

    return {
      success: true,
      message: "All tables emptied and fresh seed data fed successfully",
      data: results,
    };
  } catch (error) {
    console.error("❌ Data seeding failed:", error);
    throw error;
  }
};

// If executed directly from command line (e.g. node src/config/seedData.js)
if (require.main === module) {
  const { initDb } = require("./initDb");

  (async () => {
    try {
      await initDb();
      await seedData({ force: process.argv.includes("--force") });
      process.exit(0);
    } catch (err) {
      console.error("CLI seed execution failed:", err);
      process.exit(1);
    }
  })();
}

module.exports = {
  seedData,
  emptyTables,
  SEED_CERTIFICATES,
  SEED_COURSE_CATEGORIES,
  SEED_COURSES,
  SEED_TESTIMONIALS,
  SEED_BLOGS,
};
