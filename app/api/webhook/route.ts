import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { connectDB } from "@/lib/db";
import stripe from "@/lib/stripe";
import Order, { IOrder } from "@/models/Order";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  console.log("ENV CHECK →", {
    user: process.env.GMAIL_USER,
    passLength: process.env.GMAIL_APP_PASSWORD?.length,
    passValue: JSON.stringify(process.env.GMAIL_APP_PASSWORD),
  });
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
    
   
    const userEmail = session.customer_details?.email;

    if (!orderId) {
      console.error("❌ No orderId in metadata");
      return NextResponse.json({ error: "No orderId" }, { status: 400 });
    }

    try {
      await connectDB();
      const order = (await Order.findById(orderId)) as IOrder;

      if (order && order.status !== "PAID") {
        // database update
        order.status = "PAID";
        order.customerEmail = userEmail || ""; // save email get from stripe
        await order.save();
        console.log(`💰 Order ${orderId} marked as PAID for ${userEmail}`);

        // send mail part
        if (userEmail) {
          const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // SSL 
            auth: {
              user: process.env.GMAIL_USER,
              pass: process.env.GMAIL_APP_PASSWORD,
            },
          });

          await transporter.verify();
  console.log("✅ SMTP Connected");


          await transporter.sendMail({
            from: `"Dra Soft" <${process.env.GMAIL_USER}>`,
            to: userEmail, // any email given by user
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