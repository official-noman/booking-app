// app/checkout/success/page.tsx
import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white p-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
        {/* Checkmark icon */}
        <svg
          className="h-10 w-10 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-3xl font-bold text-gray-900">Payment Successful!</h1>
      <p className="max-w-md text-gray-500">
        Thank you for your purchase. Your order has been confirmed and you will
        receive a confirmation email shortly.
      </p>

      <Link
        href="/"
        className="mt-4 rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
      >
        Back to Home
      </Link>
    </main>
  );
}