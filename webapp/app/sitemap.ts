import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { localeHref, locales, type Locale } from '@/lib/i18n';
import { getLandingPages, landingPath } from '@/lib/landingPages';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const corePages = locales.map((locale) => {
    const path = localeHref[locale as Locale];
    return {
      url: SITE_URL + path,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: locale === 'zh' ? 1 : 0.9,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l === 'zh' ? 'zh-CN' : 'en-US', SITE_URL + localeHref[l]])
        ),
      },
    };
  });

  const searchPages = getLandingPages().map((page) => ({
    url: SITE_URL + landingPath(page),
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: page.locale === 'zh' ? 0.72 : 0.68,
  }));

  return [...corePages, ...searchPages];
}
