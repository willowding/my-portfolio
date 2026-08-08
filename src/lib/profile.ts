// Profile loader — server-side, reads data/profile.yaml at build time
import { readFileSync } from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

export type Lang = "zh" | "en";

export interface Profile {
  basics: Basics;
  experiences: Experience[];
  projects: Project[];
  skills: SkillGroup[];
  education: Education[];
  about: AboutItem[];
  awards: Award[];
  about_page?: AboutPage;
}

export interface Bio {
  hometown: string;
  hometown_en: string;
  ethnicity: string;
  ethnicity_en: string;
  cohort: string;
  cohort_en: string;
  availability: string;
  availability_en: string;
  remote_ok: boolean;
  timezone: string;
}

export interface Basics {
  name: string;
  name_en: string;
  title: string;
  title_en: string;
  location: string;
  location_en: string;
  bio?: Bio;
  contact: { email: string; phone: string; wechat: string; website: string };
  links: { label: string; label_en: string; href: string }[];
}

export interface AboutPageBasicsRow {
  label_zh: string;
  label_en: string;
  value_zh: string;
  value_en: string;
}

export interface AboutPageSkillsGroup {
  name_zh: string;
  name_en: string;
  judgment_zh?: string;
  judgment_en?: string;
  items_zh: string[];
  items_en: string[];
}

export interface AboutPage {
  basics: {
    title_zh: string;
    title_en: string;
    intro_zh: string;
    intro_en: string;
    narrative_zh?: string;
    narrative_en?: string;
    rows: AboutPageBasicsRow[];
  };
  skills: {
    title_zh: string;
    title_en: string;
    groups: AboutPageSkillsGroup[];
  };
  education: {
    title_zh: string;
    title_en: string;
    narrative_zh?: string;
    narrative_en?: string;
  };
  now?: {
    title_zh: string;
    title_en: string;
    items_zh: string[];
    items_en: string[];
  };
}


export interface Bullet {
  lead?: string;
  lead_en?: string;
  text: string;
  text_en: string;
  tags?: string[];
}

export interface Experience {
  company: string;
  company_en: string;
  role: string;
  role_en: string;
  period: string;
  period_en: string;
  location: string;
  location_en: string;
  logo?: string;
  bullets: Bullet[];
  tech: string[];
  tech_en: string[];
}

export interface Metric {
  label: string;
  value: string;
}

export interface Project {
  name: string;
  name_en: string;
  period: string;
  period_en: string;
  role: string;
  role_en: string;
  link: string;
  link_en?: string;
  featured_size: "lg" | "md" | "sm";
  metrics: Metric[];
  summary: string;
  summary_en: string;
  bullets: Bullet[];
  tech: string[];
  tech_en: string[];
  tags: string[];
  badges?: string[];
  badges_en?: string[];
  category?: string;
  category_en?: string;
  featured?: boolean;
  award_link?: string;
  placeholder?: boolean;
}

export interface SkillGroup {
  name: string;
  name_en: string;
  items: string[];
  items_en: string[];
}

export interface Education {
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
}

export interface AboutItem {
  text: string;
  text_en: string;
}

export interface Award {
  name: string;
  name_en: string;
  org: string;
  org_en: string;
  date: string;
  note: string;
  note_en: string;
}

export function getProfile(): Profile {
  const file = path.join(process.cwd(), "data", "profile.yaml");
  try {
    const raw = readFileSync(file, "utf8");
    return yaml.load(raw) as Profile;
  } catch (err) {
    // Vercel serverless may not include `data/profile.yaml` in the bundle
    // (Next.js 15 file tracing only tracks statically-imported modules).
    // Fall back to an empty profile so callers don't crash.
    console.warn("[profile] failed to load data/profile.yaml:", err);
    return { projects: [] } as unknown as Profile;
  }
}

/**
 * Returns the 1-based index and total count of a project within the works list.
 * Match is done by `name` field.
 * Returns null if not found.
 */
export function getProjectLabel(
  works: Profile["projects"],
  projectName: string,
): { index: number; total: number } | null {
  const allWorks = works.filter((p) => !p.placeholder);
  const idx = allWorks.findIndex(
    (p) => p.name === projectName || p.name_en === projectName,
  );
  if (idx === -1) return null;
  return { index: idx + 1, total: allWorks.length };
}

/* ---------- i18n helpers ---------- */
export function pick<T extends Record<string, any>>(
  obj: T,
  fieldBase: string,
  lang: Lang,
): string {
  const enKey = `${fieldBase}_en` as keyof T;
  const zhKey = fieldBase as keyof T;
  const en = obj[enKey];
  const zh = obj[zhKey];
  if (lang === "en") return (en ?? zh ?? "") as string;
  return (zh ?? en ?? "") as string;
}

export function pickArr<T extends Record<string, any>>(
  obj: T,
  fieldBase: string,
  lang: Lang,
): string[] {
  const en = (obj as any)[`${fieldBase}_en`];
  const zh = (obj as any)[fieldBase];
  if (lang === "en") return (en ?? zh ?? []) as string[];
  return (zh ?? en ?? []) as string[];
}
