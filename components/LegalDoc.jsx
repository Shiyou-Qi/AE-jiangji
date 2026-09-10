import Link from 'next/link';

import { ArrowRight } from './Icons';
import { getContent } from '@/lib/content';

/** 隐私与服务条款共用同一版式：标题 + 更新日期 + 若干小节 */
export default function LegalDoc({ lang, doc }) {
  const c = getContent(lang);
  const base = `/${lang}`;

  return (
    <>
      <section className="hero legal-hero" style={{ paddingBottom: 32 }}>
        <div className="wrap legal-wrap">
          <h1 className="h2" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
            {doc.title}
          </h1>
          <p className="muted" style={{ marginTop: 12, fontSize: 14 }}>
            {doc.updated}
          </p>
        </div>
      </section>

      <section style={{ paddingBottom: 80 }}>
        <div className="wrap">
          <div className="prose prose--center legal-prose">
            {doc.blocks.map((b, i) => (
              <section key={b.h}>
                <h2 style={{ marginTop: i === 0 ? 0 : 40 }}>{b.h}</h2>
                {b.p ? <p>{b.p}</p> : null}
                {b.list?.length ? (
                  <ul>
                    {b.list.map((li) => (
                      <li key={li}>{li}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>

          <div className="reveal legal-actions">
            <Link className="btn" href={`${base}/faq`}>
              {c.nav.faq}
            </Link>
            <Link className="btn btn--primary" href={`${base}/premiere-pro-downgrader`}>
              {c.nav.cta}
              <ArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
