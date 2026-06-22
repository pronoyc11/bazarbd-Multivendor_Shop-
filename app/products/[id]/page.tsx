"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

// TypeScript Interface
interface ProductDetail {
  id: string;
  name: string;
  description: string | null;
  price: number;
  emoji: string | null;
  category: string;
  stock: number;
  vendor: {
    shopName: string;
    description: string | null;
  };
}

export default function ProductDetailPage() {

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // URL থেকে id পড়া — যেমন /products/abc123 থেকে "abc123"
  const params = useParams();
  const productId = params.id as string;

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      setNotFound(false);

      try {
        const response = await fetch(`/api/products/${productId}`);
        const result = await response.json();

        if (result.success) {
          setProduct(result.data);
        } else {
          setProduct(null);
          setNotFound(true);
        }
      } catch {
        setProduct(null);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  return (
    <main className="min-h-screen bg-gray-100">

      <Navbar />

      <section className="max-w-4xl mx-auto px-6 py-10">

        {/* Back Link */}
        
          <Link href="/products"
          className="text-orange-500 hover:underline inline-block mb-6"
        >
          ← সব Products-এ ফিরে যান
        </Link>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-24">
            <p className="text-gray-400 text-lg animate-pulse">
              ⏳ Product load হচ্ছে...
            </p>
          </div>
        )}

        {/* Not Found State */}
        {!loading && notFound && (
          <div className="text-center py-24 bg-white rounded-xl shadow-md">
            <p className="text-6xl mb-4">🔍</p>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              Product পাওয়া যায়নি
            </h2>
            <p className="text-gray-500 mb-6">
              এই Product হয়তো মুছে ফেলা হয়েছে অথবা ভুল link।
            </p>
            
              <Link href="/products"
              className="bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600"
            >
              সব Products দেখুন
            </Link>
          </div>
        )}

        {/* Product Detail */}
        {!loading && !notFound && product && (
          <div className="bg-white rounded-2xl shadow-md p-10">

            <div className="grid grid-cols-2 gap-10">

              {/* বাম পাশে — Image/Emoji */}
              <div className="bg-gray-50 rounded-xl flex items-center justify-center">
                <div className="text-9xl">{product.emoji}</div>
              </div>

              {/* ডান পাশে — Details */}
              <div>

                {/* Category Badge */}
                <span className="bg-orange-100 text-orange-600 text-sm font-medium px-3 py-1 rounded-full">
                  {product.category}
                </span>

                {/* Name */}
                <h1 className="text-3xl font-bold text-gray-800 mt-4 mb-3">
                  {product.name}
                </h1>

                {/* Price */}
                <p className="text-orange-500 text-3xl font-bold mb-4">
                  ৳ {product.price.toLocaleString()}
                </p>

                {/* Description */}
                {product.description && (
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {product.description}
                  </p>
                )}

                {/* Vendor Info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-500 mb-1">বিক্রেতা</p>
                  <p className="font-semibold text-gray-800">
                    🏪 {product.vendor.shopName}
                  </p>
                </div>

                {/* Stock Info */}
                <p className="mb-6">
                  {product.stock > 0 ? (
                    <span className="text-green-600 font-medium">
                      ✅ Stock: {product.stock}টি বাকি আছে
                    </span>
                  ) : (
                    <span className="text-red-500 font-medium">
                      ❌ Stock নেই
                    </span>
                  )}
                </p>

                {/* Add to Cart Button */}
                <button
                  disabled={product.stock === 0}
                  className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                >
                  🛒 Cart-এ যোগ করুন
                </button>

              </div>
            </div>
          </div>
        )}

      </section>

      <Footer />

    </main>
  );
}
