/**
 * 结构化数据注入器。
 *
 * 用 `<script type="application/ld+json">` 直出，不用 next/script ——
 * 搜索引擎爬虫读取的是原始 HTML，等 JS 加载再插就晚了。
 * 源码里必须用 dangerouslySetInnerHTML，否则 React 会把引号转义成实体，
 * JSON 就解析不出来了。
 */
export default function JsonLd({ data }) {
  const list = Array.isArray(data) ? data : [data];
  return (
    <>
      {list.filter(Boolean).map((d, i) => (
        <script
          key={d['@type'] || i}
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }}
        />
      ))}
    </>
  );
}
