import { renderInline } from "@/lib/text";

interface HeroProps {
  lang: "zh" | "en";
  /** 中文姓名：每个字将单独渲染，拼音一一标注在汉字上方 */
  name: string;
  /** 与 name 字数一致、长度一一对应的拼音（含声调），例如 ["dīng","shū","wén"] */
  name_pinyin?: string[];
  name_en: string;
  location: string;
  location_en: string;
  contact: { email: string };
  links: { label: string; label_en: string; href: string }[];
}

/**
 * 中文姓名渲染：每个汉字下方显示一个音节。
 * - 用 grid 列对齐，让每个汉字和它的拼音单元一一对应
 * - 拼音字号略小、字距放宽，显得克制
 * - 整体保留衬线气质，不喧宾夺主
 */
function PinyinName({ chars, pinyin }: { chars: string[]; pinyin: string[] }) {
  return (
    <span className="display-title name-block">
      <span className="name-stack" aria-label={chars.join("")}>
        <span className="name-pinyin" aria-hidden="true">
          {chars.map((_, i) => (
            <span key={i} className="pinyin-cell">
              {pinyin[i] ?? ""}
            </span>
          ))}
        </span>
        <span className="name-chars">
          {chars.map((ch, i) => (
            <span key={i} className="char-cell">
              {ch}
            </span>
          ))}
        </span>
      </span>
    </span>
  );
}

export function Hero(props: HeroProps) {
  const { lang, name, name_pinyin, name_en, location, location_en, contact, links } = props;

  const subtitle =
    lang === "en"
      ? "Translation major; passed TEM-8, TEM-4 and CET-6."
      : "翻译专业，已通过英语 TEM-8 / TEM-4 / CET-6。";

  const summaryZh =
    "擅长从真实协作痛点出发，借助 AI 辅助独立交付轻量产品。";
  const summaryZhLine2 =
    "同时具备多语言内容运营与海外品牌本地化能力。";
  const summaryEn =
    "I ship small, useful products from real collaboration pain points — with AI assistance.";
  const summaryEnLine2 =
    "I also run multi-language content and adapt brand materials for overseas markets.";

  // 中文姓名逐字拆开，用于渲染拼音对齐
  const chars = Array.from(name);

  return (
    <section className="hero-block" id="top">
      <div className="container-narrow" style={{ position: "relative" }}>
        <h1 style={{ marginTop: "0.5rem" }}>
          {lang === "en" ? (
            <span className="display-title">{name_en}</span>
          ) : (
            <PinyinName chars={chars} pinyin={name_pinyin ?? []} />
          )}
        </h1>

        <p
          className="lead-text"
          style={{ marginTop: "1.8rem", maxWidth: "620px" }}
          dangerouslySetInnerHTML={{
            __html: renderInline(subtitle),
          }}
        />

        <p
          className="lead-text"
          style={{
            marginTop: "1.1rem",
            marginBottom: 0,
            maxWidth: "620px",
            color: "color-mix(in srgb, var(--color-on-accent) 80%, transparent)",
          }}
          dangerouslySetInnerHTML={{
            __html: renderInline(lang === "en" ? summaryEn : summaryZh),
          }}
        />

        <p
          className="lead-text"
          style={{
            marginTop: "0.5rem",
            maxWidth: "620px",
            color: "color-mix(in srgb, var(--color-on-accent) 80%, transparent)",
          }}
          dangerouslySetInnerHTML={{
            __html: renderInline(lang === "en" ? summaryEnLine2 : summaryZhLine2),
          }}
        />

        <div
          className="contact-strip"
          style={{
            marginTop: "2.8rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "0.4rem 1.5rem",
            fontSize: "0.95rem",
          }}
        >
          <a href={`mailto:${contact.email}`} className="inline-link">
            {contact.email}
          </a>
          {links.map((l, i) => (
            <a
              key={i}
              href={l.href}
              target="_blank"
              rel="noopener"
              style={{
                borderBottom:
                  "1px solid color-mix(in srgb, var(--color-on-accent) 35%, transparent)",
              }}
            >
              {lang === "en" ? l.label_en : l.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}