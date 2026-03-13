// app/api/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import stripe from "@/lib/stripe";
import Order from "@/models/Order";
import { SERVICES } from "@/lib/config";
import { CheckoutSchema } from "@/schemas/checkout";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Validate input
    const parsed = CheckoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { serviceId } = parsed.data;
    const service = SERVICES[serviceId]; // always defined — validated above

    // 2. Connect to DB
    await connectDB();

    // 3. Create a placeholder Order (no stripeSessionId yet — set after session creation)
    //    We use a two-step approach: create order → create session with orderId in metadata
    const order = await Order.create({
      serviceId,
      amount: service.price,
      status: "PENDING",
      stripeSessionId: "pending", // temporary; updated below
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    // 4. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: service.name },
            unit_amount: service.price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${appUrl}/`,
      metadata: {
        orderId: order._id.toString(),
      },
    });

    // 5. Persist the real session ID
    order.stripeSessionId = session.id;
    await order.save();

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err) {
    console.error("[checkout] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}