# Solostack AI 数据追踪说明文档

**创建时间**: 2026-04-12  
**分析工具**: Plausible Analytics  
**追踪域名**: solostack-ai.vercel.app

---

## 📊 一、追踪概览

### 1.1 工具选择

我们选择了 **Plausible Analytics** 作为数据分析工具，原因：

- ✅ **隐私友好**: 不使用 Cookie，符合 GDPR/CCPA/PECR 法规
- ✅ **轻量级**: 脚本仅 1KB，不影响网站性能
- ✅ **简单易用**: 仪表板清晰，无需培训即可理解
- ✅ **自托管选项**: 数据可控制在欧洲服务器
- ✅ **支持自定义事件**: 可追踪问卷、Affiliate 点击等关键行为

### 1.2 追踪事件列表

| 事件名称 | 触发时机 | 属性 |
|---------|---------|------|
| `quiz_started` | 用户开始问卷（第一步） | industry（行业） |
| `quiz_completed` | 用户完成问卷并提交 | industry, budget_range, team_size |
| `affiliate_link_clicked` | 用户点击 Affiliate 链接 | tool_name, tool_category, stack_tier |
| `email_captured` | 用户提交邮箱（如未来添加） | email_source |

---

## 🔧 二、技术实现

### 2.1 安装依赖

```bash
npm install next-plausible
```

### 2.2 文件结构

```
solostack-ai/
├── app/
│   └── layout.tsx              # PlausibleProvider 配置
├── components/
│   ├── quiz/
│   │   └── QuizWizard.tsx      # 问卷事件追踪
│   └── results/
│       └── StackCard.tsx       # Affiliate 点击追踪
├── lib/
│   └── plausible.ts            # 事件追踪工具函数
└── docs/
    └── ANALYTICS_TRACKING.md   # 本文档
```

### 2.3 核心配置

#### `app/layout.tsx`

```tsx
<PlausibleProvider
  domain="solostack-ai.vercel.app"
  enabled={process.env.NODE_ENV === 'production'}
  trackOutboundLinks={true}
  taggedEvents={true}
>
  {/* 应用内容 */}
</PlausibleProvider>
```

**配置说明**:
- `domain`: 网站域名（需与 Plausible 后台一致）
- `enabled`: 仅在生产环境启用追踪
- `trackOutboundLinks`: 自动追踪外部链接点击
- `taggedEvents`: 启用自定义事件追踪

#### `components/quiz/QuizWizard.tsx`

```tsx
// 追踪问卷开始
if (currentStep === 0) {
  plausible('quiz_started');
}

// 追踪问卷完成
function handleSubmit() {
  plausible('quiz_completed', {
    props: {
      industry: answers.industry,
      budget_range: answers.budget,
      team_size: answers.team_size,
    }
  });
}
```

#### `components/results/StackCard.tsx`

```tsx
function handleAffiliateClick(toolName: string, toolCategory?: string) {
  plausible('affiliate_link_clicked', {
    props: {
      tool_name: toolName,
      tool_category: toolCategory,
      stack_tier: stack.tier,
    }
  });
}
```

---

## 📈 三、转化漏斗设置

### 3.1 漏斗步骤

在 Plausible 后台创建转化漏斗：

1. **访问首页** → Pageview: `/`
2. **开始问卷** → Event: `quiz_started`
3. **完成问卷** → Event: `quiz_completed`
4. **查看结果** → Pageview: `/results`
5. **点击 Affiliate** → Event: `affiliate_link_clicked`

### 3.2 创建步骤

1. 登录 Plausible 后台
2. 进入 **Goals** 页面
3. 点击 **Add Goal**
4. 选择 **Custom Event**
5. 输入事件名称（如 `quiz_started`）
6. 保存

重复以上步骤添加所有事件目标。

---

## 📊 四、数据看板指标

### 4.1 核心指标

| 指标 | 计算方式 | 目标值 |
|------|---------|--------|
| **日活/周活/月活** | Unique visitors | - |
| **问卷开始率** | quiz_started / pageviews | >30% |
| **问卷完成率** | quiz_completed / quiz_started | >70% |
| **Affiliate 点击率** | affiliate_link_clicked / quiz_completed | >40% |
| **整体转化率** | affiliate_link_clicked / pageviews | >8% |

### 4.2 维度分析

#### 热门工具
- 按 `tool_name` 分组统计 `affiliate_link_clicked`

#### 热门行业
- 按 `industry` 分组统计 `quiz_completed`

#### 热门预算档位
- 按 `budget_range` 分组统计 `quiz_completed`

---

## 🔍 五、Plausible 后台操作指南

### 5.1 查看实时数据

1. 登录 [plausible.io](https://plausible.io)
2. 选择 `solostack-ai.vercel.app`
3. 查看 **Real-time** 面板

### 5.2 查看转化漏斗

1. 进入 **Funnels** 标签
2. 选择已创建的漏斗
3. 查看各步骤转化率

### 5.3 查看事件详情

1. 进入 **Events** 标签
2. 点击事件名称查看详情
3. 可按属性（props）筛选

### 5.4 导出报告

1. 点击右上角 **Share**
2. 选择 **Email reports**
3. 设置发送频率（每日/每周）

---

## 🚀 六、部署与验证

### 6.1 本地测试

```bash
# 开发模式下运行
npm run dev

# 打开浏览器访问 http://localhost:3000
# 打开控制台查看 [Plausible Event] 日志
```

### 6.2 生产部署

```bash
git add -A
git commit -m "feat: add Plausible analytics tracking"
git push origin main
```

Vercel 将自动部署。

### 6.3 验证追踪

1. **实时测试**:
   - 访问网站
   - 在 Plausible 后台查看 **Real-time** 面板
   - 应看到实时访客

2. **事件测试**:
   - 完成一次完整问卷流程
   - 在 Plausible 后台 **Events** 查看事件记录

3. **使用浏览器扩展**:
   - 安装 [Plausible Helper](https://plausible.io/docs/plausible-helper)
   - 访问网站查看追踪状态

---

## 📝 七、常见问题

### Q1: 开发环境会追踪数据吗？
**A**: 不会。`enabled={process.env.NODE_ENV === 'production'}` 确保仅在生产环境追踪。

### Q2: 如何排除自己的访问？
**A**: 在 Plausible 后台设置中配置 IP 过滤，或安装浏览器扩展排除访问。

### Q3: 追踪脚本影响性能吗？
**A**: 几乎不影响。Plausible 脚本仅 1KB，且异步加载。

### Q4: 如何查看历史数据？
**A**: 在 Plausible 后台选择日期范围，最多可查看 24 个月历史数据（取决于套餐）。

### Q5: 数据准确吗？
**A**: Plausible 不追踪跨站/跨设备用户，因此数据可能略低于实际。但更适合隐私法规。

---

## 🔗 八、相关资源

- [Plausible 官方文档](https://plausible.io/docs)
- [Next.js 集成指南](https://plausible.io/docs/nextjs-integration)
- [next-plausible GitHub](https://github.com/4lejandrito/next-plausible)
- [事件追踪指南](https://plausible.io/docs/goal-conversions)
- [漏斗分析](https://plausible.io/docs/funnel-analysis)

---

## ✅ 九、检查清单

部署前请确认：

- [ ] Plausible 账号已注册
- [ ] 网站已添加到 Plausible 后台
- [ ] 追踪脚本已正确配置域名
- [ ] 所有事件已添加到 Goals
- [ ] 本地测试通过
- [ ] 生产环境验证通过
- [ ] 团队已获取 Plausible 访问权限

---

**文档维护**: 星运（growth）  
**最后更新**: 2026-04-12
