import JsonLd from '@/components/JsonLd';
import LegalDoc from '@/components/LegalDoc';
import { getContent } from '@/lib/content';
import { ldCrumbs, ldWebPage, pageMeta } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return pageMeta(lang, 'privacy');
}

export default async function PrivacyPage({ params }) {
  const { lang } = await params;
  const c = getContent(lang);
  return (
    <>
      <JsonLd
        data={[
          ldCrumbs(lang, [
            { name: c.nav.home, path: '' },
            { name: c.legal.privacy.title, path: '/privacy' },
          ]),
          ldWebPage(lang, 'privacy'),
        ]}
      />
      <LegalDoc lang={lang} doc={c.legal.privacy} />
    </>
  );
}
