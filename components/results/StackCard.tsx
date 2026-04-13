"use client";

import { usePlausible } from "next-plausible";
import { StackTier } from "@/lib/engine";

export function StackCard({ stack }: { stack: StackTier }) {
  const plausible = usePlausible();
  
  function handleAffiliateClick(toolName: string, toolCategory?: string) {
    plausible('affiliate_link_clicked', {
      props: {
        tool_name: toolName,
        tool_category: toolCategory?.[0] || 'other',
        stack_tier: stack.nameEn,
      }
    });
  }
  return (
    <div
      className={`card overflow-hidden ${
        stack.highlighted
          ? "ring-2 ring-primary-500 shadow-lg shadow-primary-500/10 scale-[1.02]"
          : ""
      }`}
    >
      {/* Header */}
      <div
        className={`p-6 text-center ${
          stack.highlighted
            ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white"
            : "bg-gray-50"
        }`}
      >
        {stack.highlighted && (
          <span className="inline-block px-3 py-1 bg-accent-500 text-white text-xs font-bold rounded-full mb-2">
            {stack.tag}
          </span>
        )}
        <h3
          className={`text-xl font-bold ${
            stack.highlighted ? "text-white" : "text-gray-900"
          }`}
        >
          {stack.name}
        </h3>
        <p
          className={`text-sm ${
            stack.highlighted ? "text-primary-100" : "text-gray-500"
          }`}
        >
          {stack.nameEn}
        </p>
        <div className="mt-3">
          <span
            className={`text-3xl font-bold ${
              stack.highlighted ? "text-white" : "text-gray-900"
            }`}
          >
            ${stack.monthlyTotal}
          </span>
          <span
            className={`text-sm ml-1 ${
              stack.highlighted ? "text-primary-200" : "text-gray-500"
            }`}
          >
            /mo
          </span>
        </div>
      </div>

      {/* Tools List */}
      <div className="p-6">
        <div className="space-y-3">
          {stack.tools.map((tool) => (
            <a
              key={tool.id}
              href={tool.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleAffiliateClick(tool.name, tool.category?.[0])}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <span className="text-2xl mt-0.5">{tool.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {tool.name}
                  </span>
                  <span className="text-sm font-medium text-gray-500">
                    ${tool.pricing.monthly}/mo
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{tool.description}</p>
                <p className="text-xs text-primary-600 mt-1">{tool.reason}</p>
              </div>
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <a
            href={stack.tools[0]?.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleAffiliateClick(stack.tools[0]?.name, stack.tools[0]?.category?.[0])}
            className={`btn-primary w-full text-center ${
              stack.highlighted
                ? ""
                : "bg-primary-600 text-white hover:bg-primary-700"
            }`}
          >
            Get {stack.name}
          </a>
        </div>
      </div>
    </div>
  );
}
