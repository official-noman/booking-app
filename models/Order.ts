import mongoose, { Document, Model, Schema } from "mongoose";

export type OrderStatus = "PENDING" | "PAID" | "FAILED";

export interface IOrder extends Document {
  serviceId: string;
  email?: string; // Optional করে দেওয়া হলো
  amount: number; 
  status: OrderStatus;
  stripeSessionId?: string;
  paymentStatus?: string;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  customerEmail?: string;
}

const OrderSchema = new Schema<IOrder>(
  {
    serviceId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false, // এখানে true ছিল, তাই এরর আসছিল
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
    },
    stripeSessionId: {
      type: String,
    },
    paymentStatus: {
      type: String,
    },
    paidAt: {
      type: Date,
    },
    customerEmail: { 
      type: String, 
      required: false 
    }
  },
  {
    timestamps: true,
  }
);

const Order: Model<IOrder> =
  (mongoose.models.Order as Model<IOrder>) ||
  mongoose.model<IOrder>("Order", OrderSchema);

export default Order;