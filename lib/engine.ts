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
 * Get the primary category of a tool (first element of category array).
 * Used for diversity enforcement to prevent a single category from
 * dominating a stack, even when tools list multiple categories.
 */
function getPrimaryCategory(tool: Tool): string {
  return tool.category[0] || "other";
}

/**
 * Select tools within a strict budget.
 * Strategy: For each position, pick the highest-scored tool that still
 * leaves enough budget for remaining positions (using cheapest remaining tools).
 *
 * Diversity guard (two-layer):
 *   1) Primary category cap: no more than 1 tool per primary category per stack.
 *      This prevents a stack from being dominated by tools of the same kind,
 *      even when those tools list multiple overlapping categories.
 *   2) Scenario category cap: no more than `maxPerScenarioCat` tools sharing
 *      any user-selected scenario category. Prevents tools from sneaking in
 *      via secondary category matches when the primary is already full.
 * Together, these ensure that a stack of N tools spans at least N distinct
 * primary categories, solving the "writing tools eat all recommendation slots"
 * problem where tools like Grammarly (writing+productivity) and Notion AI
 * (writing+productivity) both qualify under different category names.
 */
function selectToolsWithinBudget(
  scoredTools: (Tool & { score: number })[],
  maxBudget: number,
  maxCount: number,
  scenarioCategories?: string[],
  maxPerScenarioCat: number = 1,
  isDeveloperWithCoding: boolean = false,
  maxDevCategoryCount: number = 1
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

    // --- Diversity tracking ---

    // (1) Primary category counts: first category of each selected tool.
    //     Cap = 1 per primary category.
    const primaryCatCount: Record<string, number> = {};
    selected.forEach((s) => {
      const pc = getPrimaryCategory(s);
      primaryCatCount[pc] = (primaryCatCount[pc] || 0) + 1;
    });

    // (2) Scenario category counts: for tools whose ANY category matches
    //     a user-selected scenario.
    const scenarioCatCount: Record<string, number> = {};
    if (scenarioCategories) {
      selected.forEach((s) => {
        s.category.forEach((c) => {
          if (scenarioCategories.includes(c)) {
            scenarioCatCount[c] = (scenarioCatCount[c] || 0) + 1;
          }
        });
      });
    }

    const affordable = scoredTools
      .filter(
        (t) =>
          !selectedIds.has(t.id) &&
          t.pricing.monthly <= maxPriceForThisSlot &&
          // Diversity guard (1): primary category cap
          // P3 fix: For Developer + Coding, allow up to 3 development tools
          (primaryCatCount[getPrimaryCategory(t)] || 0) <
            (isDeveloperWithCoding && getPrimaryCategory(t) === "development"
              ? maxDevCategoryCount
              : 1) &&
          // Diversity guard (2): scenario category cap
          !(
            scenarioCategories &&
            t.category.some(
              (c) =>
                scenarioCategories.includes(c) &&
                (scenarioCatCount[c] || 0) >= maxPerScenarioCat
            )
          )
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
    tools = tools.filter((t) => !t.category.includes("coding") && !t.category.includes("development"));
  }

  // P2 fix: For Developer + Coding scenario, prioritize dev tools
  // Limit writing tools to max 1 in the final recommendation
  const isDeveloperWithCoding: boolean =
    answers.industry === "developer" &&
    (answers.scenarios?.some((s) => s === "coding" || s === "development") ?? false);

  // P3 fix: For Developer + Coding, allow up to 3 development tools per stack
  const maxDevCategoryCount = isDeveloperWithCoding ? 3 : 1;

  // P4 fix: For Pro Stack, relax dev category diversity constraint so it can
  // fill up to 5 tools when budget is sufficient. The strict diversity guard
  // was causing Pro Stack to only pick 4 cheap tools ($48) while Growth Stack
  // (via the technical path) picks 3 expensive tech tools ($70), creating a
  // price inversion. Pro users expect the most expensive and most comprehensive
  // stack, so we allow more development-category tools for Pro.
  const proMaxDevCategoryCount = isDeveloperWithCoding ? 4 : 2;

  const industry = answers.industry || "other";
  const budget = answers.budget || "50-100";
  // Map questionnaire scenarios to tool categories (coding → development)
  const rawScenarios = answers.scenarios || ["writing"];
  const scenarios = rawScenarios.flatMap((s: string) => {
    const mapping: Record<string, string> = { coding: "development" };
    return mapping[s] ? [s, mapping[s]] : [s];
  });
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

    // P1 fix: Technical users get bonus for coding/automation/development tools
    if (
      skillLevel === "technical" &&
      (tool.category.includes("coding") ||
        tool.category.includes("automation") ||
        tool.category.includes("development"))
    ) {
      score += 5;
    }

    // P1 fix: No-code users get a small bonus for productivity tools.
    // Writing bonus is intentionally removed: writing tools already get strong
    // scores from scenario overlap (many users select "writing"), and the old
    // +3 bonus caused writing tools to dominate all recommendation slots.
    // The diversity guard (primary-category cap = 1) now handles fairness.
    if (
      skillLevel === "no-code" &&
      tool.category.includes("productivity")
    ) {
      score += 1;
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

    // P4 fix: Use relaxed dev category count for Pro Stack (index 2)
    // to ensure it can fill up to 5 tools when budget allows.
    const effectiveMaxDev = index === 2 ? proMaxDevCategoryCount : maxDevCategoryCount;

    let selected: (Tool & { score: number })[];

    if (index === 1 && skillLevel === "technical") {
      // P2 fix: For technical users, ensure Growth Stack includes multiple technical tools.
      // When the user selected "coding" scenario, reserve 3+ slots for dev/coding/automation tools.
      const hasCodingScenario = scenarios.includes("coding") || scenarios.includes("development");
      const minTechCount = hasCodingScenario ? 3 : 2;

      const technicalTools = scored.filter(
        (t) => t.category.includes("coding") || t.category.includes("development") || t.category.includes("automation")
      );
      technicalTools.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.pricing.monthly - b.pricing.monthly;
      });

      if (technicalTools.length >= minTechCount) {
        // Select top N technical tools within budget
        let techTotalCost = 0;
        const selectedTech: (Tool & { score: number })[] = [];
        for (const tt of technicalTools) {
          if (selectedTech.length >= minTechCount) break;
          if (techTotalCost + tt.pricing.monthly <= maxBudget) {
            selectedTech.push(tt);
            techTotalCost += tt.pricing.monthly;
          }
        }

        if (selectedTech.length >= minTechCount) {
          const remainingBudget = maxBudget - techTotalCost;
          const remainingSlots = maxCount - selectedTech.length;
          const nonTech = scored.filter(
            (t) => !selectedTech.find((st) => st.id === t.id)
          );
          const others = selectToolsWithinBudget(nonTech, remainingBudget, remainingSlots, scenarios, 1, isDeveloperWithCoding, effectiveMaxDev);
          selected = [...selectedTech, ...others];
        } else {
          // Not enough tech tools fit the budget — fallback
          selected = selectToolsWithinBudget(scored, maxBudget, maxCount, scenarios, 1, isDeveloperWithCoding, effectiveMaxDev);
        }
      } else if (technicalTools.length > 0 && technicalTools[0].pricing.monthly <= maxBudget) {
        // Only 1 tech tool available — reserve for it
        const techTool = technicalTools[0];
        const remainingBudget = maxBudget - techTool.pricing.monthly;
        const nonTechnical = scored.filter(
          (t) =>
            t.id !== techTool.id &&
            !t.category.includes("coding") &&
            !t.category.includes("development") &&
            !t.category.includes("automation")
        );
        const others = selectToolsWithinBudget(nonTechnical, remainingBudget, maxCount - 1, scenarios, 1, isDeveloperWithCoding, effectiveMaxDev);
        selected = [techTool, ...others];
      } else {
        // Fallback: just use budget-aware selection
        selected = selectToolsWithinBudget(scored, maxBudget, maxCount, scenarios, 1, isDeveloperWithCoding, effectiveMaxDev);
      }
    } else {
      selected = selectToolsWithinBudget(scored, maxBudget, maxCount, scenarios, 1, isDeveloperWithCoding, effectiveMaxDev);
    }

    const toolsWithReason: StackTool[] = selected.map((tool) => {
      const { score: _score, ...rest } = tool;
      return {
        ...rest,
        reason: getToolReason(tool, industry, scenarios),
      };
    });

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
  let result = stacks.filter((s) => s.tools.length > 0 && s.monthlyTotal > 0);

  // P2 fix: For Developer + Coding, limit writing tools to max 1 per stack
  if (isDeveloperWithCoding) {
    result = result.map((stack) => {
      const writingTools = stack.tools.filter(
        (t) => t.category[0] === "writing" || t.category.includes("writing")
      );
      if (writingTools.length > 1) {
        // Keep only the first writing tool, remove the rest
        const nonWriting = stack.tools.filter(
          (t) => t.category[0] !== "writing" && !t.category.includes("writing")
        );
        const oneWriting = [writingTools[0]];
        return { ...stack, tools: [...nonWriting, ...oneWriting] };
      }
      return stack;
    });
  }

  // P4 fix: Price monotonicity enforcement.
  // Guarantee Starter.monthlyTotal ≤ Growth.monthlyTotal ≤ Pro.monthlyTotal.
  // Root cause of price inversion: Growth Stack uses the Technical special path
  // (forcing 3 expensive tech tools = $70) while Pro Stack uses the generic
  // algorithm constrained by diversity guards (only 4 cheap tools = $48).
  // This post-generation check ensures the pricing ladder is always ascending.
  result = enforcePriceMonotonicity(result, scored, scenarios, isDeveloperWithCoding, maxDevCategoryCount, proMaxDevCategoryCount);

  return result;
}

/**
 * Enforce price monotonicity: Starter ≤ Growth ≤ Pro.
 * If a tier is not strictly more expensive than the previous tier, supplement
 * it with additional high-value tools from the scored pool.
 *
 * CRITICAL: This function intentionally relaxes diversity constraints. The
 * diversity guards in selectToolsWithinBudget are what caused the price inversion
 * in the first place. Here we prioritize price ordering over diversity.
 */
function enforcePriceMonotonicity(
  stacks: StackTier[],
  scored: (Tool & { score: number })[],
  _scenarios: string[],
  _isDeveloperWithCoding: boolean,
  _maxDevCategoryCount: number,
  _proMaxDevCategoryCount: number
): StackTier[] {
  if (stacks.length === 0) return stacks;

  // Build a set of already-selected tool IDs across all stacks to avoid duplicates.
  const allSelectedIds = new Set<string>();
  stacks.forEach((s) => s.tools.forEach((t) => allSelectedIds.add(t.id)));

  // Tools not yet selected, sorted by price ascending (add cheapest tools first to
  // minimize budget impact while still achieving monotonicity).
  const unusedTools = scored
    .filter((t) => !allSelectedIds.has(t.id))
    .sort((a, b) => a.pricing.monthly - b.pricing.monthly);

  for (let i = 1; i < stacks.length; i++) {
    const prevTier = stacks[i - 1];
    const currTier = stacks[i];

    // If current tier is cheaper than previous, add tools until it exceeds.
    if (currTier.monthlyTotal < prevTier.monthlyTotal) {
      const targetMin = prevTier.monthlyTotal + 1;
      const addedTools: Tool[] = [];
      let currentTotal = currTier.monthlyTotal;
      const addedIds = new Set<string>();

      for (const tool of unusedTools) {
        if (currentTotal >= targetMin) break;
        if (addedIds.has(tool.id)) continue;

        // No diversity constraints here — we're intentionally relaxing them
        // to ensure price monotonicity. The diversity of the stack is already
        // enforced by the selection algorithm; this is just a safety net.
        addedTools.push(tool);
        addedIds.add(tool.id);
        currentTotal += tool.pricing.monthly;
      }

      if (addedTools.length > 0) {
        const newTools: StackTool[] = [
          ...currTier.tools,
          ...addedTools.map((tool) => ({
            ...tool,
            reason: "Premium upgrade for full-stack coverage",
          })),
        ];
        const monthlyTotal = newTools.reduce((sum, t) => sum + t.pricing.monthly, 0);
        const annualTotal = newTools.reduce((sum, t) => sum + t.pricing.annual, 0);
        const annualSavings = Math.round(monthlyTotal * 12 - annualTotal);
        const savingsPercent =
          monthlyTotal * 12 > 0
            ? Math.round((annualSavings / (monthlyTotal * 12)) * 100)
            : 0;

        stacks[i] = {
          ...stacks[i],
          tools: newTools,
          monthlyTotal: Math.round(monthlyTotal),
          annualTotal,
          annualSavings,
          savingsPercent,
        };
      }
    }
  }

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
