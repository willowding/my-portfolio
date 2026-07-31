import { NavBar } from "@/components/NavBar";
import { WorksSection } from "@/components/WorksSection";
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Selected Work · Willow Ding",
  description:
    "Three independent projects shipped by Willow: a team image review tool, a YouTube channel recovery, and a documentary video.",
};

type ProfileYaml = {
  projects: Array<{
    name: string; name_en: string; period: string; period_en: string;
    role: string; role_en: string; summary: string; summary_en: string;
    bullets: any[]; tech: string[]; tech_en: string[];
    metrics: Array<{ label: string; value: string }>; tags: string[];
    badges?: string[]; badges_en?: string[];
    header_tag?: string; header_tag_en?: string;
    featured?: boolean;
    link?: string; link_en?: string;
  }>;
};

function loadProjects() {
  const file = path.join(process.cwd(), "data", "profile.yaml");
  const raw = fs.readFileSync(file, "utf-8");
  const p = yaml.load(raw) as ProfileYaml;
  return p.projects;
}

export default function ProjectsPageEn() {
  const projects = loadProjects().map((prj) => ({
    name: prj.name_en ?? prj.name,
    name_en: prj.name_en,
    period: prj.period_en ?? prj.period,
    period_en: prj.period_en,
    role: prj.role_en ?? prj.role,
    role_en: prj.role_en,
    summary: prj.summary_en ?? prj.summary,
    summary_en: prj.summary_en,
    bullets: prj.bullets,
    tech: prj.tech_en ?? prj.tech,
    tech_en: prj.tech_en,
    metrics: prj.metrics,
    tags: prj.tags,
    badges: prj.badges_en ?? prj.badges,
    badges_en: prj.badges_en,
    featured: prj.featured,
    link_en: prj.link_en,
    link: "/en" + (prj.link_en ?? prj.link),
  }));

  return (
    <>
      <NavBar lang="en" />
      <main>
        <WorksSection
          lang="en"
          projects={projects as any}
          labels={{
            title: "Selected Work",
            count: "projects",
            techLabel: "Stack",
          }}
        />
      </main>
    </>
  );
}