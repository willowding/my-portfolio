/**
 * PicreviewHero —— PicReview 详情页顶部 Hero
 *
 * 设计：
 *  - 大标题 + 项目标号（项目 N / M）右对齐，与标题底端对齐
 *  - 标题末尾追加 (Demo ↗) 半角链接，链接到 PicReview GitHub Pages demo
 *  - Hero 通过 position: sticky 始终浮在 NavBar 下方
 *  - z-index 比 NavBar 低，避免覆盖导航
 */
import styles from "./PicreviewHero.module.css";

interface PicreviewHeroProps {
  name: string;
  projectLabel: string;
  demoUrl: string;
}

export function PicreviewHero({ name, projectLabel, demoUrl }: PicreviewHeroProps) {
  return (
    <header className={styles["pr-hero"]}>
      <div className={styles["pr-hero-row"]}>
        <h1 className={styles["pr-hero-title"]}>{name}</h1>
        <span className={styles["pr-hero-eyebrow"]}>{projectLabel}</span>
      </div>
    </header>
  );
}
