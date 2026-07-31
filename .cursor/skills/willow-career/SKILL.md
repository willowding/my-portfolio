# willow-career

When the user asks for help with **Willow Ding's career materials** — résumés, cover letters, application forms, interview prep, cold emails, JD rewrites, anything tied to her portfolio — use this skill.

This skill exists so the user's writing stays **internally consistent**: every number, project framing, and self-description matches what is on the live site and in the YAML.

---

## 1 · Single source of truth (read these first, always)

| File | What it has |
| --- | --- |
| `data/profile.yaml` | Full bilingual fact base: basics, experience, projects, skills, education, awards, about, contact |
| `live site `http://localhost:3000`` | The rendered portfolio (`/` 中文, `/en` 英文) — structure + tone reference |

**Before drafting anything, read `data/profile.yaml` end-to-end.** If you generate a number that isn't there, **do not invent it**; either pull an existing fact or ask the user.

---

## 2 · Identity at a glance

- **Name (中文)** 丁娜文 · **Name (EN)** Willow Ding
- **Title** 产品 × AI 协同 · 翻译专业 · 2026 届应届生
- **Location** 上海
- **Email** shuwen2004@outlook.com
- **Phone** +86 132 4527 0116
- **LinkedIn / GitHub** see `data/profile.yaml > basics.links`

---

## 3 · Three signature projects (lead with these)

1. **PicReview · 团队图片审核工具** — solo 0→1 internal tool. 3 → 7 daily users (7 projects incl. 1 finished, 1,674 images reviewed). Stack: HTML/CSS/JS 单文件 + Supabase + Cloudinary + GitHub Pages.
2. **泛华语 OST YouTube 频道运营** — 60-day recovery of a dormant channel. Monthly views **1.9 万 → 4 万**, impressions **29.7 万 → 74.4 万**, CTR stable **4.8%**, **$311.47** ad revenue. Multi-language reach 16+ countries (Taiwan 62%).
3. **Brand Guide & Company Presentation 2026 (EN)** — solo strategy + copy + layout. Adopted in overseas BD pitches.

---

## 4 · Two internships (reverse-chronological)

1. **乐擎网络科技（上海）** · 产品助理实习 (Mar – Jun 2026)
   - Shipped PicReview end-to-end solo
   - Codified Lovart Agent workflow into a team SOP → cut credit consumption
   - L1–L6 English picture-book content + cast bible / family timeline
2. **上海汇火文化传播** · 海外市场实习 (Nov 2025 – Mar 2026)
   - YouTube channel revival (above)
   - Multi-language strategy (繁中 primary + EN/JP/KR/FR/ES)
   - Brand Guide + Company Presentation 2026 (EN)

---

## 5 · Skills (use these exact groupings)

- 核心能力：产品 0→1 · 内容策划与执行 · 品牌资产标准化 · AI 工作流编排 · 跨文化与英文沟通
- AI 协同 (对话 / Agent / 编程)：Cursor · Claude · ChatGPT · Gemini · NotebookLM · Lovart
- AI 视觉生成：Midjourney · NanoBanana · Dreamina（即梦）
- 设计 / 内容：Canva（可画）· 演示文稿设计
- 运营 / 协作工具：飞书 · YouTube Studio · VidIQ · GitHub
- 语言：中文（母语）· 英语（TEM-8 合格 · TEM-4 良好 · CET-6 566 · CET-4 567）
- 其他：古筝（江苏省音乐家协会十级）

---

## 6 · Voice & style rules

1. **English version is a real rewrite, not a literal translation.** Lead with action verbs ("Took over," "Shipped," "Codified") and put numbers where they earned the space. Drop Chinese filler particles ("的," "了," "着") from English copy. See `data/profile.yaml > *_en` fields as the house style.
2. **Never fabricate metrics.** If a metric isn't in `profile.yaml`, ask before adding it.
3. **Headlines use italic serif voice** ("Solo Maker," "Featured," "Case," "Side"). Don't punch them up to be louder.
4. **Self-eval is short and concrete.** Two bullets, each 1–2 lines:
   - 学习能力较强 / Fast learner
   - 注重细节 / Detail-oriented
5. **Tone** for cover letters / cold email: confident but plain — show outcomes, don't oversell.

---

## 7 · When the user asks for a résumé, a cover letter, a LinkedIn bio, or a cold email

1. Read `data/profile.yaml`.
2. Choose the language the user asks for; if unspecified, default to 中文 + EN 平行（always produce both unless told otherwise).
3. Match the live site's section order: Hero (1-line intro + capabilities) → Selected Work → Experience → About (self-eval + skills + education + awards) → Contact.
4. For 项目 / 经历 bullets, keep **Lead + 短证据** structure (e.g., "频道恢复：60 天恢复 ... CTR 4.8% / $311.47" — not a paragraph).
5. After drafting, **diff against `data/profile.yaml`**: every noun, project, number must be sourced.

---

## 8 · Site maintenance (only when asked)

If the user asks to **change the site**, the live structural files are:

- `src/app/page.tsx` / `src/app/en/page.tsx` — composing sections
- `src/components/Hero.tsx` / `WorksSection.tsx` / `ExperienceSection.tsx` / `AboutSection.tsx` / `ContactSection.tsx` / `NavBar.tsx` — presentational
- `src/app/globals.css` — design tokens
- `data/profile.yaml` — content source

Never invent content here either — change `data/profile.yaml` first, then components will pick it up.
