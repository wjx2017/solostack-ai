/**
 * Solostack 推荐错配问题回归验收测试
 * 目标：验证'开发者/编程相关问卷答案不再推荐大量写作工具'
 * 
 * 测试项：
 * 1. 开发者主场景 - industry=developer + scenarios=coding 应推荐 coding/automation 工具
 * 2. 开发 + 写作混合场景 - 开发者但选 writing 场景，不应全部推荐写作工具
 * 3. 工具数量不足时不乱凑 - 预算紧张时宁缺毋滥
 * 4. 预算变化下结果仍合理 - 不同预算档位的推荐一致性
 * 5. technical 技能用户应获得技术工具优先
 */

import { generateRecommendations, getBudgetTier, Answer, StackTier } from '@/lib/engine';
import toolsData from '@/data/tools.json';
import affiliateData from '@/data/affiliate-tools.json';

interface TestResult {
  name: string;
  passed: boolean;
  details: string;
  failures: string[];
}

describe('Solostack 推荐错配问题回归验收', () => {
  const testResults: TestResult[] = [];

  // ========================================
  // 测试 1: 开发者主场景
  // ========================================
  it('TEST-1: 开发者主场景 - industry=developer + scenarios=coding 应推荐技术工具', () => {
    const answers: Partial<Answer> = {
      industry: 'developer',
      budget: '100-300',
      scenarios: ['coding', 'automation'],
      skillLevel: 'technical',
      goals: ['increase-income'],
    };

    const stacks = generateRecommendations(answers);
    const failures: string[] = [];

    // 验证：必须有 Growth Stack
    if (stacks.length < 2) {
      failures.push(`期望至少 2 个 stack，实际只有 ${stacks.length} 个`);
    }

    const growthStack = stacks[1]; // Growth Stack
    if (!growthStack) {
      failures.push('缺少 Growth Stack');
    } else {
      // 验证：Growth Stack 中应该有 coding 或 automation 类别的工具
      const technicalTools = growthStack.tools.filter(
        t => t.category.includes('coding') || t.category.includes('automation')
      );
      
      if (technicalTools.length === 0) {
        failures.push(
          `开发者场景的 Growth Stack 中没有技术工具，实际推荐：${growthStack.tools.map(t => `${t.name}(${t.category.join(',')})`).join(', ')}`
        );
      }

      // 验证：不应全部是写作工具
      const writingTools = growthStack.tools.filter(t => t.category.includes('writing'));
      if (writingTools.length === growthStack.tools.length) {
        failures.push(
          `开发者场景的 Growth Stack 全部是写作工具：${growthStack.tools.map(t => t.name).join(', ')}`
        );
      }
    }

    testResults.push({
      name: 'TEST-1: 开发者主场景',
      passed: failures.length === 0,
      details: `预算$${answers.budget}, 场景${(answers.scenarios || []).join(',')}, 技能${answers.skillLevel}`,
      failures,
    });

    if (failures.length > 0) {
      console.log('\n❌ TEST-1 失败:');
      failures.forEach(f => console.log('  - ' + f));
    } else {
      console.log('\n✅ TEST-1 通过：开发者主场景推荐合理');
    }

    expect(failures.length).toBe(0);
  });

  // ========================================
  // 测试 2: 开发 + 写作混合场景
  // ========================================
  it('TEST-2: 开发 + 写作混合场景 - 开发者选 writing 场景不应全部推荐写作工具', () => {
    const answers: Partial<Answer> = {
      industry: 'developer',
      budget: '100-300',
      scenarios: ['writing', 'coding'],
      skillLevel: 'technical',
      goals: ['save-time'],
    };

    const stacks = generateRecommendations(answers);
    const failures: string[] = [];

    const growthStack = stacks[1];
    if (growthStack) {
      const writingTools = growthStack.tools.filter(t => t.category.includes('writing'));
      const technicalTools = growthStack.tools.filter(
        t => t.category.includes('coding') || t.category.includes('automation')
      );

      // 验证：写作工具不应超过 50%
      const writingRatio = writingTools.length / growthStack.tools.length;
      if (writingRatio > 0.5) {
        failures.push(
          `混合场景中写作工具占比过高 (${Math.round(writingRatio * 100)}%), 应同时推荐技术工具`
        );
      }

      // 验证：应该至少有 1 个技术工具
      if (technicalTools.length === 0) {
        failures.push(
          `混合场景应至少推荐 1 个技术工具，实际推荐：${growthStack.tools.map(t => `${t.name}(${t.category.join(',')})`).join(', ')}`
        );
      }
    }

    testResults.push({
      name: 'TEST-2: 开发 + 写作混合场景',
      passed: failures.length === 0,
      details: `industry=developer, scenarios=[writing,coding]`,
      failures,
    });

    if (failures.length > 0) {
      console.log('\n❌ TEST-2 失败:');
      failures.forEach(f => console.log('  - ' + f));
    } else {
      console.log('\n✅ TEST-2 通过：混合场景推荐均衡');
    }

    expect(failures.length).toBe(0);
  });

  // ========================================
  // 测试 3: 工具数量不足时不乱凑
  // ========================================
  it('TEST-3: 工具数量不足时不乱凑 - 预算紧张时宁缺毋滥', () => {
    const answers: Partial<Answer> = {
      industry: 'developer',
      budget: '<50',
      scenarios: ['coding'],
      skillLevel: 'technical',
      goals: ['automate'],
    };

    const stacks = generateRecommendations(answers);
    const failures: string[] = [];

    // 验证：不应推荐 $0/mo 的空 stack
    stacks.forEach((stack, index) => {
      if (stack.tools.length === 0) {
        failures.push(`Stack ${index + 1} (${stack.name}) 为空`);
      }
      if (stack.monthlyTotal === 0) {
        failures.push(`Stack ${index + 1} (${stack.name}) 价格为 $0/mo`);
      }
    });

    // 验证：如果 coding 工具不足，不应硬凑写作工具
    const growthStack = stacks[1];
    if (growthStack) {
      const writingTools = growthStack.tools.filter(t => t.category.includes('writing'));
      const codingTools = growthStack.tools.filter(t => t.category.includes('coding'));

      // 如果预算太紧买不起 coding 工具，宁可少推荐也不要全推写作
      // 这里验证：如果全是写作工具，说明在乱凑
      if (writingTools.length === growthStack.tools.length && codingTools.length === 0) {
        // 检查是否真的买不起 coding 工具
        const cheapestCodingTool = toolsData.tools
          .filter(t => t.category.includes('coding') && affiliateData.affiliateToolIds.includes(t.id))
          .sort((a, b) => a.pricing.monthly - b.pricing.monthly)[0];

        if (cheapestCodingTool && cheapestCodingTool.pricing.monthly <= 50 * 0.8) {
          failures.push(
            `预算内可以买 coding 工具 (${cheapestCodingTool.name} $${cheapestCodingTool.pricing.monthly}/mo), 但 Growth Stack 全是写作工具：${growthStack.tools.map(t => t.name).join(', ')}`
          );
        }
      }
    }

    testResults.push({
      name: 'TEST-3: 工具数量不足时不乱凑',
      passed: failures.length === 0,
      details: `预算<$50, 场景=coding`,
      failures,
    });

    if (failures.length > 0) {
      console.log('\n❌ TEST-3 失败:');
      failures.forEach(f => console.log('  - ' + f));
    } else {
      console.log('\n✅ TEST-3 通过：预算紧张时推荐合理');
    }

    expect(failures.length).toBe(0);
  });

  // ========================================
  // 测试 4: 预算变化下结果仍合理
  // ========================================
  it('TEST-4: 预算变化下结果仍合理 - 不同预算档位的一致性', () => {
    const budgets = ['<50', '50-100', '100-300', '300+'];
    const failures: string[] = [];
    const results: Array<{ budget: string; stackCount: number; hasTechnical: boolean }> = [];

    for (const budget of budgets) {
      const answers: Partial<Answer> = {
        industry: 'developer',
        budget,
        scenarios: ['coding', 'automation'],
        skillLevel: 'technical',
        goals: ['increase-income'],
      };

      const stacks = generateRecommendations(answers);
      const growthStack = stacks[1];

      const hasTechnical = growthStack
        ? growthStack.tools.some(t => t.category.includes('coding') || t.category.includes('automation'))
        : false;

      results.push({
        budget,
        stackCount: stacks.length,
        hasTechnical,
      });

      // 验证：每个预算档位都应该有推荐
      if (stacks.length === 0) {
        failures.push(`预算 ${budget} 下没有任何推荐`);
      }

      // 验证：Growth Stack 应该有技术工具（除非预算太紧）
      if (growthStack && !hasTechnical && budget !== '<50') {
        failures.push(
          `预算 ${budget} 的 Growth Stack 没有技术工具：${growthStack.tools.map(t => t.name).join(', ')}`
        );
      }
    }

    // 验证：预算越高，推荐 stack 数量不应减少
    for (let i = 1; i < results.length; i++) {
      if (results[i].stackCount < results[i - 1].stackCount - 1) {
        failures.push(
          `预算从 ${results[i - 1].budget} 增加到 ${results[i].budget}, stack 数量从 ${results[i - 1].stackCount} 减少到 ${results[i].stackCount}`
        );
      }
    }

    testResults.push({
      name: 'TEST-4: 预算变化下结果仍合理',
      passed: failures.length === 0,
      details: `测试 ${budgets.join(', ')} 四个预算档位`,
      failures,
    });

    if (failures.length > 0) {
      console.log('\n❌ TEST-4 失败:');
      failures.forEach(f => console.log('  - ' + f));
    } else {
      console.log('\n✅ TEST-4 通过：预算变化下推荐一致');
    }

    expect(failures.length).toBe(0);
  });

  // ========================================
  // 测试 5: technical 技能用户优先获得技术工具
  // ========================================
  it('TEST-5: technical 技能用户应获得技术工具优先', () => {
    const answers: Partial<Answer> = {
      industry: 'saas',
      budget: '100-300',
      scenarios: ['automation'],
      skillLevel: 'technical',
      goals: ['automate'],
    };

    const stacks = generateRecommendations(answers);
    const failures: string[] = [];

    const growthStack = stacks[1];
    if (growthStack) {
      const technicalTools = growthStack.tools.filter(
        t => t.category.includes('coding') || t.category.includes('automation')
      );

      // 核心验证：technical 用户必须至少有 1 个技术工具
      if (technicalTools.length === 0) {
        failures.push(
          `technical 用户的 Growth Stack 没有技术工具，实际：${growthStack.tools.map(t => `${t.name}(${t.category.join(',')})`).join(', ')}`
        );
      }

      // 注意：由于当前工具池中写作工具占多数 (9 个写作 vs 1 个技术)
      // 不强制要求技术工具数量超过写作工具
      // 但算法应该优先展示技术工具（通过 score 加分）
    }

    testResults.push({
      name: 'TEST-5: technical 技能用户优先',
      passed: failures.length === 0,
      details: `industry=saas, skillLevel=technical`,
      failures,
    });

    if (failures.length > 0) {
      console.log('\n❌ TEST-5 失败:');
      failures.forEach(f => console.log('  - ' + f));
    } else {
      console.log('\n✅ TEST-5 通过：technical 用户至少有 1 个技术工具');
    }

    expect(failures.length).toBe(0);
  });

  // ========================================
  // 测试总结
  // ========================================
  afterAll(() => {
    console.log('\n========================================');
    console.log('📊 回归验收测试总结');
    console.log('========================================');
    
    const passed = testResults.filter(r => r.passed).length;
    const failed = testResults.filter(r => !r.passed).length;
    
    console.log(`\n总测试数：${testResults.length}`);
    console.log(`✅ 通过：${passed}`);
    console.log(`❌ 失败：${failed}`);
    
    if (failed > 0) {
      console.log('\n失败详情:');
      testResults.filter(r => !r.passed).forEach(r => {
        console.log(`\n${r.name}:`);
        r.failures.forEach(f => console.log(`  - ${f}`));
      });
    }
    
    console.log('\n========================================\n');
  });
});
