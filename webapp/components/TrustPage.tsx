import Link from 'next/link';
import { abs } from '@/lib/seo';
import { getDict } from '@/lib/i18n';
import { getTrustPages, trustPath, type TrustPage as TrustPageData } from '@/lib/trustPages';

export default function TrustPage({ page }: { page: TrustPageData }) {
  const t = getDict(page.locale);
  const homeHref = page.locale === 'zh' ? '/' : '/en/';
  const allTrustPages = getTrustPages(page.locale);
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: page.title,
      description: page.description,
      url: abs(trustPath(page)),
      inLanguage: page.locale === 'zh' ? 'zh-CN' : 'en-US',
      dateModified: page.updatedAt,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: page.locale === 'zh' ? '首页' : 'Home',
          item: abs(homeHref),
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: page.h1,
          item: abs(trustPath(page)),
        },
      ],
    },
  ];

  return (
    <main
      className="relative min-h-screen overflow-hidden px-5 py-10 text-[#f1f3f9] sm:px-8"
      lang={page.locale === 'zh' ? 'zh-CN' : 'en'}
    >
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="premium-mesh absolute inset-0" />
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_-10%,rgba(56,79,182,0.2),transparent_70%)]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[860px]">
        <nav className="top-console glass mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-3">
          <Link className="text-[13px] font-bold text-white transition hover:text-cyan-100" href={homeHref}>
            {t.brand}
          </Link>
          <Link className="neon-btn rounded-xl px-4 py-2 text-xs font-bold text-white" href={homeHref}>
            {page.locale === 'zh' ? '打开转换工具' : 'Open Converter'}
          </Link>
        </nav>

        <nav aria-label={page.locale === 'zh' ? '面包屑' : 'Breadcrumb'} className="mb-7 text-xs text-[#7d859c]">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link className="text-indigo-200 transition hover:text-white" href={homeHref}>
                {page.locale === 'zh' ? '首页' : 'Home'}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-white/70">
              {page.h1}
            </li>
          </ol>
        </nav>

        <header className="command-card glass-strong rounded-[28px] p-6 sm:p-8">
          <p className="text-[11px] font-semibold uppercase text-[#9fb0ff]">
            {page.locale === 'zh' ? '站点信息' : 'Site Information'}
          </p>
          <h1 className="mt-3 text-4xl font-black leading-tight text-white sm:text-5xl">{page.h1}</h1>
          <p className="mt-5 max-w-[680px] text-[15px] leading-7 text-[#a7adc0]">{page.intro}</p>
          <p className="mt-5 text-xs font-semibold text-[#6f7890]">
            {page.locale === 'zh' ? '最后更新：' : 'Last updated: '}
            <time dateTime={page.updatedAt}>{page.updatedAt}</time>
          </p>
        </header>

        <article className="mt-6 space-y-4">
          {page.sections.map((section) => (
            <section className="glass rounded-2xl px-6 py-6" key={section.title}>
              <h2 className="text-lg font-bold tracking-tight text-white">{section.title}</h2>
              <div className="mt-3 space-y-3">
                {section.body.map((paragraph) =>
                  paragraph.startsWith('GitHub repository:') || paragraph.startsWith('GitHub 仓库：') ? (
                    <p className="text-[13.5px] leading-7 text-[#9aa1b6]" key={paragraph}>
                      {paragraph.split('：')[0].split(':')[0]}:{' '}
                      <a className="text-indigo-200 transition hover:text-white" href="https://github.com/ShiyouQi888/AE-jiangji">
                        https://github.com/ShiyouQi888/AE-jiangji
                      </a>
                    </p>
                  ) : (
                    <p className="text-[13.5px] leading-7 text-[#9aa1b6]" key={paragraph}>
                      {paragraph}
                    </p>
                  )
                )}
              </div>
            </section>
          ))}
        </article>

        <nav className="glass mt-6 rounded-2xl px-6 py-5" aria-label={page.locale === 'zh' ? '站点信任页面' : 'Trust pages'}>
          <h2 className="text-lg font-bold tracking-tight text-white">
            {page.locale === 'zh' ? '站点信息页面' : 'Site Information Pages'}
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {allTrustPages.map((item) => (
              <Link
                className="rounded-full border border-white/[0.1] bg-white/[0.04] px-3 py-1.5 text-[12px] font-semibold text-[#c3c9e2] transition hover:border-indigo-300/40 hover:text-white"
                href={trustPath(item)}
                key={item.key}
              >
                {item.h1}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {jsonLd.map((item, index) => (
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
          key={index}
          type="application/ld+json"
        />
      ))}
    </main>
  );
}
