"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Eye, EyeSlash } from "@gravity-ui/icons";
import { Button, Input, InputGroup, Label } from "@heroui/react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import GoogleSignInButton from "@/components/GoggleSignInButton/GoogleSignInButton";
import GitHubSignInButton from "@/components/GithubSignInButton/GithubSignInButton";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function showError(message: string) {
    setErrorMessage(message);
    toast.error(message);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (pending) return;

    setErrorMessage("");

    const form = event.currentTarget;

    if (!form.checkValidity()) {
      showError("সঠিক ইমেইল এবং পাসওয়ার্ড দিন।");
      form.reportValidity();
      return;
    }

    setPending(true);

    try {
      const { error } = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (error) {
        showError(
          error.code === "INVALID_EMAIL_OR_PASSWORD"
            ? "ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।"
            : error.message || "সাইন ইন করা যায়নি। আবার চেষ্টা করুন।"
        );
        return;
      }

      toast.success("সফলভাবে সাইন ইন হয়েছে।");
      router.replace("/");
      router.refresh();
    } catch {
      showError("সার্ভারের সঙ্গে যোগাযোগ করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="px-4 py-10 sm:py-12">
      <div className="mx-auto w-full max-w-100">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-[#202a23]">
            সাইন ইন করুন
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            আপনার অ্যাকাউন্টে প্রবেশ করে বিস্তারিত বাজারদর দেখুন।
          </p>
        </div>

        <div className="rounded-2xl border border-[#dfe7e1] bg-[#f9fcfa] p-5 sm:p-6">
          <form
            onSubmit={handleSubmit}
            noValidate
            aria-busy={pending}
            className="space-y-4"
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-sm text-[#202a23]">
                ইমেইল
              </Label>

              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                disabled={pending}
                fullWidth
                className="h-10 rounded-lg border border-[#dfe7e1] bg-transparent px-3 text-sm shadow-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" className="text-sm text-[#202a23]">
                পাসওয়ার্ড
              </Label>

              <InputGroup className="h-10 w-full rounded-lg border border-[#dfe7e1] bg-transparent shadow-none">
                <InputGroup.Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="আপনার পাসওয়ার্ড লিখুন"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  disabled={pending}
                  className="min-w-0 text-sm"
                />

                <InputGroup.Suffix className="pe-0">
                  <Button
                    type="button"
                    isIconOnly
                    size="sm"
                    variant="ghost"
                    isDisabled={pending}
                    aria-label={
                      showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখান"
                    }
                    aria-controls="password"
                    onPress={() => setShowPassword((value) => !value)}
                  >
                    {showPassword ? (
                      <Eye aria-hidden="true" className="size-4" />
                    ) : (
                      <EyeSlash aria-hidden="true" className="size-4" />
                    )}
                  </Button>
                </InputGroup.Suffix>
              </InputGroup>
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
              isPending={pending}
              isDisabled={pending}
              className="h-10 rounded-lg bg-[#008c3d] text-sm font-semibold text-white shadow-md hover:bg-green-800"
            >
              {pending ? "সাইন ইন হচ্ছে..." : "সাইন ইন করুন"}
            </Button>
         </form>

<div className="my-5 flex items-center gap-3">
  <div className="h-px flex-1 bg-gray-200" />
  <span className="text-xs text-gray-500">অথবা</span>
  <div className="h-px flex-1 bg-gray-200" />
</div>

<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
<GoogleSignInButton />
<GitHubSignInButton/>
</div>

<p className="mt-4 text-center text-xs text-gray-700">
            অ্যাকাউন্ট নেই?{" "}
            <Link href="/sign-up" className="text-green-700 hover:underline">
              সাইন আপ করুন
            </Link>
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-green-700"
          >
            ← হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </section>
  );
}