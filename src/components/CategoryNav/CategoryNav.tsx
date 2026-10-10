"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Category = {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
};

export default function CategoryNav() {
  const pathname = usePathname();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCategories() {
      try {
        const response = await fetch(
          "https://api.api-store.workers.dev/api/bazardor/categories",
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Failed to load categories");
        }

        const data: Category[] = await response.json();
        setCategories(data);
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

    loadCategories();

    return () => controller.abort();
  }, []);

return (
  <nav
    aria-label="পণ্যের বিভাগ"
    className="border-b border-gray-200"
  >
    <div className="mx-auto flex max-w-7xl items-center gap-6 overflow-x-auto px-6 py-3">
      {categories.map((category) => {
        const href = `/category/${category.slug}`;
        const isActive = pathname === href;

        return (
          <Link
            key={category.id}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={`flex shrink-0 items-center gap-2 whitespace-nowrap text-sm font-medium transition-colors ${
              isActive
                ? "text-green-700"
                : "text-gray-800 hover:text-green-700"
            }`}
          >
            <span aria-hidden="true">{category.icon}</span>
            <span>{category.nameBn}</span>
          </Link>
        );
      })}

      {loading && (
        <span role="status" className="text-sm text-gray-500">
          লোড হচ্ছে...
        </span>
      )}

      {error && (
        <span role="alert" className="text-sm text-red-600">
          বিভাগ লোড করা যায়নি।
        </span>
      )}
    </div>
  </nav>
);
}