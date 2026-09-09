import TrustPage from '@/components/TrustPage';
import { buildTrustMetadata, getTrustPage } from '@/lib/trustPages';

const page = getTrustPage('en', 'privacy')!;

export const metadata = buildTrustMetadata(page);

export default function PrivacyPage() {
  return <TrustPage page={page} />;
}
