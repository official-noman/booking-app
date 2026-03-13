// lib/config.ts
export const SERVICES: Record<string, { name: string; price: number }> = {
  web_dev_1: { name: "Web Development", price: 1500_00 }, // in cents
  seo_1:     { name: "SEO Package",      price:  500_00 },
  design_1:  { name: "Design Package",   price:  800_00 },
};

export type ServiceId = keyof typeof SERVICES;