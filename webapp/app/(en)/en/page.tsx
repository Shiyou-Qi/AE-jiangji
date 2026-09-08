import Tool from '@/components/Tool';
import SeoContent from '@/components/SeoContent';
import { JsonLd, buildJsonLd } from '@/lib/seo';

export default function EnPage() {
  return (
    <Tool locale="en">
      <SeoContent locale="en" />
      <JsonLd data={buildJsonLd('en')} />
    </Tool>
  );
}
