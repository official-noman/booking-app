// schemas/checkout.ts
import { z } from "zod";
import { SERVICES } from "@/lib/config";

export const CheckoutSchema = z.object({
  serviceId: z.string().refine((id) => id in SERVICES, {
    message: "Invalid serviceId",
  }),
});

export type CheckoutInput = z.infer<typeof CheckoutSchema>;