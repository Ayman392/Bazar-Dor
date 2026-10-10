"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

type Market = {
  market: string;
  division: string;
  min: number;
  max: number;
};

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  image: string;
  category: string;
  categoryNameBn: string;
  today: number;
  unit: string;
  markets: Market[];
};

const units: Record<string, string> = {
  kg: "কেজি",
  liter: "লিটার",
  litre: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
};

function formatPrice(value: number) {
  return value.toLocaleString("bn-BD", {
    maximumFractionDigits: 2,
  });
}

function ProductLoading() {
  return (
    <section className="px-6 py-10" role="status">
      <p className="mb-5 text-sm text-gray-500">
        পণ্যের তথ্য লোড হচ্ছে...
      </p>

      <div aria-hidden="true" className="space-y-5">
        <div className="h-40 rounded-2xl bg-white motion-safe:animate-pulse" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="h-24 rounded-2xl bg-white motion-safe:animate-pulse"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ProductPage() {
  return (
    <Suspense fallback={<ProductLoading />}>
      <ProductRoute />
    </Suspense>
  );
}

function ProductRoute() {
  const { product } = useParams<{ product: string }>();

  return <ProductDetails key={product} slug={product} />;
}

function ProductDetails({ slug }: { slug: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProduct() {
      try {
        const response = await fetch(
          "https://api.abcz.workers.dev/api/bazardor/products",
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Failed to load product");
        }

        const products: Product[] = await response.json();

        if (controller.signal.aborted) return;

        setProduct(products.find((item) => item.slug === slug) ?? null);
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

    loadProduct();

    return () => controller.abort();
  }, [slug]);

  if (loading) return <ProductLoading />;

  if (error) {
    return (
      <section className="px-6 py-16 text-center">
        <p role="alert" className="text-red-600">
          পণ্যের তথ্য লোড করা যায়নি। আবার চেষ্টা করতে পেজ রিফ্রেশ করুন।
        </p>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          পণ্যটি পাওয়া যায়নি
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

  const markets = product.markets ?? [];
  const unit = units[product.unit] ?? product.unit;

  const minimum = markets.length
    ? Math.min(...markets.map((market) => market.min))
    : null;

  const maximum = markets.length
    ? Math.max(...markets.map((market) => market.max))
    : null;

  const average = markets.length
    ? markets.reduce(
        (total, market) => total + (market.min + market.max) / 2,
        0
      ) / markets.length
    : null;

  const summary = [
    { label: "সর্বনিম্ন দাম", value: minimum },
    { label: "সর্বোচ্চ দাম", value: maximum },
    { label: "গড় দাম (আনুমানিক)", value: average },
  ];

  return (
    <section className="space-y-6 px-4 py-8 sm:px-6">
      <Link
        href="/"
        className="inline-block text-sm font-medium text-green-700 hover:underline"
      >
        ← হোম পেজে ফিরে যান
      </Link>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex items-center gap-4">
          <span
            aria-hidden="true"
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-5xl"
          >
            {product.image}
          </span>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {product.nameBn}
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              বিভিন্ন বাজারে আজকের দামের তুলনা
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Link
                href={`/category/${product.category}`}
                className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700"
              >
                {product.categoryNameBn}
              </Link>

              <span className="text-xs text-gray-500">
                প্রতি {unit}
              </span>
            </div>
          </div>
        </div>

        <p className="mt-5 text-sm text-gray-600">
          আজকের দাম:{" "}
          <strong className="text-lg text-gray-900">
            {formatPrice(product.today)} টাকা
          </strong>
          /{unit}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {summary.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-gray-200 bg-white p-5"
          >
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="mt-2 text-xl font-bold text-gray-900">
              {item.value === null
                ? "তথ্য নেই"
                : `${formatPrice(item.value)} টাকা`}
            </p>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500">
        আনুমানিক গড় প্রতিটি বাজারের সর্বনিম্ন ও সর্বোচ্চ দামের
        মধ্যমানের গড় থেকে হিসাব করা হয়েছে।
      </p>

      <div>
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          বাজারভিত্তিক আজকের দাম
        </h2>

        {markets.length === 0 ? (
          <p className="text-sm text-gray-500">
            বাজারভিত্তিক তথ্য পাওয়া যায়নি।
          </p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">
                {product.nameBn} — প্রতি {unit} বাজারভিত্তিক দাম
              </caption>

              <thead className="border-b border-gray-200 bg-green-50">
                <tr>
                  <th scope="col" className="whitespace-nowrap px-5 py-4">
                    বাজার
                  </th>
                  <th scope="col" className="whitespace-nowrap px-5 py-4">
                    বিভাগ
                  </th>
                  <th scope="col" className="whitespace-nowrap px-5 py-4">
                    সর্বনিম্ন দাম
                  </th>
                  <th scope="col" className="whitespace-nowrap px-5 py-4">
                    সর্বোচ্চ দাম
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {markets.map((market) => (
                  <tr key={`${market.division}-${market.market}`}>
                    <th
                      scope="row"
                      className="whitespace-nowrap px-5 py-4 font-medium text-gray-900"
                    >
                      {market.market}
                    </th>
                    <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                      {market.division}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-gray-700">
                      {formatPrice(market.min)} টাকা
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-gray-700">
                      {formatPrice(market.max)} টাকা
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}