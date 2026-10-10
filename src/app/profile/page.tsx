"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Avatar, Button, Input, Label } from "@heroui/react";
import { ArrowRightFromSquare } from "@gravity-ui/icons";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();

  const { data: session, isPending, error, refetch } =
    authClient.useSession();

  const [nameInput, setNameInput] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isPending && !error && !session) {
      router.replace("/signin");
    }
  }, [isPending, error, session, router]);

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!session || updating || signingOut) return;

    setErrorMessage("");

    const name = (nameInput ?? session.user.name).trim();

    if (!name) {
      setErrorMessage("আপনার নাম লিখুন।");
      toast.error("আপনার নাম লিখুন।");
      return;
    }

    if (name === session.user.name) {
      toast("নাম পরিবর্তন করে আপডেট করুন।");
      return;
    }

    setUpdating(true);

    try {
      const { error } = await authClient.updateUser({ name });

      if (error) {
        const message = error.message || "নাম আপডেট করা যায়নি।";
        setErrorMessage(message);
        toast.error(message);
        return;
      }

      setNameInput(name);
      toast.success("আপনার নাম আপডেট হয়েছে।");
      await refetch();
      router.refresh();
    } catch {
      const message =
        "সার্ভারের সঙ্গে যোগাযোগ করা যায়নি। আবার চেষ্টা করুন।";

      setErrorMessage(message);
      toast.error(message);
    } finally {
      setUpdating(false);
    }
  }

  async function handleSignOut() {
    if (signingOut || updating) return;

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
  const busy = updating || signingOut;

  return (
    <section className="px-4 py-12 sm:py-20">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#202a23]">
            আমার প্রোফাইল
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#dfe7e1] bg-[#f9fcfa] p-5 sm:p-6">
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
        </div>

        <div className="mt-5 rounded-2xl border border-[#dfe7e1] bg-[#f9fcfa] p-5 sm:p-8">
          <h2 className="mb-6 text-base font-semibold text-[#202a23]">
            তথ্য
          </h2>

          <form
            onSubmit={handleUpdate}
            aria-busy={updating}
            className="space-y-4"
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="profile-name" className="text-sm text-[#202a23]">
                নাম
              </Label>

              <Input
                id="profile-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="আপনার নাম লিখুন"
                value={nameInput ?? user.name}
                onChange={(event) => setNameInput(event.target.value)}
                required
                disabled={busy}
                fullWidth
                className="h-10 rounded-lg border border-[#dfe7e1] bg-transparent px-3 text-sm shadow-none"
              />
            </div>

            {errorMessage && (
              <p role="alert" className="text-sm text-red-600">
                {errorMessage}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isPending={updating}
              isDisabled={busy}
              className="h-10 rounded-lg bg-[#008c3d] text-sm font-semibold text-white shadow-md hover:bg-green-800"
            >
              {updating ? "আপডেট হচ্ছে..." : "আপডেট"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}