import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { cacheLife } from "next/cache";

import logo from "@/assets/bazar-hero.png";
import CategoryNav from "../CategoryNav/CategoryNav";
import PriceTicker from "../PriceTicker/PriceTicker";
import NavbarAuth from "./navbarAuth";

async function banglaDate() {
  "use cache";
  cacheLife("hours");

  return new Date().toLocaleDateString("bn-BD", {
    dateStyle: "full",
    timeZone: "Asia/Dhaka",
  });
}

async function NavbarDate() {
  const date = await banglaDate();

  return <p className="text-xs text-gray-500 sm:text-sm">{date}</p>;
}

export default function Navbar() {
  return (
    <header className="w-full bg-white">
      <nav className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center">
          <Image
            src={logo}
            width={50}
            height={50}
            alt="Bazar dor logo"
          />

          <div className="font-bold">
            <h1 className="text-xl">বাজার দর</h1>

            <Suspense
              fallback={
                <p className="text-xs text-gray-500 sm:text-sm">
                  তারিখ লোড হচ্ছে...
                </p>
              }
            >
              <NavbarDate />
            </Suspense>
          </div>
        </Link>

        <NavbarAuth />
      </nav>

      <hr className="w-full border-gray-100" />

      <Suspense
        fallback={
          <div className="border-b border-gray-200 bg-white">
            <div className="mx-auto max-w-7xl px-6 py-3 text-sm text-gray-500">
              বিভাগ লোড হচ্ছে...
            </div>
          </div>
        }
      >
        <CategoryNav />
      </Suspense>

      <PriceTicker />

      <hr className="w-full border-gray-200" />
    </header>
  );
}