import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { DemoModalProvider } from "./context/DemoModalContext";
import { AuthProvider } from "./context/AuthContext";
import { SettingsProvider } from "./context/SettingsContext";
import Navbar from "./features/user/components/Navbar";
import Footer from "./features/user/components/Footer";
import Breadcrumb, { BreadcrumbProvider } from "./features/user/components/Breadcrumb";
import Home from "./features/user/pages/Home";
import About from "./features/user/pages/About";
import Courses from "./features/user/pages/Courses";
import CourseDetails from "./features/user/pages/CourseDetails";
import Syllabus from "./features/user/pages/Syllabus";
import DemoClass from "./features/user/pages/DemoClass";
import Blog from "./features/user/pages/Blog";
import BlogDetails from "./features/user/pages/BlogDetails";
import Contact from "./features/user/pages/Contact";
import CertificateVerification from "./features/user/pages/CertificateVerification";
import PrivacyPolicy from "./features/user/pages/PrivacyPolicy";
import TermsConditions from "./features/user/pages/TermsConditions";
import RefundPolicy from "./features/user/pages/RefundPolicy";

import ProtectedRoute from "./features/admin/components/ProtectedRoute";
import AdminLayout from "./features/admin/components/AdminLayout";
import Login from "./features/admin/pages/Login";
import StudentProtectedRoute from "./features/student/components/StudentProtectedRoute";
import StudentLayout from "./features/student/components/StudentLayout";
import StudentDashboard from "./features/student/pages/StudentDashboard";
import Dashboard from "./features/admin/pages/Dashboard";
import LeadsList from "./features/admin/pages/leads/LeadsList";
import LeadDetails from "./features/admin/pages/leads/LeadDetails";
import StudentsList from "./features/admin/pages/students/StudentsList";
import StudentForm from "./features/admin/pages/students/StudentForm";
import StudentDetails from "./features/admin/pages/students/StudentDetails";
import CoursesList from "./features/admin/pages/courses/CoursesList";
import CourseForm from "./features/admin/pages/courses/CourseForm";
import CourseDetailsAdmin from "./features/admin/pages/courses/CourseDetailsAdmin";
import CourseCategories from "./features/admin/pages/courses/CourseCategories";
import CourseMaterials from "./features/admin/pages/CourseMaterials";
import SyllabusAdmin from "./features/admin/pages/SyllabusAdmin";
import BatchesList from "./features/admin/pages/batches/BatchesList";
import BatchForm from "./features/admin/pages/batches/BatchForm";
import BatchDetails from "./features/admin/pages/batches/BatchDetails";
import PaymentsList from "./features/admin/pages/payments/PaymentsList";
import PaymentDetails from "./features/admin/pages/payments/PaymentDetails";
import DemoClassesAdmin from "./features/admin/pages/DemoClassesAdmin";
import CertificatesList from "./features/admin/pages/certificates/CertificatesList";
import CertificateCreate from "./features/admin/pages/certificates/CertificateCreate";
import CertificateDetails from "./features/admin/pages/certificates/CertificateDetails";
import BlogsList from "./features/admin/pages/blogs/BlogsList";
import BlogForm from "./features/admin/pages/blogs/BlogForm";
import BlogCategories from "./features/admin/pages/blogs/BlogCategories";
import HeroSliders from "./features/admin/pages/HeroSliders";
import NotificationsAdmin from "./features/admin/pages/NotificationsAdmin";
import AboutUsAdmin from "./features/admin/pages/AboutUsAdmin";
import VideoSectionAdmin from "./features/admin/pages/VideoSectionAdmin";
import ContactDetailsAdmin from "./features/admin/pages/ContactDetailsAdmin";
import HolidayEmailsList from "./features/admin/pages/holidayEmails/HolidayEmailsList";
import HolidayEmailForm from "./features/admin/pages/holidayEmails/HolidayEmailForm";
import UsersAdmin from "./features/admin/pages/UsersAdmin";
import RolesPermissions from "./features/admin/pages/RolesPermissions";
import ActivityLogs from "./features/admin/pages/ActivityLogs";
import SettingsAdmin from "./features/admin/pages/SettingsAdmin";
import AdminProfile from "./features/admin/pages/AdminProfile";
import Unauthorized from "./features/admin/pages/Unauthorized";
import AdminNotFound from "./features/admin/pages/AdminNotFound";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const isStudent = location.pathname.startsWith("/student");
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/admin/login";
  const hidePublicChrome = isAdmin || isStudent || isAuthPage;

  return (
    <>
      <ScrollToTop />
      {!hidePublicChrome && <Navbar />}
      {!hidePublicChrome && <Breadcrumb />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:slug" element={<CourseDetails />} />
        <Route path="/syllabus" element={<Syllabus />} />
        <Route path="/demo-class" element={<DemoClass />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/verify-certificate" element={<CertificateVerification />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsConditions />} />
        <Route path="/terms-and-conditions" element={<TermsConditions />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />

        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/unauthorized" element={<Unauthorized />} />

        <Route element={<StudentProtectedRoute />}>
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<StudentDashboard />} />
            <Route path="dashboard" element={<StudentDashboard />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="leads" element={<LeadsList />} />
            <Route path="leads/:id" element={<LeadDetails />} />
            <Route path="students" element={<StudentsList />} />
            <Route path="students/create" element={<StudentForm />} />
            <Route path="students/:id" element={<StudentDetails />} />
            <Route path="students/:id/edit" element={<StudentForm />} />
            <Route path="courses" element={<CoursesList />} />
            <Route path="courses/create" element={<CourseForm />} />
            <Route path="courses/categories" element={<CourseCategories />} />
            <Route path="course-categories" element={<CourseCategories />} />
            <Route path="courses/:id" element={<CourseDetailsAdmin />} />
            <Route path="courses/:id/edit" element={<CourseForm />} />
            <Route path="course-materials" element={<CourseMaterials />} />
            <Route path="syllabus" element={<SyllabusAdmin />} />
            <Route path="syllabus/create" element={<SyllabusAdmin />} />
            <Route path="curriculum" element={<SyllabusAdmin />} />
            <Route path="batches" element={<BatchesList />} />
            <Route path="batches/create" element={<BatchForm />} />
            <Route path="batches/:id" element={<BatchDetails />} />
            <Route path="payments" element={<PaymentsList />} />
            <Route path="payments/:id" element={<PaymentDetails />} />
            <Route path="demo-classes" element={<DemoClassesAdmin />} />
            <Route path="certificates" element={<CertificatesList />} />
            <Route path="certificates/create" element={<CertificateCreate />} />
            <Route path="certificates/:id" element={<CertificateDetails />} />
            <Route path="blogs" element={<BlogsList />} />
            <Route path="blogs/create" element={<BlogForm />} />
            <Route path="blogs/:id/edit" element={<BlogForm />} />
            <Route path="blog-categories" element={<BlogCategories />} />
            <Route path="hero-sliders" element={<HeroSliders />} />
            <Route path="hero-sliders/create" element={<HeroSliders />} />
            <Route path="notifications" element={<NotificationsAdmin />} />
            <Route path="about-us" element={<AboutUsAdmin />} />
            <Route path="video-section" element={<VideoSectionAdmin />} />
            <Route path="contact-details" element={<ContactDetailsAdmin />} />
            <Route path="holiday-emails" element={<HolidayEmailsList />} />
            <Route path="holiday-emails/create" element={<HolidayEmailForm />} />
            <Route path="users" element={<UsersAdmin />} />
            <Route path="roles" element={<RolesPermissions />} />
            <Route path="activity-logs" element={<ActivityLogs />} />
            <Route path="settings" element={<SettingsAdmin />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="*" element={<AdminNotFound />} />
          </Route>
        </Route>

        <Route path="*" element={<Home />} />
      </Routes>

      {!hidePublicChrome && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter basename="/apna-vidya">
      <AuthProvider>
        <SettingsProvider>
          <DemoModalProvider>
            <BreadcrumbProvider>
              <AppContent />
            </BreadcrumbProvider>
          </DemoModalProvider>
        </SettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
