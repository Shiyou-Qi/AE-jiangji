import { notFound } from 'next/navigation';

import LandingPage from '@/components/LandingPage';
import { AE_SLUGS, landingPage } from '@/lib/landing';
import { pageMeta } from '@/lib/seo';

/**
 * After Effects 各目标版本的落地页：/zh/after-effects-downgrader/to/2018 等。
 * 结构与 Premiere 那条完全对称，slug 同样取自 lib/landing.js。
 */

export function generateStaticParams() {
  return AE_SLUGS.map((version) => ({ version }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { lang, version } = await params;
  const page = landingPage(`ae:${version}`, lang);
  if (!page) return {};
  return pageMeta(lang, 'afterEffects', {
    path: page.path,
    title: page.title,
    desc: page.desc,
    keys: page.keys,
  });
}

export default async function AfterEffectsVersionPage({ params }) {
  const { lang, version } = await params;
  const page = landingPage(`ae:${version}`, lang);
  if (!page) notFound();
  return <LandingPage lang={lang} page={page} />;
}
