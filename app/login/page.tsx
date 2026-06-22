"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function LoginPage() {

  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // NextAuth-এর signIn function ব্যবহার করছি
    const result = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false, // আমরা নিজে redirect করবো
    });

    if (result?.error) {
      setError("Email অথবা Password ভুল");
      setLoading(false);
      return;
    }

    // Login সফল — Homepage-এ পাঠাও
    router.push("/");
    router.refresh(); // Navbar আপডেট হওয়ার জন্য
  }

  return (
    <main className="min-h-screen bg-gray-100">

      <Navbar />

      <section className="max-w-md mx-auto px-6 py-16">

        <div className="bg-white rounded-2xl shadow-md p-8">

          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            👋 আবার স্বাগতম
          </h1>
          <p className="text-gray-500 mb-6">
            তোমার Account-এ Login করো
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

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
                placeholder="তোমার password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 disabled:bg-gray-300 transition"
            >
              {loading ? "Login হচ্ছে..." : "Login করো"}
            </button>

          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Account নেই?{" "}
            <Link href="/register" className="text-orange-500 hover:underline font-medium">
              Register করো
            </Link>
          </p>

        </div>
      </section>

      <Footer />

    </main>
  );
}
