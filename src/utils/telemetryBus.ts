/**
 * Global Telemetry Event Bus
 * Connects UI actions (e.g. <60s SLA hover, Pipeline Latency Calculator drag)
 * directly to the Canvas particle acceleration engine.
 */

export const triggerTelemetryBoost = (multiplier: number, durationMs?: number) => {
  if (typeof window === 'undefined') return;
  
  window.dispatchEvent(
    new CustomEvent('revops-telemetry-boost', {
      detail: { multiplier, durationMs },
    })
  );
};
