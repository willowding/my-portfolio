"use client";

import { useState } from "react";
import { renderInline } from "@/lib/text";

interface Project {
  name: string;
  name_en: string;
  period: string;
  period_en: string;
  role: string;
  role_en: string;
  summary: string;
  summary_en: string;
  bullets: { lead?: string; lead_en?: string; text: string; text_en: string }[];
  tech: string[];
  tech_en: string[];
  metrics: { label: string; value: string }[];
  tags: string[];
  link?: string;
  category?: string;
  category_en?: string;
  badges?: string[];
  badges_en?: string[];
  featured?: boolean;
}

interface WorksSectionProps {
  lang: "zh" | "en";
  projects: Project[];
  labels: {
    title: string;
    count: string;
    techLabel: string;
    featured?: string;
    viewDetail?: string;
    back?: string;
    project?: string;
  };
  /** Optional anchor id for use with SectionsController (page-mode single-section view). */
  id?: string;
}

/**
 * 代表作品区 —— 双视图：
 *   (1) 列表视图：Brandon Lee 风格「编号 + 标题 + 标签 + 副标题」一行式布局
 *   (2) 详情视图：点行后切换到 full-detail（不跳路由，URL 不变）
 *
 * 切换通过本地 openIdx 状态管理，URL 保持 localhost:3001/。
 * 详情视图右上角有"← 返回"按钮回到列表。
 */
export function WorksSection({ lang, projects, labels }: WorksSectionProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const isDetail = openIdx !== null;
  const active = isDetail ? projects[openIdx as number] : null;

  return (
    <section id="projects" className="section">
      <div className="container-narrow">
        {!isDetail && (
          <>
            <div className="section-head">
              <h2 className="section-title">{labels.title}</h2>
            </div>

            <ol className="works-list">
              {projects.map((prj, i) => {
                const num = String(i + 1).padStart(2, "0");
                const isFeatured = prj.featured === true;
                const badgesZh = prj.badges && prj.badges.length > 0 ? prj.badges : (prj.category ? [prj.category] : []);
                const badgesEn = prj.badges_en && prj.badges_en.length > 0 ? prj.badges_en : (prj.category_en ? [prj.category_en] : []);
                const badges = lang === "en" ? badgesEn : badgesZh;
                const localePrefix = lang === "en" ? "/en" : "/zh";
                const picreviewHref = `${localePrefix}/work/picreview`;
                const youtubeHref = `${localePrefix}/work/operation-youtube`;
                const threeXiangHref = `${localePrefix}/work/documentary-dedication`;
                const nameStr = lang === "en" ? prj.name_en : prj.name;
                const isPicreview =
                  nameStr?.includes("PicReview") || nameStr?.includes("Picreview");
                const isYoutube =
                  nameStr?.includes("YouTube") || nameStr?.includes("youtube") || nameStr?.includes("频道运营");
                const isThreeXiang =
                  nameStr?.includes("三下乡") ||
                  nameStr?.includes("社会实践") ||
                  nameStr?.includes("Dedication") ||
                  nameStr?.includes("dedication") ||
                  nameStr?.includes("Social-Practice") ||
                  nameStr?.includes("Documentary");
                const HeadTag: "a" | "button" = (isPicreview || isYoutube || isThreeXiang) ? "a" : "button";
                const headProps = isPicreview
                  ? { href: picreviewHref }
                  : isYoutube
                  ? { href: youtubeHref }
                  : isThreeXiang
                  ? { href: threeXiangHref }
                  : {
                      type: "button" as const,
                      onClick: () => setOpenIdx(i),
                      "aria-expanded": false,
                    };

                return (
                  <li
                    key={i}
                    className={`works-row${isFeatured ? " is-featured" : ""}`}
                  >
                    <HeadTag className="works-row-head" {...(headProps as any)}>
                      <span className="works-num">{num}</span>
                      <span className="works-title">
                        <span className="works-title-line1">
                          <span className="works-title-name">{nameStr}</span>
                          {isFeatured && (
                            <span
                              className="works-star"
                              aria-label={labels.featured ?? "Featured"}
                            >
                              *
                            </span>
                          )}
                        </span>
                        <span className="works-title-line2">
                          <span className="works-period">
                            {lang === "en" ? prj.period_en : prj.period}
                          </span>
                          {badges.length > 0 && (
                            <span className="works-tags">
                              {badges.map((b, bi) => (
                                <span key={bi} className="works-tag-pill">{b}</span>
                              ))}
                            </span>
                          )}
                        </span>
                      </span>
                    </HeadTag>
                  </li>
                );
              })}
            </ol>
          </>
        )}

        {isDetail && active && (
          <article className="works-detail-view">
            <div className="works-detail-topbar">
              <button
                type="button"
                className="works-back"
                onClick={() => setOpenIdx(null)}
              >
                <span aria-hidden="true">←</span>
                <span>{labels.back ?? (lang === "en" ? "Back" : "返回")}</span>
              </button>
              <span className="eyebrow">
                {labels.project ?? (lang === "en" ? "Project" : "项目")} {String((openIdx as number) + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
              </span>
            </div>

            <header className="works-detail-head">
              <h1 className="works-detail-title">
                {lang === "en" ? active.name_en : active.name}
                {active.featured && (
                  <span
                    className="works-star"
                    aria-label={labels.featured ?? "Featured"}
                  >
                    *
                  </span>
                )}
              </h1>
              <div className="works-detail-meta">
                <span className="works-tag">
                  {lang === "en"
                    ? active.category_en ?? active.category
                    : active.category}
                </span>
                <span className="works-detail-role">
                  {lang === "en" ? active.role_en : active.role}
                </span>
                <span className="works-detail-period">
                  {lang === "en" ? active.period_en : active.period}
                </span>
              </div>
            </header>

            <div className="works-detail-cover" aria-hidden="true">
              {/* 古籍信笺风的极简占位封面：左右藤蔓环绕 */}
              <svg
                viewBox="0 0 400 80"
                preserveAspectRatio="xMidYMid meet"
                shapeRendering="geometricPrecision"
              >
                <g
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.55"
                >
                  {/* 左藤蔓 */}
                  <path
                    d="M 50 40 C 80 30, 110 30, 140 36 C 170 42, 190 44, 200 40"
                    strokeWidth="0.7"
                  />
                  <path
                    d="M 60 38 C 57 34, 58 30, 62 30 C 66 30, 67 34, 65 37"
                    strokeWidth="0.5"
                  />
                  <path
                    d="M 95 38 C 92 42, 91 46, 94 47 C 97 48, 99 45, 97 42"
                    strokeWidth="0.5"
                  />
                  <path
                    d="M 130 39 C 127 35, 128 31, 131 31 C 134 31, 135 35, 133 38"
                    strokeWidth="0.5"
                  />
                  <path
                    d="M 165 41 C 162 45, 161 49, 164 50 C 167 51, 169 48, 167 45"
                    strokeWidth="0.5"
                  />
                  {/* 右藤蔓（镜像） */}
                  <path
                    d="M 350 40 C 320 30, 290 30, 260 36 C 230 42, 210 44, 200 40"
                    strokeWidth="0.7"
                  />
                  <path
                    d="M 340 38 C 343 34, 342 30, 338 30 C 334 30, 333 34, 335 37"
                    strokeWidth="0.5"
                  />
                  <path
                    d="M 305 38 C 308 42, 309 46, 306 47 C 303 48, 301 45, 303 42"
                    strokeWidth="0.5"
                  />
                  <path
                    d="M 270 39 C 273 35, 272 31, 269 31 C 266 31, 265 35, 267 38"
                    strokeWidth="0.5"
                  />
                  <path
                    d="M 235 41 C 238 45, 239 49, 236 50 C 233 51, 231 48, 233 45"
                    strokeWidth="0.5"
                  />
                </g>
                {/* 中央编号 */}
                <text
                  x="200"
                  y="50"
                  textAnchor="middle"
                  fontFamily="var(--font-serif)"
                  fontStyle="italic"
                  fontSize="36"
                  fill="currentColor"
                  opacity="0.85"
                >
                  {String((openIdx as number) + 1).padStart(2, "0")}
                </text>
              </svg>
            </div>

            <p className="works-detail-summary">
              {lang === "en" ? active.summary_en : active.summary}
            </p>

            {active.metrics.length > 0 && (
              <div className="metric-row metric-row-large">
                {active.metrics.map((m, j) => (
                  <div key={j}>
                    <div className="metric-value">{m.value}</div>
                    <div className="metric-label">{m.label}</div>
                  </div>
                ))}
              </div>
            )}

            {active.bullets.length > 0 && (
              <ul className="bullet-list bullet-list-large">
                {active.bullets.map((b, j) => {
                  const lead = lang === "en" ? b.lead_en ?? b.lead : b.lead;
                  const text = lang === "en" ? b.text_en : b.text;
                  return (
                    <li key={j}>
                      {lead && <strong>{lead}：</strong>}
                      <span
                        dangerouslySetInnerHTML={{
                          __html: renderInline(text),
                        }}
                      />
                    </li>
                  );
                })}
              </ul>
            )}

            {active.tech.length > 0 && (
              <div className="tech-strip tech-strip-large">
                <span className="label">{labels.techLabel}</span>
                {(lang === "en" ? active.tech_en : active.tech).join(" · ")}
              </div>
            )}

            {active.link && (
              <a
                className="works-link works-link-large"
                href={active.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                ↗{" "}
                {lang === "en"
                  ? "Open project"
                  : labels.viewDetail ?? "查看项目"}
              </a>
            )}
          </article>
        )}
      </div>
    </section>
  );
}