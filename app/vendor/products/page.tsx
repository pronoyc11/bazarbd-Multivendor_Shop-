"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  emoji: string | null;
  featured: boolean;
  createdAt: string;
}

export default function VendorProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await fetch("/api/vendor/products");
      const result = await res.json();
      if (result.success) {
        setProducts(result.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(productId: string, productName: string) {
    if (!confirm(`"${productName}" মুছে ফেলবেন?`)) return;

    try {
      const res = await fetch(`/api/vendor/products/${productId}`, {
        method: "DELETE",
      });
      const result = await res.json();

      if (result.success) {
        // List থেকে সরিয়ে দাও
        setProducts(products.filter((p) => p.id !== productId));
      } else {
        alert("মুছতে সমস্যা হয়েছে");
      }
    } catch (err) {
      alert("কিছু ভুল হয়েছে");
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-800">
          📦 আমার Products
        </h1>
        <Link
          href="/vendor/products/new"
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition text-sm font-medium"
        >
          ➕ নতুন Product
        </Link>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-16">
          <p className="text-gray-400 animate-pulse">⏳ Load হচ্ছে...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && products.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-gray-500 mb-4">এখনো কোনো product নেই</p>
          <Link
            href="/vendor/products/new"
            className="text-orange-500 hover:underline"
          >
            প্রথম product যোগ করুন →
          </Link>
        </div>
      )}

      {/* Products Table */}
      {!loading && products.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-gray-500">
                <th className="pb-3 font-medium">Product</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">দাম</th>
                <th className="pb-3 font-medium">Stock</th>
                <th className="pb-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{product.emoji}</span>
                      <span className="font-medium text-gray-800">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-gray-500">{product.category}</td>
                  <td className="py-3 font-medium text-orange-500">
                    ৳ {product.price.toLocaleString()}
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        product.stock > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {product.stock > 0 ? `${product.stock}টি` : "শেষ"}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/vendor/products/${product.id}/edit`}
                        className="text-blue-500 hover:underline text-xs"
                      >
                        ✏️ Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="text-red-500 hover:underline text-xs"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}