"use client";

import { useState, useMemo, useCallback } from "react";
import {
  DollarSign, ShoppingCart, CheckCircle2, TrendingUp,
  Search, Download, Trash2, X, AlertTriangle, Loader2,
  Pencil, Save, Clock, Activity,
} from "lucide-react";
import { LeanOrder } from "./page";

function formatCurrency(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}
function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
  }).format(new Date(iso));
}
function shortenId(id: string) { return `#${id.slice(-6).toUpperCase()}`; }

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ msg, type }: { msg: string; type: "success" | "error" }) {
  return (
    <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-sm font-medium
      ${type === "success" ? "bg-white border-emerald-300 text-emerald-600" : "bg-white border-red-200 text-red-600"}`}>
      {type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
      {msg}
    </div>
  );
}

// ── Delete Modal ──────────────────────────────────────────────────────────────
function DeleteModal({ order, onConfirm, onCancel, isDeleting }: {
  order: LeanOrder; onConfirm: () => void; onCancel: () => void; isDeleting: boolean;
}) {
  const email = order.customerEmail || order.email || "N/A";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-slate-800 mb-1">Delete this booking?</h3>
            <p className="text-sm text-slate-500 mb-1">
              Order <span className="font-mono font-bold text-slate-800">{shortenId(order._id)}</span>{" "}
              for <span className="text-slate-500">{email}</span> will be permanently removed.
            </p>
            <p className="text-xs text-red-600 font-medium mt-2">This action cannot be undone.</p>
          </div>
          <button onClick={onCancel} className="text-slate-500 hover:text-slate-500 transition-colors"><X className="w-4 h-4" /></button>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onCancel} disabled={isDeleting}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-500 text-sm font-medium hover:bg-slate-100 transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={isDeleting}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {isDeleting ? <><Loader2 className="w-4 h-4 animate-spin" />Deleting…</> : <><Trash2 className="w-4 h-4" />Delete</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Edit Modal ────────────────────────────────────────────────────────────────
function EditModal({ order, onSave, onCancel, isSaving }: {
  order: LeanOrder; onSave: (updated: Partial<LeanOrder>) => void; onCancel: () => void; isSaving: boolean;
}) {
  const [email, setEmail] = useState(order.customerEmail || order.email || "");
  const [serviceId, setServiceId] = useState(order.serviceId);
  const [amount, setAmount] = useState((order.amount / 100).toFixed(2));
  const [status, setStatus] = useState(order.status);

  const handleSave = () => {
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) return;
    onSave({ customerEmail: email, serviceId, amount: Math.round(parsed * 100), status });
  };

  const inputCls = "w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-300 focus:ring-1 focus:ring-indigo-200 transition-all";
  const labelCls = "block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center">
              <Pencil className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-800">Edit Booking</h3>
              <p className="text-xs text-slate-500 font-mono">{shortenId(order._id)}</p>
            </div>
          </div>
          <button onClick={onCancel} className="text-slate-500 hover:text-slate-500 transition-colors"><X className="w-4 h-4" /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className={labelCls}>Customer Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="customer@example.com" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Service ID</label>
            <input type="text" value={serviceId} onChange={(e) => setServiceId(e.target.value)} placeholder="service-name" className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Amount (USD)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} min="0" step="0.01" className={`${inputCls} pl-7`} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className={`${inputCls} cursor-pointer`}>
                <option value="PENDING" className="bg-white">PENDING</option>
                <option value="PAID" className="bg-white">PAID</option>
                <option value="FAILED" className="bg-white">FAILED</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onCancel} disabled={isSaving}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-500 text-sm font-medium hover:bg-slate-100 transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button onClick={handleSave} disabled={isSaving}
            className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {isSaving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving…</> : <><Save className="w-4 h-4" />Save Changes</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon: Icon, color, delay }: {
  label: string; value: string | number; sub: string; icon: React.ElementType; color: string; delay: number;
}) {
  return (
    <div className="relative bg-white border border-slate-200 rounded-2xl p-5 overflow-hidden group hover:border-white/15 transition-all duration-300"
      style={{ animation: "fadeUp 0.5s ease forwards", animationDelay: `${delay}ms`, opacity: 0 }}>
      <div className={`absolute -top-8 -right-8 w-28 h-28 rounded-full blur-3xl opacity-20 group-hover:opacity-25 transition-opacity ${color}`} />
      <div className="relative">
        <div className={`inline-flex p-2.5 rounded-xl mb-4 ${color} bg-opacity-10 border border-slate-200`}>
          <Icon className="w-4 h-4 text-slate-800" />
        </div>
        <p className="text-[26px] font-bold text-slate-800 tracking-tight leading-none mb-2">{value}</p>
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.15em] mb-1">{label}</p>
        <p className="text-xs text-slate-400">{sub}</p>
      </div>
    </div>
  );
}

// ── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  if (status === "PAID") return (
    <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200 text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Paid
    </span>
  );
  if (status === "PENDING") return (
    <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-600 border border-amber-200 text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />Pending
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 border border-red-200 text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">
      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />{status}
    </span>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AdminDashboardClient({ initialOrders }: { initialOrders: LeanOrder[] }) {
  const [orders, setOrders] = useState<LeanOrder[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [deletingOrder, setDeletingOrder] = useState<LeanOrder | null>(null);
  const [editingOrder, setEditingOrder] = useState<LeanOrder | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = useCallback((msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const paidOrders = useMemo(() => orders.filter((o) => o.status === "PAID"), [orders]);
  const totalRevenue = useMemo(() => paidOrders.reduce((s, o) => s + o.amount, 0), [paidOrders]);
  const conversionRate = orders.length > 0 ? Math.round((paidOrders.length / orders.length) * 100) : 0;

  const stats = [
    { label: "Total Revenue", value: formatCurrency(totalRevenue), sub: `From ${paidOrders.length} paid orders`, icon: DollarSign, color: "bg-emerald-500", delay: 0 },
    { label: "Total Bookings", value: orders.length, sub: "All time orders", icon: ShoppingCart, color: "bg-indigo-500", delay: 80 },
    { label: "Paid Orders", value: paidOrders.length, sub: "Completed transactions", icon: CheckCircle2, color: "bg-violet-500", delay: 160 },
    { label: "Conversion Rate", value: `${conversionRate}%`, sub: "Paid vs total", icon: TrendingUp, color: "bg-rose-500", delay: 240 },
  ];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter((o) => {
      const email = (o.customerEmail || o.email || "").toLowerCase();
      return email.includes(q) || o._id.toLowerCase().includes(q) || shortenId(o._id).toLowerCase().includes(q);
    });
  }, [orders, search]);

  const handleDelete = useCallback(async () => {
    if (!deletingOrder) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/orders/${deletingOrder._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setOrders((prev) => prev.filter((o) => o._id !== deletingOrder._id));
      showToast("Booking deleted successfully.", "success");
    } catch { showToast("Failed to delete.", "error"); }
    finally { setIsDeleting(false); setDeletingOrder(null); }
  }, [deletingOrder, showToast]);

  const handleSave = useCallback(async (updated: Partial<LeanOrder>) => {
    if (!editingOrder) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${editingOrder._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error();
      setOrders((prev) => prev.map((o) => o._id === editingOrder._id ? { ...o, ...updated } : o));
      showToast("Booking updated successfully.", "success");
    } catch { showToast("Failed to update.", "error"); }
    finally { setIsSaving(false); setEditingOrder(null); }
  }, [editingOrder, showToast]);

  const exportCSV = useCallback(() => {
    const rows = [
      ["Order ID", "Customer Email", "Service", "Amount (USD)", "Status", "Date"],
      ...filtered.map((o) => [o._id, o.customerEmail || o.email || "N/A", o.serviceId, (o.amount / 100).toFixed(2), o.status, formatDate(o.createdAt)]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Exported ${filtered.length} records.`, "success");
  }, [filtered, showToast]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {toast && <Toast msg={toast.msg} type={toast.type} />}
      {deletingOrder && <DeleteModal order={deletingOrder} onConfirm={handleDelete} onCancel={() => setDeletingOrder(null)} isDeleting={isDeleting} />}
      {editingOrder && <EditModal order={editingOrder} onSave={handleSave} onCancel={() => setEditingOrder(null)} isSaving={isSaving} />}

      {/* Header */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-xl shadow-sm px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600" />
            <div className="absolute inset-[1.5px] rounded-[10px] bg-white flex items-center justify-center">
              <Activity className="w-4 h-4 text-indigo-600" />
            </div>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-semibold">Dra Soft</p>
            <h1 className="text-slate-800 font-semibold text-sm leading-tight">Admin Panel</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-2 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5">
            <Clock className="w-3 h-3" />Real-time
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />Live
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Overview</h2>
          <p className="text-slate-500 text-sm mt-1">Monitor bookings, revenue, and manage orders</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => <StatCard key={s.label} {...s} />)}
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          {/* Toolbar */}
          <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">All Orders</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {filtered.length === orders.length ? `${orders.length} records` : `${filtered.length} of ${orders.length} records`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search email or ID…"
                  className="pl-8 pr-8 py-2 text-xs rounded-lg border border-slate-200 bg-slate-100 text-slate-500 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 w-48 transition-all" />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-500">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
              <button onClick={exportCSV}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-slate-100 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all">
                <Download className="w-3.5 h-3.5" />Export
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {["Order ID", "Customer", "Service", "Amount", "Status", "Date", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="px-6 py-16 text-center">
                    <ShoppingCart className="w-8 h-8 mx-auto mb-3 text-slate-400" />
                    <p className="text-slate-500 text-sm">{search ? "No results match your search." : "No orders yet."}</p>
                  </td></tr>
                ) : filtered.map((order, i) => {
                  const email = order.customerEmail || order.email || "N/A";
                  return (
                    <tr key={order._id}
                      className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors duration-100"
                      style={{ animation: "fadeUp 0.3s ease forwards", animationDelay: `${i * 25}ms`, opacity: 0 }}>
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">{shortenId(order._id)}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs ${email === "N/A" ? "text-slate-400 italic" : "text-slate-500"}`}>{email}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs text-slate-500 font-medium">{order.serviceId}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-bold text-slate-800">{formatCurrency(order.amount)}</span>
                      </td>
                      <td className="px-5 py-3.5"><StatusBadge status={order.status} /></td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs text-slate-500 whitespace-nowrap">{formatDate(order.createdAt)}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setEditingOrder(order)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-indigo-600 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-300 transition-all whitespace-nowrap">
                            <Pencil className="w-3 h-3" />Edit
                          </button>
                          <button onClick={() => setDeletingOrder(order)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 hover:border-red-300 transition-all whitespace-nowrap">
                            <Trash2 className="w-3 h-3" />Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filtered.length > 0 && (
            <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs text-slate-400">
                Showing <span className="text-slate-500 font-medium">{filtered.length}</span> of <span className="text-slate-500 font-medium">{orders.length}</span> orders
              </p>
              <p className="text-xs text-slate-400 flex items-center gap-1.5"><Clock className="w-3 h-3" />Newest first</p>
            </div>
          )}
        </div>
      </main>

      <style jsx global>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}