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

/**
 * Get max monthly total allowed for a given user budget and stack tier.
 * Tiers: Starter (60%), Recommended (80%), Pro (100%)
 */
function getMaxBudgetForTier(budget: string, stackIndex: number): number {
  let maxBudget: number;
  if (budget === "<50") maxBudget = 50;
  else if (budget === "50-100") maxBudget = 100;
  else if (budget === "100-300") maxBudget = 300;
  else maxBudget = 500;

  const tierPercent = [0.6, 0.8, 1.0][stackIndex] || 1.0;
  return maxBudget * tierPercent;
}

/**
 * Select tools within a strict budget.
 * Strategy: For each position, pick the highest-scored tool that still
 * leaves enough budget for remaining positions (using cheapest remaining tools).
 */
function selectToolsWithinBudget(
  scoredTools: (Tool & { score: number })[],
  maxBudget: number,
  maxCount: number
): (Tool & { score: number })[] {
  const selected: (Tool & { score: number })[] = [];
  let total = 0;

  // Sort by price ascending to know the cheapest options.
  const sortedByPrice = [...scoredTools].sort((a, b) => a.pricing.monthly - b.pricing.monthly);

  // Determine the maximum number of tools we can realistically fit in this budget.
  // This prevents impossible targets (e.g. 5 tools in a $50 budget) from yielding an empty stack.
  let affordableCount = 0;
  let affordableTotal = 0;
  for (const tool of sortedByPrice) {
    if (affordableCount >= maxCount) break;
    if (affordableTotal + tool.pricing.monthly > maxBudget) break;
    affordableTotal += tool.pricing.monthly;
    affordableCount += 1;
  }

  const targetCount = affordableCount;
  if (targetCount === 0) return [];

  function minCostForKSlots(k: number, excludeIds: Set<string>): number {
    if (k <= 0) return 0;

    let cost = 0;
    let count = 0;
    for (const t of sortedByPrice) {
      if (!excludeIds.has(t.id)) {
        cost += t.pricing.monthly;
        count++;
        if (count >= k) break;
      }
    }

    // Not enough tools left to fill the requested slots.
    if (count < k) return Number.POSITIVE_INFINITY;
    return cost;
  }

  for (let slot = 0; slot < targetCount; slot++) {
    const remainingSlots = targetCount - slot - 1;
    const selectedIds = new Set(selected.map((s) => s.id));
    const minCostRemaining = minCostForKSlots(remainingSlots, selectedIds);

    // Find the best (highest score) tool that fits while preserving room
    // for the remaining minimum-viable tool set.
    const maxPriceForThisSlot = maxBudget - total - minCostRemaining;

    const affordable = scoredTools
      .filter(
        (t) =>
          !selectedIds.has(t.id) && t.pricing.monthly <= maxPriceForThisSlot
      )
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.pricing.monthly - b.pricing.monthly;
      });

    if (affordable.length > 0) {
      selected.push(affordable[0]);
      total += affordable[0].pricing.monthly;
    } else {
      break;
    }
  }

  return selected;
}

export function generateRecommendations(answers: Partial<Answer>): StackTier[] {
  const allTools = toolsData.tools as Tool[];
  const affiliateIds = new Set(affiliateData.affiliateToolIds);

  // P1 fix: Filter out coding tools for no-code users
  let tools = allTools.filter((t) => affiliateIds.has(t.id));
  if (answers.skillLevel === "no-code") {
    tools = tools.filter((t) => !t.category.includes("coding"));
  }

  const industry = answers.industry || "other";
  const budget = answers.budget || "50-100";
  const scenarios = answers.scenarios || ["writing"];
  const userTier = getBudgetTier(budget);
  const skillLevel = answers.skillLevel || "no-code";

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

    // P1 fix: Technical users get bonus for coding/automation tools
    if (
      skillLevel === "technical" &&
      (tool.category.includes("coding") || tool.category.includes("automation"))
    ) {
      score += 5;
    }

    // P1 fix: No-code users get bonus for productivity/writing tools
    if (
      skillLevel === "no-code" &&
      (tool.category.includes("productivity") || tool.category.includes("writing"))
    ) {
      score += 3;
    }

    return { ...tool, score };
  });

  // Sort by score descending for initial ranking
  scored.sort((a, b) => b.score - a.score);

  // Generate 3 tiers
  const tierLabels = [
    { name: "Starter Stack", nameEn: "Starter Stack", tag: "Great for Beginners", highlighted: false },
    { name: "Growth Stack", nameEn: "Growth Stack", tag: "⭐ Most Popular", highlighted: true },
    { name: "Pro Stack", nameEn: "Pro Stack", tag: "Full-Power Setup", highlighted: false },
  ];

  const toolCounts = [2, 4, 5]; // basic, recommended, premium

  const stacks = tierLabels.map((label, index) => {
    const maxBudget = getMaxBudgetForTier(budget, index);
    const maxCount = toolCounts[index];

    let selected: (Tool & { score: number })[];

    if (index === 1 && skillLevel === "technical") {
      // P1 fix: For technical users, ensure Growth Stack includes at least one technical tool
      const technicalTools = scored.filter(
        (t) => t.category.includes("coding") || t.category.includes("automation")
      );
      technicalTools.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.pricing.monthly - b.pricing.monthly;
      });

      if (technicalTools.length > 0 && technicalTools[0].pricing.monthly <= maxBudget) {
        // Reserve budget for the best technical tool
        const techTool = technicalTools[0];
        const remainingBudget = maxBudget - techTool.pricing.monthly;
        const nonTechnical = scored.filter(
          (t) =>
            t.id !== techTool.id &&
            !t.category.includes("coding") &&
            !t.category.includes("automation")
        );
        const others = selectToolsWithinBudget(nonTechnical, remainingBudget, maxCount - 1);
        selected = [techTool, ...others];
      } else {
        // Fallback: just use budget-aware selection
        selected = selectToolsWithinBudget(scored, maxBudget, maxCount);
      }
    } else {
      selected = selectToolsWithinBudget(scored, maxBudget, maxCount);
    }

    const toolsWithReason = selected.map((tool) => ({
      ...tool,
      reason: getToolReason(tool, industry, scenarios),
    }));

    const monthlyTotal = toolsWithReason.reduce(
      (sum, t) => sum + t.pricing.monthly,
      0
    );
    const annualTotal = toolsWithReason.reduce(
      (sum, t) => sum + t.pricing.annual,
      0
    );
    const annualSavings = Math.round(monthlyTotal * 12 - annualTotal);
    const savingsPercent =
      monthlyTotal * 12 > 0
        ? Math.round((annualSavings / (monthlyTotal * 12)) * 100)
        : 0;

    return {
      name: label.name,
      nameEn: label.nameEn,
      monthlyTotal: Math.round(monthlyTotal),
      annualTotal,
      annualSavings,
      savingsPercent,
      tools: toolsWithReason,
      tag: label.tag,
      highlighted: label.highlighted,
    };
  });

  // Filter out empty stacks: when budget is too tight and no tools were selected,
  // the stack would display "$0/mo" with no tools — a broken user experience.
  return stacks.filter((s) => s.tools.length > 0 && s.monthlyTotal > 0);
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
    developer: "development",
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
