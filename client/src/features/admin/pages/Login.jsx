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
  ArrowLeft,
  Loader2,
  X,
  GraduationCap,
  Sparkles,
} from "lucide-react";

import { useAuth } from "../../../context/AuthContext";
import { useSettings, sanitizeAssetUrl } from "../../../context/SettingsContext";
import defaultLogo from "../../../assets/apnavidya.png";
import api from "../../../services/api";


const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, user } = useAuth();
  const { settings } = useSettings();
  const logoSrc = sanitizeAssetUrl(settings.general?.logoUrl, defaultLogo);
  const siteName = settings.general?.siteName || "ApnaVidya";
  const tagline = settings.general?.tagline || "Learn • Grow • Succeed";


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
          <Link to="/" className="inline-flex items-center group" aria-label={`${siteName} Home`}>
            <div className="flex items-center rounded-2xl bg-white/95 px-4 py-2.5 shadow-xl shadow-black/20 backdrop-blur-sm border border-white/20 transition-all duration-200 group-hover:scale-[1.02] group-hover:bg-white">
              <img
                src={logoSrc}
                alt={`${siteName} Logo`}
                onError={(e) => {
                  if (e.currentTarget.src !== defaultLogo) {
                    e.currentTarget.src = defaultLogo;
                  }
                }}
                className="h-12 sm:h-14 w-auto max-w-[220px] object-contain"
              />
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
          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            One single login gateway for enrolled students to access their live
            cohorts, curriculum, and certificates — and for faculty & staff to
            manage admissions, batches, and operations.
          </p>

          <div className="mt-8 space-y-3 text-xs font-medium text-slate-200">
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

        <div className="relative text-xs text-slate-400 flex items-center justify-between">
          <span>© {new Date().getFullYear()} {siteName} Edutech Pvt. Ltd.</span>
          <span>Security Protocol TLS 1.3</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between p-4 sm:p-8 lg:p-12 lg:w-1/2 min-h-screen bg-slate-50/70 sm:bg-slate-50">
        {/* Mobile Top Navigation Bar */}
        <div className="lg:hidden flex items-center justify-between w-full max-w-md mx-auto pt-2 pb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:border-blue-400 shadow-2xs transition-all active:scale-95"
            aria-label="Back to Home"
          >
            <ArrowLeft size={14} className="text-slate-500" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Secure Portal</span>
          </div>
        </div>

        {/* Center Card for Form */}
        <div className="w-full max-w-md mx-auto my-auto py-2 sm:py-6">
          {/* Mobile Brand Logo */}
          <div className="lg:hidden mb-6 text-center sm:text-left flex flex-col items-center sm:items-start">
            <Link to="/" className="inline-flex items-center group" aria-label={`${siteName} Home`}>
              <div className="p-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs inline-flex items-center justify-center">
                <img
                  src={logoSrc}
                  alt={`${siteName} Logo`}
                  onError={(e) => {
                    if (e.currentTarget.src !== defaultLogo) {
                      e.currentTarget.src = defaultLogo;
                    }
                  }}
                  className="h-12 w-auto max-w-[210px] object-contain transition-transform duration-200 group-hover:scale-[1.02]"
                />
              </div>
            </Link>
          </div>

          <div className="rounded-3xl sm:rounded-none border border-slate-200/80 sm:border-0 bg-white sm:bg-transparent p-6 sm:p-0 shadow-sm sm:shadow-none">
            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Welcome back 👋
              </h1>
              <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">
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
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@apnavidya.com"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 shadow-2xs focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(email);
                      setForgotMessage("");
                      setForgotModalOpen(true);
                    }}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm text-slate-800 placeholder-slate-400 shadow-2xs focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FD8006] to-[#f97316] py-3 text-sm font-semibold text-white shadow-md shadow-orange-500/20 hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
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
          </div>
        </div>

        {/* Mobile Bottom Footer */}
        <div className="lg:hidden w-full max-w-md mx-auto pt-6 pb-2 text-center text-xs text-slate-400 border-t border-slate-200/60 flex items-center justify-between">
          <span>© {new Date().getFullYear()} {siteName}</span>
          <span>Security Protocol TLS 1.3</span>
        </div>
      </div>

      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Reset Account Password
              </h3>
              <button
                type="button"
                onClick={() => setForgotModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
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
                  className="w-full rounded-xl bg-[#FD8006] py-2.5 text-xs font-semibold text-white hover:bg-orange-600 cursor-pointer"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="mt-4 space-y-4">
                <p className="text-xs text-slate-500">
                  Enter your registered account email. A secure reset link will
                  be dispatched.
                </p>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
                    placeholder="name@apnavidya.com"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="rounded-xl bg-[#FD8006] px-4 py-2 text-xs font-semibold text-white hover:bg-orange-600 disabled:opacity-50 cursor-pointer"
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
