#!/usr/bin/env node
/**
 * extract-from-bitable.js
 * 从飞书多维表格 API 原始响应中提取数据，生成 data/tools.json 和 data/affiliate-tools.json
 * 
 * 此脚本处理飞书 API 返回的真实字段格式：
 * - 富文本字段：[{text: "...", type: "text"}]
 * - URL 字段：{link: "...", text: "...", type: "url"}
 * - 日期字段：毫秒时间戳
 * - 单选字段：字符串
 * - 多选字段：字符串数组
 * - 数字字段：数字
 * 
 * 用法：
 *   node scripts/extract-from-bitable.js <bitable-api-response.json>
 */

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.resolve(__dirname, "..", "data");

// ─── 字段映射 ──────────────────────────────────────────

const TIER_MAP = {
  "S级": "premium",
  "A级": "recommended",
  "B级": "basic",
  "C级": "basic",
};

const CATEGORY_MAP = {
  "视频生成": ["video"],
  "图像生成": ["design"],
  "写作助手": ["writing"],
  "效率工具": ["productivity"],
  "开发工具": ["coding", "automation"],
  "其他": [],
};

const BEST_FOR_MAP = {
  "新手": ["freelance"],
  "专业用户": ["saas"],
  "企业": ["saas", "ecommerce"],
  "学生": ["freelance"],
  "创作者": ["content"],
};

const ICON_MAP = {
  video: "🎬",
  design: "🎨",
  writing: "✍️",
  productivity: "📋",
  coding: "💻",
  automation: "⚡",
  "social-media": "📱",
  seo: "📈",
  content: "📝",
  research: "🔍",
  web: "🌐",
};

// ─── 字段提取辅助函数 ─────────────────────────────────

/**
 * 提取富文本字段值
 * 格式: [{text: "...", type: "text"}] → "..."
 */
function extractRichText(val) {
  if (val == null || val === "") return "";
  if (Array.isArray(val)) {
    return val.map((item) => item?.text || "").join("");
  }
  return String(val);
}

/**
 * 提取 URL 字段值
 * 格式: {link: "...", text: "...", type: "url"} → "https://..."
 */
function extractUrl(val) {
  if (val == null || val === "") return "";
  if (typeof val === "object") {
    return val.link || val.text || "";
  }
  return String(val);
}

/**
 * 提取日期字段值
 * 格式: 毫秒时间戳 → "YYYY-MM-DD"
 */
function extractDate(val) {
  if (val == null || val === "") return "";
  if (typeof val === "number") {
    return new Date(val).toISOString().split("T")[0];
  }
  return String(val);
}

/**
 * 提取单选字段值
 * 格式: "A级" → "A级"
 */
function extractSingleSelect(val) {
  if (val == null || val === "") return "";
  return String(val);
}

/**
 * 提取多选字段值
 * 格式: ["创作者", "专业用户"] → ["创作者", "专业用户"]
 */
function extractMultiSelect(val) {
  if (val == null) return [];
  if (!Array.isArray(val)) return [String(val)];
  return val;
}

// ─── 记录转换 ──────────────────────────────────────────

function recordToTool(record) {
  const f = record.fields || {};

  // 基本字段
  const toolId = extractRichText(f["工具ID"]);
  const nameEn = extractRichText(f["工具英文名"]);
  const name = extractRichText(f["工具名称"]);
  const description = extractRichText(f["描述"]);

  const id = toolId || generateId(nameEn) || generateId(name) || `tool-${Date.now()}`;

  // 分类（单选 → 数组映射）
  const catRaw = extractSingleSelect(f["分类"]);
  const category = CATEGORY_MAP[catRaw] || [];

  // 价格
  const monthly = typeof f["起步月费"] === "number" ? f["起步月费"] : 0;
  const annual = typeof f["起步年费"] === "number" ? f["起步年费"] : 0;
  const freeTier = extractRichText(f["免费层说明"]) || "无";

  // BestFor（多选 → 数组映射）
  const bestForRaw = extractMultiSelect(f["BestFor"]);
  const bestFor = [...new Set(bestForRaw.flatMap((v) => BEST_FOR_MAP[v] || []))];

  // Tier
  const tierRaw = extractSingleSelect(f["Tier"]);
  const tier = TIER_MAP[tierRaw] || "basic";

  // 状态过滤
  const status = extractSingleSelect(f["状态"]);
  if (status && status !== "上线") {
    return null;
  }

  // Icon
  const icon = ICON_MAP[category[0]] || "🛠️";

  return {
    id,
    name,
    nameEn,
    description,
    category,
    icon,
    pricing: {
      monthly,
      annual,
      freeTier,
    },
    affiliateUrl: extractUrl(f["Affiliate链接"]),
    bestFor,
    tier,
    // 额外字段
    websiteUrl: extractUrl(f["官网链接"]),
    priceMode: f["价格模式"] || "",
    tierInfo: tierRaw,
    commissionRate: f["佣金比例"] !== undefined ? f["佣金比例"] : "",
    packageInfo: extractRichText(f["套餐说明"]),
    remarks: extractRichText(f["备注"]),
    lastVerified: extractDate(f["最后核验日期"]),
  };
}

function generateId(text) {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ─── 主流程 ────────────────────────────────────────────

async function main() {
  const inputFile = process.argv[2];
  
  if (!inputFile) {
    console.error("用法: node scripts/extract-from-bitable.js <bitable-api-response.json>");
    console.error("");
    console.error("说明: 传入飞书 API 返回的原始 JSON 响应");
    process.exit(1);
  }

  console.log("=== 飞书多维表格数据提取 ===");
  console.log(`输入文件: ${inputFile}`);
  console.log("");

  // 读取输入文件
  const content = fs.readFileSync(inputFile, "utf-8");
  const data = JSON.parse(content);

  // 兼容多种响应格式
  let records;
  if (Array.isArray(data)) {
    records = data;
  } else if (data.records) {
    records = data.records;
  } else if (data.data && data.data.items) {
    records = data.data.items;
  } else {
    console.error("无法解析输入数据，支持的格式:");
    console.error("  - 数组: [{fields: {...}}, ...]");
    console.error("  - 对象: {records: [{fields: {...}}, ...]}");
    console.error("  - API响应: {data: {items: [{fields: {...}}, ...]}}");
    process.exit(1);
  }

  console.log(`共 ${records.length} 条记录`);
  console.log("");

  // 转换记录
  console.log("转换记录...");
  const tools = [];
  let skipped = 0;
  let errors = 0;

  for (const record of records) {
    try {
      const tool = recordToTool(record);
      if (tool) {
        if (tool.category.length === 0) {
          console.log(`  ⚠️  工具 "${tool.name}" 缺少分类映射，跳过`);
          skipped++;
          continue;
        }
        tools.push(tool);
      } else {
        skipped++;
        console.log(`  ⚠️  跳过非"上线"状态: ${extractRichText(record.fields?.["工具名称"]) || record.record_id}`);
      }
    } catch (e) {
      console.log(`  ✗ 转换失败: ${e.message}`);
      errors++;
    }
  }

  console.log(`✓ 转换完成: ${tools.length} 个工具可用, ${skipped} 条跳过, ${errors} 条错误`);
  console.log("");

  // 生成 tools.json
  const toolsData = { tools };
  const toolsPath = path.join(DATA_DIR, "tools.json");
  fs.writeFileSync(toolsPath, JSON.stringify(toolsData, null, 2), "utf-8");
  console.log(`✓ 已写入 ${toolsPath}（${tools.length} 个工具）`);

  // 生成 affiliate-tools.json
  const affiliateToolIds = tools.filter((t) => t.affiliateUrl).map((t) => t.id);
  const affiliateData = {
    _comment: "Affiliate whitelist — source: 飞书多维表格",
    affiliateToolIds,
  };
  const affiliatePath = path.join(DATA_DIR, "affiliate-tools.json");
  fs.writeFileSync(affiliatePath, JSON.stringify(affiliateData, null, 2), "utf-8");
  console.log(`✓ 已写入 ${affiliatePath}（${affiliateToolIds.length} 个 affiliate 工具）`);

  console.log("");
  console.log("=== 同步完成 ===");
  console.log(`  tools.json:           ${tools.length} 个工具`);
  console.log(`  affiliate-tools.json: ${affiliateToolIds.length} 个 affiliate 工具`);

  // 校验摘要
  console.log("");
  console.log("数据校验:");
  const ids = tools.map((t) => t.id);
  const dupIds = ids.filter((id, i) => ids.indexOf(id) !== i);
  console.log(dupIds.length > 0 ? `  ⚠️  重复 ID: ${dupIds.join(", ")}` : "  ✓ 无重复 ID");
  console.log(tools.every((t) => t.name) ? "  ✓ 所有工具有名称" : `  ⚠️  ${tools.filter(t => !t.name).length} 个工具缺少名称`);
  console.log(tools.every((t) => t.category.length > 0) ? "  ✓ 所有工具有分类" : `  ⚠️  ${tools.filter(t => t.category.length === 0).length} 个工具缺少分类`);
  console.log(tools.every((t) => ["basic", "recommended", "premium"].includes(t.tier)) ? "  ✓ 所有 tier 值合法" : `  ⚠️  存在不合法 tier 值`);
}

main().catch((err) => {
  console.error("\n✗ 提取失败:", err.message);
  process.exit(1);
});
