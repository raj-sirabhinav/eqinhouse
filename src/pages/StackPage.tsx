import React, { useState } from 'react';
import { 
  Network, 
  Database, 
  Workflow, 
  MessageSquare, 
  CheckCircle2, 
  Sparkles, 
  RefreshCw, 
  Play, 
  ShieldCheck, 
  Zap, 
  Check, 
  UserCheck,
  Bell,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TiltCard } from '../components/TiltCard';

export const StackPage: React.FC = () => {
  // Card A: Make.com simulation state
  const [isMakePulsing, setIsMakePulsing] = useState(false);
  const [makeLatency, setMakeLatency] = useState(120);

  // Card B: Clay waterfall simulation state
  const [waterfallActive, setWaterfallActive] = useState(false);
  const [waterfallStep, setWaterfallStep] = useState(0);

  // Card C: Schema hygiene toggle
  const [isSanitized, setIsSanitized] = useState(false);

  // Card D: Slack claim & simulation state
  const [isDealClaimed, setIsDealClaimed] = useState(false);
  const [claimedTimestamp, setClaimedTimestamp] = useState<string | null>(null);
  const [isAlertSimulating, setIsAlertSimulating] = useState(false);
  const [alertReceived, setAlertReceived] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isButtonFlashing, setIsButtonFlashing] = useState(false);
  const [routingLatencyText, setRoutingLatencyText] = useState('Average Routing Time: 34 seconds');
  const [alertButtonState, setAlertButtonState] = useState<'idle' | 'dispatching' | 'ready_to_rerun'>('idle');

  // Trigger Clay waterfall step sequence
  const runWaterfallSimulation = () => {
    if (waterfallActive) return;
    setWaterfallActive(true);
    setWaterfallStep(1);

    setTimeout(() => setWaterfallStep(2), 900);
    setTimeout(() => setWaterfallStep(3), 2000);
    setTimeout(() => setWaterfallStep(4), 3100);
    setTimeout(() => {
      setWaterfallStep(5);
      setWaterfallActive(false);
    }, 4200);
  };

  // Trigger Make pulse simulation
  const triggerMakePulse = () => {
    setIsMakePulsing(true);
    setMakeLatency(Math.floor(Math.random() * 30) + 115);
    setTimeout(() => setIsMakePulsing(false), 2000);
  };

  // Trigger Slack simulation sequence (1.2s total live flow)
  const handleSimulateAlert = () => {
    if (isAlertSimulating) return;
    setIsAlertSimulating(true);
    setAlertButtonState('dispatching');
    setIsDealClaimed(false);
    setClaimedTimestamp(null);
    setAlertReceived(false);
    setShowToast(true);

    // 1. Toast appears immediately: "PAYLOAD_RECEIVED: ACME CORP (ARR $85k)"
    // 2. At 350ms, animate the block-kit card sliding in
    setTimeout(() => {
      setAlertReceived(true);
      setShowToast(false);
      setIsButtonFlashing(true);
    }, 350);

    // 3. At 1200ms, auto trigger claim: "Claimed by @Sarah (AE) • Calendar Confirmed"
    setTimeout(() => {
      setIsButtonFlashing(false);
      setIsDealClaimed(true);
      const now = new Date();
      setClaimedTimestamp(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setRoutingLatencyText('Routing Latency: 28s (<60s SLA Met)');
      setIsAlertSimulating(false);
    }, 1200);

    // 4. Post-run state: after 3 seconds, allow button to read "[Re-run Alert]"
    setTimeout(() => {
      setAlertButtonState('ready_to_rerun');
    }, 3000);
  };

  // Manual trigger Slack claim
  const handleClaimDeal = () => {
    setIsDealClaimed(true);
    const now = new Date();
    setClaimedTimestamp(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setRoutingLatencyText('Routing Latency: 28s (<60s SLA Met)');
  };

  return (
    <div className="relative z-10 space-y-20 py-8 sm:py-14">
      
      {/* =========================================================================
          SECTION 1: HEADER
         ========================================================================= */}
      <section className="text-center max-w-3xl mx-auto px-4 sm:px-6">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#f3ede4] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-secondary)] mb-6 font-sans">
          <Network className="h-3.5 w-3.5 text-[#6366F1]" />
          <span>Proven Architecture Standards &bull; High Reliability &bull; Resilient Webhooks</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-serif text-[var(--text-primary)] tracking-tight leading-tight font-normal">
          The Deterministic <span className="italic text-[#6366F1]">Revenue Stack</span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl mx-auto font-sans">
          We bridge the gap between AI automation and enterprise CRM data infrastructure. Test the interactive modules below.
        </p>
      </section>

      {/* =========================================================================
          SECTION 2: BENTO BOX ORCHESTRATION GRID
         ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* =====================================================================
              CARD A: Make.com Webhook Middleware
             ===================================================================== */}
          <TiltCard className="p-6 sm:p-8 flex flex-col justify-between border-[var(--border-subtle)] bg-[#FAF8F5] rounded-2xl h-full">
            <div className="flex flex-col flex-1">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--border-subtle)] mb-5">
                <div className="flex items-start space-x-3 min-w-0">
                  <div className="h-9 w-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#6366F1] shrink-0 mt-0.5">
                    <Workflow className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-serif text-2xl text-[var(--text-primary)] font-normal leading-tight">
                      Make.com Webhook Middleware
                    </h2>
                    <span className="text-xs text-[var(--text-secondary)] font-medium font-sans block mt-1">
                      Low-Latency Event Router &bull; Serverless Ingestion
                    </span>
                  </div>
                </div>
                <button
                  onClick={triggerMakePulse}
                  disabled={isMakePulsing}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium border border-[var(--border-subtle)] bg-white hover:bg-[#faf7f3] text-[#0F172A] transition-all flex items-center gap-1.5 shadow-xs active:scale-95 disabled:opacity-50 font-mono shrink-0"
                >
                  <Play className={`h-3 w-3 text-[#6366F1] fill-current ${isMakePulsing ? 'animate-pulse' : ''}`} />
                  <span>{isMakePulsing ? '[Routing...]' : '[Test Ingestion]'}</span>
                </button>
              </div>

              <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4 min-h-[36px] font-sans">
                Real-time scenario node canvas. Intercepts demo request payloads, runs concurrent schema checks, and routes data with automated retry policies.
              </p>

              {/* Pain Contrast Tag */}
              <div className="mb-4 rounded-xl border border-[var(--border-subtle)] bg-white/70 p-2.5 font-mono text-[11px] space-y-1.5 shadow-xs">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-rose-100 text-rose-800 shrink-0">Status Quo</span>
                    <span className="text-rose-700 truncate">15-Min Native Form Polling &bull; 391% Intent Drop-Off</span>
                  </div>
                  <AlertTriangle className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                </div>
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#f0eae1]">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-[#047857]/[0.12] text-[#047857] shrink-0">eqinhouse</span>
                    <span className="text-[#047857] font-semibold truncate">118ms Event-Driven HTTP POST &bull; 0% Lead Decay</span>
                  </div>
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#059669] shrink-0" />
                </div>
              </div>

              {/* Scenario Canvas */}
              <div className="min-h-[220px] flex-1 flex flex-col justify-between p-5 rounded-xl bg-white border border-[var(--border-subtle)] overflow-hidden font-sans">
                <div className="relative z-10 flex items-center justify-between text-xs mb-4">
                  <span className="text-[var(--text-secondary)] flex items-center gap-1.5 font-medium">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Pipeline Latency:</span>
                    <span className="text-[#6366F1] font-bold font-mono">{makeLatency}ms</span>
                  </span>
                  <span className="text-[var(--text-secondary)] text-xs hidden sm:inline">Simulate event to test route</span>
                </div>

                <div className="relative z-10 grid grid-cols-3 gap-3.5 items-center my-auto">
                  {/* Node 1 */}
                  <div className={`p-3 rounded-lg border text-center transition-all ${
                    isMakePulsing 
                      ? 'border-[#6366F1] bg-indigo-50/50 shadow-xs ring-1 ring-[#6366F1]' 
                      : 'border-[var(--border-subtle)] bg-[#FAF8F5]'
                  }`}>
                    <div className="h-7 w-7 mx-auto rounded-full bg-indigo-50 text-[#6366F1] flex items-center justify-center mb-1 border border-indigo-100">
                      <Zap className="h-3.5 w-3.5" />
                    </div>
                    <div className="text-xs font-semibold text-[var(--text-primary)]">Custom Webhook</div>
                    <div className="text-[11px] font-mono text-[var(--text-secondary)] mt-0.5">POST /inbound</div>
                  </div>

                  {/* Connector Line 1 */}
                  <div className="absolute left-[29%] top-[55%] -translate-y-1/2 w-[12%] h-1 pointer-events-none">
                    <div className={`h-[2px] w-full transition-all ${isMakePulsing ? 'bg-[#6366F1]' : 'bg-[#e6ded5]'}`} />
                  </div>

                  {/* Node 2 */}
                  <div className={`p-3 rounded-lg border text-center transition-all ${
                    isMakePulsing 
                      ? 'border-[#6366F1] bg-indigo-50/50 shadow-xs ring-1 ring-[#6366F1]' 
                      : 'border-[var(--border-subtle)] bg-[#FAF8F5]'
                  }`}>
                    <div className="h-7 w-7 mx-auto rounded-full bg-indigo-50 text-[#6366F1] flex items-center justify-center mb-1 border border-indigo-100">
                      <Network className="h-3.5 w-3.5" />
                    </div>
                    <div className="text-xs font-semibold text-[var(--text-primary)]">SLA Router</div>
                    <div className="text-[11px] font-mono text-[#6366F1] mt-0.5">ACV &gt; $25k</div>
                  </div>

                  {/* Connector Line 2 */}
                  <div className="absolute left-[62%] top-[55%] -translate-y-1/2 w-[12%] h-1 pointer-events-none">
                    <div className={`h-[2px] w-full transition-all ${isMakePulsing ? 'bg-[#6366F1]' : 'bg-[#e6ded5]'}`} />
                  </div>

                  {/* Node 3 */}
                  <div className={`p-3 rounded-lg border text-center transition-all ${
                    isMakePulsing 
                      ? 'border-emerald-500 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-500' 
                      : 'border-[var(--border-subtle)] bg-[#FAF8F5]'
                  }`}>
                    <div className="h-7 w-7 mx-auto rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mb-1 border border-emerald-200">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                    <div className="text-xs font-semibold text-[var(--text-primary)]">CRM + Slack</div>
                    <div className="text-[11px] text-emerald-800 font-medium mt-0.5">&lt; 45s SLA</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Metadata & ROI Footer */}
            <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] space-y-3">
              <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-sans">
                <span>Failover Policy: Dead-letter SQS queue</span>
                <span className="text-[var(--text-primary)] font-semibold">100% Delivery Reliability</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0F172A] border border-white/10 flex items-center justify-between font-mono text-xs shadow-xs">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-[#818CF8]" />
                  <span>Annualized Pipeline Protected:</span>
                </span>
                <span className="text-[#818CF8] font-bold tracking-tight">~$420,000</span>
              </div>
            </div>
          </TiltCard>

          {/* =====================================================================
              CARD B: Clay Multi-Source Waterfall Cascades
             ===================================================================== */}
          <TiltCard className="p-6 sm:p-8 flex flex-col justify-between border-[var(--border-subtle)] bg-[#FAF8F5] rounded-2xl h-full">
            <div className="flex flex-col flex-1">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--border-subtle)] mb-5">
                <div className="flex items-start space-x-3 min-w-0">
                  <div className="h-9 w-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#6366F1] shrink-0 mt-0.5">
                    <Database className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-serif text-2xl text-[var(--text-primary)] font-normal leading-tight">
                      Clay Waterfall Cascades
                    </h2>
                    <span className="text-xs text-[var(--text-secondary)] font-medium font-sans block mt-1">
                      Multi-Vendor Data Fallbacks &bull; &lt;10s Turnaround
                    </span>
                  </div>
                </div>
                <button
                  onClick={runWaterfallSimulation}
                  disabled={waterfallActive}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium border border-[var(--border-subtle)] bg-white hover:bg-[#faf7f3] text-[#0F172A] transition-all flex items-center gap-1.5 shadow-xs active:scale-95 disabled:opacity-50 font-mono shrink-0"
                >
                  <RefreshCw className={`h-3 w-3 text-[#6366F1] ${waterfallActive ? 'animate-spin' : ''}`} />
                  <span>{waterfallActive ? '[Cascading...]' : '[Run Waterfall]'}</span>
                </button>
              </div>

              <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4 min-h-[36px] font-sans">
                Never depend on a single enrichment provider. If Apollo lacks verified direct numbers, the cascade falls over to Prospeo, Datagma, and Clearbit with LLM normalization.
              </p>

              {/* Pain Contrast Tag */}
              <div className="mb-4 rounded-xl border border-[var(--border-subtle)] bg-white/70 p-2.5 font-mono text-[11px] space-y-1.5 shadow-xs">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-rose-100 text-rose-800 shrink-0">Status Quo</span>
                    <span className="text-rose-700 truncate">Single-Vendor Lookup: 46% Match Rate &bull; Wasted Rep Hours</span>
                  </div>
                  <AlertTriangle className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                </div>
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#f0eae1]">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-[#047857]/[0.12] text-[#047857] shrink-0">eqinhouse</span>
                    <span className="text-[#047857] font-semibold truncate">Sequential Multi-Source Cascade: 94.8% Match Rate</span>
                  </div>
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#059669] shrink-0" />
                </div>
              </div>

              <div className="min-h-[220px] flex-1 flex flex-col justify-center p-4 rounded-xl bg-white border border-[var(--border-subtle)] space-y-2.5 font-sans overflow-hidden">
                {/* Step 1 */}
                <div className={`p-2.5 rounded-lg border flex items-center justify-between transition-all ${
                  waterfallStep >= 1 ? 'border-[#6366F1] bg-indigo-50/30 shadow-xs' : 'border-[#e6ded5] bg-[#FAF8F5] text-[var(--text-secondary)]'
                }`}>
                  <div className="flex items-center space-x-2.5">
                    <span className="text-xs font-medium text-[var(--text-primary)]">1. Apollo API</span>
                  </div>
                  <span className="text-xs font-medium text-[var(--text-secondary)] flex items-center gap-1">
                    {waterfallStep >= 1 ? (
                      <span className="text-amber-800 font-medium">Direct Dial Missing &rarr; Fallback</span>
                    ) : 'Pending Inbound'}
                  </span>
                </div>

                {/* Step 2 */}
                <div className={`p-2.5 rounded-lg border flex items-center justify-between transition-all ${
                  waterfallStep >= 2 ? 'border-[#047857]/40 bg-[#047857]/[0.08] shadow-xs' : 'border-[#e6ded5] bg-[#FAF8F5] text-[var(--text-secondary)]'
                }`}>
                  <div className="flex items-center space-x-2.5">
                    <span className="text-xs font-medium text-[var(--text-primary)]">2. Prospeo / Datagma</span>
                  </div>
                  <span className="text-xs font-medium text-[#047857] flex items-center gap-1 font-mono">
                    {waterfallStep >= 2 ? (
                      <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5 text-[#059669]" /> Mobile + Email Found</span>
                    ) : 'Standing By'}
                  </span>
                </div>

                {/* Step 3 */}
                <div className={`p-2.5 rounded-lg border flex items-center justify-between transition-all ${
                  waterfallStep >= 3 ? 'border-[#047857]/40 bg-[#047857]/[0.08] shadow-xs' : 'border-[#e6ded5] bg-[#FAF8F5] text-[var(--text-secondary)]'
                }`}>
                  <div className="flex items-center space-x-2.5">
                    <span className="text-xs font-medium text-[var(--text-primary)]">3. Clearbit Firmographics</span>
                  </div>
                  <span className="text-xs font-medium text-[#047857] flex items-center gap-1 font-mono">
                    {waterfallStep >= 3 ? (
                      <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5 text-[#059669]" /> 350 Employees &bull; Series B</span>
                    ) : 'Standing By'}
                  </span>
                </div>

                {/* Step 4 */}
                <div className={`p-2.5 rounded-lg border flex items-center justify-between transition-all ${
                  waterfallStep >= 4 ? 'border-[#6366F1] bg-indigo-50/40 shadow-xs' : 'border-[#e6ded5] bg-[#FAF8F5] text-[var(--text-secondary)]'
                }`}>
                  <div className="flex items-center space-x-2.5">
                    <span className="text-xs font-medium text-[var(--text-primary)]">4. Normalization Gate</span>
                  </div>
                  <span className="text-xs font-medium text-[#6366F1] flex items-center gap-1">
                    {waterfallStep >= 4 ? (
                      <span className="flex items-center gap-1"><Sparkles className="h-3.5 w-3.5" /> Governed Picklist Cleanse</span>
                    ) : 'Standing By'}
                  </span>
                </div>

                {/* Step 5 Stamp */}
                {waterfallStep >= 5 && (
                  <div className="p-2 rounded-lg bg-[#047857]/[0.08] border border-[#047857]/25 text-center text-xs font-semibold text-[#065F46] flex items-center justify-center gap-1.5 font-mono">
                    <CheckCircle2 className="h-4 w-4 text-[#059669]" />
                    <span>Verified Contact Information Ready (&lt;10s)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Metadata & ROI Footer */}
            <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] space-y-3">
              <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-sans">
                <span>Overall Match Rate: 94.8%</span>
                <span className="text-[var(--text-primary)] font-semibold">Zero SDR Research Overhead</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0F172A] border border-white/10 flex items-center justify-between font-mono text-xs shadow-xs">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-[#818CF8]" />
                  <span>Rep Research Time Saved:</span>
                </span>
                <span className="text-[#818CF8] font-bold tracking-tight">15+ Hours/Week/Rep</span>
              </div>
            </div>
          </TiltCard>

          {/* =====================================================================
              CARD C: HubSpot & Salesforce Schema Hygiene
             ===================================================================== */}
          <TiltCard className="p-6 sm:p-8 flex flex-col justify-between border-[var(--border-subtle)] bg-[#FAF8F5] rounded-2xl h-full">
            <div className="flex flex-col flex-1">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--border-subtle)] mb-5">
                <div className="flex items-start space-x-3 min-w-0">
                  <div className="h-9 w-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#6366F1] shrink-0 mt-0.5">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-serif text-2xl text-[var(--text-primary)] font-normal leading-tight">
                      CRM Schema Governance
                    </h2>
                    <span className="text-xs text-[var(--text-secondary)] font-medium font-sans block mt-1">
                      Locked Picklists &bull; Standardized Titles
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsSanitized(!isSanitized)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 shadow-xs active:scale-95 font-mono shrink-0 ${
                    isSanitized
                      ? 'bg-indigo-50/80 text-[#6366F1] border-indigo-200 hover:bg-indigo-100/70'
                      : 'bg-white text-[#0F172A] border-[var(--border-subtle)] hover:bg-[#faf7f3]'
                  }`}
                >
                  <Sparkles className="h-3 w-3 text-[#6366F1]" />
                  <span>{isSanitized ? '[Show Dirty State]' : '[Normalize Data]'}</span>
                </button>
              </div>

              <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4 min-h-[36px] font-sans">
                Messy freeform text fields degrade CRM segmentation, lead routing, and reporting. We lock your fields into clean, strictly governed picklists.
              </p>

              {/* Pain Contrast Tag */}
              <div className="mb-4 rounded-xl border border-[var(--border-subtle)] bg-white/70 p-2.5 font-mono text-[11px] space-y-1.5 shadow-xs">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-rose-100 text-rose-800 shrink-0">Status Quo</span>
                    <span className="text-rose-700 truncate">Free-Text Input &rarr; 28% Routing Failures &amp; Dirty Overwrites</span>
                  </div>
                  <AlertTriangle className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                </div>
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#f0eae1]">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-[#047857]/[0.12] text-[#047857] shrink-0">eqinhouse</span>
                    <span className="text-[#047857] font-semibold truncate">Strict Ingestion Gates &rarr; Zero Unassigned Leads</span>
                  </div>
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#059669] shrink-0" />
                </div>
              </div>

              {/* Schema Table */}
              <div className="min-h-[220px] flex-1 flex flex-col justify-center rounded-xl border border-[var(--border-subtle)] bg-white overflow-hidden shadow-subtle font-sans">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-[#faf7f3] border-b border-[var(--border-subtle)] text-[var(--text-secondary)] font-medium">
                        <th className="py-2.5 px-3">Lead Raw Input</th>
                        <th className="py-2.5 px-3">
                          {isSanitized ? (
                            <span className="text-[var(--text-primary)] font-semibold">Governed Picklist Value</span>
                          ) : (
                            <span className="text-rose-800">Raw Unvalidated Value</span>
                          )}
                        </th>
                        <th className="py-2.5 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f2ece3]">
                      <tr>
                        <td className="py-2.5 px-3 text-[var(--text-primary)] font-mono text-[11px]">&quot;Head of Sales &amp; Growth ops&quot;</td>
                        <td className="py-2.5 px-3">
                          {isSanitized ? (
                            <span className="text-[var(--text-primary)] font-medium bg-indigo-50 text-[#6366F1] px-2 py-0.5 rounded border border-indigo-100">
                              VP - Sales
                            </span>
                          ) : (
                            <span className="text-rose-800">Head of Sales &amp; Growth ops</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          {isSanitized ? <span className="text-emerald-800 font-medium">Valid</span> : <span className="text-rose-700">Dirty</span>}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 text-[var(--text-primary)] font-mono text-[11px]">&quot;vp mktg &amp; dev&quot;</td>
                        <td className="py-2.5 px-3">
                          {isSanitized ? (
                            <span className="text-[var(--text-primary)] font-medium bg-indigo-50 text-[#6366F1] px-2 py-0.5 rounded border border-indigo-100">
                              VP - Marketing
                            </span>
                          ) : (
                            <span className="text-rose-800">vp mktg &amp; dev</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          {isSanitized ? <span className="text-emerald-800 font-medium">Valid</span> : <span className="text-rose-700">Dirty</span>}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 text-[var(--text-primary)] font-mono text-[11px]">&quot;founding engineer / bizops&quot;</td>
                        <td className="py-2.5 px-3">
                          {isSanitized ? (
                            <span className="text-[var(--text-primary)] font-medium bg-indigo-50 text-[#6366F1] px-2 py-0.5 rounded border border-indigo-100">
                              Director - BizOps
                            </span>
                          ) : (
                            <span className="text-rose-800">founding engineer / bizops</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          {isSanitized ? <span className="text-emerald-800 font-medium">Valid</span> : <span className="text-rose-700">Dirty</span>}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Bottom Metadata & ROI Footer */}
            <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] space-y-3">
              <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-sans">
                <span>Schema State: {isSanitized ? 'Strictly Governed' : 'Unstructured Free-Text'}</span>
                <span className="text-[var(--text-primary)] font-semibold">Zero Duplicate Records</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0F172A] border border-white/10 flex items-center justify-between font-mono text-xs shadow-xs">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-[#818CF8]" />
                  <span>Database Decay Prevented:</span>
                </span>
                <span className="text-[#818CF8] font-bold tracking-tight">100% Schema Governance</span>
              </div>
            </div>
          </TiltCard>

          {/* =====================================================================
              CARD D: Slack & Microsoft Teams Deal Desk
             ===================================================================== */}
          <TiltCard className="p-6 sm:p-8 flex flex-col justify-between border-[var(--border-subtle)] bg-[#FAF8F5] rounded-2xl h-full">
            <div className="flex flex-col flex-1">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--border-subtle)] mb-5">
                <div className="flex items-start space-x-3 min-w-0">
                  <div className="h-9 w-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#6366F1] shrink-0 mt-0.5">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-serif text-2xl text-[var(--text-primary)] font-normal leading-tight">
                      Real-Time Deal Desk Alerting
                    </h2>
                    <span className="text-xs text-[var(--text-secondary)] font-medium font-sans block mt-1">
                      Slack Block-Kit &bull; 1-Click Rep Assignment
                    </span>
                  </div>
                </div>

                {/* Interactive Action Button: [Simulate Alert] / [Dispatching...] / [Re-run Alert] */}
                <button
                  onClick={handleSimulateAlert}
                  disabled={isAlertSimulating}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium border border-[var(--border-subtle)] bg-white hover:bg-[#faf7f3] text-[#0F172A] transition-all flex items-center gap-1.5 shadow-xs active:scale-95 disabled:opacity-50 font-mono shrink-0"
                >
                  {alertButtonState === 'dispatching' ? (
                    <>
                      <Bell className="h-3 w-3 animate-bounce text-[#6366F1]" />
                      <span>[Dispatching...]</span>
                    </>
                  ) : alertButtonState === 'ready_to_rerun' ? (
                    <>
                      <RefreshCw className="h-3 w-3 text-[#6366F1]" />
                      <span>[Re-run Alert]</span>
                    </>
                  ) : (
                    <>
                      <Bell className="h-3 w-3 text-[#6366F1]" />
                      <span>[Simulate Alert]</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4 min-h-[36px] font-sans">
                Interactive Slack messages push enriched accounts directly to the AE channel with high-fidelity firmographics and a 1-click &apos;Claim Account&apos; button to lock in SLAs.
              </p>

              {/* Pain Contrast Tag */}
              <div className="mb-4 rounded-xl border border-[var(--border-subtle)] bg-white/70 p-2.5 font-mono text-[11px] space-y-1.5 shadow-xs">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-rose-100 text-rose-800 shrink-0">Status Quo</span>
                    <span className="text-rose-700 truncate">Manual AE Tagging &bull; 4.2h Delay &amp; Lead Churn</span>
                  </div>
                  <AlertTriangle className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                </div>
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#f0eae1]">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-[#047857]/[0.12] text-[#047857] shrink-0">eqinhouse</span>
                    <span className="text-[#047857] font-semibold truncate">Instant Block-Kit Inbound &bull; 28s Routing SLA</span>
                  </div>
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#059669] shrink-0" />
                </div>
              </div>

              {/* Slack Window Container */}
              <div className="min-h-[220px] flex-1 flex flex-col justify-center p-4 sm:p-5 rounded-xl bg-white border border-[var(--border-subtle)] text-xs font-sans overflow-hidden">
                <AnimatePresence mode="wait">
                  {!alertReceived && !isDealClaimed && !isAlertSimulating ? (
                    /* Default / Pre-staged Skeleton State */
                    <motion.div
                      key="idle-state"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-2.5"
                    >
                      {/* Window Header */}
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E6DFD5] text-[11px] font-mono">
                        <div className="flex items-center space-x-2 text-[var(--text-secondary)]">
                          <span className="font-semibold text-[var(--text-primary)]">SLACK_INTEGRATION</span>
                          <span className="text-[#3F3D56]/40">//</span>
                          <span>Channel: <span className="text-[#6366F1] font-medium font-mono">#deal-desk-live</span></span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#047857]/[0.08] border border-[#047857]/20 text-[10px] font-semibold text-[#047857]">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#059669] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#059669]"></span>
                          </span>
                          <span>LISTENING</span>
                        </div>
                      </div>

                      {/* Sender row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="h-6 w-6 rounded bg-[#6366F1]/70 flex items-center justify-center text-white font-bold text-xs">
                            eq
                          </div>
                          <span className="font-bold text-[var(--text-primary)] text-sm">eqinhouse Bot</span>
                          <span className="px-1.5 py-0.5 rounded bg-[#e6ded5] text-[10px] text-[var(--text-primary)] font-semibold">APP</span>
                          <span className="text-[11px] text-[var(--text-secondary)] font-sans hidden sm:inline">
                            &bull; Awaiting incoming webhook payload
                          </span>
                        </div>
                        <span className="text-[10px] text-[var(--text-secondary)]/70 font-mono">STANDBY</span>
                      </div>

                      {/* Message Card Preview / Pre-staged skeleton */}
                      <div className="border-l-2 border-indigo-300 pl-3 py-2 space-y-2 bg-[#FAF8F5] rounded-r-lg p-3 border border-[var(--border-subtle)]">
                        <div className="text-[var(--text-secondary)] font-semibold text-xs flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#6366F1]/60 animate-pulse"></span>
                            <span>Target Account: <span className="font-mono text-[var(--text-primary)] font-medium">[Incoming Payload...]</span></span>
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[var(--text-secondary)] text-xs font-sans">
                          <div>
                            <span className="text-[var(--text-secondary)]/80 font-medium">ESTIMATED ACV:</span> <span className="font-mono text-[var(--text-primary)] font-medium">$--k</span>
                          </div>
                          <div>
                            <span className="text-[var(--text-secondary)]/80 font-medium">HEADCOUNT:</span> <span className="font-mono text-[var(--text-primary)] font-medium">---</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-[var(--text-secondary)]/80 font-medium">ROUTING SLA:</span> <span className="text-[#047857] font-medium font-mono">Sub-60s Guarantee</span>
                          </div>
                        </div>

                        <div className="pt-1 flex items-center">
                          <button
                            disabled
                            className="px-3 py-1 rounded-lg font-mono text-xs border border-dashed border-[#6366F1]/40 bg-indigo-50/40 text-[#6366F1]/80 cursor-not-allowed flex items-center gap-1.5"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-[#6366F1]/40 animate-pulse"></span>
                            <span>[Ready to Route]</span>
                          </button>
                        </div>
                      </div>

                      {/* Subtle Callout Badge */}
                      <div className="pt-0.5 flex items-center justify-center">
                        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50/70 border border-indigo-100 text-[11px] font-mono text-[#6366F1]">
                          <span>⚡ Click <strong className="font-semibold text-[#0F172A]">[Simulate Alert]</strong> above to trigger live payload dispatch</span>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    /* Animated Active Slack Notification */
                    <motion.div
                      key="active-state"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="space-y-2.5"
                    >
                      {/* Toast / Payload Received Banner */}
                      <AnimatePresence>
                        {showToast && (
                          <motion.div
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="p-2 rounded-lg bg-indigo-50 border border-indigo-200 text-[#6366F1] font-mono text-[11px] font-semibold flex items-center justify-between"
                          >
                            <span className="flex items-center gap-1.5">
                              <Zap className="h-3.5 w-3.5 text-[#6366F1] fill-current" />
                              <span>PAYLOAD_RECEIVED: ACME CORP (ARR $85k)</span>
                            </span>
                            <span className="text-[10px] uppercase font-bold text-[#047857]">Routing</span>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Window Header */}
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E6DFD5] text-[11px] font-mono">
                        <div className="flex items-center space-x-2 text-[var(--text-secondary)]">
                          <span className="font-semibold text-[var(--text-primary)]">SLACK_INTEGRATION</span>
                          <span className="text-[#3F3D56]/40">//</span>
                          <span>Channel: <span className="text-[#6366F1] font-medium font-mono">#deal-desk-live</span></span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#047857]/[0.08] border border-[#047857]/20 text-[10px] font-semibold text-[#047857]">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#059669] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#059669]"></span>
                          </span>
                          <span>ACTIVE DEAL</span>
                        </div>
                      </div>

                      {/* Header with channel metadata tag */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="h-6 w-6 rounded bg-[#6366F1] flex items-center justify-center text-white font-bold text-xs">
                            eq
                          </div>
                          <span className="font-bold text-[var(--text-primary)] text-sm">eqinhouse Bot</span>
                          <span className="px-1.5 py-0.5 rounded bg-[#e6ded5] text-[10px] text-[var(--text-primary)] font-semibold">APP</span>
                          <span className="px-1.5 py-0.5 rounded bg-[#0F172A] border border-[#1E293B] text-[10px] text-slate-100 font-mono font-medium">
                            #deal-desk-live
                          </span>
                        </div>
                        <span className="text-[11px] text-[var(--text-secondary)] font-mono">
                          {isAlertSimulating ? 'Just now' : 'Today at 2:41 PM'}
                        </span>
                      </div>

                      <div className="border-l-2 border-[#6366F1] pl-3 py-1 space-y-2 bg-[#FAF8F5] rounded-r-lg p-3 border border-[var(--border-subtle)]">
                        <div className="text-[var(--text-primary)] font-bold text-sm">
                          High-Intent Tier-1 Inbound Lead Received
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[var(--text-secondary)] text-xs">
                          <div>
                            <span className="text-[var(--text-secondary)] font-medium">ACCOUNT:</span> Acme Corp
                          </div>
                          <div>
                            <span className="text-[var(--text-secondary)] font-medium">ESTIMATED ACV:</span> <span className="text-[var(--text-primary)] font-bold">$85,000</span>
                          </div>
                          <div>
                            <span className="text-[var(--text-secondary)] font-medium">EMPLOYEES:</span> 350 (Series B)
                          </div>
                          <div>
                            <span className="text-[var(--text-secondary)] font-medium">INGESTION SLA:</span> <span className="text-[#047857] font-semibold font-mono">28s</span>
                          </div>
                        </div>

                        <div className="pt-1.5 flex flex-wrap items-center gap-2">
                          {isDealClaimed ? (
                            <motion.div
                              initial={{ scale: 0.95, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="p-2 rounded bg-[#047857]/[0.08] border border-[#047857]/25 text-[#065F46] text-xs font-semibold flex items-center gap-2 font-mono"
                            >
                              <UserCheck className="h-4 w-4 text-[#059669]" />
                              <span>Claimed by @Sarah (AE) at {claimedTimestamp ?? 'Just now'} &bull; Calendar Confirmed</span>
                            </motion.div>
                          ) : (
                            <>
                              <button
                                onClick={handleClaimDeal}
                                className={`px-3.5 py-1.5 rounded-lg font-medium text-xs shadow-xs transition-all ${
                                  isButtonFlashing 
                                    ? 'bg-[#6366F1] ring-2 ring-[#6366F1]/50 scale-105 text-white' 
                                    : 'bg-[#6366F1] hover:bg-[#4f46e5] text-white'
                                }`}
                              >
                                Claim Account (&lt;60s SLA)
                              </button>
                              <button
                                onClick={() => alert("ChiliPiper calendar link dispatched to buyer!")}
                                className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#faf7f3] text-[var(--text-primary)] text-xs border border-[var(--border-subtle)] font-medium"
                              >
                                View ChiliPiper Link
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Bottom Metadata & ROI Footer */}
            <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] space-y-3">
              <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-sans">
                <span className="font-mono text-[#0F172A] font-medium">{routingLatencyText}</span>
                <span className="text-[var(--text-primary)] font-semibold">Direct Calendar Integration</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0F172A] border border-white/10 flex items-center justify-between font-mono text-xs shadow-xs">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-[#818CF8]" />
                  <span>Speed-to-Lead SLA:</span>
                </span>
                <span className="text-[#818CF8] font-bold tracking-tight">Sub-60-Second Inbound Response</span>
              </div>
            </div>
          </TiltCard>

        </div>

        {/* Bottom CTA Bar */}
        <div className="mt-16 text-center">
          <div className="p-8 rounded-2xl border border-[var(--border-subtle)] bg-[#FAF8F5] max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 shadow-subtle">
            <div className="text-left">
              <h4 className="font-serif text-2xl text-[var(--text-primary)] font-normal">Need this revenue architecture deployed?</h4>
              <p className="text-sm text-[var(--text-secondary)] mt-1 font-sans">
                Our 30-day Core Engine sprint configures and tests this entire pipeline in your CRM.
              </p>
            </div>
            <a
              href="/intake?tier=core-engine"
              className="px-6 py-3 rounded-lg text-sm font-medium text-white bg-[#6366F1] hover:bg-[#4f46e5] shadow-xs transition-all whitespace-nowrap font-sans"
            >
              Deploy Core Engine ($12,500)
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
