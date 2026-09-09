import type { Metadata, Viewport } from 'next';
import '../globals.css';
import { buildMetadata } from '@/lib/seo';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = buildMetadata('zh');

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#05060a',
  colorScheme: 'dark',
};

export default function ZhLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <script
          async
          crossOrigin="anonymous"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6661674805945311"
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
