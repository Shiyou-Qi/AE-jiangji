import Link from 'next/link';

import Logo from './Logo';
import { SITE } from '@/lib/site';

export default function SiteFooter({ lang, dict }) {
  const base = `/${lang}`;
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__in">
          <div className="footer__about">
            <div className="brand">
              <Logo height={28} />
            </div>
            <p>{dict.about}</p>
            {SITE.contactEmail ? (
              <p>
                <a href={`mailto:${SITE.contactEmail}`}>{dict.contact}</a>
              </p>
            ) : null}
          </div>

          {dict.cols.map((col) => (
            <div className="footer__col" key={col.h}>
              <p className="footer__h">{col.h}</p>
              <ul>
                {col.links.map((l) => (
                  <li key={l.href + l.t}>
                    <Link href={base + l.href}>{l.t}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer__bar">
          <span>
            © {SITE.since}–{year} {SITE.brand}. {dict.rights}
          </span>
          <span>{dict.legal}</span>
        </div>

        <p className="footer__note">{dict.note}</p>
      </div>
    </footer>
  );
}
