import TrustPage from '@/components/TrustPage';
import { buildTrustMetadata, getTrustPage } from '@/lib/trustPages';

const page = getTrustPage('zh', 'about')!;

export const metadata = buildTrustMetadata(page);

export default function AboutPage() {
  return <TrustPage page={page} />;
}
