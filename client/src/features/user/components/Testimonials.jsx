import React, { useState, useEffect, useMemo } from "react";
import {
  Star,
  Quote,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Building,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import api from "../../../services/api";

const DEFAULT_TESTIMONIALS = [
  {
    id: 1,
    name: "Rohan Kulkarni",
    role: "Full Stack Engineer at Innovaccer",
    course: "Full Stack Development",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    review:
      "Coming from a non-CS background, I was terrified of learning React and Node.js. ApnaVidya's daily doubt clearance and mentor code reviews gave me the exact confidence I needed. Cracked a 9 LPA package within 5 months!",
    company: "Innovaccer",
  },
  {
    id: 2,
    name: "Ananya Deshmukh",
    role: "Frontend Developer at Razorpay",
    course: "Web Development",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    review:
      "The practical projects in the Web Dev course are genuinely industry-grade. The mentors don't just explain concepts, they teach how to debug like a senior engineer. Best investment I made in my career.",
    company: "Razorpay",
  },
  {
    id: 3,
    name: "Aditya Verma",
    role: "Scored 96.4% in CBSE Class 12 Boards",
    course: "School Curriculum",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80",
    review:
      "The chapter-wise formula cheat sheets and mock test evaluations pinpointed exactly where I was losing marks. My physics and maths marks improved dramatically in just 3 months!",
    company: "CBSE Topper",
  },
  {
    id: 4,
    name: "Pooja Sharma",
    role: "Data Analyst at Infosys",
    course: "Data Science & Python",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    review:
      "The structured curriculum covering SQL, Python, and Tableau helped me transition smoothly from non-tech to analytics. Highly recommended for beginners and working professionals!",
    company: "Infosys",
  },
  {
    id: 5,
    name: "Vikram Rathore",
    role: "Cloud Engineer at TCS",
    course: "DevOps & Cloud Computing",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    review:
      "Hands-on labs on AWS and Docker gave me real-world problem-solving skills. The mentors guided me through mock interviews until I felt 100% prepared.",
    company: "TCS",
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

const STORAGE_KEY = "apna_admin_testimonials";

const getStoredTestimonials = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter((t) => t.status === "Active" || !t.status);
      }
    }
  } catch (e) {
    console.warn("Could not read testimonials from localStorage", e);
  }
  return DEFAULT_TESTIMONIALS;
};

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState(getStoredTestimonials);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await api.get("/public/testimonials");
        if (
          res.data &&
          res.data.data &&
          Array.isArray(res.data.data.testimonials) &&
          res.data.data.testimonials.length > 0
        ) {
          setTestimonials(res.data.data.testimonials);
        } else if (
          res.data &&
          Array.isArray(res.data.testimonials) &&
          res.data.testimonials.length > 0
        ) {
          setTestimonials(res.data.testimonials);
        }
      } catch (err) {
        // Fallback to localStorage or defaults
        setTestimonials(getStoredTestimonials());
      }
    };

    fetchTestimonials();

    // Listen for updates from TestimonialsAdmin in same or other tab
    const handleUpdate = () => {
      setTestimonials(getStoredTestimonials());
    };

    window.addEventListener("apna_testimonials_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("apna_testimonials_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, testimonials.length - itemsPerPage);

  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(Math.max(0, maxIndex));
    }
  }, [maxIndex, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  // Auto-play timer (every 5.5 seconds)
  useEffect(() => {
    if (isPaused || maxIndex <= 0) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused, maxIndex, currentIndex]);

  // Touch Swipe handlers for mobile
  const minSwipeDistance = 50;

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
  };

  const totalDots = maxIndex + 1;

  return (
    <section
      className="relative overflow-hidden bg-slate-50 py-12 sm:py-16"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-4xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-100 px-3.5 py-1 text-xs font-semibold text-blue-600">
              <Sparkles size={13} className="text-[#FD8006]" />
              Real Student Stories
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Loved by Students,{" "}
              <span className="text-blue-600">Trusted by Parents</span>
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Hear from our alumni who transformed their knowledge, built industry-grade
              projects, and cracked their dream roles.
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2 self-start md:self-end">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-xs transition-all hover:bg-slate-100 hover:text-blue-600 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-xs transition-all hover:bg-slate-100 hover:text-blue-600 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Testimonials Carousel Track */}
        <div
          className="mt-9 overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-out -mx-3"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
            }}
          >
            {testimonials.map((item, idx) => (
              <div
                key={item.id || idx}
                className="shrink-0 px-3 flex"
                style={{ width: `${100 / itemsPerPage}%` }}
              >
                <div className="flex flex-col justify-between w-full rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60 hover:border-blue-200">
                  <div>
                    {/* Stars */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={15}
                          className={
                            i < (Number(item.rating) || 5)
                              ? "fill-amber-400 text-amber-400"
                              : "fill-slate-200 text-slate-200"
                          }
                        />
                      ))}
                    </div>

                    {/* Review Excerpt */}
                    <p className="mt-3 text-sm sm:text-[15px] leading-relaxed text-slate-600 italic line-clamp-4">
                      &ldquo;{item.review}&rdquo;
                    </p>
                  </div>

                  {/* Student Info Footer */}
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          item.avatar ||
                          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                        }
                        alt={item.name}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src =
                            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80";
                        }}
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-100 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                            {item.name}
                          </h4>
                          <CheckCircle2
                            size={13}
                            className="text-emerald-500 fill-emerald-50 shrink-0"
                            title="Verified Student"
                          />
                        </div>
                        <p className="text-xs text-blue-600 font-medium line-clamp-1">
                          {item.role || "Alumni"}
                        </p>
                        {item.course && (
                          <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 line-clamp-1">
                            <GraduationCap size={11} className="shrink-0" />
                            <span>{item.course}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Pagination Dots */}
        {totalDots > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {Array.from({ length: totalDots }).map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => setCurrentIndex(dotIdx)}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${currentIndex === dotIdx
                  ? "w-8 bg-[#FD8006]"
                  : "w-2.5 bg-slate-200 hover:bg-slate-300"
                  }`}
                aria-label={`Go to slide ${dotIdx + 1}`}
              />
            ))}
          </div>
        )}


      </div>
    </section>
  );
};

export default Testimonials;
