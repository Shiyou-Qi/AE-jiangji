import TrustPage from '@/components/TrustPage';
import { buildTrustMetadata, getTrustPage } from '@/lib/trustPages';

const page = getTrustPage('zh', 'contact')!;

export const metadata = buildTrustMetadata(page);

export default function ContactPage() {
  return <TrustPage page={page} />;
}
