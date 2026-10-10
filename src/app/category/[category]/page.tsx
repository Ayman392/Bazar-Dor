"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import ProductCard, {
  type Product,
} from "@/components/ProductCard/ProductCard";

type Category = {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
};

type CategoryProduct = Product & {
  category: string;
};

const API = "https://api.abcz.workers.dev/api/bazardor";

function CategoryLoading() {
  return (
    <section className="px-6 py-10" role="status">
      <p className="mb-5 text-sm text-gray-500">
        পণ্য লোড হচ্ছে...
      </p>

      <div
        aria-hidden="true"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="h-36 rounded-2xl border border-gray-200 bg-white motion-safe:animate-pulse"
          />
        ))}
      </div>
    </section>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={<CategoryLoading />}>
      <CategoryContent />
    </Suspense>
  );
}

function CategoryContent() {
  const { category } = useParams<{ category: string }>();

  return <CategoryProducts key={category} category={category} />;
}

function CategoryProducts({ category }: { category: string }) {
  const [categoryInfo, setCategoryInfo] = useState<Category | null>(null);
  const [products, setProducts] = useState<CategoryProduct[]>([]);
  const [sort, setSort] = useState("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCategory() {
      try {
        const [categoryResponse, productResponse] = await Promise.all([
          fetch(`${API}/categories`, {
            signal: controller.signal,
          }),
          fetch(`${API}/products`, {
            signal: controller.signal,
          }),
        ]);

        if (!categoryResponse.ok || !productResponse.ok) {
          throw new Error("Failed to load category");
        }

        const categories: Category[] = await categoryResponse.json();
        const allProducts: CategoryProduct[] =
          await productResponse.json();

        if (controller.signal.aborted) return;

        const selectedCategory = categories.find(
          (item) => item.slug === category
        );

        setCategoryInfo(selectedCategory ?? null);

        setProducts(
          selectedCategory
            ? allProducts.filter(
                (product) => product.category === selectedCategory.id
              )
            : []
        );
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

    loadCategory();

    return () => controller.abort();
  }, [category]);

  const sortedProducts = [...products];

  if (sort === "low") {
    sortedProducts.sort((a, b) => a.today - b.today);
  } else if (sort === "high") {
    sortedProducts.sort((a, b) => b.today - a.today);
  }

  if (loading) {
    return <CategoryLoading />;
  }

  if (error) {
    return (
      <section className="px-6 py-16 text-center">
        <p role="alert" className="text-red-600">
          তথ্য লোড করা যায়নি। আবার চেষ্টা করতে পেজ রিফ্রেশ করুন।
        </p>
      </section>
    );
  }

  if (!categoryInfo || products.length === 0) {
    return (
      <section className="px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {categoryInfo
            ? "এই বিভাগে কোনো পণ্য পাওয়া যায়নি"
            : "বিভাগটি পাওয়া যায়নি"}
        </h1>

        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800"
        >
          হোম পেজে ফিরে যান
        </Link>
      </section>
    );
  }

  return (
    <section className="px-6 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="flex items-center gap-3 text-2xl font-bold text-gray-900">
          <span aria-hidden="true">{categoryInfo.icon}</span>
          {categoryInfo.nameBn}
        </h1>

        <div className="flex items-center gap-2">
          <label
            htmlFor="price-sort"
            className="text-sm font-medium text-gray-700"
          >
            সাজান:
          </label>

          <select
            id="price-sort"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-2 focus:outline-green-700"
          >
            <option value="default">ডিফল্ট</option>
            <option value="low">দাম: কম থেকে বেশি</option>
            <option value="high">দাম: বেশি থেকে কম</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sortedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}