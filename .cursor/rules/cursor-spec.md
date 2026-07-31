# 光标规范（Cursor Spec）

本项目使用两套自定义光标 PNG，覆盖全站默认行为：

## 光标资源

```
public/cursor/
├── arrow.png   24×24，hotspot 1 1（默认箭头/光标尖端）
└── hand.png    24×24，hotspot 1 1（手型 / 指针）
```

**设计主题**：Vintage Floral Christmas Ball · 古典花环缎带。
导航栏把鼠标放在「代表项目」上能看到 hand.png 的样子（细竖线 + 小圆点，「瓶子」造型）。

## 全局规则（`globals.css`）

```css
html, body {
  cursor: url("/cursor/arrow.png") 1 1, auto;
}

/* 所有可交互元素 */
a, button, [role="button"], .works-row-head, label, summary, input, textarea, select {
  cursor: url("/cursor/hand.png") 1 1, pointer;
}

/* nav 内（cursor 不通过继承触达链接，显式声明） */
.site-nav, .site-nav *, .nav-link, .leaf-logo, .lang-switch a {
  cursor: url("/cursor/hand.png") 1 1, pointer;
}
.site-nav .nav-rule { cursor: url("/cursor/arrow.png") 1 1, auto; }

/* 装饰层退回默认 arrow */
.works-detail-cover, .hero-block .hero-ornament, [aria-hidden="true"] svg {
  cursor: url("/cursor/arrow.png") 1 1, auto;
}
```

## CSS Modules 与全局样式的冲突

CSS Modules 把类名编译成 hash（如 `.te-feature-header` → `.TimelineEvents-module__xxxx__te-feature-header`）。
这导致：

- **全局规则（`globals.css`）无法用 `.te-feature-header` 直接匹配** —— 因为 hash 类名不匹配裸类名
- **如果模块自身写了 `cursor: pointer`，它会覆盖 globals 里的 cursor 规则**（因为模块 CSS 在 globals 之后加载）

### 解决方法

**方案 A（推荐）**：CSS 模块里不写 `cursor: pointer`，让全局规则直接生效。

```css
/* TimelineEvents.module.css —— 让出 cursor 给全局 */
.te-feature-header {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  padding: 0.3rem 0;
  cursor: pointer;   /* ← 不要写这行，让 globals.css 来管 */
  user-select: none;
}
```

**方案 B（兜底）**：globals 用属性选择器 + `!important` 强制覆盖模块。

```css
/* globals.css */
div[class*="te-feature-header"] {
  cursor: url("/cursor/hand.png") 1 1, pointer !important;
}
```

## 新增可交互组件时的检查清单

每次新建 CSS 模块并写了 `cursor: pointer` 时：

1. **先确认 globals.css 已有这个类的覆盖规则** —— 用属性选择器 `div[class*="xxx"]` 兜底
2. **或者**改写模块本身不写 cursor，让全局规则生效（首选）
3. **如果模块写成 `<div onClick>`**，记得给它加上 `[role="button"]` 属性，自动命中 globals 规则

## 装饰元素 / 不可点击元素

- 装饰 SVG、ornament、cover 用 `cursor: url("/cursor/arrow.png") 1 1, auto`
- 长文段落、阅读区用 `cursor: url("/cursor/arrow.png") 1 1, auto`（不显式写，body 默认就是它）