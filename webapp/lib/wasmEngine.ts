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

// wasm 错误码 → 中文描述（对应 talkae app.js 的 ERROR_DEFINITIONS）
const ERROR_DEFINITIONS: Record<string, string> = {
  '1001': '目标版本选择错误',
  '1002': '文件格式不支持',
  '1003': '工程版本识别失败',
  '1005': '结构化 AEP 重建失败',
  '2001': 'WASM 环境不匹配',
  '9000': '未知转换错误',
};

// 把 wasm 抛出的错误（字符串或 Error）转成友好信息
export function friendlyError(e: unknown): string {
  const raw = typeof e === 'string' ? e : e instanceof Error ? e.message : String(e || '');
  const m = raw.match(/AEPERR:(\d{4})/);
  if (m && ERROR_DEFINITIONS[m[1]]) {
    return `错误码 ${m[1]}：${ERROR_DEFINITIONS[m[1]]}`;
  }
  return raw || '转换失败';
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

// 转换
export async function convertBytes(
  name: string,
  data: Uint8Array,
  targetMajor: number
): Promise<WasmConvertResult> {
  const c = await loadWasmCore();
  const host = typeof window !== 'undefined' ? window.location.hostname || '' : '';
  const protocol = typeof window !== 'undefined' ? window.location.protocol || '' : '';
  const result = c.convert_bytes(name, data, targetMajor, host, protocol);
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
