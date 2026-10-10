import type { Product } from "@/components/ProductCard/ProductCard";

const API = "https://api.abcz.workers.dev/api/bazardor/products";
const CACHE_TIME = 5 * 60 * 1000;

let cachedProducts: Product[] | null = null;
let cachedAt = 0;
let pendingRequest: Promise<Product[]> | null = null;

export function getProducts(): Promise<Product[]> {
  if (cachedProducts && Date.now() - cachedAt < CACHE_TIME) {
    return Promise.resolve(cachedProducts);
  }

  if (pendingRequest) {
    return pendingRequest;
  }

  pendingRequest = fetch(API)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Failed to load products: ${response.status}`);
      }

      const products: Product[] = await response.json();

      cachedProducts = products;
      cachedAt = Date.now();

      return products;
    })
    .finally(() => {
      pendingRequest = null;
    });

  return pendingRequest;
}