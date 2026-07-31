import type { Metadata } from "next";
import { NavBar } from "@/components/NavBar";
import { YoutubeDetail } from "@/components/works/YoutubeDetail";
import { YoutubeSectionTOC } from "@/components/works/YoutubeSectionTOC";
import { youtube } from "@/data/youtube";
import { getProfile, getProjectLabel } from "@/lib/profile";

export const metadata: Metadata = {
  title: "YouTube 频道运营 · Willow Ding",
  description: "YouTube 频道运营 · 60 天停更恢复 + 广告创收",
};

export default function YoutubePage() {
  const profile = getProfile();
  const labelInfo = getProjectLabel(profile.projects, youtube.name);
  const projectLabel = labelInfo
    ? `${String(labelInfo.index).padStart(2, "0")} / ${String(labelInfo.total).padStart(2, "0")}`
    : "";

  return (
    <>
      <NavBar lang="zh" />
      <main>
        <div className="container-narrow">
          <YoutubeDetail
            data={youtube as any}
            lang="zh"
            projectLabel={projectLabel}
          />
        </div>
        <YoutubeSectionTOC />
      </main>
    </>
  );
}