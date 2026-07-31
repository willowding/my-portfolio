import { renderInline } from '@/lib/text';
import { LockedContactCard } from '@/components/works/LockedContactCard';

interface AboutPageProps {
  lang: 'zh' | 'en';
  aboutPage: {
    basics: {
      title_zh: string;
      title_en: string;
      intro_zh: string;
      intro_en: string;
      narrative_zh?: string;
      narrative_en?: string;
      rows: Array<{ label_zh: string; label_en: string; value_zh: string; value_en: string }>;
    };
    skills: {
      title_zh: string;
      title_en: string;
      groups: Array<{ name_zh: string; name_en: string; items_zh: string[]; items_en: string[] }>;
    };
    education: {
      title_zh: string;
      title_en: string;
      school_zh?: string;
      school_en?: string;
      entries?: Array<{
        school_name_zh: string;
        school_name_en: string;
        school_role_zh: string;
        school_role_en: string;
        school_period_zh: string;
        school_period_en: string;
      }>;
      timeline?: Array<{ year: string; event_zh: string; event_en: string }>;
    };
  };
}

const pick = (zh: string | undefined, en: string | undefined, lang: 'zh' | 'en'): string => {
  if (lang === 'en') return (en ?? zh ?? '') as string;
  return (zh ?? en ?? '') as string;
};

export function AboutPage(props: AboutPageProps) {
  const { lang, aboutPage } = props;
  const heroNarrative = pick(aboutPage.basics.narrative_zh, aboutPage.basics.narrative_en, lang);
  const eduSchool = pick(aboutPage.education.school_zh, aboutPage.education.school_en, lang);
  const eduTimeline = aboutPage.education.timeline ?? [];

  return (
    <main className='about-main'>
      <header className='about-hero'>
        <div className='container-narrow'>
          <h1 className='about-hero-greeting'>I'm Willow.</h1>
          {heroNarrative && (
            <div className='about-hero-narrative'>
              {heroNarrative.split(/\n|<\s*br\s*\/?>/i).map((line, i, arr) => (
                <p key={i}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </p>
              ))}
            </div>
          )}

          {/* 联系方式直接进 hero，不带「基本信息」eyebrow */}
          <ul className='about-bio-dots about-hero-dots'>
            {aboutPage.basics.rows.map((r, i) => {
              const label = pick(r.label_zh, r.label_en, lang);
              const value = pick(r.value_zh, r.value_en, lang);
              const isEmail = label === '邮箱' || label.toLowerCase() === 'email';
              const isPhone = label === '手机' || label.toLowerCase() === 'phone';
              const isWechat = label === '微信' || label.toLowerCase() === 'wechat';
              const isLocked = isPhone || isWechat;
              const storageKey = isLocked ? `contact-unlocked-${isPhone ? 'phone' : 'wechat'}` : undefined;
              return (
                <li key={i} className='about-bio-item'>
                  <span className='about-bio-label'>{label}</span>
                  <span className='about-bio-sep'>·</span>
                  {isEmail ? (
                    <a href={'mailto:' + value} className='about-bio-value about-bio-value--link'>{value}</a>
                  ) : isLocked ? (
                    <LockedContactCard value={value} label={label} storageKey={storageKey!} />
                  ) : (
                    <span className='about-bio-value'>{value}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </header>

      <hr className='about-rule' />

      <section className='section'>
        <div className='container-narrow'>
          <span className='eyebrow'>{pick(aboutPage.skills.title_zh, aboutPage.skills.title_en, lang)}</span>
          <div className='about-prose'>
            {aboutPage.skills.groups.map((g, i) => (
              <p key={i} className='about-prose-block'>
                <strong className='about-prose-label'>{pick(g.name_zh, g.name_en, lang)}</strong>
                {' · '}
                <span className='about-prose-list'>
                  {(lang === 'en' ? g.items_en : g.items_zh).map((item, j, arr) => (
                    <span key={j} className='about-prose-chip'>
                      {item}{j < arr.length - 1 ? ' · ' : ''}
                    </span>
                  ))}
                </span>
              </p>
            ))}
          </div>
        </div>
      </section>

      <hr className='about-rule' />

      <section className='section'>
        <div className='container-narrow'>
          <span className='eyebrow'>{pick(aboutPage.education.title_zh, aboutPage.education.title_en, lang)}</span>
          {(aboutPage.education.entries ?? []).map((e, i) => (
            <div key={i} className='about-edu-exp-row'>
              <div className='about-edu-exp-body'>
                <div className='about-edu-exp-headline'>
                  <span className='about-edu-exp-name'>
                    {pick(e.school_name_zh, e.school_name_en, lang)}
                  </span>
                  <span className='about-edu-exp-period'>
                    {pick(e.school_period_zh, e.school_period_en, lang)}
                  </span>
                </div>
                <div className='about-edu-exp-meta'>
                  {pick(e.school_role_zh, e.school_role_en, lang)}
                </div>
              </div>
            </div>
          ))}
          {eduSchool && !(aboutPage.education.entries?.length) && (
            <p className='about-edu-school-line'>{eduSchool}</p>
          )}
          {/* 履历化排版：紧凑 2 列 grid + 细分割线 + 行距收紧 */}
          <dl className='about-edu-resume'>
            {eduTimeline.map((t, i) => (
              <div key={i} className='about-edu-resume-row'>
                <dt className='about-edu-resume-year'>{t.year}</dt>
                <dd className='about-edu-resume-event'>{pick(t.event_zh, t.event_en, lang)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </main>
  );
}