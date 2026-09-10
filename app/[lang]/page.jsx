import Link from 'next/link';

import { AeIcon, PrIcon } from '@/components/AdobeIcons';
import Faq from '@/components/Faq';
import Marquee from '@/components/Marquee';
import {
  ArrowRight,
  Bolt,
  Check,
  Cpu,
  Layers,
  Shield,
  TickCircle,
} from '@/components/Icons';
import JsonLd from '@/components/JsonLd';
import { getContent } from '@/lib/content';
import { ldApp, ldOrg, ldSite, pageMeta } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return pageMeta(lang, 'home');
}

export default async function HomePage({ params }) {
  const { lang } = await params;
  const c = getContent(lang);
  const h = c.home;
  const base = `/${lang}`;

  // 首页只放最关键的五条问答，完整清单在 /faq
  const faqPreview = [
    c.faqItems.general[0],
    c.faqItems.general[1],
    c.faqItems.loss[0],
    c.faqItems.security[0],
    c.faqItems.billing[0],
  ].filter(Boolean);

  const whyIcons = [Layers, Shield, Bolt, Cpu];

  return (
    <>
      <JsonLd data={[ldSite(lang), ldOrg(), ldApp(lang)]} />
      {/* ─────────── 首屏 ─────────── */}
      <section className="hero">

        <div className="wrap hero__in">
          <div className="hero__copy">
            <span className="kicker">{h.hero.badge}</span>
            <h1 className="h1 hero__title">
              {h.hero.title}
              {/*
                中文标题的断行按语义定死（「降级到」不能和它后面断开）；
                英文交给 text-wrap: balance 自己平衡，硬插换行反而会出现孤行。
              */}
              {lang === 'zh' ? <br className="hero-br" /> : ' '}
              <span className="accent-text">{h.hero.titleAccent}</span>
            </h1>
            <p className="lede">{h.hero.lede}</p>

            <div className="hero__cta">
              <Link className="btn btn--primary btn--lg" href={`${base}/premiere-pro-downgrader`}>
                {h.hero.ctaPrimary}
                <ArrowRight />
              </Link>
              <Link className="btn btn--lg" href={`${base}/after-effects-downgrader`}>
                {h.hero.ctaSecondary}
              </Link>
            </div>

            <div className="hero__trust">
              {h.hero.trust.map((t) => (
                <span key={t}>
                  <TickCircle />
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="hero-visual reveal">
            <img src="/hero/downgrade-complete.png" alt={h.mock.aria} />
          </div>
        </div>
      </section>

      {/* ─────────── 版本跑马灯 ─────────── */}
      <Marquee />

      {/* ─────────── 关键数字 ─────────── */}
      <section className="section section--tight">
        <div className="wrap">
          <div className="stats reveal">
            {h.stats.map((s) => (
              <div className="stat" key={s.l}>
                <p className="stat__v accent-text">{s.v}</p>
                <p className="stat__l">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── 两条产品线 ─────────── */}
      <section className="section" id="tools">
        <div className="wrap">
          <div className="sec-head sec-head--center reveal">
            <span className="kicker">{h.tools.kicker}</span>
            <h2 className="h2">{h.tools.title}</h2>
            <p className="lede">{h.tools.lede}</p>
          </div>

          <div className="grid grid--2">
            {/* Premiere Pro —— 本站自带、可直接使用 */}
            <article className="card card--tool reveal">
              <div className="card__top">
                <span className="card__ico card__ico--pr">
                  <PrIcon size={46} />
                </span>
                <span className="tag tag--ok">{h.tools.pr.badge}</span>
              </div>
              <h3 className="h3">{h.tools.pr.name}</h3>
              <p className="card__p">{h.tools.pr.desc}</p>
              <ul className="card__list">
                {h.tools.pr.features.map((f) => (
                  <li key={f}>
                    <span style={{ color: 'var(--pr)' }}>
                      <Check size={15} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="card__foot">
                <Link className="btn btn--primary btn--block" href={`${base}/premiere-pro-downgrader`}>
                  {h.tools.pr.cta}
                  <ArrowRight />
                </Link>
              </div>
            </article>

            {/* After Effects —— 站内原生转换器，全本地处理 */}
            <article className="card card--tool reveal">
              <div className="card__top">
                <span className="card__ico card__ico--ae">
                  <AeIcon size={46} />
                </span>
                <span className="tag tag--ok">{h.tools.ae.badge}</span>
              </div>
              <h3 className="h3">{h.tools.ae.name}</h3>
              <p className="card__p">{h.tools.ae.desc}</p>
              <ul className="card__list">
                {h.tools.ae.features.map((f) => (
                  <li key={f}>
                    <span style={{ color: 'var(--ae)' }}>
                      <Check size={15} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="card__foot">
                <Link
                  className="btn btn--primary btn--block"
                  href={`${base}/after-effects-downgrader`}
                >
                  {h.tools.ae.cta}
                  <ArrowRight />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ─────────── 三步 ─────────── */}
      <section className="section" id="how">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="kicker">{h.how.kicker}</span>
            <h2 className="h2">{h.how.title}</h2>
            <p className="lede">{h.how.lede}</p>
          </div>

          <div className="steps reveal">
            {h.how.steps.map((s, i) => (
              <div className="step" key={s.t}>
                <span className="step__n">{i + 1}</span>
                <p className="step__t">{s.t}</p>
                <p className="step__p">{s.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── 为什么可靠 ─────────── */}
      <section className="section band">
        <div className="wrap">
          <div className="sec-head sec-head--center reveal">
            <span className="kicker">{h.why.kicker}</span>
            <h2 className="h2">{h.why.title}</h2>
            <p className="lede">{h.why.lede}</p>
          </div>

          <div className="grid grid--4">
            {h.why.items.map((it, i) => {
              const Ico = whyIcons[i] || Layers;
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

      {/* ─────────── 使用场景 ─────────── */}
      <section className="section">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="kicker">{h.cases.kicker}</span>
            <h2 className="h2">{h.cases.title}</h2>
          </div>

          <div className="grid grid--4">
            {h.cases.items.map((it) => (
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
      <section className="section">
        <div className="wrap">
          <div className="sec-head sec-head--center reveal">
            <span className="kicker">{h.faq.kicker}</span>
            <h2 className="h2">{h.faq.title}</h2>
          </div>

          <div className="reveal faq-block">
            <Faq groups={[{ items: faqPreview }]} />
          </div>

          <div className="reveal sec-actions--center" style={{ marginTop: 24 }}>
            <Link className="btn btn--quiet" href={`${base}/faq`}>
              {h.faq.more}
              <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────── 结尾号召 ─────────── */}
      <section className="section section--tight">
        <div className="wrap">
          <div className="cta-band reveal">
            <h2 className="h2">{h.finalCta.title}</h2>
            <p className="lede" style={{ maxWidth: '56ch', marginInline: 'auto' }}>
              {h.finalCta.lede}
            </p>
            <div className="cta-band__btns">
              <Link className="btn btn--primary btn--lg" href={`${base}/premiere-pro-downgrader`}>
                {h.finalCta.btn}
                <ArrowRight />
              </Link>
              <Link className="btn btn--lg" href={`${base}/how-it-works`}>
                {h.finalCta.btn2}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
