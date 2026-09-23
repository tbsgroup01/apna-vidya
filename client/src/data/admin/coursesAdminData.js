export const initialAdminCourses = [
  {
    id: "CRS-101",
    title: "Full Stack Web Development",
    slug: "full-stack-development",
    category: "Web Development",
    duration: "6 Months",
    level: "Beginner to Advanced",
    fees: 32000,
    originalFees: 52000,
    studentsCount: 1840,
    status: "Active",
    badge: "Bestseller",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?auto=format&fit=crop&w=800&q=80",
    shortDescription: "Complete frontend and backend engineering with React, Node.js, Express, MongoDB, and Cloud Deployment.",
    fullDescription: "Master industry-standard web engineering. From foundational JavaScript to building microservices, auth workflows, real-time WebSockets, and deploying scalable architectures to AWS and Vercel.",
    courseType: "Live Interactive",
    seoTitle: "Best Full Stack Web Development Course 2026 | Apna Vidya",
    seoDescription: "Learn Full Stack Web Development with 1-on-1 live mentoring, capstone projects, and placement assistance.",
    modules: [
      {
        id: "MOD-1",
        title: "Frontend Foundations & Modern JavaScript",
        duration: "4 Weeks",
        lessons: [
          { id: "LES-101", title: "HTML5 Semantic Architecture & Accessibility", duration: "45 mins" },
          { id: "LES-102", title: "Modern CSS3 Flexbox & Grid Systems", duration: "60 mins" },
          { id: "LES-103", title: "JavaScript ES6+, Closures & Asynchronous Event Loop", duration: "90 mins" }
        ]
      },
      {
        id: "MOD-2",
        title: "React.js & State Management",
        duration: "6 Weeks",
        lessons: [
          { id: "LES-201", title: "Component Architecture, Props & State", duration: "60 mins" },
          { id: "LES-202", title: "React Hooks (useState, useEffect, useMemo, useCallback)", duration: "90 mins" },
          { id: "LES-203", title: "Redux Toolkit & Global Context Architecture", duration: "80 mins" }
        ]
      },
      {
        id: "MOD-3",
        title: "Backend API Engineering with Node & Express",
        duration: "6 Weeks",
        lessons: [
          { id: "LES-301", title: "RESTful API Standards & Express Middleware", duration: "75 mins" },
          { id: "LES-302", title: "MongoDB Schema Modeling with Mongoose", duration: "90 mins" },
          { id: "LES-303", title: "JWT Authentication, Authorization & Security Best Practices", duration: "85 mins" }
        ]
      },
      {
        id: "MOD-4",
        title: "Production Deployment & Cloud CI/CD",
        duration: "4 Weeks",
        lessons: [
          { id: "LES-401", title: "Docker Containerization Fundamentals", duration: "70 mins" },
          { id: "LES-402", title: "Deploying Node APIs on AWS EC2 & S3", duration: "90 mins" }
        ]
      }
    ]
  },
  {
    id: "CRS-102",
    title: "Data Science & Artificial Intelligence",
    slug: "data-science-ai",
    category: "Data & AI",
    duration: "7 Months",
    level: "Intermediate",
    fees: 38000,
    originalFees: 60000,
    studentsCount: 980,
    status: "Active",
    badge: "Trending",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    shortDescription: "Python, Pandas, Machine Learning, Deep Learning, and Generative AI prompt engineering.",
    fullDescription: "Gain practical data mastery with statistics, EDA, supervised/unsupervised machine learning, neural networks with PyTorch, and large language model integration.",
    courseType: "Live Interactive",
    seoTitle: "Data Science and AI Certification Training | Apna Vidya",
    seoDescription: "Become an industry-ready Data Scientist with hands-on projects in Python, ML, NLP, and AI models.",
    modules: [
      {
        id: "MOD-1",
        title: "Python for Data Analysis & Visualization",
        duration: "5 Weeks",
        lessons: [
          { id: "LES-11", title: "NumPy Arrays & Mathematical Operations", duration: "60 mins" },
          { id: "LES-12", title: "Pandas DataFrames, Cleaning & Filtering", duration: "90 mins" },
          { id: "LES-13", title: "Seaborn & Matplotlib Visualization Dashboards", duration: "60 mins" }
        ]
      },
      {
        id: "MOD-2",
        title: "Machine Learning Algorithms & Scikit-Learn",
        duration: "8 Weeks",
        lessons: [
          { id: "LES-21", title: "Linear & Logistic Regression with Optimization", duration: "90 mins" },
          { id: "LES-22", title: "Decision Trees, Random Forests & XGBoost", duration: "90 mins" }
        ]
      }
    ]
  },
  {
    id: "CRS-103",
    title: "Modern Web Development",
    slug: "web-development",
    category: "Web Development",
    duration: "4 Months",
    level: "Beginner",
    fees: 24000,
    originalFees: 36000,
    studentsCount: 1220,
    status: "Active",
    badge: "Popular",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    shortDescription: "Build modern, responsive, high-speed websites with HTML5, CSS3, JavaScript, Tailwind, and React.",
    fullDescription: "Essential web training starting from scratch with responsive design systems, CSS animations, JavaScript DOM manipulations, and practical portfolio building.",
    courseType: "Live Interactive",
    seoTitle: "Web Development Course for Beginners | Apna Vidya",
    seoDescription: "Step-by-step web design and development training with practical live mentors.",
    modules: [
      {
        id: "MOD-1",
        title: "Core Web Fundamentals",
        duration: "6 Weeks",
        lessons: [
          { id: "LES-31", title: "HTML5 Layouts & Web Accessibility", duration: "45 mins" },
          { id: "LES-32", title: "Tailwind CSS Utility Design", duration: "75 mins" }
        ]
      }
    ]
  },
  {
    id: "CRS-104",
    title: "Mobile App Development with Flutter & React Native",
    slug: "app-development",
    category: "Mobile",
    duration: "5 Months",
    level: "Intermediate",
    fees: 30000,
    originalFees: 48000,
    studentsCount: 740,
    status: "Active",
    badge: "High Demand",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80",
    shortDescription: "Cross-platform mobile apps for iOS and Android with single codebase Dart/Flutter and React Native.",
    fullDescription: "From mobile UI widgets to device sensor integration, state management, local database storage, push notifications, and Play Store publishing.",
    courseType: "Live Interactive",
    seoTitle: "Mobile App Development Certification Course | Apna Vidya",
    seoDescription: "Build production iOS and Android apps with senior mobile engineering leads.",
    modules: [
      {
        id: "MOD-1",
        title: "Flutter & Dart Fundamentals",
        duration: "6 Weeks",
        lessons: [
          { id: "LES-41", title: "Dart Syntax & Object-Oriented Principles", duration: "60 mins" },
          { id: "LES-42", title: "Flutter Widget Tree & Material 3 Layouts", duration: "90 mins" }
        ]
      }
    ]
  },
  {
    id: "CRS-105",
    title: "Data Structures, Algorithms & Problem Solving",
    slug: "programming",
    category: "Computer Science",
    duration: "4 Months",
    level: "Beginner to Advanced",
    fees: 18000,
    originalFees: 30000,
    studentsCount: 620,
    status: "Active",
    badge: "Interview Prep",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80",
    shortDescription: "Master DSA in Java / C++ / Python. Crack FAANG and top product-based company coding rounds.",
    fullDescription: "Comprehensive deep-dive into arrays, linked lists, stacks, queues, trees, graphs, dynamic programming, time-space complexity, and 250+ LeetCode problems.",
    courseType: "Live Interactive",
    seoTitle: "DSA Bootcamp for Tech Placements | Apna Vidya",
    seoDescription: "Crack technical coding rounds with confidence guided by senior software engineers.",
    modules: [
      {
        id: "MOD-1",
        title: "Arrays, Strings & Two-Pointer Strategies",
        duration: "4 Weeks",
        lessons: [
          { id: "LES-51", title: "Asymptotic Analysis & Big-O Notation", duration: "60 mins" },
          { id: "LES-52", title: "Sliding Window & Two Pointer Patterns", duration: "90 mins" }
        ]
      }
    ]
  },
  {
    id: "CRS-106",
    title: "DevOps & Cloud Engineering Bootcamp",
    slug: "devops-cloud",
    category: "Cloud",
    duration: "5 Months",
    level: "Advanced",
    fees: 35000,
    originalFees: 55000,
    studentsCount: 310,
    status: "Draft",
    badge: "Upcoming",
    rating: 0,
    image: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=800&q=80",
    shortDescription: "Linux, Git, Docker, Kubernetes, Terraform, AWS Cloud and Jenkins CI/CD pipelines.",
    fullDescription: "Enterprise infrastructure automation and site reliability engineering training.",
    courseType: "Live Interactive",
    seoTitle: "DevOps Cloud Engineering Certification | Apna Vidya",
    seoDescription: "Automate delivery pipelines and scale cloud infrastructure.",
    modules: []
  }
];

export const initialCourseCategories = [
  {
    id: "CAT-CRS-1",
    name: "Web Development",
    slug: "web-development",
    description: "Frontend, backend, and full stack engineering programs covering modern web frameworks.",
    coursesCount: 2,
    color: "blue",
    iconName: "Code",
    displayOrder: 1,
    status: "Active"
  },
  {
    id: "CAT-CRS-2",
    name: "Data & AI",
    slug: "data-ai",
    description: "Artificial intelligence, machine learning, Python programming, and data engineering tracks.",
    coursesCount: 1,
    color: "purple",
    iconName: "Brain",
    displayOrder: 2,
    status: "Active"
  },
  {
    id: "CAT-CRS-3",
    name: "Mobile App Development",
    slug: "mobile-development",
    description: "Cross-platform mobile application engineering using React Native and modern mobile tools.",
    coursesCount: 1,
    color: "emerald",
    iconName: "Smartphone",
    displayOrder: 3,
    status: "Active"
  },
  {
    id: "CAT-CRS-4",
    name: "Computer Science & DSA",
    slug: "computer-science",
    description: "Core algorithms, data structures, dynamic programming, and scalable system architecture.",
    coursesCount: 1,
    color: "amber",
    iconName: "Binary",
    displayOrder: 4,
    status: "Active"
  },
  {
    id: "CAT-CRS-5",
    name: "Cloud & DevOps",
    slug: "cloud-devops",
    description: "Infrastructure automation, CI/CD pipelines, containerization with Docker and Kubernetes.",
    coursesCount: 1,
    color: "sky",
    iconName: "Cloud",
    displayOrder: 5,
    status: "Active"
  },
  {
    id: "CAT-CRS-6",
    name: "Cyber Security",
    slug: "cyber-security",
    description: "Network security, vulnerability assessment, ethical hacking, and threat mitigation.",
    coursesCount: 0,
    color: "rose",
    iconName: "Shield",
    displayOrder: 6,
    status: "Draft"
  }
];
