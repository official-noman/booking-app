# Dra Soft - Premium Service Booking Platform

A professional, full-stack service booking application built for the **Dra Soft** developer assessment. This platform demonstrates a secure payment lifecycle, real-time database management, and an automated communication flow.

## 🚀 Deployment & Demo
- **Live Website:** https://booking-app-smoky-six.vercel.app/
- **Project Walkthrough Video:** 
- **Admin Dashboard:** `https://booking-app-smoky-six.vercel.app//admin

---

## ✨ Key Features

### 🌐 Client Experience
- **Premium UI/UX:** High-end SaaS aesthetic built with **Tailwind CSS** and **Framer Motion** for smooth, interactive animations.
- **Secure Checkout:** Integration with **Stripe-hosted Checkout** to ensure secure handling of sensitive payment information.
- **Service Catalog:** Dynamic list of premium digital services with real-time specific button loading states.
- **Instant Confirmation:** Automated email receipts sent via **Nodemailer (Gmail SMTP)** immediately after successful payment verification.

### 🛡️ Admin Management (Bonus Feature)
- **Middleware Security:** The entire `/admin` route is protected via **Next.js Middleware** using HTTP Basic Auth.
- **Real-time Analytics:** Dashboard overview featuring Total Revenue, Total Bookings, and Conversion Rates.
- **Order Management:** Ability to view all incoming requests, search by customer email, and manage (delete) records.
- **Data Portability:** Export all booking data to **CSV** format with a single click.

---

## 🛠️ Technical Architecture

- **Backend as Source of Truth:** Service pricing and details are resolved on the server-side to prevent client-side price manipulation.
- **Webhook Integration:** Uses **Stripe Webhooks** to asynchronously handle payment events, ensuring the database is only updated upon verified success.
- **Idempotency:** Logic implemented to prevent duplicate processing of the same payment event.

### Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose ORM
- **Payments:** Stripe API
- **Email:** Nodemailer / Gmail SMTP
- **Styling:** Tailwind CSS, Lucide Icons

---

## ⚙️ Local Setup Instructions

1. **Clone the Project:**
   ```bash
   git clone https://github.com/your-username/repo-name.git
   cd repo-name

Install Dependencies:
npm install

Configure Environment Variables:
Create a .env.local file in the root directory and add:

# Stripe Keys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Database
MONGODB_URI=mongodb+srv://...

# Email (Gmail SMTP)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-digit-app-password

# Admin Credentials
ADMIN_USER=admin
ADMIN_PASS=drasoft123

# Deployment URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
Run the App:
npm run dev

Listen for Webhooks (Local):
stripe listen --forward-to localhost:3000/api/webhook

👤 Admin Access (For Reviewers)
To test the administrative features, use the following credentials:
Username: admin
Password: drasoft123

Developed by Noman Mahmud for Dra Soft.
