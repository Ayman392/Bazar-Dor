"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function GitHubSignInButton() {
  const [pending, setPending] = useState(false);

  async function handleGitHubSignIn() {
    if (pending) return;

    setPending(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "GitHub দিয়ে সাইন ইন করা যায়নি।");
        setPending(false);
      }
    } catch {
      toast.error("সার্ভারের সঙ্গে যোগাযোগ করা যায়নি। আবার চেষ্টা করুন।");
      setPending(false);
    }
  }

  return (
    <Button
      type="button"
      variant="secondary"
      fullWidth
      isPending={pending}
      isDisabled={pending}
      onPress={handleGitHubSignIn}
      className="h-10 gap-1 rounded-lg border border-[#dfe7e1] bg-white text-sm font-semibold text-gray-800"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-4 shrink-0"
      >
        <path d="M12 .297C5.37.297 0 5.67 0 12.297c0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.043-1.61-4.043-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.838 1.237 1.838 1.237 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 0 1 3.003-.404c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.655 1.652.243 2.873.12 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.805 5.625-5.478 5.922.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.596 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>

      {pending ? "GitHub-এ নিয়ে যাওয়া হচ্ছে..." : "GitHub দিয়ে চালিয়ে যান"}
    </Button>
  );
}