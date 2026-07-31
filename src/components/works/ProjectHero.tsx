/**
 * ProjectHero —— 项目详情页顶部 Hero（通用版）
 *
 * 设计：
 *  - 大标题 + 项目标号（项目 N / M）右对齐，与标题底端对齐
 *  - 副标题（subtitle）放标题下方
 *  - meta 行放最底部（时间 / 链接等）
 *  - Hero 通过 position: sticky 始终浮在 NavBar 下方
 *  - z-index 比 NavBar 低，避免覆盖导航
 *  - demoUrl 非空时自动渲染 (Demo ↗) 链接
 */
import styles from "./ProjectHero.module.css";

interface ProjectHeroProps {
  title: string;
  subtitle?: string;
  projectLabel: string;
  meta?: React.ReactNode;
  demoUrl?: string;
}

export function ProjectHero({
  title,
  subtitle,
  projectLabel,
  meta,
  demoUrl,
}: ProjectHeroProps) {
  return (
    <header className={styles["ph-hero"]}>
      <div className={styles["ph-hero-row"]}>
        <h1 className={styles["ph-hero-title"]}>
          {title}
          {demoUrl && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles["ph-hero-demo"]}
            >
              Demo ↗
            </a>
          )}
        </h1>
        <span className={styles["ph-hero-eyebrow"]}>{projectLabel}</span>
      </div>
      {subtitle && (
        <p className={styles["ph-hero-sub"]}>{subtitle}</p>
      )}
      {meta && (
        <div className={styles["ph-hero-meta"]}>{meta}</div>
      )}
    </header>
  );
}
