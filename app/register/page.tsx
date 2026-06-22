"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function RegisterPage() {

  const router = useRouter();

  // Form-এর data রাখার জন্য State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Input-এ লেখা হলে State আপডেট করা
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  // Form Submit হলে
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); // Page reload বন্ধ করা
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.error);
        setLoading(false);
        return;
      }

      // সফল হলে Login page-এ পাঠাও
      router.push("/login");

    } catch {
      setError("কিছু ভুল হয়েছে, আবার চেষ্টা করো");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100">

      <Navbar />

      <section className="max-w-md mx-auto px-6 py-16">

        <div className="bg-white rounded-2xl shadow-md p-8">

          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            🛒 Account তৈরি করুন
          </h1>
          <p className="text-gray-500 mb-6">
            BazarBD-তে কেনাকাটা শুরু করতে Register করো
          </p>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                পুরো নাম
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="তোমার নাম লেখো"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="example@gmail.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="কমপক্ষে ৬ অক্ষর"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 disabled:bg-gray-300 transition"
            >
              {loading ? "Account তৈরি হচ্ছে..." : "Account তৈরি করুন"}
            </button>

          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            আগে থেকে Account আছে?{" "}
            <Link href="/login" className="text-orange-500 hover:underline font-medium">
              Login করো
            </Link>
          </p>

        </div>
      </section>

      <Footer />

    </main>
  );
}
