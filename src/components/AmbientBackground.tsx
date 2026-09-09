"use client";

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  radius: number;
  rgb: string;
  alpha: number;
  baseAlpha: number;
  orbitAngle: number;
  orbitRadius: number;
  orbitSpeed: number;
  pulsePhase: number;
}

const PALETTE = [
  '5, 150, 105',   // Rich Emerald
  '79, 70, 229',  // Royal Indigo
  '124, 58, 237', // Electric Violet
  '217, 119, 6',   // Warm Amber
  '6, 182, 212'    // Vibrant Cyan-Teal
];

const PARTICLE_COUNT = 48;
const CURSOR_REPEL_RADIUS = 130;
const IDLE_TIMEOUT_MS = 15000; // 15-second inactivity window

export const AmbientBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = -9999;
    let mouseY = -9999;
    let isIdle = false;
    let currentOpacity = 0.0;
    let targetOpacity = 0.0;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;

    const resetIdleTimer = () => {
      isIdle = false;
      targetOpacity = 0.0;
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        isIdle = true;
        targetOpacity = 1.0;
      }, IDLE_TIMEOUT_MS);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      resetIdleTimer();
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
      }
      resetIdleTimer();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
      }
      resetIdleTimer();
    };

    const handleInteraction = () => {
      resetIdleTimer();
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('scroll', handleInteraction, { passive: true });
    window.addEventListener('keydown', handleInteraction, { passive: true });
    window.addEventListener('resize', handleResize);

    resetIdleTimer();

    // Initialize particles
    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = 1.8 + Math.random() * (4.3 - 1.8);
      const rgb = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      const baseAlpha = 0.35 + Math.random() * 0.45;

      particles.push({
        x,
        y,
        baseX: x,
        baseY: y,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius,
        rgb,
        alpha: baseAlpha,
        baseAlpha,
        orbitAngle: Math.random() * Math.PI * 2,
        orbitRadius: 20 + Math.random() * 55,
        orbitSpeed: (0.008 + Math.random() * 0.015) * (Math.random() > 0.5 ? 1 : -1),
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    let lastTime = performance.now();

    const animate = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Smooth lerp interpolation toward targetOpacity
      currentOpacity += (targetOpacity - currentOpacity) * 0.1;
      if (Math.abs(currentOpacity - targetOpacity) < 0.001) {
        currentOpacity = targetOpacity;
      }

      ctx.clearRect(0, 0, width, height);

      // When completely invisible, skip physics and drawing to save GPU/CPU cycles
      if (currentOpacity > 0.001) {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          if (isIdle) {
            // Harmonic orbital wave drifting
            p.orbitAngle += p.orbitSpeed;
            p.pulsePhase += 1.8 * dt;

            const targetX = p.baseX + Math.cos(p.orbitAngle) * p.orbitRadius;
            const targetY = p.baseY + Math.sin(p.orbitAngle * 0.8) * (p.orbitRadius * 0.75);

            // Smoothly attract towards orbit path
            p.x += (targetX - p.x) * 0.04;
            p.y += (targetY - p.y) * 0.04;

            // Subtle brightness pulsing in idle state
            p.alpha = Math.max(0.15, Math.min(0.9, p.baseAlpha + Math.sin(p.pulsePhase) * 0.22));
          } else {
            // Standard gentle drift
            p.x += p.vx;
            p.y += p.vy;

            // Wrap edges smoothly
            if (p.x < -20) { p.x = width + 20; p.baseX = p.x; }
            if (p.x > width + 20) { p.x = -20; p.baseX = p.x; }
            if (p.y < -20) { p.y = height + 20; p.baseY = p.y; }
            if (p.y > height + 20) { p.y = -20; p.baseY = p.y; }

            // Repel from cursor if within CURSOR_REPEL_RADIUS
            const dx = p.x - mouseX;
            const dy = p.y - mouseY;
            const dist = Math.hypot(dx, dy);

            if (dist < CURSOR_REPEL_RADIUS && dist > 0) {
              const force = (1 - dist / CURSOR_REPEL_RADIUS) * 3.5;
              p.x += (dx / dist) * force;
              p.y += (dy / dist) * force;
            }

            // Return alpha to normal
            p.alpha += (p.baseAlpha - p.alpha) * 0.05;
            p.baseX = p.x;
            p.baseY = p.y;
          }

          // Effective alpha modulated by currentOpacity
          const effectiveAlpha = p.alpha * currentOpacity;

          // Draw particle with soft radial gradient glow halo and sharp core
          const haloRadius = p.radius * 3.5;
          const gradient = ctx.createRadialGradient(
            p.x,
            p.y,
            0,
            p.x,
            p.y,
            haloRadius
          );
          gradient.addColorStop(0, `rgba(${p.rgb}, ${effectiveAlpha * 0.75})`);
          gradient.addColorStop(0.45, `rgba(${p.rgb}, ${effectiveAlpha * 0.3})`);
          gradient.addColorStop(1, `rgba(${p.rgb}, 0)`);

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(p.x, p.y, haloRadius, 0, Math.PI * 2);
          ctx.fill();

          // Solid inner core for clarity on light backgrounds
          ctx.fillStyle = `rgba(${p.rgb}, ${Math.min(1, effectiveAlpha * 1.3)})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 0.75, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animFrameId = requestAnimationFrame(animate);
    };

    animFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameId);
      if (idleTimer) clearTimeout(idleTimer);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    />
  );
};

export default AmbientBackground;
