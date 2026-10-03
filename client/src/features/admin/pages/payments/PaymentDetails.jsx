import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Printer,
  CheckCircle2,
  Mail,
  Loader2,
} from "lucide-react";
import PageHeader from "../../components/PageHeader";
import StatusBadge from "../../components/StatusBadge";
import logo from "../../../../assets/apnavidya.png";
import api from "../../../../services/api";

const WhatsAppIcon = ({ size = 15, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.53c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.77 2.7 4.29 3.78.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.3z" />
  </svg>
);

const PaymentDetails = () => {
  const { id } = useParams();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        setLoading(true);
        const stuId = id ? id.replace(/\D/g, "") : null;
        if (stuId) {
          const res = await api.get(`/admin/students/${stuId}`);
          if (res.data?.data?.student) {
            const s = res.data.data.student;
            const paid = Number(s.paidFees || 0);
            const total = Number(s.totalFees || 0);
            const pending = Number(s.pendingFees || 0);
            setPayment({
              id: `PAY-${String(s.id).padStart(4, "0")}`,
              invoiceId: `INV-2026-${String(s.id).padStart(4, "0")}`,
              studentId: s.id,
              studentName: s.name,
              studentEmail: s.email,
              studentPhone: s.phone,
              studentAddress: s.address || "New Delhi, India",
              course: s.enrolledCourses?.[0]?.name || "Standard Curriculum",
              batch: s.enrolledBatches?.[0]?.name || "Regular Batch",
              batchName: s.enrolledBatches?.[0]?.name || "Regular Live Batch",
              courseDuration: s.enrolledCourses?.[0]?.duration || "6 Months",
              amount: paid,
              totalFees: total,
              pendingFees: pending,
              remainingBalance: pending,
              method: "Online / Bank Transfer",
              date: s.admissionDate || (s.createdAt ? new Date(s.createdAt).toISOString().split("T")[0] : "Recent"),
              doj: s.admissionDate || (s.createdAt ? new Date(s.createdAt).toISOString().split("T")[0] : "Recent"),
              status: s.paymentStatus || (pending === 0 && paid > 0 ? "Paid" : "Pending"),
              rollNo: s.registrationNumber || `AV-STU-${String(s.id).padStart(4, "0")}`,
              nextDueDate: pending === 0 ? "N/A (Fully Cleared)" : "Upcoming Cycle",
              lateFee: "₹0 (Nil)",
            });
            return;
          }
        }
      } catch (err) {
        console.error("Failed to fetch payment details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPaymentDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="py-12 text-center">
        <h3 className="text-base font-bold text-slate-800">Receipt Not Found</h3>
        <p className="mt-1 text-xs text-slate-400">The requested fee payment or invoice record does not exist.</p>
        <Link
          to="/admin/payments"
          className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#FD8006] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
        >
          <ArrowLeft size={14} />
          <span>Back to Payments</span>
        </Link>
      </div>
    );
  }

  const rollNo = payment.rollNo;
  const batchName = payment.batchName;
  const courseDuration = payment.courseDuration;
  const dojFormatted = payment.doj;
  const remainingBalance = payment.remainingBalance;
  const nextDueDate = payment.nextDueDate;
  const lateFee = payment.lateFee;

  const studentPhone = payment.studentPhone || "";
  const digits = studentPhone.replace(/\D/g, "");
  const waNumber = digits.length === 10 ? `91${digits}` : digits;
  const publicReceiptUrl = `${window.location.origin}/apna-vidya/receipt/${payment.id}`;

  const shareText =
    `*ApnaVidya - Official Fee Receipt*\n\n` +
    `Hello ${payment.studentName},\n` +
    `Here are your payment voucher details:\n\n` +
    `• *Receipt No:* ${payment.id}\n` +
    `• *Roll No:* ${rollNo}\n` +
    `• *Program:* ${payment.course}\n` +
    `• *Course Duration:* ${courseDuration}\n` +
    `• *Date of Joining (DOJ):* ${dojFormatted}\n` +
    `• *Amount Paid:* ₹${payment.amount.toLocaleString()}\n` +
    `• *Remaining Balance:* ₹${remainingBalance.toLocaleString()}\n` +
    `• *Late Fee:* ${lateFee}\n` +
    `• *Transaction Ref:* ${payment.transactionRef}\n\n` +
    `Thank you for choosing ApnaVidya!`;

  const waShareUrl = waNumber
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent(shareText)}`
    : `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  const emailShareUrl = `mailto:${payment.studentEmail || ""}?subject=${encodeURIComponent(
    `Official Fee Receipt: ${payment.id} - ApnaVidya`
  )}&body=${encodeURIComponent(shareText)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-5 max-w-3xl mx-auto print:max-w-none print:w-full print:m-0 print:p-0 print:space-y-0">
      <div className="print:hidden">
        <PageHeader
          title={`Fee Receipt: ${payment.id}`}
          description={`Official digital transaction voucher generated for ${payment.studentName}`}
          breadcrumbs={[
            { label: "Payments", path: "/admin/payments" },
            { label: payment.id },
          ]}
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/admin/students"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
              >
                <ArrowLeft size={15} />
                <span>Back</span>
              </Link>


              <a
                href={waShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all shadow-2xs cursor-pointer active:scale-95"
                title="Share Receipt via WhatsApp"
              >
                <WhatsAppIcon size={14} />
                <span>Share WhatsApp</span>
              </a>


              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#FD8006] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all cursor-pointer"
              >
                <Printer size={15} />
                <span>Print Receipt</span>
              </button>
            </div>
          }
        />
      </div>

      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-3.5 print:border print:border-slate-300 print:rounded-2xl print:shadow-none print:p-6 print:m-0 print:w-full print:space-y-3">
        {/* Company Header with Official Logo, NO GSTIN line, compact gap */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="ApnaVidya Logo"
              className="h-11 sm:h-12 w-auto object-contain shrink-0"
            />

          </div>

          <div className="text-right">
            <span className="font-mono text-xs font-bold text-slate-400 block">
              {payment.invoiceId}
            </span>
            <div className="mt-1">
              <StatusBadge status={payment.status} />
            </div>
          </div>
        </div>

        {/* Student & Voucher Details with Roll No, DOJ, Batch Name, Duration, Next Due Date, Late Fee, Remaining Balance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Billed To Student
            </p>
            <p className="text-sm font-bold text-slate-900">{payment.studentName}</p>
            <p className="text-slate-500">{payment.studentEmail}</p>
            <p className="text-slate-700">
              <span className="text-slate-400 font-medium">Roll No:</span>{" "}
              <span className="font-mono font-bold text-slate-900">{rollNo}</span>
            </p>
            <div className="mt-2 pt-2 border-t border-slate-100/80 space-y-1">
              <p className="text-slate-700">
                <span className="text-slate-400 font-medium">DOJ:</span>{" "}
                <span className="font-mono text-slate-800">{dojFormatted}</span>
              </p>
              <p className="text-slate-700">
                <span className="text-slate-400 font-medium">Batch Name:</span>{" "}
                <span className="font-semibold text-slate-800">{batchName}</span>
              </p>
              <p className="text-slate-700">
                <span className="text-slate-400 font-medium">Course Duration:</span>{" "}
                <span className="text-slate-800">{courseDuration}</span>
              </p>
            </div>
          </div>

          {/* <div className="text-left sm:text-right space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Payment Voucher Details
            </p>
            <p className="font-mono text-slate-700">
              Receipt No: <span className="font-bold text-slate-900">{payment.id}</span>
            </p>
            <p className="text-slate-500">Date: {payment.date}</p>
            <p className="text-slate-500">Method: {payment.method}</p>
            <p className="font-mono text-[11px] text-slate-400 truncate mt-0.5">
              Ref: {payment.transactionRef}
            </p>
            <div className="mt-2 pt-2 border-t border-slate-100/80 space-y-1">
              <p className="text-slate-700">
                <span className="text-slate-400 font-medium">Next Due Date:</span>{" "}
                <span className="font-semibold text-amber-700">{nextDueDate}</span>
              </p>
              <p className="text-slate-700">
                <span className="text-slate-400 font-medium">Late Fee (if any):</span>{" "}
                <span className="text-slate-700 font-mono">{lateFee}</span>
              </p>
              <p className="text-slate-700">
                <span className="text-slate-400 font-medium">Remaining Balance:</span>{" "}
                <span className="font-bold font-mono text-rose-600">
                  ₹{remainingBalance.toLocaleString()}
                </span>
              </p>
            </div>
          </div> */}
        </div>

        {/* Program / Fee Table */}
        <div className="border border-slate-200/80 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50/75 text-xs font-bold uppercase text-slate-600">
              <tr>
                <th className="p-3">Description / Program</th>
                <th className="p-3 text-center">Batch & Duration</th>
                <th className="p-3 text-right">Amount Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-3">
                  <p className="font-bold text-slate-900 text-sm">{payment.course}</p>
                  <p className="text-xs text-slate-500">
                    Tuition Installment • Live Mentorship & LMS Access
                  </p>
                </td>
                <td className="p-3 text-center">
                  <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 font-semibold text-slate-700 text-xs">
                    {batchName}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">{courseDuration}</p>
                </td>
                <td className="p-3 text-right font-mono font-bold text-slate-900 text-sm">
                  ₹{payment.amount.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Summary Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center border-t border-slate-100 pt-3">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-600 font-semibold text-xs">
              <CheckCircle2 size={25} />
              <span className="text-emerald-700 font-bold text-xl">Paid</span>
            </div>

          </div>

          <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-100 text-xs space-y-1.5">
            <div className="flex justify-between text-slate-600">
              <span>Installment Amount Paid:</span>
              <span className="font-mono font-bold text-slate-900">
                ₹{payment.amount.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Remaining Balance:</span>
              <span className="font-mono font-bold text-rose-600">
                ₹{remainingBalance.toLocaleString()}
              </span>
            </div>

            <div className="border-t border-slate-200 pt-1.5 flex justify-between items-center">
              <span className="font-bold text-slate-800">Total Paid Amount:</span>
              <span className="text-base font-black font-mono text-blue-600">
                ₹{payment.amount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Official Footer Notice */}
        <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500 text-center border border-slate-100">
          This is an official computer-generated fee acknowledgement receipt and does not require a physical signature.
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;
