import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

// DELETE /api/admin/orders/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const deleted = await Order.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete order error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH /api/admin/orders/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const body = await req.json();

    const allowed = ["customerEmail", "serviceId", "amount", "status"];
    const update: Record<string, unknown> = {};
    for (const key of allowed) {
      if (body[key] !== undefined) update[key] = body[key];
    }

    const updated = await Order.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true }
    );

    if (!updated) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json({ success: true, order: updated });
  } catch (err) {
    console.error("Update order error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}