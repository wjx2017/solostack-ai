import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";

const SITE_URL = "https://solostack.ai";

export const metadata: Metadata = {
  title: "Terms of Service — Solostack AI",
  description:
    "Terms of Service for Solostack AI. Read our terms and conditions for using our AI tool recommendation service.",
  keywords: [
    "terms of service",
    "terms and conditions",
    "legal terms",
    "user agreement",
  ],
  openGraph: {
    title: "Terms of Service — Solostack AI",
    description: "Terms and conditions for using Solostack AI.",
    url: `${SITE_URL}/terms`,
    type: "website",
  },
};

// JSON-LD for Terms page
const termsPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Terms of Service",
  "description": "Terms of Service for Solostack AI",
  "url": `${SITE_URL}/terms`,
  "mainEntity": {
    "@type": "Organization",
    "name": "Solostack AI",
    "description": "A free tool that helps solopreneurs discover the perfect AI tool stack for their business needs."
  }
};

export default function TermsPage() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <Script
        id="terms-page-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(termsPageSchema) }}
        strategy="afterInteractive"
      />

      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Terms of Service
            </h1>
            <p className="text-sm text-gray-500">
              Last updated: April 2026
            </p>
          </div>

          {/* Introduction */}
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-gray-600 leading-relaxed">
              Welcome to Solostack AI. By accessing or using our website and services, you agree to be bound 
              by these Terms of Service. Please read them carefully before using our service.
            </p>
          </div>

          {/* 1. Service Description */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">1. Service Description</h2>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-lg">
                  <span>🚀</span> What We Provide
                </h3>
                <p className="text-gray-600 mb-3">
                  Solostack AI is a free AI tool recommendation service designed to help solopreneurs, 
                  freelancers, and small business owners discover AI tools that match their needs, budget, 
                  and use cases.
                </p>
                <p className="text-gray-600 mb-3">Our service includes:</p>
                <ul className="space-y-2 text-gray-600 list-disc list-inside">
                  <li>Interactive quiz to understand your requirements</li>
                  <li>Personalized AI tool recommendations (Starter, Recommended, Pro tiers)</li>
                  <li>Tool information including pricing, features, and affiliate links</li>
                  <li>Educational content about AI tools for solopreneurs</li>
                </ul>
              </div>

              <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-lg">
                  <span>⚠️</span> What We Are Not
                </h3>
                <p className="text-gray-600">
                  Solostack AI is <strong>not</strong> a tool vendor, reseller, or service provider. 
                  We do not sell, license, or provide direct access to any AI tools. All tool purchases 
                  and subscriptions must be made directly through the respective tool providers.
                </p>
              </div>
            </div>
          </div>

          {/* 2. User Responsibilities */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">2. User Responsibilities</h2>
            <p className="text-gray-600 mb-6">
              By using Solostack AI, you agree to:
            </p>
            <div className="space-y-4">
              {[
                {
                  title: "Provide Accurate Information",
                  desc: "When taking the quiz, provide honest and accurate information about your industry, budget, and needs to receive relevant recommendations.",
                },
                {
                  title: "Use Responsibly",
                  desc: "Use this service for lawful purposes only. Do not attempt to abuse, manipulate, or exploit the recommendation system.",
                },
                {
                  title: "Respect Third-Party Tools",
                  desc: "When clicking affiliate links and signing up for recommended tools, you are subject to those tools' own terms of service and privacy policies.",
                },
                {
                  title: "No Automated Access",
                  desc: "Do not use bots, scrapers, or automated systems to access our website without explicit permission.",
                },
              ].map((item) => (
                <div key={item.title} className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="text-green-600">✅</span> {item.title}
                  </h4>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Disclaimer of Warranties */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">3. Disclaimer of Warranties</h2>
            
            <div className="bg-red-50 rounded-2xl p-6 border border-red-200 mb-6">
              <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2 text-lg">
                <span>⚠️</span> Service Provided "As Is"
              </h3>
              <p className="text-gray-600 mb-3">
                Solostack AI is provided on an <strong>"as is" and "as available"</strong> basis 
                without warranties of any kind, either express or implied, including but not limited to:
              </p>
              <ul className="space-y-2 text-gray-600 list-disc list-inside">
                <li>Merchantability or fitness for a particular purpose</li>
                <li>Accuracy, completeness, or reliability of recommendations</li>
                <li>Uninterrupted or error-free operation</li>
                <li>Compatibility with specific tools or workflows</li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span>📌</span> Tool Information Disclaimer
                </h4>
                <p className="text-gray-600 mb-2">
                  While we strive to provide accurate and up-to-date information about AI tools, we 
                  <strong> cannot guarantee</strong> that all information is current, complete, or accurate. 
                  Tool features, pricing, and availability may change without notice.
                </p>
                <p className="text-gray-600 text-sm">
                  <strong>Always verify</strong> details on the official tool website before making purchase decisions.
                </p>
              </div>

              <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span>📌</span> Recommendation Disclaimer
                </h4>
                <p className="text-gray-600">
                  Our recommendations are generated algorithmically based on your quiz responses. 
                  They are suggestions only and <strong>do not constitute professional advice</strong>. 
                  You are responsible for evaluating whether recommended tools meet your specific needs.
                </p>
              </div>
            </div>
          </div>

          {/* 4. Limitation of Liability */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">4. Limitation of Liability</h2>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <p className="text-gray-600 mb-4">
                To the maximum extent permitted by law, Solostack AI and its operators shall not be 
                liable for any indirect, incidental, special, consequential, or punitive damages, 
                including:
              </p>
              <ul className="space-y-2 text-gray-600 list-disc list-inside mb-4">
                <li>Loss of profits, data, or business opportunities</li>
                <li>Purchase decisions based on our recommendations</li>
                <li>Tool subscription costs or cancellation fees</li>
                <li>Technical issues with recommended tools</li>
                <li>Data breaches or security issues with third-party tools</li>
              </ul>
              <p className="text-gray-600">
                Our total liability for any claim arising from your use of Solostack AI shall not 
                exceed <strong>$0 USD</strong>, as our service is provided free of charge.
              </p>
            </div>
          </div>

          {/* 5. Affiliate Disclosure */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Affiliate Disclosure</h2>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-lg">
                <span>💰</span> How We Make Money
              </h3>
              <p className="text-gray-600 mb-3">
                Solostack AI participates in affiliate programs with various AI tool providers. 
                When you click on a tool link and make a purchase, we may earn a commission 
                at <strong>no additional cost to you</strong>.
              </p>
              <p className="text-gray-600 mb-3">This affiliate revenue helps us:</p>
              <ul className="space-y-2 text-gray-600 list-disc list-inside">
                <li>Cover hosting and maintenance costs</li>
                <li>Keep the service free for all users</li>
                <li>Continuously update and improve recommendations</li>
              </ul>
              <p className="text-gray-600 mt-3">
                <strong>Important:</strong> Affiliate relationships do not influence our recommendations. 
                Tools are recommended based on algorithmic matching, not commission rates.
              </p>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              For detailed information, see our{' '}
              <Link href="/disclosure" className="text-indigo-600 hover:underline">Affiliate Disclosure</Link> page.
            </p>
          </div>

          {/* 6. Intellectual Property */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Intellectual Property</h2>
            <p className="text-gray-600 mb-4">
              All content on Solostack AI, including text, graphics, logos, and code, is the property 
              of Solostack AI or its content suppliers and is protected by copyright and intellectual 
              property laws.
            </p>
            <p className="text-gray-600">
              You may not reproduce, distribute, modify, create derivative works of, publicly display, 
              or commercially exploit any content from this website without explicit permission.
            </p>
          </div>

          {/* 7. Third-Party Links */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">7. Third-Party Links</h2>
            <p className="text-gray-600 mb-4">
              Our website contains links to third-party websites (AI tool providers). We do not control 
              and are not responsible for the content, privacy policies, or practices of these websites.
            </p>
            <p className="text-gray-600">
              You access third-party websites at your own risk. We encourage you to review their terms 
              and privacy policies before providing any personal information or making purchases.
            </p>
          </div>

          {/* 8. Dispute Resolution */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">8. Dispute Resolution</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span>🤝</span> Good Faith Negotiation
                </h4>
                <p className="text-gray-600">
                  In the event of any dispute arising from these Terms or your use of Solostack AI, 
                  both parties agree to attempt to resolve the dispute through good faith negotiation 
                  before pursuing legal action.
                </p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span>⚖️</span> Governing Law
                </h4>
                <p className="text-gray-600">
                  These Terms shall be governed by and construed in accordance with the laws of the 
                  jurisdiction where Solostack AI operates, without regard to conflict of law provisions.
                </p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span>🏛️</span> Jurisdiction
                </h4>
                <p className="text-gray-600">
                  Any legal action or proceeding arising from these Terms shall be brought exclusively 
                  in the courts located in the jurisdiction where Solostack AI operates.
                </p>
              </div>
            </div>
          </div>

          {/* 9. Changes to Terms */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">9. Changes to Terms</h2>
            <p className="text-gray-600">
              We reserve the right to modify these Terms of Service at any time. Changes will be 
              effective immediately upon posting to this page. Your continued use of Solostack AI 
              after changes constitutes acceptance of the new Terms.
            </p>
            <p className="text-gray-600 mt-3">
              We encourage you to review these Terms periodically for updates.
            </p>
          </div>

          {/* 10. Termination */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">10. Termination</h2>
            <p className="text-gray-600">
              We reserve the right to terminate or suspend your access to Solostack AI at our sole 
              discretion, without notice, for conduct that we believe violates these Terms or is 
              harmful to other users, us, or third parties.
            </p>
          </div>

          {/* 11. Contact Information */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">11. Contact Information</h2>
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100">
              <p className="text-gray-600 mb-4">
                If you have any questions about these Terms of Service, please contact us:
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

          {/* Acceptance Notice */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 mb-12">
            <p className="text-gray-600 text-sm">
              By using Solostack AI, you acknowledge that you have read, understood, and agree to 
              be bound by these Terms of Service.
            </p>
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
