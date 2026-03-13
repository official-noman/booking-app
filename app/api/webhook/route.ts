import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { connectDB } from "@/lib/db";
import stripe from "@/lib/stripe";
import Order, { IOrder } from "@/models/Order";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("❌ Webhook Signature Error:", (err as Error).message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log("✅ Received Webhook Event:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { orderId } = session.metadata || {};
    
    // ইউজার স্ট্রাইপ পেজে যে ইমেইল দিবে তা এখান থেকে পাওয়া যাবে
    const userEmail = session.customer_details?.email;

    if (!orderId) {
      console.error("❌ No orderId in metadata");
      return NextResponse.json({ error: "No orderId" }, { status: 400 });
    }

    try {
      await connectDB();
      const order = (await Order.findById(orderId)) as IOrder;

      if (order && order.status !== "PAID") {
        // ১. ডাটাবেস আপডেট
        order.status = "PAID";
        order.customerEmail = userEmail || ""; // স্ট্রাইপ থেকে পাওয়া ইমেইল সেভ করা
        await order.save();
        console.log(`💰 Order ${orderId} marked as PAID for ${userEmail}`);

        // ২. ইমেইল পাঠানো (যেকোনো ইমেইলে যাবে)
        if (userEmail) {
          const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // SSL ব্যবহার করা হচ্ছে
            auth: {
              user: process.env.GMAIL_USER,
              pass: process.env.GMAIL_APP_PASSWORD,
            },
          });

          await transporter.sendMail({
            from: `"Dra Soft" <${process.env.GMAIL_USER}>`,
            to: userEmail, // ইউজার যে ইমেইল দিবে সেখানেই যাবে
            subject: "Booking Confirmed - Dra Soft",
            html: `
              <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #4f46e5;">Payment Successful!</h2>
                <p>Hello,</p>
                <p>Your booking for <b>${order.serviceId}</b> has been confirmed.</p>
                <p>Order ID: ${orderId}</p>
                <p>Thank you for choosing Dra Soft.</p>
              </div>
            `,
          });
          console.log("🚀 Email sent successfully to:", userEmail);
        }
      }
    } catch (err) {
      console.error("❌ Webhook Error:", err);
      return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}