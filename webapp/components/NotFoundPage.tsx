import Link from 'next/link';
import { getDict, localeHref, type Locale } from '@/lib/i18n';

/** 404 页面（服务端渲染），两种语言各自挂在对应路由组的 not-found 上 */
export default function NotFoundPage({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#05060a] px-6 text-[#f1f3f9]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-5%,rgba(56,79,182,0.22),transparent_70%)]" />
        <div className="absolute -top-40 -left-40 h-[420px] w-[420px] aurora-blob aurora-a" />
        <div className="absolute top-[8%] -right-52 h-[460px] w-[460px] aurora-blob aurora-b" />
        <div className="absolute inset-0 bg-grid" />
      </div>

      <div className="relative z-10 text-center">
        <p className="text-gradient text-glow text-7xl font-extrabold tracking-tight">
          404
        </p>
        <h1 className="mt-4 text-xl font-bold text-white/90">
          {locale === 'zh' ? '页面不存在' : 'Page not found'}
        </h1>
        <p className="mt-2 text-sm text-[#8b93a8]">
          {locale === 'zh'
            ? '你访问的页面已被移动或从未存在。'
            : 'The page you are looking for has moved or never existed.'}
        </p>
        <Link
          href={localeHref[locale]}
          className="neon-btn mt-8 inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-bold text-white"
        >
          {locale === 'zh' ? '← 返回首页' : '← Back to home'}
        </Link>
      </div>

      <p className="relative z-10 mt-16 text-[11px] tracking-wide text-[#5a6278]">
        {t.brand} · {t.footerCore}
      </p>
    </main>
  );
}
