import Link from 'next/link';

import Faq from '@/components/Faq';
import PrConverter from '@/components/PrConverter';
import { Alert, ArrowRight, Layers, Shield } from '@/components/Icons';
import JsonLd from '@/components/JsonLd';
import { getContent } from '@/lib/content';
import { LANDING_UI, PR_SLUG_BY_VERSION } from '@/lib/landing';
import { ldCrumbs, ldFaq, pageMeta } from '@/lib/seo';
import { VERSION_TABLE } from '@/lib/site';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return pageMeta(lang, 'premiere');
}

export default async function PremierePage({ params }) {
  const { lang } = await params;
  const c = getContent(lang);
  const p = c.premiere;
  const base = `/${lang}`;

  const faqItems = [
    c.faqItems.general[0],
    c.faqItems.general[2],
    c.faqItems.loss[0],
    c.faqItems.loss[2],
    c.faqItems.security[1],
  ].filter(Boolean);

  return (
    <>
      <JsonLd
        data={[
          ldCrumbs(lang, [
            { name: c.nav.home, path: '' },
            { name: c.nav.premiere, path: '/premiere-pro-downgrader' },
          ]),
          ldFaq(faqItems, lang),
        ]}
      />
      {/* ─────────── 工具区 ─────────── */}
      <section className="hero" style={{ paddingBottom: 56 }}>

        <div className="wrap" style={{ position: 'relative' }}>
          <div style={{ maxWidth: 780 }}>
            <span className="kicker">{p.kicker}</span>
            <h1 className="h2" style={{ fontSize: 'clamp(30px, 4.4vw, 50px)' }}>
              {p.title}
            </h1>
            <p className="lede">{p.lede}</p>
          </div>
        </div>
      </section>

      <section style={{ paddingBottom: 72 }}>
        <div className="wrap">
          <div className="conv-layout">
            <div className="reveal">
              {/*
                引擎状态的三个词条与产品文案放在一起（premiere 段），
                这里合并进转换器的 ui 字典，避免同一句话存两份。
              */}
              <PrConverter
                ui={{
                  ...c.ui,
                  engineOnline: p.engineOnline,
                  engineOffline: p.engineOffline,
                  engineUnknown: p.engineUnknown,
                }}
              />
            </div>

            <aside className="reveal" style={{ display: 'grid', gap: 20 }}>
              <div className="notice">
                <span className="notice__ico">
                  <Alert />
                </span>
                <div>
                  <p style={{ color: '#fcd34d', fontWeight: 650, marginBottom: 6 }}>
                    {p.safetyTitle}
                  </p>
                  <p>{p.safetyBody}</p>
                </div>
              </div>

              <div className="feat">
                <span className="feat__ico">
                  <Shield />
                </span>
                <p className="feat__t">{c.home.why.items[1].t}</p>
                <p className="feat__p">{c.home.why.items[1].p}</p>
              </div>

              <div className="feat">
                <span className="feat__ico">
                  <Layers />
                </span>
                <p className="feat__t">{c.home.why.items[0].t}</p>
                <p className="feat__p">{c.home.why.items[0].p}</p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ─────────── 版本对照表 ─────────── */}
      <section className="section band" id="versions">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="kicker">{p.versions.kicker}</span>
            <h2 className="h2">{p.versions.title}</h2>
            <p className="lede">{p.versions.lede}</p>
          </div>

          <div className="reveal table-scroll">
            <table className="table">
              <thead>
                <tr>
                  <th>{p.versions.colVersion}</th>
                  <th>{p.versions.colOut}</th>
                </tr>
              </thead>
              <tbody>
                {VERSION_TABLE.map((row) => (
                  <tr key={row.v}>
                    <td>
                      <Link href={`${base}/premiere-pro-downgrader/to/${PR_SLUG_BY_VERSION[row.v]}`}>
                        {`Premiere Pro ${row.v}`}
                      </Link>
                    </td>
                    <td>{row.out === 'plain' ? p.versions.outPlain : p.versions.outGzip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="muted reveal" style={{ marginTop: 16, fontSize: 13.6 }}>
            {LANDING_UI[lang].tableHint}
          </p>

          <p className="muted reveal" style={{ marginTop: 16, fontSize: 13.6 }}>
            {p.versions.foot}
          </p>
        </div>
      </section>

      {/* ─────────── 会丢什么 ─────────── */}
      <section className="section">
        <div className="wrap">
          <div className="sec-head sec-head--center reveal">
            <span className="kicker">{p.limits.kicker}</span>
            <h2 className="h2">{p.limits.title}</h2>
            <p className="lede">{p.limits.lede}</p>
          </div>

          <div className="grid grid--4">
            {p.limits.items.map((it) => (
              <div className="feat reveal" key={it.t}>
                <p className="feat__t" style={{ marginTop: 0 }}>
                  {it.t}
                </p>
                <p className="feat__p">{it.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── 问答 ─────────── */}
      <section className="section band">
        <div className="wrap">
          <div className="sec-head sec-head--center reveal">
            <span className="kicker">{p.faq.kicker}</span>
            <h2 className="h2">{p.faq.title}</h2>
          </div>
          <div className="reveal faq-block">
            <Faq groups={[{ items: faqItems }]} />
          </div>
        </div>
      </section>

      {/* ─────────── 结尾 ─────────── */}
      <section className="section">
        <div className="wrap">
          <div className="cta-band reveal">
            <h2 className="h2">{c.home.finalCta.title}</h2>
            <p className="lede" style={{ maxWidth: '52ch', marginInline: 'auto' }}>
              {c.home.finalCta.lede}
            </p>
            <div className="cta-band__btns">
              <Link className="btn btn--primary btn--lg" href={`${base}/premiere-pro-downgrader#top`}>
                {c.home.finalCta.btn}
                <ArrowRight />
              </Link>
              <Link className="btn btn--lg" href={`${base}/how-it-works`}>
                {c.home.finalCta.btn2}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
