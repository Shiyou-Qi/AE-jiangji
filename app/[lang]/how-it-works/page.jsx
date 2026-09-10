import Link from 'next/link';

import { Alert, ArrowRight, Bolt, Layers, Shield } from '@/components/Icons';
import JsonLd from '@/components/JsonLd';
import { getContent } from '@/lib/content';
import { ldCrumbs, ldHowTo, pageMeta } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return pageMeta(lang, 'how');
}

export default async function HowItWorksPage({ params }) {
  const { lang } = await params;
  const c = getContent(lang);
  const h = c.how;
  const base = `/${lang}`;

  const modeIcons = [Bolt, Shield];

  return (
    <>
      <JsonLd
        data={[
          ldCrumbs(lang, [
            { name: c.nav.home, path: '' },
            { name: c.nav.how, path: '/how-it-works' },
          ]),
          ldHowTo(lang, h.stages),
        ]}
      />
      <section className="hero" style={{ paddingBottom: 40 }}>

        <div className="wrap" style={{ position: 'relative', maxWidth: 820 }}>
          <span className="kicker">{h.kicker}</span>
          <h1 className="h2" style={{ fontSize: 'clamp(30px, 4.6vw, 52px)' }}>
            {h.title}
          </h1>
          <p className="lede">{h.lede}</p>
        </div>
      </section>

      {/* ─────────── 四个阶段 ─────────── */}
      <section style={{ paddingBottom: 72 }}>
        <div className="wrap">
          <div className="grid grid--2">
            {h.stages.map((s, i) => (
              <div className="card reveal" key={s.t}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                  <span
                    className="step__n"
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 12,
                      fontSize: 16,
                      color: 'var(--txt)',
                      background: 'var(--surface-3)',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    style={{
                      flex: 1,
                      height: 1,
                      background: 'var(--line-2)',
                    }}
                    aria-hidden="true"
                  />
                </div>
                <h3 className="h3">{s.t}</h3>
                <p className="card__p">{s.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── 两种模式 ─────────── */}
      <section className="section band">
        <div className="wrap">
          <div className="sec-head sec-head--center reveal">
            <span className="kicker">{h.modes.kicker}</span>
            <h2 className="h2">{h.modes.title}</h2>
          </div>

          <div className="grid grid--2">
            {h.modes.items.map((it, i) => {
              const Ico = modeIcons[i] || Layers;
              return (
                <div className="card card--tool reveal" key={it.t}>
                  <span className="feat__ico">
                    <Ico />
                  </span>
                  <h3 className="h3" style={{ marginTop: 18 }}>
                    {it.t}
                  </h3>
                  <p className="card__p">{it.p}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────── 关于可靠性 ─────────── */}
      <section className="section">
        <div className="wrap">
          <div className="split" style={{ alignItems: 'start' }}>
            <div className="reveal">
              <span className="kicker">{h.honesty.kicker}</span>
              <h2 className="h2">{h.honesty.title}</h2>
            </div>
            <div className="prose reveal">
              {h.honesty.body.map((p, i) => (
                <p key={i} style={{ marginTop: i === 0 ? 0 : 16 }}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── 备份提醒 ─────────── */}
      <section className="section band" style={{ paddingTop: 72 }}>
        <div className="wrap">
          <div className="notice reveal" style={{ maxWidth: 900 }}>
            <span className="notice__ico">
              <Alert />
            </span>
            <div>
              <p style={{ color: '#fcd34d', fontWeight: 650, marginBottom: 6 }}>{h.backup.title}</p>
              <p>{h.backup.body}</p>
            </div>
          </div>

          <div className="cta-band reveal" style={{ marginTop: 44 }}>
            <h2 className="h2">{c.home.finalCta.title}</h2>
            <div className="cta-band__btns">
              <Link className="btn btn--primary btn--lg" href={`${base}/premiere-pro-downgrader`}>
                {c.home.finalCta.btn}
                <ArrowRight />
              </Link>
              <Link className="btn btn--lg" href={`${base}/faq`}>
                {c.nav.faq}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
