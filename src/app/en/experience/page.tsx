import { getProfile, pick, pickArr } from "@/lib/profile";
import { NavBar } from "@/components/NavBar";
import { ExperienceSection } from "@/components/ExperienceSection";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experience · Willow Ding",
  description: "Three internships across Product, Marketing, and Translation.",
};

export default function ExperiencePage() {
  const lang = "en" as const;
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
          labels={{ title: "Work Experience", techLabel: "Tech Stack" }}
        />
      </main>
    </>
  );
}
