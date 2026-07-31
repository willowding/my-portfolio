# Willow Ding Portfolio · 代码规范

## 字体规范

**这是唯一正确的字体定义位置。所有 CSS 文件必须引用此处定义的 CSS 变量，禁止硬编码字体名称。**

### CSS 变量定义（`src/app/globals.css`）

```css
/* 中文回退链：优先思源宋体 → 系统衬线 → 兜底 serif
   注意：不要用 var(--font-cormorant)，Cormorant Garamond 是英文专用 */
--font-serif: "Source Han Serif SC", "Noto Serif SC", "Songti SC", "STSong", "SimSun", serif;
--font-mono:  "JetBrains Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace;

/* 全局默认衬线（Cormorant Garamond 已通过 layout.tsx <link> 预加载） */
html, body { font-family: var(--font-serif); }

/* 中文标题强制回退到思源宋体（避免西文衬线渲染中文） */
html[lang="zh"] h1,
html[lang="zh"] h2,
html[lang="zh"] h3,
html[lang="zh"] h4 {
  font-family: "Source Han Serif SC", "Noto Serif SC", "Songti SC", "STSong", "SimSun", serif;
}
```

### 字体用途

| CSS 变量 | 用途 | 示例 |
|---|---|---|
| `--font-serif` | 正文、标题、功能卡片、标签 | `.pr-section-heading`, `.te-detail-body` |
| `--font-mono` | 日期、指标数字、标签 chip、代码 | `.pr-metric-value`, `.te-date-badge`, `.te-detail-label` |
| `--font-sans` | UI 交互元素（按钮、输入框等） | `.te-feature-header`（折叠标题，交互导向用 sans） |

### 常见陷阱

1. **不要用 `var(--font-cormorant)` 作为中文回退链** —— `var()` 在某些 CSS 上下文里展开顺序不稳定，中文 fallback 会失效。
2. **不要写 `"Cormorant Garamond"` 作为 `font-family` 的直接值** —— 那是英文专用字体，中文用它会显示为黑方块或系统默认字体。
3. **每次新建 CSS 模块时，确认 `--font-serif` 等变量在 `globals.css` 中已定义** —— CSS 模块自身没有这些变量定义。
4. **中文字体的 font-family 完整字符串必须写完整** —— CSS 变量展开时不识别变量引用的级联，必须用完整字符串。

---

## 相关规范

- 光标规范见 `cursor-spec.md`

### Google Fonts 预加载

英文衬线字体（Cormorant Garamond）通过 `src/app/layout.tsx` 的 `<link>` 预加载：

```tsx
<link
  href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&display=swap"
  rel="stylesheet"
/>
```

### 指标数字字体

指标数字（如 DAU 折线图的大数字、metrics 的 value）使用 `--font-serif`，斜体加粗：

```css
.pr-metric-value {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 600;
  font-size: clamp(2rem, 4.6vw, 3rem);
}
```

这是 Cormorant Garamond 的设计意图：**数字 + 斜体 = 优雅的衬线数字**。不要改成等宽或无衬线字体。
