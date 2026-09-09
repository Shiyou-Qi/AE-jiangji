'use client';

import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import ParticleField from '@/components/ParticleField';
import {
  getTargets,
  detectBytes,
  convertBytes,
  friendlyError,
  type WasmTarget,
} from '@/lib/wasmEngine';
import {
  getDict,
  htmlLang,
  localeHref,
  localeLabel,
  type Locale,
} from '@/lib/i18n';

/* ============================================================
   图标（内联 SVG，线性风格）
============================================================ */
function Icon({ d, className = 'w-5 h-5' }: { d: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d={d} />
    </svg>
  );
}

const I = {
  folder: 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z',
  upload:
    'M12 16V4m0 0 4 4m-4-4-4 4 M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2',
  check: 'M20 6 9 17l-5-5',
  x: 'M18 6 6 18M6 6l12 12',
  bolt: 'M13 2 4 14h6l-1 8 9-12h-6l1-8z',
  arrow: 'M5 12h14m-6-6 6 6-6 6',
  file: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z M14 2v6h6',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  cpu: 'M9 9h6v6H9zM4 6h2v2H4zM4 10h2v2H4zM4 14h2v2H4zM18 6h2v2h-2zM18 10h2v2h-2zM18 14h2v2h-2zM9 18h2v2H9zM13 18h2v2h-2zM5 3v2M9 3v2M13 3v2M17 3v2M5 19v2M9 19v2M13 19v2M17 19v2M3 5h2M3 9h2M3 13h2M3 17h2M19 5h2M19 9h2M19 13h2M19 17h2',
  layers: 'M12 2 2 7l10 5 10-5-10-5zM2 12l10 5 10-5M2 17l10 5 10-5',
  lock: 'M7 10V8a5 5 0 0 1 10 0v2M6 10h12v10H6z',
  globe:
    'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3.6 9h16.8M3.6 15h16.8M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z',
};

/* ============================================================
   状态类型
============================================================ */
type FileState = {
  name: string;
  size: number;
  data: Uint8Array;
  sourceMajor: number | null;
  label: string;
  note: string;
};

type ResultState = {
  ok: boolean;
  message: string;
  detail?: string[];
  outName?: string;
};

const stableColor = '#34d399';
const experimentalColor = '#f59e0b';

export default function Tool({
  locale,
  children,
}: {
  locale: Locale;
  children?: React.ReactNode;
}) {
  const t = getDict(locale);

  const [targets, setTargets] = useState<WasmTarget[]>([]);
  const [engineReady, setEngineReady] = useState(false);
  const [engineError, setEngineError] = useState('');
  const [file, setFile] = useState<FileState | null>(null);
  const [selectedMajor, setSelectedMajor] = useState<number | null>(null);
  const [result, setResult] = useState<ResultState | null>(null);
  const [converting, setConverting] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const list = await getTargets();
        setTargets(list);
        setEngineReady(true);
      } catch (e) {
        setEngineError(e instanceof Error ? e.message : t.engineFailFallback);
      }
    })();
  }, [t.engineFailFallback]);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files);
      const f = list.find((x) => /\.aep$/i.test(x.name));
      if (!f) {
        setResult({ ok: false, message: t.errPickAep });
        return;
      }
      setDetecting(true);
      setResult(null);
      const buf = new Uint8Array(await f.arrayBuffer());
      const det = await detectBytes(f.name, buf);
      setFile({
        name: f.name,
        size: f.size,
        data: buf,
        sourceMajor: det.ok ? det.major : null,
        label: det.label,
        note: det.note,
      });
      setSelectedMajor(null);
      setDetecting(false);
    },
    [t.errPickAep]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const targetState = useMemo(() => {
    if (!file) return null;
    return (major: number): 'available' | 'newer' | 'same' | 'unsupported-source' => {
      if (file.sourceMajor === null) return 'unsupported-source';
      if (major === file.sourceMajor) return 'same';
      if (major > file.sourceMajor) return 'newer';
      return 'available';
    };
  }, [file]);

  const formatSize = (n: number) => {
    if (n < 1024) return n + ' B';
    if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
    return (n / 1024 / 1024).toFixed(2) + ' MB';
  };

  const convert = useCallback(async () => {
    if (!file || selectedMajor === null) return;
    setConverting(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 260)); // 保留一点引擎启动动画
    try {
      const res = await convertBytes(file.name, file.data, selectedMajor);
      const blob = new Blob([res.bytes], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = res.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      setResult({
        ok: true,
        message: t.genDonePrefix + res.name,
        detail: res.detail,
        outName: res.name,
      });
    } catch (e) {
      setResult({ ok: false, message: friendlyError(e, locale) });
    } finally {
      setConverting(false);
    }
  }, [file, selectedMajor, t.genDonePrefix, locale]);

  const sourceIsValid =
    file?.sourceMajor !== null && file?.sourceMajor !== undefined;

  return (
    <main
      className="home-shell relative min-h-screen overflow-hidden text-[#f1f3f9]"
      lang={htmlLang[locale]}
    >
      {/* ===== 背景装饰 ===== */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[#070912]" />
        <div className="absolute inset-0 bg-grid" />
      </div>

      <ParticleField />

      <div className="relative z-10 flex min-h-screen flex-col items-center px-5 pb-16 pt-7 sm:px-8 lg:pt-10">
        <div className="home-enter w-full max-w-[880px]">
          {/* ===== 顶部导航 ===== */}
          <nav className="top-console glass flex items-center justify-between gap-4 rounded-2xl px-4 py-4">
            <div className="flex min-w-0 items-center gap-3.5">
              <div className="brand-core flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl text-white sm:h-16 sm:w-16">
                <img
                  src="/logo_icon.png"
                  alt={t.brand}
                  className="h-full w-full object-cover"
                  width="64"
                  height="64"
                />
              </div>
              <div className="min-w-0">
                <p className="text-[15px] font-black text-white">{t.brand}</p>
                <p className="mt-0.5 truncate text-[11px] font-semibold text-[#8993b2]">{t.badge}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <LangSwitch locale={locale} />
            </div>
          </nav>

          {/* ===== 步骤进度条（替代侧栏控制台） ===== */}
          <ProgressStepper
            engineReady={engineReady}
            fileReady={!!file}
            targetReady={selectedMajor !== null}
            resultOk={result?.ok ?? false}
            locale={locale}
          />

          {/* ===== Hero ===== */}
          <header className="mt-6 flex flex-col gap-5 sm:mt-8 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
            <div className="min-w-0 flex-1">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#303855] bg-[#12182a] px-3.5 py-1.5 text-[11px] font-semibold text-[#c8d1ff]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-300 opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-200" />
                </span>
                {locale === 'zh' ? 'AEP 结构化转换器' : 'AEP STRUCTURE CONVERTER'}
              </span>
              <HeroTitle locale={locale} />
              <p className="mt-4 max-w-[560px] text-[15px] leading-7 text-[#a7adc0]">
                {t.heroSubBefore}{' '}
                <span className="rounded-md border border-[#303855] bg-[#151b2c] px-1.5 py-0.5 text-white/90">
                  .aep
                </span>{' '}
                {t.heroSubAfter}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2 self-start rounded-2xl border border-[#294338] bg-[#102119] px-3 py-2 text-[11px] font-semibold text-emerald-200 sm:self-end">
              <Icon d={I.lock} className="h-3.5 w-3.5" />
              <span>{locale === 'zh' ? '文件不上传 · 全程本地' : 'No upload · 100% local'}</span>
            </div>
          </header>

          {/* ===== 关键指标 chips（4 个均匀） ===== */}
          <div className="mt-7 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
            <Metric label={locale === 'zh' ? '运行方式' : 'Runtime'} value={locale === 'zh' ? '浏览器本地' : 'In browser'} />
            <Metric label={locale === 'zh' ? '目标范围' : 'Targets'} value="AE 2018-2026" />
            <Metric label={locale === 'zh' ? '上传状态' : 'Upload'} value={locale === 'zh' ? '0 字节' : '0 bytes'} />
            <Metric label={locale === 'zh' ? '处理耗时' : 'Latency'} value={locale === 'zh' ? '< 1 秒' : '< 1 sec'} />
          </div>

          {/* ===== 引擎错误提示 ===== */}
          {engineError && (
            <div className="result-err glass mt-6 rounded-2xl border px-5 py-4">
              <p className="text-sm text-red-200">
                {t.engineFailPrefix}
                {engineError}
              </p>
            </div>
          )}

          {/* ===== 主工作区：导入 + 选择 + 转换（单列） ===== */}
          <div className="mt-12 space-y-10">
            {/* 01 导入工程 */}
            <section>
              <StepLabel n="01" title={t.step1} />
              <div
                role="button"
                tabIndex={0}
                aria-label={t.dropTitle}
                onClick={() => inputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={onDrop}
                style={
                  dragActive
                    ? {
                        background: '#5b6ee1',
                      }
                    : undefined
                }
                className={`group relative mt-3 cursor-pointer select-none rounded-3xl border-2 border-[#3d4d7b] bg-[#151d33] p-[2px] shadow-[0_24px_80px_-44px_rgba(91,110,225,0.85)] transition-all duration-300 hover:border-[#6378ee] ${
                  dragActive ? 'scale-[1.012]' : file ? '' : 'hover:scale-[1.006]'
                } ${file && !converting && !dragActive ? 'flow-border' : ''}`}
              >
                <div
                  className={`relative overflow-hidden rounded-[calc(1.5rem-3px)] border border-dashed border-[#5a6fae] px-6 py-11 text-center transition-all duration-300 sm:py-12 ${
                    dragActive
                      ? 'bg-[#121b35]'
                      : 'bg-[#101827] hover:bg-[#121b30]'
                  }`}
                >
                  {dragActive && (
                    <div className="scan-beam pointer-events-none absolute inset-x-0 top-0 h-1 bg-[#5b6ee1]/70" />
                  )}

                  {detecting ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative">
                        <div className="h-12 w-12 animate-spin rounded-full border-2 border-indigo-400/[0.15] border-t-indigo-300" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Icon d={I.bolt} className="h-4 w-4 text-indigo-300" />
                        </div>
                      </div>
                      <div>
                        <p className="text-[15px] font-semibold text-white">
                          {t.parsingTitle}
                          <span className="dots" />
                        </p>
                        <p className="mt-1 text-xs text-[#8b93a8]">{t.parsingSub}</p>
                      </div>
                    </div>
                  ) : file ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-2xl bg-[#27376a] opacity-60 blur-xl" />
                        <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-[#303855] bg-[#18213a] text-indigo-200">
                          <Icon d={I.file} className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="min-w-0 max-w-full">
                        <p className="truncate text-[15px] font-semibold text-white">
                          {file.name}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
                          <span className="rounded-md bg-white/[0.06] px-2 py-0.5 text-[11px] tabular-nums text-[#8b93a8]">
                            {formatSize(file.size)}
                          </span>
                          {sourceIsValid ? (
                            <span
                              className="rounded-md px-2 py-0.5 text-[11px] font-semibold text-black"
                              style={{ background: stableColor }}
                            >
                              {file.label}
                            </span>
                          ) : (
                            <span className="rounded-md bg-amber-500/[0.15] px-2 py-0.5 text-[11px] font-semibold text-amber-300">
                              {file.label || t.unknownVersion}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-[11px] text-[#7d859c]">{t.replaceHint}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative transition-transform duration-300 group-hover:-translate-y-1">
                        <div className="absolute inset-0 rounded-full bg-[#27376a] opacity-55 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
                        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-[#50649f] bg-[#18213a] text-[#b9c6ff] shadow-[0_0_34px_-8px_rgba(99,102,241,0.75)]">
                          <Icon d={I.folder} className="h-7 w-7" />
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-black text-white">{t.dropTitle}</p>
                        <p className="mt-1 text-[13px] font-semibold text-[#aab4d3]">{t.dropSub}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          inputRef.current?.click();
                        }}
                        className="neon-btn shine rounded-xl px-6 py-2.5 text-sm font-bold text-white"
                      >
                        {t.chooseFile}
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <input
                ref={inputRef}
                type="file"
                accept=".aep"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.length) handleFiles(e.target.files);
                  e.target.value = '';
                }}
              />
            </section>

            {/* 02 选择目标版本 */}
            <section>
              <StepLabel n="02" title={t.step2} />
              {!engineReady ? (
                <div className="glass mt-3 rounded-2xl px-5 py-6 text-center text-sm text-[#8b93a8]">
                  {t.engineLoading}
                  <span className="dots" />
                </div>
              ) : !file ? (
                <div className="mt-3 grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3">
                  {targets.map((target) => (
                    <div
                      key={target.major}
                      className="version-card glass rounded-2xl px-3 py-3 text-center opacity-45 saturate-50"
                    >
                      <div className="text-[12.5px] font-bold text-[#7a829b]">
                        {target.label}
                      </div>
                      <div
                        className="mx-auto mt-1.5 h-[3px] w-9 rounded-full"
                        style={{
                          background: 'rgba(255,255,255,0.14)',
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-3 grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3">
                  {targets.map((target, i) => {
                    const state = targetState!(target.major);
                    const disabled = state !== 'available';
                    const active = selectedMajor === target.major;
                    const stable = target.stability === 'stable';
                    return (
                      <button
                        key={target.major}
                        disabled={disabled || converting}
                        onClick={() => {
                          setSelectedMajor(target.major);
                          setResult(null);
                        }}
                        style={{ animationDelay: `${i * 34}ms` }}
                        className={`version-card corner fade-up glass rounded-2xl px-3 py-3 text-center ${
                          active ? 'selected' : ''
                        } ${
                          disabled
                            ? 'cursor-not-allowed opacity-35 saturate-50'
                            : 'cursor-pointer'
                        }`}
                      >
                        <div
                          className={`text-[13px] font-bold tracking-wide ${
                            disabled
                              ? 'text-[#6f7890]'
                              : active
                              ? 'text-white'
                              : 'text-[#e8ebf5]'
                          }`}
                        >
                          {target.label}
                        </div>
                        <div
                          className="mx-auto mt-1.5 h-[3px] w-9 rounded-full"
                          style={{
                            background: disabled
                              ? 'rgba(255,255,255,0.14)'
                              : stable
                              ? stableColor
                              : experimentalColor,
                            opacity: active ? 1 : 0.6,
                            boxShadow: active
                              ? stable
                                ? '0 0 10px rgba(52,211,153,.6)'
                                : '0 0 10px rgba(251,146,60,.55)'
                              : 'none',
                          }}
                        />
                        <div
                          className={`mt-1 text-[10px] font-medium ${
                            disabled
                              ? 'text-[#565e75]'
                              : active
                              ? 'text-indigo-200/90'
                              : 'text-[#7a829b]'
                          }`}
                        >
                          {stable ? t.stable : t.experimental}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

            {/* 03 转换按钮 */}
            <section>
              <StepLabel n="03" title={t.step3} />
              <button
                disabled={!file || selectedMajor === null || converting || !engineReady}
                onClick={convert}
                className={`neon-btn mt-3 flex w-full items-center justify-center gap-3 rounded-2xl py-4 text-[15px] font-bold text-white ${
                  converting ? 'shine cursor-wait' : ''
                }`}
              >
                {converting ? (
                  <>
                    <span className="spinner" />
                    <span>
                      {t.convertingPrefix} {selectedMajor}
                      <span className="dots" />
                    </span>
                  </>
                ) : (
                  <>
                    <Icon d={I.bolt} className="h-[18px] w-[18px]" />
                    <span>{t.convertBtn}</span>
                    {selectedMajor && file && (
                      <span className="rounded-lg bg-white/[0.15] px-2 py-0.5 text-xs font-semibold tabular-nums">
                        AE {selectedMajor}
                      </span>
                    )}
                  </>
                )}
              </button>
              {selectedMajor !== null && file && sourceIsValid && (
                <p className="mt-3 text-center text-[11px] text-[#6f7890]">
                  {file.label} → {t.convertHintBefore}
                  {selectedMajor}
                  {t.convertHintAfter}
                </p>
              )}
            </section>

            {/* 结果 */}
            {result && (
              <div
                className={`pop-in rounded-2xl border px-5 py-5 backdrop-blur-xl ${
                  result.ok ? 'result-ok' : 'result-err'
                }`}
                role="status"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                      result.ok
                        ? 'border-emerald-400/40 bg-emerald-400/[0.15] text-emerald-300'
                        : 'border-red-400/40 bg-red-400/[0.15] text-red-300'
                    }`}
                  >
                    <Icon d={result.ok ? I.check : I.x} className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-[15px] font-bold ${
                        result.ok ? 'text-emerald-200' : 'text-red-200'
                      }`}
                    >
                      {result.ok ? t.resultOk : t.resultFail}
                    </p>
                    <p className="mt-1 break-all text-sm text-white/80">{result.message}</p>
                    {result.ok && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {t.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-emerald-400/10 px-2 py-0.5 text-[11px] text-emerald-200/90"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {Array.isArray(result.detail) && result.detail.length > 0 && (
                  <div className="mt-3 border-t border-white/[0.08] pt-3">
                    <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-[#6f7890]">
                      {t.detailTitle}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {result.detail.map((d, i) => (
                        <span
                          key={i}
                          className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-[#c6cbe0]"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ===== 核心优势（与 SEO 衔接） ===== */}
          <div className="mt-16">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-[20px] font-black tracking-tight text-white">
                  {locale === 'zh' ? '为什么选择' : 'Why it works'}
                </h2>
                <p className="mt-1 text-[13px] text-[#8b93a8]">
                  {locale === 'zh'
                    ? '结构化重建 + 本地处理，确保旧版工程安全打开'
                    : 'Structured rebuild with on-device processing'}
                </p>
              </div>
              <div className="hidden h-px flex-1 bg-[#242b3f] sm:block" />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Feature
                icon={I.shield}
                title={t.features[0].title}
                desc={t.features[0].desc}
                glow="rgba(52,211,153,0.35)"
              />
              <Feature
                icon={I.cpu}
                title={t.features[1].title}
                desc={t.features[1].desc}
                glow="rgba(99,102,241,0.4)"
              />
              <Feature
                icon={I.layers}
                title={t.features[2].title}
                desc={t.features[2].desc}
                glow="rgba(236,72,153,0.35)"
              />
            </div>
          </div>

          {/* ===== SEO 正文（服务端渲染） ===== */}
          {children}
        </div>
      </div>
    </main>
  );
}

/* ============================================================
   小部件
============================================================ */
function HeroTitle({ locale }: { locale: Locale }) {
  if (locale === 'zh') {
    return (
      <h1 className="mt-4 text-[38px] font-black leading-[1.04] text-white sm:text-[54px]">
        <span className="text-white text-glow">降级 </span>
        <span className="text-[#8ea2ff] text-glow">After Effects</span>
        <span className="text-white text-glow"> 工程</span>
        <br />
        <span className="text-white/90">让</span>
        <span className="text-[#67e8f9]">旧版本</span>
        <span className="text-white/90">也能打开</span>
      </h1>
    );
  }

  return (
    <h1 className="mt-4 text-[38px] font-black leading-[1.04] text-white sm:text-[54px]">
      <span className="text-white text-glow">Downgrade </span>
      <span className="text-[#8ea2ff] text-glow">After Effects</span>
      <span className="text-white text-glow"> Projects</span>
      <br />
      <span className="text-white/90">Open them in </span>
      <span className="text-[#67e8f9]">older versions</span>
    </h1>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric-tile rounded-2xl px-4 py-3">
      <p className="text-[10px] font-semibold uppercase text-[#6f7890]">{label}</p>
      <p className="mt-1 text-[13px] font-bold text-white">{value}</p>
    </div>
  );
}

function ProgressStepper({
  engineReady,
  fileReady,
  targetReady,
  resultOk,
  locale,
}: {
  engineReady: boolean;
  fileReady: boolean;
  targetReady: boolean;
  resultOk: boolean;
  locale: Locale;
}) {
  const t = getDict(locale);
  const steps = [
    { key: 'engine', label: t.stepper.engine, done: engineReady },
    { key: 'detect', label: t.stepper.detect, done: fileReady },
    { key: 'select', label: t.stepper.select, done: targetReady },
    { key: 'done', label: t.stepper.done, done: resultOk },
  ];
  const completed = steps.filter((s) => s.done).length;
  const total = steps.length;
  const pct = Math.round((completed / total) * 100);

  return (
    <div className="glass mt-5 rounded-2xl px-4 py-3 sm:mt-6 sm:px-5 sm:py-3.5">
      {/* 移动端：紧凑进度条 + 文本 */}
      <div className="flex items-center gap-3 sm:hidden">
        <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-[#5b6ee1] transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-[11px] font-semibold tabular-nums text-cyan-200">
          {completed}/{total}
        </span>
      </div>

      {/* 桌面端：四步横向步骤条 */}
      <div className="hidden items-center gap-1 sm:flex">
        {steps.map((step, i) => (
          <div key={step.key} className="flex flex-1 items-center">
            <div className="flex min-w-0 items-center gap-2">
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[10px] font-black transition-colors ${
                  step.done
                    ? 'border-emerald-300/40 bg-emerald-300/15 text-emerald-200'
                    : 'border-white/10 bg-white/[0.04] text-[#6f7890]'
                }`}
              >
                {step.done ? <Icon d={I.check} className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span
                className={`truncate text-[12px] font-semibold ${
                  step.done ? 'text-white/90' : 'text-[#6f7890]'
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="mx-3 h-px flex-1 bg-white/[0.08]">
                <div
                  className={`h-full transition-all duration-500 ${
                    steps[i + 1].done ? 'bg-emerald-300/50' : 'bg-transparent'
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function LangSwitch({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const other: Locale = locale === 'zh' ? 'en' : 'zh';
  return (
    <a
      href={localeHref[other]}
      hrefLang={htmlLang[other]}
      aria-label={t.langSwitchAria}
      title={t.langSwitchAria}
      className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-wide text-[#c3c9e2] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:text-white"
    >
      <Icon d={I.globe} className="h-3.5 w-3.5" />
      <span>{localeLabel[other]}</span>
    </a>
  );
}

function StepLabel({ n, title }: { n: string; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="step-index flex h-7 w-7 items-center justify-center rounded-lg text-[11px] font-black tabular-nums text-cyan-100">
        {n}
      </span>
      <h2 className="text-sm font-bold uppercase text-white/90">{title}</h2>
      <div className="h-px flex-1 bg-[#242b3f]" />
    </div>
  );
}

function Feature({
  icon,
  title,
  desc,
  glow,
}: {
  icon: string;
  title: string;
  desc: string;
  glow: string;
}) {
  return (
    <div className="premium-feature glass group rounded-2xl px-4 py-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/20">
      <div
        className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white/85 transition-all duration-300 group-hover:scale-110"
        style={{ boxShadow: `0 0 22px -4px ${glow}` }}
      >
        <Icon d={icon} className="h-5 w-5" />
      </div>
      <p className="text-[13px] font-bold text-white">{title}</p>
      <p className="mt-1 text-[11.5px] leading-relaxed text-[#8b93a8]">{desc}</p>
    </div>
  );
}
