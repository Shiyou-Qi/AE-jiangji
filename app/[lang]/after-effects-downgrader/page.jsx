import Link from 'next/link';

import AeConverter from '@/components/AeConverter';
import Faq from '@/components/Faq';
import { Alert, Check, Cpu, Layers, Lock, Shield } from '@/components/Icons';
import JsonLd from '@/components/JsonLd';
import { getContent } from '@/lib/content';
import { AE_SLUG_BY_MAJOR, LANDING_UI } from '@/lib/landing';
import { ldCrumbs, ldFaq, pageMeta } from '@/lib/seo';
import { AE_TARGETS } from '@/lib/site';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return pageMeta(lang, 'afterEffects');
}

export default async function AfterEffectsPage({ params }) {
  const { lang } = await params;
  const c = getContent(lang);
  const a = c.afterEffects;
  const base = `/${lang}`;

  const faqItems = [
    c.faqItems.general[0],
    c.faqItems.loss[0],
    c.faqItems.security[0],
    c.faqItems.general[2],
  ].filter(Boolean);

  const keptIcons = [Layers, Layers, Cpu, Lock];

  return (
    <>
      <JsonLd
        data={[
          ldCrumbs(lang, [
            { name: c.nav.home, path: '' },
            { name: c.nav.afterEffects, path: '/after-effects-downgrader' },
          ]),
          ldFaq(faqItems, lang),
        ]}
      />
      {/* ─────────── 工具区 ─────────── */}
      <section className="hero" id="tool" style={{ paddingBottom: 56 }}>

        <div className="wrap" style={{ position: 'relative' }}>
          <div style={{ maxWidth: 780 }}>
            <span className="kicker">{a.kicker}</span>
            <h1 className="h2" style={{ fontSize: 'clamp(30px, 4.4vw, 50px)' }}>
              {a.title}
            </h1>
            <p className="lede">{a.lede}</p>
            <p className="mock__s" style={{ marginTop: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ color: 'var(--brand-2)', display: 'inline-flex' }}>
                <Lock size={15} />
              </span>
              {a.ctaNote}
            </p>
          </div>
        </div>
      </section>

      <section style={{ paddingBottom: 72 }}>
        <div className="wrap">
          <div className="conv-layout">
            <div className="reveal">
              <AeConverter ui={c.aeUi} />
            </div>

            <aside className="reveal" style={{ display: 'grid', gap: 20 }}>
              <div className="notice">
                <span className="notice__ico">
                  <Alert />
                </span>
                <div>
                  <p style={{ color: '#fcd34d', fontWeight: 650, marginBottom: 6 }}>
                    {a.safetyTitle}
                  </p>
                  <p>{a.safetyBody}</p>
                </div>
              </div>

              <div className="notice" style={{ borderColor: 'rgba(52,211,153,.28)' }}>
                <span className="notice__ico" style={{ color: '#34d399' }}>
                  <Shield />
                </span>
                <div>
                  <p style={{ color: '#6ee7b7', fontWeight: 650, marginBottom: 6 }}>
                    {a.localTitle}
                  </p>
                  <p>{a.localBody}</p>
                </div>
              </div>

              <div className="feat">
                <span className="feat__ico">
                  <Layers />
                </span>
                <p className="feat__t">{a.why.points[1].t}</p>
                <p className="feat__p">{a.why.points[1].p}</p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ─────────── 会保留什么 ─────────── */}
      <section className="section band">
        <div className="wrap">
          <div className="sec-head sec-head--center reveal">
            <span className="kicker">{a.kept.kicker}</span>
            <h2 className="h2">{a.kept.title}</h2>
          </div>

          <div className="grid grid--4">
            {a.kept.items.map((it, i) => {
              const Ico = keptIcons[i] || Check;
              return (
                <div className="feat reveal" key={it.t}>
                  <span className="feat__ico">
                    <Ico />
                  </span>
                  <p className="feat__t">{it.t}</p>
                  <p className="feat__p">{it.p}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────── 版本对照表 ─────────── */}
      <section className="section" id="versions">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="kicker">{a.versions.kicker}</span>
            <h2 className="h2">{a.versions.title}</h2>
            <p className="lede">{a.versions.lede}</p>
          </div>

          <div className="reveal table-scroll">
            <table className="table">
              <thead>
                <tr>
                  <th>{a.versions.colVersion}</th>
                  <th>{a.versions.colStability}</th>
                </tr>
              </thead>
              <tbody>
                {AE_TARGETS.map((row) => (
                  <tr key={row.major}>
                    <td>
                      <Link href={`${base}/after-effects-downgrader/to/${AE_SLUG_BY_MAJOR[row.major]}`}>
                        {row.label}
                      </Link>
                    </td>
                    <td>
                      <span className={`tag ${row.stability === 'stable' ? 'tag--ok' : 'tag--soon'}`}>
                        {row.stability === 'stable' ? a.versions.stable : a.versions.experimental}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="muted reveal" style={{ marginTop: 16, fontSize: 13.6 }}>
            {LANDING_UI[lang].tableHint}
          </p>

          <p className="muted reveal" style={{ marginTop: 16, fontSize: 13.6 }}>
            {a.versions.foot}
          </p>
        </div>
      </section>

      {/* ─────────── 两条线为什么不同 ─────────── */}
      <section className="section band">
        <div className="wrap">
          <div className="split">
            <div className="reveal">
              <span className="kicker">{a.why.kicker}</span>
              <h2 className="h2">{a.why.title}</h2>
              <p className="lede">{a.why.lede}</p>
              <div style={{ marginTop: 28 }}>
                <Link className="btn btn--lg" href={`${base}/premiere-pro-downgrader`}>
                  {c.nav.premiere}
                </Link>
              </div>
            </div>

            <div className="reveal" style={{ display: 'grid', gap: 18 }}>
              {a.why.points.map((it) => (
                <div className="feat" key={it.t}>
                  <p className="feat__t" style={{ marginTop: 0 }}>
                    {it.t}
                  </p>
                  <p className="feat__p">{it.p}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── 问答 ─────────── */}
      <section className="section">
        <div className="wrap">
          <div className="sec-head sec-head--center reveal">
            <span className="kicker">{a.faqKicker}</span>
            <h2 className="h2">{c.premiere.faq.title}</h2>
          </div>
          <div className="reveal faq-block">
            <Faq groups={[{ items: faqItems }]} />
          </div>
        </div>
      </section>

      {/* ─────────── 结尾 ─────────── */}
      <section className="section band">
        <div className="wrap">
          <div className="cta-band reveal">
            <h2 className="h2">{a.title}</h2>
            <p className="lede" style={{ maxWidth: '52ch', marginInline: 'auto' }}>
              {a.lede}
            </p>
            <div className="cta-band__btns">
              <Link className="btn btn--primary btn--lg" href={`${base}/after-effects-downgrader#tool`}>
                {a.cta}
              </Link>
              <Link className="btn btn--lg" href={`${base}/how-it-works`}>
                {c.nav.how}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
