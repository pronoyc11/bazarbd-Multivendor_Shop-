import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "../components/Navbar";

export default async function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side session check
  const session = await auth();

  // Login না থাকলে → Login page
  if (!session?.user) {
    redirect("/login");
  }

  // VENDOR বা ADMIN না হলে → Homepage
  const role = (session.user as any).role as string;
  if (role !== "VENDOR" && role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-6">

          {/* Sidebar */}
          <aside className="w-56 shrink-0 mt-29">
            <div className="bg-white rounded-xl shadow-sm p-4">

              {/* Vendor Info */}
              <div className="mb-6 pb-4 border-b border-gray-100">
                <p className="text-xs text-gray-400 mb-1">Logged in as</p>
                <p className="font-semibold text-gray-800 text-sm">
                  {session.user.name}
                </p>
                <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                  {role}
                </span>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1">
                <SidebarLink href="/vendor/dashboard" label="📊 Overview" />
                <SidebarLink href="/vendor/products" label="📦 আমার Products" />
                <SidebarLink href="/vendor/products/new" label="➕ নতুন Product" />
              </nav>

            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
}

// Sidebar Link Component
function SidebarLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition"
    >
      {label}
    </Link>
  );
}