import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "Who can enroll in ApnaVidya courses?",
    a: "Anyone with an enthusiasm to learn! Whether you are a school student in Classes 8-12 preparing for boards, a college student aiming for your first tech job, or a working professional looking to upskill into Full Stack or AI, our roadmaps are tailored for all backgrounds.",
  },
  {
    q: "Are the classes live or pre-recorded?",
    a: "All core lectures are conducted 100% LIVE by experienced industry mentors. You can ask doubts directly on voice and chat. If you miss a class, high-definition recordings and lesson notes are automatically saved to your student dashboard for lifetime access.",
  },
  {
    q: "How does the Free Demo Class work?",
    a: "Booking a demo class is completely free and requires no payment details. Once you submit the demo request, our academic counselor connects with you, assigns a mentor in your domain of interest, and shares the live session link.",
  },
  {
    q: "Is the certificate verified and recognized?",
    a: "Yes. Every student who completes the coursework and capstone project receives an ISO 9001:2015 verified certificate with a unique verification code that can be authenticated online by employers anytime.",
  },
  {
    q: "Do you provide placement and job assistance?",
    a: "Yes. Our dedicated career cell provides resume reviews, LinkedIn optimization, mock technical interview drills, and connects qualified students with our network of 120+ hiring partner companies.",
  },
  {
    q: "What if I have doubts outside class hours?",
    a: "We have dedicated daily doubt resolution windows and an active student mentor community where teaching assistants answer queries within 2 hours.",
  },
];

const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(0);

  const toggle = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-7">
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-600">
            <HelpCircle size={14} />
            Got Questions?
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[13px]late-900 sm:text-4xl">
            Frequently Asked <span className="text-blue-600">Questions</span>
          </h2>
          <p className="mt-3 text-[13px]m text-[13px]late-500 sm:text-base">
            Everything you need to know about our teaching format, mentors,
            certifications, and demo classes.
          </p>
        </div>

        <div className="mt-12 space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="flex w-full items-center justify-between p-5 sm:p-6 text-left"
                >
                  <span className="text-base font-bold text-[13px]late-900 pr-4">
                    {faq.q}
                  </span>
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[13px]late-600 transition-transform duration-200 ${isOpen ? "rotate-180 bg-blue-50 text-blue-600" : ""
                      }`}
                  >
                    <ChevronDown size={18} />
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-slate-100 bg-slate-50/60 p-5 sm:p-6 pt-4 text-[13px]m leading-relaxed text-[13px]late-600">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
