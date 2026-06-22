"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const pathname = usePathname();

  // Session থেকে জানি — কে Login করে আছে
  const { data: session, status } = useSession();

  return (
    <nav className="bg-orange-500 px-10 py-4 flex justify-between items-center sticky top-0 shadow-md z-50">
      {/* Logo */}
      <Link href="/" className="text-white text-2xl font-bold">
        🛒 BazarBD
      </Link>

      {/* Nav Links */}
      <ul className="flex gap-8 list-none items-center">
        <li>
          <Link
            href="/"
            className={`font-medium transition ${
              pathname === "/"
                ? "text-white underline"
                : "text-orange-100 hover:text-white"
            }`}
          >
            Home
          </Link>
        </li>

        <li>
          <Link
            href="/products"
            className={`font-medium transition ${
              pathname === "/products"
                ? "text-white underline"
                : "text-orange-100 hover:text-white"
            }`}
          >
            Products
          </Link>
        </li>

        {/* Cart */}
        <li>
          <Link
            href="/cart"
            className="bg-white text-orange-500 font-bold px-4 py-2 rounded-full hover:bg-orange-100 transition"
          >
            🛍️ Cart (0)
          </Link>
        </li>

        {/* Login/Logout অংশ — Session অনুযায়ী বদলাবে */}
        {status === "loading" && (
          <li>
            <div className="w-20 h-8 bg-orange-400 rounded-full animate-pulse" />
          </li>
        )}

        {status === "unauthenticated" && (
          <li>
            <Link
              href="/login"
              className="bg-white text-orange-500 font-bold px-4 py-2 rounded-full hover:bg-orange-100 transition"
            >
              Login
            </Link>
          </li>
        )}

        {status === "authenticated" && session?.user && (
          <li className="flex items-center gap-3">
            {/* User-এর নাম ও Role দেখানো */}
            <div className="text-right">
              <p className="text-white font-medium text-sm">
                {session.user.name}
              </p>
              <p className="text-orange-200 text-xs capitalize">
                {session.user.role?.toLowerCase()}
              </p>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="bg-white text-orange-500 font-bold px-4 py-2 rounded-full hover:bg-orange-100 transition text-sm"
            >
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
