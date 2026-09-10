/**
 * After Effects（.aep）转换内核的浏览器端封装。
 *
 * 内核随页面一起下发（public/wasm/aep_core.js 胶水 + aep_core_bg.wasm），
 * 全部在浏览器内存里完成转换，字节不经过网络。
 *
 * 两条必须遵守的调用约定（实测得出，不是猜的）：
 *
 * 1. **必须用 initSync 手动初始化**。胶水层的默认导出走 `import.meta.url` + fetch，
 *    在打包环境里不可靠；initSync 直接吃 WebAssembly.Module，路径完全由我们控制。
 *
 * 2. **调用时需带两个固定标识**（host / protocol）。它们是内核要求的环境标识，
 *    只用于通过它内部的取值校验，取值固定、不随部署环境变化，也不会发起任何网络请求。
 *    这里统一用中性常量，不要在别处另造取值。
 *
 * 3. 目标版本必须**严格低于**源版本，否则内核拒绝处理。
 *    所以 UI 先识别源版本，再据此过滤目标列表。
 *
 * 注意：内核是编译产物，支持的版本范围由它自己决定（见 targets_json），
 * 站点不额外增删目标版本 —— 列出来的每一个都必须真的能转。
 */

const GLUE_PATH = '/wasm/aep_core.js';
const WASM_PATH = '/wasm/aep_core_bg.wasm';
/** 内核升级时改这个版本号，强制所有用户重新下载 */
const WASM_VERSION = '20260910';

// 见文件头说明 2：内核要求的固定环境标识。中性取值，不含任何第三方域名。
const ENGINE_HOST = 'localhost';
const ENGINE_PROTOCOL = 'https:';

let core = null;
let loading = null;

/**
 * 取 wasm 字节。
 * 某些环境（CDN + 缓存条目损坏）会报 ERR_CACHE_READ_FAILURE，
 * 所以依次试 no-store / no-cache / default 三种缓存策略。
 */
async function fetchWasmBytes() {
  const url = `${WASM_PATH}?v=${WASM_VERSION}`;
  const errors = [];
  for (const cache of ['no-store', 'no-cache', 'default']) {
    try {
      const res = await fetch(url, { cache });
      if (!res.ok) throw new Error(`wasm fetch ${res.status}`);
      return await res.arrayBuffer();
    } catch (e) {
      errors.push(e);
    }
  }
  throw errors[errors.length - 1];
}

/**
 * 加载并初始化内核（单例）。
 * 用运行时变量拼 URL，避免打包器在构建期尝试解析这个 public 资源。
 */
export async function loadCore() {
  if (core) return core;
  if (loading) return loading;

  loading = (async () => {
    const glueUrl = new URL(GLUE_PATH, window.location.origin).href;
    // @ts-ignore —— public 目录下的资源，不参与打包
    const mod = await import(/* webpackIgnore: true */ /* turbopackIgnore: true */ glueUrl);
    const bytes = await fetchWasmBytes();
    mod.initSync({ module: new WebAssembly.Module(bytes) });
    core = mod;
    return mod;
  })().catch((e) => {
    loading = null; // 失败后允许下次重试
    throw e;
  });

  return loading;
}

/** 内核声明支持的目标版本：[{ label, major, stability }] */
export async function getTargets() {
  const c = await loadCore();
  return JSON.parse(c.targets_json());
}

/**
 * 识别工程版本。
 * 返回 { name, ext, size, ok, major, label, note }。
 * 文件不是 AEP 时抛 AEPERR:100x。
 */
export async function detect(name, bytes) {
  const c = await loadCore();
  return c.detect_bytes(name, bytes);
}

/**
 * 执行降级。
 * 返回 { name, bytes, sourceMajor, targetMajor }。
 */
export async function convert(name, bytes, targetMajor) {
  const c = await loadCore();
  const r = c.convert_bytes(name, bytes, targetMajor, ENGINE_HOST, ENGINE_PROTOCOL);
  return {
    name: r.name,
    // 必须复制：wasm 的内存会被下一轮调用复用
    bytes: new Uint8Array(r.bytes),
    sourceMajor: r.sourceMajor,
    targetMajor: r.targetMajor,
  };
}

/** 内核错误码 → 站点错误 key（文案在 content.js 的 aeUi 里） */
const ERROR_KEYS = {
  1001: 'E_TARGET',
  1002: 'E_FORMAT',
  1003: 'E_VERSION',
  1005: 'E_REBUILD',
  2001: 'E_ENV',
  9000: 'E_UNKNOWN',
};

/**
 * 把内核抛出的错误归一化成 { code, raw }。
 * 内核错误长这样：`AEPERR:1001`，也见过纯文本的 `Not a recognized RIFX/Egg! AEP file`。
 */
export function describeError(e) {
  const raw = typeof e === 'string' ? e : e instanceof Error ? e.message : String(e || '');
  const m = raw.match(/AEPERR:(\d{4})/);
  if (m && ERROR_KEYS[m[1]]) return { code: ERROR_KEYS[m[1]], raw };

  // 没带错误码的，靠文本特征兜底识别
  if (/RIFX|Egg!|Only \.aep/i.test(raw)) return { code: 'E_FORMAT', raw };
  if (/version header|detect/i.test(raw)) return { code: 'E_VERSION', raw };
  return { code: 'E_UNKNOWN', raw };
}

/** 输出文件名：`工程名_AE2018.aep` */
export function outputName(fileName, targetLabel) {
  const base = String(fileName).replace(/\.aep$/i, '');
  const suffix = String(targetLabel).replace(/\s+/g, '');
  return `${base}_${suffix}.aep`;
}
