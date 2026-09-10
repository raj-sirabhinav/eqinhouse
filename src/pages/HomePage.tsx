import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  AlertCircle, 
  Zap,
  Database,
  Layers,
  Send,
  AlertTriangle,
  Check,
  Sliders,
  XCircle,
  ShieldCheck,
  Workflow,
  CheckCircle2,
  Sparkles,
  TrendingUp
} from 'lucide-react';

export const HomePage: React.FC = () => {
  // Slider state: 0 to 60 minutes, default 42
  const [latencyMinutes, setLatencyMinutes] = useState<number>(42);

  // Pipeline Simulator state
  const [pipelineMode, setPipelineMode] = useState<'deterministic' | 'manual'>('deterministic');
  const [activePipelineStep, setActivePipelineStep] = useState<number>(0);
  const [leadClaimed, setLeadClaimed] = useState<boolean>(false);

  // Auto-cycle stages in deterministic mode
  useEffect(() => {
    if (pipelineMode === 'deterministic') {
      const interval = setInterval(() => {
        setActivePipelineStep((prev) => (prev + 1) % 4);
      }, 2600);
      return () => clearInterval(interval);
    } else {
      setActivePipelineStep(1); // Bottleneck stall at stage 2 in manual mode
    }
  }, [pipelineMode]);

  // Dynamic calculations
  const metrics = useMemo(() => {
    let dropoffText = 'Optimal SLA (< 5m)';
    let dropoffPercent = 0;
    let burnAmount = 0;
    const isDegraded = latencyMinutes > 8;
    const isOptimal = latencyMinutes <= 2;

    if (latencyMinutes <= 2) {
      dropoffText = '0% (Optimal SLA)';
      dropoffPercent = 0;
      burnAmount = 0;
    } else if (latencyMinutes <= 5) {
      dropoffText = '18% Drop-off (Initial Friction)';
      dropoffPercent = 18;
      burnAmount = Math.round(latencyMinutes * 7500);
    } else if (latencyMinutes <= 9) {
      dropoffText = `${Math.round(40 + (latencyMinutes - 5) * 60)}% Drop-off (High Churn)`;
      dropoffPercent = Math.round(40 + (latencyMinutes - 5) * 60);
      burnAmount = Math.round(latencyMinutes * 9500);
    } else {
      // 10+ mins: Harvard Business Review benchmark
      dropoffText = '391% Qualification Drop-off';
      dropoffPercent = 391;
      burnAmount = Math.round((latencyMinutes / 42) * 420000);
    }

    return {
      dropoffText,
      dropoffPercent,
      burnAmount,
      isDegraded,
      isOptimal,
    };
  }, [latencyMinutes]);

  return (
    <div className="relative z-10 space-y-20 py-8 sm:py-12">
      
      {/* =========================================================================
          SECTION 1: HERO & MAIN PIPELINE LATENCY FINANCIAL IMPACT CALCULATOR
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-12 sm:pb-16">
        {/* Balanced Two-Column Split Layout with Top Baseline Alignment */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-start">
          
          {/* LEFT COLUMN: Conversion & Value Narrative */}
          <div className="lg:col-span-7 text-left flex flex-col justify-start">
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#E6DFD5]/40 border border-[#E6DFD5] text-xs font-mono text-[#3F3D56] mb-6 shadow-xs self-start"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#6366F1] animate-ping" />
              <span className="font-semibold text-[#000000]">SPEED-TO-LEAD &amp; REVOPS ARCHITECTURE</span>
              <span className="text-[#94a3b8]">&bull;</span>
              <span>B2B SAAS ($3M–$30M ARR)</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#000000] leading-[1.08] tracking-tight font-normal"
            >
              Your inbound sales form is silently destroying{' '}
              <span className="italic text-[#6366F1]">a 21x lead qualification advantage.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-base sm:text-lg text-[#3F3D56] max-w-xl leading-relaxed font-sans font-normal"
            >
              MIT research reveals reps responding within 5 minutes are 21x more likely to qualify prospects. We engineer sub-60s webhook routing, automated waterfall enrichment, and CRM governance so your sales team locks in that window every single time.
            </motion.p>

            {/* Primary CTA Group */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5"
            >
              <Link
                to="/intake"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-lg text-sm font-semibold text-white bg-[#6366F1] hover:bg-[#4F46E5] shadow-xs hover:shadow-sm transition-all group"
              >
                <span>Book GTM Architecture Diagnostic ($3,500)</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>

              <Link
                to="/stack"
                className="inline-flex items-center justify-center px-5 py-3.5 rounded-lg text-sm font-medium text-[#0f172a] bg-white hover:bg-[#FAF8F5] border border-[#cbd5e1] hover:border-[#94a3b8] shadow-xs transition-all"
              >
                <span>Explore The Architecture Stack</span>
              </Link>
            </motion.div>

            {/* Micro proof ticker */}
            <div className="mt-8 pt-6 border-t border-[#E6DFD5]/70 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-[#3F3D56]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Deterministic &lt;60s SLA</span>
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-[#6366F1]" />
                <span>100% CRM Schema Lock</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                <span>94.8% Match Rate</span>
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: The Hero System Visual — 3-Pillar Enterprise RevOps Architecture */}
          <motion.div
            initial={{ opacity: 0, y: 0, x: 12 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-5 w-full flex flex-col justify-start"
          >
            <div className="rounded-2xl border border-[#e2e8f0] bg-white/95 backdrop-blur-xs p-5 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] relative overflow-hidden">
              
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#f1f5f9]">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                  <span className="text-xs font-mono font-semibold text-[#0f172a] uppercase tracking-wider">
                    ENTERPRISE REVOPS ARCHITECTURE
                  </span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-emerald-600" />
                  <span>COMPOUNDING ROI</span>
                </span>
              </div>

              {/* Sequential Architecture Pipeline Diagram */}
              <div className="space-y-3 relative">
                
                {/* Connecting backbone trace */}
                <div className="absolute left-[19px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-cyan-400 via-amber-400 to-emerald-500 opacity-30 pointer-events-none" />

                {/* Pillar 01: Inbound Webhook Routing (<60s SLA) */}
                <div className="relative flex items-start gap-3.5 p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] hover:border-cyan-300 transition-colors group">
                  <div className="relative z-10 w-7 h-7 rounded-lg bg-cyan-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Zap className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-[#0f172a] tracking-tight">
                        Pillar 01: Inbound Webhook Routing
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-cyan-50 text-cyan-700 border border-cyan-200 shrink-0 font-semibold">
                        &lt;60s SLA
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748b] mt-0.5 leading-snug">
                      Sub-120ms ingestion and instantaneous Slack calendar handoff before prospect intent decays.
                    </p>
                    <div className="mt-1.5 flex items-center gap-1.5 text-[10px] font-mono text-cyan-700 font-medium">
                      <CheckCircle2 className="h-3 w-3 text-cyan-600" />
                      <span>+391% contact rate retained</span>
                    </div>
                  </div>
                </div>

                {/* Connector 1 */}
                <div className="flex justify-center -my-1">
                  <span className="text-[10px] font-mono text-[#94a3b8] flex items-center gap-1 border-t border-dotted border-[#cbd5e1] pt-1 px-2">
                    <span className="h-1 w-1 rounded-full bg-cyan-500 animate-pulse" />
                    <span>&bull; 0-loss stream</span>
                  </span>
                </div>

                {/* Pillar 02: Clay Multi-Vendor Waterfall Engine */}
                <div className="relative flex items-start gap-3.5 p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] hover:border-amber-300 transition-colors group">
                  <div className="relative z-10 w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Workflow className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-[#0f172a] tracking-tight">
                        Pillar 02: Automated Waterfall Enrichment
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-amber-50 text-amber-700 border border-amber-200 shrink-0 font-semibold">
                        94.8% Match
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748b] mt-0.5 leading-snug">
                      Apollo &rarr; Prospeo &rarr; Datagma cascade. Verified mobile dials and executive work emails.
                    </p>
                    <div className="mt-1.5 flex items-center gap-1.5 text-[10px] font-mono text-amber-700 font-medium">
                      <CheckCircle2 className="h-3 w-3 text-amber-600" />
                      <span>15+ hrs/rep/week reclaimed</span>
                    </div>
                  </div>
                </div>

                {/* Connector 2 */}
                <div className="flex justify-center -my-1">
                  <span className="text-[10px] font-mono text-[#94a3b8] flex items-center gap-1 border-t border-dotted border-[#cbd5e1] pt-1 px-2">
                    <span className="h-1 w-1 rounded-full bg-amber-500 animate-pulse" />
                    <span>&bull; zero rep research</span>
                  </span>
                </div>

                {/* Pillar 03: Governed CRM Schema Lock (HubSpot / SFDC) */}
                <div className="relative flex items-start gap-3.5 p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] hover:border-blue-300 transition-colors group">
                  <div className="relative z-10 w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <ShieldCheck className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-[#0f172a] tracking-tight">
                        Pillar 03: Governed CRM Architecture
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-blue-50 text-blue-700 border border-blue-200 shrink-0 font-semibold">
                        0 Schema Drift
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748b] mt-0.5 leading-snug">
                      Root-domain deduplication, locked picklists, and deterministic ownership assignment.
                    </p>
                    <div className="mt-1.5 flex items-center gap-1.5 text-[10px] font-mono text-blue-700 font-medium">
                      <CheckCircle2 className="h-3 w-3 text-blue-600" />
                      <span>100% clean pipeline data</span>
                    </div>
                  </div>
                </div>

                {/* Connector 3 */}
                <div className="flex justify-center -my-1">
                  <span className="text-[10px] font-mono text-[#94a3b8] flex items-center gap-1 border-t border-dotted border-[#cbd5e1] pt-1 px-2">
                    <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                    <span>&bull; compounded conversion</span>
                  </span>
                </div>

                {/* Stage 04: The Net Business Profit / Financial Outcome (Dark Accent Container) */}
                <div className="relative p-3.5 rounded-xl bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white border border-[#334155] shadow-sm">
                  <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                        <TrendingUp className="h-3 w-3" />
                      </div>
                      <span className="text-[11px] font-mono font-semibold text-slate-200 tracking-wider">
                        FINANCIAL OUTCOME // 12-MONTH IMPACT
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500 text-white font-bold tracking-tight shadow-xs">
                      ROI: 12.8x
                    </span>
                  </div>

                  {/* High-Impact Outcome Metrics */}
                  <div className="grid grid-cols-2 gap-2.5 mb-2">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-base font-bold text-emerald-400 font-mono tracking-tight leading-none">
                        +$420,000 / yr
                      </div>
                      <div className="text-[10px] text-slate-300 mt-1 leading-tight">
                        Protected pipeline from sub-60s speed-to-lead
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-base font-bold text-cyan-300 font-mono tracking-tight leading-none">
                        60+ Hours / mo
                      </div>
                      <div className="text-[10px] text-slate-300 mt-1 leading-tight">
                        Rep selling capacity restored from manual research
                      </div>
                    </div>
                  </div>

                  {/* Modeled assumption sub-text */}
                  <div className="text-[10px] font-mono text-slate-400 text-center">
                    Modeled on $25k–$35k ACV across 40 inbounds/mo
                  </div>
                </div>

              </div>

              {/* Architectural Card Footer Telemetry */}
              <div className="mt-4 pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-[11px] font-mono text-[#64748b]">
                <span className="flex items-center gap-1.5 font-semibold text-[#0f172a]">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                  <span>TOTAL PIPELINE LIFT: +$420K</span>
                </span>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200">
                  GUARANTEED DETERMINISTIC SLA
                </span>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* =========================================================================
          SECTION DIVIDER & BENCHMARK TRANSITION
         ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 my-2">
          <div className="h-[1px] flex-1 bg-[#E6DFD5]" />
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6DFD5]/40 border border-[#E6DFD5] text-[11px] font-mono text-[#64748b]">
            <Sliders className="h-3 w-3 text-[#6366F1]" />
            <span>// BENCHMARK_SIMULATOR</span>
          </div>
          <div className="h-[1px] flex-1 bg-[#E6DFD5]" />
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: PIPELINE LATENCY & FINANCIAL IMPACT CALCULATOR
         ========================================================================= */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* HERO CENTERPIECE: Pipeline Latency & Financial Impact Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-2xl border border-[#E6DFD5] bg-[#FAF8F5] p-6 sm:p-10 shadow-[0_4px_24px_rgba(63,61,86,0.04)] relative overflow-hidden"
        >
          {/* Top Label & Presets */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#E6DFD5] mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#6366F1] uppercase tracking-wider">
                <Sliders className="h-3.5 w-3.5" />
                <span>FINANCIAL_IMPACT_CALCULATOR // HBR BENCHMARK</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#000000] font-normal mt-1">
                Pipeline Latency &amp; Financial Impact Calculator
              </h2>
            </div>

            {/* Quick Benchmark Presets */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setLatencyMinutes(1)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  latencyMinutes === 1
                    ? 'bg-[#6366F1] text-white shadow-xs font-semibold'
                    : 'bg-[#E6DFD5]/40 text-[#3F3D56] hover:bg-[#E6DFD5]/70 hover:text-[#000000]'
                }`}
              >
                1m (Automated SLA)
              </button>
              <button
                type="button"
                onClick={() => setLatencyMinutes(10)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  latencyMinutes === 10
                    ? 'bg-[#6366F1] text-white shadow-xs font-semibold'
                    : 'bg-[#E6DFD5]/40 text-[#3F3D56] hover:bg-[#E6DFD5]/70 hover:text-[#000000]'
                }`}
              >
                10m (Decay Point)
              </button>
              <button
                type="button"
                onClick={() => setLatencyMinutes(42)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  latencyMinutes === 42
                    ? 'bg-[#6366F1] text-white shadow-xs font-semibold'
                    : 'bg-[#E6DFD5]/40 text-[#3F3D56] hover:bg-[#E6DFD5]/70 hover:text-[#000000]'
                }`}
              >
                42m (Industry Avg)
              </button>
            </div>
          </div>

          {/* Interactive Latency Slider Component */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-sm font-semibold text-[#000000] font-sans">
                Inbound First-Response Latency:
              </label>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-3xl font-bold text-[#000000] tracking-tight">{latencyMinutes}</span>
                <span className="text-xs text-[#3F3D56] uppercase tracking-wider">Minutes to Outreach</span>
              </div>
            </div>

            {/* Custom Styled Range Slider */}
            <div className="relative pt-2 pb-4">
              <input
                type="range"
                min="1"
                max="60"
                value={latencyMinutes}
                onChange={(e) => setLatencyMinutes(parseInt(e.target.value))}
                className="w-full h-2.5 bg-[#E6DFD5] rounded-lg appearance-none cursor-pointer accent-[#6366F1] focus:outline-none"
              />
              <div className="flex justify-between text-[11px] font-mono text-[#3F3D56]/70 mt-2">
                <span>&lt;1m (Deterministic Webhook)</span>
                <span className="text-[#6366F1] font-semibold">10m (Qualification Drop)</span>
                <span>42m (SDR Triage Lag)</span>
                <span>60m+ (Cold Lead)</span>
              </div>
            </div>

            {/* Impact Readout Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Metric 1: Pipeline Drop-off */}
              <div className="p-4 rounded-xl bg-[#E6DFD5]/30 border border-[#E6DFD5] space-y-1">
                <div className="text-xs font-mono text-[#3F3D56]/80 uppercase">Qualification Degradation</div>
                <div className={`text-2xl font-serif font-normal ${metrics.isDegraded ? 'text-rose-700' : 'text-emerald-800'}`}>
                  {metrics.dropoffText}
                </div>
                <div className="text-[11px] text-[#3F3D56]">
                  {metrics.isDegraded 
                    ? 'Harvard Business Review: 391% drop in contact rate after 10m.' 
                    : 'Near 100% connection probability within 5 minutes.'}
                </div>
              </div>

              {/* Metric 2: Annual Pipeline Burn */}
              <div className="p-4 rounded-xl bg-[#E6DFD5]/30 border border-[#E6DFD5] space-y-1">
                <div className="text-xs font-mono text-[#3F3D56]/80 uppercase">Annualized Revenue Leakage</div>
                <div className={`text-2xl font-serif font-normal ${metrics.burnAmount > 0 ? 'text-rose-700' : 'text-emerald-800'}`}>
                  {metrics.burnAmount === 0 ? '$0 / yr Protected' : `-$${metrics.burnAmount.toLocaleString()} / yr`}
                </div>
                <div className="text-[11px] text-[#3F3D56]">
                  Modeled on $25k ACV with 40 inbound requests / month.
                </div>
              </div>

              {/* Metric 3: Salvaged ARR */}
              <div className="p-4 rounded-xl bg-[#6366F1]/5 border border-[#6366F1]/20 space-y-1">
                <div className="text-xs font-mono text-[#6366F1] uppercase font-semibold">Deterministic Recovery</div>
                <div className="text-2xl font-serif text-[#6366F1] font-normal">
                  +$420,000 / yr
                </div>
                <div className="text-[11px] text-[#3F3D56]">
                  Recovered by achieving &lt;60s SLA handoffs directly to AE calendars.
                </div>
              </div>
            </div>

            {/* Bottom Diagnostic Action Strip */}
            <div className="pt-4 border-t border-[#E6DFD5] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans">
              <span className="text-[#3F3D56]">
                {metrics.isDegraded 
                  ? 'Key finding: Buyers delayed past 10 minutes are 6x more likely to purchase from the fastest responder.'
                  : 'Automated workflow: Immediate webhook capture, 3-tier Clay enrichment, and instant Slack deal-desk alert.'}
              </span>
              <Link
                to="/intake"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-white bg-[#6366F1] hover:bg-[#4F46E5] transition-colors shrink-0 shadow-xs"
              >
                <span>Fix Inbound Latency with Diagnostic</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* =========================================================================
          SECTION 2: DETERMINISTIC INBOUND PIPELINE ARCHITECTURE SIMULATOR
         ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl border border-[#E6DFD5] bg-[#FAF8F5] p-6 sm:p-10 shadow-[0_4px_24px_rgba(63,61,86,0.04)] relative overflow-hidden">
          
          <div className="relative z-10 space-y-8">
            {/* Top Row: Section Header & Mode Toggle */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-[#E6DFD5] pb-6">
              <div className="space-y-2">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#E6DFD5]/40 border border-[#E6DFD5] text-xs font-mono text-[#3F3D56]">
                  <span className={`h-2 w-2 rounded-full ${pipelineMode === 'deterministic' ? 'bg-[#6366F1] animate-pulse' : 'bg-rose-500'}`} />
                  <span>SYS_ROUTING_ENGINE &bull; SLA &lt;60s</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-serif text-[#000000] tracking-tight font-normal">
                  From Inbound Form Fill to Rep Outreach in Under 60 Seconds
                </h2>
                <p className="text-sm sm:text-base text-[#3F3D56] font-sans max-w-2xl leading-relaxed">
                  Eliminate manual SDR triage. Automate research, verify contact data, and dispatch ready-to-book leads before your prospect leaves the tab.
                </p>
              </div>

              {/* Mode Toggle Controls */}
              <div className="shrink-0">
                <div className="inline-flex p-1 rounded-xl bg-[#E6DFD5]/50 border border-[#E6DFD5] shadow-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setPipelineMode('deterministic');
                      setLeadClaimed(false);
                      setActivePipelineStep(0);
                    }}
                    className={`px-3.5 py-2 rounded-lg text-xs font-mono transition-all flex items-center gap-2 ${
                      pipelineMode === 'deterministic'
                        ? 'bg-[#6366F1] text-white shadow-sm font-semibold'
                        : 'text-[#3F3D56] hover:text-[#000000]'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Deterministic Webhook Automation (&lt;60s SLA)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPipelineMode('manual');
                      setLeadClaimed(false);
                      setActivePipelineStep(1);
                    }}
                    className={`px-3.5 py-2 rounded-lg text-xs font-mono transition-all flex items-center gap-2 ${
                      pipelineMode === 'manual'
                        ? 'bg-rose-700 text-white shadow-sm font-semibold'
                        : 'text-[#3F3D56] hover:text-[#000000]'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Legacy Manual SDR Loop (42.4-min lag)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Live Operational Status Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-[#E6DFD5]/30 border border-[#E6DFD5] font-mono text-xs">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {pipelineMode === 'deterministic' ? (
                  <>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#6366F1]/10 text-[#6366F1] font-semibold border border-[#6366F1]/30">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#6366F1] animate-ping" />
                      &lt;60s SLA Guaranteed
                    </span>
                    <span className="text-[#3F3D56]">Total Latency: <strong className="text-[#000000]">28.6s End-to-End</strong></span>
                    <span className="text-[#E6DFD5] hidden sm:inline">&bull;</span>
                    <span className="text-[#3F3D56] hidden sm:inline">Data Integrity: <strong className="text-[#000000]">100% Schema Locked</strong></span>
                  </>
                ) : (
                  <>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-100 text-rose-900 font-semibold border border-rose-300">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                      Critical Revenue Leakage Alert
                    </span>
                    <span className="text-[#3F3D56]">Triage Latency: <strong className="text-rose-700">42.4m Average First Touch</strong></span>
                    <span className="text-[#E6DFD5] hidden sm:inline">&bull;</span>
                    <span className="text-rose-700 hidden sm:inline font-semibold">391% Qualification Drop-off (HBR)</span>
                  </>
                )}
              </div>

              <div className="text-[11px]">
                {pipelineMode === 'deterministic' ? (
                  <span className="text-[#6366F1] font-semibold">⚡ Active Protocol: Zero Manual Triage</span>
                ) : (
                  <span className="text-rose-700 font-semibold">⚠️ Bottleneck: Multi-tab Manual SDR Research</span>
                )}
              </div>
            </div>

            {/* Architectural SVG Pipe Schematic (Pulsing Data Packet in Electric Indigo) */}
            <div className="hidden lg:block relative py-1 px-4">
              <svg viewBox="0 0 1000 64" className="w-full h-16 overflow-visible select-none">
                <defs>
                  <linearGradient id="pipeIndigo" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366F1" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.9" />
                  </linearGradient>
                </defs>

                {/* Background Conduit Pipe */}
                <line x1="125" y1="32" x2="875" y2="32" stroke="#E6DFD5" strokeWidth="6" strokeLinecap="round" />
                <line x1="125" y1="32" x2="875" y2="32" stroke="#FAF8F5" strokeWidth="2" strokeLinecap="round" />

                {/* Animated Conduits */}
                {pipelineMode === 'deterministic' ? (
                  <>
                    <line 
                      x1="125" 
                      y1="32" 
                      x2="875" 
                      y2="32" 
                      stroke="url(#pipeIndigo)" 
                      strokeWidth="3.5" 
                      strokeLinecap="round"
                      strokeDasharray="16 10" 
                      className="animate-pulse"
                    />

                    {/* Animated Pulsing Data Packet in Electric Indigo #6366F1 */}
                    <motion.g
                      animate={{
                        x: [125, 375, 625, 875],
                      }}
                      transition={{
                        duration: 3.0,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <circle cx="0" cy="32" r="7.5" fill="#6366F1" filter="drop-shadow(0 0 8px rgba(99, 102, 241, 0.8))" />
                      <circle cx="0" cy="32" r="3" fill="#ffffff" />
                    </motion.g>

                    <motion.g
                      animate={{
                        x: [125, 375, 625, 875],
                      }}
                      transition={{
                        duration: 3.0,
                        repeat: Infinity,
                        delay: 1.5,
                        ease: "easeInOut",
                      }}
                    >
                      <circle cx="0" cy="32" r="5" fill="#818CF8" filter="drop-shadow(0 0 5px rgba(129, 140, 248, 0.6))" />
                      <circle cx="0" cy="32" r="2" fill="#ffffff" />
                    </motion.g>
                  </>
                ) : (
                  <>
                    {/* Stalled Pipe with Bottleneck Warnings */}
                    <line x1="125" y1="32" x2="375" y2="32" stroke="#F59E0B" strokeWidth="3" strokeDasharray="6 4" />
                    <line x1="375" y1="32" x2="875" y2="32" stroke="#EF4444" strokeWidth="3" strokeDasharray="3 6" strokeOpacity="0.6" />
                    <circle cx="375" cy="32" r="11" fill="#FEE2E2" stroke="#EF4444" strokeWidth="2" />
                    <text x="375" y="36" fill="#B91C1C" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">!</text>
                    <text x="375" y="58" fill="#B91C1C" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="bold">
                      BOTTLENECK: MANUAL LINKEDIN STALL
                    </text>
                  </>
                )}

                {/* 4 Pipeline Node Ports */}
                {[
                  { cx: 125, label: "STAGE 01: LEAD CAPTURE", port: "HTTP 200" },
                  { cx: 375, label: "STAGE 02: AUTO-ENRICH", port: "WATERFALL" },
                  { cx: 625, label: "STAGE 03: CRM GOVERNANCE", port: "GOVERNED" },
                  { cx: 875, label: "STAGE 04: DEAL DESK", port: "DISPATCH" },
                ].map((node, i) => {
                  const isActive = activePipelineStep === i;
                  return (
                    <g 
                      key={node.cx} 
                      className="cursor-pointer"
                      onClick={() => setActivePipelineStep(i)}
                    >
                      <circle 
                        cx={node.cx} 
                        cy="32" 
                        r={isActive ? "13" : "10"} 
                        fill="#FAF8F5" 
                        stroke={
                          pipelineMode === 'deterministic'
                            ? isActive ? "#6366F1" : "#E6DFD5"
                            : i === 1 ? "#EF4444" : "#E6DFD5"
                        } 
                        strokeWidth={isActive ? "2.5" : "1.8"} 
                      />
                      <circle 
                        cx={node.cx} 
                        cy="32" 
                        r="4" 
                        fill={
                          pipelineMode === 'deterministic'
                            ? isActive ? "#6366F1" : "#3F3D56"
                            : i === 1 ? "#EF4444" : "#A8A29E"
                        } 
                      />
                      <text 
                        x={node.cx} 
                        y="14" 
                        fill={isActive ? "#000000" : "#3F3D56"} 
                        fontSize="8.5" 
                        fontFamily="JetBrains Mono" 
                        textAnchor="middle"
                        fontWeight={isActive ? "bold" : "normal"}
                      >
                        {node.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* The 4-Stage Architecture Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              
              {/* STAGE 1: INGESTION (WEBHOOK) */}
              <div 
                onClick={() => setActivePipelineStep(0)}
                className={`cursor-pointer rounded-xl border p-4 sm:p-5 transition-all relative flex flex-col justify-between ${
                  activePipelineStep === 0
                    ? 'border-[#6366F1] bg-[#FAF8F5] shadow-xs ring-1 ring-[#6366F1]/30'
                    : 'border-[#E6DFD5] bg-[#FAF8F5] hover:border-[#3F3D56]/40'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] tracking-wider uppercase text-[#3F3D56]/70 font-semibold">
                      STAGE 01 // CAPTURE
                    </span>
                    <div className="h-7 w-7 rounded-lg bg-[#E6DFD5]/50 flex items-center justify-center text-[#6366F1]">
                      <Zap className="h-3.5 w-3.5" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-serif text-[#000000] font-medium leading-snug">
                      Instant Lead Capture (&lt;120ms)
                    </h3>
                    <p className="text-xs text-[#3F3D56] font-mono mt-0.5">
                      Captures high-intent buyers before drop-off
                    </p>
                  </div>

                  {/* Latency Badge */}
                  <div className="pt-1">
                    {pipelineMode === 'deterministic' ? (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/30 text-xs font-mono font-semibold">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#6366F1]" />
                        0.2s Ingested
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-300 text-xs font-mono font-semibold">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        5-min Polling Delay
                      </div>
                    )}
                  </div>

                  {/* Technical Specs */}
                  <div className="pt-2 border-t border-[#E6DFD5] space-y-1.5 text-[11px] font-mono text-[#3F3D56]">
                    <div className="flex items-start gap-1.5">
                      <span className="text-[#6366F1] font-bold">&rsaquo;</span>
                      <span>Zero-loss event stream: captures intent instantly</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-[#6366F1] font-bold">&rsaquo;</span>
                      <span>Instant IP firmographics &amp; company reveal</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-[#6366F1] font-bold">&rsaquo;</span>
                      <span>Full campaign UTM &amp; referrer attribution lock</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-2.5 border-t border-[#E6DFD5] flex items-center justify-between text-[10px] font-mono text-[#3F3D56]/60">
                  <span>ENDPOINT: POST /v1</span>
                  <span className="text-[#047857] font-semibold px-2 py-0.5 rounded bg-[#047857]/[0.08] border border-[#047857]/25">STATUS: 200 OK</span>
                </div>
              </div>

              {/* STAGE 2: WATERFALL ENRICHMENT (CLAY) */}
              <div 
                onClick={() => setActivePipelineStep(1)}
                className={`cursor-pointer rounded-xl border p-4 sm:p-5 transition-all relative flex flex-col justify-between ${
                  activePipelineStep === 1
                    ? pipelineMode === 'deterministic'
                      ? 'border-[#6366F1] bg-[#FAF8F5] shadow-xs ring-1 ring-[#6366F1]/30'
                      : 'border-rose-400 bg-rose-50/40 shadow-xs ring-1 ring-rose-400/40'
                    : 'border-[#E6DFD5] bg-[#FAF8F5] hover:border-[#3F3D56]/40'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] tracking-wider uppercase text-[#3F3D56]/70 font-semibold">
                      STAGE 02 // AUTO-ENRICH
                    </span>
                    <div className="h-7 w-7 rounded-lg bg-[#E6DFD5]/50 flex items-center justify-center text-[#6366F1]">
                      <Layers className="h-3.5 w-3.5" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-serif text-[#000000] font-medium leading-snug">
                      Multi-Vendor Auto-Enrichment
                    </h3>
                    <p className="text-xs text-[#3F3D56] font-mono mt-0.5">
                      Sequential verification: Apollo &bull; Prospeo &bull; Datagma
                    </p>
                  </div>

                  {/* Latency Badge */}
                  <div className="pt-1">
                    {pipelineMode === 'deterministic' ? (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/30 text-xs font-mono font-semibold">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#6366F1]" />
                        2.1s Enriched
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 text-rose-900 border border-rose-300 text-xs font-mono font-semibold">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        15m Manual LinkedIn Search
                      </div>
                    )}
                  </div>

                  {/* Technical Specs */}
                  <div className="pt-2 border-t border-[#E6DFD5] space-y-1.5 text-[11px] font-mono text-[#3F3D56]">
                    <div className="flex items-start gap-1.5">
                      <span className="text-[#6366F1] font-bold">1.</span>
                      <span>Verified executive work email &amp; title lookup</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-[#6366F1] font-bold">2.</span>
                      <span>98.4% deliverability SMTP validation gate</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-[#6366F1] font-bold">3.</span>
                      <span>Direct mobile dials &amp; verified ARR tiering</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-2.5 border-t border-[#E6DFD5] flex items-center justify-between text-[10px] font-mono text-[#3F3D56]/60">
                  <span>CASCADE: 3-TIER</span>
                  <span className="text-[#6366F1] font-semibold">MATCH: 94.8%</span>
                </div>
              </div>

              {/* STAGE 3: CRM GOVERNANCE (DEDUPLICATION LOCK) */}
              <div 
                onClick={() => setActivePipelineStep(2)}
                className={`cursor-pointer rounded-xl border p-4 sm:p-5 transition-all relative flex flex-col justify-between ${
                  activePipelineStep === 2
                    ? 'border-[#6366F1] bg-[#FAF8F5] shadow-xs ring-1 ring-[#6366F1]/30'
                    : 'border-[#E6DFD5] bg-[#FAF8F5] hover:border-[#3F3D56]/40'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] tracking-wider uppercase text-[#3F3D56]/70 font-semibold">
                      STAGE 03 // CRM GOVERNANCE
                    </span>
                    <div className="h-7 w-7 rounded-lg bg-[#E6DFD5]/50 flex items-center justify-center text-[#6366F1]">
                      <Database className="h-3.5 w-3.5" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-serif text-[#000000] font-medium leading-snug">
                      Clean CRM Governance (HubSpot &amp; Salesforce)
                    </h3>
                    <p className="text-xs text-[#3F3D56] font-mono mt-0.5">
                      Zero duplicate records, locked picklists &amp; routing
                    </p>
                  </div>

                  {/* Latency Badge */}
                  <div className="pt-1">
                    {pipelineMode === 'deterministic' ? (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/30 text-xs font-mono font-semibold">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#6366F1]" />
                        4.8s CRM Synced
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-300 text-xs font-mono font-semibold">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        Un-enriched Queue
                      </div>
                    )}
                  </div>

                  {/* Technical Specs */}
                  <div className="pt-2 border-t border-[#E6DFD5] space-y-1.5 text-[11px] font-mono text-[#3F3D56]">
                    <div className="flex items-start gap-1.5">
                      <span className="text-[#6366F1] font-bold">&rsaquo;</span>
                      <span>Domain-level deduplication: stops duplicate leads</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-[#6366F1] font-bold">&rsaquo;</span>
                      <span>Governed picklists eliminate messy text fields</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-[#6366F1] font-bold">&rsaquo;</span>
                      <span>Deterministic round-robin rep ownership assignment</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-2.5 border-t border-[#E6DFD5] flex items-center justify-between text-[10px] font-mono text-[#3F3D56]/60">
                  <span>DEDUP: DOMAIN KEY</span>
                  <span className="text-[#047857] font-semibold px-2 py-0.5 rounded bg-[#047857]/[0.08] border border-[#047857]/25">INTEGRITY: 100%</span>
                </div>
              </div>

              {/* STAGE 4: REAL-TIME SLACK ALERT & 1-CLICK CLAIM */}
              <div 
                onClick={() => setActivePipelineStep(3)}
                className={`cursor-pointer rounded-xl border p-4 sm:p-5 transition-all relative flex flex-col justify-between ${
                  activePipelineStep === 3
                    ? 'border-[#6366F1] bg-[#FAF8F5] shadow-xs ring-1 ring-[#6366F1]/30'
                    : 'border-[#E6DFD5] bg-[#FAF8F5] hover:border-[#3F3D56]/40'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] tracking-wider uppercase text-[#3F3D56]/70 font-semibold">
                      STAGE 04 // DEAL DESK
                    </span>
                    <div className="h-7 w-7 rounded-lg bg-[#E6DFD5]/50 flex items-center justify-center text-[#6366F1]">
                      <Send className="h-3.5 w-3.5" />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-serif text-lg text-[#000000] font-normal">
                      Instant Deal Desk Dispatch (Slack / AE Calendar)
                    </h4>
                    <p className="text-xs text-[#3F3D56] font-sans mt-0.5">
                      Actionable buyer dossier pushed to reps while intent is peaking
                    </p>
                  </div>

                  {/* Latency Tag */}
                  <div className="font-mono text-xs">
                    <span className="px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E6DFD5] text-[#3F3D56] text-[11px]">
                      {pipelineMode === 'deterministic' ? 'LATENCY: 28.0s' : 'LATENCY: 42.4 MIN'}
                    </span>
                  </div>

                  {/* Slack Alert Micro Card */}
                  <div className="pt-1">
                    {pipelineMode === 'deterministic' ? (
                      <div className="rounded-lg bg-white border border-[#E6DFD5] p-2.5 shadow-xs font-sans text-xs text-left">
                        <div className="flex items-center justify-between text-[10px] text-[#3F3D56]/70 font-mono">
                          <span className="font-bold text-[#6366F1]">#deals-inbound</span>
                          <span>Just now</span>
                        </div>
                        <div className="font-bold text-[#000000] mt-1 text-xs">
                          🔥 Tier 1 Demo Request ($35k ACV)
                        </div>
                        <div className="text-[10px] text-neutral-400 font-sans">
                          FinTech Corp ($45M ARR &bull; 185 emp)
                        </div>

                        {/* 1-Click Interactive Claim Lead Button */}
                        <div className="mt-2.5">
                          {!leadClaimed ? (
                            <button
                              type="button"
                              onClick={() => setLeadClaimed(true)}
                              className="w-full py-1.5 px-2.5 rounded bg-[#6366F1] hover:bg-[#4F46E5] text-white font-mono text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-98"
                            >
                              <Zap className="w-3 h-3 fill-white" />
                              <span>Claim Lead (1-Click)</span>
                            </button>
                          ) : (
                            <div className="py-1 px-2 rounded bg-[#047857]/[0.08] border border-[#047857]/25 text-[#047857] font-mono text-[10px] font-semibold flex items-center justify-center gap-1">
                              <Check className="w-3 h-3 text-[#059669]" />
                              <span>Claimed: Sarah T. (AE) &bull; Demo Booked</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-lg bg-rose-950/20 border border-rose-300 text-rose-950 p-2.5 font-sans text-xs text-left">
                        <div className="flex items-center gap-1 text-rose-700 font-mono text-[10px] font-bold">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                          <span>42.4 MIN LATENCY EXCEEDED</span>
                        </div>
                        <p className="mt-1 text-[11px] text-rose-800 leading-snug">
                          Prospect waited 42m with zero response. Scheduled meeting with automated competitor.
                        </p>
                        <div className="mt-1.5 text-[10px] font-mono text-rose-700 bg-rose-100 p-1 rounded border border-rose-200">
                          Result: Lead Abandoned (-$10k ACV)
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-2.5 border-t border-[#E6DFD5] flex items-center justify-between text-[10px] font-mono text-[#3F3D56]/60">
                  <span>HANDOFF: SLACK API</span>
                  <span className={pipelineMode === 'deterministic' ? 'text-[#047857] font-semibold px-2 py-0.5 rounded bg-[#047857]/[0.08] border border-[#047857]/25' : 'text-rose-700 font-semibold'}>
                    {pipelineMode === 'deterministic' ? 'DELIVERED <60s' : 'SLA BREACH'}
                  </span>
                </div>
              </div>

            </div>

            {/* Engineering Caption Footnote */}
            <div className="pt-4 border-t border-[#E6DFD5] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#3F3D56] font-mono">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#6366F1]" />
                <span>SYS_ROUTING_SPEC // CLAY WATERFALL API // STRICT SCHEMA GOVERNANCE</span>
              </div>
              <Link
                to="/stack"
                className="inline-flex items-center text-xs font-semibold text-[#000000] hover:text-[#6366F1] gap-1.5 shrink-0 transition-colors"
              >
                <span>Inspect Full Architectural Stack</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: THE OPERATOR'S ARCHITECTURAL COMPARISON
         ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-serif text-[#000000] tracking-tight font-normal">
            Workflow Architecture Comparison
          </h2>
          <p className="mt-2 text-base text-[#3F3D56] max-w-xl mx-auto font-sans">
            Examining the operational reality of legacy manual SDR triage vs. deterministic automated systems.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Card: Legacy Manual SDR Loop */}
          <div className="p-6 sm:p-8 rounded-2xl border border-rose-200 bg-[#FAF8F5] space-y-6 shadow-subtle">
            <div className="flex items-center justify-between pb-4 border-b border-rose-200/80">
              <div className="flex items-center space-x-3">
                <div className="h-9 w-9 rounded-lg bg-rose-100 flex items-center justify-center text-rose-700">
                  <XCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-[#000000] font-normal">Legacy Manual SDR Loop</h3>
                  <div className="text-xs text-rose-700 font-mono mt-0.5">LATENCY: 42.4-MIN AVERAGE LAG</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded text-xs font-mono font-semibold bg-rose-100 text-rose-800 border border-rose-300">
                High Failure Risk
              </span>
            </div>

            <div className="space-y-4 text-xs font-sans text-[#3F3D56]">
              <div className="flex items-start space-x-3">
                <span className="h-5 w-5 rounded-full bg-rose-100 text-rose-800 flex items-center justify-center text-[10px] font-mono shrink-0 font-bold">1</span>
                <div>
                  <strong className="text-[#000000] font-semibold block">Polling Delays &amp; CSV Exports:</strong>
                  Inbound form submissions sit unread in generic inboxes or unassigned queue views for minutes or hours.
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="h-5 w-5 rounded-full bg-rose-100 text-rose-800 flex items-center justify-center text-[10px] font-mono shrink-0 font-bold">2</span>
                <div>
                  <strong className="text-[#000000] font-semibold block">Manual 8-Tab LinkedIn Research:</strong>
                  Reps manually open LinkedIn, company websites, and secondary tools to verify employee headcount and job title.
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="h-5 w-5 rounded-full bg-rose-100 text-rose-800 flex items-center justify-center text-[10px] font-mono shrink-0 font-bold">3</span>
                <div>
                  <strong className="text-[#000000] font-semibold block">CRM Data Pollution &amp; Duplicate Records:</strong>
                  Lack of strict picklists and domain deduplication results in fragmented lead histories and account overwrites.
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="h-5 w-5 rounded-full bg-rose-100 text-rose-800 flex items-center justify-center text-[10px] font-mono shrink-0 font-bold">4</span>
                <div>
                  <strong className="text-[#000000] font-semibold block">Buyer Intent Dissipation:</strong>
                  By the time an outreach email is sent, the prospect has closed the tab or booked with an automated competitor.
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 font-mono">
              <strong>OPERATIONAL OUTCOME:</strong> 391% decrease in qualification probability &bull; 15–20 rep hours/week wasted.
            </div>
          </div>

          {/* Right Card: Deterministic Webhook Architecture */}
          <div className="p-6 sm:p-8 rounded-2xl border border-[#6366F1]/40 bg-[#FAF8F5] space-y-6 shadow-subtle ring-1 ring-[#6366F1]/20">
            <div className="flex items-center justify-between pb-4 border-b border-[#E6DFD5]">
              <div className="flex items-center space-x-3">
                <div className="h-9 w-9 rounded-lg bg-[#6366F1]/10 flex items-center justify-center text-[#6366F1]">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-[#000000] font-normal">Deterministic Webhook Pipeline</h3>
                  <div className="text-xs text-[#6366F1] font-mono mt-0.5">SLA: &lt; 60 SECONDS END-TO-END</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded text-xs font-mono font-semibold bg-[#047857]/[0.08] text-[#047857] border border-[#047857]/25">
                100% Deterministic
              </span>
            </div>

            <div className="space-y-4 text-xs font-sans text-[#3F3D56]">
              <div className="flex items-start space-x-3">
                <span className="h-5 w-5 rounded-full bg-[#6366F1]/10 text-[#6366F1] flex items-center justify-center text-[10px] font-mono shrink-0 font-bold">1</span>
                <div>
                  <strong className="text-[#000000] font-semibold block">Sub-120ms Ingestion &bull; Zero Inbound Lead Decay:</strong>
                  Web forms emit immediate HTTP POST webhooks into serverless routers with zero polling delay, eliminating the 391% qualification drop-off.
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="h-5 w-5 rounded-full bg-[#6366F1]/10 text-[#6366F1] flex items-center justify-center text-[10px] font-mono shrink-0 font-bold">2</span>
                <div>
                  <strong className="text-[#000000] font-semibold block">Multi-Source Waterfall Cascade &bull; Zero Rep Research Overhead:</strong>
                  Clay sequentially pings Apollo, Prospeo, and Datagma until verified direct mobile and work email are secured (94.8% match rate), freeing 15+ hours/rep/week.
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="h-5 w-5 rounded-full bg-[#6366F1]/10 text-[#6366F1] flex items-center justify-center text-[10px] font-mono shrink-0 font-bold">3</span>
                <div>
                  <strong className="text-[#000000] font-semibold block">Domain Deduplication &amp; Locked Schemas &bull; 100% CRM Cleanliness:</strong>
                  Exact root-domain matching in Salesforce/HubSpot prevents duplicate records, enforcing strict picklists and deterministic rep assignment.
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="h-5 w-5 rounded-full bg-[#6366F1]/10 text-[#6366F1] flex items-center justify-center text-[10px] font-mono shrink-0 font-bold">4</span>
                <div>
                  <strong className="text-[#000000] font-semibold block">Real-time Slack Deal Desk Dispatch &bull; Sub-60s Meeting Booking:</strong>
                  Reps receive an actionable Slack alert card with an enriched dossier and 1-click meeting calendar claim while buyer intent is peaking.
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#047857]/[0.08] border border-[#047857]/25 text-xs text-[#065F46] font-mono">
              <strong>OPERATIONAL OUTCOME:</strong> Zero manual research hours &bull; 6x increase in fast-responder conversion win rate &bull; ~$420k/yr pipeline protected.
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 4: CALL TO ACTION FOOTER BANNER
         ========================================================================= */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl border border-[#E6DFD5] bg-[#FAF8F5] p-8 sm:p-12 text-center space-y-6 shadow-subtle relative overflow-hidden">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#E6DFD5]/40 border border-[#E6DFD5] text-xs font-mono text-[#3F3D56]">
            <span>SYSTEMS_AUDIT_PROGRAM // 7-DAY DELIVERY</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif text-[#000000] tracking-tight font-normal max-w-2xl mx-auto">
            Ready to deploy deterministic RevOps infrastructure?
          </h2>

          <p className="text-base text-[#3F3D56] max-w-xl mx-auto font-sans leading-relaxed">
            Eliminate pipeline leakage with our 7-day forensic audit. Fixed fee ($3,500), senior architects only, zero billable hour traps.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/intake"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-medium text-white bg-[#6366F1] hover:bg-[#4F46E5] shadow-xs transition-colors"
            >
              <span>Book GTM Architecture Diagnostic ($3,500)</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>

            <Link
              to="/services"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-medium text-[#000000] bg-white hover:bg-[#FAF8F5] border border-[#E6DFD5] shadow-xs transition-colors"
            >
              <span>View Productized Sprints &amp; Pricing</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
