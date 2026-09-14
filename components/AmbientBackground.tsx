"use client";

import React, { useEffect, useRef } from 'react';

interface LeadPacket {
  id: number;
  axis: 'x' | 'y';
  lanePos: number;     // Fixed perpendicular coordinate (conduit line)
  pos: number;         // Current position along the conduit
  dir: 1 | -1;
  baseSpeed: number;
  speedMultiplier: number;
  length: number;
  colorType: 'cyan' | 'slate' | 'cobalt';
}

interface Conduit {
  axis: 'x' | 'y';
  pos: number;
}

export const AmbientBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animFrameId: number | null = null;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Interactive mouse telemetry state
    let mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000, active: false };
    let scrollSpeed = 0;
    let lastScrollY = window.scrollY;
    let isTabVisible = !document.hidden;

    // SLA & Latency Calculator Global Boost State
    let targetSlaBoost = 1.0;
    let currentSlaBoost = 1.0;
    let boostResetTimer: ReturnType<typeof setTimeout> | null = null;

    // Conduits (orthogonal routing lines)
    const HORIZONTAL_STEP = 120;
    const VERTICAL_STEP = 160;
    let hConduits: Conduit[] = [];
    let vConduits: Conduit[] = [];

    // Pre-allocated packet pool: strictly orthogonal packet traces
    const PACKET_COUNT = 52;
    const packets: LeadPacket[] = [];

    const setupConduitsAndPackets = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      // Generate technical coordinate grid lines
      hConduits = [];
      vConduits = [];

      for (let y = Math.floor(HORIZONTAL_STEP / 2); y <= height + 60; y += HORIZONTAL_STEP) {
        hConduits.push({ axis: 'x', pos: y });
      }
      for (let x = Math.floor(VERTICAL_STEP / 2); x <= width + 60; x += VERTICAL_STEP) {
        vConduits.push({ axis: 'y', pos: x });
      }

      // Initialize packets if empty
      if (packets.length === 0 && hConduits.length > 0 && vConduits.length > 0) {
        for (let i = 0; i < PACKET_COUNT; i++) {
          const isHorizontal = Math.random() > 0.45;
          const conduits = isHorizontal ? hConduits : vConduits;
          const chosenConduit = conduits[Math.floor(Math.random() * conduits.length)];
          const maxDim = isHorizontal ? width : height;

          // Technical telemetry distribution:
          // 45% Crisp Cyan (#06B6D4) - sub-60s active routing
          // 35% Technical Slate (#1E293B) - deterministic data packets
          // 20% Electric Cobalt (#6366F1) - high-speed webhook ingestion
          const randColor = Math.random();
          const colorType: 'cyan' | 'slate' | 'cobalt' =
            randColor < 0.45 ? 'cyan' : randColor < 0.80 ? 'slate' : 'cobalt';

          packets.push({
            id: i,
            axis: chosenConduit.axis,
            lanePos: chosenConduit.pos,
            pos: Math.random() * maxDim,
            dir: Math.random() > 0.5 ? 1 : -1,
            baseSpeed: 0.95 + Math.random() * 1.05,
            speedMultiplier: 1.0,
            length: 16 + Math.random() * 14,
            colorType,
          });
        }
      }
    };

    setupConduitsAndPackets();

    // Mouse telemetry tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    // Scroll inertia tracking
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;
      scrollSpeed = Math.min(Math.max(delta * 0.10, -3.5), 3.5);
    };

    const handleResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      setupConduitsAndPackets();
    };

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible && animFrameId === null) {
        lastTime = performance.now();
        animFrameId = requestAnimationFrame(animate);
      }
    };

    // Bounding rect for focused reading attenuation (MIT research hero text block)
    let textFocusRect: DOMRect | null = null;
    const updateTextFocusRect = () => {
      const el = document.getElementById('hero-research-text');
      if (el) {
        textFocusRect = el.getBoundingClientRect();
      } else {
        textFocusRect = null;
      }
    };
    updateTextFocusRect();

    // Telemetry Event Listener: accelerates packet travel on <60s SLA hover, module runs, or slider drag
    const handleTelemetryBoost = (e: Event) => {
      const customEvent = e as CustomEvent<{ multiplier: number; durationMs?: number }>;
      if (customEvent.detail && typeof customEvent.detail.multiplier === 'number') {
        targetSlaBoost = customEvent.detail.multiplier;

        if (boostResetTimer) clearTimeout(boostResetTimer);
        if (customEvent.detail.durationMs) {
          boostResetTimer = setTimeout(() => {
            targetSlaBoost = 1.0;
          }, customEvent.detail.durationMs);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    window.addEventListener('scroll', () => {
      handleScroll();
      updateTextFocusRect();
    }, { passive: true });
    window.addEventListener('resize', () => {
      handleResize();
      updateTextFocusRect();
    });
    window.addEventListener('revops-telemetry-boost', handleTelemetryBoost);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    let frameCount = 0;
    let lastTime = performance.now();

    // Main 60fps Telemetry HUD Engine
    const animate = (currentTime: number) => {
      if (!isTabVisible) {
        animFrameId = null;
        return;
      }

      const dt = Math.min((currentTime - lastTime) / 16.667, 2.0);
      lastTime = currentTime;

      // Smooth mouse lerping
      mouse.x += (mouse.targetX - mouse.x) * 0.14;
      mouse.y += (mouse.targetY - mouse.y) * 0.14;

      // Smooth SLA speed boost lerping
      currentSlaBoost += (targetSlaBoost - currentSlaBoost) * 0.1;

      // Smooth scroll inertia decay
      scrollSpeed *= 0.90;
      if (Math.abs(scrollSpeed) < 0.01) scrollSpeed = 0;

      ctx.clearRect(0, 0, width, height);

      // 1. Technical Coordinate Grid: strictly 2.5% opacity (rgba(15, 23, 42, 0.025))
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.025)';

      // Horizontal grid lines
      ctx.beginPath();
      for (let i = 0; i < hConduits.length; i++) {
        const y = hConduits[i].pos;
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Vertical grid lines
      ctx.beginPath();
      for (let i = 0; i < vConduits.length; i++) {
        const x = vConduits[i].pos;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      ctx.stroke();

      // Technical Grid Intersection Nodes: ultra-subtle micro-points
      for (let i = 0; i < hConduits.length; i++) {
        const hy = hConduits[i].pos;
        for (let j = 0; j < vConduits.length; j++) {
          const vx = vConduits[j].pos;

          let dotAlpha = 0.045;
          let dotRadius = 1.0;

          if (mouse.active) {
            const dx = vx - mouse.x;
            const dy = hy - mouse.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < 140) {
              const boost = (1 - d / 140);
              dotAlpha += boost * 0.08;
              dotRadius += boost * 0.5;
            }
          }

          ctx.fillStyle = `rgba(15, 23, 42, ${dotAlpha})`;
          ctx.beginPath();
          ctx.arc(vx, hy, dotRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Dynamic color palette based on active SLA acceleration
      const isAccelerated = currentSlaBoost > 1.25;
      const colors = {
        cyan: {
          head: isAccelerated ? 'rgba(6, 182, 212, 0.80)' : 'rgba(6, 182, 212, 0.52)',
          glow: isAccelerated ? 'rgba(6, 182, 212, 0.35)' : 'rgba(6, 182, 212, 0.18)',
          tail: 'rgba(6, 182, 212, 0)',
        },
        cobalt: {
          head: isAccelerated ? 'rgba(99, 102, 241, 0.75)' : 'rgba(99, 102, 241, 0.48)',
          glow: isAccelerated ? 'rgba(99, 102, 241, 0.30)' : 'rgba(99, 102, 241, 0.15)',
          tail: 'rgba(99, 102, 241, 0)',
        },
        slate: {
          head: isAccelerated ? 'rgba(30, 41, 59, 0.45)' : 'rgba(30, 41, 59, 0.32)',
          glow: isAccelerated ? 'rgba(30, 41, 59, 0.15)' : 'rgba(30, 41, 59, 0.08)',
          tail: 'rgba(30, 41, 59, 0)',
        },
      };

      // 2. Process and Render Orthogonal Packet Traces
      for (let i = 0; i < packets.length; i++) {
        const p = packets[i];

        // Coordinate determination
        let px = p.axis === 'x' ? p.pos : p.lanePos;
        let py = p.axis === 'x' ? p.lanePos : p.pos;

        // Interaction: subtle cursor acceleration
        let cursorBoost = 1.0;
        if (mouse.active) {
          const dx = px - mouse.x;
          const dy = py - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 160) {
            cursorBoost = 1.0 + (1 - dist / 160) * 1.5;
          }
        }

        // Apply scroll inertia for vertical packets
        let scrollBoost = 0;
        if (p.axis === 'y') {
          scrollBoost = scrollSpeed * 0.4;
        }

        p.speedMultiplier += (cursorBoost - p.speedMultiplier) * 0.15;
        const totalMultiplier = p.speedMultiplier * currentSlaBoost;
        const currentSpeed = (p.baseSpeed * totalMultiplier + scrollBoost * p.dir) * dt;
        p.pos += currentSpeed * p.dir;

        // Bounds wrapping
        const boundary = p.axis === 'x' ? width : height;
        if (p.pos < -50) {
          p.pos = boundary + 40;
        } else if (p.pos > boundary + 50) {
          p.pos = -40;
        }

        // Deterministic orthogonal routing branch at intersections
        if (p.axis === 'x') {
          for (let j = 0; j < vConduits.length; j++) {
            const vx = vConduits[j].pos;
            if (Math.abs(p.pos - vx) < currentSpeed * 0.6 && Math.random() < 0.006) {
              p.axis = 'y';
              p.lanePos = vx;
              p.pos = py;
              p.dir = Math.random() > 0.5 ? 1 : -1;
              break;
            }
          }
        } else {
          for (let j = 0; j < hConduits.length; j++) {
            const hy = hConduits[j].pos;
            if (Math.abs(p.pos - hy) < currentSpeed * 0.6 && Math.random() < 0.006) {
              p.axis = 'x';
              p.lanePos = hy;
              p.pos = px;
              p.dir = Math.random() > 0.5 ? 1 : -1;
              break;
            }
          }
        }

        // Render Packet Trail (Vector Trace)
        px = p.axis === 'x' ? p.pos : p.lanePos;
        py = p.axis === 'x' ? p.lanePos : p.pos;

        // Check if packet is crossing the focused reading text block
        let isInsideFocusZone = false;
        if (textFocusRect) {
          const padX = 24;
          const padY = 16;
          if (
            px >= textFocusRect.left - padX &&
            px <= textFocusRect.right + padX &&
            py >= textFocusRect.top - padY &&
            py <= textFocusRect.bottom + padY
          ) {
            isInsideFocusZone = true;
          }
        }

        ctx.save();
        if (isInsideFocusZone) {
          ctx.globalAlpha = 0.08; // Drops opacity by over 90% across this specific text block
        }

        const effectiveTailLength = p.length * Math.min(currentSlaBoost, 2.0);
        const tailX = p.axis === 'x' ? px - p.dir * effectiveTailLength : px;
        const tailY = p.axis === 'y' ? py - p.dir * effectiveTailLength : py;

        const palette = colors[p.colorType];
        const grad = ctx.createLinearGradient(tailX, tailY, px, py);
        grad.addColorStop(0, palette.tail);
        grad.addColorStop(1, palette.glow);

        ctx.strokeStyle = grad;
        ctx.lineWidth = p.colorType === 'slate' ? 1.2 : 1.6;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(px, py);
        ctx.stroke();

        // Render Leading Glowing Micro-Node (2px)
        // Outer halo only when accelerated
        if (isAccelerated && p.colorType !== 'slate') {
          ctx.fillStyle = palette.glow;
          ctx.beginPath();
          ctx.arc(px, py, 3.2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Crisp 2px core micro-node
        ctx.fillStyle = palette.head;
        ctx.beginPath();
        ctx.arc(px, py, 2.0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      frameCount++;
      if (frameCount % 45 === 0) {
        updateTextFocusRect();
      }

      animFrameId = requestAnimationFrame(animate);
    };

    animFrameId = requestAnimationFrame(animate);

    return () => {
      if (animFrameId !== null) {
        cancelAnimationFrame(animFrameId);
      }
      if (boostResetTimer) clearTimeout(boostResetTimer);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('revops-telemetry-boost', handleTelemetryBoost);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
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
