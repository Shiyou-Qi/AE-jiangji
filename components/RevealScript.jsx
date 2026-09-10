'use client';

import { useEffect } from 'react';

/**
 * 滚动进场：给根元素加 .js-reveal 后，逐批把 .reveal 元素点亮。
 * 用「先有内容、后有动画」的顺序，禁用 JS 时内容依然可见。
 */
export default function RevealScript() {
  useEffect(() => {
    const root = document.documentElement;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !('IntersectionObserver' in window)) return;

    root.classList.add('js-reveal');

    const observed = Array.from(document.querySelectorAll('.reveal'));
    if (!observed.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.05 }
    );

    for (const el of observed) {
      // 同一组内错开出现，避免整屏同时弹入
      const siblings = Array.from(el.parentElement?.children || []).filter((c) =>
        c.classList?.contains('reveal')
      );
      const order = Math.max(0, siblings.indexOf(el));
      el.style.transitionDelay = `${Math.min(order, 5) * 65}ms`;
      io.observe(el);
    }

    return () => io.disconnect();
  }, []);

  return null;
}
