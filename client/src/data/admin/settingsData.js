export const initialSettings = {
  general: {
    siteName: "Apna Vidya",
    tagline: "Learn • Grow • Succeed",
    timezone: "Asia/Kolkata (IST +5:30)",
    currency: "INR (₹)",
    language: "English (India)",
    supportEmail: "support@apnavidya.com",
    academicDirector: "Dr. Vikramaditya Sen"
  },
  branding: {
    logoUrl: "/images/logo.png",
    faviconUrl: "/favicon.ico",
    primaryColor: "#2563eb",
    fontFamily: "Inter, sans-serif",
    darkModeSupport: false
  },
  contact: {
    phone: "+91 98765 43210",
    tollFree: "1800-123-4567",
    email: "admissions@apnavidya.com",
    address: "Apna Vidya Tower, 4th Floor, Sector 62, Noida, UP - 201301"
  },
  social: {
    facebook: "https://facebook.com/apnavidya",
    instagram: "https://instagram.com/apnavidya_official",
    linkedin: "https://linkedin.com/company/apna-vidya",
    youtube: "https://youtube.com/@apnavidya"
  },
  email: {
    smtpHost: "smtp.sendgrid.net",
    smtpPort: 587,
    fromEmail: "notifications@apnavidya.com",
    fromName: "Apna Vidya Academy",
    sendWelcomeEmail: true,
    sendReceiptEmail: true
  },
  seo: {
    metaTitle: "Apna Vidya - Learn • Grow • Succeed | Leading Tech Education",
    metaDescription: "Master Full Stack Development, Data Science, Python, and DSA with live 1-on-1 mentoring, verified certifications, and guaranteed career support.",
    keywords: "coding bootcamp, web development, data science, apna vidya, full stack course, learn react, python dsa"
  },
  security: {
    twoFactorAuth: false,
    sessionTimeoutMins: 60,
    passwordExpirationDays: 90,
    ipWhitelistEnabled: false
  }
};

export const adminProfileData = {
  id: "USR-01",
  name: "Dr. Vikramaditya Sen",
  email: "vikram@apnavidya.com",
  phone: "+91 98111 22334",
  role: "Super Admin",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
  bio: "Lead educator and software architect passionate about bridging industry skills for Indian college graduates.",
  location: "New Delhi, India",
  joinedDate: "January 2025"
};
