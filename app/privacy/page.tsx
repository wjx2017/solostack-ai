import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";

const SITE_URL = "https://solostack.ai";

export const metadata: Metadata = {
  title: "Privacy Policy — Solostack AI",
  description:
    "Privacy Policy for Solostack AI. Learn how we collect, use, and protect your data when using our AI tool recommendation service.",
  keywords: [
    "privacy policy",
    "data protection",
    "GDPR",
    "user privacy",
    "data collection",
  ],
  openGraph: {
    title: "Privacy Policy — Solostack AI",
    description: "Your privacy matters. Learn how we protect your data.",
    url: `${SITE_URL}/privacy`,
    type: "website",
  },
};

// JSON-LD for Privacy Policy page
const privacyPolicySchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Privacy Policy",
  "description": "Privacy Policy for Solostack AI",
  "url": `${SITE_URL}/privacy`,
  "mainEntity": {
    "@type": "Organization",
    "name": "Solostack AI",
    "description": "A free tool that helps solopreneurs discover the perfect AI tool stack for their business needs."
  }
};

export default function PrivacyPage() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <Script
        id="privacy-policy-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(privacyPolicySchema) }}
        strategy="afterInteractive"
      />

      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-sm text-gray-500">
              Last updated: April 2026
            </p>
          </div>

          {/* Introduction */}
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-gray-600 leading-relaxed">
              At Solostack AI, we take your privacy seriously. This Privacy Policy explains how we collect, use, 
              and protect your personal information when you use our website and services.
            </p>
          </div>

          {/* 1. Information We Collect */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">1. Information We Collect</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span>📝</span> Quiz Responses
                </h3>
                <p className="text-gray-600 mb-3">
                  When you use our AI tool recommendation quiz, we collect your answers to questions about:
                </p>
                <ul className="space-y-2 text-gray-600 list-disc list-inside">
                  <li>Industry type</li>
                  <li>Monthly budget</li>
                  <li>Use cases and scenarios</li>
                  <li>Skill level (no-code, low-code, technical)</li>
                  <li>Goals and objectives</li>
                </ul>
                <p className="text-gray-600 mt-3 text-sm">
                  <strong>Note:</strong> Quiz responses are processed in real-time to generate recommendations. 
                  We do not store personally identifiable quiz responses on our servers.
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span>📊</span> Anonymous Usage Data
                </h3>
                <p className="text-gray-600 mb-3">
                  We automatically collect anonymous usage data to improve our service:
                </p>
                <ul className="space-y-2 text-gray-600 list-disc list-inside">
                  <li>Pages visited and time spent</li>
                  <li>Browser type and device information</li>
                  <li>Referral source (how you found us)</li>
                  <li>Quiz completion rates (without personal data)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 2. How We Use Your Information */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">2. How We Use Your Information</h2>
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100">
              <p className="text-gray-600 mb-4">We use the collected information for the following purposes:</p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 mt-1">•</span>
                  <span><strong>Personalized Recommendations:</strong> To generate AI tool recommendations tailored to your needs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 mt-1">•</span>
                  <span><strong>Service Improvement:</strong> To analyze usage patterns and improve our recommendation engine</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 mt-1">•</span>
                  <span><strong>User Experience:</strong> To provide a better, more personalized browsing experience</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 mt-1">•</span>
                  <span><strong>Analytics:</strong> To understand how users interact with our site (using anonymous data only)</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 3. Data Sharing */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">3. Data Sharing</h2>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-lg">
                <span>🔒</span> We Do NOT Share Your Data
              </h3>
              <p className="text-gray-600 mb-3">
                We <strong>do not sell, trade, or share</strong> your personal information with third parties. 
                Your quiz responses and usage data remain private and are used solely for providing our service.
              </p>
              <p className="text-gray-600">
                <strong>Exception:</strong> We may share <strong>anonymous, aggregated data</strong> (e.g., 
                "30% of users are in the ecommerce industry") for analytical purposes, but this data cannot 
                be used to identify you personally.
              </p>
            </div>
          </div>

          {/* 4. Your Rights */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">4. Your Rights</h2>
            <p className="text-gray-600 mb-6">
              You have the following rights regarding your personal data:
            </p>
            <div className="space-y-4">
              {[
                { icon: "📥", title: "Right to Access", desc: "You can request a copy of the personal data we hold about you." },
                { icon: "🗑️", title: "Right to Deletion", desc: "You can request that we delete your personal data." },
                { icon: "✏️", title: "Right to Correction", desc: "You can request that we correct inaccurate personal data." },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-gray-600 mt-6">
              To exercise these rights, please contact us at{' '}
              <a href="mailto:hello@solostack.ai" className="text-indigo-600 hover:underline">hello@solostack.ai</a>
            </p>
          </div>

          {/* 5. Cookie Usage */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Cookie Usage</h2>
            
            <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span>🍪</span> What Are Cookies?
              </h3>
              <p className="text-gray-600">
                Cookies are small text files stored on your device when you visit our website. 
                They help us provide a better user experience.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Cookies We Use:</h4>
                <ul className="space-y-2 text-gray-600 list-disc list-inside">
                  <li><strong>Essential Cookies:</strong> Required for the quiz to function properly (e.g., maintaining quiz state)</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site (Google Analytics, Plausible)</li>
                  <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Managing Cookies:</h4>
                <p className="text-gray-600 mb-3">
                  You can control cookies through your browser settings. Most browsers allow you to:
                </p>
                <ul className="space-y-2 text-gray-600 list-disc list-inside">
                  <li>View cookies stored on your device</li>
                  <li>Delete individual cookies or all cookies</li>
                  <li>Block cookies from specific websites</li>
                  <li>Block all cookies (may affect website functionality)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 6. Data Security */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Data Security</h2>
            <p className="text-gray-600 mb-4">
              We implement appropriate security measures to protect your personal information, including:
            </p>
            <ul className="space-y-2 text-gray-600 list-disc list-inside bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <li>HTTPS encryption for all data transmission</li>
              <li>Secure hosting on Vercel platform</li>
              <li>Regular security updates and monitoring</li>
              <li>Minimal data collection (only what's necessary)</li>
            </ul>
          </div>

          {/* 7. Changes to This Policy */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">7. Changes to This Policy</h2>
            <p className="text-gray-600">
              We may update this Privacy Policy from time to time. Any changes will be posted on this page 
              with an updated "Last updated" date. We encourage you to review this policy periodically.
            </p>
          </div>

          {/* 8. Contact Us */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">8. Contact Us</h2>
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100">
              <p className="text-gray-600 mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-2">
                  <span>📧</span>
                  Email: <a href="mailto:hello@solostack.ai" className="text-indigo-600 hover:underline ml-1">hello@solostack.ai</a>
                </li>
                <li className="flex items-center gap-2">
                  <span>🐦</span>
                  Twitter: <a href="https://twitter.com/solostack_ai" className="text-indigo-600 hover:underline ml-1" target="_blank" rel="noopener noreferrer">@solostack_ai</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center pt-8 border-t border-gray-200">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
