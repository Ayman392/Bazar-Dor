"use client";

import { getProducts } from "@/lib/getProducts";
import { useEffect, useState } from "react";

type Product = {
  id: number;
  nameBn: string;
  image: string;
  today: number;
  unit: string;
  change: {
    dir: string;
    pct: number;
  };
};

const units: Record<string, string> = {
  kg: "কেজি",
  liter: "লিটার",
  litre: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
};

export default function PriceTicker() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [paused, setPaused] = useState(false);

useEffect(() => {
  let active = true;

  async function loadProducts() {
    try {
      const data = await getProducts();

      if (active) {
        setProducts(data);
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
      aria-label="আজকের বাজারদর"
      className="border-b border-gray-100"
    >
      {loading ? (
        <p role="status" className="px-6 py-3 text-sm text-gray-500">
          বাজারদর লোড হচ্ছে...
        </p>
      ) : error ? (
        <p role="alert" className="px-6 py-3 text-sm text-red-600">
          বাজারদর লোড করা যায়নি।
        </p>
      ) : products.length === 0 ? (
        <p className="px-6 py-3 text-sm text-gray-500">
          কোনো পণ্য পাওয়া যায়নি।
        </p>
      ) : (
        <div className="flex items-center">
          <div className="price-ticker min-w-0 flex-1 overflow-hidden">
            <div
              className="price-ticker-track flex"
              style={{
                animationPlayState: paused ? "paused" : "running",
              }}
            >
              {[0, 1].map((copy) => (
                <ul
                  key={copy}
                  aria-hidden={copy === 1 ? true : undefined}
                  className="price-ticker-group"
                >
                  {products.map((product) => (
                    <li
                      key={product.id}
                      className="flex shrink-0 items-center gap-2 whitespace-nowrap border-r border-gray-200 pr-8 text-sm"
                    >
                      <span aria-hidden="true">{product.image}</span>
                      <span className="font-medium text-gray-800">
                        {product.nameBn}
                      </span>

                      <span className="text-gray-600">
                        {product.today.toLocaleString("bn-BD")} টাকা/
                        {units[product.unit] ?? product.unit}
                      </span>

                      <span
                        className={`font-semibold ${
                          product.change.dir === "up"
                            ? "text-green-700"
                            : product.change.dir === "down"
                              ? "text-red-600"
                              : "text-gray-500"
                        }`}
                      >
                        {product.change.dir === "up"
                          ? "▲"
                          : product.change.dir === "down"
                            ? "▼"
                            : "—"}{" "}
                        {Math.abs(product.change.pct).toLocaleString(
                          "bn-BD",
                          {
                            minimumFractionDigits: 1,
                            maximumFractionDigits: 1,
                          }
                        )}
                        %
                      </span>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setPaused((value) => !value)}
            aria-label="বাজারদর স্ক্রল থামান"
            aria-pressed={paused}
            className="shrink-0 px-3 py-2 text-sm text-green-800 motion-reduce:hidden"
          >
            {paused ? "চালু করুন" : "থামান"}
          </button>
        </div>
      )}
    </section>
  );
}