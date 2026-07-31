"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/components/works/YoutubeDetail.module.css";

/**
 * 右侧悬浮目录栏（PicReview 同款：Apple Music 滚动歌词风格）
 * - IntersectionObserver 监听 4 个 section 在视口中的位置，自动高亮当前章节
 * - 章节顶部越过视口 30% 切线时切换为 active，CSS transition 0.4s 淡入淡出
 * - 点击目录项 → 平滑滚动到对应 section（scroll-behavior: smooth）
 * - 仅 lg 断点（≥1024px）通过 CSS 显示，窄屏隐藏
 */

type SectionId =
  | "sec-context"
  | "sec-strategy"
  | "sec-results"
  | "sec-dual";

type TocItem = {
  id: SectionId;
  label: string;
  num: string;
};

const ITEMS_BY_LANG: Record<"zh" | "en", TocItem[]> = {
  zh: [
    { id: "sec-context", label: "接手背景", num: "01" },
    { id: "sec-strategy", label: "运营策略", num: "02" },
    { id: "sec-results", label: "数据成果", num: "03" },
    { id: "sec-dual", label: "双频道协同", num: "04" },
  ],
  en: [
    { id: "sec-context", label: "Handover Context", num: "01" },
    { id: "sec-strategy", label: "Strategy", num: "02" },
    { id: "sec-results", label: "Results", num: "03" },
    { id: "sec-dual", label: "Dual-Channel Synergy", num: "04" },
  ],
};

export function YoutubeSectionTOC({ lang = "zh" }: { lang?: "zh" | "en" }) {
  const ITEMS = ITEMS_BY_LANG[lang];
  const [activeId, setActiveId] = useState<SectionId>("sec-context");
  const lastActiveRef = useRef<SectionId>("sec-context");

  useEffect(() => {
    const sections = ITEMS.map((it) => document.getElementById(`${it.id}-title`)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      () => {
        const activateLineY = window.innerHeight * 0.3;

        let bestId: SectionId | null = null;
        let bestDistance = Infinity;
        for (const sec of sections) {
          const rect = sec.getBoundingClientRect();
          const distance = activateLineY - rect.top;
          if (distance >= 0 && distance < bestDistance) {
            bestDistance = distance;
            bestId = sec.id as SectionId;
          }
        }

        if (bestId === null) {
          for (const sec of sections) {
            const rect = sec.getBoundingClientRect();
            const distance = activateLineY - rect.top;
            if (distance < 0 && Math.abs(distance) < bestDistance) {
              bestDistance = Math.abs(distance);
              bestId = sec.id as SectionId;
            }
          }
          if (bestId === null) bestId = "sec-context";
        }

        if (bestId !== lastActiveRef.current) {
          lastActiveRef.current = bestId;
          setActiveId(bestId);
        }
      },
      {
        threshold: [0, 0.05, 0.1, 0.25, 0.5, 0.75, 1],
        rootMargin: "-30% 0px 0px 0px",
      }
    );

    for (const sec of sections) observer.observe(sec);

    return () => observer.disconnect();
  }, [ITEMS]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: SectionId) => {
    e.preventDefault();
    const el = document.getElementById(`${id}-title`);
    if (!el) return;
    // 用 nav DOM 元素的真实下沿作 offset —— 比 CSS 变量更精准
    const navEl = document.querySelector('.site-nav');
    const navBottom = navEl
      ? navEl.getBoundingClientRect().bottom
      : parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-height")) || 96;
    const top = el.getBoundingClientRect().top + window.scrollY - navBottom - 8;
    window.scrollTo({ top, behavior: "smooth" });
    lastActiveRef.current = id;
    setActiveId(id);
  };

  return (
    <nav className={styles["yt-toc"]} aria-label={lang === "en" ? "Section directory" : "\u7AE0\u8282\u76EE\u5F55"}>
      <div className={styles["yt-toc-inner"]}>
        <ul className={styles["yt-toc-list"]}>
          {ITEMS.map((it) => {
            const isActive = it.id === activeId;
            return (
              <li key={it.id} className={styles["yt-toc-item"]}>
                <a
                  href={`#${it.id}`}
                  onClick={(e) => handleClick(e, it.id)}
                  className={`${styles["yt-toc-link"]} ${isActive ? styles["yt-toc-link-active"] : ""}`}
                  aria-current={isActive ? "true" : undefined}
                >
                  <span className={styles["yt-toc-label"]}>{it.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}