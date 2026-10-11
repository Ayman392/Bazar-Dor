"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Label } from "@heroui/react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function EditProfilePage() {
  const router = useRouter();
  const { data: session, isPending, error, refetch } =
    authClient.useSession();

  const [nameInput, setNameInput] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isPending && !error && !session) {
      router.replace("/sign-in");
    }
  }, [isPending, error, session, router]);

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!session || saving) return;

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

    setSaving(true);

    try {
      const { error } = await authClient.updateUser({ name });

      if (error) {
        const message = error.message || "নাম আপডেট করা যায়নি।";
        setErrorMessage(message);
        toast.error(message);
        return;
      }

      toast.success("আপনার নাম আপডেট হয়েছে।");
      await refetch();
      router.replace("/profile");
      router.refresh();
    } catch {
      const message = "সার্ভারের সঙ্গে যোগাযোগ করা যায়নি।";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  if (isPending) {
    return (
      <p role="status" className="py-16 text-center text-sm text-gray-500">
        প্রোফাইল লোড হচ্ছে...
      </p>
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

  return (
    <section className="px-4 py-12 sm:py-20">
      <div className="mx-auto w-full max-w-2xl">
        <Link
          href="/profile"
          className="text-sm text-green-700 hover:underline"
        >
          ← প্রোফাইলে ফিরে যান
        </Link>

        <h1 className="mt-5 text-2xl font-bold text-[#202a23]">
          তথ্য আপডেট করুন
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          আপনার নাম পরিবর্তন করে সংরক্ষণ করুন।
        </p>

        <form
          onSubmit={handleUpdate}
          noValidate
          aria-busy={saving}
          className="mt-6 space-y-5 rounded-2xl border border-[#dfe7e1] bg-[#f9fcfa] p-6 sm:p-8"
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name" className="text-sm text-[#202a23]">
              নাম
            </Label>

            <Input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={nameInput ?? session.user.name}
              onChange={(event) => setNameInput(event.target.value)}
              placeholder="আপনার নাম লিখুন"
              required
              disabled={saving}
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
            isPending={saving}
            isDisabled={saving}
            className="h-10 rounded-lg bg-[#008c3d] text-sm font-semibold text-white shadow-md hover:bg-green-800"
          >
            {saving ? "আপডেট হচ্ছে..." : "আপডেট করুন"}
          </Button>
        </form>
      </div>
    </section>
  );
}