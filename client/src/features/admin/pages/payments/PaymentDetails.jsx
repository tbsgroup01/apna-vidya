import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Printer, CheckCircle2, ShieldCheck } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import StatusBadge from "../../components/StatusBadge";
import { initialPayments } from "../../../../data/admin/paymentsData";

const PaymentDetails = () => {
  const { id } = useParams();
  const payment =
    initialPayments.find((p) => p.id === id) || initialPayments[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="print:hidden">
        <PageHeader
          title={`Fee Receipt: ${payment.id}`}
          description={`Official digital transaction voucher generated for ${payment.studentName}`}
          breadcrumbs={[
            { label: "Payments", path: "/admin/payments" },
            { label: payment.id },
          ]}
          actions={
            <div className="flex items-center gap-2">
              <Link
                to="/admin/payments"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <ArrowLeft size={15} />
                <span>Back</span>
              </Link>
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all cursor-pointer"
              >
                <Printer size={15} />
                <span>Print Receipt</span>
              </button>
            </div>
          }
        />
      </div>

      <div className="rounded-2xl border border-slate-200/90 bg-white p-8 shadow-xs space-y-6 print:border-none print:shadow-none print:p-0">
        <div className="flex items-start justify-between border-b border-slate-100 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 font-black text-white text-lg">
              AV
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-slate-900">
                Apna Vidya Edutech Pvt. Ltd.
              </h2>
              <p className="text-xs text-slate-500">
                Sector 62, Noida, Uttar Pradesh - 201301
              </p>
              <p className="text-[11px] font-mono text-slate-400">
                GSTIN: 09AAACA1234B1Z5 • ISO 9001:2015 Certified
              </p>
            </div>
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

        <div className="grid grid-cols-2 gap-6 text-xs border-b border-slate-100 pb-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Billed To Student
            </p>
            <p className="text-sm font-bold text-slate-900">{payment.studentName}</p>
            <p className="text-slate-500">{payment.studentEmail}</p>
            <p className="font-mono text-slate-400 mt-0.5">ID: {payment.studentId}</p>
          </div>

          <div className="text-right">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Payment Voucher Details
            </p>
            <p className="font-mono text-slate-700">Receipt No: <span className="font-bold text-slate-900">{payment.id}</span></p>
            <p className="text-slate-500">Date: {payment.date}</p>
            <p className="text-slate-500">Method: {payment.method}</p>
            <p className="font-mono text-[10px] text-slate-400 truncate mt-0.5">Ref: {payment.transactionRef}</p>
          </div>
        </div>

        <div>
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold uppercase text-slate-600">
              <tr>
                <th className="p-3">Description / Program</th>
                <th className="p-3 text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-3">
                  <p className="font-bold text-slate-900">{payment.course}</p>
                  <p className="text-[11px] text-slate-500">Tuition Installment • Live Mentorship & LMS Access</p>
                </td>
                <td className="p-3 text-right font-mono font-bold text-slate-900">
                  ₹{payment.amount.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-100 pt-4 flex justify-between items-center text-xs">
          <div className="flex items-center gap-2 text-emerald-600 font-semibold">
            <CheckCircle2 size={16} />
            <span>Digital Payment Verified & Recorded</span>
          </div>

          <div className="text-right">
            <span className="text-slate-500 text-xs mr-3">Total Paid Amount:</span>
            <span className="text-xl font-bold font-mono text-slate-900">
              ₹{payment.amount.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 p-4 text-[11px] text-slate-500 text-center border border-slate-100">
          This is an official computer-generated fee acknowledgement receipt and does not require a physical signature.
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;
