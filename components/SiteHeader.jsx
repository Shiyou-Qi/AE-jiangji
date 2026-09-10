'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import Logo from './Logo';
import { Close, Menu } from './Icons';
import { LANG_LABEL, LANGS, SITE } from '@/lib/site';

/** 去掉 /zh 或 /en 前缀，用于生成语言互链 */
function barePath(pathname) {
  return pathname.replace(/^\/(zh|en)(?=\/|$)/, '') || '';
}

export default function SiteHeader({ lang, nav }) {
  const pathname = usePathname() || '';
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const bare = barePath(pathname);
  const base = `/${lang}`;

  const items = [
    { href: '/', label: nav.home },
    { href: '/premiere-pro-downgrader', label: nav.premiere },
    { href: '/after-effects-downgrader', label: nav.afterEffects },
    { href: '/how-it-works', label: nav.how },
    { href: '/faq', label: nav.faq },
    { href: '/contact', label: nav.contact },
  ];

  const active = (href) => (href === '/' ? bare === '' : bare.startsWith(href));

  return (
    <header className={`header${stuck ? ' is-stuck' : ''}`}>
      <div className="wrap header__in">
        <Link className="brand" href={base} aria-label={SITE.brand}>
          <Logo />
        </Link>

        <nav className="nav" aria-label="primary">
          {items.slice(1).map((it) => (
            <Link key={it.href} href={base + it.href} data-active={active(it.href)}>
              {it.label}
            </Link>
          ))}
        </nav>

        <div className="header__end">
          <div className="lang" role="group" aria-label="language">
            {LANGS.map((code) => (
              <Link
                key={code}
                href={`/${code}${bare}`}
                hrefLang={code}
                data-active={code === lang}
                aria-current={code === lang ? 'true' : undefined}
              >
                {LANG_LABEL[code]}
              </Link>
            ))}
          </div>

          <Link className="btn btn--primary" href={`${base}/premiere-pro-downgrader`}>
            {nav.cta}
          </Link>

          <button
            type="button"
            className="burger"
            aria-label="menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <Close /> : <Menu />}
          </button>
        </div>
      </div>

      <div className="sheet" data-open={open}>
        <div className="wrap">
          {items.map((it) => (
            <Link key={it.href} href={base + it.href}>
              {it.label}
            </Link>
          ))}
          <Link className="btn btn--primary btn--block" href={`${base}/premiere-pro-downgrader`}>
            {nav.cta}
          </Link>
        </div>
      </div>
    </header>
  );
}
