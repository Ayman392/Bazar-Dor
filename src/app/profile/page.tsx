"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, Button } from "@heroui/react";
import { ArrowRightFromSquare } from "@gravity-ui/icons";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();

  const { data: session, isPending, error, refetch } = authClient.useSession();

  const [signingOut, setSigningOut] = useState(false);
  const [linking, setLinking] = useState(false);

  useEffect(() => {
    if (!isPending && !error && !session) {
      router.replace("/sign-in");
    }
  }, [isPending, error, session, router]);

  useEffect(() => {
    if (!session || error) return;

    const url = new URL(window.location.href);

    if (url.searchParams.get("linked") !== "github") return;

    url.searchParams.delete("linked");

    window.history.replaceState(
      window.history.state,
      "",
      `${url.pathname}${url.search}${url.hash}`,
    );

    toast.success("GitHub সফলভাবে সংযুক্ত হয়েছে।", {
      id: "github-linked",
    });
  }, [session, error]);

  async function handleSignOut() {
    if (signingOut || linking) return;

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

  async function handleLinkGitHub() {
    if (linking || signingOut) return;

    setLinking(true);

    try {
      const { error } = await authClient.linkSocial({
        provider: "github",
        callbackURL: "/profile?linked=github",
      });

      if (error) {
        toast.error(error.message || "GitHub সংযুক্ত করা যায়নি।");
        setLinking(false);
      }
    } catch {
      toast.error("সার্ভারের সঙ্গে যোগাযোগ করা যায়নি।");
      setLinking(false);
    }
  }

  if (isPending) {
    return (
      <section className="px-4 py-16">
        <p role="status" className="text-center text-sm text-gray-500">
          প্রোফাইল লোড হচ্ছে...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-4 py-16 text-center">
        <p role="alert" className="mb-4 text-sm text-red-600">
          প্রোফাইল লোড করা যায়নি।
        </p>

        <Button
          variant="secondary"
          onPress={() => {
            void refetch();
          }}
        >
          আবার চেষ্টা করুন
        </Button>
      </section>
    );
  }

  if (!session) {
    return (
      <p role="status" className="py-16 text-center text-sm text-gray-500">
        সাইন ইন পেজে নিয়ে যাওয়া হচ্ছে...
      </p>
    );
  }

  const user = session.user;
  const initial = user.name.trim().charAt(0).toUpperCase() || "U";
  const busy = signingOut || linking;

  return (
    <section className="px-4 py-12 sm:py-20">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#202a23]">আমার প্রোফাইল</h1>

          <p className="mt-1 text-sm text-gray-500">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
          </p>
        </div>

        <div className="rounded-2xl border border-[#dfe7e1] bg-[#f9fcfa] p-5 sm:p-6">
          <div className="flex min-w-0 items-center gap-4">
            <Avatar className="size-16 shrink-0 rounded-xl">
              {user.image && (
                <Avatar.Image
                  src={user.image}
                  alt=""
                  className="rounded-xl object-cover"
                />
              )}

              <Avatar.Fallback className="rounded-xl bg-green-100 text-xl font-semibold text-green-800">
                {initial}
              </Avatar.Fallback>
            </Avatar>

            <div className="min-w-0">
              <h2 className="wrap-break-words text-lg font-semibold text-[#202a23]">
                {user.name}
              </h2>

              <p className="mt-1 break-all text-sm text-gray-500">
                {user.email}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              type="button"
              variant="ghost"
              onPress={handleSignOut}
              isPending={signingOut}
              isDisabled={busy}
              className="rounded-lg border border-red-400 px-4 text-sm text-red-600 hover:bg-red-50"
            >
              <ArrowRightFromSquare aria-hidden="true" className="size-4" />
              {signingOut ? "সাইন আউট হচ্ছে..." : "সাইন আউট"}
            </Button>

            <Button
              type="button"
              variant="secondary"
              onPress={handleLinkGitHub}
              isPending={linking}
              isDisabled={busy}
              className="rounded-lg text-sm"
            >
              {linking
                ? "GitHub-এ নিয়ে যাওয়া হচ্ছে..."
                : "GitHub সংযুক্ত করুন"}
            </Button>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-[#dfe7e1] bg-[#f9fcfa] p-6">
          <h2 className="mb-4 font-semibold text-[#202a23]">তথ্য</h2>

          <Link
            href="/profile/edit"
            className="inline-flex rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-green-800"
          >
            তথ্য আপডেট করুন
          </Link>
        </div>
      </div>
    </section>
  );
}
