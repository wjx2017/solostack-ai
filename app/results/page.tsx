"use client";

import { useRouter } from "next/navigation";
import { useQuizStore } from "@/lib/store";
import { StackCard } from "@/components/results/StackCard";
import { CostCalculator } from "@/components/results/CostCalculator";
import { useEffect } from "react";
import Script from "next/script";

const SITE_URL = "https://solostack.ai";

// JSON-LD for results page (product recommendations)
const productSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": []
};

export default function ResultsPage() {
  const router = useRouter();
  const results = useQuizStore((s) => s.results);
  const answers = useQuizStore((s) => s.answers);
  const reset = useQuizStore((s) => s.reset);

  useEffect(() => {
    if (!results || !answers.industry) {
      // Redirect to quiz if no results
      router.push("/quiz");
    }
  }, [results, answers.industry, router]);

  if (!results) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-500">Generating your personalized recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* JSON-LD for Product Recommendations */}
      <Script
        id="product-list-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": results?.filter(s => s.tools.length > 0).map((stack, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "Product",
                "name": `${stack.nameEn} - AI Tool Stack`,
                "description": `Personalized AI tool stack for ${answers.industry || 'your business'}`,
                "offers": {
                  "@type": "Offer",
                  "price": stack.monthlyTotal,
                  "priceCurrency": "USD"
                }
              }
            })) || []
          })
        }}
        strategy="afterInteractive"
      />
      <section className="py-8 sm:py-16 bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Your Recommended AI Stacks
          </h1>
          <p className="text-gray-500 text-lg">
            {results.length === 0
              ? "No AI stacks match your current budget. Try increasing your budget to see recommendations."
              : `Based on your industry and budget, we've curated ${results.length} tailored plan${results.length > 1 ? "s" : ""} for you`}
          </p>
        </div>

        {/* No results fallback */}
        {results.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg mb-6">
              We couldn't find AI tool combinations that fit your budget.
              Try retaking the quiz with a higher budget range.
            </p>
            <button
              onClick={() => {
                reset();
                router.push("/quiz");
              }}
              className="btn-primary"
            >
              Retake Quiz
            </button>
          </div>
        )}

        {/* Stack Cards */}
        {results.length > 0 && (
          <div className={`grid gap-6 mb-12 ${
            results.length === 1 ? 'md:grid-cols-1 max-w-md mx-auto' :
            results.length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' :
            'md:grid-cols-3'
          }`}>
            {results.map((stack, i) => (
              <StackCard key={i} stack={stack} />
            ))}
          </div>
        )}

        {/* Cost Calculator */}
        <CostCalculator stacks={results} />

        {/* Reset */}
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              reset();
              router.push("/quiz");
            }}
            className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Retake Quiz
          </button>
        </div>
      </div>
    </section>
    </>
  );
}
