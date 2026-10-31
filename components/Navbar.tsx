"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Droplet, UserPlus, LogIn } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  // Hide Navbar completely on dashboard and admin login pages
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin/login")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-rose-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-red-700 flex items-center justify-center text-white shadow-md shadow-rose-200 group-hover:scale-105 transition-transform">
              <Droplet className="w-6 h-6 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-gray-900">
                  SRDS
                </span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">
                  Sarioon
                </span>
              </div>
              <p className="text-[11px] font-medium text-gray-500 leading-none">
                Sarioon Red Drop Society
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/#registration-section"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:text-rose-600 hover:bg-rose-50/60 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Registration Portal</span>
            </Link>

            <Link
              href="/admin/login"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 shadow-sm shadow-rose-200 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Admin Login</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
