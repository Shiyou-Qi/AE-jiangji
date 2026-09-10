import Link from 'next/link';

import Faq from '@/components/Faq';
import { ArrowRight } from '@/components/Icons';
import JsonLd from '@/components/JsonLd';
import { getContent } from '@/lib/content';
import { ldCrumbs, ldFaq, pageMeta } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return pageMeta(lang, 'faq');
}

export default async function FaqPage({ params }) {
  const { lang } = await params;
  const c = getContent(lang);
  const f = c.faqPage;
  const base = `/${lang}`;

  const groups = [
    { id: 'general', h: f.groups.general.h, items: c.faqItems.general },
    { id: 'loss', h: f.groups.loss.h, items: c.faqItems.loss },
    { id: 'security', h: f.groups.security.h, items: c.faqItems.security },
    { id: 'billing', h: f.groups.billing.h, items: c.faqItems.billing },
  ];

  return (
    <>
      <JsonLd
        data={[
          ldCrumbs(lang, [
            { name: c.nav.home, path: '' },
            { name: c.nav.faq, path: '/faq' },
          ]),
          ldFaq(
            [
              ...c.faqItems.general,
              ...c.faqItems.loss,
              ...c.faqItems.security,
              ...c.faqItems.billing,
            ],
            lang
          ),
        ]}
      />
      <section className="hero" style={{ paddingBottom: 40 }}>

        <div className="wrap" style={{ position: 'relative' }}>
          <div className="faq-block faq-block--wide">
            <span className="kicker">{f.kicker}</span>
            <h1 className="h2" style={{ fontSize: 'clamp(30px, 4.6vw, 52px)' }}>
              {f.title}
            </h1>
            <p className="lede">{f.lede}</p>
          </div>
        </div>
      </section>

      <section style={{ paddingBottom: 80 }}>
        <div className="wrap">
          <div className="faq-block faq-block--wide">
            <Faq groups={groups} />
          </div>

          <div className="cta-band reveal" style={{ marginTop: 56 }}>
            <h2 className="h2">{c.home.finalCta.title}</h2>
            <p className="lede" style={{ maxWidth: '52ch', marginInline: 'auto' }}>
              {c.home.finalCta.lede}
            </p>
            <div className="cta-band__btns">
              <Link className="btn btn--primary btn--lg" href={`${base}/premiere-pro-downgrader`}>
                {c.home.finalCta.btn}
                <ArrowRight />
              </Link>
              <Link className="btn btn--lg" href={`${base}/after-effects-downgrader`}>
                {c.nav.afterEffects}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
