/**
 * YoutubeHero —— YouTube 频道运营详情页 Hero
 *
 * 设计：
 *  - 标题左对齐 + 项目标号（02 / 02）右对齐，与标题底端对齐
 *  - 与 PicreviewHero 保持一致的视觉语言
 */
import styles from "./YoutubeHero.module.css";

interface YoutubeHeroProps {
  name: string;
  name_en: string;
  projectLabel: string;
}

export function YoutubeHero({ name, name_en, projectLabel }: YoutubeHeroProps) {
  return (
    <header className={styles["yt-hero"]}>
      <div className={styles["yt-hero-row"]}>
        <h1 className={styles["yt-hero-title"]}>{name}</h1>
        <span className={styles["yt-hero-eyebrow"]}>{projectLabel}</span>
      </div>
    </header>
  );
}
