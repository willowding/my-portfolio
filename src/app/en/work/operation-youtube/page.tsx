import type { Metadata } from "next";
import { NavBar } from "@/components/NavBar";
import { YoutubeDetail } from "@/components/works/YoutubeDetail";
import { YoutubeSectionTOC } from "@/components/works/YoutubeSectionTOC";
import { youtube } from "@/data/youtube";
import { getProfile, getProjectLabel } from "@/lib/profile";

export const metadata: Metadata = {
  title: "YouTube Channel Operation · Willow Ding",
  description:
    "Pan-Chinese OST YouTube channel recovery case: 60-day hiatus recovery, two-channel synergy, ad revenue activated.",
};

export default function YoutubePage() {
  const profile = getProfile();
  const labelInfo = getProjectLabel(profile.projects, youtube.name_en);
  const projectLabel = labelInfo
    ? `${String(labelInfo.index).padStart(2, "0")} / ${String(labelInfo.total).padStart(2, "0")}`
    : "";

  return (
    <>
      <NavBar lang="en" />
      <main>
        <div className="container-narrow">
          <YoutubeDetail
            data={youtube as any}
            lang="en"
            projectLabel={projectLabel}
          />
        </div>
        <YoutubeSectionTOC lang="en" />
      </main>
    </>
  );
}
