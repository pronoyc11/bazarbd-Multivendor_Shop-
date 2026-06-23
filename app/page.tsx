"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";

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

async function loadFeaturedProducts() {
  try {
    const response = await fetch("/api/products?featured=true");
    const result = (await response.json()) as ProductsResponse;
    return result.success ? result.data : [];
  } catch {
    return [];
  }
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    void loadFeaturedProducts().then((products) => {
      if (!ignore) {
        setFeaturedProducts(products);
        setLoading(false);
      }
    });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar />
      <Hero />

      <section className="bg-white py-10 shadow-sm">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 text-center sm:grid-cols-3">
          <div>
            <p className="text-4xl font-bold text-orange-500">500+</p>
            <p className="mt-1 text-gray-500">Vendors</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-orange-500">10,000+</p>
            <p className="mt-1 text-gray-500">Products</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-orange-500">50,000+</p>
            <p className="mt-1 text-gray-500">Happy Customers</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>
          <Link href="/products" className="font-medium text-orange-500 hover:underline">
            View all products
          </Link>
        </div>

        {loading && (
          <div className="py-20 text-center">
            <p className="animate-pulse text-lg text-gray-400">Loading products...</p>
          </div>
        )}

        {!loading && featuredProducts.length === 0 && (
          <div className="py-20 text-center text-gray-500">No featured products found.</div>
        )}

        {!loading && featuredProducts.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => (
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

      <section className="bg-white py-12">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-8 text-2xl font-bold text-gray-800">Categories</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/products?category=Electronics" className="rounded-xl bg-blue-50 p-6 text-center transition hover:bg-blue-100">
              <div className="mb-2 text-4xl">Phone</div>
              <p className="font-medium text-gray-700">Electronics</p>
            </Link>
            <Link href="/products?category=Fashion" className="rounded-xl bg-pink-50 p-6 text-center transition hover:bg-pink-100">
              <div className="mb-2 text-4xl">Style</div>
              <p className="font-medium text-gray-700">Fashion</p>
            </Link>
            <Link href="/products?category=Food" className="rounded-xl bg-green-50 p-6 text-center transition hover:bg-green-100">
              <div className="mb-2 text-4xl">Fresh</div>
              <p className="font-medium text-gray-700">Food</p>
            </Link>
            <Link href="/products?category=Sports" className="rounded-xl bg-yellow-50 p-6 text-center transition hover:bg-yellow-100">
              <div className="mb-2 text-4xl">Play</div>
              <p className="font-medium text-gray-700">Sports</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 p-10 text-white sm:flex-row sm:items-center">
          <div>
            <h3 className="mb-2 text-2xl font-bold">Open your shop on BazarBD</h3>
            <p className="opacity-90">Become a vendor and reach customers across Bangladesh.</p>
          </div>
          <Link
            href="/vendor/dashboard"
            className="whitespace-nowrap rounded-full bg-white px-6 py-3 font-bold text-orange-500 hover:bg-orange-50"
          >
            Become a vendor
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
