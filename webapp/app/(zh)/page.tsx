import Tool from '@/components/Tool';
import SeoContent from '@/components/SeoContent';
import { JsonLd, buildJsonLd } from '@/lib/seo';

export default function ZhPage() {
  return (
    <Tool locale="zh">
      <SeoContent locale="zh" />
      <JsonLd data={buildJsonLd('zh')} />
    </Tool>
  );
}
