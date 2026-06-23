"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

const categories = ["Electronics", "Fashion", "Food", "Sports", "Beauty", "Home"];
const emojis = ["📱", "💻", "📺", "🎧", "⌚", "🖱️", "👘", "👜", "🏏", "🍎", "⚽", "💄", "🏠", "📦"];

interface FormData {
  name: string;
  description: string;
  price: string;
  category: string;
  stock: string;
  emoji: string;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    price: "",
    category: "Electronics",
    stock: "",
    emoji: "📦",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Page load হলে আসল product data আনো
  useEffect(() => {
    fetchProduct();
  }, [productId]);

  async function fetchProduct() {
    try {
      const res = await fetch(`/api/products/${productId}`);
      const result = await res.json();

      if (result.success) {
        const p = result.data;
        // Form-এ আসল data বসাও
        setFormData({
          name: p.name,
          description: p.description || "",
          price: p.price.toString(),
          category: p.category,
          stock: p.stock.toString(),
          emoji: p.emoji || "📦",
        });
      } else {
        setError("Product পাওয়া যায়নি");
      }
    } catch (err) {
      setError("Load করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleEmojiSelect(emoji: string) {
    setFormData({ ...formData, emoji });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const res = await fetch(`/api/vendor/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!result.success) {
        setError(result.error);
        setSaving(false);
        return;
      }

      // সফল হলে products list-এ ফিরে যাও
      router.push("/vendor/products");

    } catch (err) {
      setError("কিছু ভুল হয়েছে");
      setSaving(false);
    }
  }

  // Loading State
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-center py-16">
          <p className="text-gray-400 animate-pulse">⏳ Product load হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/vendor/products"
          className="text-gray-400 hover:text-gray-600 transition"
        >
          ← ফিরে যান
        </Link>
        <h1 className="text-xl font-bold text-gray-800">
          ✏️ Product Edit করুন
        </h1>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Emoji Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Emoji বেছে নিন
          </label>
          <div className="flex flex-wrap gap-2">
            {emojis.map((emoji) => (
              <button
                type="button"
                key={emoji}
                onClick={() => handleEmojiSelect(emoji)}
                className={`text-2xl p-2 rounded-lg border-2 transition ${
                  formData.emoji === emoji
                    ? "border-orange-400 bg-orange-50"
                    : "border-gray-200 hover:border-orange-200"
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product-এর নাম <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            বিবরণ
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
          />
        </div>

        {/* Price + Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              দাম (টাকায়) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-400">৳</span>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="1"
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Preview */}
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">
            Preview
          </p>
          <div className="bg-white rounded-lg p-4 shadow-sm flex items-center gap-4">
            <span className="text-4xl">{formData.emoji}</span>
            <div>
              <p className="font-semibold text-gray-800">{formData.name}</p>
              <p className="text-orange-500 font-bold">
                ৳ {formData.price ? parseInt(formData.price).toLocaleString() : "0"}
              </p>
              <p className="text-xs text-gray-400">{formData.category}</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 disabled:bg-gray-300 transition"
          >
            {saving ? "⏳ Save হচ্ছে..." : "💾 Save করুন"}
          </button>
          <Link
            href="/vendor/products"
            className="px-6 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition text-center"
          >
            বাতিল
          </Link>
        </div>

      </form>
    </div>
  );
}