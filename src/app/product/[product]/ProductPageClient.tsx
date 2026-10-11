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
  yesterday?: number;
  unit: string;
  change?: {
    dir: string;
    pct: number;
  };
  markets: Market[];
};

const units: Record<string, string> = {
  kg: "কেজি",
  liter: "লিটার",
  litre: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
};

function formatNumber(value: number) {
  return value.toLocaleString("bn-BD", {
    maximumFractionDigits: 2,
  });
}

function formatPrice(value: number | null) {
  return value === null ? "তথ্য নেই" : `${formatNumber(value)} টাকা`;
}

function ProductLoading() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <p role="status" className="mb-5 text-sm text-gray-500">
        পণ্যের তথ্য লোড হচ্ছে...
      </p>

      <div aria-hidden="true" className="space-y-5">
        <div className="h-36 rounded-2xl bg-white motion-safe:animate-pulse" />
        <div className="h-96 rounded-2xl bg-white motion-safe:animate-pulse" />
      </div>
    </section>
  );
}

export default function ProductPageClient() {
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
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error(`Failed to load products: ${response.status}`);
        }

        const products: Product[] = await response.json();

        if (!controller.signal.aborted) {
          setProduct(products.find((item) => item.slug === slug) ?? null);
        }
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

    void loadProduct();

    return () => controller.abort();
  }, [slug]);

  if (loading) return <ProductLoading />;

  if (error) {
    return (
      <section className="px-6 py-16 text-center">
        <p role="alert" className="text-red-600">
          পণ্যের তথ্য লোড করা যায়নি। কিছুক্ষণ পরে আবার চেষ্টা করুন।
        </p>

        <Link
          href="/"
          className="mt-5 inline-block text-sm text-green-700 hover:underline"
        >
          ← হোম পেজে ফিরে যান
        </Link>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-[#202a23]">
          পণ্যটি পাওয়া যায়নি
        </h1>

        <Link
          href="/"
          className="mt-6 inline-flex rounded-lg bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800"
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
        0,
      ) / markets.length
    : null;

  const difference =
    typeof product.yesterday === "number"
      ? product.today - product.yesterday
      : null;

  const changeColor =
    product.change?.dir === "up"
      ? "text-green-700"
      : product.change?.dir === "down"
        ? "text-red-600"
        : "text-gray-500";

  const changeSymbol =
    product.change?.dir === "up"
      ? "▲"
      : product.change?.dir === "down"
        ? "▼"
        : "—";

  const summaries = [
    {
      label: "সর্বনিম্ন দাম",
      value: minimum,
      description: "সবচেয়ে কম দামের বাজার",
      color: "text-green-700",
    },
    {
      label: "সর্বোচ্চ দাম",
      value: maximum,
      description: "সবচেয়ে বেশি দামের বাজার",
      color: "text-red-600",
    },
    {
      label: "গড় দাম",
      value: average,
      description: `প্রতি ${unit} — আনুমানিক`,
      color: "text-green-700",
    },
  ];

  return (
    <section className="mx-auto max-w-5xl space-y-5 px-4 py-6 sm:px-6 sm:py-8">
      <nav aria-label="ব্রেডক্রাম্ব">
        <ol className="flex flex-wrap items-center gap-2 text-xs text-gray-600 sm:text-sm">
          <li>
            <Link href="/" className="hover:text-green-700">
              হোম
            </Link>
          </li>

          <li aria-hidden="true">›</li>

          <li>
            <Link
              href={`/category/${product.category}`}
              className="hover:text-green-700"
            >
              {product.categoryNameBn}
            </Link>
          </li>

          <li aria-hidden="true">›</li>

          <li aria-current="page" className="text-[#202a23]">
            {product.nameBn}
          </li>
        </ol>
      </nav>

      <div className="flex flex-col gap-5 rounded-2xl border border-[#dfe7e1] bg-[#f9fcfa] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex min-w-0 items-center gap-4">
          <span
            aria-hidden="true"
            className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-[#f0f5f1] text-4xl sm:size-20 sm:text-5xl"
          >
            {product.image}
          </span>

          <div className="min-w-0">
            <h1 className="text-xl font-bold text-[#202a23] sm:text-3xl">
              {product.nameBn}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              প্রতি {unit} ·{" "}
              <Link
                href={`/category/${product.category}`}
                className="hover:text-green-700"
              >
                {product.categoryNameBn}
              </Link>
            </p>

            <p className="mt-2 text-xs leading-relaxed text-gray-600 sm:text-sm">
              {difference === null
                ? "বিভিন্ন বাজারে আজকের দামের তুলনা"
                : difference === 0
                  ? "গতকালের তুলনায় আজ দাম অপরিবর্তিত।"
                  : `গতকালের তুলনায় আজ দাম ${
                      difference > 0 ? "বেড়েছে" : "কমেছে"
                    } ${formatNumber(Math.abs(difference))} টাকা।`}
            </p>
          </div>
        </div>

        <div className="shrink-0 rounded-2xl bg-[#f0f5f1] px-6 py-4 text-center sm:min-w-28">
          <p className="text-xs text-gray-500">আজকের দাম</p>

          <p className="mt-1 text-3xl font-bold text-[#202a23]">
            {formatNumber(product.today)}
          </p>

          <p className="mt-1 text-xs text-gray-500">টাকা / {unit}</p>

          {product.change && (
            <p className={`mt-2 text-xs font-semibold ${changeColor}`}>
              {changeSymbol}{" "}
              {Math.abs(product.change.pct).toLocaleString("bn-BD", {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })}
              %
            </p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-[#dfe7e1] bg-[#f9fcfa] p-4 sm:p-5">
        <h2 className="mb-3 text-base font-bold text-[#202a23]">
          দামের সারসংক্ষেপ
        </h2>

        <div className="grid gap-3 sm:grid-cols-3">
          {summaries.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-[#e2e9e3] p-4"
            >
              <p className="text-xs text-gray-600">{item.label}</p>

              <p className={`mt-1 text-xl font-bold ${item.color}`}>
                {formatPrice(item.value)}
              </p>

              <p className="mt-1 text-xs text-gray-500">{item.description}</p>
            </div>
          ))}
        </div>

        <h2 className="mb-3 mt-6 text-base font-bold text-[#202a23]">
          বাজারভিত্তিক আজকের দাম
        </h2>

        {markets.length === 0 ? (
          <p className="py-6 text-sm text-gray-500">
            বাজারভিত্তিক তথ্য পাওয়া যায়নি।
          </p>
        ) : (
          <div
            role="region"
            aria-label="বাজারের দামের টেবিল"
            tabIndex={0}
            className="overflow-x-auto rounded-2xl border border-[#dfe7e1] focus-visible:outline-2 focus-visible:outline-green-700"
          >
            <table className="w-full min-w-145 text-left text-xs sm:text-sm">
              <caption className="sr-only">
                {product.nameBn} — প্রতি {unit} বাজারভিত্তিক দাম
              </caption>

              <thead className="bg-[#f9fcfa] text-gray-500">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">
                    বাজার
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    বিভাগ
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">
                    সর্বনিম্ন
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">
                    সর্বোচ্চ
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">
                    গড়
                  </th>
                </tr>
              </thead>

              <tbody className="text-[#303b33]">
                {markets.map((market) => (
                  <tr
                    key={`${market.division}-${market.market}`}
                    className="border-t border-[#dfe7e1] odd:bg-[#f9fcfa] even:bg-[#f0f5f1] hover:bg-green-50"
                  >
                    <th
                      scope="row"
                      className="whitespace-nowrap px-4 py-3 font-medium"
                    >
                      {market.market}
                    </th>

                    <td className="whitespace-nowrap px-4 py-3">
                      {market.division}
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      {formatPrice(market.min)}
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      {formatPrice(market.max)}
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 text-right font-semibold">
                      {formatPrice((market.min + market.max) / 2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="mt-3 text-xs leading-relaxed text-gray-500">
          প্রতিটি বাজারের গড় সর্বনিম্ন ও সর্বোচ্চ দামের মধ্যমান। সারসংক্ষেপের
          গড় এই মধ্যমানগুলোর গড় থেকে হিসাব করা হয়েছে।
        </p>
      </div>
    </section>
  );
}
