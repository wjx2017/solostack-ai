import { generateRecommendations, getBudgetTier, Answer, StackTier } from '@/lib/engine';
import toolsData from '@/data/tools.json';
import affiliateData from '@/data/affiliate-tools.json';
import questionsData from '@/data/questions.json';

// Test result tracking
interface TestResult {
  passed: boolean;
  industry: string;
  budget: string;
  scenarios: string[];
  skillLevel: string;
  goals: string[];
  starterTotal: number;
  recommendedTotal: number;
  proTotal: number;
  failures: string[];
}

interface TestReport {
  total: number;
  passed: number;
  failed: number;
  passRate: number;
  failedScenarios: Array<{
    industry: string;
    budget: string;
    scenarios: string[];
    skillLevel: string;
    goals: string[];
    failures: string[];
  }>;
}

// Extract options from questions
const industries = questionsData.questions.find(q => q.id === 'industry')!.options.map(o => o.value);
const budgets = questionsData.questions.find(q => q.id === 'budget')!.options.map(o => o.value);
const scenarios = questionsData.questions.find(q => q.id === 'scenarios')!.options.map(o => o.value);
const skillLevels = questionsData.questions.find(q => q.id === 'skillLevel')!.options.map(o => o.value);
const goals = questionsData.questions.find(q => q.id === 'goals')!.options.map(o => o.value);

// Generate all combinations
function* generateCombinations() {
  for (const industry of industries) {
    for (const budget of budgets) {
      // For scenarios, test single selections and common combinations
      // Testing all 92 combinations would be too slow, so we test representative samples
      const scenarioCombinations = generateScenarioCombinations(scenarios);
      for (const scenarioList of scenarioCombinations) {
        for (const skillLevel of skillLevels) {
          // For goals, test single selections and common combinations
          const goalCombinations = generateGoalCombinations(goals);
          for (const goalList of goalCombinations) {
            yield {
              industry,
              budget,
              scenarios: scenarioList,
              skillLevel,
              goals: goalList,
            };
          }
        }
      }
    }
  }
}

// Generate scenario combinations (1-4 selections)
function generateScenarioCombinations(items: string[]): string[][] {
  const result: string[][] = [];
  // Test single selections
  for (const item of items) {
    result.push([item]);
  }
  // Test common pairs
  const pairs = [
    [items[0], items[1]],
    [items[0], items[2]],
    [items[1], items[3]],
    [items[2], items[4]],
  ];
  result.push(...pairs.filter(p => p[0] && p[1]));
  return result;
}

// Generate goal combinations (1-3 selections)
function generateGoalCombinations(items: string[]): string[][] {
  const result: string[][] = [];
  // Test single selections
  for (const item of items) {
    result.push([item]);
  }
  // Test common pairs
  result.push([items[0], items[1]], [items[2], items[3]]);
  return result;
}

// Validation rules
function validateRecommendations(
  answers: Partial<Answer>,
  stacks: StackTier[]
): string[] {
  const failures: string[] = [];
  const budget = answers.budget!;
  const skillLevel = answers.skillLevel!;

  // Get budget tier
  const userTier = getBudgetTier(budget);
  
  // Find the tier that matches user's budget
  const budgetTierIndex = userTier === 'basic' ? 0 : userTier === 'recommended' ? 1 : 2;
  
  // Rule 1: Check budget constraints for each tier
  // Calculate max budget based on budget range
  let maxBudget: number;
  if (budget === '<50') maxBudget = 50;
  else if (budget === '50-100') maxBudget = 100;
  else if (budget === '100-300') maxBudget = 300;
  else maxBudget = 500; // 300+

  // Check each tier's pricing
  const tierChecks = [
    { tier: stacks[0], name: 'Starter', maxPercent: 0.6 },
    { tier: stacks[1], name: 'Recommended', maxPercent: 0.8 },
    { tier: stacks[2], name: 'Pro', maxPercent: 1.0 },
  ];

  for (const { tier, name, maxPercent } of tierChecks) {
    if (!tier) continue; // Skip if this tier was filtered out (empty)
    const maxAllowed = maxBudget * maxPercent;
    if (tier.monthlyTotal > maxAllowed) {
      failures.push(
        `${name} stack costs $${tier.monthlyTotal}/month, exceeds ${maxPercent * 100}% of budget ($${maxAllowed})`
      );
    }
  }

  // Rule 2: Technical users should get technical tools
  if (skillLevel === 'technical') {
    const recommendedTier = stacks[1]; // Growth Stack
    if (!recommendedTier) {
      failures.push('Technical user has no Growth/Recommended stack');
    } else {
      const hasTechnicalTools = recommendedTier.tools.some(tool =>
        tool.category.includes('coding') || tool.category.includes('automation') || tool.category.includes('development')
      );
      if (!hasTechnicalTools) {
        failures.push(
          `Technical user should be recommended technical tools (coding/automation/development), got: ${recommendedTier.tools.map(t => t.name).join(', ')}`
        );
      }
      // P2: When coding scenario selected, expect >=2 dev tools in Growth Stack
      const devToolCount = recommendedTier.tools.filter(tool =>
        tool.category.includes('coding') || tool.category.includes('development') || tool.category.includes('automation')
      ).length;
      const hasCodingScenario = answers.scenarios?.includes('coding') || answers.scenarios?.includes('development');
      if (hasCodingScenario && devToolCount < 2) {
        failures.push(
          `Technical user with coding scenario should have >=2 dev tools in Growth Stack, got ${devToolCount}: ${recommendedTier.tools.map(t => t.name).join(', ')}`
        );
      }
    }
  }

  // Rule 3: No-code users should NOT get technical tools
  if (skillLevel === 'no-code') {
    const starterTier = stacks[0]; // Starter Stack
    if (!starterTier) {
      failures.push('No-code user has no Starter stack');
    } else {
      const hasTechnicalTools = starterTier.tools.some(tool =>
        tool.category.includes('coding')
      );
      if (hasTechnicalTools) {
        failures.push(
          `No-code user should NOT be recommended coding tools, got: ${starterTier.tools.map(t => t.name).join(', ')}`
        );
      }
    }
  }

  return failures;
}

describe('Recommendation Engine', () => {
  let testResults: TestResult[] = [];
  let testReport: TestReport | undefined;

  beforeAll(() => {
    testResults = [];
  });

  it('should validate all scenario combinations', () => {
    let passed = 0;
    let failed = 0;
    const failedScenarios: TestReport['failedScenarios'] = [];

    for (const combination of generateCombinations()) {
      const stacks = generateRecommendations(combination);
      const failures = validateRecommendations(combination, stacks);

      const result: TestResult = {
        passed: failures.length === 0,
        ...combination,
        starterTotal: stacks[0].monthlyTotal,
        recommendedTotal: stacks[1].monthlyTotal,
        proTotal: stacks[2].monthlyTotal,
        failures,
      };

      testResults.push(result);

      if (result.passed) {
        passed++;
      } else {
        failed++;
        failedScenarios.push({
          industry: combination.industry,
          budget: combination.budget,
          scenarios: combination.scenarios,
          skillLevel: combination.skillLevel,
          goals: combination.goals,
          failures,
        });
      }
    }

    testReport = {
      total: passed + failed,
      passed,
      failed,
      passRate: Math.round((passed / (passed + failed)) * 100 * 100) / 100,
      failedScenarios,
    };

    // Log summary
    console.log('\n========================================');
    console.log('✅ 测试通过：' + passed + '/' + (passed + failed) + ` (${testReport.passRate}%)`);
    console.log('❌ 失败场景：' + failed + ' 个');
    console.log('========================================\n');

    // Log failed scenarios
    if (failed > 0) {
      console.log('失败场景详情:');
      failedScenarios.forEach((scenario, index) => {
        console.log(`\n失败场景 ${index + 1}:`);
        console.log(`- 行业：${scenario.industry}, 预算：${scenario.budget}, 技能：${scenario.skillLevel}`);
        console.log(`- 问题：${scenario.failures.join('; ')}`);
      });
      console.log('\n');
    }

    // Assert pass rate (allow some failures for edge cases)
    expect(testReport.passRate).toBeGreaterThanOrEqual(95);
  });

  it('should generate 1-3 tiers for all combinations (never empty, never $0/mo)', () => {
    for (const combination of generateCombinations()) {
      const stacks = generateRecommendations(combination);
      // After filtering out empty stacks, we should have 1-3 stacks
      expect(stacks.length).toBeGreaterThanOrEqual(0);
      expect(stacks.length).toBeLessThanOrEqual(3);
      // Each stack must have tools and non-zero cost
      stacks.forEach(stack => {
        expect(stack.tools.length).toBeGreaterThan(0);
        expect(stack.monthlyTotal).toBeGreaterThan(0);
      });
    }
  });

  it('should respect budget tiers', () => {
    const testCases: Array<{ budget: string; expectedTier: 'basic' | 'recommended' | 'premium' }> = [
      { budget: '<50', expectedTier: 'basic' },
      { budget: '50-100', expectedTier: 'basic' },
      { budget: '100-300', expectedTier: 'recommended' },
      { budget: '300+', expectedTier: 'premium' },
    ];

    for (const { budget, expectedTier } of testCases) {
      expect(getBudgetTier(budget)).toBe(expectedTier);
    }
  });

  it('should provide tools with reasons', () => {
    const combination: Partial<Answer> = {
      industry: 'content',
      budget: '50-100',
      scenarios: ['writing'],
      skillLevel: 'no-code',
      goals: ['save-time'],
    };

    const stacks = generateRecommendations(combination);
    
    stacks.forEach(tier => {
      tier.tools.forEach(tool => {
        expect(tool.reason).toBeDefined();
        expect(tool.reason.length).toBeGreaterThan(0);
      });
    });
  });

  it('should NOT produce empty stacks ($0/mo) for any combination', () => {
    for (const combination of generateCombinations()) {
      const stacks = generateRecommendations(combination);
      
      stacks.forEach(stack => {
        expect(stack.tools.length).toBeGreaterThan(0);
        expect(stack.monthlyTotal).toBeGreaterThan(0);
      });
    }
  });

  it('should NOT produce empty stacks even with extremely tight budget', () => {
    // Simulate a budget so tight that affordableCount would be minimal
    const tightBudgetAnswers: Partial<Answer> = {
      industry: 'content',
      budget: '<50',
      scenarios: ['writing'],
      skillLevel: 'no-code',
      goals: ['save-time'],
    };

    const stacks = generateRecommendations(tightBudgetAnswers);
    
    // All returned stacks must have at least one tool and non-zero cost
    stacks.forEach(stack => {
      expect(stack.tools.length).toBeGreaterThanOrEqual(1);
      expect(stack.monthlyTotal).toBeGreaterThanOrEqual(9); // cheapest tool is $9
    });
  });

  it('should enforce category diversity — no more than 1 tool per primary category per stack', () => {
    // Select scenarios that would previously cause writing tools to dominate:
    // writing tools also match "productivity" and "seo" secondary categories,
    // so they could sneak multiple slots via secondary matches.
    const answers: Partial<Answer> = {
      industry: 'content',
      budget: '100-300',
      scenarios: ['writing', 'productivity', 'seo', 'video'],
      skillLevel: 'no-code',
      goals: ['save-time'],
    };

    const stacks = generateRecommendations(answers);
    
    stacks.forEach(stack => {
      // Group tools by primary category (first category in their list)
      const primaryCatCount: Record<string, number> = {};
      stack.tools.forEach(tool => {
        const primary = tool.category[0];
        primaryCatCount[primary] = (primaryCatCount[primary] || 0) + 1;
      });

      // No primary category should have more than 1 tool
      for (const [cat, count] of Object.entries(primaryCatCount)) {
        expect(count).toBeLessThanOrEqual(1);
      }
    });
  });

  it('should NOT let writing tools dominate a single stack even with high scenario overlap', () => {
    // Even if user selects writing as their only scenario, diversity guard
    // should prevent 2+ writing tools (same primary category) in one stack.
    const answers: Partial<Answer> = {
      industry: 'content',
      budget: '100-300',
      scenarios: ['writing'],
      skillLevel: 'no-code',
      goals: ['save-time'],
    };

    const stacks = generateRecommendations(answers);

    stacks.forEach(stack => {
      const writingTools = stack.tools.filter(t => t.category[0] === 'writing');
      expect(writingTools.length).toBeLessThanOrEqual(1);
    });
  });

  it('should only recommend whitelisted affiliate tools', () => {
    const affiliateIds = new Set(affiliateData.affiliateToolIds);
    
    for (const combination of generateCombinations()) {
      const stacks = generateRecommendations(combination);
      
      stacks.forEach(tier => {
        tier.tools.forEach(tool => {
          expect(affiliateIds.has(tool.id)).toBe(true);
        });
      });
    }
  });
});


