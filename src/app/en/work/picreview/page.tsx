import type { Metadata } from "next";
import { NavBar } from "@/components/NavBar";
import { PicreviewHero } from "@/components/works/PicreviewHero";
import { TimelineEvents } from "@/components/works/TimelineEvents";
import { DauChart, type DauPoint } from "@/components/works/DauChart";
import { StorageGrowthChart, type StoragePoint } from "@/components/works/StorageGrowthChart";
import { SectionTOC } from "@/components/works/SectionTOC";
import { picreview, type TimelineEvent } from "@/data/picreview";
import { getProfile, getProjectLabel } from "@/lib/profile";
import { promises as fs } from "fs";
import path from "path";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Team Image Review Tool \"PicReview\" · Willow Ding",
  description:
    "PicReview — lightweight team image-review tool: where the idea came from, feature tour, iteration log, end-of-internship metrics, daily active users line chart.",
};

type TocItem = { id: string; label: string; num: string; noScroll?: boolean };

const TOC_ITEMS: TocItem[] = [
  { id: "sec-demand", label: "Where the Idea Came From", num: "01", noScroll: true },
  { id: "sec-features", label: "Features", num: "02" },
  { id: "sec-timeline", label: "Iteration Log", num: "03" },
  { id: "sec-data", label: "Project Data", num: "04" },
  { id: "sec-tech", label: "Stack", num: "05" },
];

export default async function PicreviewPageEn() {
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
  const labelInfo = getProjectLabel(profile.projects, picreview.name_en_full);
  const projectLabel = labelInfo
    ? `${String(labelInfo.index).padStart(2, "0")} / ${String(labelInfo.total).padStart(2, "0")}`
    : "";

  const eventsForRender = (picreview.timelineEvents as TimelineEvent[]).map((e) => {
    if (e.kind === "user") {
      return { ...e, role: e.role_en ?? e.role };
    }
    return {
      ...e,
      title: e.title_en ?? e.title,
      reason: e.reason_en ?? e.reason,
      solution: e.solution_en ?? e.solution,
      outcome: e.outcome_en ?? e.outcome,
      commits: e.commits?.map((c) => ({ ...c, label: c.label_en ?? c.label })),
    };
  });

  const lang = "en" as const;
  const pick = <T extends string>(zh: T, en: T): T => (lang === "en" ? en : zh);

  return (
    <>
      <NavBar lang="en" />
      <main className={styles["pr-page"]} suppressHydrationWarning>
        <div className={styles["pr-layout"]}>
          <div className={styles["pr-content"]}>
            <div className="container-narrow">
              <PicreviewHero
                name={picreview.name_en}
                projectLabel={projectLabel}
                demoUrl={picreview.demoUrlEn}
              />

              <section id="sec-demand" className={styles["pr-section"]}>
                <span id="sec-demand-title" className={styles["pr-section-eyebrow"]}>
                  ~ <span className={styles["pr-section-eyebrow-num"]}>01</span> Where the Idea Came From ~
                </span>
                {picreview.demandSource.background_en.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
                <div className={styles["pr-frictions"]}>
                  {picreview.demandSource.frictions_en.map((f, i) => (
                    <div key={i} className={styles["pr-friction-card"]}>
                      <div className={styles["pr-friction-title"]}>{f.title}</div>
                      <p className={styles["pr-friction-body"]}>{f.body}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section id="sec-features" className={styles["pr-section"]}>
                <span id="sec-features-title" className={styles["pr-section-eyebrow"]}>
                  ~ <span className={styles["pr-section-eyebrow-num"]}>02</span> Features ~
                </span>

                <div className={styles["pr-loop-wrap"]}>
                  <div className={styles["pr-loop-frame-outer"]}>
                    <iframe
                      src={picreview.demoUrlEn}
                      className={styles["pr-loop-frame"]}
                      title="PicReview demo"
                      loading="lazy"
                    />
                  </div>
                  <div className={styles["pr-loop-note"]}>
                    <p>This PicReview demo is a feature walkthrough only; all data stays in the browser's local storage.</p>
                    <p>The production version runs on Supabase (PostgreSQL + Auth + Realtime) for multi-user real-time collaboration and permission control.</p>
                    <p>Originally written in Chinese; this is the translated version.</p>
                  </div>
                </div>

                <div className={styles["pr-features-flow"]}>
                  {picreview.features_en.map((text, i) => (
                    <div key={i} className={styles["pr-feature-row"]}>
                      <span className={styles["pr-feature-num"]}>({i + 1})</span>
                      <p className={styles["pr-feature-text"]}>{text}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section id="sec-timeline" className={styles["pr-section"]}>
                <span id="sec-timeline-title" className={styles["pr-section-eyebrow"]}>
                  ~ <span className={styles["pr-section-eyebrow-num"]}>03</span> Iteration Log ~
                </span>
                <TimelineEvents
                  events={eventsForRender}
                  reasonLabel="Why"
                  solutionLabel="How"
                  outcomeLabel="Result"
                />
              </section>

              <section id="sec-data" className={styles["pr-section"]}>
                <span id="sec-data-title" className={styles["pr-section-eyebrow"]}>
                  ~ <span className={styles["pr-section-eyebrow-num"]}>04</span> Project Data ~
                </span>

                <div className={styles["pr-subsection"]}>
                  <h3 className={styles["pr-subsection-heading"]}>
                    End-of-internship snapshot (5/13 – 6/1)
                  </h3>

                  <div className={styles["pr-retire-stats"]}>
                    <div className={styles["pr-retire-stat"]}>
                      <div className={styles["pr-retire-stat-value"]}>7</div>
                      <span className={styles["pr-retire-stat-label"]}>DAU</span>
                    </div>
                    <div className={styles["pr-retire-stat"]}>
                      <div className={styles["pr-retire-stat-value"]}>7</div>
                      <span className={styles["pr-retire-stat-label"]}>Active Projects</span>
                    </div>
                    <div className={styles["pr-retire-stat"]}>
                      <div className={styles["pr-retire-stat-value"]}>1,674</div>
                      <span className={styles["pr-retire-stat-label"]}>Images Reviewed (Cum.)</span>
                    </div>
                  </div>
                </div>

                <div className={styles["pr-subsection"]}>
                  <h3 className={styles["pr-subsection-heading"]}>
                    Cumulative image-review growth (5/26 – 7/15)
                  </h3>
                  <StorageGrowthChart
                    data={growth}
                    retiringDate={picreview.retiringDate}
                    lang="en"
                  />
                </div>
              </section>

              <section id="sec-tech" className={styles["pr-section"]}>
                <span id="sec-tech-title" className={styles["pr-section-eyebrow"]}>
                  ~ <span className={styles["pr-section-eyebrow-num"]}>05</span> Stack ~
                </span>
                <div className={styles["pr-tech-groups"]}>
                  <div className={styles["pr-tech-group"]}>
                    <div className={styles["pr-tech-group-label"]}>Frontend</div>
                    <div className={styles["pr-tech-group-chips"]}>
                      {picreview.tech_en.frontend.map((t, i) => (
                        <span key={i} className={styles["pr-tech-chip"]}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className={styles["pr-tech-group"]}>
                    <div className={styles["pr-tech-group-label"]}>Database</div>
                    <div className={styles["pr-tech-group-chips"]}>
                      {picreview.tech_en.database.map((t, i) => (
                        <span key={i} className={styles["pr-tech-chip"]}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className={styles["pr-tech-group"]}>
                    <div className={styles["pr-tech-group-label"]}>Cloud & DevOps</div>
                    <div className={styles["pr-tech-group-chips"]}>
                      {picreview.tech_en.cloudDevops.map((t, i) => (
                        <span key={i} className={styles["pr-tech-chip"]}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </div>

        <SectionTOC items={TOC_ITEMS} />
      </main>
    </>
  );
}
