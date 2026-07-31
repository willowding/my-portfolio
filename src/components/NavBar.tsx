"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface NavBarProps {
  lang: "zh" | "en";
}

function WillowLeaf({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 19 C 8 13, 14 7, 19 5" />
      <path d="M7 16 C 9 14, 11 13, 13 12" strokeWidth="1" opacity="0.7" />
      <path d="M9 14 C 11 12, 13 11, 15 10" strokeWidth="1" opacity="0.6" />
      <path d="M11 12 C 13 10, 15 9, 17 8" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

/**
 * NAV_ITEMS 的 href 是「不带 locale 前缀」的根路径（/work/ 等）。
 * 渲染时根据 lang 自动加 /en/ 前缀；这样英文页点 nav 不会跳中文。
 */
const NAV_ITEMS = {
  zh: [
    { label: "代表项目", href: "/work/", num: "01" },
    { label: "工作经历", href: "/experience", num: "02" },
    { label: "关于我", href: "/about", num: "03" },
  ],
  en: [
    { label: "WORK", href: "/work/", num: "01" },
    { label: "EXPERIENCE", href: "/experience", num: "02" },
    { label: "ABOUT", href: "/about", num: "03" },
  ],
} as const;

const localizedHref = (rawHref: string, lang: "zh" | "en"): string => {
  if (lang === "zh") return `/zh${rawHref}`;
  if (rawHref === "/") return "/en";
  return `/en${rawHref}`;
};

export function NavBar({ lang }: NavBarProps) {
  const pathname = usePathname();
  const otherLang = lang === "zh" ? "en" : "zh";
  let otherHref = "/zh";
  if (pathname.startsWith("/en")) {
    const stripped = pathname.replace(/^\/en/, "");
    otherHref = stripped === "" || stripped === "/" ? "/zh" : `/zh${stripped}`;
  } else if (pathname.startsWith("/zh")) {
    const stripped = pathname.replace(/^\/zh/, "");
    otherHref = stripped === "" || stripped === "/" ? "/en" : `/en${stripped}`;
  } else if (pathname !== "/") {
    otherHref = `/en${pathname}`;
  }

  const items = NAV_ITEMS[lang];

  const [onDark, setOnDark] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const target = document.querySelector(".hero-block");
    if (!target) {
      setOnDark(false);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        setOnDark(entry.isIntersecting);
      },
      { rootMargin: "-72px 0px 0px 0px", threshold: 0 },
    );
    io.observe(target);
    return () => io.disconnect();
  }, [pathname]);

  return (
    <nav
      className={`site-nav${onDark && !scrolled ? " on-dark" : ""}${scrolled ? " scrolled" : ""}`}
      aria-label="Primary"
      suppressHydrationWarning
    >
      <Link
        href={lang === "zh" ? "/zh" : "/en"}
        className="leaf-logo"
        aria-label="Home"
        suppressHydrationWarning
        onClick={() => {
          if (typeof window !== "undefined" && window.location.hash) {
            window.history.replaceState(null, "", window.location.pathname + window.location.search);
            window.dispatchEvent(new HashChangeEvent("hashchange"));
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
      >
        <WillowLeaf />
        <span suppressHydrationWarning>Willow</span>
      </Link>

      <div className="leaf-nav-cluster">
        {items.map((it) => (
          <Link key={it.href} href={localizedHref(it.href, lang)} className="nav-link" suppressHydrationWarning>
            {it.label}
          </Link>
        ))}
        <span className="lang-switch" suppressHydrationWarning>
          <Link href={otherHref} suppressHydrationWarning>{lang === "zh" ? "EN" : "中"}</Link>
        </span>
      </div>

      {/* 古籍衬线：inline 藤蔓纹饰（medieval vine flourish），
          左右两侧藤蔓分别向中央蜿蜒、在中点对称汇合；铺满 nav 宽度、无中央装饰。
          整体继承 currentColor：随 on-dark 状态自动反色。
          设计：viewBox 1600x24（横向 4 倍密度），叶子数随之翻倍，
          解决 "preserveAspectRatio='none' 在 1200px nav 中把叶子横向拉伸成扁条" 的问题。
          原 400x24 的藤蔓在 X 方向重复 4 次（每次 +400 偏移）。 */}
      <svg
        className="nav-rule"
        viewBox="0 0 1600 24"
        preserveAspectRatio="none"
        shapeRendering="geometricPrecision"
        aria-hidden="true"
      >
        {[0, 1, 2, 3].flatMap((seg) =>
          [0, 1].map((side) => {
            const sign = side === 0 ? -1 : 1;
            const baseX = seg * 400 + 200;
            return (
              <g
                key={`seg${seg}-side${side}`}
                transform={`translate(${seg * 400}, 0)`}
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path
                  d={
                    side === 0
                      ? `M 200 12 C 180 9, 165 8, 150 9 C 135 10, 120 12, 110 13 C 100 14, 90 14, 80 13 C 70 12, 60 10, 50 9 C 40 8, 30 8, 22 9`
                      : `M 200 12 C 220 9, 235 8, 250 9 C 265 10, 280 12, 290 13 C 300 14, 310 14, 320 13 C 330 12, 340 10, 350 9 C 360 8, 370 8, 378 9`
                  }
                  strokeWidth="0.7"
                />
                <path
                  d={
                    side === 0
                      ? `M 22 9 C 14 10, 8 12, 4 13 C 2 14, 1 14, 2 12 C 3 11, 5 11, 7 11`
                      : `M 378 9 C 386 10, 392 12, 396 13 C 398 14, 399 14, 398 12 C 397 11, 395 11, 393 11`
                  }
                  strokeWidth="0.6"
                />
                {[
                  side === 0 ? "M 30 10 C 27 13, 26 16, 29 17 C 32 18, 34 15, 32 12" : "M 370 10 C 373 13, 374 16, 371 17 C 368 18, 366 15, 368 12",
                  side === 0 ? "M 60 10 C 57 7, 58 4, 61 4 C 64 4, 65 7, 63 9" : "M 340 10 C 343 7, 342 4, 339 4 C 336 4, 335 7, 337 9",
                  side === 0 ? "M 95 11 C 92 14, 91 17, 94 18 C 97 19, 99 16, 97 13" : "M 305 11 C 308 14, 309 17, 306 18 C 303 19, 301 16, 303 13",
                  side === 0 ? "M 130 11 C 127 8, 128 5, 131 5 C 134 5, 135 8, 133 10" : "M 270 11 C 273 8, 272 5, 269 5 C 266 5, 265 8, 267 10",
                  side === 0 ? "M 165 11 C 162 14, 161 17, 164 18 C 167 19, 169 16, 167 13" : "M 235 11 C 238 14, 239 17, 236 18 C 233 19, 231 16, 233 13",
                ].map((d, i) => (
                  <path key={i} d={d} strokeWidth="0.5" />
                ))}
              </g>
            );
          })
        )}
      </svg>
    </nav>
  );
}