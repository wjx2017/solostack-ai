#!/usr/bin/env node
/**
 * migrate-to-bitable.js
 * 从现有 data/tools.json 生成 CSV 中间文件（可手动导入飞书多维表格）
 * 如果配置了 FEISHU_APP_ID 和 FEISHU_APP_SECRET，也可以直接写入飞书
 *
 * 环境变量：
 *   FEISHU_APP_ID      - 飞书自建应用 App ID（可选，不配则只生成 CSV）
 *   FEISHU_APP_SECRET  - 飞书自建应用 App Secret（可选）
 *   FEISHU_APP_TOKEN   - 多维表格 app_token（默认 T4wDbp5RDaz72fs9QL4cE0qpnve）
 *   FEISHU_TABLE_ID    - 数据表 table_id（默认 tblaq9pmV0WD9ryz）
 *   OUTPUT_CSV         - CSV 输出路径（默认 scripts/export-tools.csv）
 *
 * 用法：
 *   # 仅生成 CSV（推荐，先手动检查）
 *   node scripts/migrate-to-bitable.js
 *
 *   # 直接写入飞书
 *   FEISHU_APP_ID=xxx FEISHU_APP_SECRET=xxx node scripts/migrate-to-bitable.js --push
 */

const fs = require("fs");
const path = require("path");
const https = require("https");

// ─── 配置 ──────────────────────────────────────────────
const APP_TOKEN = process.env.FEISHU_APP_TOKEN || "T4wDbp5RDaz72fs9QL4cE0qpnve";
const TABLE_ID = process.env.FEISHU_TABLE_ID || "tblaq9pmV0WD9ryz";
const APP_ID = process.env.FEISHU_APP_ID || "";
const APP_SECRET = process.env.FEISHU_APP_SECRET || "";
const DATA_DIR = path.resolve(__dirname, "..", "data");
const OUTPUT_CSV = process.env.OUTPUT_CSV || path.resolve(__dirname, "export-tools.csv");

// ─── 字段映射：JSON -> 飞书 ────────────────────────────
// category 数组 -> 飞书单选
const CATEGORY_REVERSE_MAP = {
  video: "视频生成",
  design: "图像生成",
  writing: "写作助手",
  productivity: "效率工具",
  coding: "开发工具",
  automation: "开发工具",
  "social-media": "其他",
  seo: "其他",
  content: "效率工具",
  research: "其他",
  web: "开发工具",
  ecommerce: "效率工具",
  freelance: "效率工具",
  saas: "效率工具",
};

// bestFor 数组 -> 飞书多选
const BEST_FOR_REVERSE_MAP = {
  content: "创作者",
  saas: "专业用户",
  ecommerce: "企业",
  freelance: "新手",
  developer: "专业用户",
};

// tier -> 飞书单选
const TIER_REVERSE_MAP = {
  basic: "B级",
  recommended: "A级",
  premium: "S级",
};

// 检查是否需要直接推送到飞书
const PUSH_MODE = process.argv.includes("--push");

// ─── CSV 工具函数 ──────────────────────────────────────
/**
 * 转义 CSV 字段
 */
function csvEscape(value) {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

/**
 * 生成 CSV 行
 */
function csvRow(...fields) {
  return fields.map(csvEscape).join(",");
}

// ─── 主流程：生成 CSV ──────────────────────────────────
function generateCSV() {
  console.log("=== 本地 JSON -> CSV 迁移 ===");

  // 读取 tools.json
  const toolsPath = path.join(DATA_DIR, "tools.json");
  if (!fs.existsSync(toolsPath)) {
    console.error(`✗ 找不到 ${toolsPath}`);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(toolsPath, "utf-8"));
  const tools = data.tools || [];
  console.log(`读取 ${tools.length} 个工具`);

  // CSV 表头（必须与飞书字段名完全一致）
  const headers = [
    "工具ID",
    "工具名称",
    "工具英文名",
    "分类",
    "描述",
    "官网链接",
    "起步月费",
    "起步年费",
    "免费层说明",
    "Affiliate链接",
    "佣金比例",
    "Tier",
    "BestFor",
    "状态",
    "最后核验日期",
    "备注",
    "价格模式",
    "套餐说明",
  ];

  const rows = [csvRow(...headers)];

  for (const tool of tools) {
    // 分类：取第一个分类映射
    const primaryCategory =
      (tool.category || []).map((c) => CATEGORY_REVERSE_MAP[c] || "其他")[0] || "其他";

    // BestFor：多选，用分号分隔
    const bestForStr = (tool.bestFor || [])
      .map((b) => BEST_FOR_REVERSE_MAP[b] || "")
      .filter(Boolean)
      .join(";");

    const tier = TIER_REVERSE_MAP[tool.tier] || "B级";

    // 英文名：优先用 nameEn，否则用 name（因为当前工具名本身就是英文）
    const nameEn = tool.nameEn || tool.name || "";
    // 官网链接：优先用 websiteUrl，否则从 affiliateUrl 提取（去掉 ?utm_source=...）
    const websiteUrl = tool.websiteUrl || (tool.affiliateUrl ? tool.affiliateUrl.split("?")[0] : "");

    const row = csvRow(
      tool.id || "",                        // 工具ID（新增）
      tool.name || "",                      // 工具名称
      nameEn,                               // 工具英文名
      primaryCategory,                      // 分类
      tool.description || "",               // 描述
      websiteUrl,                           // 官网链接
      tool.pricing?.monthly ?? "",          // 起步月费
      tool.pricing?.annual ?? "",           // 起步年费
      tool.pricing?.freeTier || "",         // 免费层说明
      tool.affiliateUrl || "",              // Affiliate链接
      "",                                   // 佣金比例（需人工填写）
      tier,                                 // Tier
      bestForStr,                           // BestFor
      "上线",                                // 状态（默认上线）
      "",                                   // 最后核验日期（需人工填写）
      "",                                   // 备注
      tool.priceMode ? capitalizeFirst(tool.priceMode) : "", // 价格模式
      tool.packageInfo || ""                // 套餐说明
    );
    rows.push(row);
  }

  const csvContent = rows.join("\n");
  fs.writeFileSync(OUTPUT_CSV, csvContent, "utf-8");
  console.log(`✓ CSV 已写入: ${OUTPUT_CSV}`);
  console.log(`  共 ${tools.length} 条记录`);

  // 打印前3条预览
  if (tools.length > 0) {
    console.log("\n前3条预览:");
    for (let i = 0; i < Math.min(3, tools.length); i++) {
      console.log(`  [${i + 1}] ${tools[i].name} (${tools[i].id})`);
    }
  }

  console.log("\n⚠️  导入飞书步骤:");
  console.log("  1. 打开飞书多维表格: https://my.feishu.cn/");
  console.log("  2. 找到对应的多维表格（app_token: T4wDbp5RDaz72fs9QL4cE0qpnve）");
  console.log("  3. 点击「导入」-> 选择「从 CSV/Excel 导入」");
  console.log("  4. 上传生成的 CSV 文件，确保字段映射正确");
  console.log("");
  console.log("⚠️  需要人工补的字段:");
  console.log("  - 佣金比例: 根据各平台 Affiliate 计划填写");
  console.log("  - 最后核验日期: 填写实际核验日期");
  console.log("  - 套餐说明: 补充各工具详细套餐信息");
  console.log("  - 价格模式: 可填写为 '单一价格' 或 '多档价格'");

  return tools;
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ─── 直接推送飞书 ──────────────────────────────────────
async function pushToFeishu(tools) {
  if (!APP_ID || !APP_SECRET) {
    console.log("\n⚠️  未配置 FEISHU_APP_ID / FEISHU_APP_SECRET，跳过直接推送。");
    console.log("   如需直接推送，请配置环境变量后加 --push 参数运行。");
    return;
  }

  console.log("\n=== 直接推送飞书 ===");

  const token = await getTenantToken();
  console.log("✓ 令牌获取成功");

  // 批量创建记录（每次最多500条）
  const batchSize = 100;
  let created = 0;

  for (let i = 0; i < tools.length; i += batchSize) {
    const batch = tools.slice(i, i + batchSize);
    const records = batch.map((tool) => ({
      fields: buildFields(tool),
    }));

    const res = await request(
      "POST",
      `/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${TABLE_ID}/records/batch_create`,
      { records },
      token
    );

    if (res.code !== 0) {
      console.error(`✗ 批量创建失败 (batch ${Math.floor(i / batchSize) + 1}): ${res.msg}`);
    } else {
      const count = res.data?.records?.length || 0;
      created += count;
      console.log(`  Batch ${Math.floor(i / batchSize) + 1}: 创建 ${count} 条`);
    }
  }

  console.log(`\n✓ 推送完成: 共创建 ${created}/${tools.length} 条记录`);
}

function buildFields(tool) {
  const primaryCategory =
    (tool.category || []).map((c) => CATEGORY_REVERSE_MAP[c] || "其他")[0] || "其他";
  const bestForArr = (tool.bestFor || [])
    .map((b) => BEST_FOR_REVERSE_MAP[b] || "")
    .filter(Boolean);

  return {
    工具ID: tool.id || "",
    工具名称: tool.name || "",
    工具英文名: tool.nameEn || "",
    分类: primaryCategory,
    描述: tool.description || "",
    官网链接: { text: tool.websiteUrl || "", link: tool.websiteUrl || "" },
    起步月费: tool.pricing?.monthly || 0,
    起步年费: tool.pricing?.annual || 0,
    免费层说明: tool.pricing?.freeTier || "",
    Affiliate链接: { text: tool.affiliateUrl || "", link: tool.affiliateUrl || "" },
    佣金比例: "",
    Tier: TIER_REVERSE_MAP[tool.tier] || "B级",
    BestFor: bestForArr,
    状态: "上线",
    最后核验日期: Date.now(),
    备注: "",
    价格模式: capitalizeFirst(tool.priceMode) || "",
    套餐说明: tool.packageInfo || "",
  };
}

async function getTenantToken() {
  const res = await request("POST", "/open-apis/auth/v3/tenant_access_token/internal", {
    app_id: APP_ID,
    app_secret: APP_SECRET,
  });
  if (res.code !== 0) {
    throw new Error(`获取 tenant_access_token 失败: ${res.msg}`);
  }
  return res.tenant_access_token;
}

function request(method, urlPath, body, token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "open.feishu.cn",
      port: 443,
      path: urlPath,
      method,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    };
    if (token) options.headers["Authorization"] = `Bearer ${token}`;

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`解析失败: ${data.slice(0, 200)}`));
        }
      });
    });
    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// ─── 主入口 ────────────────────────────────────────────
async function main() {
  const tools = generateCSV();
  if (PUSH_MODE) {
    await pushToFeishu(tools);
  }
}

main().catch((err) => {
  console.error("\n✗ 迁移失败:", err.message);
  process.exit(1);
});
