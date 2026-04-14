# Solostack 飞书表 → 本地 JSON 联调验收报告

**执行人**: 星码
**时间**: 2026-04-13 22:46
**状态**: ✅ 联调通过，网站构建成功

---

## 一、执行摘要

飞书多维表格（10 条工具记录）→ 本地 JSON 同步链路**已成功跑通**。
`npm run build` 构建通过，数据校验 0 错误 0 警告。

---

## 二、改了哪些文件

| 文件 | 变更类型 | 说明 |
|------|---------|------|
| `scripts/sync-from-bitable.js` | **修改** | 修复字段提取逻辑：飞书富文本/URL/日期字段类型适配；新增 `--records-file` 离线模式；修复"其他"分类兜底映射 |
| `scripts/extract-from-bitable.js` | **新增** | 独立提取脚本，用于从飞书 API 原始响应 JSON 提取数据 |
| `data/tools.json` | **覆盖** | 由飞书表同步生成的 10 条工具数据 |
| `data/affiliate-tools.json` | **覆盖** | 10 个 affiliate 工具白名单 |

---

## 三、实际执行的命令

```bash
# 1. 通过飞书用户身份获取 bitable 真实数据
feishu_bitable_app_table_record (action=list, app_token=T4wDbp5RDaz72fs9QL4cE0qpnve, table_id=tblaq9pmV0WD9ryz)
feishu_bitable_app_table_field (action=list, ...)

# 2. 离线模式同步（无 API 凭证时的替代方案）
node scripts/sync-from-bitable.js --records-file scripts/bitable-records.json

# 3. 数据校验
node scripts/validate-data.js
# 输出: ✓ 所有校验通过！汇总: 0 错误, 0 警告

# 4. 网站构建验证
npm run build
# 输出: ✓ Compiled successfully / ✓ Generating static pages (11/11)
```

---

## 四、联调结果

### ✅ 成功的部分

| 校验项 | 结果 |
|--------|------|
| 同步记录数 | 10/10（0 跳过，0 错误） |
| 唯一 ID | ✓ 无重复 |
| 必填字段 | ✓ 所有工具有名称、分类、tier |
| tier 合法性 | ✓ 均为 basic/recommended/premium |
| 价格一致性 | ✓ 月费/年费与飞书表完全一致 |
| bestFor 映射 | ✓ 飞书多选→JSON 数组映射正确 |
| affiliate 白名单 | ✓ 10 个工具均有 affiliateUrl |
| 数据校验脚本 | ✓ 0 错误 0 警告 |
| 网站构建 | ✓ npm run build 成功 |

### ⚠️ 已知差异（不影响功能）

| 差异项 | 原始值 | 同步值 | 原因 | 影响 |
|--------|--------|--------|------|------|
| 分类（部分工具） | `["writing","content"]` | `["writing"]` | 飞书表分类为单选，无法保留副分类 | 推荐引擎场景匹配精度略降，但不影响可用性 |
| icon | 手工指定（如🔥） | 按分类自动生成 | 飞书表无 icon 列 | 视觉差异，不影响功能 |
| 额外字段 | 无 | 有 websiteUrl/priceMode/packageInfo 等 | 飞书表新增字段 | 网站不消费这些字段，无影响 |

### 分类映射详情

| 工具 | 原始分类 | 同步分类 | 影响评估 |
|------|---------|---------|---------|
| jasper | writing+content | writing | 低（writing 已覆盖主场景） |
| grammarly | writing+productivity | writing | 低 |
| notion-ai | writing+productivity | writing | 低 |
| writesonic | writing+seo | writing | 低 |
| pictory | video+content | video | 低 |
| murf | video+content | video | 低 |
| n8n | automation+coding | coding+automation | 无（内容相同） |
| tubebuddy | social-media+seo | productivity | **中**（分类变化较大） |
| surfer-seo | seo+content | productivity | **中**（分类变化较大） |
| elevenlabs | video+content | video | 低 |

**tubebuddy / surfer-seo 说明**：飞书表中这两个工具的分类为"其他"，同步时兜底映射为 `["productivity"]`。原分类为 social-media+seo / seo+content。对推荐引擎的场景匹配有一定影响，但 bestFor 映射正确（均为 content），价格正确，网站功能不受影响。

---

## 五、阻塞点

### 已解决

| 阻塞点 | 状态 | 解决方案 |
|--------|------|---------|
| 飞书 API 无凭证（FEISHU_APP_ID/SECRET） | ✅ 已绕过 | 使用 `--records-file` 离线模式，通过飞书用户身份 API 获取数据 |
| 富文本字段格式不匹配 | ✅ 已修复 | 添加 extractText/extractUrl/extractDate 辅助函数 |
| "其他"分类映射为空 | ✅ 已修复 | 兜底映射为 `["productivity"]` |

### 待解决

| 阻塞点 | 优先级 | 说明 |
|--------|--------|------|
| 飞书 API 凭证配置 | P2 | 配置 FEISHU_APP_ID/SECRET 后可直接 `node scripts/sync-from-bitable.js` 在线同步 |
| 分类单选限制 | P2 | 飞书表分类列为单选，丢失了副分类信息。如需恢复，需在飞书表中将分类改为多选字段 |

---

## 六、下一步最小动作

1. **（可选）配置飞书 API 凭证**：创建 `.env` 文件，填入 FEISHU_APP_ID 和 FEISHU_APP_SECRET，之后可直接运行 `node scripts/sync-from-bitable.js` 在线同步
2. **（可选）恢复副分类**：在飞书表中将"分类"列改为多选字段，补全各工具的副分类
3. **（建议）tubebuddy / surfer-seo 分类调整**：在飞书表中将这两个工具的分类从"其他"改为更精确的值（如"社交媒体"、"SEO工具"），然后在 sync 脚本中添加对应映射

---

## 七、验收结论

**✅ 联调通过**。飞书表 → 本地 JSON 同步链路已跑通，生成的 `data/tools.json` 和 `data/affiliate-tools.json` 与网站结构兼容，`npm run build` 构建成功。已知差异均为数据精度问题（分类单选限制），不影响网站核心功能。
