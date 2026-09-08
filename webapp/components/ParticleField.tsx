'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  hue: number;
  tw: number; // 透明度相位
}

// 星空粒子背景：漂浮粒子 + 近距离连线 + 视差光点
export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // 粒子数量随面积变化，上限 ~90
      const count = Math.min(Math.floor((width * height) / 16000), 90);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.6 + 0.4,
        hue: Math.random() < 0.6 ? 225 : Math.random() < 0.5 ? 262 : 190, // 蓝/紫/青
        tw: Math.random() * Math.PI * 2,
      }));
    };

    const step = () => {
      ctx.clearRect(0, 0, width, height);
      const t = performance.now() * 0.001;
      const dist = 120; // 连线距离

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.tw += 0.008;
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;
      }

      // 连线
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < dist * dist) {
            const alpha = (1 - Math.sqrt(d2) / dist) * 0.14;
            ctx.strokeStyle = `hsla(230, 80%, 75%, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        // 粒子与鼠标微连
        const mdx = a.x - mouse.x;
        const mdy = a.y - mouse.y;
        const md2 = mdx * mdx + mdy * mdy;
        if (md2 < 220 * 220) {
          const alpha = (1 - Math.sqrt(md2) / 220) * 0.35;
          ctx.strokeStyle = `hsla(270, 90%, 75%, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      // 画粒子
      for (const p of particles) {
        const glow = 0.5 + Math.sin(p.tw) * 0.5;
        const alpha = 0.35 + glow * 0.55;
        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue}, 90%, 72%, ${alpha})`;
        ctx.shadowColor = `hsla(${p.hue}, 90%, 65%, 0.8)`;
        ctx.shadowBlur = 8;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      void t;
      raf = requestAnimationFrame(step);
    };

    const onMouse = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouse);
    document.addEventListener('mouseleave', onLeave);
    if (!reduceMotion) step();
    else {
      // 减少动态：画一帧静态
      step();
      cancelAnimationFrame(raf);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  );
}
