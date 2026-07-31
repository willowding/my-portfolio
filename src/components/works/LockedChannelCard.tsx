"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "@/components/works/YoutubeDetail.module.css";

const DEFAULT_CHANNEL_NAME = "水月琴音";
const DEFAULT_CHANNEL_URL = "https://www.youtube.com/@shuiyueqinyin";
const PASSWORD = "040116";
const DEFAULT_STORAGE_KEY = "channel-unlocked";

interface LockedChannelCardProps {
  className?: string;
  /** 频道名（解锁前占位、解锁后显示；默认 = 水月琴音） */
  name?: string;
  /** 频道 YouTube URL（解锁后跳转目标；默认 = @shuiyueqinyin） */
  url?: string;
  /** 解锁状态存储 key 后缀。
   *  - 默认 "channel-unlocked"，全站共享一次解锁。
   *  - 传不同值即可让一个实例独立于全站解锁状态。 */
  storageKey?: string;
  lang?: "zh" | "en";
}

/**
 * 频道名解锁 / 直达组件
 *
 * 三态：
 *  - locked  （未解锁）：页面上显示灰色遮罩块（同 5 字宽度）+ 问号；点击弹卡
 *  - popover （弹卡中）：输入密码 → 解锁
 *  - unlocked（已解锁）：页面上直接渲染「水月琴音↗」链接，点跳 YouTube；
 *                       同时写入 localStorage，刷新后保持解锁
 */
export function LockedChannelCard({
  className,
  name = DEFAULT_CHANNEL_NAME,
  url = DEFAULT_CHANNEL_URL,
  storageKey = DEFAULT_STORAGE_KEY,
  lang = "zh",
}: LockedChannelCardProps) {
  const isEn = lang === "en";
  const t = (zh: string, en: string) => (isEn ? en : zh);
  const [open, setOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [pw, setPw] = useState("");
  const [hint, setHint] = useState<"" | "wrong">("");
  const [shake, setShake] = useState(false);
  const [mounted, setMounted] = useState(false);
  const hintTimerRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 客户端挂载标记——createPortal 需要 document.body，仅在客户端可用
  useEffect(() => {
    setMounted(true);
  }, []);

  // 初始读 localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (localStorage.getItem(storageKey) === "1") {
        setUnlocked(true);
      }
    } catch {
      // localStorage 不可用时静默降级
    }
  }, []);

  // 打开弹卡时自动聚焦输入框
  useEffect(() => {
    if (open && !unlocked && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [open, unlocked]);

  // ESC 关闭
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  // 滚动锁定
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleUnlock = () => {
    if (pw === PASSWORD) {
      setUnlocked(true);
      setHint("");
      setShake(false);
      setOpen(false);
      try {
        localStorage.setItem(storageKey, "1");
      } catch {
        // 忽略
      }
    } else {
      setHint("wrong");
      setShake(true);
      setPw("");
      inputRef.current?.focus();
      // 180ms 后回正色, 与 CSS transition 配合
      window.setTimeout(() => setShake(false), 180);
      // 3 秒后自动收起气泡
      if (hintTimerRef.current !== null) {
        window.clearTimeout(hintTimerRef.current);
      }
      hintTimerRef.current = window.setTimeout(() => {
        setHint("");
        hintTimerRef.current = null;
      }, 3000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleUnlock();
  };

  const handleClose = () => {
    setOpen(false);
    setPw("");
    setHint("");
    setShake(false);
    if (hintTimerRef.current !== null) {
      window.clearTimeout(hintTimerRef.current);
      hintTimerRef.current = null;
    }
  };

  // 占位块未解锁状态被点击 → 弹卡输入密码
  const handleLockedClick = () => {
    setOpen(true);
  };

  // 重新上锁（清掉 localStorage）
  const handleReLock = () => {
    setUnlocked(false);
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // 忽略
    }
  };

  return (
    <span className={`${styles["channel-locked-wrap"]} ${className ?? ""}`}>
      {/* 渲染在正文里的部分 */}
      {unlocked ? (
        // 已解锁：直接显示频道名 + 跳转链接
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles["channel-name-link"]}
          title={t("前往 YouTube 频道", "Open YouTube channel")}
        >
          {name}<span className={styles["channel-name-arrow"]}>↗</span>
        </a>
      ) : (
        // 未解锁：等宽灰色遮罩块（视觉宽度对齐 5 个汉字）
        <span
          className={styles["channel-locked-placeholder"]}
          onClick={handleLockedClick}
          role="button"
          aria-label={t("点击解锁频道名", "Click to unlock channel name")}
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleLockedClick(); }}
          suppressHydrationWarning
        >
          <span aria-hidden="true" className={styles["channel-locked-text"]}>
            {name}<span>?</span>
          </span>
        </span>
      )}

      {/* 弹卡（仅未解锁时需要）。
          注意：弹卡包含 <div>/<button> 等块级元素，若直接渲染在 <p> 里会被浏览器
          自动闭合 <p>，触发 hydration 错误。改用 createPortal 渲染到 document.body。 */}
      {open && !unlocked && mounted && createPortal(
        <div
          className={styles["channel-overlay"]}
          onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
          role="dialog"
          aria-modal="true"
          aria-label={t("解锁频道", "Unlock channel")}
        >
          <div className={styles["channel-card"]}>
            {/* 关闭按钮 */}
            <button
              className={styles["channel-close"]}
              onClick={handleClose}
              aria-label={t("关闭", "Close")}
            >
              ×
            </button>

            <div className={styles["channel-lock-wrap"]} aria-hidden="true">
              {/* 手绘水墨风锁：双笔触叠加 (深主笔 + 浅副笔) + 笔锋收笔 */}
              <svg
                className={styles["channel-lock-art"]}
                width="96"
                height="96"
                viewBox="0 0 96 96"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* 锁体主笔：略带抖动的矩形，起笔重、收笔略飘 */}
                <path
                  d="M22 50 Q22 48 24 48 H72 Q74 48 74 50 V78 Q74 80 72 80 H24 Q22 80 22 78 Z"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* 锁梁主笔：从左侧起笔、弧顶略偏右，收笔向下 */}
                <path
                  d="M32 48 V36 Q32 18 48 18 Q64 18 64 36 V48"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                {/* 锁梁起笔加重（左端小圆点） */}
                <circle cx="32" cy="48" r="1.4" fill="currentColor" />
                {/* 钥匙孔：圆 + 下方小竖线 */}
                <circle
                  cx="48"
                  cy="62"
                  r="3"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  fill="none"
                />
                <path
                  d="M48 65 L48 72"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className={styles["channel-pw-group"]}>
              <input
                id="channel-pw"
                ref={inputRef}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={8}
                className={styles["channel-pw-input"]}
                value={pw}
                onChange={(e) => {
                  const next = e.target.value.replace(/\D/g, "");
                  setPw(next);
                  if (hint === "wrong") setHint("");
                }}
                onKeyDown={handleKeyDown}
                placeholder={t("请输入密码", "Enter password")}
                aria-label={t("请输入密码", "Enter password")}
                autoComplete="off"
                spellCheck={false}
              />
              <span
                role="alert"
                className={`${styles["channel-pw-hint"]} ${hint === "" ? styles["hidden"] : styles["visible"]}`}
                aria-live="polite"
              >
                {t("密码错误", "Wrong password")}
              </span>
            </div>
            <button
              onClick={handleUnlock}
              className={styles["channel-pw-submit"]}
              data-shake={shake ? "true" : "false"}
            >
              {t("确认", "Confirm")}
            </button>
          </div>
        </div>,
        document.body
      )}
    </span>
  );
}

/** 重置按钮：放在页面上让用户能主动清掉 localStorage */
export function ChannelUnlockReset({
  storageKey = DEFAULT_STORAGE_KEY,
  lang = "zh",
}: {
  storageKey?: string;
  lang?: "zh" | "en";
}) {
  const isEn = lang === "en";
  const t = (zh: string, en: string): string => (isEn ? en : zh);
  return (
    <button
      onClick={() => {
        try { localStorage.removeItem(storageKey); } catch {}
        window.location.reload();
      }}
      style={{
        background: "none",
        border: "none",
        cursor: 'url("/cursor/hand.png") 1 1, pointer',
        fontFamily: "var(--font-mono)",
        fontSize: "0.72rem",
        color: "var(--color-ink-soft)",
        textDecoration: "underline",
        padding: "0.25rem 0",
        letterSpacing: "0.05em",
        opacity: 0.7,
      }}
      title={t("清掉已解锁状态，刷新后会再次锁定", "Clear the unlocked state; page will be locked again after reload")}
    >
      {t("重新上锁", "Re-lock")}
    </button>
  );
}