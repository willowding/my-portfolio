import { getProfile } from '@/lib/profile';
import { NavBar } from '@/components/NavBar';
import { AboutPage } from '@/components/AboutPage';

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About · Willow Ding",
  description: "Bio, education, and contact details for Willow.",
};

export default function AboutRouteEn() {
  const lang = 'en' as const;
  const p = getProfile();

  if (!p.about_page) {
    return (
      <>
        <NavBar lang={lang} />
        <main>
          <div className='container-narrow section'>
            <h1 className='section-title'>About</h1>
            <p>profile.yaml is missing the about_page block.</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <NavBar lang={lang} />
      <AboutPage
        lang={lang}
        aboutPage={p.about_page}
      />
    </>
  );
}