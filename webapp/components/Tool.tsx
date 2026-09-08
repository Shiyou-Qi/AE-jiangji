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

const stableGrad = 'linear-gradient(120deg,#6ee7b7,#34d399 45%,#10b981)';
const experimentalGrad = 'linear-gradient(120deg,#fcd34d,#f59e0b 55%,#f97316)';

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
  const completedSteps = result?.ok
    ? 3
    : selectedMajor !== null
    ? 2
    : file
    ? 1
    : 0;
  const progress = Math.round((completedSteps / 3) * 100);
  const sourceLabel = file?.label || (locale === 'zh' ? '待识别' : 'Pending');
  const targetLabel =
    selectedMajor !== null ? `AE ${selectedMajor}` : locale === 'zh' ? '待选择' : 'Select target';

  return (
    <main
      className="home-shell relative min-h-screen overflow-hidden text-[#f1f3f9]"
      lang={htmlLang[locale]}
    >
      {/* ===== 背景装饰 ===== */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-5%,rgba(56,79,182,0.22),transparent_70%)]" />
        <div className="premium-mesh absolute inset-0" />
        <div className="radar-sweep absolute left-1/2 top-0 h-[720px] w-[720px] -translate-x-1/2" />
        <div className="absolute -top-40 -left-40 h-[560px] w-[560px] aurora-blob aurora-a" />
        <div className="absolute top-[8%] -right-52 h-[620px] w-[620px] aurora-blob aurora-b" />
        <div className="absolute bottom-[-18%] left-[24%] h-[560px] w-[560px] aurora-blob aurora-c" />
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,6,10,0)_0%,rgba(5,6,10,0.82)_72%,#05060a_100%)]" />
      </div>

      <ParticleField />

      <div className="relative z-10 flex min-h-screen flex-col items-center px-5 pb-16 pt-7 sm:px-8 lg:pt-10">
        <div
          className="home-enter w-full max-w-[1180px]"
        >
          <nav className="top-console glass flex items-center justify-between gap-4 rounded-2xl px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="brand-core flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white">
                <Icon d={I.bolt} className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-bold text-white">{t.brand}</p>
                <p className="truncate text-[11px] text-[#7d859c]">{t.badge}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-200 sm:inline-flex">
                {locale === 'zh' ? '本地引擎在线' : 'Local engine online'}
              </span>
              <LangSwitch locale={locale} />
            </div>
          </nav>

          <section className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
            <div className="command-card glass-strong flow-border rounded-[28px] p-4 sm:p-6">
              <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-indigo-300/20 bg-indigo-300/10 px-3.5 py-1.5 text-[11px] font-semibold text-[#bfc9ff]">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-300 opacity-70" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-200" />
                  </span>
                  {locale === 'zh' ? 'AEP STRUCTURE CONVERTER' : 'AEP STRUCTURE CONVERTER'}
                </span>
                <div className="flex items-center gap-2 text-[11px] font-semibold text-[#8b93a8]">
                  <Icon d={I.lock} className="h-3.5 w-3.5 text-emerald-300" />
                  <span>{locale === 'zh' ? '文件不上传' : 'No upload'}</span>
                </div>
              </div>

              {/* ===== 主标题 ===== */}
              <header>
                <h1 className="max-w-[680px] text-[42px] font-black leading-[1.04] text-white sm:text-[60px]">
                  <span className="text-gradient text-glow">{t.heroTitle1}</span>
                  <br />
                  <span className="text-white/90">{t.heroTitle2}</span>
                </h1>
                <p className="mt-5 max-w-[560px] text-[15px] leading-7 text-[#a7adc0]">
                  {t.heroSubBefore}{' '}
                  <span className="rounded-md border border-white/10 bg-white/[0.06] px-1.5 py-0.5 text-white/90">
                    .aep
                  </span>{' '}
                  {t.heroSubAfter}
                </p>
              </header>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <Metric label={locale === 'zh' ? '运行方式' : 'Runtime'} value={locale === 'zh' ? '浏览器本地' : 'In browser'} />
                <Metric label={locale === 'zh' ? '目标范围' : 'Targets'} value="AE 2018-2026" />
                <Metric label={locale === 'zh' ? '上传状态' : 'Upload'} value={locale === 'zh' ? '0 字节' : '0 bytes'} />
              </div>

              {/* ===== 引擎状态 ===== */}
              {engineError && (
                <div className="result-err glass mt-8 rounded-2xl border px-5 py-4">
                  <p className="text-sm text-red-200">
                    {t.engineFailPrefix}
                    {engineError}
                  </p>
                </div>
              )}

              {/* ===== 上传区 ===== */}
              <div className="mt-10">
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
                      background:
                        'linear-gradient(120deg,rgba(99,102,241,.98),rgba(34,211,238,.98),rgba(236,72,153,.95),rgba(139,92,246,.98))',
                      backgroundSize: '220% 100%',
                      animation: 'dragShift 1.6s linear infinite',
                    }
                  : undefined
              }
              className={`group relative mt-3 cursor-pointer select-none rounded-3xl p-[1px] transition-transform duration-300 ${
                dragActive ? 'scale-[1.012]' : file ? '' : 'hover:scale-[1.006]'
              } ${file && !converting && !dragActive ? 'flow-border' : ''}`}
            >
              <div
                className={`relative overflow-hidden rounded-[calc(1.5rem-1px)] px-6 py-12 text-center transition-all duration-300 sm:py-14 ${
                  dragActive
                    ? 'bg-[rgba(9,11,20,0.95)]'
                    : 'glass bg-[rgba(9,11,20,0.82)] hover:bg-[rgba(10,12,22,0.88)]'
                }`}
              >
                {dragActive && (
                  <div className="scan-beam pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-transparent via-indigo-400/[0.15] to-transparent" />
                )}

                {detecting ? (
                  <div className="flex flex-col items-center gap-4 py-2">
                    <div className="relative">
                      <div className="h-14 w-14 animate-spin rounded-full border-2 border-indigo-400/[0.15] border-t-indigo-300" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon d={I.bolt} className="h-5 w-5 text-indigo-300" />
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
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-2xl bg-indigo-500/30 blur-xl" />
                      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.12] bg-gradient-to-br from-indigo-500/30 to-violet-500/20 text-indigo-200">
                        <Icon d={I.file} className="h-6 w-6" />
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
                            style={{ background: stableGrad }}
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
                  <div className="flex flex-col items-center gap-5">
                    <div className="relative transition-transform duration-300 group-hover:-translate-y-1">
                      <div className="absolute inset-0 rounded-full bg-indigo-500/25 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.12] bg-gradient-to-br from-indigo-500/20 to-violet-500/20 text-indigo-200 shadow-[0_0_30px_-6px_rgba(99,102,241,0.45)]">
                        <Icon d={I.folder} className="h-7 w-7" />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-base font-semibold text-white">{t.dropTitle}</p>
                      <p className="mt-1.5 text-[13px] text-[#8b93a8]">{t.dropSub}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        inputRef.current?.click();
                      }}
                      className="neon-btn shine rounded-xl px-6 py-2.5 text-sm font-semibold text-white"
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
          </div>

          {/* ===== 版本选择 ===== */}
          <div className="mt-10">
            <StepLabel n="02" title={t.step2} />
            {!engineReady ? (
              <div className="glass mt-3 rounded-2xl px-5 py-6 text-center text-sm text-[#8b93a8]">
                {t.engineLoading}
                <span className="dots" />
              </div>
            ) : !file ? (
              <div className="glass mt-3 rounded-2xl border-dashed px-5 py-6 text-center text-[13px] text-[#6f7890]">
                {t.unlockHint}
              </div>
            ) : (
              <div className="mt-3 grid grid-cols-3 gap-2.5 sm:gap-3">
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
                      className={`version-card corner fade-up glass rounded-2xl px-3 py-3.5 text-center ${
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
                            ? stableGrad
                            : experimentalGrad,
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
          </div>

          {/* ===== 转换按钮 ===== */}
          <div className="mt-10">
            <button
              disabled={!file || selectedMajor === null || converting || !engineReady}
              onClick={convert}
              className={`neon-btn flex w-full items-center justify-center gap-3 rounded-2xl py-4 text-[15px] font-bold text-white ${
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
          </div>

          {/* ===== 结果 ===== */}
          {result && (
            <div
              className={`pop-in mt-8 rounded-2xl border px-5 py-5 backdrop-blur-xl ${
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

            <EngineConsole
              engineReady={engineReady}
              fileReady={!!file}
              sourceLabel={sourceLabel}
              targetLabel={targetLabel}
              progress={progress}
              resultOk={result?.ok ?? false}
              locale={locale}
            />
          </section>

          {/* ===== 功能说明 ===== */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
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
function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric-tile rounded-2xl px-4 py-3">
      <p className="text-[10px] font-semibold uppercase text-[#6f7890]">{label}</p>
      <p className="mt-1 text-[13px] font-bold text-white">{value}</p>
    </div>
  );
}

function EngineConsole({
  engineReady,
  fileReady,
  sourceLabel,
  targetLabel,
  progress,
  resultOk,
  locale,
}: {
  engineReady: boolean;
  fileReady: boolean;
  sourceLabel: string;
  targetLabel: string;
  progress: number;
  resultOk: boolean;
  locale: Locale;
}) {
  const steps = [
    {
      label: locale === 'zh' ? '加载转换内核' : 'Load engine',
      done: engineReady,
      value: engineReady ? 'READY' : 'WAIT',
    },
    {
      label: locale === 'zh' ? '识别源工程' : 'Detect source',
      done: fileReady,
      value: sourceLabel,
    },
    {
      label: locale === 'zh' ? '写入目标版本' : 'Patch target',
      done: targetLabel.startsWith('AE '),
      value: targetLabel,
    },
    {
      label: locale === 'zh' ? '生成下载副本' : 'Create copy',
      done: resultOk,
      value: resultOk ? 'DONE' : 'IDLE',
    },
  ];

  return (
    <aside className="engine-console glass-strong sticky top-6 rounded-[28px] p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase text-[#7d859c]">
            {locale === 'zh' ? '实时引擎状态' : 'Live Engine'}
          </p>
          <h2 className="mt-1 text-lg font-black text-white">
            {locale === 'zh' ? '转换中控台' : 'Conversion Console'}
          </h2>
        </div>
        <div className="pulse-core flex h-12 w-12 items-center justify-center rounded-2xl text-cyan-100">
          <Icon d={I.cpu} className="h-6 w-6" />
        </div>
      </div>

      <div className="console-screen rounded-2xl p-4">
        <div className="mb-3 flex items-center justify-between text-[11px] font-semibold text-[#8b93a8]">
          <span>{locale === 'zh' ? '任务进度' : 'Progress'}</span>
          <span className="tabular-nums text-cyan-200">{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="progress-fill h-full rounded-full"
            style={{ width: `${Math.max(progress, engineReady ? 12 : 4)}%` }}
          />
        </div>

        <div className="mt-5 space-y-3">
          {steps.map((step, index) => (
            <div className="flex items-center gap-3" key={step.label}>
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-[10px] font-black tabular-nums ${
                  step.done
                    ? 'border-cyan-300/40 bg-cyan-300/15 text-cyan-100'
                    : 'border-white/10 bg-white/[0.04] text-[#6f7890]'
                }`}
              >
                {step.done ? <Icon d={I.check} className="h-3.5 w-3.5" /> : index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-semibold text-white/85">{step.label}</p>
                <p className="truncate text-[10px] font-semibold text-[#6f7890]">{step.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] px-4 py-3">
          <p className="text-[10px] font-semibold uppercase text-[#6f7890]">
            {locale === 'zh' ? '文件流' : 'File flow'}
          </p>
          <p className="mt-1 text-sm font-bold text-emerald-200">
            {locale === 'zh' ? '本地' : 'Local'}
          </p>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] px-4 py-3">
          <p className="text-[10px] font-semibold uppercase text-[#6f7890]">
            {locale === 'zh' ? '模式' : 'Mode'}
          </p>
          <p className="mt-1 text-sm font-bold text-indigo-200">
            {locale === 'zh' ? '结构化' : 'Structured'}
          </p>
        </div>
      </div>
    </aside>
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
      <div className="h-px flex-1 bg-gradient-to-r from-white/[0.15] to-transparent" />
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
