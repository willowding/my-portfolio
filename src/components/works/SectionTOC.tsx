"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./SectionTOC.module.css";

/**
 * SectionTOC：右侧悬浮目录栏（Apple Music 滚动歌词风格）
 * - IntersectionObserver 监听 5 个 section 在视口中的位置，自动高亮当前章节
 * - 章节被滚到视口上方 ~30% 时切换为 active；
 *   active 状态切换使用 CSS transition 制造淡入淡出（0.4s）
 * - 点击目录项 → 平滑滚动到对应 section（scroll-behavior: smooth）
 * - 仅 lg 断点（≥1024px）通过 CSS 显示，窄屏隐藏
 */

type TocItem = {
  id: string;
  label: string;
  num: string;
  noScroll?: boolean;
};

type Props = {
  items?: TocItem[];
};

const DEFAULT_ITEMS: TocItem[] = [
  { id: "sec-demand", label: "需求来源", num: "01", noScroll: true },
  { id: "sec-features", label: "功能介绍", num: "02" },
  { id: "sec-timeline", label: "迭代纪录", num: "03" },
  { id: "sec-data", label: "项目数据", num: "04" },
  { id: "sec-tech", label: "技术栈", num: "05" },
];

export function SectionTOC({ items }: Props) {
  const ITEMS = items ?? DEFAULT_ITEMS;
  const [activeId, setActiveId] = useState<string>(ITEMS[0].id);
  const lastActiveRef = useRef<string>(ITEMS[0].id);

  useEffect(() => {
    const sections = ITEMS.map((it) => document.getElementById(`${it.id}-title`)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (sections.length === 0) return;

    // 视口上方 30% 处的横线作为"激活线" —— section 顶部越过这条线就视为当前章节
    const observer = new IntersectionObserver(
      (entries) => {
        // 找出"激活线下方最近"的 section —— 即 top 距离激活线最近且小于等于激活线位置的 section
        // IntersectionObserver 给的是 isIntersecting + boundingClientRect
        // 我们用 viewport top + 30% height 当作激活线：
        const activateLineY = window.innerHeight * 0.3;

        let bestId: string | null = null;
        let bestDistance = Infinity;
        for (const sec of sections) {
          const rect = sec.getBoundingClientRect();
          // 取 section 顶部到激活线的距离（顶部 ≤ 激活线 = 已滚过去）
          const distance = activateLineY - rect.top;
          if (distance >= 0 && distance < bestDistance) {
            bestDistance = distance;
bestId = sec.id;
          }
        }

        // 如果都没滚过去（用户仍在第一个 section 之上），默认激活第一个
        if (bestId === null) {
          // 找离激活线最近的（即顶部最大的）
          for (const sec of sections) {
            const rect = sec.getBoundingClientRect();
            const distance = activateLineY - rect.top;
            if (distance < 0 && Math.abs(distance) < bestDistance) {
              bestDistance = Math.abs(distance);
  bestId = sec.id;
            }
          }
if (bestId === null) bestId = ITEMS[0].id;
        }

        if (bestId !== lastActiveRef.current) {
          lastActiveRef.current = bestId;
          setActiveId(bestId);
        }
      },
      {
        // 设置非常宽的 threshold 范围，确保滚动时持续触发回调
        threshold: [0, 0.05, 0.1, 0.25, 0.5, 0.75, 1],
        // 上边距留 30% 让 section 早期就开始计入；下边距 0
        rootMargin: "-30% 0px 0px 0px",
      }
    );

    for (const sec of sections) observer.observe(sec);

    return () => observer.disconnect();
  }, [ITEMS]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string, noScroll?: boolean) => {
    e.preventDefault();
    if (noScroll) {
      // 已经在该条目位置，仅更新高亮，不跳转
      lastActiveRef.current = id;
      setActiveId(id);
      return;
    }
    const el = document.getElementById(`${id}-title`);
    if (!el) return;
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
    <nav className={styles["pr-toc"]} aria-label="章节目录">
      <div className={styles["pr-toc-inner"]}>
        <ul className={styles["pr-toc-list"]}>
          {ITEMS.map((it) => {
            const isActive = it.id === activeId;
            return (
              <li key={it.id} className={styles["pr-toc-item"]}>
                <a
                  href={`#${it.id}`}
                  onClick={(e) => handleClick(e, it.id, it.noScroll)}
                  className={`${styles["pr-toc-link"]} ${isActive ? styles["pr-toc-link-active"] : ""}`}
                  aria-current={isActive ? "true" : undefined}
                >
                  <span className={styles["pr-toc-label"]}>{it.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
