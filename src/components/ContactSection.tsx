interface ContactSectionProps {
  lang: "zh" | "en";
  contact: {
    email: string;
    phone: string;
    website: string;
  };
  links: { label: string; label_en: string; href: string }[];
  labels: {
    title: string;
    intro: string;
  };
  /** Optional anchor id for use with SectionsController (page-mode single-section view). */
  id?: string;
}

export function ContactSection({ lang, contact, links, labels }: ContactSectionProps) {
  const t = (zh: string, en: string) => (lang === "en" ? en : zh);

  const cards: Array<{ label: string; value: string; href: string }> = [
    {
      label: t("邮箱", "Email"),
      value: contact.email,
      href: `mailto:${contact.email}`,
    },
    {
      label: t("电话", "Phone"),
      value: contact.phone,
      href: `tel:${contact.phone.replace(/\s+/g, "")}`,
    },
    ...links.map((l) => ({
      label: lang === "en" ? l.label_en : l.label,
      value: l.href.replace(/^https?:\/\//, "").replace(/\/$/, ""),
      href: l.href,
    })),
  ];

  return (
    <section id="contact" className="section">
      <div className="container-wide">
        <div className="section-head">
          <h2 className="section-title">{labels.title}</h2>
        </div>

        <p style={{ marginBottom: "0.5rem", maxWidth: "560px", color: "var(--color-ink-soft)" }}>
          {labels.intro}
        </p>

        <div className="contact-grid">
          {cards.map((c, i) => (
            <a
              key={i}
              href={c.href}
              className="contact-card"
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel={c.href.startsWith("http") ? "noopener" : undefined}
            >
              <div className="label">{c.label}</div>
              <div className="value">{c.value}</div>
            </a>
          ))}
        </div>
      </div>

      <div className="site-footer" style={{ marginTop: "4rem" }}>
        <div className="container-wide">
          © 2026 · WILLOW DING · VIBE-CODED WITH CURSOR + CLAUDE
        </div>
      </div>
    </section>
  );
}
