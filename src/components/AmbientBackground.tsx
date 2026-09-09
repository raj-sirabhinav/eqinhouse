"use client";

import React, { useEffect, useRef } from 'react';

// Color Spectrum: Full 7-color ROYGBIV palette across lattice cells
const PALETTE = [
  { stroke: 'rgb(239, 68, 68)', dot: '#f87171' },   // Red
  { stroke: 'rgb(249, 115, 22)', dot: '#fb923c' },  // Orange
  { stroke: 'rgb(234, 179, 8)', dot: '#facc15' },   // Yellow
  { stroke: 'rgb(16, 185, 129)', dot: '#34d399' },  // Green
  { stroke: 'rgb(37, 99, 235)', dot: '#60a5fa' },   // Blue
  { stroke: 'rgb(99, 102, 241)', dot: '#818cf8' },  // Indigo
  { stroke: 'rgb(168, 85, 247)', dot: '#c084fc' },  // Violet
];

interface LatticeCell {
  cx: number;
  cy: number;
  tier: number;
  color: { stroke: string; dot: string };
  // Pre-calculated isometric coordinates
  // Top rhombus: cx, cy - SIZE (top); cx + dx/2, cy - SIZE/2 (right); cx, cy (center); cx - dx/2, cy - SIZE/2 (left)
  // Cube bottom: cx, cy + SIZE (bottom); cx - dx/2, cy + SIZE/2 (bottom-left); cx + dx/2, cy + SIZE/2 (bottom-right)
}

const SIZE = 45;
const DX = SIZE * Math.sqrt(3); // ≈ 77.94
const DY = SIZE * 1.5;          // 67.5
const IDLE_TIMEOUT_MS = 15000;  // 15 seconds

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
    let wave = 0;
    let cells: LatticeCell[] = [];
    let idleTimer: ReturnType<typeof setTimeout> | null = null;

    // Generate grid coordinates for isometric lattice
    const generateGrid = () => {
      cells = [];
      const cols = Math.ceil(width / DX) + 3;
      const rows = Math.ceil(height / DY) + 3;

      let cellIndex = 0;
      for (let r = -1; r < rows; r++) {
        for (let c = -1; c < cols; c++) {
          const offsetX = (r % 2 === 0) ? 0 : DX / 2;
          const cx = c * DX + offsetX;
          const cy = r * DY;

          const tier = (c + r * 2) % PALETTE.length;
          const colorIndex = ((tier % PALETTE.length) + PALETTE.length) % PALETTE.length;

          cells.push({
            cx,
            cy,
            tier: cellIndex % 7,
            color: PALETTE[colorIndex],
          });
          cellIndex++;
        }
      }
    };

    generateGrid();

    // Start render loop only when animating
    const startRenderLoop = () => {
      if (animFrameId === null) {
        animFrameId = requestAnimationFrame(animate);
      }
    };

    // User activity handler: immediately triggers fade out and resets idle countdown
    const onUserInteraction = () => {
      isIdle = false;
      targetOpacity = 0.0;

      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        isIdle = true;
        targetOpacity = 1.0;
        startRenderLoop();
      }, IDLE_TIMEOUT_MS);

      // Keep loop running while currentOpacity transitions down to 0
      startRenderLoop();
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      generateGrid();
      if (isIdle || currentOpacity > 0.001) {
        startRenderLoop();
      }
    };

    window.addEventListener('mousemove', onUserInteraction, { passive: true });
    window.addEventListener('mousedown', onUserInteraction, { passive: true });
    window.addEventListener('keydown', onUserInteraction, { passive: true });
    window.addEventListener('touchstart', onUserInteraction, { passive: true });
    window.addEventListener('touchmove', onUserInteraction, { passive: true });
    window.addEventListener('scroll', onUserInteraction, { passive: true });
    window.addEventListener('resize', handleResize);

    // Initial idle timer setup
    idleTimer = setTimeout(() => {
      isIdle = true;
      targetOpacity = 1.0;
      startRenderLoop();
    }, IDLE_TIMEOUT_MS);

    // Animation loop
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

      wave += 0.012; // Smooth, slow ambient pulse progression

      const halfDx = DX / 2;
      const halfSize = SIZE / 2;

      // 1. Structural Wireframe: faint base isometric cube lines with rgba(15, 23, 42, 0.035)
      ctx.beginPath();
      ctx.strokeStyle = `rgba(15, 23, 42, ${0.035 * currentOpacity})`;
      ctx.lineWidth = 1;

      for (let i = 0; i < cells.length; i++) {
        const { cx, cy } = cells[i];

        // Top rhombus wireframe
        ctx.moveTo(cx, cy - SIZE);
        ctx.lineTo(cx + halfDx, cy - halfSize);
        ctx.lineTo(cx, cy);
        ctx.lineTo(cx - halfDx, cy - halfSize);
        ctx.closePath();

        // Downward vertical edges of the isometric cube
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx, cy + SIZE);

        ctx.moveTo(cx - halfDx, cy - halfSize);
        ctx.lineTo(cx - halfDx, cy + halfSize);

        ctx.moveTo(cx + halfDx, cy - halfSize);
        ctx.lineTo(cx + halfDx, cy + halfSize);

        // Bottom edges
        ctx.moveTo(cx - halfDx, cy + halfSize);
        ctx.lineTo(cx, cy + SIZE);
        ctx.lineTo(cx + halfDx, cy + halfSize);
      }
      ctx.stroke();

      // 2. Wave Dynamics & Highlight Accent
      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        const phase = Math.sin(wave + cell.tier * 0.9 + (cell.cx + cell.cy) * 0.0018);

        // Only render illuminated isometric plane when phase > 0.3
        if (phase > 0.3) {
          const intensity = (phase - 0.3) / 0.7; // normalized 0..1
          const alpha = intensity * 0.8 * currentOpacity;

          const { cx, cy } = cell;

          // Subtle top rhombus face illumination
          ctx.beginPath();
          ctx.moveTo(cx, cy - SIZE);
          ctx.lineTo(cx + halfDx, cy - halfSize);
          ctx.lineTo(cx, cy);
          ctx.lineTo(cx - halfDx, cy - halfSize);
          ctx.closePath();
          ctx.fillStyle = cell.color.stroke.replace('rgb', 'rgba').replace(')', `, ${alpha * 0.08})`);
          ctx.fill();

          // Active top rhombus edge highlight
          ctx.beginPath();
          ctx.moveTo(cx, cy - SIZE);
          ctx.lineTo(cx + halfDx, cy - halfSize);
          ctx.lineTo(cx, cy);
          ctx.lineTo(cx - halfDx, cy - halfSize);
          ctx.closePath();
          ctx.strokeStyle = cell.color.stroke.replace('rgb', 'rgba').replace(')', `, ${alpha})`);
          ctx.lineWidth = 1.6;
          ctx.stroke();

          // Anchor vertex node (radius 2.5) matching the dot color
          ctx.beginPath();
          ctx.arc(cx, cy - SIZE, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = cell.color.dot;
          ctx.globalAlpha = Math.min(1.0, alpha * 1.2);
          ctx.fill();
          ctx.globalAlpha = 1.0;
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
      window.removeEventListener('mousedown', onUserInteraction);
      window.removeEventListener('keydown', onUserInteraction);
      window.removeEventListener('touchstart', onUserInteraction);
      window.removeEventListener('touchmove', onUserInteraction);
      window.removeEventListener('scroll', onUserInteraction);
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
