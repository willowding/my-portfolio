"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "@/components/works/YoutubeDetail.module.css";

const PASSWORD = "040116";

interface LockedContactCardProps {
  value: string;
  label: string;
  storageKey: string;
  lang?: "zh" | "en";
}

export function LockedContactCard({ value, label, storageKey, lang = "zh" }: LockedContactCardProps) {
  const isEn = lang === "en";
  const t = (zh: string, en: string) => (isEn ? en : zh);
  const [open, setOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [pw, setPw] = useState("");
  const [hint, setHint] = useState<"" | "wrong">("");
  const [shake, setShake] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const hintTimerRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (localStorage.getItem(storageKey) === "1") setUnlocked(true);
    } catch {}
  }, [storageKey]);

  useEffect(() => {
    if (open && !unlocked && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [open, unlocked]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleUnlock = () => {
    if (pw === PASSWORD) {
      setUnlocked(true);
      setHint("");
      setShake(false);
      setOpen(false);
      try { localStorage.setItem(storageKey, "1"); } catch {}
    } else {
      setHint("wrong");
      setShake(true);
      setPw("");
      inputRef.current?.focus();
      window.setTimeout(() => setShake(false), 180);
      if (hintTimerRef.current !== null) window.clearTimeout(hintTimerRef.current);
      hintTimerRef.current = window.setTimeout(() => {
        setHint("");
        hintTimerRef.current = null;
      }, 3000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter") handleUnlock(); };

  const handleLockedClick = () => setOpen(true);
  const handleClose = () => { setOpen(false); setPw(""); setHint(""); setShake(false); };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = value;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); setCopied(true); window.setTimeout(() => setCopied(false), 1500); } catch {}
      document.body.removeChild(ta);
    }
  };

  return (
    <span className={`${styles["channel-locked-wrap"]} ${styles["contact-locked-wrap"] ?? ""}`}>
      {unlocked ? (
        <span className={styles["contact-locked-value"]}>
          <span className={styles["contact-locked-text"]}>{value}</span>
          <button
            type="button"
            onClick={handleCopy}
            className={styles["contact-locked-copy"]}
            aria-label={`复制${label}`}
            title="复制"
          >
            {copied ? "✓ 已复制" : "复制"}
          </button>
        </span>
      ) : (
        <span
          className={styles["channel-locked-placeholder"]}
          onClick={handleLockedClick}
          role="button"
          aria-label={t(`点击解锁 ${label}`, `Click to unlock ${label}`)}
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleLockedClick(); }}
          suppressHydrationWarning
        >
          <span aria-hidden="true" className={styles["channel-locked-text"]}>
            {value}<span>?</span>
          </span>
        </span>
      )}

      {open && !unlocked && mounted && createPortal(
        <div
          className={styles["channel-overlay"]}
          onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
          role="dialog"
          aria-modal="true"
          aria-label={t(`解锁 ${label}`, `Unlock ${label}`)}
        >
          <div className={styles["channel-card"]}>
            <button className={styles["channel-close"]} onClick={handleClose} aria-label={t("关闭", "Close")}>×</button>

            <div className={styles["channel-lock-wrap"]} aria-hidden="true">
              <svg className={styles["channel-lock-art"]} width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 50 Q22 48 24 48 H72 Q74 48 74 50 V78 Q74 80 72 80 H24 Q22 80 22 78 Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" fill="none" />
                <path d="M32 48 V36 Q32 18 48 18 Q64 18 64 36 V48" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <circle cx="32" cy="48" r="1.4" fill="currentColor" />
                <circle cx="48" cy="62" r="3" stroke="currentColor" strokeWidth="1.6" fill="none" />
                <path d="M48 65 L48 72" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>

            <div className={styles["channel-pw-group"]}>
              <input
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