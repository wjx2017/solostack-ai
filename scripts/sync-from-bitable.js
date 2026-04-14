#!/usr/bin/env node
/**
 * sync-from-bitable.js
 * 从飞书多维表格拉取数据，生成 data/tools.json 和 data/affiliate-tools.json
 *
 * 支持两种模式：
 *   1. API 模式：配置 FEISHU_APP_ID + FEISHU_APP_SECRET 自动拉取
 *   2. 离线模式：直接传入 --records-file <json> 或从 stdin 读 JSON
 *
 * 环境变量：
 *   FEISHU_APP_ID      - 飞书自建应用 App ID
 *   FEISHU_APP_SECRET  - 飞书自建应用 App Secret
 *   FEISHU_APP_TOKEN   - 多维表格 app_token（默认 T4wDbp5RDaz72fs9QL4cE0qpnve）
 *   FEISHU_TABLE_ID    - 数据表 table_id（默认 tblaq9pmV0WD9ryz）
 *
 * 用法：
 *   # API 模式（需要凭证）
 *   node scripts/sync-from-bitable.js
 *   FEISHU_APP_ID=xxx FEISHU_APP_SECRET=xxx node scripts/sync-from-bitable.js
 *
 *   # 离线模式（从 JSON 文件读取记录）
 *   node scripts/sync-from-bitable.js --records-file records.json
 */

const https = require("https");
const fs = require("fs");
const path = require("path");

// ─── 配置 ──────────────────────────────────────────────
const APP_TOKEN = process.env.FEISHU_APP_TOKEN || "T4wDbp5RDaz72fs9QL4cE0qpnve";
const TABLE_ID = process.env.FEISHU_TABLE_ID || "tblaq9pmV0WD9ryz";
const APP_ID = process.env.FEISHU_APP_ID || "";
const APP_SECRET = process.env.FEISHU_APP_SECRET || "";
const DATA_DIR = path.resolve(__dirname, "..", "data");

// ─── 字段映射 ──────────────────────────────────────────

// 价格模式映射
const PRICE_MODE_MAP = {
  "免费": "free",
  "单一价格": "single",
  "多档价格": "tiered",
  "定制报价": "custom",
  free: "free",
  single: "single",
  tiered: "tiered",
  custom: "custom",
};

// Tier 映射（飞书 -> JSON）
const TIER_MAP = {
  "S级": "premium",
  "A级": "recommended",
  "B级": "basic",
  "C级": "basic",
};

// 分类映射（飞书单选 -> JSON category 数组）
const CATEGORY_MAP = {
  "视频生成": ["video"],
  "图像生成": ["design"],
  "写作助手": ["writing"],
  "效率工具": ["productivity"],
  "开发工具": ["coding", "automation"],
  "其他": ["productivity"], // 兜底：其他类归入 productivity，避免工具被跳过
};

// BestFor 映射（飞书多选 -> JSON bestFor 数组）
const BEST_FOR_MAP = {
  "新手": ["freelance"],
  "专业用户": ["saas"],
  "企业": ["saas", "ecommerce"],
  "学生": ["freelance"],
  "创作者": ["content"],
};

// 默认 icon 映射
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

/**
 * 辅助：提取飞书字段值
 * 飞书 API 返回的字段值有多种类型：
 *   - 纯文本字段：可能是字符串，也可能是 [{text: "...", type: "text"}]
 *   - URL 字段：{link: "...", text: "...", type: "url"}
 *   - 单选字段：字符串（如 "A级"）
 *   - 多选字段：字符串数组（如 ["创作者", "专业用户"]）
 *   - 数字字段：数字
 *   - 日期字段：毫秒时间戳
 */
function extractText(val) {
  if (val == null || val === "") return "";
  // 富文本数组 [{text: "...", type: "text"}]
  if (Array.isArray(val)) {
    return val.map((item) => item?.text || "").join("");
  }
  // URL 对象 {link: "...", text: "...", type: "url"}
  if (typeof val === "object" && val.link) {
    return val.link;
  }
  // 普通字符串
  return String(val);
}

function extractUrl(val) {
  if (val == null || val === "") return "";
  if (typeof val === "object" && val.link) {
    return val.link;
  }
  if (Array.isArray(val)) {
    const first = val[0];
    return first?.link || first?.text || "";
  }
  return String(val);
}

function extractNumber(val) {
  if (val == null || val === "") return 0;
  return parseFloat(val) || 0;
}

function extractDate(val) {
  if (val == null || val === "") return "";
  if (typeof val === "number") {
    // 毫秒时间戳
    const d = new Date(val);
    return d.toISOString().split("T")[0]; // YYYY-MM-DD
  }
  return String(val);
}

/**
 * 将飞书记录转换为 JSON Tool 对象
 */
function recordToTool(record) {
  const fields = record.fields || {};

  // 提取基本字段
  const toolId = extractText(fields["工具ID"]);
  const nameEn = extractText(fields["工具英文名"]);
  const name = extractText(fields["工具名称"]);
  const description = extractText(fields["描述"]);

  const id = toolId || generateId(nameEn) || generateId(name) || `tool-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  // 分类转换（单选 -> 字符串 -> 查映射表）
  const catRaw = fields["分类"]; // 单选字段返回字符串
  const category = CATEGORY_MAP[catRaw] || [];

  // 价格
  const monthly = extractNumber(fields["起步月费"]);
  const annual = extractNumber(fields["起步年费"]);
  const freeTier = extractText(fields["免费层说明"]) || "无";

  // BestFor 转换（多选 -> 字符串数组）
  const bestForRaw = fields["BestFor"]; // 多选字段返回字符串数组
  const bestFors = Array.isArray(bestForRaw)
    ? bestForRaw.flatMap((v) => BEST_FOR_MAP[v] || [])
    : BEST_FOR_MAP[bestForRaw] || [];
  const bestFor = [...new Set(bestFors)];

  // Tier 转换
  const tier = TIER_MAP[fields["Tier"]] || "basic";

  // 状态过滤
  const status = fields["状态"];
  if (status && status !== "上线") {
    return null;
  }

  // 默认 icon
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
    affiliateUrl: extractUrl(fields["Affiliate链接"]),
    bestFor,
    tier,
    // 额外字段
    websiteUrl: extractUrl(fields["官网链接"]),
    priceMode: PRICE_MODE_MAP[fields["价格模式"]] || "",
    tierInfo: fields["Tier"] || "",
    commissionRate: fields["佣金比例"] !== undefined ? fields["佣金比例"] : "",
    packageInfo: extractText(fields["套餐说明"]),
    remarks: extractText(fields["备注"]),
    lastVerified: extractDate(fields["最后核验日期"]),
  };
}

/**
 * 生成 slug 风格的 ID
 */
function generateId(text) {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ─── API 相关函数 ──────────────────────────────────────

async function getTenantToken() {
  if (APP_ID && APP_SECRET) {
    return apiRequest("POST", "/open-apis/auth/v3/tenant_access_token/internal", {
      app_id: APP_ID,
      app_secret: APP_SECRET,
    }).then((res) => {
      if (res.code !== 0) {
        throw new Error(`获取 tenant_access_token 失败: ${res.msg}`);
      }
      return res.tenant_access_token;
    });
  }
  return null;
}

function apiRequest(method, urlPath, body, token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "open.feishu.cn",
      port: 443,
      path: urlPath,
      method,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    };
    if (token) {
      options.headers["Authorization"] = `Bearer ${token}`;
    }
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`解析响应失败: ${data.slice(0, 200)}`));
        }
      });
    });
    req.on("error", reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function fetchAllRecords(token) {
  const allRecords = [];
  let pageToken = "";
  let hasMore = true;
  let page = 0;

  while (hasMore) {
    page++;
    let urlPath = `/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${TABLE_ID}/records?page_size=500`;
    if (pageToken) {
      urlPath += `&page_token=${encodeURIComponent(pageToken)}`;
    }

    const res = await apiRequest("GET", urlPath, null, token);
    if (res.code !== 0) {
      throw new Error(`获取记录失败 (page ${page}): ${res.msg}`);
    }

    const items = res.data?.items || [];
    allRecords.push(...items);
    hasMore = res.data?.has_more || false;
    pageToken = res.data?.page_token || "";

    console.log(`  第 ${page} 页: 获取 ${items.length} 条记录`);
  }

  return allRecords;
}

// ─── CLI 参数解析 ──────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--records-file" && i + 1 < args.length) {
      opts.recordsFile = args[++i];
    }
  }
  return opts;
}

// ─── 主流程 ────────────────────────────────────────────

async function main() {
  const opts = parseArgs();

  console.log("=== 飞书多维表格 -> 本地 JSON 同步 ===");
  console.log(`App Token: ${APP_TOKEN}`);
  console.log(`Table ID:  ${TABLE_ID}`);
  console.log("");

  let records;

  // 离线模式：从文件读取记录
  if (opts.recordsFile) {
    console.log(`1. 从文件读取记录: ${opts.recordsFile}`);
    const content = fs.readFileSync(opts.recordsFile, "utf-8");
    const data = JSON.parse(content);
    // 支持两种格式：{records: [...]} 和直接数组 [...]
    records = Array.isArray(data) ? data : data.records || data.items || [];
    console.log(`   ✓ 读取到 ${records.length} 条记录`);
  } else {
    // API 模式：需要凭证
    console.log("1. 获取访问令牌...");
    const token = await getTenantToken();
    if (!token) {
      console.error(
        "✗ 未配置 FEISHU_APP_ID 和 FEISHU_APP_SECRET。\n" +
          "   解决方案：\n" +
          "   1. 从飞书开放平台获取自建应用凭证\n" +
          "   2. 创建 .env 文件: cp scripts/.env.example scripts/.env\n" +
          "   3. 或使用离线模式: node scripts/sync-from-bitable.js --records-file <json>\n"
      );
      process.exit(1);
    }
    console.log("   ✓ 令牌获取成功");

    console.log("2. 拉取多维表格记录...");
    records = await fetchAllRecords(token);
    console.log(`   共获取 ${records.length} 条记录`);
  }

  if (records.length === 0) {
    console.log("\n⚠️  表格中没有任何记录，跳过生成。");
    return;
  }

  // 3. 转换记录
  console.log("3. 转换记录...");
  const tools = [];
  let skipped = 0;
  let errors = 0;

  for (const record of records) {
    try {
      const tool = recordToTool(record);
      if (tool) {
        if (tool.category.length === 0) {
          console.log(`   ⚠️  工具 "${tool.name}" 缺少分类映射，跳过`);
          skipped++;
          continue;
        }
        tools.push(tool);
      } else {
        skipped++;
      }
    } catch (e) {
      console.log(`   ✗ 记录转换失败: ${e.message}`);
      errors++;
    }
  }

  console.log(`   ✓ 转换完成: ${tools.length} 个工具可用, ${skipped} 条跳过, ${errors} 条错误`);

  // 4. 生成 tools.json
  console.log("4. 生成 data/tools.json ...");
  const toolsData = { tools };
  const toolsPath = path.join(DATA_DIR, "tools.json");
  fs.writeFileSync(toolsPath, JSON.stringify(toolsData, null, 2), "utf-8");
  console.log(`   ✓ 已写入 ${toolsPath}（${tools.length} 个工具）`);

  // 5. 生成 affiliate-tools.json
  console.log("5. 生成 data/affiliate-tools.json ...");
  const affiliateToolIds = tools.filter((t) => t.affiliateUrl).map((t) => t.id);
  const affiliateData = {
    _comment: "Affiliate whitelist — source: 飞书多维表格",
    affiliateToolIds,
  };
  const affiliatePath = path.join(DATA_DIR, "affiliate-tools.json");
  fs.writeFileSync(affiliatePath, JSON.stringify(affiliateData, null, 2), "utf-8");
  console.log(`   ✓ 已写入 ${affiliatePath}（${affiliateToolIds.length} 个 affiliate 工具）`);

  // 6. 统计
  console.log("");
  console.log("=== 同步完成 ===");
  console.log(`  tools.json:           ${tools.length} 个工具`);
  console.log(`  affiliate-tools.json: ${affiliateToolIds.length} 个 affiliate 工具`);
  console.log("");

  // 7. 输出校验摘要
  console.log("6. 数据校验摘要:");
  const ids = tools.map((t) => t.id);
  const dupIds = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dupIds.length > 0) {
    console.log(`   ⚠️  重复 ID: ${dupIds.join(", ")}`);
  } else {
    console.log("   ✓ 无重复 ID");
  }

  const missingName = tools.filter((t) => !t.name);
  if (missingName.length > 0) {
    console.log(`   ⚠️  缺少名称的工具: ${missingName.map((t) => t.id).join(", ")}`);
  } else {
    console.log("   ✓ 所有工具有名称");
  }

  const missingCategory = tools.filter((t) => !t.category || t.category.length === 0);
  if (missingCategory.length > 0) {
    console.log(`   ⚠️  缺少分类的工具: ${missingCategory.map((t) => t.id).join(", ")}`);
  } else {
    console.log("   ✓ 所有工具有分类");
  }

  const missingTier = tools.filter((t) => !t.tier);
  if (missingTier.length > 0) {
    console.log(`   ⚠️  缺少 tier 的工具: ${missingTier.map((t) => t.id).join(", ")}`);
  } else {
    console.log("   ✓ 所有工具有 tier");
  }

  const invalidTier = tools.filter(
    (t) => !["basic", "recommended", "premium"].includes(t.tier)
  );
  if (invalidTier.length > 0) {
    console.log(`   ⚠️  tier 值不合法: ${invalidTier.map((t) => `${t.id}=${t.tier}`).join(", ")}`);
  } else {
    console.log("   ✓ 所有 tier 值合法");
  }

  console.log("");
  console.log("⚠️  请运行 npm run build 确认网站能正常构建。");
}

main().catch((err) => {
  console.error("\n✗ 同步失败:", err.message);
  process.exit(1);
});
