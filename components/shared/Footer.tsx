import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚡</span>
            <span className="font-semibold text-gray-700">Solostack AI</span>
          </div>
          <div className="text-sm text-gray-500 text-center">
            © {year} Solostack AI. 一人公司 AI 工具栈配置器。
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Last Updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-400 text-center">
          免责声明：本网站包含 Affiliate 链接，点击购买我们可能获得佣金，这不会增加您的成本。
        </div>
      </div>
    </footer>
  );
}
