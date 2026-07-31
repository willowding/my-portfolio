import { getProfile } from "@/lib/profile";
import { NavBar } from "@/components/NavBar";
import { Hero } from "@/components/Hero";
import { WorksSection } from "@/components/WorksSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { AboutSection } from "@/components/AboutSection";
import { ContactSection } from "@/components/ContactSection";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Willow Ding · Product × AI Co-pilot · Class of 2026",
  description: "Willow (Shuwen) Ding — Product × AI Co-pilot, Translation major, Class of 2026. Based in Shanghai, available full-time from July 2026.",
};

export default function EnglishHome() {
  const lang = "en" as const;
  const p = getProfile();

  const projects = p.projects.map((prj) => ({
    name: prj.name,
    name_en: prj.name_en,
    period: prj.period,
    period_en: prj.period_en,
    role: prj.role,
    role_en: prj.role_en,
    summary: prj.summary,
    summary_en: prj.summary_en,
    bullets: prj.bullets,
    tech: prj.tech,
    tech_en: prj.tech_en,
    metrics: prj.metrics,
    tags: prj.tags,
    badges: prj.badges,
    badges_en: prj.badges_en,
    featured: prj.featured,
    link_en: prj.link_en,
    link: "/en" + (prj.link_en ?? prj.link),
  }));

  const experiences = p.experiences.map((e: any) => ({ ...e }));
  const about = p.about;
  const skills = p.skills;
  const education = p.education.map((ed: any) => ({ ...ed }));
  const awards = p.awards.map((a: any) => ({ ...a }));
  const links = p.basics.links.map((l: any) => ({ label: l.label, label_en: l.label_en, href: l.href }));

  const labels = {
    worksTitle: "Selected Work",
    worksCount: "projects",
    experienceTitle: "Experience",
    aboutTitle: "About",
    selfEvalLabel: "Self-evaluation",
    skillsLabel: "Skills",
    educationLabel: "Education",
    awardsLabel: "Awards",
    contactTitle: "Get in Touch",
    contactIntro: "Open to product roles, content collabs, internships, or project work. I usually reply within 24 hours.",
    techLabel: "Stack",
  };

  return (
    <>
      <NavBar lang={lang} />

      <main>
        <Hero
          lang={lang}
          name={p.basics.name}
          name_en={p.basics.name_en}
          location={p.basics.location}
          location_en={p.basics.location_en}
          contact={p.basics.contact}
          links={links}
        />

        <WorksSection lang={lang} projects={projects as any} labels={{ title: labels.worksTitle, count: labels.worksCount, techLabel: labels.techLabel }} />
        <ExperienceSection lang={lang} experiences={experiences as any} labels={{ title: labels.experienceTitle, techLabel: labels.techLabel }} />
        <AboutSection
          lang={lang}
          about={about}
          skills={skills}
          education={education as any}
          awards={awards as any}
          labels={{
            title: labels.aboutTitle,
            selfEvalLabel: labels.selfEvalLabel,
            skillsLabel: labels.skillsLabel,
            educationLabel: labels.educationLabel,
            awardsLabel: labels.awardsLabel,
          }}
        />
        <ContactSection
          lang={lang}
          contact={{ email: p.basics.contact.email, phone: p.basics.contact.phone, website: p.basics.contact.website }}
          links={links}
          labels={{ title: labels.contactTitle, intro: labels.contactIntro }}
        />
      </main>
    </>
  );
}
