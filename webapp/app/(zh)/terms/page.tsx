import TrustPage from '@/components/TrustPage';
import { buildTrustMetadata, getTrustPage } from '@/lib/trustPages';

const page = getTrustPage('zh', 'terms')!;

export const metadata = buildTrustMetadata(page);

export default function TermsPage() {
  return <TrustPage page={page} />;
}
