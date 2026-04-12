"use client";

import Link from "next/link";
import { useQuizStore } from "@/lib/store";

export function CTAButton({
  href = "/quiz",
  children = "开始配置你的工具栈",
  size = "large",
}: {
  href?: string;
  children?: React.ReactNode;
  size?: "large" | "medium" | "small";
}) {
  const setStarted = useQuizStore((s) => s.setStarted);

  const sizeClasses = {
    large: "px-8 py-4 text-lg rounded-2xl",
    medium: "px-6 py-3 text-base rounded-xl",
    small: "px-4 py-2 text-sm rounded-lg",
  };

  return (
    <Link
      href={href}
      onClick={() => {
        if (href === "/quiz") setStarted();
      }}
      className={`btn-primary ${sizeClasses[size]} inline-flex items-center gap-2`}
    >
      {children}
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
    </Link>
  );
}
