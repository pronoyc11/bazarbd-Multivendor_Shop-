"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";

interface Product {
  id: string;
  name: string;
  price: number;
  emoji: string | null;
  category: string;
  stock: number;
  featured: boolean;
  vendor: {
    shopName: string;
  };
}

interface ProductsResponse {
  success: boolean;
  data: Product[];
}

const allCategory = "All";
const categories = [allCategory, "Electronics", "Fashion", "Food", "Sports"];

async function loadProducts(category: string) {
  try {
    const params = new URLSearchParams();
    if (category !== allCategory) {
      params.set("category", category);
    }

    const url = params.size > 0 ? `/api/products?${params.toString()}` : "/api/products";
    const response = await fetch(url);
    const result = (await response.json()) as ProductsResponse;
    return result.success ? result.data : [];
  } catch {
    return [];
  }
}

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || allCategory;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    void loadProducts(activeCategory).then((nextProducts) => {
      if (!ignore) {
        setProducts(nextProducts);
        setLoading(false);
      }
    });

    return () => {
      ignore = true;
    };
  }, [activeCategory]);

  function handleCategoryFilter(category: string) {
    setLoading(true);

    if (category === allCategory) {
      router.push("/products");
      return;
    }

    router.push(`/products?category=${encodeURIComponent(category)}`);
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar />

      <section className="border-b border-gray-200 bg-white px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-6 text-3xl font-bold text-gray-800">All Products</h1>

          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryFilter(category)}
                className={`rounded-full px-5 py-2 font-medium transition ${
                  activeCategory === category
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        {!loading && (
          <p className="mb-6 text-gray-500">
            {activeCategory} products: <span className="font-bold text-gray-800">{products.length}</span>
          </p>
        )}

        {loading && (
          <div className="py-24 text-center">
            <p className="animate-pulse text-lg text-gray-400">Loading products...</p>
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="py-24 text-center">
            <p className="mb-4 text-lg text-gray-500">No products found in this category.</p>
            <button
              type="button"
              onClick={() => handleCategoryFilter(allCategory)}
              className="text-orange-500 hover:underline"
            >
              View all products
            </button>
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id} 
                name={product.name}
                price={product.price}
                vendorName={product.vendor.shopName}
                emoji={product.emoji ?? ""}
              />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-100" />}>
      <ProductsContent />
    </Suspense>
  );
}
