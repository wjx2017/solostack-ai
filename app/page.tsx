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
              Find Your Perfect Stack in 3 Steps
            </h2>
            <p className="mt-4 text-gray-500 text-lg">
              Simple, fast, zero learning curve
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: "📋",
                title: "Answer 5 Questions",
                desc: "Tell us your industry, budget, and needs — takes just 2 minutes.",
              },
              {
                step: "02",
                icon: "⚡",
                title: "Get Personalized Picks",
                desc: "Smart-matched across 3 tiers, from starter to pro.",
              },
              {
                step: "03",
                icon: "🚀",
                title: "Start Building",
                desc: "Click through to sign up. Transparent costs, no hidden fees.",
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
              Why Solostack AI?
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "🎯",
                title: "Precision Matching",
                desc: "3D matching by industry, budget, and use case — find the tools that truly fit.",
              },
              {
                icon: "💰",
                title: "Transparent Costs",
                desc: "Monthly and annual pricing at a glance — make the best budget decisions.",
              },
              {
                icon: "🔗",
                title: "Integration Guides",
                desc: "Not just tools — we show you how to combine them for maximum impact.",
              },
              {
                icon: "⏱️",
                title: "Save Time",
                desc: "Skip dozens of hours of research and trials — get expert picks in 5 minutes.",
              },
              {
                icon: "📱",
                title: "Mobile Friendly",
                desc: "Configure your stack anywhere — works great on phones and tablets.",
              },
              {
                icon: "🆓",
                title: "Completely Free",
                desc: "No sign-up, no paywall — our tool stack finder is free forever.",
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
            Ready to Build Your AI Stack?
          </h2>
          <p className="text-lg text-primary-100 mb-8">
            A 5-minute quiz to find the perfect tool combo for your business
          </p>
          <a
            href="/quiz"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 font-semibold text-lg rounded-2xl hover:bg-gray-50 transition-colors shadow-lg"
          >
            Get Started
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </section>
    </>
  );
}
