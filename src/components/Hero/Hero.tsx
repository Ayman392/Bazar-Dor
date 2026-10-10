import Image from "next/image";
import Link from "next/link";
import { cacheLife } from "next/cache";
import heroImage from "@/assets/bazar-hero.png";

async function getBanglaDate() {
  "use cache";
  cacheLife("hours");

  return new Date().toLocaleDateString("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  });
}

export default async function Hero() {
  const date = await getBanglaDate();

  return (
    <section className="px-4 pt-6 sm:px-6">
      <div className="flex flex-col gap-8 rounded-[24px] border border-[#dfe7e1] bg-white p-5 sm:p-7 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            {date}
          </span>

          <h1 className="mt-3 text-2xl font-bold leading-snug text-[#202a23] sm:text-3xl">
            আজকের বাজারের দাম এক নজরে
          </h1>

          <p className="mt-4 text-sm leading-6 text-gray-500">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম —
            বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বোচ্চ এবং
            দামের পরিবর্তন এক জায়গায়।
          </p>

          <Link
            href="#সব-পণ্য"
            className="mt-6 inline-flex rounded-md bg-green-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-green-800"
          >
            সব পণ্য দেখুন
          </Link>
        </div>

        <Image
          src={heroImage}
          alt="ফল ও নিত্যপ্রয়োজনীয় পণ্যের ঝুড়ি"
          className="h-auto w-48 shrink-0 self-center object-contain sm:w-56 md:w-64"
          sizes="(max-width: 640px) 192px, (max-width: 768px) 224px, 256px"
        />
      </div>
    </section>
  );
}