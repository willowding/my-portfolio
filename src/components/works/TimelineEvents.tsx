"use client";

import { useState } from "react";
import type { TimelineEvent } from "@/data/picreview";
import styles from "./TimelineEvents.module.css";

interface TimelineEventsProps {
  events: readonly TimelineEvent[];
  reasonLabel?: string;
  solutionLabel?: string;
  outcomeLabel?: string;
}

function UserEvent({
  role,
  cls,
}: {
  dateDisplay: string;
  role: string;
  cls: (k: string) => string;
}) {
  return (
    <div className={cls("te-event--user")}>
      {/* 单色细线条 person icon — 避免 emoji，与全站 SVG 风格一致 */}
      <svg className={cls("te-icon")} viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="8" r="3.6" />
        <path d="M5 20 C 6 16, 9 14, 12 14 C 15 14, 18 16, 19 20" />
      </svg>
      <span className={cls("te-user-role")}>{role}</span>
    </div>
  );
}

function FeatureEvent({
  title,
  reason,
  solution,
  outcome,
  reasonLabel = "起因",
  solutionLabel = "措施",
  outcomeLabel = "效果",
  cls,
}: {
  dateDisplay: string;
  title: string;
  reason: string;
  solution: string;
  outcome: string;
  reasonLabel?: string;
  solutionLabel?: string;
  outcomeLabel?: string;
  cls: (k: string) => string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cls("te-event--feature")}>
      <div className={cls("te-feature-header")} onClick={() => setOpen((v) => !v)}>
        {/* 单色细线条 wrench icon — 避免 emoji，与全站 SVG 风格一致 */}
        <svg className={cls("te-icon")} viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M14.5 4.5 L 19.5 9.5" />
          <path d="M5 19 L 11 13" />
          <path d="M14.5 4.5 a 3.5 3.5 0 1 1 5 5 L 16 13 L 11 18 a 2.5 2.5 0 0 1 -3.5 -3.5 L 14.5 4.5 z" />
        </svg>
        <span className={cls("te-feature-title")}>{title}</span>
        <span className={`${cls("te-chevron")}${open ? " " + cls("te-chevron--open") : ""}`}>
          ▾
        </span>
      </div>

      {open && (
        <div className={cls("te-feature-detail")}>
          {reason && (
            <div className={cls("te-detail-row")}>
              <span className={cls("te-detail-label")}>{reasonLabel}</span>
              <span className={cls("te-detail-body")}>{reason}</span>
            </div>
          )}
          {solution && (
            <div className={cls("te-detail-row")}>
              <span className={cls("te-detail-label")}>{solutionLabel}</span>
              <span className={cls("te-detail-body")}>{solution}</span>
            </div>
          )}
          {outcome && (
            <div className={cls("te-detail-row")}>
              <span className={cls("te-detail-label")}>{outcomeLabel}</span>
              <span className={cls("te-detail-body")}>{outcome}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function TimelineEvents({
  events,
  reasonLabel,
  solutionLabel,
  outcomeLabel,
}: TimelineEventsProps) {
  // CSS Module 的 key 会被 hash；用 cls() 帮助子组件拿类名
  const cls = (key: string) => (styles as Record<string, string>)[key] ?? key;

  // Group by date, preserve insertion order within same date
  const groups = new Map<string, TimelineEvent[]>();
  for (const e of events) {
    const g = groups.get(e.date) ?? [];
    g.push(e);
    groups.set(e.date, g);
  }

  return (
    <div className={cls("te-timeline")}>
      {Array.from(groups.entries()).map(([date, items]) => {
        const dateDisplay = items[0]?.dateDisplay ?? date;
        const userItems = items.filter((i) => i.kind === "user");
        const featItems = items.filter((i) => i.kind === "feature");

        return (
          <div key={date} className={cls("te-date-group")}>
            {/* 左侧日期 rail */}
            <div className={cls("te-date-rail")}>
              <span className={cls("te-date-badge")}>{dateDisplay}</span>
            </div>

            {/* 右侧事件列表 */}
            <div className={cls("te-events")}>
              {userItems.map((item, i) =>
                item.kind === "user" ? (
                  <UserEvent
                    key={`${date}-u-${i}`}
                    dateDisplay={item.dateDisplay}
                    role={item.role}
                    cls={cls}
                  />
                ) : null
              )}
              {featItems.map((item, i) =>
                item.kind === "feature" ? (
                  <FeatureEvent
                    key={`${date}-f-${i}`}
                    dateDisplay={item.dateDisplay}
                    title={item.title}
                    reason={item.reason}
                    solution={item.solution}
                    outcome={item.outcome}
                    reasonLabel={reasonLabel}
                    solutionLabel={solutionLabel}
                    outcomeLabel={outcomeLabel}
                    cls={cls}
                  />
                ) : null
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
