"use client";

import { useState } from "react";
import type { youtube as Yt } from "@/data/youtube";
import { YoutubeHero } from "./YoutubeHero";
import { LockedChannelCard } from "./LockedChannelCard";
import styles from "./YoutubeDetail.module.css";

type YoutubeData = (typeof Yt)[keyof typeof Yt];
type RecoveryAction = {
  label: string;
  label_en: string;
  body_zh: string;
  body_en: string;
  growth_zh: string;
  growth_en: string;
  /** 可选：富文本段落；优先于 body_* 渲染。
   *  二维数组：每个外层元素是一段，每段含 0..N 个带可选脚注的文本片。 */
  rich_zh?: { text: string; date?: string }[][];
  rich_en?: { text: string; date?: string }[][];
};

interface YoutubeDetailProps {
  data: {
    name: string;
    name_en: string;
    metrics: {
      recoveryDays: string;
      ctrPeak: string;
      monthlyViewsBefore: string;
      monthlyViewsAfter: string;
      monthlyExposureBefore: string;
      monthlyExposureAfter: string;
      totalViews60d: string;
      adRevenue: string;
      primaryChannelVideos: number;
      primaryChannelTotalViews: number;
      primaryChannelAvgViews: number;
      primaryChannelMaxViews: number;
      primaryChannelEarlyAvg: number;
      primaryChannelLateAvg: number;
      primaryChannelGrowthMultiple: string;
      monthlyViewsMultiple: string;
      monthlyExposureMultiple: string;
    };
    context: { zh: string[]; en: string[] };
    recoveryActions: RecoveryAction[];
    dualChannel: { label: string; label_en: string; body_zh: string; body_en: string };
  };
  lang: "zh" | "en";
  projectLabel?: string;
}

function MetricCard({ value, label }: { value: string; label: string }) {
  return (
    <div className={styles["yt-metric"]}>
      <div className={styles["yt-metric-value"]}>{value}</div>
      <div className={styles["yt-metric-label"]}>{label}</div>
    </div>
  );
}

function renderBodyWithStrong(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

function RecoveryActionRow({
  action,
  lang,
  alwaysOpen,
}: {
  action: RecoveryAction;
  lang: "zh" | "en";
  alwaysOpen: boolean;
}) {
  const [open, setOpen] = useState(alwaysOpen);
  const label = lang === "zh" ? action.label : action.label_en;
  const body = lang === "zh" ? action.body_zh : action.body_en;
  const rich = lang === "zh" ? action.rich_zh : action.rich_en;

  return (
    <div className={styles["yt-work-row"]}>
      <div className={styles["yt-work-row-main"]}>
        <h4 className={styles["yt-work-label-static"]}>{label}</h4>
        {rich ? (
          <div className={styles["yt-work-body"]}>
            {rich.map((para, pi) => (
              <p key={pi} className={styles["yt-work-body-line"]}>
                {para.map((seg, si) => (
                  <span key={si}>
                    {renderBodyWithStrong(seg.text)}
                    {seg.date && (
                      <span className={styles["yt-work-footnote"]}>（{seg.date}）</span>
                    )}
                  </span>
                ))}
              </p>
            ))}
          </div>
        ) : (
          <p className={styles["yt-work-body"]}>{renderBodyWithStrong(body)}</p>
        )}
      </div>
    </div>
  );
}

function fmtNumber(n: number): string {
  return n.toLocaleString();
}

export function YoutubeDetail({ data, lang, projectLabel = "" }: YoutubeDetailProps) {
  const dualChannel = lang === "zh"
    ? { label: data.dualChannel.label, body: data.dualChannel.body_zh }
    : { label: data.dualChannel.label_en, body: data.dualChannel.body_en };

  const m = data.metrics;
  const secReady = m.primaryChannelVideos > 0;

  return (
    <div className={styles["yt-page"]}>
      <YoutubeHero
        name={lang === "zh" ? data.name : data.name_en}
        name_en={data.name_en}
        projectLabel={projectLabel}
      />

      {/* 01 接手背景 */}
      <section id="sec-context" className={styles["yt-section"]}>
        <span id="sec-context-title" className={styles["yt-section-eyebrow"]}>{lang === "zh" ? "~ 01 接手背景 ~" : "~ 01 Handover context ~"}</span>
        <div className={styles["yt-context"]}>
          {lang === "zh" ? (
            <>
              {/* 段 1：频道定位 + 4 个可点击 Tag + 用户画像 + 核心需求 */}
              <p>
                主频道「<LockedChannelCard lang={lang} />」定位为
                <strong>泛华语影视音 OST</strong>（<span className={styles["yt-tag-list"]}>
                  <a className={styles["yt-tag-link"]} href="https://www.youtube.com/results?search_query=%E5%8F%A4%E9%A2%A8%E6%AD%8C%E6%9B%B2" target="_blank" rel="noopener noreferrer">
                    <span className={styles["yt-tag-han"]}>#古風歌曲</span>
                  </a>
                  <a className={styles["yt-tag-link"]} href="https://www.youtube.com/results?search_query=cdrama+ost" target="_blank" rel="noopener noreferrer">
                    <span className={styles["yt-tag-en"]}>#cdrama ost</span>
                  </a>
                  <a className={styles["yt-tag-link"]} href="https://www.youtube.com/results?search_query=%E4%B8%AD%E5%9B%BD%E3%83%89%E3%83%A9%E3%83%9E%E9%9F%B3%E6%A5%BD" target="_blank" rel="noopener noreferrer">
                    <span className={styles["yt-tag-jp"]}>#中国ドラマ音楽</span>
                  </a>
                  <a className={styles["yt-tag-link"]} href="https://www.youtube.com/results?search_query=%EC%A4%91%EA%B5%AD%EB%93%9C%EB%9D%BC%EB%A7%88+ost" target="_blank" rel="noopener noreferrer">
                    <span className={styles["yt-tag-kr"]}>#중국드라마</span>
                    <span className={styles["yt-tag-en"]}> ost</span>
                  </a>
                </span>），
                用户画像为 18 岁以上泛华语影视音受众，
                用户核心需求为 OST 沉浸式体验 & 中文学习。
              </p>
              {/* 段 2：停更 → 恢复 */}
              <p>
                主频道自 2025 年 10 月 29 日停更，至 11 月 17 日恢复更新，
                期间断更 <strong>19 天</strong>，观看次数、订阅人数大幅流失。
              </p>
              {/* 段 3：接手后 133 天 / 132 条 */}
              <p>
                接手后运营主频道自 2025 年 11 月 17 日至 2026 年 03 月 30 日共
                <strong> 133 天</strong>，累计产出 <strong>132 条视频</strong>（日均约 1 条）。
              </p>
            </>
          ) : (
            <>
              {/* 段 1：频道定位 + 4 个可点击 Tag + 用户画像 + 核心需求 */}
              <p>
                Primary channel <LockedChannelCard lang={lang} /> targets
                <strong> Pan-Chinese drama/OST </strong>(<span className={styles["yt-tag-list"]}>
                  <a className={styles["yt-tag-link"]} href="https://www.youtube.com/results?search_query=%E5%8F%A4%E9%A2%A8%E6%AD%8C%E6%9B%B2" target="_blank" rel="noopener noreferrer">
                    <span className={styles["yt-tag-han"]}>#古風歌曲</span>
                  </a>
                  <a className={styles["yt-tag-link"]} href="https://www.youtube.com/results?search_query=cdrama+ost" target="_blank" rel="noopener noreferrer">
                    <span className={styles["yt-tag-en"]}>#cdrama ost</span>
                  </a>
                  <a className={styles["yt-tag-link"]} href="https://www.youtube.com/results?search_query=%E4%B8%AD%E5%9B%BD%E3%83%89%E3%83%A9%E3%83%9E%E9%9F%B3%E6%A5%BD" target="_blank" rel="noopener noreferrer">
                    <span className={styles["yt-tag-jp"]}>#中国ドラマ音楽</span>
                  </a>
                  <a className={styles["yt-tag-link"]} href="https://www.youtube.com/results?search_query=%EC%A4%91%EA%B5%AD%EB%93%9C%EB%9D%BC%EB%A7%88+ost" target="_blank" rel="noopener noreferrer">
                    <span className={styles["yt-tag-kr"]}>#중국드라마</span>
                    <span className={styles["yt-tag-en"]}> ost</span>
                  </a>
                </span>),
                audience: Pan-Chinese drama/OST viewers aged 18+,
                core need: immersive OST listening & Chinese-language learning.
              </p>
              {/* 段 2：停更 → 恢复 */}
              <p>
                The primary channel was inactive from October 29, 2025 until November 17, 2025 —
                a <strong>19-day hiatus</strong> that caused a sharp drop in views and subscribers.
              </p>
              {/* 段 3：接手后 133 天 / 132 条 */}
              <p>
                Operated from November 17, 2025 to March 30, 2026 — a total of
                <strong> 133 days</strong>, publishing <strong>132 videos</strong> (≈1 per day).
              </p>
            </>
          )}
        </div>
      </section>

      {/* 02 运营策略 — 4 项动作 */}
      <section id="sec-strategy" className={styles["yt-section"]}>
        <span id="sec-strategy-title" className={styles["yt-section-eyebrow"]}>{lang === "zh" ? "~ 02 运营策略 ~" : "~ 02 Strategy ~"}</span>
        <div className={styles["yt-work-areas"]}>
          {data.recoveryActions.map((action, i) => (
            <RecoveryActionRow key={i} action={action} lang={lang} alwaysOpen={true} />
          ))}
        </div>
      </section>

      {/* 03 数据成果 — 实习期间主频道「水月琴音」数据 */}
      <section id="sec-results" className={styles["yt-section"]}>
        <span id="sec-results-title" className={styles["yt-section-eyebrow"]}>{lang === "zh" ? "~ 03 数据成果 ~" : "~ 03 Results ~"}</span>

        <div className={styles["yt-subblock"]}>
          {secReady ? (
            <>
              {/* 第一排 4 个：累计 / 平均 / 最高 等基础产出 */}
              <div className={styles["yt-metrics-grid"]}>
                <MetricCard
                  value={fmtNumber(m.primaryChannelVideos)}
                  label={lang === "zh" ? "累计视频数量" : "Videos Published"}
                />
                <MetricCard
                  value={fmtNumber(m.primaryChannelTotalViews)}
                  label={lang === "zh" ? "累计观看次数" : "Total Views"}
                />
                <MetricCard
                  value={fmtNumber(m.primaryChannelAvgViews)}
                  label={lang === "zh" ? "平均观看次数" : "Avg Views / Video"}
                />
                <MetricCard
                  value={fmtNumber(m.primaryChannelMaxViews)}
                  label={lang === "zh" ? "最高观看次数" : "Max Views"}
                />
              </div>

              {/* 第二排 2 个：接手前后倍数。
   每张卡宽 = 第一排 2 卡 + 1 gap，通过 flex 容器实现。 */}
              <div className={styles["yt-metrics-grid-2col"]}>
                <MetricCard
                  value={m.monthlyViewsMultiple}
                  label={
                    lang === "zh"
                      ? "接手前后月观看倍数（1.9万→4万）"
                      : "Monthly Views Multiple (19k→40k)"
                  }
                />
                <MetricCard
                  value={m.monthlyExposureMultiple}
                  label={
                    lang === "zh"
                      ? "接手前后月曝光倍数（29.7万→74.4万）"
                      : "Monthly Impressions Multiple (297k→744k)"
                  }
                />
              </div>
            </>
          ) : (
            <div className={styles["yt-placeholder"]}>
              {lang === "zh" ? "（暂无数据）" : "(no data)"}
            </div>
          )}
        </div>
      </section>

      {/* 04 双频道协同 */}
      <section id="sec-dual" className={styles["yt-section"]}>
        <span id="sec-dual-title" className={styles["yt-section-eyebrow"]}>~ 04 {dualChannel.label} ~</span>
        <div className={styles["yt-context"]}>
          {lang === "zh" ? (
            <>
              {/* 段 1：频道定位 + 5 个可点击 Tag + 用户画像 + 核心需求 */}
              <p>
                第二频道「
                <LockedChannelCard
                  name="净心音舍"
                  url="https://www.youtube.com/@SereneLo-fiHouse"
                  lang={lang}
                />
                」定位为
                <strong>国风纯音乐</strong>（<span className={styles["yt-tag-list"]}>
                  <a className={styles["yt-tag-link"]} href="https://www.youtube.com/results?search_query=%E5%8F%A4%E9%A3%8E%E9%9F%B3%E4%B9%90" target="_blank" rel="noopener noreferrer">
                    <span className={styles["yt-tag-han"]}>#古风音乐</span>
                  </a>
                  <a className={styles["yt-tag-link"]} href="https://www.youtube.com/results?search_query=%E5%9B%BD%E9%A3%8E" target="_blank" rel="noopener noreferrer">
                    <span className={styles["yt-tag-han"]}>#国风</span>
                  </a>
                  <a className={styles["yt-tag-link"]} href="https://www.youtube.com/results?search_query=%E7%BA%AF%E9%9F%B3%E4%B9%90" target="_blank" rel="noopener noreferrer">
                    <span className={styles["yt-tag-han"]}>#纯音乐</span>
                  </a>
                  <a className={styles["yt-tag-link"]} href="https://www.youtube.com/results?search_query=chineseinstrumental" target="_blank" rel="noopener noreferrer">
                    <span className={styles["yt-tag-en"]}>#chineseinstrumental</span>
                  </a>
                  <a className={styles["yt-tag-link"]} href="https://www.youtube.com/results?search_query=meditationmusic" target="_blank" rel="noopener noreferrer">
                    <span className={styles["yt-tag-en"]}>#meditationmusic</span>
                  </a>
                </span>），
                用户画像为热爱国风器乐与东方美学专注需求的功能性音乐受众，
                用户核心需求为国风纯音乐视听解压 & 场景化伴随（学习/冥想）。
              </p>
              {/* 段 2：现状 */}
              <p>
                第二频道订阅人数增长长期停滞，观看次数维持在 200–500 低位，
                距创收标准仍有较大差距。
              </p>
              {/* 段 3：洞察 + 视频范式（去同质化） */}
              <p>
                接手后洞察到封面风格陷入高度同质化、缺乏辨识度，而同赛道高表现账号的差异化封面竞争密度较低。
                参考同赛道高表现账号推进封面的「去同质化」重构，并以此沉淀第二频道的
                <strong>高播放视频范式</strong>。
              </p>
            </>
          ) : (
            <>
              {/* 段 1：频道定位 + 5 个可点击 Tag + 用户画像 + 核心需求 */}
              <p>
                Secondary channel <LockedChannelCard
                  name="净心音舍"
                  url="https://www.youtube.com/@SereneLo-fiHouse"
                  lang={lang}
                /> targets
                <strong> Chinese-style instrumental music </strong>(<span className={styles["yt-tag-list"]}>
                  <a className={styles["yt-tag-link"]} href="https://www.youtube.com/results?search_query=%E5%8F%A4%E9%A3%8E%E9%9F%B3%E4%B9%90" target="_blank" rel="noopener noreferrer">
                    <span className={styles["yt-tag-han"]}>#古风音乐</span>
                  </a>
                  <a className={styles["yt-tag-link"]} href="https://www.youtube.com/results?search_query=%E5%9B%BD%E9%A3%8E" target="_blank" rel="noopener noreferrer">
                    <span className={styles["yt-tag-han"]}>#国风</span>
                  </a>
                  <a className={styles["yt-tag-link"]} href="https://www.youtube.com/results?search_query=%E7%BA%AF%E9%9F%B3%E4%B9%90" target="_blank" rel="noopener noreferrer">
                    <span className={styles["yt-tag-han"]}>#纯音乐</span>
                  </a>
                  <a className={styles["yt-tag-link"]} href="https://www.youtube.com/results?search_query=chineseinstrumental" target="_blank" rel="noopener noreferrer">
                    <span className={styles["yt-tag-en"]}>#chineseinstrumental</span>
                  </a>
                  <a className={styles["yt-tag-link"]} href="https://www.youtube.com/results?search_query=meditationmusic" target="_blank" rel="noopener noreferrer">
                    <span className={styles["yt-tag-en"]}>#meditationmusic</span>
                  </a>
                </span>),
                audience: listeners seeking Chinese-style instrumental music and Eastern aesthetic focus,
                core need: audiovisual decompression & scene-based ambience (study / meditation).
              </p>
              {/* 段 2：现状 */}
              <p>
                Subscriber growth on the secondary channel had long stalled,
                with views stuck in a low band of 200–500 — far below the ad-revenue threshold.
              </p>
              {/* 段 3：洞察 + 视频范式 */}
              <p>
                Diagnosed that thumbnails had drifted into heavy visual homogenization, hurting distinctiveness,
                while differentiated thumbnails from high-performing peers in the niche remained an under-used lane.
                Pivoted toward thumbnail de-homogenization and codified an
                <strong> outlier-video playbook </strong>
                for the secondary channel.
              </p>
            </>
          )}
        </div>

        {/* 04 数据卡片 — 第二频道阶段内最佳视频 4 项指标 */}
        <div className={styles["yt-subblock"]}>
          <div className={styles["yt-metrics-grid-3col"]}>
            <MetricCard
              value="7,206"
              label={lang === "zh" ? "单条视频观看次数（比平时多 6,626）" : "Views / Video (+6,626 vs. baseline)"}
            />
            <MetricCard
              value="6.2%"
              label={lang === "zh" ? "该视频 CTR" : "Video CTR"}
            />
            <MetricCard
              value="+80"
              label={lang === "zh" ? "单条视频带动订阅人数增长" : "Subscribers Gained / Video"}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
