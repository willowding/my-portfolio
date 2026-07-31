import { NavBar } from "@/components/NavBar";
import { WorksSection } from "@/components/WorksSection";
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "代表项目 · 丁姝文 Willow",
  description: "丁姝文独立交付的 3 个代表项目。",
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

export default function ProjectsPage() {
  const projects = loadProjects().map((prj) => ({
    name: prj.name, name_en: prj.name_en,
    period: prj.period, period_en: prj.period_en,
    role: prj.role, role_en: prj.role_en,
    summary: prj.summary, summary_en: prj.summary_en,
    bullets: prj.bullets,
    tech: prj.tech, tech_en: prj.tech_en,
    metrics: prj.metrics, tags: prj.tags,
    badges: prj.badges, badges_en: prj.badges_en,
    featured: prj.featured,
    link_en: prj.link_en,
    link: "/zh" + prj.link,
  }));

  return (
    <>
      <NavBar lang="zh" />
      <main>
        <WorksSection
          lang="zh"
          projects={projects as any}
          labels={{
            title: "代表项目",
            count: "项",
            techLabel: "技术栈",
          }}
        />
      </main>
    </>
  );
}