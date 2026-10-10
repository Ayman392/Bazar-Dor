"use client";

import { useEffect, useState } from "react";
import ProductCard, {
  type Product,
} from "@/components/ProductCard/ProductCard";
import { getProducts } from "@/lib/getProducts";

export default function PriceRisers() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

useEffect(() => {
  let active = true;

  async function loadProducts() {
    try {
      const data = await getProducts();

      const topRisers = data
        .filter((product) => product.change.dir === "up")
        .sort((a, b) => b.change.pct - a.change.pct)
        .slice(0, 6);

      if (active) {
        setProducts(topRisers);
        setError(false);
      }
    } catch {
      if (active) setError(true);
    } finally {
      if (active) setLoading(false);
    }
  }

  loadProducts();

  return () => {
    active = false;
  };
}, []);

  return (
    <section
      aria-labelledby="price-risers-title"
      className="px-4 pt-8 pb-4 sm:px-6"
    >
      <h2
        id="price-risers-title"
        className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900"
      >
        <span aria-hidden="true" className="text-red-700">
          ▲
        </span>
        আজ দাম বেড়েছে
      </h2>

      {loading ? (
        <div role="status">
          <span className="sr-only">পণ্যের দাম লোড হচ্ছে...</span>

          <div
            aria-hidden="true"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {Array.from({ length: 6 }, (_, index) => (
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
          আজ কোনো পণ্যের দাম বাড়েনি।
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}