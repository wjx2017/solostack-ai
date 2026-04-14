# Solostack 飞书多维表格同步工具

> 最小可用的「飞书多维表格 ↔ 本地 JSON」迁移与同步方案

## 目录

- [架构概览](#架构概览)
- [快速开始](#快速开始)
- [脚本说明](#脚本说明)
- [飞书 API 配置](#飞书-api-配置)
- [数据字段映射](#数据字段映射)
- [已知限制](#已知限制)
- [待人工补充](#待人工补充)

---

## 架构概览

```
┌──────────────────┐     migrate-to-bitable.js     ┌──────────────────┐
│  data/tools.json │ ────（生成 CSV / 直接写入）───→│  飞书多维表格     │
│  affiliate-tools │                                │  (已建好)        │
└──────────────────┘                                └────────┬─────────┘
         ▲                                                    │
         │            sync-from-bitable.js                    │
         └────────────────（拉取 + 转换）─────────────────────┘
                              │
                              ▼
                       data/tools.json
                       affiliate-tools.json
                              │
                              ▼
                       网站读取（不变）
```

**核心原则**：网站消费层不改动，仍读取 `data/tools.json` 和 `data/affiliate-tools.json`。

---

## 快速开始

### 0. 前置条件

- Node.js 18+（项目已有）
- 仓库根目录执行

### 1. 迁移：本地 JSON → 飞书

```bash
# 方式一：生成 CSV（推荐，可先在飞书手动检查后导入）
node scripts/migrate-to-bitable.js

# 输出: scripts/export-tools.csv
# 然后在飞书多维表格中「导入 CSV」

# 方式二：直接写入飞书（需要 API 凭证）
cp scripts/.env.example .env
# 编辑 .env 填入 FEISHU_APP_ID 和 FEISHU_APP_SECRET
node scripts/migrate-to-bitable.js --push
```

### 2. 同步：飞书 → 本地 JSON

```bash
# 需要 API 凭证
cp scripts/.env.example .env
# 编辑 .env
node scripts/sync-from-bitable.js

# 输出:
#   data/tools.json          （网站直接读取）
#   data/affiliate-tools.json  （affiliate 白名单）
```

### 3. 校验

```bash
# 校验当前 data/ 下的 JSON 文件
node scripts/validate-data.js

# 校验并输出 JSON 格式报告
node scripts/validate-data.js --json
```

### 4. 构建网站

```bash
npm run build
```

---

## 脚本说明

### `migrate-to-bitable.js` - 迁移脚本

| 功能 | 说明 |
|------|------|
| 输入 | `data/tools.json` |
| 输出 | `scripts/export-tools.csv`（默认） |
| 可选 | `--push` 参数直接写入飞书 |

**生成的 CSV** 可直接导入飞书多维表格，字段名与表格列名一一对应。

### `sync-from-bitable.js` - 同步脚本

| 功能 | 说明 |
|------|------|
| 输入 | 飞书多维表格全部记录 |
| 输出 | `data/tools.json` + `data/affiliate-tools.json` |
| 状态过滤 | 仅同步状态为"上线"的工具 |

**affiliate 白名单策略**：所有有 `affiliateUrl` 且状态为"上线"的工具自动加入白名单。

### `validate-data.js` - 校验脚本

校验项：
1. **唯一 ID**：无重复
2. **必填字段**：id, name, description, category, pricing, affiliateUrl, tier
3. **价格校验**：月费为 0 时免费层说明应有内容；年费不应大于 12×月费
4. **URL 合法性**：affiliateUrl 和 websiteUrl 格式
5. **tier 合法性**：必须是 basic / recommended / premium
6. **affiliate 一致性**：白名单中的 ID 必须在 tools.json 中存在

---

## 飞书 API 配置

### 获取凭证

1. 登录 [飞书开放平台](https://open.feishu.cn/app)
2. 找到或创建「自建应用」
3. 在「凭证与基础信息」页面获取 App ID 和 App Secret

### 应用权限

自建应用需要以下权限（在「权限管理」中开通）：

| 权限 | 说明 |
|------|------|
| `bitable:app` | 查看、评论、创建、编辑电子表格 |
| `bitable:app:readonly` | 查看多维表格 |

### 添加到多维表格

确保自建应用已被添加到多维表格的协作者中（至少「可编辑」权限）。

---

## 数据字段映射

### JSON → 飞书

| JSON 字段 | 飞书字段 | 类型 | 转换规则 |
|-----------|---------|------|---------|
| id | 工具ID | 文本 | 直接映射（新增字段，保证 ID 一致性） |
| name | 工具名称 | 文本 | 直接映射 |
| nameEn | 工具英文名 | 文本 | 直接映射 |
| category[] | 分类 | 单选 | 取第一个分类 |
| description | 描述 | 文本 | 直接映射 |
| websiteUrl | 官网链接 | URL | 直接映射 |
| pricing.monthly | 起步月费 | 数字 | 直接映射 |
| pricing.annual | 起步年费 | 数字 | 直接映射 |
| pricing.freeTier | 免费层说明 | 文本 | 直接映射 |
| affiliateUrl | Affiliate链接 | URL | 直接映射 |
| tier | Tier | 单选 | basic→B级, recommended→A级, premium→S级 |
| bestFor[] | BestFor | 多选 | 逐个映射 |
| - | 状态 | 单选 | 默认"上线" |
| - | 最后核验日期 | 日期 | 默认当前时间 |

### 分类映射表

| JSON category | 飞书分类 |
|--------------|---------|
| video | 视频生成 |
| design | 图像生成 |
| writing | 写作助手 |
| productivity | 效率工具 |
| coding / automation | 开发工具 |
| 其他 | 其他 |

---

## 已知限制

1. **分类映射不完整**：飞书只有 6 个分类选项，JSON 中有更多 category 值（如 social-media, seo, content 等），当前映射到"其他"或"效率工具"。如需精确映射，需在飞书表格中添加更多分类选项。
2. **BestFor 映射近似**：飞书的 BestFor 选项（新手/专业用户/企业/学生/创作者）与 JSON 的 bestFor（content/saas/ecommerce/freelance）不是一一对应，当前做近似映射。
3. **价格模式字段**：飞书有价格模式字段，但原始 JSON 没有对应字段，当前从 `tool.priceMode` 映射（如果有）。
4. **佣金比例 / 套餐说明**：原始 JSON 中无此字段，需要人工补充。
5. **无增量同步**：当前同步是全量覆盖。如果飞书有大量人工编辑的数据，建议先备份。
6. **icon 字段**：飞书表格没有 icon 列，同步生成的 JSON 中 icon 字段为空。网站显示依赖此字段，需在同步后补或修改网站代码。

---

## 待人工补充

| 字段 | 说明 | 操作 |
|------|------|------|
| **佣金比例** | 各工具的 Affiliate 佣金百分比 | 在飞书表格中手动填写 |
| **最后核验日期** | 工具信息最后确认日期 | 在飞书表格中手动填写 |
| **套餐说明** | 各工具的详细套餐信息 | 在飞书表格中手动填写 |
| **价格模式** | 免费/单一价格/多档价格/定制报价 | 在飞书表格中选择 |
| **icon 字段** | 工具 emoji 图标 | 同步后在 tools.json 中手动补充，或修改网站不依赖 icon |
| **飞书 API 凭证** | App ID + App Secret | 从飞书开放平台获取并配置 .env |

---

## 文件清单

```
scripts/
├── README.md                 ← 本文档
├── .env.example              ← 环境变量模板
├── migrate-to-bitable.js     ← 迁移脚本：JSON → CSV / 飞书
├── sync-from-bitable.js      ← 同步脚本：飞书 → JSON
└── validate-data.js          ← 数据校验脚本
```
