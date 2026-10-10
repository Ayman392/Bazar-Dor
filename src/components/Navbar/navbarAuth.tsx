"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Avatar,
  Button,
  Dropdown,
  Label,
  buttonVariants,
} from "@heroui/react";
import { Person, ArrowRightFromSquare } from "@gravity-ui/icons";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function NavbarAuth() {
  const router = useRouter();

  const { data: session, isPending, error, refetch } =
    authClient.useSession();

  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    if (signingOut) return;

    setSigningOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "সাইন আউট করা যায়নি।");
        return;
      }

      toast.success("সফলভাবে সাইন আউট হয়েছে।");
      router.replace("/");
      router.refresh();
    } catch {
      toast.error("সার্ভারের সঙ্গে যোগাযোগ করা যায়নি।");
    } finally {
      setSigningOut(false);
    }
  }

  if (isPending) {
    return (
      <div role="status" className="text-sm text-gray-500">
        লোড হচ্ছে...
      </div>
    );
  }

  if (error) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onPress={() => {
          void refetch();
        }}
      >
        আবার চেষ্টা করুন
      </Button>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/sign-in"
          className={buttonVariants({
            variant: "ghost",
            className:
              "rounded-lg px-3 text-sm font-semibold text-gray-800 sm:px-4",
          })}
        >
          সাইন ইন
        </Link>

        <Link
          href="/sign-up"
          className={buttonVariants({
            variant: "primary",
            className:
              "rounded-lg bg-green-700 px-4 text-sm font-semibold text-white shadow-md hover:bg-green-800 sm:px-5",
          })}
        >
          সাইন আপ
        </Link>
      </div>
    );
  }

  const user = session.user;
  const firstName = user.name.trim().split(/\s+/)[0] || "ব্যবহারকারী";
  const initial = user.name.trim().charAt(0).toUpperCase() || "U";

  return (
    <Dropdown>
<Dropdown.Trigger
  type="button"
  isDisabled={signingOut}
  aria-label={`${user.name} — অ্যাকাউন্ট মেনু`}
  className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-gray-800 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-green-700 disabled:opacity-50"
>
  <Avatar size="sm" className="rounded-lg">
    {user.image && (
      <Avatar.Image
        src={user.image}
        alt=""
        className="rounded-lg object-cover"
      />
    )}

    <Avatar.Fallback className="rounded-lg bg-green-50 text-sm font-semibold text-green-800">
      {initial}
    </Avatar.Fallback>
  </Avatar>

  <span className="max-w-28 truncate text-sm font-medium">
    {signingOut ? "সাইন আউট হচ্ছে..." : firstName}
  </span>

  <svg
    aria-hidden="true"
    viewBox="0 0 16 16"
    fill="none"
    className="size-3 text-gray-500"
  >
    <path
      d="m5 6.5 3 3 3-3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
</Dropdown.Trigger>

      <Dropdown.Popover
        placement="bottom end"
        className="w-60 max-w-[calc(100vw-2rem)] rounded-xl border border-[#dfe7e1] bg-[#f9fcfa] p-2 shadow-lg"
      >
        <div className="px-3 pb-3 pt-2">
          <p className="truncate text-sm font-semibold text-[#202a23]">
            {user.name}
          </p>

          <p className="mt-0.5 break-all text-xs text-gray-500">
            {user.email}
          </p>
        </div>

        <Dropdown.Menu
          aria-label="অ্যাকাউন্ট মেনু"
          className="gap-1"
        >
          <Dropdown.Item
            id="profile"
            textValue="আমার প্রোফাইল"
            onAction={() => router.push("/profile")}
            className="gap-2 rounded-lg px-3 py-2 text-sm"
          >
            <Person aria-hidden="true" className="size-4 text-gray-500" />
            <Label>আমার প্রোফাইল</Label>
          </Dropdown.Item>

          <Dropdown.Item
            id="signout"
            textValue="সাইন আউট"
            variant="danger"
            isDisabled={signingOut}
            onAction={() => {
              void handleSignOut();
            }}
            className="gap-2 rounded-lg px-3 py-2 text-sm text-red-600"
          >
            <ArrowRightFromSquare aria-hidden="true" className="size-4" />
            <Label>সাইন আউট</Label>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}