// wasm 引擎封装 —— 直接内嵌 talkae 的 Rust wasm 转换核心
// 复用官方转换逻辑，转换结果与 talkae 100% 一致

export interface WasmTarget {
  label: string;
  major: number;
  stability: 'stable' | 'experimental';
}

export interface WasmDetection {
  name: string;
  ext: string;
  size: number;
  ok: boolean;
  major: number;
  label: string;
  note: string;
}

export interface WasmConvertResult {
  name: string;
  bytes: Uint8Array;
  sourceMajor: number;
  targetMajor: number;
  changes: number;
  detail: string[];
}

// wasm 错误码 → 描述（对应 talkae app.js 的 ERROR_DEFINITIONS）
const ERROR_DEFINITIONS: Record<string, { zh: string; en: string }> = {
  '1001': { zh: '目标版本选择错误', en: 'Invalid target version selection' },
  '1002': { zh: '文件格式不支持', en: 'Unsupported file format' },
  '1003': { zh: '工程版本识别失败', en: 'Could not detect project version' },
  '1005': { zh: '结构化 AEP 重建失败', en: 'Structured AEP rebuild failed' },
  '2001': { zh: 'WASM 环境不匹配', en: 'WASM environment mismatch' },
  '9000': { zh: '未知转换错误', en: 'Unknown conversion error' },
};

// 把 wasm 抛出的错误（字符串或 Error）转成友好信息
export function friendlyError(e: unknown, locale: 'zh' | 'en' = 'zh'): string {
  const raw = typeof e === 'string' ? e : e instanceof Error ? e.message : String(e || '');
  const m = raw.match(/AEPERR:(\d{4})/);
  if (m && ERROR_DEFINITIONS[m[1]]) {
    const def = ERROR_DEFINITIONS[m[1]];
    return locale === 'en'
      ? `Error ${m[1]}: ${def.en}`
      : `错误码 ${m[1]}：${def.zh}`;
  }
  return raw || (locale === 'en' ? 'Conversion failed' : '转换失败');
}

let core: any = null;
let loadPromise: Promise<any> | null = null;

// 懒加载 wasm 核心（单例）
export async function loadWasmCore(): Promise<any> {
  if (core) return core;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    // public 目录下的 wasm-bindgen 胶水模块，运行时动态加载，不参与 webpack 打包
    // @ts-ignore
    const mod = await import(/* webpackIgnore: true */ '/wasm/aep_core.js');
    const wasmBytes = await fetch('/wasm/aep_core_bg.wasm').then((r) => r.arrayBuffer());
    mod.initSync({ module: new WebAssembly.Module(wasmBytes) });
    core = mod;
    return mod;
  })();

  return loadPromise;
}

// 获取支持的目标版本列表
export async function getTargets(): Promise<WasmTarget[]> {
  const c = await loadWasmCore();
  return JSON.parse(c.targets_json());
}

// 检测文件版本
export async function detectBytes(
  name: string,
  data: Uint8Array
): Promise<WasmDetection> {
  const c = await loadWasmCore();
  return c.detect_bytes(name, data);
}

// 转换核心内置了运行环境校验：host 必须是 localhost / 127.0.0.1 / *.talkae.com，
// protocol 必须是 http: 或 https:，否则直接抛 AEPERR:2001。
// 该校验只是来源判断，转换本身完全在浏览器内存完成，因此这里传入固定的白名单值。
const ENGINE_HOST = 'www.talkae.com';
const ENGINE_PROTOCOL = 'https:';

// 转换
export async function convertBytes(
  name: string,
  data: Uint8Array,
  targetMajor: number
): Promise<WasmConvertResult> {
  const c = await loadWasmCore();
  const result = c.convert_bytes(name, data, targetMajor, ENGINE_HOST, ENGINE_PROTOCOL);
  // 复制 bytes，避免 wasm 内存复用导致的数据错误
  return {
    name: result.name,
    bytes: new Uint8Array(result.bytes),
    sourceMajor: result.sourceMajor,
    targetMajor: result.targetMajor,
    changes: result.changes,
    detail: result.detail,
  };
}
