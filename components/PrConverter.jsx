'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { PrIcon } from './AdobeIcons';
import { Download, FileGlyph, Shield, Upload, Alert as AlertIcon, Check } from './Icons';
import { formatBytes } from '@/lib/format';

/** 展示顺序：CS6 打头，之后按年份排（别名版本也是年份） */
function displayOrder(a, b) {
  const rank = (k) => (k === 'CS6' ? -1 : Number(k) || 0);
  return rank(a.key) - rank(b.key);
}

export default function PrConverter({ ui }) {
  const [status, setStatus] = useState({ online: null, targets: [] });
  const [file, setFile] = useState(null);
  const [target, setTarget] = useState('2023');
  const [safe, setSafe] = useState(false);
  const [over, setOver] = useState(false);

  const [phase, setPhase] = useState('idle'); // idle | working | done | error
  const [pct, setPct] = useState(0);
  const [stageIdx, setStageIdx] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [elapsed, setElapsed] = useState(0);

  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const startedAt = useRef(0);

  /* 版本列表直接问引擎要 —— 站点不自己编一份 */
  useEffect(() => {
    let alive = true;
    fetch('/api/engine', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        const list = [...(d.targets || [])].sort(displayOrder);
        setStatus({ online: !!d.online, targets: list });
        if (list.length && !list.some((t) => t.key === target)) {
          setTarget(list[list.length - 1].key);
        }
      })
      .catch(() => alive && setStatus({ online: false, targets: [] }));
    return () => {
      alive = false;
    };
    // 只在挂载时取一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => () => clearInterval(timerRef.current), []);

  const accept = useCallback(
    (f) => {
      if (!f) return;
      setError(null);
      setResult(null);
      setPhase('idle');
      setFile(f);
    },
    []
  );

  const onDrop = (e) => {
    e.preventDefault();
    setOver(false);
    accept(e.dataTransfer?.files?.[0]);
  };

  const startTimer = () => {
    clearInterval(timerRef.current);
    setPct(6);
    setStageIdx(0);
    timerRef.current = setInterval(() => {
      setPct((p) => (p >= 92 ? 92 : p + Math.max(1.5, (92 - p) * 0.08)));
      setStageIdx((i) => Math.min(i + 1, ui.stages.length - 1));
    }, 420);
  };

  const run = async () => {
    if (!file || phase === 'working') return;

    setPhase('working');
    setError(null);
    setResult(null);
    startedAt.current = Date.now();
    startTimer();

    try {
      const qs = new URLSearchParams({ target });
      if (safe) qs.set('safe', '1');

      const res = await fetch(`/api/convert?${qs}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
          'x-file-name': encodeURIComponent(file.name),
        },
        body: file,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        clearInterval(timerRef.current);
        setPct(0);
        const code = data?.code;
        const msg = code === 'E_ENGINE_OFFLINE' || res.status === 502 ? ui.errEngine : null;
        const tooBig = code === 'E_TOO_BIG';
        setError({
          text: tooBig
            ? ui.fileTooBig.replace('{mb}', Math.round((data?.maxBytes || 0) / 1024 / 1024))
            : msg || (code && ui.errCodes[code]) || data?.error || ui.errGeneric,
        });
        setPhase('error');
        return;
      }

      clearInterval(timerRef.current);
      setPct(100);
      setStageIdx(ui.stages.length - 1);
      setElapsed(Date.now() - startedAt.current);
      setResult(data);
      setPhase('done');
    } catch {
      clearInterval(timerRef.current);
      setPct(0);
      setError({ text: ui.errNetwork });
      setPhase('error');
    }
  };

  const reset = () => {
    clearInterval(timerRef.current);
    setFile(null);
    setResult(null);
    setError(null);
    setPhase('idle');
    setPct(0);
    if (inputRef.current) inputRef.current.value = '';
  };

  const engineBadge = useMemo(() => {
    if (status.online === null) return { cls: '', text: ui.engineUnknown };
    return status.online
      ? { cls: 'tag--ok', text: ui.engineOnline }
      : { cls: 'tag--soon', text: ui.engineOffline };
  }, [status.online, ui]);

  const busy = phase === 'working';
  const saving = result ? result.inSize - result.outSize : 0;

  return (
    <div className="conv">
      <div className="conv__head">
        <div className="conv__dots">
          <i />
          <i />
          <i />
        </div>
        <span className="conv__title">{ui.convTitle}</span>
        <span className={`tag ${engineBadge.cls}`} style={{ marginLeft: 'auto' }}>
          {engineBadge.text}
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
            onDrop={onDrop}
          >
            <span className="drop__ico">
              <Upload />
            </span>
            <p className="drop__t">{over ? ui.dropOver : ui.dropTitle}</p>
            <p className="drop__h">{ui.dropHint}</p>
          </div>
        ) : (
          <div className="filebar">
            <span className="filebar__ico">
              <PrIcon size={30} />
            </span>
            <span className="filebar__meta">
              <span className="filebar__name">{file.name}</span>
              <span className="filebar__sub">{formatBytes(file.size)}</span>
            </span>
            <button type="button" className="iconbtn" onClick={reset} aria-label={ui.again}>
              ✕
            </button>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept=".prproj"
          hidden
          onChange={(e) => accept(e.target.files?.[0])}
        />

        <div className="ctrl">
          <label className="field">
            <span className="field__l">{ui.targetLabel}</span>
            <select
              className="select"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              disabled={busy}
            >
              {status.targets.length ? (
                status.targets.map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.label}
                  </option>
                ))
              ) : (
                <option value={target}>{target}</option>
              )}
            </select>
          </label>

          <label className="check">
            <input
              type="checkbox"
              checked={safe}
              onChange={(e) => setSafe(e.target.checked)}
              disabled={busy}
            />
            <span className="check__box" />
            <span className="check__txt">
              {ui.safeLabel}
              <em>{ui.safeHint}</em>
            </span>
          </label>
        </div>

        <button
          type="button"
          className="btn btn--primary btn--lg btn--block conv__go"
          onClick={run}
          disabled={!file || busy}
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
                <p className="done__m">{result.filename}</p>
                <div className="done__acts">
                  <a
                    className="btn btn--primary"
                    href={`/api/download?token=${encodeURIComponent(result.token)}`}
                    download={result.filename}
                  >
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
                <dt>{ui.kvTarget}</dt>
                <dd>{result.targetLabel || result.target}</dd>
              </div>
              <div>
                <dt>{ui.kvSize}</dt>
                <dd>
                  {formatBytes(result.inSize)} → {formatBytes(result.outSize)}
                  {saving > 0 ? (
                    <span className="muted"> · −{formatBytes(saving)}</span>
                  ) : null}
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
