"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * PageModeController
 *
 * 设计：
 * - 默认 (无 hash)：只显示 Hero，其他 section 全部隐藏 → 单屏绿色落地
 * - 有 hash (例如 #works)：Hero 隐藏，对应 section 显示 + 平滑滚到顶
 * - hash 从 URL 读取；logo 点击由 NavBar 自己处理
 */
export function PageModeController({
  hero,
  sections,
}: {
  hero: ReactNode;
  sections: ReactNode[];
}) {
  const [activeHash, setActiveHash] = useState<string | null>(null);

  useEffect(() => {
    const apply = () => {
      const h = window.location.hash.replace(/^#/, "");
      setActiveHash(h || null);
    };

    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  useEffect(() => {
    if (!activeHash) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(activeHash);
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [activeHash]);

  const heroVisible = !activeHash;

  return (
    <>
      {heroVisible ? <div>{hero}</div> : null}

      {sections.map((node, i) => {
        const id = (node as any)?.props?.id as string | undefined;
        const visible = !!id && id === activeHash;
        if (!visible) return null;
        return <div key={id ?? i}>{node}</div>;
      })}
    </>
  );
}
