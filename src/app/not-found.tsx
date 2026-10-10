import Link from "next/link";

export default function NotFound() {
  return (
    <section className="px-6 py-20 text-center">
      <p className="text-6xl font-bold text-green-700">৪০৪</p>

      <h1 className="mt-5 text-2xl font-bold text-gray-900">
        পৃষ্ঠাটি পাওয়া যায়নি
      </h1>

      <p className="mt-3 text-sm text-gray-500">
        আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি নেই অথবা ঠিকানাটি ভুল।
      </p>

      <Link
        href="/"
        className="mt-6 inline-block rounded-lg bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800"
      >
        হোম পেজে ফিরে যান
      </Link>
    </section>
  );
}