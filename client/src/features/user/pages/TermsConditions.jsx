import React from "react";
import { FileText } from "lucide-react";

const TermsConditions = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-12 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-widest">
            <FileText size={16} />
            User Agreement
          </div>
          <h1 className="mt-2 text-3xl font-extrabold text-[13px]late-900 sm:text-4xl">
            Terms & Conditions
          </h1>
          <p className="mt-2 text-xs text-[13px]late-400">
            Effective Date: September 2025 • ApnaVidya Private Limited
          </p>

          <div className="mt-8 space-y-8 text-[13px]m leading-relaxed text-[13px]late-600 border-t border-slate-100 pt-8">
            <section>
              <h2 className="text-base font-bold text-[13px]late-900">
                1. Acceptance of Terms
              </h2>
              <p className="mt-2">
                By accessing ApnaVidya’s website, registering for courses, or
                participating in live demo classes, you agree to comply with
                these Terms and Conditions and our Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-[13px]late-900">
                2. Academic Code of Conduct
              </h2>
              <p className="mt-2">
                Students are expected to maintain professionalism during live
                sessions. Plagiarism, disruptive behavior in community forums,
                unauthorized sharing of course credentials, or piracy of digital
                learning materials is strictly prohibited and subject to
                account termination.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-[13px]late-900">
                3. Intellectual Property Rights
              </h2>
              <p className="mt-2">
                All video lectures, notes, project repositories, logos, and
                curriculum blueprints are proprietary assets of ApnaVidya.
                Students are granted a personal, non-transferable license to
                access materials for their individual learning.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-[13px]late-900">
                4. Course Certification & Verification
              </h2>
              <p className="mt-2">
                Certificates of completion are awarded strictly upon fulfilling
                minimum attendance criteria and passing required project
                evaluations as stipulated by the mentor team.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-[13px]late-900">
                5. Governing Law & Jurisdiction
              </h2>
              <p className="mt-2">
                These terms are governed by the laws of India. Any disputes
                arising out of platform usage shall be subject to the exclusive
                jurisdiction of courts in New Delhi / Noida.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
