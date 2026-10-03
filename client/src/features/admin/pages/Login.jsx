import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Loader2,
  X,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../services/api";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, user } = useAuth();

  const [email, setEmail] = useState("admin@apnavidya.com");
  const [password, setPassword] = useState("Admin@12345");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "Student") {
        navigate("/student/dashboard", { replace: true });
      } else {
        navigate("/admin/dashboard", { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please provide both email and password.");
      return;
    }

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      const userRole = result.user?.role;
      if (userRole === "Student") {
        const destination =
          location.state?.from?.pathname &&
            !location.state.from.pathname.startsWith("/admin")
            ? location.state.from.pathname
            : "/student/dashboard";
        navigate(destination, { replace: true });
      } else {
        const destination =
          location.state?.from?.pathname &&
            !location.state.from.pathname.startsWith("/student")
            ? location.state.from.pathname
            : "/admin/dashboard";
        navigate(destination, { replace: true });
      }
    } else {
      setError(result.message);
    }
  };

  const handleFillAdmin = () => {
    setEmail("admin@apnavidya.com");
    setPassword("Admin@12345");
    setError("");
  };

  const handleFillStudent = () => {
    setEmail("student@apnavidya.com");
    setPassword("Student@12345");
    setError("");
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", { email: forgotEmail });
      setForgotMessage(res.data.message);
    } catch {
      setForgotMessage("Request processed. Please check your inbox if an account exists.");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-12 text-white flex-col justify-between">
        <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[#FD8006]/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FD8006] font-black text-white shadow-lg shadow-blue-500/30">
              AV
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight">
                ApnaVidya
              </span>
              <span className="block text-[13px] font-medium text-blue-300">
                Learn • Grow • Succeed
              </span>
            </div>
          </Link>
        </div>

        <div className="relative max-w-md">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-3.5 py-1 text-xs font-semibold text-blue-300">
            <Sparkles size={14} />
            Unified Learning & Management Portal
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight leading-tight sm:text-4xl">
            Empowering Learners & Educators Across India
          </h2>
          <p className="mt-3 text-[13px]m text-[13px]late-300 leading-relaxed">
            One single login gateway for enrolled students to access their live
            cohorts, curriculum, and certificates — and for faculty & staff to
            manage admissions, batches, and operations.
          </p>

          <div className="mt-8 space-y-3 text-xs font-medium text-[13px]late-200">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>Learners: Live classes, curriculum notes, fees & ISO certificates</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>Admins & Counselors: Leads pipeline, batches & tuition ledgers</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>Automatic role-based dashboard assignment upon verification</span>
            </div>
          </div>
        </div>

        <div className="relative text-xs text-[13px]late-400 flex items-center justify-between">
          <span>© 2026 ApnaVidya Edutech Pvt. Ltd.</span>
          <span>Security Protocol TLS 1.3</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="lg:hidden mb-6">
              <Link to="/" className="inline-flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FD8006] font-bold text-white">
                  AV
                </div>
                <span className="text-lg font-bold text-[13px]late-900">
                  ApnaVidya
                </span>
              </Link>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[13px]late-900 sm:text-3xl">
              Welcome back 👋
            </h1>
            <p className="mt-1 text-[13px]m text-[13px]late-500">
              Sign in to access your student portal or admin workspace.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700 animate-in fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[13px]late-700">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px]late-400"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@apnavidya.com"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-[13px]m text-[13px]late-800 placeholder-slate-400 shadow-2xs focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[13px]late-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email);
                    setForgotMessage("");
                    setForgotModalOpen(true);
                  }}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px]late-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-[13px]m text-[13px]late-800 placeholder-slate-400 shadow-2xs focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[13px]late-400 hover:text-[13px]late-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#FD8006] py-3 text-[13px]m font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-98 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-100/70 p-4">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-[13px]late-700">
                One-Click Demo Credentials
              </span>
            </div>
            <div className="gap-2">
              <button
                type="button"
                onClick={handleFillAdmin}
                className="flex flex-col items-start rounded-xl border border-slate-200 bg-white p-2.5 text-left hover:border-blue-500 hover:bg-blue-50/50 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-[13px]late-800 group-hover:text-blue-600">
                  <ShieldCheck size={14} className="text-blue-600" />
                  <span>Super Admin</span>
                </div>
                <span className="text-[12px] text-[13px]late-500 mt-1 font-mono">admin@apnavidya.com</span>
                <span className="text-[9px] font-bold text-blue-600 mt-1">Admin Dashboard →</span>
              </button>

              {/* <button
                type="button"
                onClick={handleFillStudent}
                className="flex flex-col items-start rounded-xl border border-slate-200 bg-white p-2.5 text-left hover:border-emerald-500 hover:bg-emerald-50/50 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-[13px]late-800 group-hover:text-emerald-600">
                  <GraduationCap size={14} className="text-emerald-600" />
                  <span>Student Learner</span>
                </div>
                <span className="text-[12px] text-[13px]late-500 mt-1 font-mono">student@apnavidya.com</span>
                <span className="text-[9px] font-bold text-emerald-600 mt-1">Student Portal →</span>
              </button> */}
            </div>
          </div>
        </div>
      </div>

      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-[13px]late-900">
                Reset Account Password
              </h3>
              <button
                type="button"
                onClick={() => setForgotModalOpen(false)}
                className="p-1 text-[13px]late-400 hover:text-[13px]late-600 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {forgotMessage ? (
              <div className="mt-4 space-y-4">
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 font-semibold">
                  {forgotMessage}
                </div>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(false)}
                  className="w-full rounded-xl bg-[#FD8006] py-2.5 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="mt-4 space-y-4">
                <p className="text-xs text-[13px]late-500">
                  Enter your registered account email. A secure reset link will
                  be dispatched.
                </p>
                <div>
                  <label className="text-xs font-semibold text-[13px]late-700 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-[13px]late-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
                    placeholder="name@apnavidya.com"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-[13px]late-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="rounded-xl bg-[#FD8006] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {forgotLoading ? "Sending..." : "Send Reset Link"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
