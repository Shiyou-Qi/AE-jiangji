import { notFound } from 'next/navigation';

import LandingPage from '@/components/LandingPage';
import { GUIDE_SLUGS, landingPage } from '@/lib/landing';
import { pageMeta } from '@/lib/seo';

/**
 * 说明型指南：/zh/guide/what-gets-lost 等。
 *
 * 与版本页的区别在意图：版本页接的是「我要降到 X」这种动作型搜索，
 * 指南接的是「降级会不会丢东西」「怎么查工程版本」这种问题型搜索。
 * 两类页面互相内链，把流量导到转换工具上。
 */

export function generateStaticParams() {
  return GUIDE_SLUGS.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { lang, slug } = await params;
  const page = landingPage(`guide:${slug}`, lang);
  if (!page) return {};
  return pageMeta(lang, 'home', {
    path: page.path,
    title: page.title,
    desc: page.desc,
    keys: page.keys,
  });
}

export default async function GuidePage({ params }) {
  const { lang, slug } = await params;
  const page = landingPage(`guide:${slug}`, lang);
  if (!page) notFound();
  return <LandingPage lang={lang} page={page} />;
}
