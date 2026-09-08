import Link from 'next/link';
import { getDict, type Locale } from '@/lib/i18n';
import { landingPath } from '@/lib/landingPages';

type SearchLandingPageProps = {
  page: {
    slug: string;
    locale: Locale;
    h1: string;
    intro: string;
    sections: {
      title: string;
      body: string;
    }[];
    faq: {
      q: string;
      a: string;
    }[];
  };
};

export default function SearchLandingPage({ page }: SearchLandingPageProps) {
  const t = getDict(page.locale);
  const toolHref = page.locale === 'zh' ? '/' : '/en/';

  return (
    <main
      className="relative min-h-screen overflow-hidden px-5 py-12 text-[#f1f3f9] sm:px-8"
      lang={page.locale === 'zh' ? 'zh-CN' : 'en'}
    >
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_-10%,rgba(56,79,182,0.22),transparent_68%)]" />
        <div className="absolute inset-0 bg-grid" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[760px]">
        <nav className="mb-8 flex flex-wrap items-center justify-between gap-3 text-xs text-[#9aa1b6]">
          <Link className="font-semibold text-white/80 transition hover:text-white" href={toolHref}>
            {t.brand}
          </Link>
          <Link className="glass rounded-full px-3 py-1.5 font-semibold text-[#c3c9e2] transition hover:text-white" href={toolHref}>
            {page.locale === 'zh' ? '打开转换工具' : 'Open converter'}
          </Link>
        </nav>

        <header className="pb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9fb0ff]">
            {page.locale === 'zh' ? 'After Effects 工程兼容' : 'After Effects compatibility'}
          </p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
            {page.h1}
          </h1>
          <p className="mt-5 text-[15px] leading-7 text-[#a7adc0]">{page.intro}</p>
          <div className="mt-7">
            <Link className="neon-btn shine inline-flex rounded-xl px-5 py-3 text-sm font-bold text-white" href={toolHref}>
              {page.locale === 'zh' ? '立即降级 AEP 工程' : 'Downgrade an AEP file'}
            </Link>
          </div>
        </header>

        <article className="space-y-4">
          {page.sections.map((section) => (
            <section className="glass rounded-2xl px-6 py-6" key={section.title}>
              <h2 className="text-lg font-bold tracking-tight text-white">{section.title}</h2>
              <p className="mt-3 text-[13.5px] leading-7 text-[#9aa1b6]">{section.body}</p>
            </section>
          ))}
        </article>

        <section className="mt-10">
          <h2 className="text-lg font-bold tracking-tight text-white">
            {page.locale === 'zh' ? '常见问题' : 'Frequently Asked Questions'}
          </h2>
          <div className="mt-4 space-y-3">
            {page.faq.map((item) => (
              <details className="glass group rounded-2xl px-5 py-4" key={item.q}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[13.5px] font-bold text-white/90 marker:content-none">
                  <span>{item.q}</span>
                  <span className="shrink-0 text-indigo-300 transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-[12.5px] leading-7 text-[#8b93a8]">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <footer className="mt-10 border-t border-white/[0.07] pt-6">
          <p className="text-xs text-[#7d859c]">
            {page.locale === 'zh' ? '相关入口：' : 'Related pages: '}
            <Link className="text-indigo-200 transition hover:text-white" href={toolHref}>
              {t.brandShort}
            </Link>
            {' / '}
            <Link className="text-indigo-200 transition hover:text-white" href={landingPath(page)}>
              {page.h1}
            </Link>
          </p>
        </footer>
      </div>
    </main>
  );
}
