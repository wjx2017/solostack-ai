import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";

const SITE_URL = "https://solostack.ai";

export const metadata: Metadata = {
  title: "Affiliate Disclosure — Solostack AI",
  description:
    "FTC-compliant affiliate disclosure for Solostack AI. Learn about our affiliate relationships and how we earn commissions.",
  keywords: [
    "affiliate disclosure",
    "FTC compliance",
    "affiliate links",
    "commission disclosure",
  ],
  openGraph: {
    title: "Affiliate Disclosure — Solostack AI",
    description: "Transparent disclosure of our affiliate relationships.",
    url: `${SITE_URL}/disclosure`,
    type: "website",
  },
};

// JSON-LD for Disclosure page
const disclosurePageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Affiliate Disclosure",
  "description": "FTC-compliant affiliate disclosure for Solostack AI",
  "url": `${SITE_URL}/disclosure`,
  "mainEntity": {
    "@type": "Organization",
    "name": "Solostack AI",
    "description": "A free tool that helps solopreneurs discover the perfect AI tool stack for their business needs."
  }
};

export default function DisclosurePage() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <Script
        id="disclosure-page-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(disclosurePageSchema) }}
        strategy="afterInteractive"
      />

      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Affiliate Disclosure
            </h1>
            <p className="text-sm text-gray-500">
              Last updated: April 2026
            </p>
          </div>

          {/* FTC Notice */}
          <div className="mb-12">
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100">
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span>📢</span> FTC Compliance Notice
              </h2>
              <p className="text-gray-600 leading-relaxed">
                This website contains affiliate links. This means that if you click on a link and 
                make a purchase, we may earn a commission at <strong>no extra cost to you</strong>. 
                This disclosure is provided in compliance with FTC guidelines and regulations.
              </p>
            </div>
          </div>

          {/* 1. What Are Affiliate Links? */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">1. What Are Affiliate Links?</h2>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <p className="text-gray-600 mb-4">
                Affiliate links are special tracking links that allow us to earn a commission when 
                you make a purchase through our recommendations. Here's how they work:
              </p>
              <ol className="space-y-3 text-gray-600 list-decimal list-inside">
                <li>You click on a tool link on Solostack AI</li>
                <li>You are redirected to the tool's official website</li>
                <li>A tracking cookie is placed on your device</li>
                <li>If you make a purchase (usually within 30-90 days), we earn a commission</li>
                <li>You pay the <strong>same price</strong> as if you visited the site directly</li>
              </ol>
            </div>
          </div>

          {/* 2. Our Affiliate Relationships */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">2. Our Affiliate Relationships</h2>
            <p className="text-gray-600 mb-6">
              Solostack AI participates in affiliate programs with various AI tool providers. 
              These programs allow us to earn commissions when users sign up for tools through 
              our recommendations.
            </p>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-lg">
                  <span>✅</span> Current Affiliate Partners
                </h3>
                <p className="text-gray-600 mb-3">
                  We have affiliate relationships with the following AI tool providers (this list 
                  may change over time):
                </p>
                <div className="grid sm:grid-cols-2 gap-2 text-gray-600 text-sm">
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Notion AI</li>
                    <li>Jasper AI</li>
                    <li>Writesonic</li>
                    <li>Copy.ai</li>
                    <li>Murf AI</li>
                    <li>Pictory</li>
                    <li>Descript</li>
                  </ul>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>n8n</li>
                    <li>Make (formerly Integromat)</li>
                    <li>Canva Pro</li>
                    <li>Grammarly</li>
                    <li>Cursor</li>
                    <li>GitHub Copilot</li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-lg">
                  <span>⚠️</span> Not All Tools Are Affiliate
                </h3>
                <p className="text-gray-600">
                  Some tools listed on Solostack AI may not have affiliate programs, or we may 
                  choose not to participate in their affiliate programs. These tools are included 
                  solely because we believe they are valuable for solopreneurs.
                </p>
              </div>
            </div>
          </div>

          {/* 3. How Commissions Work */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">3. How Commissions Work</h2>
            
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span>💰</span> Commission Structure
              </h3>
              <p className="text-gray-600 mb-3">
                Commission rates vary by tool provider and may include:
              </p>
              <ul className="space-y-2 text-gray-600 list-disc list-inside">
                <li><strong>Percentage-based:</strong> A percentage of the purchase price (typically 10-40%)</li>
                <li><strong>Fixed amount:</strong> A fixed dollar amount per signup</li>
                <li><strong>Recurring:</strong> A percentage of ongoing subscription payments</li>
                <li><strong>One-time:</strong> A one-time payment for initial purchase</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span>📊</span> How We Use Commission Revenue
              </h3>
              <p className="text-gray-600 mb-3">Affiliate commissions help us:</p>
              <ul className="space-y-2 text-gray-600 list-disc list-inside">
                <li>Cover website hosting and maintenance costs</li>
                <li>Keep Solostack AI free for all users</li>
                <li>Continuously research and update tool recommendations</li>
                <li>Create educational content about AI tools</li>
                <li>Improve the recommendation algorithm</li>
              </ul>
            </div>
          </div>

          {/* 4. No Impact on Your Price */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">4. No Impact on Your Price</h2>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span>✅</span> You Pay the Same Price
              </h3>
              <p className="text-gray-600 leading-relaxed mb-3">
                <strong>Important:</strong> Using our affiliate links does <strong>not increase</strong> 
                the price you pay for any tool. The commission is paid by the tool provider out of their 
                marketing budget, not from your purchase.
              </p>
              <p className="text-gray-600 leading-relaxed">
                In some cases, we may have exclusive discount codes that actually <strong>reduce</strong> 
                your cost. These will be clearly marked on the tool's recommendation card.
              </p>
            </div>
          </div>

          {/* 5. Our Recommendation Integrity */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Our Recommendation Integrity</h2>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span>🎯</span> Unbiased Recommendations
              </h3>
              <p className="text-gray-600 leading-relaxed mb-3">
                <strong>We do not let affiliate relationships influence our recommendations.</strong> 
                Here's our commitment:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Tools are recommended based on <strong>algorithmic matching</strong>, not commission rates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>We include tools without affiliate programs if they are the best fit</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>We do not accept payment for placement or preferential ranking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>We only recommend tools we have researched and believe are genuinely useful</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Our recommendation engine prioritizes user needs over revenue potential</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span>🔍</span> How Recommendations Work
              </h4>
              <p className="text-gray-600 mb-3">Our recommendation algorithm scores tools based on:</p>
              <ul className="space-y-2 text-gray-600 list-disc list-inside">
                <li>Industry match (your field)</li>
                <li>Budget alignment (your monthly budget)</li>
                <li>Use case coverage (your specific needs)</li>
                <li>Skill level appropriateness (no-code vs technical)</li>
                <li>Goal alignment (save time, improve quality, etc.)</li>
              </ul>
              <p className="text-gray-600 mt-3 text-sm">
                <strong>Commission rates are NOT a factor in the scoring algorithm.</strong>
              </p>
            </div>
          </div>

          {/* 6. Product Review Process */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Product Review Process</h2>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span>📋</span> How We Evaluate Tools
              </h3>
              <p className="text-gray-600 mb-3">Before adding a tool to Solostack AI, we evaluate it based on:</p>
              <ul className="space-y-2 text-gray-600 list-disc list-inside">
                <li>Feature quality and functionality</li>
                <li>Pricing fairness and transparency</li>
                <li>User reviews and reputation</li>
                <li>Customer support quality</li>
                <li>Integration capabilities</li>
                <li>Security and privacy practices</li>
                <li>Value for solopreneurs specifically</li>
              </ul>
            </div>
            <p className="text-gray-600 mt-4">
              We only include tools that meet our quality standards and are genuinely useful for 
              solopreneurs, regardless of whether they offer affiliate commissions.
            </p>
          </div>

          {/* 7. Cookie Disclosure */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">7. Cookie Disclosure</h2>
            <p className="text-gray-600 mb-4">
              When you click on an affiliate link, the tool provider may place a tracking cookie 
              on your device. This cookie:
            </p>
            <ul className="space-y-2 text-gray-600 list-disc list-inside bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <li>Tracks that you came from Solostack AI</li>
              <li>Typically lasts 30-90 days (varies by provider)</li>
              <li>Allows us to earn commission if you make a purchase</li>
              <li>Does not track your personal information</li>
              <li>Is subject to the tool provider's privacy policy</li>
            </ul>
            <p className="text-gray-600 mt-4">
              You can manage or delete cookies through your browser settings.
            </p>
          </div>

          {/* 8. FTC Guidelines Compliance */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">8. FTC Guidelines Compliance</h2>
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100">
              <p className="text-gray-600 mb-3">
                This disclosure is provided in compliance with the{' '}
                <a
                  href="https://www.ftc.gov/tips-advice/business-center/guidance/ftcs-endorsement-guides-what-people-are-asking"
                  className="text-indigo-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  FTC Endorsement Guides
                </a>
                , which require clear and conspicuous disclosure of material connections between 
                endorsers and companies.
              </p>
              <p className="text-gray-600">
                Our affiliate relationship is a "material connection" that could affect the weight 
                or credibility users give to our recommendations, so we disclose it clearly and 
                prominently.
              </p>
            </div>
          </div>

          {/* 9. Updates to This Disclosure */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">9. Updates to This Disclosure</h2>
            <p className="text-gray-600">
              We may update this Affiliate Disclosure from time to time as our affiliate relationships 
              change or as regulations evolve. Any changes will be posted on this page with an updated 
              "Last updated" date.
            </p>
            <p className="text-gray-600 mt-3">
              We encourage you to review this disclosure periodically.
            </p>
          </div>

          {/* 10. Contact Us */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">10. Contact Us</h2>
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100">
              <p className="text-gray-600 mb-4">
                If you have any questions about our affiliate relationships or this disclosure, 
                please contact us:
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

          {/* Summary */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 mb-12">
            <p className="text-gray-600 text-sm">
              <strong>Summary:</strong> This site contains affiliate links. We may earn a commission 
              when you purchase through our links, at no extra cost to you. This helps us keep 
              Solostack AI free and running. We only recommend tools we genuinely believe are useful 
              for solopreneurs, and affiliate relationships do not influence our recommendations.
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
