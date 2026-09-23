import React from "react";
import { ShieldCheck } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-12 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-widest">
            <ShieldCheck size={16} />
            Data Protection & Privacy
          </div>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-2 text-xs text-slate-400">
            Last Updated: September 2025 • Apna Vidya Private Limited
          </p>

          <div className="mt-8 space-y-8 text-sm leading-relaxed text-slate-600 border-t border-slate-100 pt-8">
            <section>
              <h2 className="text-base font-bold text-slate-900">
                1. Information We Collect
              </h2>
              <p className="mt-2">
                We collect personal information that you provide when registering
                for free demo classes, enrolling in training programs, subscribing
                to newsletters, or contacting student support. This includes your
                full name, email address, mobile number, educational background,
                and course preferences.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900">
                2. How We Use Your Information
              </h2>
              <p className="mt-2">
                Your data is used strictly to provide live classroom access,
                schedule 1-on-1 mentor sessions, process course certifications,
                deliver study notes, and communicate academic notices. We never
                sell, rent, or trade your personal data to third-party marketing
                agencies.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900">
                3. Security & Data Protection
              </h2>
              <p className="mt-2">
                We implement industry-standard 256-bit SSL encryption, secure
                database access controls, and regular vulnerability audits to
                protect your personal records against unauthorized access,
                alteration, or loss.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900">
                4. Cookies & Usage Analytics
              </h2>
              <p className="mt-2">
                We utilize essential session cookies and anonymous analytics to
                understand platform performance, optimize video streaming quality,
                and maintain your logged-in session preferences across visits.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900">
                5. Contact Our Privacy Officer
              </h2>
              <p className="mt-2">
                If you have questions regarding data privacy or wish to request
                data deletion, contact us at:{" "}
                <a
                  href="mailto:privacy@apnavidya.com"
                  className="font-bold text-blue-600 hover:underline"
                >
                  privacy@apnavidya.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
