/**
 * 降级转换：把上传的工程字节转发给降级引擎，拿回结果文件。
 *
 * 为什么不把引擎直接 import 进站点：
 *   引擎被刻意设计成**无状态服务**（每个请求只吃「形态 + 图」），
 *   因此它可以独立部署、独立扩容，或者干脆跑在用户自己的机器上。
 *   站点只通过 HTTP 与它对话，两边能分别部署。
 *
 * 流程：
 *   POST /api/convert?target=2021&safe=1   body = 工程字节
 *     → 引擎（meta 模式取回文件本体）
 *     → 结果暂存在内存 → 返回用户需要的少量元信息 + 下载 token
 *   GET  /api/download?token=…             → 取回文件字节（一次性）
 *
 * 只向浏览器回传用户真正要看的信息（目标版本、体积、耗时）。
 * 引擎的处理过程与内部字段一律不出服务端。
 */

import { putResult } from './store.js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const ENGINE_URL = (process.env.ENGINE_URL || 'http://127.0.0.1:8788').replace(/\/+$/, '');

/** 公测期的输入上限。超过这个体积建议用自托管引擎走命令行。 */
export const MAX_BYTES = 64 * 1024 * 1024;

/** 由原文件名推出结果文件名：client_v7.prproj → client_v7_2021.prproj */
function outputName(inputName, targetKey) {
  const cleaned = (inputName || 'project.prproj').replace(/[\\/:*?"<>|]/g, '_').slice(0, 120);
  const base = cleaned.replace(/\.prproj$/i, '') || 'project';
  return `${base}_${String(targetKey).toLowerCase()}.prproj`;
}

export async function POST(request) {
  const url = new URL(request.url);
  const target = (url.searchParams.get('target') || '2024').trim();
  const safe = url.searchParams.get('safe') === '1';
  const inputName = decodeURIComponent(request.headers.get('x-file-name') || '');

  let body;
  try {
    body = Buffer.from(await request.arrayBuffer());
  } catch {
    return Response.json({ ok: false, error: 'Could not read the upload.' }, { status: 400 });
  }

  if (!body.length) {
    return Response.json({ ok: false, code: 'E_EMPTY', error: 'Empty upload.' }, { status: 400 });
  }
  if (body.length > MAX_BYTES) {
    return Response.json(
      { ok: false, code: 'E_TOO_BIG', error: 'File too large', maxBytes: MAX_BYTES },
      { status: 413 }
    );
  }

  const qs = new URLSearchParams({ target, meta: '1' });
  if (safe) qs.set('safe', '1');

  let upstream;
  try {
    upstream = await fetch(`${ENGINE_URL}/api/convert?${qs}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream' },
      body,
      cache: 'no-store',
    });
  } catch {
    return Response.json(
      { ok: false, code: 'E_ENGINE_OFFLINE', error: 'Engine unreachable' },
      { status: 502 }
    );
  }

  const text = await upstream.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return Response.json(
      { ok: false, error: 'Engine returned an unreadable response.' },
      { status: 502 }
    );
  }

  if (!upstream.ok || data.ok === false) {
    const status = upstream.status >= 400 && upstream.status < 500 ? upstream.status : 500;
    return Response.json(
      { ok: false, code: data.code || null, error: data.error || 'Conversion failed.' },
      { status }
    );
  }

  const outBytes = Buffer.from(data.file || '', 'base64');
  if (!outBytes.length) {
    return Response.json({ ok: false, error: 'Engine returned no file.' }, { status: 502 });
  }

  const filename = outputName(inputName, data.target || target);
  const token = putResult(filename, outBytes);

  return Response.json({
    ok: true,
    token,
    filename,
    target: data.target || target,
    targetLabel: data.targetLabel || '',
    inSize: body.length,
    outSize: outBytes.length,
  });
}
