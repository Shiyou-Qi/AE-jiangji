import Link from 'next/link';

import Faq from './Faq';
import JsonLd from './JsonLd';
import { ArrowRight } from './Icons';
import { getContent } from '@/lib/content';
import { LANDING_UI, siblings } from '@/lib/landing';
import { ldCrumbs, ldFaq } from '@/lib/seo';

/**
 * 长尾落地页的统一版式。
 *
 * 三类落地页（Premiere 目标版本 / After Effects 目标版本 / 指南文章）
 * 的内容字段不同，但在 lib/landing.js 里已经被归一成同一套形状，
 * 所以这里只写一遍版式，不为每类各写一个组件。
 *
 * 结构化数据在同一处注入：面包屑 + FAQPage。
 * FAQPage 是这些页面能拿到富结果的关键 —— 问答必须与页面上真实可见的
 * 问答完全一致，否则会被判为作弊，所以这里直接复用同一份数据。
 */
export default function LandingPage({ lang, page }) {
  const c = getContent(lang);
  const t = LANDING_UI[lang];
  const base = `/${lang}`;
  const sibs = siblings(page.key, lang);
  const isGuide = page.family === 'guide';

  // 走链：首页 → 上级列表页（指南没有中间层，跳过）→ 当前页
  const trail = [{ name: c.nav.home, path: '' }];
  if (page.group.parentPath) trail.push({ name: page.group.parentLabel, path: page.group.parentPath });
  trail.push({ name: page.crumb.name, path: page.crumb.path });

  // 次按钮：版本页回它的版本表，指南页去工作原理（指南没有版本表可回）
  const secondary = isGuide
    ? { href: '/how-it-works', label: t.howItWorks }
    : { href: `${page.group.parentPath}#versions`, label: t.allVersions };

  return (
    <>
      <JsonLd data={[ldCrumbs(lang, trail), page.faq?.length ? ldFaq(page.faq, lang) : null]} />

      {/* ─────────── 首屏 ─────────── */}
      <section className="hero landing-hero" style={{ paddingBottom: 40 }}>
        <div className="wrap landing-wrap">
          <nav className="crumbs" aria-label="breadcrumb">
            {trail.map((item, i) => (
              <span key={item.path || 'home'}>
                {i ? <i aria-hidden="true">/</i> : null}
                {i === trail.length - 1 ? (
                  <span>{item.name}</span>
                ) : (
                  <Link href={base + item.path}>{item.name}</Link>
                )}
              </span>
            ))}
          </nav>

          <div className="landing-intro">
            <span className="kicker">{page.kicker}</span>
            <h1 className="h2" style={{ fontSize: 'clamp(29px, 4.3vw, 48px)' }}>
              {page.h1}
            </h1>
            <p className="lede">{page.lede}</p>

            <div className="landing-actions">
              <Link className="btn btn--primary" href={base + page.converter.href}>
                {page.converter.label}
                <ArrowRight />
              </Link>
              <Link className="btn" href={base + secondary.href}>
                {secondary.label}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── 关键事实（指南类页面没有这一段） ─────────── */}
      {page.facts?.length ? (
        <section style={{ paddingBottom: 56 }}>
          <div className="wrap">
            <dl className="kv reveal">
              {page.facts.map((f) => (
                <div key={f.k}>
                  <dt>{f.k}</dt>
                  <dd>{f.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      ) : null}

      {/* ─────────── 正文 ─────────── */}
      <section style={{ paddingBottom: 56 }}>
        <div className="wrap">
          <div className="prose prose--center landing-prose">
            {page.sections.map((s) => (
              <section key={s.h}>
                <h2 className="h3" style={{ marginBottom: 12 }}>
                  {s.h}
                </h2>
                {s.p ? <p>{s.p}</p> : null}
                {s.list?.length ? (
                  <ul>
                    {s.list.map((li) => (
                      <li key={li}>{li}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>

          {/* 操作步骤。
              列数交给 .steps 的 CSS（桌面三列、900px 以下收成一列）——
              千万不要在这里写内联的 gridTemplateColumns：内联样式优先级高于媒体查询，
              窄屏就不会折行了。落地的步骤数固定是 3，正好对上。 */}
          {page.steps?.length ? (
            <ol className="steps reveal" style={{ marginTop: 36, listStyle: 'none', padding: 0 }}>
              {page.steps.map((s, i) => (
                <li className="step" key={s}>
                  <span className="step__n">{i + 1}</span>
                  <p className="step__p" style={{ marginTop: 16 }}>
                    {s}
                  </p>
                </li>
              ))}
            </ol>
          ) : null}
        </div>
      </section>

      {/* ─────────── 问答 ─────────── */}
      {page.faq?.length ? (
        <section style={{ paddingBottom: 56 }}>
          <div className="wrap">
            <div className="sec-head sec-head--center reveal">
              <h2 className="h2">{t.faqTitle}</h2>
            </div>
            <div className="faq-block reveal">
              <Faq groups={[{ items: page.faq }]} />
            </div>
          </div>
        </section>
      ) : null}

      {/* ─────────── 内链：同组其它页面 ─────────── */}
      <section style={{ paddingBottom: 72 }}>
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="kicker">{isGuide ? t.otherGuides : t.otherTargets}</span>
            <h2 className="h3">{isGuide ? t.guidesTitle : page.group.parentLabel}</h2>
          </div>

          <div className="grid grid--3 reveal">
            {sibs.map((s) => (
              <Link className="card" key={s.key} href={base + s.href}>
                <span className="step__t" style={{ marginTop: 0, fontSize: 16.5 }}>
                  {s.name}
                </span>
              </Link>
            ))}
          </div>

          {page.related?.length ? (
            <div className="landing-related">
              {page.related.map((r) => (
                <Link className="btn" key={r.href} href={base + r.href}>
                  {r.t}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
