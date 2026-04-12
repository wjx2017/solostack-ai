import { CTAButton } from "@/components/shared/CTAButton";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent-100 rounded-full blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
              Last Updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </div>

            {/* H1 */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
              The Complete AI Tool Stack for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-500">
                Solopreneurs
              </span>{" "}
              in 2026
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed">
              Find your perfect AI toolkit in 5 minutes. No more overwhelm, no more wasted subscriptions.
            </p>

            {/* Value Props */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-accent-500 text-lg">✓</span>
                <span>Save 20+ hours of research</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-accent-500 text-lg">✓</span>
                <span>Personalized recommendations</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-accent-500 text-lg">✓</span>
                <span>Transparent pricing</span>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-10">
              <CTAButton />
            </div>

            {/* Social Proof */}
            <p className="mt-6 text-sm text-gray-400">
              Trusted by 1,000+ solopreneurs · Free to use
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              只需 3 步，找到你的完美工具栈
            </h2>
            <p className="mt-4 text-gray-500 text-lg">
              简单、快速、零门槛
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: "📋",
                title: "回答 5 个问题",
                desc: "告诉我们你的行业、预算和需求，只需 2 分钟。",
              },
              {
                step: "02",
                icon: "⚡",
                title: "获取个性化推荐",
                desc: "智能匹配 3 档方案，从入门到进阶任你选。",
              },
              {
                step: "03",
                icon: "🚀",
                title: "一键开始使用",
                desc: "点击链接直接注册，成本透明，没有隐藏费用。",
              },
            ].map((item) => (
              <div key={item.step} className="card p-6 sm:p-8 text-center group hover:-translate-y-1 transition-transform duration-300">
                <div className="text-5xl mb-4">{item.icon}</div>
                <div className="text-xs font-bold text-primary-500 tracking-widest mb-2">
                  STEP {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              为什么选择 Solostack AI？
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "🎯",
                title: "精准匹配",
                desc: "基于行业、预算、场景三维匹配，推荐最适合你的工具。",
              },
              {
                icon: "💰",
                title: "成本透明",
                desc: "月度/年度成本一目了然，帮你做出最优预算决策。",
              },
              {
                icon: "🔗",
                title: "集成方案",
                desc: "不仅推荐工具，还告诉你怎么组合使用，发挥最大效果。",
              },
              {
                icon: "⏱️",
                title: "节省时间",
                desc: "省去数十小时的调研和试用，5 分钟获得专业建议。",
              },
              {
                icon: "📱",
                title: "移动端友好",
                desc: "随时随地配置你的工具栈，手机上也能轻松完成。",
              },
              {
                icon: "🆓",
                title: "完全免费",
                desc: "工具栈配置完全免费，只为帮你找到最适合的方案。",
              },
            ].map((f) => (
              <div key={f.title} className="card p-6">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            准备好配置你的 AI 工具栈了吗？
          </h2>
          <p className="text-lg text-primary-100 mb-8">
            5 分钟问卷，找到最适合你的工具组合
          </p>
          <a
            href="/quiz"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 font-semibold text-lg rounded-2xl hover:bg-gray-50 transition-colors shadow-lg"
          >
            开始配置
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </section>
    </>
  );
}
