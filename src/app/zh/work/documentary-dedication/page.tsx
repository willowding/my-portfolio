import type { Metadata } from "next";
import { NavBar } from "@/components/NavBar";
import { ProjectHero } from "@/components/works/ProjectHero";
import { threeXiang } from "@/data/three-xiang";
import { getProfile, getProjectLabel } from "@/lib/profile";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "《奉献》· Willow Ding",
  description:
    "「三下乡」社会实践成果展示视频 · 入选 2023 教育部「大我青春」暑期社会实践成果征集展示活动实践风采类优秀作品 · 脚本 · 拍摄 · 剪辑",
};

export default function ThreeXiangPage() {
  const profile = getProfile();
  const labelInfo = getProjectLabel(profile.projects, threeXiang.name);
  const projectLabel = labelInfo
    ? `${String(labelInfo.index).padStart(2, "0")} / ${String(labelInfo.total).padStart(2, "0")}`
    : "";

  return (
    <>
      <NavBar lang="zh" />
      <main className={styles["tx-page"]} suppressHydrationWarning>
        <div className={styles["tx-layout"]}>
          <div className={styles["tx-content"]}>
            <div className="container-narrow">

              {/* Hero */}
              <ProjectHero
                title={threeXiang.name}
                projectLabel={projectLabel}
              />

              {/* 影片（hero 后、正文前） */}
              {threeXiang.videoUrl && (
                <section className={styles["tx-feature-wrap"]} aria-label="影片《奉献》">
                  <video
                    className={styles["tx-feature-player"]}
                    controls
                    preload="metadata"
                    playsInline
                    poster={threeXiang.poster || undefined}
                  >
                  <source src={threeXiang.videoUrl} type="video/mp4" />
                  您的浏览器不支持视频标签。
                </video>
              </section>
              )}

              {/* §1 创作背景（无标题） */}
              <section id="sec-context" className={styles["tx-section"]}>

                <p>
                  在拾光志愿服务队里，我的日常是活动素材拍摄和双语课程设计。活动最后一天，队长提议做总结视频。当天我写了脚本。现有素材难以支撑全片升华点，于是我跟队员确认加拍了一组个人采访。成片《奉献》获{" "}
                  <a
                    href="https://dxs.moe.gov.cn/zx/a/hd_hdgg/231221/1872180.shtml"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    2023 年教育部「大我青春」暑期社会实践成果征集展示活动实践风采类优秀作品↗
                  </a>
                  。
                </p>

                <p>
                  影片结构分为三幕：我们做了什么 → 志愿者收获了什么 → 把「我们」和「志愿者」划等号。我设计这样的结构的原因是从志愿者出发太公式化、从我们出发太局限，而结合两者既可以突出志愿者的行动也可以表达我们（作为大学生参加这样的活动）发自内心的感受。
                </p>
              </section>

              {/* 脚本 / 拍摄 / 剪辑 · 一行一个 */}
              <article className={styles["tx-skill"]}>
                <header className={styles["tx-skill-head"]}>
                  <span className={styles["tx-skill-tag"]}>脚本</span>
                </header>
                <div className={styles["tx-skill-desc"]}>
                  由我从 0 写完全部脚本，按「我们做了什么 → 我们收获了什么 → 我们也叫志愿者」三幕情感弧线编排，把口号化的志愿表达落回真实场景。由我设计情绪曲线：行动 → 成长 → 升华，从志愿服务的现场一直收到寄语落点。
                </div>
              </article>

              <article className={styles["tx-skill"]}>
                <header className={styles["tx-skill-head"]}>
                  <span className={styles["tx-skill-tag"]}>拍摄</span>
                </header>
                <div className={styles["tx-skill-desc"]}>
                  由我提前踩点 4 类互动场景与 3 场专业宣讲并设计丰富的机位。由我在现场引导 9 段志愿者采访。
                </div>
              </article>

              <article className={styles["tx-skill"]}>
                <header className={styles["tx-skill-head"]}>
                  <span className={styles["tx-skill-tag"]}>剪辑</span>
                </header>
                <div className={styles["tx-skill-desc"]}>
                  使用剪映完成整个视频的制作。
                </div>
              </article>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
