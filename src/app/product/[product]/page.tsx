import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth, connectDatabase } from "@/lib/auth";
import ProductPageClient from "./ProductPageClient";

export default function ProductPage() {
  return (
    <Suspense
      fallback={
        <section className="px-6 py-10">
          <p role="status" className="text-sm text-gray-500">
            পণ্যের তথ্য লোড হচ্ছে...
          </p>
        </section>
      }
    >
      <ProtectedProductPage />
    </Suspense>
  );
}

async function ProtectedProductPage() {
  const requestHeaders = await headers();

  await connectDatabase();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session) {
    redirect("/signin");
  }

  return <ProductPageClient />;
}