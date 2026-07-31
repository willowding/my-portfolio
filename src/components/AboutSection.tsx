import { renderInline } from "@/lib/text";

interface AboutSectionProps {
  lang: "zh" | "en";
  about: { text: string; text_en: string }[];
  skills: { name: string; name_en: string; items: string[]; items_en: string[] }[];
  education: {
    school: string;
    school_en: string;
    degree: string;
    degree_en: string;
    major: string;
    major_en: string;
    period: string;
    period_en: string;
    gpa: string;
    gpa_en: string;
    notes: string[];
    notes_en: string[];
  }[];
  awards: {
    name: string;
    name_en: string;
    org: string;
    org_en: string;
    date: string;
    note: string;
    note_en: string;
  }[];
  labels: {
    title: string;
    selfEvalLabel: string;
    skillsLabel: string;
    educationLabel: string;
    awardsLabel: string;
  };
  /** Optional anchor id for use with SectionsController (page-mode single-section view). */
  id?: string;
}

export function AboutSection(props: AboutSectionProps) {
  const { lang, about, skills, education, awards, labels } = props;
  const t = (zh: string, en: string) => (lang === "en" ? en : zh);

  return (
    <section id="about" className="section">
      <div className="container-narrow">
        <div className="section-head">
          <h2 className="section-title">{labels.title}</h2>
        </div>

        {/* 自我评价 */}
        <div>
          <span className="eyebrow" style={{ display: "block", marginBottom: "1rem" }}>
            {labels.selfEvalLabel}
          </span>
          {about.map((a, i) => (
            <p
              key={i}
              style={{ marginBottom: "0.9rem", lineHeight: 1.7 }}
              dangerouslySetInnerHTML={{ __html: renderInline(t(a.text, a.text_en)) }}
            />
          ))}
        </div>

        {/* 技能分类 */}
        <div style={{ marginTop: "3rem" }}>
          <span className="eyebrow" style={{ display: "block", marginBottom: "1rem" }}>
            {labels.skillsLabel}
          </span>
          {skills.map((s, i) => (
            <div key={i} className="skill-group">
              <h4>{t(s.name, s.name_en)}</h4>
              <p className="items">{(lang === "en" ? s.items_en : s.items).join(" · ")}</p>
            </div>
          ))}
        </div>

        {/* 教育 */}
        <div style={{ marginTop: "3rem" }}>
          <span className="eyebrow" style={{ display: "block", marginBottom: "1rem" }}>
            {labels.educationLabel}
          </span>
          {education.map((ed, i) => (
            <div key={i} style={{ padding: "1.4rem 0", borderTop: "1px solid var(--color-rule)" }}>
              <h4 style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 500, fontSize: "1.1rem" }}>
                {t(ed.school, ed.school_en)}
              </h4>
              <p style={{ fontStyle: "italic", color: "var(--color-ink-soft)", marginTop: "0.2rem", fontSize: "0.9rem" }}>
                {t(ed.degree, ed.degree_en)} · {t(ed.major, ed.major_en)}
              </p>
              <p className="tech-strip" style={{ marginTop: "0.5rem" }}>
                {t(ed.period, ed.period_en)} · {t(ed.gpa, ed.gpa_en)}
              </p>
              <ul className="bullet-list" style={{ marginTop: "0.5rem" }}>
                {(lang === "en" ? ed.notes_en : ed.notes).map((n, j) => (
                  <li key={j}>{n}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 奖项 */}
        <div style={{ marginTop: "3rem" }}>
          <span className="eyebrow" style={{ display: "block", marginBottom: "1rem" }}>
            {labels.awardsLabel}
          </span>
          {awards.map((a, i) => (
            <div key={i} style={{ padding: "1rem 0", borderTop: "1px solid var(--color-rule)" }}>
              <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "1.02rem", fontWeight: 500 }}>
                {t(a.name, a.name_en)}
              </h4>
              <p style={{ fontStyle: "italic", color: "var(--color-ink-soft)", fontSize: "0.85rem", marginTop: "0.2rem" }}>
                {t(a.org, a.org_en) || (lang === "zh" ? "" : "")} · {a.date}
              </p>
              {a.note && <p style={{ fontSize: "0.9rem", marginTop: "0.3rem" }}>{t(a.note, a.note_en)}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
