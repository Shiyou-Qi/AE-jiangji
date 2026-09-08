import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { localeHref, locales, type Locale } from '@/lib/i18n';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return locales.map((locale) => {
    const path = localeHref[locale as Locale];
    return {
      url: SITE_URL + path,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: locale === 'zh' ? 1 : 0.9,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l === 'zh' ? 'zh-CN' : 'en-US', SITE_URL + localeHref[l]])
        ),
      },
    };
  });
}
