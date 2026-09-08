import { notFound } from 'next/navigation';
import SearchLandingPage from '@/components/SearchLandingPage';
import {
  buildLandingMetadata,
  getLandingPage,
  getLandingPages,
} from '@/lib/landingPages';

type PageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return getLandingPages('zh').map((page) => ({ slug: page.slug }));
}

export function generateMetadata({ params }: PageProps) {
  const page = getLandingPage('zh', params.slug);
  if (!page) return {};
  return buildLandingMetadata(page);
}

export default function ZhLandingPage({ params }: PageProps) {
  const page = getLandingPage('zh', params.slug);
  if (!page) notFound();

  return <SearchLandingPage page={page} />;
}
