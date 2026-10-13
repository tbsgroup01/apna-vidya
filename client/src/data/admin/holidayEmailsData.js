export const holidayEmailStats = {
  scheduled: 2,
  sent: 14,
  draft: 3,
  failed: 0,
};

export const initialHolidayEmails = [
  {
    id: "EML-101",
    holidayName: "Gandhi Jayanti",
    date: "2026-10-02",
    subject: "APNAVIDYA Holiday Notice: Gandhi Jayanti Class Schedule",
    recipients: "All Active Students",
    recipientCount: 1420,
    status: "Scheduled",
    scheduledFor: "2026-10-01 10:00 AM",
    content: "Dear Students, Warm greetings! Please be advised that live sessions will remain suspended on October 2nd in observance of Gandhi Jayanti. Regular schedule resumes Saturday.",
    author: "Admin Operations"
  },
  {
    id: "EML-102",
    holidayName: "Dussehra & Vijayadashami",
    date: "2026-10-20",
    subject: "Happy Dussehra! Important Announcement on Live Batches",
    recipients: "All Active Students",
    recipientCount: 1420,
    status: "Draft",
    scheduledFor: "",
    content: "Wishing you and your family a triumphant Dussehra! Classes will be recorded and accessible on your LMS.",
    author: "Admin Operations"
  },
  {
    id: "EML-103",
    holidayName: "Independence Day",
    date: "2026-08-15",
    subject: "Happy 80th Independence Day from APNAVIDYA!",
    recipients: "All Students & Alumni",
    recipientCount: 5240,
    status: "Sent",
    scheduledFor: "2026-08-14 09:00 AM",
    content: "Celebrating the spirit of freedom, education, and innovation across our nation. Exclusive alumni discounts valid till Sunday.",
    author: "Marketing & Operations"
  },
  {
    id: "EML-104",
    holidayName: "Raksha Bandhan Special",
    date: "2026-08-28",
    subject: "Raksha Bandhan Wishes & Tech Education Voucher",
    recipients: "All Students",
    recipientCount: 3800,
    status: "Sent",
    scheduledFor: "2026-08-27 11:30 AM",
    content: "Celebrate Raksha Bandhan by gifting knowledge! Avail 25% off on sibling course enrollments.",
    author: "Marketing Team"
  }
];
