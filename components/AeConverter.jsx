'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { AeIcon } from './AdobeIcons';
import { Check, Close, Download, Shield, Upload } from './Icons';
import { formatBytes } from '@/lib/format';
import { convert, describeError, detect, getTargets, loadCore, outputName } from '@/lib/aep/wasm';

/**
 * After Effects（.aep）转换器。
 *
 * 与 PrConverter 的区别不只是文件格式：
 *  - 这里是**纯客户端**转换，字节从不经过网络（下载用 Blob URL 在本地生成）；
 *  - 目标版本必须先过滤成「严格低于源版本」，所以先识别源版本再填下拉框，
 *    而不是把全部目标一股脑列出来让用户去撞错误。
 *
 * 转换结果只呈现用户关心的四件事：版本变化、文件大小、耗时、下载。
 * 处理过程不对外展示 —— 站内不暴露任何内部实现细节。
 */
export default function AeConverter({ ui }) {
  const [core, setCore] = useState('loading'); // loading | ready | failed
  const [targets, setTargets] = useState([]); // [{ major, label, stability }]

  const [file, setFile] = useState(null);
  const [source, setSource] = useState(null); // { major, label } | 'unknown' | null
  const [target, setTarget] = useState(null);
  const [over, setOver] = useState(false);

  const [phase, setPhase] = useState('idle'); // idle | working | done | error
  const [pct, setPct] = useState(0);
  const [stageIdx, setStageIdx] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [fileSize, setFileSize] = useState(0);

  const inputRef = useRef(null);
  const bytesRef = useRef(null);
  const urlRef = useRef(null);
  const aliveRef = useRef(true);

  /* 内核随页面一起下发，挂载即开始加载 —— 用户挑文件的时间刚好用来加载它 */
  useEffect(() => {
    aliveRef.current = true;
    (async () => {
      try {
        await loadCore();
        const list = (await getTargets()).sort((a, b) => a.major - b.major);
        if (!aliveRef.current) return;
        setTargets(list);
        setCore('ready');
      } catch {
        if (aliveRef.current) setCore('failed');
      }
    })();
    return () => {
      aliveRef.current = false;
    };
  }, []);

  /* 释放上一轮生成的 Blob URL，避免内存泄漏 */
  const releaseUrl = () => {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
  };
  useEffect(() => () => releaseUrl(), []);

  const labelOf = (major) => targets.find((t) => t.major === major)?.label || `AE ${major}`;

  /** 选到文件就立刻识别源版本 —— 用户不必点「开始」才知道能不能降 */
  const accept = useCallback(
    async (f) => {
      if (!f) return;
      releaseUrl();
      setError(null);
      setResult(null);
      setPhase('idle');
      setPct(0);
      setFile(f);
      setFileSize(f.size);
      setSource(null);
      setTarget(null);
      bytesRef.current = null;

      let bytes;
      try {
        bytes = new Uint8Array(await f.arrayBuffer());
      } catch {
        if (aliveRef.current) setError({ text: ui.errRead });
        return;
      }
      if (!aliveRef.current) return;
      bytesRef.current = bytes;

      try {
        await loadCore();
        const info = await detect(f.name, bytes);
        if (!aliveRef.current) return;
        setSource({ major: info.major, label: info.label });
      } catch (e) {
        if (!aliveRef.current) return;
        const { code } = describeError(e);
        if (code === 'E_FORMAT') setError({ text: ui.errFile });
        setSource('unknown');
      }
    },
    [ui]
  );

  /* 目标只能是「严格更旧」的版本，这是内核的硬规则，不是 UI 的偏好 */
  const available =
    source && source !== 'unknown' ? targets.filter((t) => t.major < source.major) : [];

  useEffect(() => {
    if (!available.length) return;
    if (target === null || !available.some((t) => t.major === target)) {
      setTarget(available[available.length - 1].major); // 默认选最接近源版本的那个
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, targets]);

  const reset = () => {
    releaseUrl();
    bytesRef.current = null;
    setFile(null);
    setFileSize(0);
    setSource(null);
    setTarget(null);
    setResult(null);
    setError(null);
    setPhase('idle');
    setPct(0);
    if (inputRef.current) inputRef.current.value = '';
  };

  const run = async () => {
    if (!file || target === null || phase === 'working') return;

    if (!bytesRef.current) {
      try {
        bytesRef.current = new Uint8Array(await file.arrayBuffer());
      } catch {
        setError({ text: ui.errRead });
        setPhase('error');
        return;
      }
    }

    setPhase('working');
    setError(null);
    setResult(null);
    releaseUrl();

    const t0 = performance.now();
    try {
      setStageIdx(0);
      setPct(8);
      await loadCore();

      setStageIdx(1);
      setPct(26);
      const bytes = bytesRef.current;

      if (!(source && source !== 'unknown')) {
        setStageIdx(2);
        setPct(42);
        const info = await detect(file.name, bytes);
        if (aliveRef.current) setSource({ major: info.major, label: info.label });
      }

      setStageIdx(3);
      setPct(62);
      const out = await convert(file.name, bytes, target);

      setStageIdx(4);
      setPct(88);
      const blob = new Blob([out.bytes], { type: 'application/octet-stream' });
      urlRef.current = URL.createObjectURL(blob);

      if (!aliveRef.current) return;
      setPct(100);
      setElapsed(performance.now() - t0);
      setResult({
        name: outputName(file.name, labelOf(out.targetMajor)),
        label: labelOf(out.targetMajor),
        sourceLabel: labelOf(out.sourceMajor),
        size: out.bytes.length,
        url: urlRef.current,
      });
      setPhase('done');
    } catch (e) {
      if (!aliveRef.current) return;
      setError({ text: uiErr(ui, describeError(e).code) });
      setPhase('error');
      setPct(0);
    }
  };

  const busy = phase === 'working';
  const badge =
    core === 'ready'
      ? { cls: 'tag--ok', text: `${targets.length} ${ui.badgeTargets}` }
      : core === 'failed'
        ? { cls: 'tag--soon', text: ui.badgeFailed }
        : { cls: '', text: ui.badgeLoading };

  const detected = source && source !== 'unknown' ? source : null;
  const saving = result ? fileSize - result.size : 0;

  return (
    <div className="conv">
      <div className="conv__head">
        <div className="conv__dots">
          <i />
          <i />
          <i />
        </div>
        <span className="conv__title">{ui.convTitle}</span>
        <span className={`tag ${badge.cls}`} style={{ marginLeft: 'auto' }}>
          {badge.text}
        </span>
      </div>

      <div className="conv__body">
        {!file ? (
          <div
            className="drop"
            data-over={over}
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setOver(true);
            }}
            onDragLeave={() => setOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setOver(false);
              accept(e.dataTransfer?.files?.[0]);
            }}
          >
            <span className="drop__ico">
              <Upload />
            </span>
            <p className="drop__t">{over ? ui.dropOver : ui.dropTitle}</p>
            <p className="drop__h">{ui.dropHint}</p>
          </div>
        ) : (
          <>
            <div className="filebar">
              <span className="filebar__ico">
                <AeIcon size={30} />
              </span>
              <span className="filebar__meta">
                <span className="filebar__name">{file.name}</span>
                <span className="filebar__sub">{formatBytes(fileSize)}</span>
              </span>
              <button type="button" className="iconbtn" onClick={reset} aria-label={ui.again}>
                <Close size={16} />
              </button>
            </div>

            <p className="field__hint" style={{ marginTop: 12 }}>
              {ui.sourceLabel}：
              <strong style={{ color: 'var(--txt)' }}>
                {detected ? detected.label : source === 'unknown' ? ui.detectUnknown : ui.detecting}
              </strong>
            </p>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept=".aep"
          hidden
          onChange={(e) => accept(e.target.files?.[0])}
        />

        <div className="ctrl">
          <label className="field">
            <span className="field__l">{ui.targetLabel}</span>
            <select
              className="select"
              value={target ?? ''}
              onChange={(e) => setTarget(Number(e.target.value))}
              disabled={busy || !available.length}
            >
              {available.length ? (
                available.map((t) => (
                  <option key={t.major} value={t.major}>
                    {t.label}
                    {t.stability === 'stable' ? '' : ` · ${ui.experimental}`}
                  </option>
                ))
              ) : (
                <option value="">—</option>
              )}
            </select>
            <span className="field__hint">{ui.targetHint}</span>
          </label>
        </div>

        {source === 'unknown' ? (
          <div className="alert" role="alert">
            {ui.errVersion}
          </div>
        ) : null}

        {detected && !available.length ? (
          <div className="alert" role="alert">
            {ui.noTargets}
          </div>
        ) : null}

        {core === 'failed' ? (
          <div className="alert" role="alert">
            {ui.errLoad}
          </div>
        ) : null}

        <button
          type="button"
          className="btn btn--primary btn--lg btn--block conv__go"
          onClick={run}
          disabled={!file || busy || !available.length || core === 'failed'}
        >
          {busy ? ui.goBusy : ui.go}
        </button>

        {busy ? (
          <div className="prog">
            <div className="prog__rail">
              <div className="prog__bar" style={{ width: `${pct}%` }} />
            </div>
            <p className="prog__stage">{ui.stages[stageIdx]}</p>
          </div>
        ) : null}

        {error ? (
          <div className="alert" role="alert">
            {error.text}
          </div>
        ) : null}

        {phase === 'done' && result ? (
          <>
            <div className="done" style={{ marginTop: 22 }}>
              <span className="done__ico">
                <Check size={20} />
              </span>
              <div style={{ minWidth: 0, flex: 1 }}>
                <p className="done__t">{ui.resultTitle}</p>
                <p className="done__m">{result.name}</p>
                <div className="done__acts">
                  <a className="btn btn--primary" href={result.url} download={result.name}>
                    <Download />
                    {ui.download}
                  </a>
                  <button type="button" className="btn btn--quiet" onClick={reset}>
                    {ui.again}
                  </button>
                </div>
              </div>
            </div>

            <dl className="kv">
              <div>
                <dt>{ui.kvVersion}</dt>
                <dd>
                  {result.sourceLabel} → <strong>{result.label}</strong>
                </dd>
              </div>
              <div>
                <dt>{ui.kvSize}</dt>
                <dd>
                  {formatBytes(fileSize)} → {formatBytes(result.size)}
                  {saving > 0 ? <span className="muted"> · −{formatBytes(saving)}</span> : null}
                </dd>
              </div>
              <div>
                <dt>{ui.kvTime}</dt>
                <dd>{(elapsed / 1000).toFixed(2)} s</dd>
              </div>
            </dl>
          </>
        ) : null}

        <p
          className="mock__s"
          style={{ marginTop: 18, display: 'flex', gap: 8, alignItems: 'center' }}
        >
          <span style={{ color: 'var(--txt-3)', display: 'inline-flex' }}>
            <Shield size={15} />
          </span>
          {ui.footNote}
        </p>
      </div>
    </div>
  );
}

function uiErr(ui, code) {
  const map = {
    E_TARGET: ui.errTarget,
    E_FORMAT: ui.errFile,
    E_VERSION: ui.errVersion,
    E_REBUILD: ui.errRebuild,
    E_ENV: ui.errEnv,
    E_UNKNOWN: ui.errUnknown,
  };
  return map[code] || ui.errUnknown;
}
