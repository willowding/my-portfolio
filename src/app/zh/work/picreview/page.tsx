import type { Metadata } from "next";
import { NavBar } from "@/components/NavBar";
import { PicreviewHero } from "@/components/works/PicreviewHero";
import { TimelineEvents } from "@/components/works/TimelineEvents";
import { DauChart, type DauPoint, type DauUser } from "@/components/works/DauChart";
import { StorageGrowthChart, type StoragePoint } from "@/components/works/StorageGrowthChart";
import { SectionTOC } from "@/components/works/SectionTOC";
import { picreview } from "@/data/picreview";
import { getProfile, getProjectLabel } from "@/lib/profile";
import { promises as fs } from "fs";
import path from "path";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "PicReview · Willow Ding",
  description: "小型团队图片审核工具 PicReview · 需求来源、功能介绍、迭代时间轴、离职数据、日活折线图",
};

export default async function PicreviewPage() {
  const dauPath = path.join(process.cwd(), "data", "picreview-dau.json");
  const storagePath = path.join(process.cwd(), "data", "picreview-storage-raw.json");

  const dau: DauPoint[] = await fs
    .readFile(dauPath, "utf-8")
    .then((raw) => JSON.parse(raw.replace(/^\uFEFF/, "")) as DauPoint[])
    .catch(() => [] as DauPoint[]);

  const storageRows = await fs
    .readFile(storagePath, "utf-8")
    .then(
      (raw) =>
        JSON.parse(raw.replace(/^\uFEFF/, "")) as Array<{
          d: string;
          c: number;
        }>,
    )
    .catch(() => [] as Array<{ d: string; c: number }>);

  const dailySum = new Map<string, number>();
  for (const r of storageRows) {
    dailySum.set(r.d, (dailySum.get(r.d) ?? 0) + r.c);
  }
  const sortedDates = [...dailySum.keys()].sort();
  let running = 0;
  const growth: StoragePoint[] = sortedDates.map((date) => {
    running += dailySum.get(date) ?? 0;
    return { date, storedCount: running };
  });

  const profile = await getProfile();
  const labelInfo = getProjectLabel(profile.projects, picreview.name);
  const projectLabel = labelInfo
    ? `${String(labelInfo.index).padStart(2, "0")} / ${String(labelInfo.total).padStart(2, "0")}`
    : "";

  return (
    <>
      <NavBar lang="zh" />
      <main className={styles["pr-page"]} suppressHydrationWarning>
        <div className={styles["pr-layout"]}>
          <div className={styles["pr-content"]}>
            <div className="container-narrow">
              <PicreviewHero
                name={picreview.name}
                projectLabel={projectLabel}
                demoUrl={picreview.demoUrlZh}
              />

              {/* §1 需求来源 */}
              <section id="sec-demand" className={styles["pr-section"]}>
                <span id="sec-demand-title" className={styles["pr-section-eyebrow"]}>
                  ~ <span className={styles["pr-section-eyebrow-num"]}>01</span> 需求来源 ~
                </span>
                {picreview.demandSource.background.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
                <div className={styles["pr-frictions"]}>
                  {picreview.demandSource.frictions.map((f, i) => (
                    <div key={i} className={styles["pr-friction-card"]}>
                      <div className={styles["pr-friction-title"]}>{f.title}</div>
                      <p className={styles["pr-friction-body"]}>{f.body}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* §2 功能介绍 */}
              <section id="sec-features" className={styles["pr-section"]}>
                <span id="sec-features-title" className={styles["pr-section-eyebrow"]}>
                  ~ <span className={styles["pr-section-eyebrow-num"]}>02</span> 功能介绍 ~
                </span>

                <div className={styles["pr-loop-wrap"]}>
                  <div className={styles["pr-loop-frame-outer"]}>
                    <iframe
                      src={picreview.demoUrlZh}
                      className={styles["pr-loop-frame"]}
                      title="PicReview 演示"
                      loading="lazy"
                    />
                  </div>
                  <div className={styles["pr-loop-note"]}>
                    <p>本 PicReview Demo 仅为功能演示，所有数据保存在浏览器本地。</p>
                    <p>正式版 PicReview 基于 Supabase（PostgreSQL + Auth + Realtime）实现多人实时协作与权限管理。</p>
                  </div>
                </div>

                <div className={styles["pr-features-flow"]}>
                  {picreview.features.map((text, i) => (
                    <div key={i} className={styles["pr-feature-row"]}>
                      <span className={styles["pr-feature-num"]}>({i + 1})</span>
                      <p className={styles["pr-feature-text"]}>{text}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* §3 迭代记录 */}
              <section id="sec-timeline" className={styles["pr-section"]}>
                <span id="sec-timeline-title" className={styles["pr-section-eyebrow"]}>
                  ~ <span className={styles["pr-section-eyebrow-num"]}>03</span> 迭代纪录 ~
                </span>
                <TimelineEvents
                  events={picreview.timelineEvents}
                  reasonLabel="起因"
                  solutionLabel="措施"
                  outcomeLabel="效果"
                />
              </section>

              {/* §4 项目数据 */}
              <section id="sec-data" className={styles["pr-section"]}>
                <span id="sec-data-title" className={styles["pr-section-eyebrow"]}>
                  ~ <span className={styles["pr-section-eyebrow-num"]}>04</span> 项目数据 ~
                </span>

                <div className={styles["pr-subsection"]}>
                  <h3 className={styles["pr-subsection-heading"]}>
                    实习期间项目数据汇总（5/13 – 6/1）
                  </h3>

                  <div className={styles["pr-retire-stats"]}>
                    <div className={styles["pr-retire-stat"]}>
                      <div className={styles["pr-retire-stat-value"]}>7</div>
                      <span className={styles["pr-retire-stat-label"]}>日活用户</span>
                    </div>
                    <div className={styles["pr-retire-stat"]}>
                      <div className={styles["pr-retire-stat-value"]}>7</div>
                      <span className={styles["pr-retire-stat-label"]}>活跃项目</span>
                    </div>
                    <div className={styles["pr-retire-stat"]}>
                      <div className={styles["pr-retire-stat-value"]}>1,674</div>
                      <span className={styles["pr-retire-stat-label"]}>累计审核图片</span>
                    </div>
                  </div>
                </div>

                <div className={styles["pr-subsection"]}>
                  <h3 className={styles["pr-subsection-heading"]}>
                    累计审核图片增长曲线（5/26 - 7/15）
                  </h3>
                  <StorageGrowthChart
                    data={growth}
                    retiringDate={picreview.retiringDate}
                  />
                </div>
              </section>

              {/* §5 技术栈 */}
              <section id="sec-tech" className={styles["pr-section"]}>
                <span id="sec-tech-title" className={styles["pr-section-eyebrow"]}>
                  ~ <span className={styles["pr-section-eyebrow-num"]}>05</span> 技术栈 ~
                </span>
                <div className={styles["pr-tech-groups"]}>
                  <div className={styles["pr-tech-group"]}>
                    <div className={styles["pr-tech-group-label"]}>前端</div>
                    <div className={styles["pr-tech-group-chips"]}>
                      {picreview.tech.frontend.map((t, i) => (
                        <span key={i} className={styles["pr-tech-chip"]}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className={styles["pr-tech-group"]}>
                    <div className={styles["pr-tech-group-label"]}>数据库</div>
                    <div className={styles["pr-tech-group-chips"]}>
                      {picreview.tech.database.map((t, i) => (
                        <span key={i} className={styles["pr-tech-chip"]}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className={styles["pr-tech-group"]}>
                    <div className={styles["pr-tech-group-label"]}>云服务与 DevOps</div>
                    <div className={styles["pr-tech-group-chips"]}>
                      {picreview.tech.cloudDevops.map((t, i) => (
                        <span key={i} className={styles["pr-tech-chip"]}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </div>

        <SectionTOC />
      </main>
    </>
  );
}
