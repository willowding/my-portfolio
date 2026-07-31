import { getProfile } from '@/lib/profile';
import { NavBar } from '@/components/NavBar';
import { AboutPage } from '@/components/AboutPage';

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "关于我 · 丁姝文 Willow",
  description: "丁姝文的个人信息 · 学历 · 联系方式。",
};

export default function AboutRoute() {
  const lang = 'zh' as const;
  const p = getProfile();

  if (!p.about_page) {
    return (
      <>
        <NavBar lang={lang} />
        <main>
          <div className='container-narrow section'>
            <h1 className='section-title'>关于我</h1>
            <p>profile.yaml 中缺少 about_page 配置。</p>
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