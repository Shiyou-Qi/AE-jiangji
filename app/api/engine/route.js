/**
 * 引擎状态与可用目标版本。
 *
 * 站点不自己硬编码版本表 —— 直接问降级引擎要，引擎说什么就是什么。
 * 引擎没起来时回落到静态版本表，让页面仍然可用（只是无法真正转换）。
 *
 * 只把浏览器需要的东西发出去：版本键与显示名。
 * 引擎返回里的内部字段（结构号、是否别名等）在服务端就剥掉，不下发。
 */

import { TARGET_VERSIONS, VERSION_TABLE } from '@/lib/site';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ENGINE_URL = (process.env.ENGINE_URL || 'http://127.0.0.1:8788').replace(/\/+$/, '');

/** 兜底版本表：与引擎的版本表保持一致，仅用于引擎离线时的展示 */
const FALLBACK_TARGETS = VERSION_TABLE.map((v) => ({ key: v.v, label: `Premiere Pro ${v.v}` }));

async function fetchJson(pathname, ms = 2500) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(`${ENGINE_URL}${pathname}`, {
      signal: ctrl.signal,
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`engine ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

/** 只保留版本键与显示名 —— 引擎的内部字段不下发到浏览器 */
function publicTargets(list) {
  return (Array.isArray(list) ? list : [])
    .filter((t) => t && t.key)
    .map((t) => ({ key: String(t.key), label: String(t.label || t.key) }));
}

export async function GET() {
  try {
    // 只取目标版本表。引擎的自检/内部统计不出服务端。
    const data = await fetchJson('/api/targets');
    const targets = publicTargets(data?.targets);

    return Response.json({
      ok: true,
      online: true,
      targets: targets.length ? targets : FALLBACK_TARGETS,
    });
  } catch {
    return Response.json({
      ok: true,
      online: false,
      targets: FALLBACK_TARGETS,
      total: TARGET_VERSIONS.length,
    });
  }
}
