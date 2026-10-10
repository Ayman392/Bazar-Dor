import Link from "next/link";

export type Product = {
  id: number;
  slug: string;
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

export default function ProductCard({ product }: { product: Product }) {
  const isUp = product.change.dir === "up";
  const isDown = product.change.dir === "down";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="block rounded-2xl border border-[#dfe7e1] bg-white p-4 transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-green-700"
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f0f6f1] text-2xl"
        >
          {product.image}
        </span>

        <div>
          <h3 className="text-sm font-bold text-gray-900">
            {product.nameBn}
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            প্রতি {units[product.unit] ?? product.unit}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs text-gray-500">আজকের দাম</p>

          <p className="mt-1 text-sm text-gray-800">
            <span className="text-lg font-bold">
              {product.today.toLocaleString("bn-BD")}
            </span>{" "}
            টাকা
          </p>
        </div>

        <span
          className={`rounded-full px-2 py-1 text-xs font-semibold ${
            isUp
              ? "bg-green-50 text-red-700"
              : isDown
                ? "bg-red-50 text-green-600"
                : "bg-gray-100 text-gray-500"
          }`}
        >
          {isUp ? "▲" : isDown ? "▼" : "—"}{" "}
          {Math.abs(product.change.pct).toLocaleString("bn-BD", {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          })}
          %
        </span>
      </div>
    </Link>
  );
}