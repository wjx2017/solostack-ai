import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Solostack AI — 5 分钟找到适合你的一人公司 AI 工具栈",
  description:
    "通过智能问卷，为你推荐最匹配的 AI 工具组合。透明定价、清晰对比，让你少走弯路。",
  keywords: "AI工具, 一人公司, 独立开发者, 工具栈, AI配置, solopreneur",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
