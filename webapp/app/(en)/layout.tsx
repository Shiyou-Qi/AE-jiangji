import type { Metadata, Viewport } from 'next';
import '../globals.css';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata('en');

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#05060a',
  colorScheme: 'dark',
};

export default function EnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
