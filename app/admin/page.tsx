export const dynamic = "force-dynamic";

import { connectDB } from "@/lib/db";
import Order, { IOrder } from "@/models/Order";
import {
  DollarSign,
  ShoppingCart,
  CheckCircle2,
  Clock,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";

interface LeanOrder {
  _id: string;
  serviceId: string;
  email?: string;
  customerEmail?: string;
  amount: number;
  status: string;
  createdAt: string;
}

async function getOrders(): Promise<LeanOrder[]> {
  await connectDB();
  const orders = await Order.find({})
    .sort({ createdAt: -1 })
    .lean<IOrder[]>();

  return orders.map((o) => ({
    _id: String(o._id),
    serviceId: o.serviceId,
    email: o.email,
    customerEmail: o.customerEmail,
    amount: o.amount,
    status: o.status,
    createdAt: o.createdAt ? new Date(o.createdAt).toISOString() : new Date().toISOString(),
  }));
}

function formatCurrency(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function shortenId(id: string) {
  return `#${id.slice(-6).toUpperCase()}`;
}

export default async function AdminDashboard() {
  const orders = await getOrders();

  const paidOrders = orders.filter((o) => o.status === "PAID");
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.amount, 0);
  const totalBookings = orders.length;
  const successfulPayments = paidOrders.length;
  const conversionRate =
    totalBookings > 0
      ? Math.round((successfulPayments / totalBookings) * 100)
      : 0;

  const stats = [
    {
      label: "Total Revenue",
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      sub: `From ${successfulPayments} paid orders`,
      accent: "from-emerald-500 to-teal-600",
      bg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      label: "Total Bookings",
      value: totalBookings,
      icon: ShoppingCart,
      sub: "All time orders",
      accent: "from-indigo-500 to-blue-600",
      bg: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
    {
      label: "Successful Payments",
      value: successfulPayments,
      icon: CheckCircle2,
      sub: "Completed transactions",
      accent: "from-violet-500 to-purple-600",
      bg: "bg-violet-50",
      iconColor: "text-violet-600",
    },
    {
      label: "Conversion Rate",
      value: `${conversionRate}%`,
      icon: TrendingUp,
      sub: "Paid vs total bookings",
      accent: "from-rose-500 to-pink-600",
      bg: "bg-rose-50",
      iconColor: "text-rose-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      {/* Top Nav Bar */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow">
            <span className="text-white text-xs font-bold">DS</span>
          </div>
          <div>
            <p className="text-[11px] text-slate-400 uppercase tracking-widest font-medium">
              Dra Soft
            </p>
            <h1 className="text-slate-800 font-semibold text-sm leading-none">
              Admin Dashboard
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Overview
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            All bookings and revenue at a glance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow duration-200 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${stat.bg} rounded-xl p-2.5`}>
                    <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-slate-400 transition-colors" />
                </div>
                <p className="text-2xl font-bold text-slate-800 mb-1 tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">
                  {stat.label}
                </p>
                <p className="text-xs text-slate-400">{stat.sub}</p>
              </div>
            );
          })}
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-800">
                All Orders
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {totalBookings} total records
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1.5 text-slate-500">
                <Clock className="w-3.5 h-3.5" />
                Newest first
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-16 text-center text-slate-400 text-sm"
                    >
                      <ShoppingCart className="w-8 h-8 mx-auto mb-3 text-slate-300" />
                      No orders yet
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => {
                    const email =
                      order.customerEmail || order.email || "N/A";
                    const isPaid = order.status === "PAID";
                    const isPending = order.status === "PENDING";

                    return (
                      <tr
                        key={order._id}
                        className="hover:bg-slate-50/60 transition-colors duration-100"
                      >
                        {/* Order ID */}
                        <td className="px-6 py-4">
                          <span className="font-mono text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                            {shortenId(order._id)}
                          </span>
                        </td>

                        {/* Customer */}
                        <td className="px-6 py-4">
                          <span
                            className={`text-sm ${
                              email === "N/A"
                                ? "text-slate-300 italic"
                                : "text-slate-700"
                            }`}
                          >
                            {email}
                          </span>
                        </td>

                        {/* Service */}
                        <td className="px-6 py-4">
                          <span className="text-slate-600 text-sm font-medium">
                            {order.serviceId}
                          </span>
                        </td>

                        {/* Amount */}
                        <td className="px-6 py-4">
                          <span className="text-slate-800 font-semibold text-sm">
                            {formatCurrency(order.amount)}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          {isPaid ? (
                            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Paid
                            </span>
                          ) : isPending ? (
                            <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              Pending
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 border border-red-200 text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                              {order.status}
                            </span>
                          )}
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4">
                          <span className="text-slate-400 text-xs">
                            {formatDate(order.createdAt)}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          {orders.length > 0 && (
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50">
              <p className="text-xs text-slate-400">
                Showing{" "}
                <span className="font-medium text-slate-600">
                  {orders.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-slate-600">
                  {orders.length}
                </span>{" "}
                orders
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}