import ContactForm from '@/components/ContactForm';
import JsonLd from '@/components/JsonLd';
import { getContent } from '@/lib/content';
import { ldCrumbs, ldWebPage, pageMeta } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return pageMeta(lang, 'contact');
}

export default async function ContactPage({ params }) {
  const { lang } = await params;
  const c = getContent(lang);
  const page = c.contact;

  return (
    <>
      <JsonLd
        data={[
          ldCrumbs(lang, [
            { name: c.nav.home, path: '' },
            { name: c.nav.contact, path: '/contact' },
          ]),
          ldWebPage(lang, 'contact'),
        ]}
      />

      <section className="hero contact-hero" style={{ paddingBottom: 40 }}>
        <div className="wrap contact-wrap">
          <span className="kicker">{page.kicker}</span>
          <h1 className="h2" style={{ fontSize: 'clamp(30px, 4.6vw, 52px)' }}>
            {page.title}
          </h1>
          <p className="lede">{page.lede}</p>
        </div>
      </section>

      <section style={{ paddingBottom: 80 }}>
        <div className="wrap contact-layout">
          <aside className="contact-side reveal">
            <h2 className="h3">{page.directTitle}</h2>
            <div className="contact-reasons">
              {page.directItems.map((item) => (
                <div className="feat" key={item.t}>
                  <p className="feat__t" style={{ marginTop: 0 }}>
                    {item.t}
                  </p>
                  <p className="feat__p">{item.p}</p>
                </div>
              ))}
            </div>
          </aside>

          <div className="reveal">
            <ContactForm copy={page.form} />
          </div>
        </div>
      </section>
    </>
  );
}
