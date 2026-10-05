import React from "react";
import { Star, Quote, CheckCircle2 } from "lucide-react";

const testimonials = [
  {
    name: "Rohan Kulkarni",
    role: "Full Stack Engineer at Innovaccer",
    course: "Full Stack Development",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    review:
      "Coming from a non-CS background, I was terrified of learning React and Node.js. ApnaVidya's daily doubt clearance and mentor code reviews gave me the exact confidence I needed. Cracked a 9 LPA package within 5 months!",
  },
  {
    name: "Ananya Deshmukh",
    role: "Frontend Developer at Razorpay",
    course: "Web Development",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    review:
      "The practical projects in the Web Dev course are genuinely industry-grade. The mentors don't just explain concepts, they teach how to debug like a senior engineer. Best investment I made in my career.",
  },
  {
    name: "Aditya Verma",
    role: "Scored 96.4% in CBSE Class 12 Boards",
    course: "School Curriculum",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80",
    review:
      "The chapter-wise formula cheat sheets and mock test evaluations pinpointed exactly where I was losing marks. My physics and maths marks improved dramatically in just 3 months!",
  },
];

const hiringPartners = [
  "Tata Consultancy Services",
  "Infosys",
  "Razorpay",
  "Zomato",
  "Cognizant",
  "Swiggy",
];

const Testimonials = () => {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-16 sm:py-20 lg:py-7">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-600">
            Real Student Stories
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[13px]late-900 sm:text-4xl">
            Loved by Students,{" "}
            <span className="text-blue-600">Trusted by Parents</span>
          </h2>
          <p className="mt-3 text-base text-[13px]late-600">
            Hear from our alumni who transformed their knowledge, built projects,
            and cracked their dream roles.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className="fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <Quote size={24} className="text-blue-200" />
                </div>
                <p className="mt-4 text-[13px]m leading-relaxed text-[13px]late-600">
                  &ldquo;{item.review}&rdquo;
                </p>
              </div>

              <div className="mt-6 flex items-center gap-3.5 border-t border-slate-100 pt-4">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="h-11 w-11 rounded-full object-cover ring-2 ring-blue-100"
                />
                <div>
                  <h4 className="text-[13px]m font-bold text-[13px]late-900">
                    {item.name}
                  </h4>
                  <p className="text-xs text-blue-600 font-medium">{item.role}</p>
                  <p className="text-[13px] text-[13px]late-400">{item.course}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* <div className="mt-16 rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-[13px]late-400">
            Our Alumni Work At Leading Companies
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {hiringPartners.map((partner, idx) => (
              <span
                key={idx}
                className="text-[13px]m font-bold text-[13px]late-600 transition-colors hover:text-blue-600 sm:text-base"
              >
                {partner}
              </span>
            ))}
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default Testimonials;
