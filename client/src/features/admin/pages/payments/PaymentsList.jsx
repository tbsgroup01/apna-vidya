import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  CreditCard,
  IndianRupee,
  Download,
  Eye,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import PageHeader from "../../components/PageHeader";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import StatCard from "../../components/StatCard";
import { paymentStats, initialPayments } from "../../../../data/admin/paymentsData";

const PaymentsList = () => {
  const [payments, setPayments] = useState(initialPayments);

  const columns = [
    {
      key: "id",
      header: "Payment ID",
      sortable: true,
      render: (row) => (
        <div>
          <Link
            to={`/admin/payments/${row.id}`}
            className="font-mono font-bold text-blue-600 hover:underline block"
          >
            {row.id}
          </Link>
          <span className="text-[11px] font-mono text-slate-400">
            {row.invoiceId}
          </span>
        </div>
      ),
    },
    {
      key: "studentName",
      header: "Student",
      sortable: true,
      render: (row) => (
        <div>
          <Link
            to={`/admin/students/${row.studentId}`}
            className="font-bold text-slate-900 hover:text-blue-600 block"
          >
            {row.studentName}
          </Link>
          <p className="text-[11px] text-slate-400 truncate max-w-[150px]">
            {row.studentEmail}
          </p>
        </div>
      ),
    },
    {
      key: "course",
      header: "Course Program",
      sortable: true,
      render: (row) => (
        <span className="font-semibold text-slate-800 text-xs">{row.course}</span>
      ),
    },
    {
      key: "amount",
      header: "Amount Paid",
      sortable: true,
      render: (row) => (
        <span className="font-mono font-bold text-slate-900 text-xs">
          ₹{row.amount.toLocaleString()}
        </span>
      ),
    },
    {
      key: "method",
      header: "Payment Method",
      sortable: true,
      render: (row) => (
        <span className="text-slate-600 text-xs">{row.method}</span>
      ),
    },
    {
      key: "date",
      header: "Date & Time",
      sortable: true,
      render: (row) => (
        <span className="text-slate-400 font-mono text-[11px]">
          {row.date}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      key: "actions",
      header: "Receipt",
      align: "right",
      render: (row) => (
        <Link
          to={`/admin/payments/${row.id}`}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <Eye size={12} />
          <span>Receipt</span>
        </Link>
      ),
    },
  ];

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["ID,Invoice,Student,Email,Course,Amount,Method,Date,Status"]
        .concat(
          payments.map(
            (p) =>
              `${p.id},${p.invoiceId},"${p.studentName}","${p.studentEmail}","${p.course}",${p.amount},"${p.method}","${p.date}","${p.status}"`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "apna_vidya_payments.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payments & Financials"
        description="Audit student fee installments, monitor payment gateway receipts, and track pending dues."
        breadcrumbs={[{ label: "Payments" }]}
        actions={
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Download size={15} />
            <span>Export Transactions</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Collections"
          value={paymentStats.totalRevenue}
          change="+14.8%"
          isPositive={true}
          comparison="vs last month"
          icon="IndianRupee"
          color="emerald"
        />
        <StatCard
          title="This Month Collections"
          value={paymentStats.thisMonth}
          change="+22.1%"
          isPositive={true}
          comparison="target: ₹8.0 Lakh"
          icon="TrendingUp"
          color="blue"
        />
        <StatCard
          title="Pending Fees"
          value={paymentStats.pendingFees}
          change="-2.4%"
          isPositive={true}
          comparison="88% recovery rate"
          icon="AlertCircle"
          color="purple"
        />
        <StatCard
          title="Successful Transactions"
          value={paymentStats.successfulCount.toLocaleString()}
          change="99.2% rate"
          isPositive={true}
          comparison={`${paymentStats.refundsCount} refunds processed`}
          icon="CreditCard"
          color="indigo"
        />
      </div>

      <DataTable
        columns={columns}
        data={payments}
        searchKey="studentName"
        searchPlaceholder="Search by student name, ID or invoice..."
        filterTabs={["All", "Paid", "Pending", "Failed", "Refunded"]}
        filterKey="status"
      />
    </div>
  );
};

export default PaymentsList;
