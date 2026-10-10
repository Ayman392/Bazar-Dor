"use client";

import { useEffect, useState } from "react";
import ProductCard, {
  type Product,
} from "@/components/ProductCard/ProductCard";

export default function AllProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        const response = await fetch(
          "https://api.api-store.workers.dev/api/bazardor/products",
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Failed to load products");
        }

        const data: Product[] = await response.json();
        setProducts(data);
      } catch {
        if (!controller.signal.aborted) {
          setError(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => controller.abort();
  }, []);

  return (
    <section
      id="সব-পণ্য"
      aria-labelledby="all-products-title"
      className="scroll-mt-6 px-4 pt-8 pb-12 sm:px-6"
    >
      <h2
        id="all-products-title"
        className="text-xl font-bold text-gray-900"
      >
        সব পণ্য
      </h2>

      <p className="mt-2 mb-5 text-sm text-gray-500">
        নিত্যপ্রয়োজনীয় পণ্যের আজকের বাজারদর এক নজরে
      </p>

      {loading ? (
        <div role="status">
          <span className="sr-only">পণ্যের দাম লোড হচ্ছে...</span>

          <div
            aria-hidden="true"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {Array.from({ length: 8 }, (_, index) => (
              <div
                key={index}
                className="h-36 rounded-2xl border border-[#dfe7e1] bg-white p-4 motion-safe:animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-gray-100" />

                  <div className="space-y-2">
                    <div className="h-3 w-24 rounded bg-gray-100" />
                    <div className="h-2 w-16 rounded bg-gray-100" />
                  </div>
                </div>

                <div className="mt-5 h-4 w-20 rounded bg-gray-100" />
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        <p role="alert" className="text-sm text-red-600">
          পণ্যের দাম লোড করা যায়নি। আবার চেষ্টা করতে পেজ রিফ্রেশ করুন।
        </p>
      ) : products.length === 0 ? (
        <p className="text-sm text-gray-500">
          কোনো পণ্য পাওয়া যায়নি।
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}