import { getProfile, pick, pickArr } from "@/lib/profile";
import { NavBar } from "@/components/NavBar";
import { ExperienceSection } from "@/components/ExperienceSection";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "工作经历 · 丁姝文 Willow",
  description: "丁姝文的三段实习经历。",
};

export default function ExperiencePage() {
  const lang = "zh" as const;
  const p = getProfile();

  const experiences = p.experiences.map((e: any) => ({
    ...e,
    role: pick(e, "role", lang),
    company: pick(e, "company", lang),
    period: pick(e, "period", lang),
    location: pick(e, "location", lang),
    tech: pickArr(e, "tech", lang),
  }));

  return (
    <>
      <NavBar lang={lang} />
      <main>
        <ExperienceSection
          lang={lang}
          experiences={experiences as any}
          labels={{ title: "工作经历", techLabel: "技术栈" }}
        />
      </main>
    </>
  );
}