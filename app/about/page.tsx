import type { Metadata } from "next";
import Script from "next/script";

const SITE_URL = "https://solostack.ai";

export const metadata: Metadata = {
  title: "About Solostack AI — Our Mission",
  description:
    "Solostack AI helps solopreneurs and indie hackers find the perfect AI tool stack. Learn about our mission to democratize AI tool discovery.",
  keywords: [
    "about solostack",
    "AI tool stack",
    "solopreneur tools",
    "indie hacker resources",
    "AI recommendations",
  ],
  openGraph: {
    title: "About Solostack AI",
    description: "Helping solopreneurs find their perfect AI tool stack in 5 minutes",
    url: `${SITE_URL}/about`,
    type: "website",
  },
};

// JSON-LD for About page
const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": "About Solostack AI",
  "description": "Solostack AI helps solopreneurs and indie hackers find the perfect AI tool stack through personalized recommendations.",
  "url": `${SITE_URL}/about`,
  "mainEntity": {
    "@type": "Organization",
    "name": "Solostack AI",
    "description": "A free tool that helps solopreneurs discover the perfect AI tool stack for their business needs.",
    "foundingDate": "2026",
    "founders": [
      {
        "@type": "Person",
        "name": "Solostack AI Team"
      }
    ]
  }
};

export default function AboutPage() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <Script
        id="about-page-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
        strategy="afterInteractive"
      />

      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              About Solostack AI
            </h1>
            <p className="text-xl text-gray-600">
              Empowering solopreneurs with the right AI tools
            </p>
          </div>

          {/* Mission */}
          <div className="prose prose-lg max-w-none mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              Solostack AI was born from a simple observation: solopreneurs and indie hackers are overwhelmed by the explosion of AI tools. 
              With thousands of AI applications launching every month, it's impossible to keep up. Many entrepreneurs end up wasting money 
              on tools they don't need, or missing out on game-changing solutions that could transform their business.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              We're here to change that. Our mission is to democratize AI tool discovery by providing personalized, transparent, 
              and actionable recommendations — completely free.
            </p>
          </div>

          {/* What We Do */}
          <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-3xl p-8 sm:p-12 mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What We Do</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                {
                  icon: "🎯",
                  title: "Personalized Matching",
                  desc: "Our smart quiz analyzes your industry, budget, and needs to recommend the perfect AI stack.",
                },
                {
                  icon: "💰",
                  title: "Transparent Pricing",
                  desc: "See exact costs for every tool tier. No hidden fees, no surprises.",
                },
                {
                  icon: "🔬",
                  title: "Continuous Research",
                  desc: "We test and update our database weekly to ensure you get the latest recommendations.",
                },
                {
                  icon: "🆓",
                  title: "Always Free",
                  desc: "Solostack AI is free forever. No sign-up, no paywalls, no catches.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="text-3xl">{item.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Why It Matters */}
          <div className="prose prose-lg max-w-none mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why This Matters</h2>
            <p className="text-gray-600 leading-relaxed">
              The solopreneur economy is exploding. More people than ever are building businesses on their own, 
              leveraging AI to compete with larger teams. But the wrong tool choices can cost thousands of dollars 
              and months of wasted time.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              We've seen entrepreneurs give up because they couldn't find the right tools. We've seen brilliant 
              ideas fail because the tech stack was wrong. Solostack AI exists to prevent that.
            </p>
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: "Who is Solostack AI for?",
                  a: "Solostack AI is designed for solopreneurs, indie hackers, freelancers, and small business owners who want to leverage AI tools but don't have time to research hundreds of options."
                },
                {
                  q: "How do you make money?",
                  a: "We're currently free to use. We may explore affiliate partnerships in the future, but we'll always maintain transparency and prioritize your best interests in our recommendations."
                },
                {
                  q: "Can I suggest AI tools to include?",
                  a: "Absolutely! We're always looking to expand our database. Reach out to us at support@solostack.ai with your suggestions."
                },
                {
                  q: "How often do you update recommendations?",
                  a: "We update our database weekly and re-evaluate all recommendations monthly to ensure you always get the most current and accurate information."
                },
              ].map((faq, i) => (
                <div key={i} className="border-b border-gray-200 pb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <a
              href="/quiz"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white font-semibold text-lg rounded-2xl hover:bg-primary-700 transition-colors shadow-lg"
            >
              Start Your Free Quiz
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <p className="mt-4 text-sm text-gray-500">
              Takes 5 minutes · No sign-up required
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
