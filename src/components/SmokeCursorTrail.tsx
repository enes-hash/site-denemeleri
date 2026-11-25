import React, { useEffect, useRef } from 'react';

interface SmokeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  life: number;
  maxLife: number;
  wobblePhase: number;
  wobbleSpeed: number;
}

export const SmokeCursorTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: SmokeParticle[] = [];
    const mouse = { x: -999, y: -999, lastX: -999, lastY: -999, active: false };
    let lastEmit = 0;

    const spawnPuff = (x: number, y: number, speedScale: number) => {
      if (particles.length > 95) particles.shift();
      particles.push({
        x: x + (Math.random() - 0.5) * 6,
        y: y + (Math.random() - 0.5) * 6,
        vx: (Math.random() - 0.5) * 0.45 + speedScale * 0.08,
        vy: -0.55 - Math.random() * 0.65,
        radius: 5 + Math.random() * 6,
        maxRadius: 34 + Math.random() * 26,
        alpha: 0.16 + Math.random() * 0.09,
        life: 0,
        maxLife: 1.45 + Math.random() * 0.85,
        wobblePhase: Math.random() * Math.PI * 2,
        wobbleSpeed: 1.8 + Math.random() * 1.6,
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;

      const dx = mouse.x - (mouse.lastX < 0 ? mouse.x : mouse.lastX);
      const dy = mouse.y - (mouse.lastY < 0 ? mouse.y : mouse.lastY);
      const dist = Math.hypot(dx, dy);

      const now = performance.now();
      if (now - lastEmit > 24 || dist > 14) {
        spawnPuff(mouse.x, mouse.y, Math.max(-2, Math.min(2, dx * 0.05)));
        lastEmit = now;
      }

      mouse.lastX = mouse.x;
      mouse.lastY = mouse.y;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let rafId = 0;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      // Gentle idle ember wisp right at stationary cursor
      if (mouse.active && now - lastEmit > 160 && Math.random() < 0.35) {
        spawnPuff(mouse.x, mouse.y, 0);
        lastEmit = now;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += dt;
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        const progress = p.life / p.maxLife;
        p.wobblePhase += p.wobbleSpeed * dt;
        p.x += (p.vx + Math.sin(p.wobblePhase) * 0.48) * (dt * 60);
        p.y += p.vy * (dt * 60);
        p.vy *= 0.992;

        const currentRadius = p.radius + (p.maxRadius - p.radius) * Math.pow(progress, 0.72);
        const fade = Math.sin(progress * Math.PI) * (1 - progress * 0.45);
        const currentAlpha = p.alpha * fade;

        if (currentAlpha <= 0.002) continue;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentRadius);
        grad.addColorStop(0, `rgba(225, 215, 198, ${currentAlpha})`);
        grad.addColorStop(0.45, `rgba(182, 168, 148, ${currentAlpha * 0.55})`);
        grad.addColorStop(1, 'rgba(120, 110, 96, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40"
    />
  );
};
