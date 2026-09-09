import TrustPage from '@/components/TrustPage';
import { buildTrustMetadata, getTrustPage } from '@/lib/trustPages';

const page = getTrustPage('en', 'disclaimer')!;

export const metadata = buildTrustMetadata(page);

export default function DisclaimerPage() {
  return <TrustPage page={page} />;
}
