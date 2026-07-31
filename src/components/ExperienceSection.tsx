import { renderInline, renderRole } from "@/lib/text";

interface Experience {
  role: string;
  role_en: string;
  company: string;
  company_en: string;
  period: string;
  period_en: string;
  location?: string;
  location_en?: string;
  logo?: string;
  bullets: { lead?: string; lead_en?: string; text: string; text_en: string }[];
  tech: string[];
  tech_en: string[];
}

interface ExperienceSectionProps {
  lang: "zh" | "en";
  experiences: Experience[];
  labels: { title: string; techLabel: string };
  /** Optional anchor id for use with SectionsController (page-mode single-section view). */
  id?: string;
}

export function ExperienceSection({ lang, experiences, labels }: ExperienceSectionProps) {
  return (
    <section id="experience" className="section">
      <div className="container-narrow">
        <div className="section-head">
          <h2 className="section-title" suppressHydrationWarning>{labels.title}</h2>
        </div>

        {experiences.map((e, i) => {
          const logoSpec = e.logo ?? "";
          const [logoSlug, logoMod] = logoSpec.split(":");
          const logoSrc: string | undefined = logoSlug ? `/companies/${logoSlug}.png` : undefined;
          const logoClass = logoMod === "fill" ? "exp-logo exp-logo-fill" : "exp-logo";
          const companyName = lang === "en" ? e.company_en : e.company;
          const monogram = (companyName.match(/[\u4e00-\u9fa5]/)?.[0] ?? companyName.match(/[A-Za-z]/)?.[0]?.toUpperCase() ?? "");
          return (
            <article key={i} className="exp-row">
<div className={logoClass}>
                  {logoSrc ? (
                    <img src={logoSrc} alt={companyName} loading="lazy" />
                  ) : null}
                  <span className="exp-logo-monogram">{monogram}</span>
                </div>

              <div className="exp-body">
                <div className="exp-company-wrap">
                  <h3
                    className="exp-company"
                    suppressHydrationWarning
                    dangerouslySetInnerHTML={{
                      __html: renderRole(lang === "en" ? e.company_en : e.company),
                    }}
                  />
                  <span className="exp-period">
                    {lang === "en" ? e.period_en : e.period}
                  </span>
                </div>

                <div className="exp-meta-row">
                  <span className="exp-role">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: renderInline(lang === "en" ? e.role_en : e.role),
                      }}
                    />
                    {e.location && (
                      <>
                        <span className="exp-meta-sep" aria-hidden="true">·</span>
                        <span className="exp-meta-loc">
                          {lang === "en" ? e.location_en ?? e.location : e.location}
                        </span>
                      </>
                    )}
                  </span>
                </div>

                <ul className="bullet-list">
                  {e.bullets.map((b, j) => (
                    <li key={j} suppressHydrationWarning>
                      {(lang === "en" ? b.lead_en ?? b.lead : b.lead) && (
                        <strong>{lang === "en" ? b.lead_en ?? b.lead : b.lead}：</strong>
                      )}
                    <span
                      suppressHydrationWarning
                      dangerouslySetInnerHTML={{
                        __html: renderInline(lang === "en" ? b.text_en : b.text),
                      }}
                    />
                    </li>
                  ))}
                </ul>

                {e.tech.length > 0 && (
                  <div className="tech-strip">
                    <ul className="tech-pills">
                      {(lang === "en" ? e.tech_en : e.tech).map((t, k) => (
                        <li key={k} className="tech-pill">
                          #{t}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
