"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button, Input, InputGroup, Label } from "@heroui/react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { Eye, EyeSlash } from "@gravity-ui/icons";
import GoogleSignInButton from "@/components/GoggleSignInButton/GoogleSignInButton";
import GitHubSignInButton from "@/components/GithubSignInButton/GithubSignInButton";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    if (!form.checkValidity() || !name.trim()) {
      showError("সঠিক নাম, ইমেইল এবং ৮–১২৮ অক্ষরের পাসওয়ার্ড দিন।");
      form.reportValidity();
      return;
    }

    if (password !== confirmPassword) {
      showError("পাসওয়ার্ড দুটি মিলছে না।");
      return;
    }

    setPending(true);

    try {
      const { error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (error) {
        showError(error.message || "অ্যাকাউন্ট তৈরি করা যায়নি।");
        return;
      }

      toast.success("নিবন্ধনের অনুরোধ সফল হয়েছে। এখন সাইন ইন করুন।");
      router.push("/sign-in");
    } catch {
      showError("সার্ভারের সঙ্গে যোগাযোগ করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setPending(false);
    }
  }

  const inputClass =
    "h-10 rounded-lg border border-[#dfe7e1] bg-transparent px-3 text-sm shadow-none";

  const inputGroupClass =
    "h-10 w-full rounded-lg border border-[#dfe7e1] bg-transparent shadow-none";

  return (
    <section className="px-4 py-10 sm:py-12">
      <div className="mx-auto w-full max-w-100">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-[#202a23]">
            অ্যাকাউন্ট তৈরি করুন
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
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
              <Label htmlFor="name" className="text-sm text-[#202a23]">
                নাম
              </Label>

              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="যেমন: রহিম উদ্দিন"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                disabled={pending}
                fullWidth
                className={inputClass}
              />
            </div>

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
                className={inputClass}
              />
            </div>

<div className="flex flex-col gap-1.5">
  <Label htmlFor="password" className="text-sm text-[#202a23]">
    পাসওয়ার্ড
  </Label>

  <InputGroup className={inputGroupClass}>
    <InputGroup.Input
      id="password"
      name="password"
      type={showPassword ? "text" : "password"}
      autoComplete="new-password"
      placeholder="কমপক্ষে ৮ অক্ষর"
      value={password}
      onChange={(event) => setPassword(event.target.value)}
      minLength={8}
      maxLength={128}
      required
      disabled={pending}
      className="min-w-0 text-sm"
    />

    <InputGroup.Suffix className="pe-0">
      <Button
        type="button"
        isIconOnly
        aria-label={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখান"}
        aria-controls="password"
        size="sm"
        variant="ghost"
        isDisabled={pending}
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

<div className="flex flex-col gap-1.5">
  <Label htmlFor="confirm-password" className="text-sm text-[#202a23]">
    পাসওয়ার্ড নিশ্চিত করুন
  </Label>

  <InputGroup className={inputGroupClass}>
    <InputGroup.Input
      id="confirm-password"
      name="confirmPassword"
      type={showConfirmPassword ? "text" : "password"}
      autoComplete="new-password"
      placeholder="আবার লিখুন"
      value={confirmPassword}
      onChange={(event) => setConfirmPassword(event.target.value)}
      minLength={8}
      maxLength={128}
      required
      disabled={pending}
      className="min-w-0 text-sm"
    />

    <InputGroup.Suffix className="pe-0">
      <Button
        type="button"
        isIconOnly
        aria-label={
          showConfirmPassword
            ? "নিশ্চিতকরণ পাসওয়ার্ড লুকান"
            : "নিশ্চিতকরণ পাসওয়ার্ড দেখান"
        }
        aria-controls="confirm-password"
        size="sm"
        variant="ghost"
        isDisabled={pending}
        onPress={() => setShowConfirmPassword((value) => !value)}
      >
        {showConfirmPassword ? (
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
              {pending ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
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
            অ্যাকাউন্ট আছে?{" "}
            <Link href="/sign-in" className="text-green-700 hover:underline">
              সাইন ইন করুন
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