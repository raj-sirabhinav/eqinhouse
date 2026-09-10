"use client";

import React, { useEffect, useRef } from 'react';

const GRID_SIZE = 60;
const BEAM_HEIGHT = 60;
const NODE_AFFECT_RADIUS = 40;
const IDLE_TIMEOUT_MS = 15000; // Exactly 15 seconds

export const AmbientBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number | null = null;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let isIdle = false;
    let currentOpacity = 0.0;
    let targetOpacity = 0.0;
    let scanY = 0;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;

    // Start render loop only when needed
    const startRenderLoop = () => {
      if (animFrameId === null) {
        animFrameId = requestAnimationFrame(animate);
      }
    };

    // User activity handler: immediately resets timer, transitions opacity to 0, resets scan position
    const onUserInteraction = () => {
      isIdle = false;
      targetOpacity = 0.0;
      scanY = 0; // Reset scan position on interaction

      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        isIdle = true;
        targetOpacity = 1.0;
        startRenderLoop();
      }, IDLE_TIMEOUT_MS);

      // Keep loop running to smoothly transition currentOpacity to 0
      startRenderLoop();
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (isIdle || currentOpacity > 0.001) {
        startRenderLoop();
      }
    };

    window.addEventListener('mousemove', onUserInteraction, { passive: true });
    window.addEventListener('keydown', onUserInteraction, { passive: true });
    window.addEventListener('scroll', onUserInteraction, { passive: true });
    window.addEventListener('touchstart', onUserInteraction, { passive: true });
    window.addEventListener('resize', handleResize);

    // Initial 15-second idle trigger countdown
    idleTimer = setTimeout(() => {
      isIdle = true;
      targetOpacity = 1.0;
      startRenderLoop();
    }, IDLE_TIMEOUT_MS);

    // Canvas animation loop
    const animate = () => {
      // Smooth lerp transition for canvas opacity
      currentOpacity += (targetOpacity - currentOpacity) * 0.08;
      if (Math.abs(currentOpacity - targetOpacity) < 0.001) {
        currentOpacity = targetOpacity;
      }

      ctx.clearRect(0, 0, width, height);

      // If fully faded out and user is active, halt loop to eliminate CPU/GPU drain
      if (currentOpacity <= 0.001 && !isIdle) {
        currentOpacity = 0.0;
        animFrameId = null;
        return;
      }

      // Continuous downward sweep beam progression
      scanY = (scanY + 1.5) % (height + 100);

      // 1. Static Orthogonal Grid: subtle coordinate grid lines
      ctx.beginPath();
      ctx.strokeStyle = `rgba(15, 23, 42, ${0.03 * currentOpacity})`;
      ctx.lineWidth = 1;

      // Vertical grid lines
      for (let x = 0; x <= width; x += GRID_SIZE) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }

      // Horizontal grid lines
      for (let y = 0; y <= height; y += GRID_SIZE) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // 2. Trailing Beam Glow: vertical gradient spanning 60px above scanY
      const beamTop = scanY - BEAM_HEIGHT;
      const gradient = ctx.createLinearGradient(0, beamTop, 0, scanY);
      gradient.addColorStop(0, `rgba(37, 99, 235, 0)`);
      gradient.addColorStop(0.9, `rgba(37, 99, 235, ${0.06 * currentOpacity})`);
      gradient.addColorStop(1, `rgba(37, 99, 235, ${0.28 * currentOpacity})`);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, Math.max(0, beamTop), width, Math.min(height, scanY) - Math.max(0, beamTop));

      // Crisp leading sweep line at scanY
      if (scanY >= 0 && scanY <= height) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(37, 99, 235, ${0.45 * currentOpacity})`;
        ctx.lineWidth = 1.2;
        ctx.moveTo(0, scanY);
        ctx.lineTo(width, scanY);
        ctx.stroke();
      }

      // 3. Intersecting Node Illumination: SLA Emerald green illumination when close to sweep line
      for (let y = 0; y <= height; y += GRID_SIZE) {
        const dist = Math.abs(y - scanY);
        if (dist < NODE_AFFECT_RADIUS) {
          const nodeAlpha = (1 - dist / NODE_AFFECT_RADIUS) * 0.75 * currentOpacity;

          for (let x = 0; x <= width; x += GRID_SIZE) {
            ctx.beginPath();
            ctx.arc(x, y, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(16, 185, 129, ${nodeAlpha})`;
            ctx.fill();
          }
        }
      }

      animFrameId = requestAnimationFrame(animate);
    };

    return () => {
      if (animFrameId !== null) {
        cancelAnimationFrame(animFrameId);
      }
      if (idleTimer) clearTimeout(idleTimer);
      window.removeEventListener('mousemove', onUserInteraction);
      window.removeEventListener('keydown', onUserInteraction);
      window.removeEventListener('scroll', onUserInteraction);
      window.removeEventListener('touchstart', onUserInteraction);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  );
};

export default AmbientBackground;
