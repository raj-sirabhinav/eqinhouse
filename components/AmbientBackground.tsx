"use client";

import React, { useEffect, useRef } from 'react';

// Enterprise 5-State Color Palette
const ENTERPRISE_PALETTE = [
  { name: 'Ingest', stroke: '37, 99, 235', dot: '#38bdf8' },           // Ingest (Blue)
  { name: 'Audit', stroke: '100, 116, 139', dot: '#cbd5e1' },         // Audit / Governance (Slate)
  { name: 'Enrichment', stroke: '245, 158, 11', dot: '#fbbf24' },     // Enrichment (Amber)
  { name: 'CRM Lock', stroke: '16, 185, 129', dot: '#34d399' },       // CRM Lock (Emerald)
  { name: 'SLA Dispatch', stroke: '6, 182, 212', dot: '#67e8f9' },     // SLA Dispatch (Cyan)
];

interface HexCell {
  cx: number;
  cy: number;
  isActive: boolean;
  phaseOffset: number;
  color: { name: string; stroke: string; dot: string };
  // Precomputed 6 vertex coordinates
  vertices: [number, number][];
}

const R = 44; // Hexagon radius
const DX = R * 1.5; // Horizontal step = 66
const DY = R * Math.sqrt(3); // Vertical step ≈ 76.21
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
    let step = 0;
    let hexes: HexCell[] = [];
    let idleTimer: ReturnType<typeof setTimeout> | null = null;

    // Precalculate hexagon vertices relative to center
    // Flat-topped / pointed-topped based on horizontal step DX = R * 1.5, vertical step DY = R * sqrt(3)
    // Points at angle: k * PI / 3 (0, 60, 120, 180, 240, 300 deg)
    const computeVertices = (cx: number, cy: number): [number, number][] => {
      const pts: [number, number][] = [];
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        pts.push([cx + R * Math.cos(angle), cy + R * Math.sin(angle)]);
      }
      return pts;
    };

    // Generate honeycomb mesh grid
    const generateGrid = () => {
      hexes = [];
      const cols = Math.ceil(width / DX) + 3;
      const rows = Math.ceil(height / DY) + 3;

      for (let c = -1; c < cols; c++) {
        // Alternate columns or rows staggered by dy / 2
        const offsetY = (Math.abs(c) % 2 === 1) ? DY / 2 : 0;
        const cx = c * DX;

        for (let r = -1; r < rows; r++) {
          const cy = r * DY + offsetY;
          const isActive = Math.random() > 0.82; // ~18% active highlight cells
          const paletteIndex = Math.floor(Math.random() * ENTERPRISE_PALETTE.length);

          hexes.push({
            cx,
            cy,
            isActive,
            phaseOffset: Math.random() * Math.PI * 2,
            color: ENTERPRISE_PALETTE[paletteIndex],
            vertices: computeVertices(cx, cy),
          });
        }
      }
    };

    generateGrid();

    // Start render loop only when needed
    const startRenderLoop = () => {
      if (animFrameId === null) {
        animFrameId = requestAnimationFrame(animate);
      }
    };

    // User activity handler: immediately resets timer, transitions opacity to 0
    const onUserInteraction = () => {
      isIdle = false;
      targetOpacity = 0.0;

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
      generateGrid();
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

      step += 0.012; // Controlled, slow step increment

      // 1. Base Mesh: faint static structural lines with rgba(15, 23, 42, 0.03) and lineWidth = 1
      ctx.beginPath();
      ctx.strokeStyle = `rgba(15, 23, 42, ${0.03 * currentOpacity})`;
      ctx.lineWidth = 1;

      for (let i = 0; i < hexes.length; i++) {
        const { vertices } = hexes[i];
        ctx.moveTo(vertices[0][0], vertices[0][1]);
        for (let v = 1; v < 6; v++) {
          ctx.lineTo(vertices[v][0], vertices[v][1]);
        }
        ctx.closePath();
      }
      ctx.stroke();

      // 2. Active Highlighting & Vertex Indicators
      for (let i = 0; i < hexes.length; i++) {
        const hex = hexes[i];
        if (!hex.isActive) continue;

        // Pulse dynamic calculation: 0.12 + ((Math.sin(step + hex.phaseOffset) + 1) / 2) * 0.45
        const sinVal = (Math.sin(step + hex.phaseOffset) + 1) / 2; // normalized 0..1
        const alpha = (0.12 + sinVal * 0.45) * currentOpacity;

        const { vertices, cx, cy, color } = hex;

        // Subtle glowing fill on active honeycomb cell
        ctx.beginPath();
        ctx.moveTo(vertices[0][0], vertices[0][1]);
        for (let v = 1; v < 6; v++) {
          ctx.lineTo(vertices[v][0], vertices[v][1]);
        }
        ctx.closePath();
        ctx.fillStyle = `rgba(${color.stroke}, ${alpha * 0.12})`;
        ctx.fill();

        // Highlight stroke with lineWidth = 1.6
        ctx.strokeStyle = `rgba(${color.stroke}, ${alpha})`;
        ctx.lineWidth = 1.6;
        ctx.stroke();

        // Vertex Indicator: When pulse value (sinVal) exceeds 0.55, render anchor node point at center vertex (radius 2.5)
        if (sinVal > 0.55) {
          const nodeAlpha = Math.min(1.0, ((sinVal - 0.55) / 0.45) * currentOpacity);

          ctx.beginPath();
          ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = color.dot;
          ctx.globalAlpha = nodeAlpha;
          ctx.fill();

          // Delicate outer micro-ring around the active node
          ctx.beginPath();
          ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
          ctx.strokeStyle = color.dot;
          ctx.lineWidth = 0.8;
          ctx.globalAlpha = nodeAlpha * 0.4;
          ctx.stroke();

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
