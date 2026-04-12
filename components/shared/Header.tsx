"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl">⚡</span>
          <span className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
            Solostack AI
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/quiz"
            className="btn-primary text-sm px-4 py-2"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
