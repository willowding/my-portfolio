import { getProfile, pick, pickArr } from "@/lib/profile";
import { NavBar } from "@/components/NavBar";
import { Hero } from "@/components/Hero";
import { WorksSection } from "@/components/WorksSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { AboutSection } from "@/components/AboutSection";
import { ContactSection } from "@/components/ContactSection";
import { PageModeController } from "@/components/SectionsController";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "丁姝文 Willow · 产品 × AI 协同 · 2026 届应届生",
  description: "丁姝文 · 产品 × AI 协同 · 翻译专业 · 2026 届应届生 · 上海 · 2026/07 起全职到岗。",
};

export default function HomePage() {
  const lang = "zh" as const;
  const p = getProfile();

  // ---- Projects 数据 ----
  const projects = p.projects.map((prj) => ({
    name: pick(prj as any, "name", lang),
    name_en: prj.name_en,
    period: pick(prj as any, "period", lang),
    period_en: prj.period_en,
    role: pick(prj as any, "role", lang),
    role_en: prj.role_en,
    summary: pick(prj as any, "summary", lang),
    summary_en: prj.summary_en,
    bullets: prj.bullets,
    tech: pickArr(prj as any, "tech", lang),
    tech_en: prj.tech_en,
    metrics: prj.metrics,
    tags: prj.tags,
    link_en: prj.link_en,
    link: "/zh" + prj.link,
    category: prj.category,
    category_en: prj.category_en,
    badges: prj.badges,
    badges_en: prj.badges_en,
    featured: prj.featured,
  }));

  const experiences = p.experiences.map((e: any) => ({
    ...e,
    role: pick(e, "role", lang),
    company: pick(e, "company", lang),
    period: pick(e, "period", lang),
    location: pick(e, "location", lang),
    tech: pickArr(e, "tech", lang),
  }));

  const about = p.about;
  const skills = p.skills;
  const education = p.education.map((ed: any) => ({ ...ed, school: pick(ed, "school", lang), degree: pick(ed, "degree", lang), major: pick(ed, "major", lang), period: pick(ed, "period", lang), gpa: pick(ed, "gpa", lang) }));
  const awards = p.awards.map((a: any) => ({ ...a, name: pick(a, "name", lang), org: pick(a, "org", lang), note: pick(a, "note", lang) }));
  const links = p.basics.links.map((l: any) => ({ label: l.label, label_en: l.label_en, href: l.href }));

  // ---- Labels ----
  const labels = {
    heroBadge: "产品 × AI 协同 · 2026 届 · 上海",
    worksTitle: "代表项目",
    worksCount: "项",
    experienceTitle: "工作经历",
    aboutTitle: "关于我",
    selfEvalLabel: "自我评价",
    skillsLabel: "技能栈",
    educationLabel: "教育",
    awardsLabel: "奖项 / 证书",
    contactTitle: "联系方式",
    contactIntro: "欢迎就产品机会、内容合作、长期实习或项目协作联系我——我会在 24 小时内回复。",
    techLabel: "技术栈",
  };

  return (
    <>
      <NavBar lang={lang} />

      <main style={{ paddingTop: 0 }}>
        <PageModeController
          hero={
            <Hero
              lang={lang}
              name={p.basics.name}
              name_pinyin={["dīng", "shū", "wén"]}
              name_en={p.basics.name_en}
              location={p.basics.location}
              location_en={p.basics.location_en}
              contact={p.basics.contact}
              links={links}
            />
          }
          sections={[
            <WorksSection key="works" id="projects" lang={lang} projects={projects as any} labels={{ title: labels.worksTitle, count: labels.worksCount, techLabel: labels.techLabel }} />,
            <ExperienceSection key="experience" id="experience" lang={lang} experiences={experiences as any} labels={{ title: labels.experienceTitle, techLabel: labels.techLabel }} />,
            <AboutSection
              key="about"
              id="about"
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
            />,
            <ContactSection
              key="contact"
              id="contact"
              lang={lang}
              contact={{ email: p.basics.contact.email, phone: p.basics.contact.phone, website: p.basics.contact.website }}
              links={links}
              labels={{ title: labels.contactTitle, intro: labels.contactIntro }}
            />,
          ]}
        />
      </main>
    </>
  );
}