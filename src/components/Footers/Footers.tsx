import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-6 py-6 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-gray-600">
          <Link href="/" className="font-bold text-gray-900">
            বাজার দর
          </Link>
          {" — "}
          প্রয়োজনীয় পণ্যের দাম এক নজরে।
        </p>

        <p className="text-sm leading-6 text-gray-500">
          সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
        </p>
      </div>
    </footer>
  );
}