import { getDict, type Locale } from '@/lib/i18n';
import { getLandingPages, landingPath } from '@/lib/landingPages';
import { getTrustPages, trustPath } from '@/lib/trustPages';

// 目标版本清单（与 wasm 引擎 targets_json 一致，静态渲染利于收录）
const VERSIONS = [
  { label: 'AE 2018', major: 15, stability: 'experimental' as const },
  { label: 'AE 2019', major: 16, stability: 'experimental' as const },
  { label: 'AE 2020', major: 17, stability: 'experimental' as const },
  { label: 'AE 2021', major: 18, stability: 'experimental' as const },
  { label: 'AE 2022', major: 22, stability: 'experimental' as const },
  { label: 'AE 2023', major: 23, stability: 'stable' as const },
  { label: 'AE 2024', major: 24, stability: 'stable' as const },
  { label: 'AE 2025', major: 25, stability: 'stable' as const },
  { label: 'AE 2026', major: 26, stability: 'stable' as const },
];

/**
 * SEO 正文区（服务端渲染，可被搜索引擎直接抓取）
 * 作为 children 传入客户端组件 Tool，保持交互与内容分离
 */
export default function SeoContent({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const landingLinks = getLandingPages(locale);
  const trustLinks = getTrustPages(locale);

  return (
    <section className="mt-16 space-y-12">
      {/* ===== 介绍 ===== */}
      <article className="glass rounded-2xl px-6 py-6">
        <h2 className="text-lg font-bold tracking-tight text-white">
          {t.seoIntroTitle}
        </h2>
        <p className="mt-3 text-[13px] leading-relaxed text-[#9aa1b6]">
          {t.seoIntroBody}
        </p>
      </article>

      {/* ===== 使用步骤 ===== */}
      <section>
        <SectionTitle title={t.howTitle} sub={t.howSub} />
        <ol className="mt-5 space-y-3">
          {t.howSteps.map((s, i) => (
            <li
              key={i}
              className="glass flex gap-4 rounded-2xl px-5 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-indigo-400/30 bg-indigo-400/10 text-[12px] font-bold tabular-nums text-indigo-300">
                {i + 1}
              </span>
              <div>
                <h3 className="text-[13.5px] font-bold text-white">{s.t}</h3>
                <p className="mt-1 text-[12.5px] leading-relaxed text-[#8b93a8]">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ===== 支持版本 ===== */}
      <section>
        <SectionTitle title={t.verTitle} sub={t.verSub} />
        <ul className="mt-5 grid grid-cols-3 gap-2.5 sm:grid-cols-5">
          {VERSIONS.map((v) => (
            <li
              key={v.major}
              className="glass rounded-xl px-3 py-3 text-center transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="text-[13px] font-bold text-white">{v.label}</div>
              <div className="mt-1 text-[10px] tabular-nums text-[#7a829b]">
                v{v.major}
              </div>
              <div
                className={`mt-1.5 text-[9.5px] font-semibold tracking-wide ${
                  v.stability === 'stable' ? 'text-emerald-300' : 'text-amber-300'
                }`}
              >
                {v.stability === 'stable' ? t.stable : t.experimental}
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[11.5px] leading-relaxed text-[#6f7890]">{t.verNote}</p>
      </section>

      {/* ===== FAQ ===== */}
      <section>
        <SectionTitle title={t.faqTitle} sub={t.faqSub} />
        <div className="mt-5 space-y-2.5">
          {t.faq.map((f, i) => (
            <details
              key={i}
              className="glass group rounded-2xl px-5 py-4 transition-all duration-300 hover:border-white/20"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[13.5px] font-bold text-white/90 marker:content-none">
                <span>{f.q}</span>
                <span className="shrink-0 text-indigo-300 transition-transform duration-300 group-open:rotate-45">
                  ＋
                </span>
              </summary>
              <p className="mt-3 text-[12.5px] leading-relaxed text-[#8b93a8]">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <nav className="glass rounded-2xl px-6 py-5" aria-label={locale === 'zh' ? '相关搜索入口' : 'Related search pages'}>
        <h2 className="text-lg font-bold tracking-tight text-white">
          {locale === 'zh' ? '相关搜索入口' : 'Related Search Pages'}
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {landingLinks.map((page) => (
            <a
              className="rounded-full border border-white/[0.1] bg-white/[0.04] px-3 py-1.5 text-[12px] font-semibold text-[#c3c9e2] transition hover:border-indigo-300/40 hover:text-white"
              href={landingPath(page)}
              key={page.slug}
            >
              {page.h1}
            </a>
          ))}
        </div>
      </nav>

      <nav className="glass rounded-2xl px-6 py-5" aria-label={locale === 'zh' ? '站点信息页面' : 'Site information pages'}>
        <h2 className="text-lg font-bold tracking-tight text-white">
          {locale === 'zh' ? '站点信息' : 'Site Information'}
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {trustLinks.map((page) => (
            <a
              className="rounded-full border border-white/[0.1] bg-white/[0.04] px-3 py-1.5 text-[12px] font-semibold text-[#c3c9e2] transition hover:border-indigo-300/40 hover:text-white"
              href={trustPath(page)}
              key={page.key}
            >
              {page.h1}
            </a>
          ))}
        </div>
      </nav>

      {/* ===== Footer ===== */}
      <footer className="border-t border-white/[0.07] pt-6 text-center">
        <p className="text-[11px] font-semibold tracking-wide text-white/70">
          {t.brand} · {t.footerCore}
        </p>
        <p className="mt-1.5 text-[11px] tracking-wide text-[#5a6278]">
          {t.footerPrivacy}
        </p>
      </footer>
    </section>
  );
}

function SectionTitle({ title, sub }: { title: string; sub: string }) {
  return (
    <div>
      <h2 className="text-lg font-bold tracking-tight text-white">{title}</h2>
      <p className="mt-1 text-[12px] text-[#7d859c]">{sub}</p>
    </div>
  );
}
