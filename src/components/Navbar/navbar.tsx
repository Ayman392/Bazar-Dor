import Link from "next/link";
import logo from "@/assets/bazar-hero.png"
import Image from "next/image";
import { buttonVariants } from "@heroui/react";
import { cacheLife } from "next/cache";

const Navbar = () => {
async function banglaDate() {
  "use cache";
  cacheLife("hours");

  return new Date().toLocaleDateString("bn-BD", {
    dateStyle: "full",
  });
}
    return (
    <header className="w-full">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 lg:px-0 py-4">
        <Link href="/" className="flex items-center">
        <Image src={logo} width={50} height={50} alt="Bazar dor logo" />
        <div className="text-xl font-bold">
            <h1>বাজার দর</h1>
            <p className="text-sm text-gray-500">{banglaDate()}</p>
        </div>
        </Link>
       <div className="flex items-center gap-3">
  <Link
    href="/signin"
    className={buttonVariants({
      variant: "ghost",
      className: "rounded-lg px-4 text-sm font-semibold text-gray-800",
    })}
  >
    সাইন ইন
  </Link>

  <Link
    href="/signup"
    className={buttonVariants({
      variant: "primary",
      className:
        "rounded-lg bg-green-700 px-5 text-sm font-semibold text-white shadow-md hover:bg-green-800",
    })}
  >
    সাইন আপ
  </Link>
</div>
        
      </nav>
                <hr className="w-full border-gray-200"/>
    </header>
  );
};

export default Navbar;