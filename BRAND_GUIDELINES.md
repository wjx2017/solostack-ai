# Solostack AI 品牌视觉指南

_最后更新：2026-04-12_

---

## 🎨 品牌标识

### Logo

Solostack AI 的 Logo 采用**工具栈/积木**概念，象征 AI 工具的层次化组合。

**设计元素**：
- 三层堆叠的积木块，代表 AI 工具栈的层次结构
- 紫蓝色渐变，传达科技感与专业性
- 金色点缀，象征 AI 的智能与价值
- 简洁几何造型，适合各种尺寸展示

**文件位置**：
- `public/logo.svg` - 完整版 Logo（含文字）
- `public/logo-icon.svg` - 图标版 Logo（仅图形）
- `public/logo.png` - PNG 格式图标 (512x512)

---

## 🎯 颜色系统

### 主色渐变

Logo 使用紫蓝色渐变，与网站主题保持一致：

```css
/* 渐变定义 */
linear-gradient(135deg, 
  #6366f1 0%,   /* Indigo 500 */
  #8b5cf6 50%,  /* Violet 500 */
  #a855f7 100%  /* Purple 500 */
)
```

### 单色使用

当渐变不可用时，可使用以下单色：

| 用途 | 颜色 | Hex |
|------|------|-----|
| 主色 | Indigo 500 | `#6366f1` |
| 辅色 | Violet 500 | `#8b5cf6` |
| 强调色 | Gold 400 | `#fbbf24` |

---

## 📐 使用规范

### 最小尺寸

- **Logo 图标**：不小于 32x32px
- **完整版 Logo**：不小于 120px 宽度
- **Favicon**：已提供 32/64/180px 三种尺寸

### 安全边距

Logo 周围应保持至少 **1/4 Logo 高度** 的空白区域。

### 背景使用

- **浅色背景**：使用标准渐变 Logo
- **深色背景**：使用白色/浅色版本 Logo（待创建）
- **彩色背景**：确保有足够对比度

---

## 📱 应用场景

### Favicon

文件：`public/favicon.ico`, `public/favicon-180.png`

用于：
- 浏览器标签页图标
- 书签图标
- PWA 应用图标

### Open Graph 图片

文件：`public/og-image.png` (1200x630px)

用于：
- 社交媒体分享预览（Twitter, LinkedIn, Facebook）
- 链接卡片展示
- 内容推广

### 网站使用

```tsx
// Next.js Metadata (已配置)
export const metadata: Metadata = {
  icons: {
    icon: [
      { url: '/favicon-32.png', sizes: '32x32' },
      { url: '/favicon-64.png', sizes: '64x64' },
    ],
    apple: '/favicon-180.png',
  },
  openGraph: {
    images: ['/og-image.png'],
  },
}
```

---

## 🚀 品牌调性

### 核心价值

- **简洁**：去除多余装饰，专注核心功能
- **专业**：清晰的视觉层次，可信赖的设计
- **高效**：5 分钟内找到完美 AI 工具栈
- **透明**：价格清晰，对比明确

### 视觉风格

- 使用充足的留白
- 清晰的字体层级（Inter 字体）
- 一致的圆角设计（xl/2xl）
- 微妙的阴影效果

---

## 📁 文件清单

| 文件 | 尺寸 | 格式 | 用途 |
|------|------|------|------|
| `logo.svg` | 512x512 | SVG | 完整版 Logo（矢量） |
| `logo-icon.svg` | 512x512 | SVG | 图标版 Logo（矢量） |
| `logo.png` | 512x512 | PNG | 图标版 Logo（位图） |
| `favicon-32.png` | 32x32 | PNG | 浏览器标签图标 |
| `favicon-64.png` | 64x64 | PNG | 高分辨率标签图标 |
| `favicon-180.png` | 180x180 | PNG | Apple 设备图标 |
| `favicon.ico` | 32x32 | ICO | 传统浏览器兼容 |
| `og-image.png` | 1200x630 | PNG | 社交媒体分享图 |

---

## ✨ 品牌承诺

> **Find Your Perfect AI Tool Stack in 5 Minutes**

Solostack AI 帮助用户快速找到最适合的 AI 工具组合，避免浪费订阅费用，提升工作效率。

---

_此文档由星影（设计体验员）创建_
