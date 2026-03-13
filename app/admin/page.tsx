export const dynamic = "force-dynamic";

import { connectDB } from "@/lib/db";
import Order, { IOrder } from "@/models/Order";
import AdminDashboardClient from "./AdminDashboardClient";

export interface LeanOrder {
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
  const orders = await Order.find({}).sort({ createdAt: -1 }).lean<IOrder[]>();
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

export default async function AdminDashboard() {
  const orders = await getOrders();
  return <AdminDashboardClient initialOrders={orders} />;
}