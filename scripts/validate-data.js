#!/usr/bin/env node
/**
 * validate-data.js
 * 对 data/tools.json 和 data/affiliate-tools.json 做数据校验
 *
 * 校验项：
 *   1. 唯一 ID：无重复
 *   2. 必填字段：id, name, description, category, pricing, affiliateUrl, tier
 *   3. 价格模式与起步价关系：月费为 0 时免费层必须有内容
 *   4. URL 合法性：官网链接和 Affiliate 链接格式
 *   5. 状态过滤：tier 值合法性
 *   6. Affiliate 白名单：affiliate-tools.json 中的 ID 必须在 tools.json 中存在
 *
 * 用法：
 *   node scripts/validate-data.js
 *   node scripts/validate-data.js --json    # 输出 JSON 格式报告
 */

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.resolve(__dirname, "..", "data");
const VALID_TIERS = new Set(["basic", "recommended", "premium"]);
const VALID_BEST_FOR = new Set([
  "content", "saas", "ecommerce", "freelance", "developer",
]);
const VALID_CATEGORIES = new Set([
  "writing", "design", "video", "coding", "automation",
  "social-media", "seo", "productivity", "research", "web",
  "content", "ecommerce", "freelance", "saas", "developer",
]);

const errors = [];
const warnings = [];

function error(toolId, msg) {
  errors.push({ toolId, type: "error", message: msg });
}

function warn(toolId, msg) {
  warnings.push({ toolId, type: "warning", message: msg });
}

function isValidUrl(str) {
  if (!str) return true; // URL 非必填
  try {
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function validateTools(toolsData) {
  const tools = toolsData.tools || [];
  const ids = new Set();

  if (tools.length === 0) {
    error(null, "tools.json 中没有任何工具");
    return;
  }

  for (const tool of tools) {
    const id = tool.id || "(无ID)";

    // 1. 唯一 ID
    if (ids.has(tool.id)) {
      error(id, `重复的 ID: ${tool.id}`);
    }
    ids.add(tool.id);

    // 2. 必填字段
    if (!tool.id) error(id, "缺少 id 字段");
    if (!tool.name) error(id, "缺少 name 字段");
    if (!tool.description) error(id, "缺少 description 字段");
    if (!tool.category || tool.category.length === 0) error(id, "缺少 category 字段");
    if (!tool.pricing) error(id, "缺少 pricing 字段");
    if (tool.pricing && tool.pricing.monthly === undefined) error(id, "缺少 pricing.monthly");
    if (tool.pricing && tool.pricing.annual === undefined) error(id, "缺少 pricing.annual");
    if (!tool.affiliateUrl) error(id, "缺少 affiliateUrl 字段");
    if (!tool.tier) error(id, "缺少 tier 字段");
    if (!tool.bestFor || tool.bestFor.length === 0) warn(id, "缺少 bestFor 字段");

    // 3. tier 合法性
    if (tool.tier && !VALID_TIERS.has(tool.tier)) {
      error(id, `无效的 tier: "${tool.tier}"，应为 basic/recommended/premium`);
    }

    // 4. 价格校验
    if (tool.pricing) {
      if (tool.pricing.monthly === 0 && (!tool.pricing.freeTier || tool.pricing.freeTier === "无")) {
        warn(id, "月费为 0 但免费层说明为空，建议补充");
      }
      if (tool.pricing.monthly > 0 && tool.pricing.annual === 0) {
        warn(id, "有月费但年费为 0，请确认");
      }
      if (tool.pricing.annual > 0 && tool.pricing.monthly > 0) {
        const expectedAnnual = tool.pricing.monthly * 12;
        if (tool.pricing.annual > expectedAnnual) {
          warn(id, `年费 (${tool.pricing.annual}) 大于 12 个月费 (${expectedAnnual})，请确认`);
        }
      }
    }

    // 5. URL 合法性
    if (tool.affiliateUrl && !isValidUrl(tool.affiliateUrl)) {
      error(id, `无效的 affiliateUrl: "${tool.affiliateUrl}"`);
    }
    if (tool.websiteUrl && !isValidUrl(tool.websiteUrl)) {
      warn(id, `无效的 websiteUrl: "${tool.websiteUrl}"`);
    }

    // 6. bestFor 值校验
    if (tool.bestFor) {
      for (const bf of tool.bestFor) {
        if (!VALID_BEST_FOR.has(bf)) {
          warn(id, `未知的 bestFor 值: "${bf}"`);
        }
      }
    }

    // 7. category 值校验
    if (tool.category) {
      for (const cat of tool.category) {
        if (!VALID_CATEGORIES.has(cat)) {
          warn(id, `未知的 category 值: "${cat}"`);
        }
      }
    }

    // 8. icon 字段（网站使用但不强制）
    if (!tool.icon) {
      warn(id, "缺少 icon 字段（网站使用 emoji 显示）");
    }
  }

  return ids;
}

function validateAffiliate(affiliateData, toolIds) {
  const ids = affiliateData.affiliateToolIds || [];

  if (ids.length === 0) {
    warn(null, "affiliate-tools.json 中没有 affiliate 工具 ID");
    return;
  }

  for (const id of ids) {
    if (!toolIds.has(id)) {
      error(id, `affiliate-tools.json 中的 ID "${id}" 在 tools.json 中不存在`);
    }
  }
}

// ─── 主流程 ────────────────────────────────────────────
function main() {
  const outputJson = process.argv.includes("--json");

  console.log("=== 数据校验 ===\n");

  // 读取 tools.json
  const toolsPath = path.join(DATA_DIR, "tools.json");
  if (!fs.existsSync(toolsPath)) {
    console.error(`✗ 找不到 ${toolsPath}`);
    process.exit(1);
  }
  const toolsData = JSON.parse(fs.readFileSync(toolsPath, "utf-8"));
  console.log(`读取 ${toolsPath}: ${toolsData.tools?.length || 0} 个工具`);

  // 读取 affiliate-tools.json
  const affiliatePath = path.join(DATA_DIR, "affiliate-tools.json");
  if (!fs.existsSync(affiliatePath)) {
    console.error(`✗ 找不到 ${affiliatePath}`);
    process.exit(1);
  }
  const affiliateData = JSON.parse(fs.readFileSync(affiliatePath, "utf-8"));
  console.log(`读取 ${affiliatePath}: ${affiliateData.affiliateToolIds?.length || 0} 个 affiliate ID`);

  // 校验 tools.json
  const toolIds = validateTools(toolsData);

  // 校验 affiliate-tools.json
  if (toolIds) {
    validateAffiliate(affiliateData, toolIds);
  }

  // 输出结果
  if (outputJson) {
    console.log(JSON.stringify({ errors, warnings }, null, 2));
  } else {
    if (errors.length === 0 && warnings.length === 0) {
      console.log("\n✓ 所有校验通过！");
    } else {
      if (errors.length > 0) {
        console.log(`\n✗ ${errors.length} 个错误:`);
        for (const e of errors) {
          console.log(`  [${e.toolId || "全局"}] ${e.message}`);
        }
      }
      if (warnings.length > 0) {
        console.log(`\n⚠️  ${warnings.length} 个警告:`);
        for (const w of warnings) {
          console.log(`  [${w.toolId || "全局"}] ${w.message}`);
        }
      }
    }

    console.log(`\n汇总: ${errors.length} 错误, ${warnings.length} 警告`);
  }

  // 退出码：有错误则返回 1
  process.exit(errors.length > 0 ? 1 : 0);
}

main();
