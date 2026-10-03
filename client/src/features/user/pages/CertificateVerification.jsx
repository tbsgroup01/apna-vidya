import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ShieldCheck,
  Search,
  Award,
  CheckCircle2,
  Calendar,
  User,
  BookOpen,
  FileCheck2,
  AlertCircle,
  Printer,
  Copy,
  Check,
} from "lucide-react";

const sampleCertificates = {
  "AVTC-2025-01": {
    id: "AVTC-2025-01",
    studentName: "Eleanor Jane Ramsey",
    course: "Full Stack Web Development",
    issueDate: "November 14, 2025",
    grade: "Distinction (96%)",
    status: "Verified & Active",
    verificationAuthority: "ApnaVidya Academic Council (ISO 9001:2015)",
    instructor: "Dr. Elizabeth Vance (Lead Academic Director)",
  },
  "AVTC-2025-02": {
    id: "AVTC-2025-02",
    studentName: "Alexander James Reed",
    course: "Advanced Data Analytics & AI",
    issueDate: "September 28, 2025",
    grade: "Grade A+ (94%)",
    status: "Verified & Active",
    verificationAuthority: "ApnaVidya Academic Council (ISO 9001:2015)",
    instructor: "Dr. Evelyn Moore & Prof. David Chen",
  },
  "AVTC-2025-03": {
    id: "AVTC-2025-03",
    studentName: "Eleanor Grace Vance",
    course: "Cloud Architecture & Full Stack",
    issueDate: "October 15, 2025",
    grade: "Distinction (98%)",
    status: "Verified & Active",
    verificationAuthority: "ApnaVidya Academic Council (ISO 9001:2015)",
    instructor: "Dr. Alistair J. Croft (Honors Committee Chair)",
  },
  "AVTC-2025-04": {
    id: "AVTC-2025-04",
    studentName: "Amit Kumar",
    course: "Microsoft Power Platform & Cloud Solutions",
    issueDate: "August 20, 2025",
    grade: "Mastery Level (95%)",
    status: "Verified & Active",
    verificationAuthority: "ApnaVidya Academic Council & Tech Laureate",
    instructor: "Vikramaditya Sen (Enterprise Mentor)",
  },
  "AV-2025-0842": {
    id: "AV-2025-0842",
    studentName: "Aman Kumar Sharma",
    course: "Full Stack Development",
    issueDate: "September 10, 2025",
    grade: "Distinction (94%)",
    status: "Verified & Active",
    verificationAuthority: "ApnaVidya Academic Council (ISO 9001:2015)",
    instructor: "Amit Verma (Lead Tech Mentor)",
  },
  "AV-2025-0914": {
    id: "AV-2025-0914",
    studentName: "Pooja Deshmukh",
    course: "Web Development",
    issueDate: "August 24, 2025",
    grade: "Grade A+ (91%)",
    status: "Verified & Active",
    verificationAuthority: "ApnaVidya Academic Council (ISO 9001:2015)",
    instructor: "Rajesh Mehrotra (Systems Architect)",
  },
  "AV-2025-0720": {
    id: "AV-2025-0720",
    studentName: "Karan Johar Patel",
    course: "Modern Web Development",
    issueDate: "September 15, 2025",
    grade: "Grade A (89%)",
    status: "Verified & Active",
    verificationAuthority: "ApnaVidya Academic Council (ISO 9001:2015)",
    instructor: "Amitabh Roy (Lead Instructor)",
  },
  "AV-2025-0611": {
    id: "AV-2025-0611",
    studentName: "Neha Chawla",
    course: "Data Science & Artificial Intelligence",
    issueDate: "September 02, 2025",
    grade: "Grade A+ (95%)",
    status: "Verified & Active",
    verificationAuthority: "ApnaVidya Academic Council (ISO 9001:2015)",
    instructor: "Er. Neha Kashyap (AI Mentor)",
  },
};

const CertificateVerification = () => {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get("id") || "AVTC-2025-01";
  const [certId, setCertId] = useState(initialId);
  const [result, setResult] = useState(
    sampleCertificates[initialId.toUpperCase()] || sampleCertificates["AVTC-2025-01"]
  );
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const urlId = searchParams.get("id");
    if (urlId) {
      const formatted = urlId.trim().toUpperCase();
      setCertId(formatted);
      if (sampleCertificates[formatted]) {
        setResult(sampleCertificates[formatted]);
        setNotFound(false);
      } else {
        setResult(null);
        setNotFound(true);
      }
    }
  }, [searchParams]);

  const handleVerify = (e) => {
    if (e) e.preventDefault();
    const formatted = certId.trim().toUpperCase();
    if (sampleCertificates[formatted]) {
      setResult(sampleCertificates[formatted]);
      setNotFound(false);
    } else {
      setResult(null);
      setNotFound(true);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-600 border border-blue-100">
            <ShieldCheck size={15} />
            Instant Authenticity Check
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Certificate <span className="text-blue-600">Verification</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Employers, recruiters, and institutions can authenticate ApnaVidya
            course completion credentials by entering the unique Certificate ID.
          </p>
        </div>

        <div className="mt-10 mx-auto max-w-2xl">
          <form
            onSubmit={handleVerify}
            className="flex flex-col sm:flex-row gap-3 rounded-2xl bg-white p-3 border border-slate-200/90 shadow-xl shadow-slate-200/50"
          >
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                required
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                placeholder="Enter Certificate ID (e.g. AVTC-2025-01 or AV-2025-0842)"
                className="w-full rounded-xl bg-slate-50 py-3.5 pl-11 pr-4 text-sm font-semibold uppercase text-slate-800 placeholder:normal-case placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-[#FD8006] px-6 py-3.5 text-sm font-bold text-white hover:bg-orange-600 transition-colors shadow-md cursor-pointer"
            >
              Verify Credential
            </button>
          </form>

          <p className="mt-3 text-center text-xs text-slate-400 flex flex-wrap items-center justify-center gap-2">
            <span>Try sample IDs:</span>
            {["AVTC-2025-01", "AVTC-2025-02", "AVTC-2025-03", "AV-2025-0842"].map((id) => (
              <span
                key={id}
                onClick={() => {
                  setCertId(id);
                  setResult(sampleCertificates[id]);
                  setNotFound(false);
                }}
                className="cursor-pointer font-mono font-bold text-blue-600 hover:underline bg-blue-50 px-2 py-0.5 rounded"
              >
                {id}
              </span>
            ))}
          </p>
        </div>

        {notFound && (
          <div className="mt-10 mx-auto max-w-xl rounded-2xl border border-red-200 bg-red-50 p-6 text-center animate-in fade-in">
            <AlertCircle size={32} className="mx-auto text-red-500" />
            <h3 className="mt-2 text-base font-bold text-red-900">
              Certificate Not Found
            </h3>
            <p className="mt-1 text-xs text-red-700">
              No active certificate matches &ldquo;{certId}&rdquo;. Please verify
              the spelling or contact our verification team at
              verify@apnavidya.com.
            </p>
          </div>
        )}

        {result && (
          <div className="mt-10 mx-auto max-w-2xl rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-xl shadow-slate-200/50 animate-in fade-in zoom-in-95">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-6 gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={26} />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    Officially Verified Credential
                  </h3>
                  <p className="text-xs text-emerald-600 font-semibold">
                    Valid Record in ApnaVidya Central Registry
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  title="Copy Certificate ID"
                >
                  {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                  <span>{copied ? "Copied" : "Copy ID"}</span>
                </button>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 w-fit">
                  {result.status}
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 text-xs sm:text-sm">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-slate-400 font-medium">Student Name</p>
                <p className="mt-1 font-extrabold text-slate-900 text-base">
                  {result.studentName}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-slate-400 font-medium">Course Program</p>
                <p className="mt-1 font-extrabold text-slate-900 text-base">
                  {result.course}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-slate-400 font-medium">Certificate ID</p>
                <p className="mt-1 font-mono font-bold text-blue-600">
                  {result.id}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-slate-400 font-medium">Issue Date</p>
                <p className="mt-1 font-bold text-slate-800">
                  {result.issueDate}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-slate-400 font-medium">Performance Grade</p>
                <p className="mt-1 font-bold text-slate-800">{result.grade}</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-slate-400 font-medium">Certified Mentor</p>
                <p className="mt-1 font-bold text-slate-800">
                  {result.instructor}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 pt-5 text-xs text-slate-500 gap-3">
              <span>Issued under authority of {result.verificationAuthority}.</span>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold px-3 py-1.5 cursor-pointer transition-colors"
              >
                <Printer size={13} />
                <span>Print Record</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateVerification;
