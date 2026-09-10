/**
 * 转换结果的进程内暂存。
 *
 * 用「暂存 + token 下载」而不是「把文件塞进响应体的 base64」，
 * 是因为前者能让浏览器用原生下载（正确的文件名、不占 JS 堆内存）。
 * 引擎本身保持无状态，这份缓存只存在于站点这一侧、且会自动过期。
 */

/** 结果保留 10 分钟 */
const TTL_MS = 10 * 60 * 1000;
/** 同时最多保留 6 份结果 */
const MAX_ENTRIES = 6;

/** @type {Map<string, { name: string, bytes: Buffer, expires: number }>} */
const store = new Map();

function sweep(now) {
  for (const [k, v] of store) if (v.expires < now) store.delete(k);
}

/** 存入一份结果，返回下载用的 token */
export function putResult(name, bytes) {
  const now = Date.now();
  sweep(now);
  while (store.size >= MAX_ENTRIES) store.delete(store.keys().next().value);

  const token = `${now.toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
  store.set(token, { name, bytes, expires: now + TTL_MS });
  return token;
}

/** 取出并删除 */
export function takeResult(token) {
  if (!token) return null;
  const now = Date.now();
  sweep(now);
  const hit = store.get(token);
  if (!hit || hit.expires < now) return null;
  store.delete(token);
  return hit;
}
