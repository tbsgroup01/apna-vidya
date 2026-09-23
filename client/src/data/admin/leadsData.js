export const initialLeads = [
  {
    id: "LD-1001",
    name: "Aarav Sharma",
    phone: "+91 98765 43210",
    email: "aarav.sharma@gmail.com",
    course: "Full Stack Development",
    source: "Demo Class",
    status: "Interested",
    assignedTo: "Priya Malhotra",
    createdAt: "2026-09-21T10:30:00",
    city: "New Delhi",
    qualification: "B.Tech CSE (3rd Year)",
    notes: [
      { id: 1, author: "Priya Malhotra", text: "Attended demo class. Highly impressed with React live coding module.", date: "2026-09-21 15:40" },
      { id: 2, author: "Priya Malhotra", text: "Discussed installment fee options. Requested callback tomorrow.", date: "2026-09-21 16:15" },
    ],
    timeline: [
      { id: 1, action: "Lead Created", detail: "Registered via free demo booking modal", date: "2026-09-21 10:30" },
      { id: 2, action: "Contacted", detail: "Introductory WhatsApp info pack sent", date: "2026-09-21 11:00" },
      { id: 3, action: "Attended Demo", detail: "60-min interactive trial session completed", date: "2026-09-21 14:00" },
    ]
  },
  {
    id: "LD-1002",
    name: "Sneha Mukherjee",
    phone: "+91 98234 56789",
    email: "sneha.m@outlook.com",
    course: "Data Science & AI",
    source: "Course Enquiry",
    status: "New",
    assignedTo: "Rahul Sen",
    createdAt: "2026-09-22T08:15:00",
    city: "Kolkata",
    qualification: "B.Sc Statistics",
    notes: [],
    timeline: [
      { id: 1, action: "Lead Created", detail: "Form submission on Course Details page", date: "2026-09-22 08:15" }
    ]
  },
  {
    id: "LD-1003",
    name: "Vikram Chauhan",
    phone: "+91 97123 45678",
    email: "vikram.chauhan@gmail.com",
    course: "Web Development",
    source: "Contact Form",
    status: "Follow-up",
    assignedTo: "Priya Malhotra",
    createdAt: "2026-09-19T14:20:00",
    city: "Jaipur",
    qualification: "BCA Graduate",
    notes: [
      { id: 1, author: "Priya Malhotra", text: "Wants weekend batch due to ongoing internship.", date: "2026-09-20 11:30" }
    ],
    timeline: [
      { id: 1, action: "Lead Created", detail: "Contact inquiry regarding batch timings", date: "2026-09-19 14:20" },
      { id: 2, action: "Call Attempted", detail: "Follow-up phone discussion completed", date: "2026-09-20 11:30" }
    ]
  },
  {
    id: "LD-1004",
    name: "Meera Krishnan",
    phone: "+91 99887 76655",
    email: "meera.krishnan@yahoo.com",
    course: "Full Stack Development",
    source: "Homepage",
    status: "Converted",
    assignedTo: "Rahul Sen",
    createdAt: "2026-09-15T11:00:00",
    city: "Chennai",
    qualification: "MCA",
    notes: [
      { id: 1, author: "Rahul Sen", text: "Admission confirmed. Paid token fee ₹5,000.", date: "2026-09-18 16:00" }
    ],
    timeline: [
      { id: 1, action: "Lead Created", detail: "Submitted homepage CTA form", date: "2026-09-15 11:00" },
      { id: 2, action: "Counseling", detail: "Course syllabus and roadmap discussed", date: "2026-09-16 12:30" },
      { id: 3, action: "Converted", detail: "Enrolled in Batch FS-OCT-26", date: "2026-09-18 16:00" }
    ]
  },
  {
    id: "LD-1005",
    name: "Tanmay Bansal",
    phone: "+91 94567 89012",
    email: "tanmay.b@gmail.com",
    course: "Programming & Coding",
    source: "Demo Class",
    status: "Contacted",
    assignedTo: "Priya Malhotra",
    createdAt: "2026-09-20T16:45:00",
    city: "Bhopal",
    qualification: "Class 12th Completed",
    notes: [],
    timeline: [
      { id: 1, action: "Lead Created", detail: "Demo booked for C++ and DSA", date: "2026-09-20 16:45" },
      { id: 2, action: "Contacted", detail: "Counselor called to verify demo attendance", date: "2026-09-21 10:15" }
    ]
  },
  {
    id: "LD-1006",
    name: "Divya Nambiar",
    phone: "+91 96325 87410",
    email: "divya.n@gmail.com",
    course: "Mobile App Development",
    source: "Course Enquiry",
    status: "Interested",
    assignedTo: "Rahul Sen",
    createdAt: "2026-09-18T13:10:00",
    city: "Bengaluru",
    qualification: "B.Tech ECE",
    notes: [
      { id: 1, author: "Rahul Sen", text: "Interested in Flutter and React Native tracks.", date: "2026-09-19 14:00" }
    ],
    timeline: [
      { id: 1, action: "Lead Created", detail: "Course inquiry received", date: "2026-09-18 13:10" }
    ]
  },
  {
    id: "LD-1007",
    name: "Rishabh Jain",
    phone: "+91 91234 56789",
    email: "rishabh.jain@live.com",
    course: "Full Stack Development",
    source: "Other",
    status: "Not Interested",
    assignedTo: "Priya Malhotra",
    createdAt: "2026-09-14T09:30:00",
    city: "Indore",
    qualification: "Diploma IT",
    notes: [
      { id: 1, author: "Priya Malhotra", text: "Looking for offline classroom coaching only.", date: "2026-09-15 11:20" }
    ],
    timeline: [
      { id: 1, action: "Lead Created", detail: "Referral from alumni", date: "2026-09-14 09:30" },
      { id: 2, action: "Closed", detail: "Prefers offline classroom coaching", date: "2026-09-15 11:20" }
    ]
  },
  {
    id: "LD-1008",
    name: "Anjali Saxena",
    phone: "+91 98989 12121",
    email: "anjali.saxena@gmail.com",
    course: "Web Development",
    source: "Demo Class",
    status: "New",
    assignedTo: "Rahul Sen",
    createdAt: "2026-09-22T11:05:00",
    city: "Lucknow",
    qualification: "B.Com, Transitioning to Tech",
    notes: [],
    timeline: [
      { id: 1, action: "Lead Created", detail: "Requested free demo booking", date: "2026-09-22 11:05" }
    ]
  }
];
