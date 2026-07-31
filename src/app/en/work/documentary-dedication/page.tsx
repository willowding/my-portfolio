import type { Metadata } from "next";
import { NavBar } from "@/components/NavBar";
import { ProjectHero } from "@/components/works/ProjectHero";
import { threeXiang } from "@/data/three-xiang";
import { getProfile, getProjectLabel } from "@/lib/profile";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Dedication · Willow Ding",
  description:
    "Documentary on a summer community-practice trip; winner of the 2023 Ministry of Education \"Great Youth of Ours\" Practice-Featured Outstanding Work. Script, cinematography, and editing by Willow.",
};

export default function ThreeXiangPageEn() {
  const profile = getProfile();
  const labelInfo = getProjectLabel(profile.projects, threeXiang.name_en_full);
  const projectLabel = labelInfo
    ? `${String(labelInfo.index).padStart(2, "0")} / ${String(labelInfo.total).padStart(2, "0")}`
    : "";

  return (
    <>
      <NavBar lang="en" />
      <main className={styles["tx-page"]} suppressHydrationWarning>
        <div className={styles["tx-layout"]}>
          <div className={styles["tx-content"]}>
            <div className="container-narrow">
              <ProjectHero
                title="Summer Social-Practice Documentary"
                projectLabel={projectLabel}
              />

              {threeXiang.videoUrl && (
                <section className={styles["tx-feature-wrap"]} aria-label="Film Dedication">
                  <video
                    className={styles["tx-feature-player"]}
                    controls
                    preload="metadata"
                    playsInline
                    poster={threeXiang.poster || undefined}
                  >
                    <source src={threeXiang.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </section>
              )}

              <section id="sec-context" className={styles["tx-section"]}>
                <p>
                  During the summer, I joined the Shiguang volunteer service team as their main cinematographer and bilingual-curriculum designer. On the last day, the team lead proposed a recap video. I wrote the script that same day. The footage we had could not carry the film’s climax on its own, so I coordinated with the team to film an extra round of personal interviews. The final short documentary, {threeXiang.filmTitle_en}, was awarded{" "}
                  <a
                    href="https://dxs.moe.gov.cn/zx/a/hd_hdgg/231221/1872180.shtml"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {threeXiang.award_en}↗
                  </a>
                  .
                </p>

                <p>
                  The film follows a three-act structure: what we did → what the volunteers gained → equating “we” with “volunteers.” I chose this structure because anchoring on volunteers alone felt formulaic, and anchoring on “us” alone felt narrow; combining the two lets the action stay concrete and the feeling stay honest — young people participating in this kind of work speak from the heart.
                </p>
              </section>

              <article className={styles["tx-skill"]}>
                <header className={styles["tx-skill-head"]}>
                  <span className={styles["tx-skill-tag"]}>Script</span>
                </header>
                <div className={styles["tx-skill-desc"]}>
                  I wrote the script from scratch and shaped it around a three-act emotional arc: action → growth → resolution, opening at the volunteer service itself and closing on the personal messages. The aim was to replace slogan-style volunteer rhetoric with real, lived scenes.
                </div>
              </article>

              <article className={styles["tx-skill"]}>
                <header className={styles["tx-skill-head"]}>
                  <span className={styles["tx-skill-tag"]}>Cinematography</span>
                </header>
                <div className={styles["tx-skill-desc"]}>
                  I scouted four types of interactive scenes and three professional briefings in advance, designed varied camera placements, and on-site steered nine volunteer interviews.
                </div>
              </article>

              <article className={styles["tx-skill"]}>
                <header className={styles["tx-skill-head"]}>
                  <span className={styles["tx-skill-tag"]}>Editing</span>
                </header>
                <div className={styles["tx-skill-desc"]}>
                  Entirely cut in Jianying (CapCut CN).
                </div>
              </article>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
