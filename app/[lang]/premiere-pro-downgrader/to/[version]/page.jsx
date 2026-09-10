import { notFound } from 'next/navigation';

import LandingPage from '@/components/LandingPage';
import { landingPage, PR_SLUGS } from '@/lib/landing';
import { pageMeta } from '@/lib/seo';

/**
 * Premiere Pro 各目标版本的落地页：/zh/premiere-pro-downgrader/to/cs6 等。
 *
 * 这些页面存在的理由是关键词落点：搜「prproj 降到 cs6」的人，
 * 落在这一页比落在笼统的降级首页更对口，转化也更高。
 *
 * slug 直接取自 lib/landing.js 的 PR_SLUGS —— 不在路由里另算一遍，
 * 两处算法一旦漂移就会变成 404，而且测试也难发现。
 */

export function generateStaticParams() {
  return PR_SLUGS.map((version) => ({ version }));
}

/** 只预渲染上面这些 slug，其余一律 404，避免被任意路径探测 */
export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { lang, version } = await params;
  const page = landingPage(`pr:${version}`, lang);
  if (!page) return {};
  return pageMeta(lang, 'premiere', {
    path: page.path,
    title: page.title,
    desc: page.desc,
    keys: page.keys,
  });
}

export default async function PremiereVersionPage({ params }) {
  const { lang, version } = await params;
  const page = landingPage(`pr:${version}`, lang);
  if (!page) notFound();
  return <LandingPage lang={lang} page={page} />;
}
