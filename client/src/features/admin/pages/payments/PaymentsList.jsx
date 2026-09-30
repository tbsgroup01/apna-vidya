import React, { useState, useEffect } from "react";
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
import api from "../../../../services/api";

const PaymentsList = () => {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: "₹0",
    thisMonth: "₹0",
    pendingFees: "₹0",
    successfulCount: 0,
    refundsCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const res = await api.get("/admin/students?limit=150");
        if (res.data?.data?.students) {
          const students = res.data.data.students;
          let totalPaid = 0;
          let totalPending = 0;
          let count = 0;

          const rows = [];
          students.forEach((s) => {
            const paid = Number(s.paidFees || 0);
            const pending = Number(s.pendingFees || 0);
            totalPaid += paid;
            totalPending += pending;

            if (paid > 0 || pending > 0) {
              count += 1;
              rows.push({
                id: `PAY-${String(s.id).padStart(4, "0")}`,
                invoiceId: `INV-2026-${String(s.id).padStart(4, "0")}`,
                studentId: s.id,
                studentName: s.name,
                studentEmail: s.email,
                studentPhone: s.phone,
                course: s.enrolledCourses?.[0]?.name || "Standard Track",
                batch: s.enrolledBatches?.[0]?.name || "Regular Batch",
                amount: paid,
                totalFees: Number(s.totalFees || 0),
                pendingFees: pending,
                method: "Online / Bank Transfer",
                date: s.admissionDate || (s.createdAt ? new Date(s.createdAt).toISOString().split("T")[0] : "Recent"),
                status: s.paymentStatus || (pending === 0 && paid > 0 ? "Paid" : "Pending"),
              });
            }
          });

          setPayments(rows);
          setStats({
            totalRevenue: `₹${totalPaid.toLocaleString()}`,
            thisMonth: `₹${totalPaid.toLocaleString()}`,
            pendingFees: `₹${totalPending.toLocaleString()}`,
            successfulCount: count,
            refundsCount: 0,
          });
        }
      } catch (err) {
        console.error("Failed to fetch live payments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

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
          <span className="text-[13px] font-mono text-[13px]late-400">
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
            className="font-bold text-[13px]late-900 hover:text-blue-600 block"
          >
            {row.studentName}
          </Link>
          <p className="text-[13px] text-[13px]late-400 truncate max-w-[150px]">
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
        <span className="font-semibold text-[13px]late-800 text-xs">{row.course}</span>
      ),
    },
    {
      key: "amount",
      header: "Amount Paid",
      sortable: true,
      render: (row) => (
        <span className="font-mono font-bold text-[13px]late-900 text-xs">
          ₹{row.amount.toLocaleString()}
        </span>
      ),
    },
    {
      key: "method",
      header: "Payment Method",
      sortable: true,
      render: (row) => (
        <span className="text-[13px]late-600 text-xs">{row.method}</span>
      ),
    },
    {
      key: "date",
      header: "Date & Time",
      sortable: true,
      render: (row) => (
        <span className="text-[13px]late-400 font-mono text-[13px]">
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
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-[13px] font-semibold text-[13px]late-700 hover:bg-slate-50 transition-colors"
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
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-[13px]late-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Download size={15} />
            <span>Export Transactions</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Collections"
          value={stats.totalRevenue}
          change={stats.successfulCount > 0 ? "+100%" : "0%"}
          isPositive={true}
          comparison="Live fee receipts"
          icon="IndianRupee"
          color="emerald"
        />
        <StatCard
          title="This Month Collections"
          value={stats.thisMonth}
          change={stats.successfulCount > 0 ? "+100%" : "0%"}
          isPositive={true}
          comparison="Current cycle receipts"
          icon="TrendingUp"
          color="blue"
        />
        <StatCard
          title="Pending Fees"
          value={stats.pendingFees}
          change="Live audit"
          isPositive={true}
          comparison="Unsettled student dues"
          icon="AlertCircle"
          color="purple"
        />
        <StatCard
          title="Successful Transactions"
          value={stats.successfulCount.toLocaleString()}
          change={`${stats.successfulCount} records`}
          isPositive={true}
          comparison={`${stats.refundsCount} refunds processed`}
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
