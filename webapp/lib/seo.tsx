import type { Metadata } from 'next';
import { getDict, localeHref, locales, seo, type Locale } from './i18n';

// 站点地址：部署时通过 NEXT_PUBLIC_SITE_URL 覆盖（不带结尾斜杠）
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://aejiangji.vercel.app'
).replace(/\/+$/, '');

export const SITE_VERSION = '1.0.0';

export function abs(path: string) {
  return SITE_URL + (path.startsWith('/') ? path : '/' + path);
}

/** 生成某一语言的完整 Metadata（含 hreflang、OG、Twitter、canonical） */
export function buildMetadata(locale: Locale): Metadata {
  const s = seo[locale];
  const other = locales.filter((l) => l !== locale)[0];
  const languages: Record<string, string> = { 'x-default': abs(localeHref.zh) };
  for (const l of locales) languages[l === 'zh' ? 'zh-CN' : 'en-US'] = abs(localeHref[l]);

  return {
    metadataBase: new URL(SITE_URL),
    title: s.title,
    description: s.description,
    keywords: s.keywords,
    applicationName: s.siteName,
    authors: [{ name: 'Qi Shiyou', url: SITE_URL }],
    creator: 'Qi Shiyou',
    publisher: 'Qi Shiyou',
    category: 'Multimedia',
    manifest: '/manifest.webmanifest',
    icons: {
      icon: [
        { url: '/icon.svg', type: 'image/svg+xml' },
        { url: '/favicon.ico', sizes: 'any' },
      ],
      apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
      shortcut: ['/icon.svg'],
    },
    alternates: {
      canonical: localeHref[locale],
      languages,
    },
    openGraph: {
      type: 'website',
      url: abs(localeHref[locale]),
      siteName: s.siteName,
      title: s.title,
      description: s.description,
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      alternateLocale: locale === 'zh' ? ['en_US'] : ['zh_CN'],
      images: [
        {
          url: s.ogImage,
          secureUrl: s.ogImage,
          width: 1200,
          height: 630,
          alt: s.ogAlt,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: s.title,
      description: s.description,
      images: [{ url: s.ogImage, alt: s.ogAlt }],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    other: {
      'og:image:alt': s.ogAlt,
      'al:web:url': abs(localeHref[locale]),
      'lang-alt': localeHref[other],
    },
  };
}

/** 结构化数据：WebApplication + FAQPage + BreadcrumbList */
export function buildJsonLd(locale: Locale) {
  const s = seo[locale];
  const d = getDict(locale);
  const url = abs(localeHref[locale]);
  const software = {
    '@type': ['SoftwareApplication', 'WebApplication'],
    '@id': url + '#app',
    name: s.siteName,
    alternateName: d.brandShort,
    description: s.description,
    url,
    inLanguage: locale === 'zh' ? 'zh-CN' : 'en-US',
    applicationCategory: 'MultimediaApplication',
    applicationSubCategory: 'Video Editing Utility',
    operatingSystem: 'Any (Chrome, Edge, Firefox, Safari)',
    browserRequirements: 'Any modern web browser (Chrome, Edge, Firefox, Safari)',
    softwareVersion: SITE_VERSION,
    isAccessibleForFree: true,
    keywords: s.keywords.join(', '),
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    featureList: [
      d.features[0].title + ' — ' + d.features[0].desc,
      d.features[1].title + ' — ' + d.features[1].desc,
      d.features[2].title + ' — ' + d.features[2].desc,
    ],
    publisher: { '@type': 'Person', name: 'Qi Shiyou', url: SITE_URL },
  };

  const website = {
    '@type': 'WebSite',
    '@id': SITE_URL + '#website',
    url: SITE_URL,
    name: s.siteName,
    inLanguage: locale === 'zh' ? 'zh-CN' : 'en-US',
    publisher: { '@id': url + '#app' },
  };

  const faq = {
    '@type': 'FAQPage',
    '@id': url + '#faq',
    mainEntity: d.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const breadcrumb = {
    '@type': 'BreadcrumbList',
    '@id': url + '#breadcrumb',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: locale === 'zh' ? '首页' : 'Home',
        item: url,
      },
    ],
  };

  const howTo = {
    '@type': 'HowTo',
    '@id': url + '#howto',
    name: d.howTitle,
    description: d.howSub,
    inLanguage: locale === 'zh' ? 'zh-CN' : 'en-US',
    step: d.howSteps.map((st, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: st.t,
      text: st.d,
    })),
  };

  return [
    { '@context': 'https://schema.org', '@graph': [software, website, breadcrumb] },
    { '@context': 'https://schema.org', ...faq },
    { '@context': 'https://schema.org', ...howTo },
  ];
}

/** 在页面里输出 <script type="application/ld+json"> */
export function JsonLd({ data }: { data: unknown[] }) {
  return (
    <>
      {data.map((d, i) => (
        <script
          key={i}
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }}
        />
      ))}
    </>
  );
}
