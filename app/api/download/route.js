/** 取回暂存的转换结果。一次性：下载后立即从内存中删除。 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// 与 /api/convert 共享同一个进程内缓存
import { takeResult } from '../convert/store.js';

/**
 * HTTP 头只能承载 latin-1，中文文件名直接写进去会抛
 * "Cannot convert argument to a ByteString"。
 * 所以按 RFC 5987 走 filename*（UTF-8 百分号编码），再给一个纯 ASCII 的兜底名。
 */
function asciiFallback(name) {
  const stripped = name.replace(/[^\x20-\x7E]/g, '').replace(/[\s"\\/;]/g, '_');
  const core = stripped.replace(/^_+|_+$/g, '');
  return core.length >= 6 ? core : 'downgraded.prproj';
}

export async function GET(request) {
  const token = new URL(request.url).searchParams.get('token') || '';
  const hit = takeResult(token);

  if (!hit) {
    return new Response('Result expired or not found. Please convert again.', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  const disposition =
    `attachment; filename="${asciiFallback(hit.name)}"; ` +
    `filename*=UTF-8''${encodeURIComponent(hit.name)}`;

  return new Response(hit.bytes, {
    status: 200,
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Length': String(hit.bytes.length),
      'Content-Disposition': disposition,
      'Cache-Control': 'no-store',
    },
  });
}
