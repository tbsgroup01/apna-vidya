import React from "react";
import { RefreshCw, CheckCircle2 } from "lucide-react";

const RefundPolicy = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-12 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-widest">
            <RefreshCw size={16} />
            Student Protection
          </div>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Refund & Cancellation Policy
          </h1>
          <p className="mt-2 text-xs text-slate-400">
            Last Updated: September 2025 • Apna Vidya
          </p>

          <div className="mt-6 rounded-2xl bg-blue-50/80 border border-blue-100 p-5 text-xs sm:text-sm text-blue-900">
            <p className="font-bold flex items-center gap-2">
              <CheckCircle2 size={18} className="text-blue-600" />
              100% Risk-Free Guarantee:
            </p>
            <p className="mt-1 leading-relaxed text-blue-800">
              We offer a no-questions-asked 7-day money-back guarantee for all
              full-length paid cohort programs. If you feel the course is not
              right for you within the first 7 calendar days of batch start, we
              will refund your entire tuition.
            </p>
          </div>

          <div className="mt-8 space-y-8 text-sm leading-relaxed text-slate-600 border-t border-slate-100 pt-8">
            <section>
              <h2 className="text-base font-bold text-slate-900">
                1. 7-Day Money-Back Period
              </h2>
              <p className="mt-2">
                Eligible students can submit a refund request within 7 calendar
                days from their official batch start date. The request must be
                sent via email to refunds@apnavidya.com from your registered email
                address.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900">
                2. Processing & Timelines
              </h2>
              <p className="mt-2">
                Once verified by our finance desk, your refund will be processed
                back to the original mode of payment (UPI, NetBanking, Credit Card)
                within 5 to 7 working banking days.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900">
                3. Non-Refundable Scenarios
              </h2>
              <p className="mt-2">
                Refunds are not granted after the 7-day window has expired, or if
                the student has attended more than 30% of scheduled batch hours or
                downloaded exclusive proprietary capstone project codebases.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900">
                4. Batch Transfer & Deferral Option
              </h2>
              <p className="mt-2">
                If college exams or medical emergencies prevent you from
                completing your enrolled batch, you can request a 1-time free
                transfer to the following month’s batch by notifying student
                support.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
