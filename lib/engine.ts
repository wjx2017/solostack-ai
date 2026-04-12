import toolsData from "@/data/tools.json";
import affiliateData from "@/data/affiliate-tools.json";

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string[];
  icon: string;
  pricing: {
    monthly: number;
    annual: number;
    freeTier: string;
  };
  affiliateUrl: string;
  bestFor: string[];
  tier: "basic" | "recommended" | "premium";
}

export interface Answer {
  industry: string;
  budget: string;
  scenarios: string[];
  skillLevel: string;
  goals: string[];
}

export interface StackTool extends Tool {
  reason: string;
}

export interface StackTier {
  name: string;
  nameEn: string;
  monthlyTotal: number;
  annualTotal: number;
  annualSavings: number;
  savingsPercent: number;
  tools: StackTool[];
  tag: string;
  highlighted: boolean;
}

export function getBudgetTier(budget: string): "basic" | "recommended" | "premium" {
  if (budget === "<50" || budget === "50-100") return "basic";
  if (budget === "100-300") return "recommended";
  return "premium";
}

export function getBudgetRange(tier: "basic" | "recommended" | "premium"): [number, number] {
  switch (tier) {
    case "basic":
      return [20, 60];
    case "recommended":
      return [80, 180];
    case "premium":
      return [200, 400];
  }
}

export function generateRecommendations(answers: Partial<Answer>): StackTier[] {
  const allTools = toolsData.tools as Tool[];
  const affiliateIds = new Set(affiliateData.affiliateToolIds);
  // Only recommend tools that are in the affiliate whitelist
  const tools = allTools.filter((t) => affiliateIds.has(t.id));
  const industry = answers.industry || "other";
  const budget = answers.budget || "50-100";
  const scenarios = answers.scenarios || ["writing"];
  const userTier = getBudgetTier(budget);

  // Score each tool for this user
  const scored = tools.map((tool) => {
    let score = 0;

    // Industry match
    if (tool.bestFor.includes(industry)) score += 3;
    if (tool.bestFor.includes("freelance")) score += 1; // fallback

    // Scenario match
    const scenarioOverlap = tool.category.filter((c) => scenarios.includes(c));
    score += scenarioOverlap.length * 2;

    // Tier alignment
    if (tool.tier === userTier) score += 2;

    return { ...tool, score };
  });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Generate 3 tiers
  const tiers: ("basic" | "recommended" | "premium")[] = [
    "basic",
    "recommended",
    "premium",
  ];

  const tierNames = {
    basic: { name: "Starter Stack", nameEn: "Starter Stack", tag: "Great for Beginners", highlighted: false },
    recommended: { name: "Growth Stack", nameEn: "Growth Stack", tag: "⭐ Most Popular", highlighted: true },
    premium: { name: "Pro Stack", nameEn: "Pro Stack", tag: "Full-Power Setup", highlighted: false },
  };

  const stacks: StackTier[] = tiers.map((tier) => {
    const [minBudget, maxBudget] = getBudgetRange(tier);

    // Select tools appropriate for this tier
    // Basic: top 2-3 low-cost tools
    // Recommended: top 3-4 tools
    // Premium: top 4-5 tools
    const toolCount = tier === "basic" ? 2 : tier === "recommended" ? 4 : 5;

    // Filter and pick tools
    let selected = scored
      .filter((t) => {
        if (tier === "basic") return t.pricing.monthly <= 25;
        if (tier === "recommended") return t.pricing.monthly <= 30;
        return true;
      })
      .slice(0, toolCount);

    // If not enough, fill from all
    if (selected.length < 2) {
      selected = scored.slice(0, toolCount);
    }

    const toolsWithReason = selected.map((tool) => ({
      ...tool,
      reason: getToolReason(tool, industry, scenarios),
    }));

    const monthlyTotal = toolsWithReason.reduce((sum, t) => sum + t.pricing.monthly, 0);
    const annualTotal = toolsWithReason.reduce((sum, t) => sum + t.pricing.annual, 0);
    const annualSavings = Math.round(monthlyTotal * 12 - annualTotal);
    const savingsPercent = monthlyTotal * 12 > 0
      ? Math.round((annualSavings / (monthlyTotal * 12)) * 100)
      : 0;

    return {
      name: tierNames[tier].name,
      nameEn: tierNames[tier].nameEn,
      monthlyTotal: Math.round(monthlyTotal),
      annualTotal,
      annualSavings,
      savingsPercent,
      tools: toolsWithReason,
      tag: tierNames[tier].tag,
      highlighted: tierNames[tier].highlighted,
    };
  });

  return stacks;
}

function getToolReason(tool: Tool, industry: string, scenarios: string[]): string {
  if (tool.bestFor.includes(industry)) {
    return `Optimized for ${getIndustryLabel(industry)}`;
  }
  const matchCat = tool.category.find((c) => scenarios.includes(c));
  if (matchCat) {
    return `Core tool for ${getCategoryLabel(matchCat)}`;
  }
  return "Great value add-on";
}

function getIndustryLabel(v: string): string {
  const map: Record<string, string> = {
    content: "content creation",
    ecommerce: "e-commerce",
    saas: "SaaS",
    freelance: "freelance",
  };
  return map[v] || v;
}

function getCategoryLabel(v: string): string {
  const map: Record<string, string> = {
    writing: "writing",
    design: "design",
    video: "video",
    coding: "coding",
    automation: "automation",
    "social-media": "social media",
    seo: "SEO",
    productivity: "productivity",
    research: "research",
    web: "web development",
  };
  return map[v] || v;
}
