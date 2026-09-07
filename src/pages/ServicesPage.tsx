import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Check, 
  X, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  Shield, 
  ShieldAlert
} from 'lucide-react';
import { TiltCard } from '../components/TiltCard';

export const ServicesPage: React.FC = () => {
  const [comparisonMode, setComparisonMode] = useState<'manual' | 'deterministic'>('deterministic');

  const comparisonRows = [
    {
      metric: 'Inbound Ingestion Latency',
      manual: '42.4 Minutes (Polling + SDR queue)',
      deterministic: '< 60 Seconds (Serverless webhook)',
      detail: 'Measured from website form submission to first sales rep notification.',
    },
    {
      metric: 'Enrichment Data Coverage',
      manual: '48% (Single database lookup, incomplete data)',
      deterministic: '94.8% (3-to-5 tier waterfall cascade)',
      detail: 'Multi-vendor fallback (Apollo -> Prospeo -> Datagma) guarantees verified direct dial & email.',
    },
    {
      metric: 'CRM Schema Governance',
      manual: 'Unstructured text fields, duplicate accounts, messy data',
      deterministic: 'Locked picklists, automated domain deduplication',
      detail: 'Standardized lifecycle stage transitions enforced by custom validation rules.',
    },
    {
      metric: 'Sales Rep Alerting Channel',
      manual: 'Generic email notification or CRM task backlog',
      deterministic: 'Interactive Slack deal desk with 1-click claim',
      detail: 'Instant channel notification with calendar link, enriched company dossier, and claim button.',
    },
    {
      metric: 'Human Triage Overhead',
      manual: '15–20 hours/week spent on manual copy-pasting',
      deterministic: '0 hours (Fully automated deterministic execution)',
      detail: 'SDRs focus entirely on qualified buyer engagement rather than cross-referencing LinkedIn.',
    },
    {
      metric: 'Annual Revenue Salvaged',
      manual: '$0 (Continuous 30%+ pipeline leakage)',
      deterministic: '+$420,000 / year (Protected conversion)',
      detail: 'Modeled on a standard B2B SaaS $25k ACV with 40 high-intent demo requests per month.',
    },
  ];

  // Interactive Pricing Card State: active selection + hover focus
  const [selectedTier, setSelectedTier] = useState<'tier-1' | 'tier-2' | 'tier-3'>('tier-2');
  const [hoveredTier, setHoveredTier] = useState<'tier-1' | 'tier-2' | 'tier-3' | null>(null);

  // The effectively focused tier is the hovered card, or falling back to the selected card
  const effectiveTier = hoveredTier ?? selectedTier;

  const tiers = [
    {
      id: 'tier-1' as const,
      label: 'Tier 1 • 7 Business Days',
      title: 'GTM Architecture Diagnostic',
      desc: 'Forensic technical audit of your inbound funnel, CRM schema hygiene, and speed-to-lead routing latency.',
      price: '$3,500',
      period: 'Fixed Fee',
      timeline: 'Delivered in 7 business days',
      icon: Clock,
      deliverables: [
        'Complete CRM schema & field bloat teardown (HubSpot or Salesforce).',
        'Speed-to-lead webhook & routing latency trace with millisecond logs.',
        'Secret-shopper inbound test (Website form to SDR outreach).',
        'Prioritized 90-day technical remediation backlog with risk scoring.',
      ],
      antiScope: 'NO production code deployment • NO ad-hoc tool setup • NO cold outreach copywriting.',
      slaGuarantee: 'Strict 7-Day Turnaround • Fully Deductible Against Core Sprint',
      ctaText: 'Book Diagnostic Slot',
      ctaHref: '/intake?tier=diagnostic',
    },
    {
      id: 'tier-2' as const,
      label: 'Tier 2 • 30 Calendar Days',
      title: 'Core GTM Engine Sprint',
      desc: 'Turnkey engineering deployment. We build and hardwire your Clay waterfall, routing engine, and CRM schema lock.',
      price: '$12,500',
      period: 'Fixed Fee',
      timeline: 'Production deployment in 30 days',
      icon: Layers,
      deliverables: [
        'Clay waterfall enrichment cascade (3–5 vendors: Apollo, Prospeo, Datagma).',
        'Sub-60s SLA webhook & round-robin routing engine (Make / serverless).',
        'Custom lifecycle stage & pipeline stage validation guards.',
        'Bidirectional CRM <-> SEP sync + interactive Slack deal-desk alerting.',
      ],
      antiScope: 'NO front-end CMS web builds • NO manual SDR list generation • NO custom internal software coding.',
      slaGuarantee: '30-Day Fixed-Scope Delivery • Zero Billable Hour Overages',
      ctaText: 'Deploy Core Engine',
      ctaHref: '/intake?tier=core-engine',
    },
    {
      id: 'tier-3' as const,
      label: 'Tier 3 • Ongoing Retainer',
      title: 'Fractional Systems Architecture',
      desc: 'Continuous architecture for scaleups shipping new product lines, territories, and multi-channel motions.',
      price: '$6,500',
      period: '/ Month',
      timeline: 'Quarterly commitment • Async SLA',
      icon: Shield,
      deliverables: [
        '1 major architectural sprint per month (e.g., expansion routing, scoring model).',
        'Weekly async triage & schema change management via GitHub/Linear.',
        'Custom webhook & API endpoint maintenance with 99.9% uptime.',
        'Bi-weekly 45-min strategic sync with CRO or VP Revenue Operations.',
      ],
      antiScope: 'NO operational triage backlog • NO real-time emergency ticketing • Max 1 strategic architecture update per sprint.',
      slaGuarantee: 'Quarterly Commitment • 1 Architecture Sprint Per Month',
      ctaText: 'Retain Architecture Team',
      ctaHref: '/intake?tier=fractional',
    },
  ];

  return (
    <div className="relative z-10 space-y-20 py-8 sm:py-14">
      
      {/* =========================================================================
          SECTION 1: HEADER
         ========================================================================= */}
      <section className="text-center max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#f3ede4] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-secondary)] mb-6 font-sans"
        >
          <Shield className="h-3.5 w-3.5 text-[#6366F1]" />
          <span>Fixed-Fee Sprints &bull; Strict Deliverables &bull; Zero Scope Creep</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-serif text-[var(--text-primary)] tracking-tight leading-tight font-normal"
        >
          Productized Systems Sprints.{' '}
          <span className="italic text-[#6366F1]">Zero Billable Hour Traps.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl mx-auto font-sans"
        >
          No open-ended consulting or junior retainer bloat. Three structured engineering deliverables designed to eliminate pipeline leakage.
        </motion.p>
      </section>

      {/* =========================================================================
          SECTION 2: INTERACTIVE MODE TOGGLE & COMPARISON TABLE
         ========================================================================= */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-white border border-[var(--border-subtle)] rounded-2xl p-6 sm:p-8 shadow-subtle">
          
          {/* Header & Toggle Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
            <div>
              <h3 className="font-serif text-2xl text-[var(--text-primary)] font-normal">
                Operating Model Comparison
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5 font-sans">
                Toggle models to compare operational latency, enrichment rates, and data governance:
              </p>
            </div>

            {/* Segmented Toggle Switch */}
            <div className="inline-flex p-1 rounded-lg bg-[#f5ede4] border border-[#e6ded5] font-sans">
              <button
                onClick={() => setComparisonMode('manual')}
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                  comparisonMode === 'manual'
                    ? 'bg-rose-100 text-rose-900 shadow-xs border border-rose-200'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Manual SDR Triage (42m lag)
              </button>
              <button
                onClick={() => setComparisonMode('deterministic')}
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                  comparisonMode === 'deterministic'
                    ? 'bg-[#6366F1] text-white shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Automated Inbound (&lt;60s)
              </button>
            </div>
          </div>

          {/* Clean Table Container */}
          <div className="mt-4 overflow-x-auto font-sans">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                  <th className="py-3.5 px-4">Capability Vector</th>
                  <th className={`py-3.5 px-4 transition-colors ${comparisonMode === 'manual' ? 'text-rose-800 bg-rose-50/50 font-bold' : ''}`}>
                    Manual SDR Triage
                  </th>
                  <th className={`py-3.5 px-4 transition-colors ${comparisonMode === 'deterministic' ? 'text-[#6366F1] bg-indigo-50/30 font-bold' : ''}`}>
                    eqinhouse Deterministic Pipeline
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2ece3] text-sm">
                {comparisonRows.map((row, idx) => (
                  <tr 
                    key={idx} 
                    className="hover:bg-[#faf7f3]/60 transition-colors"
                  >
                    <td className="py-4 px-4 font-medium text-[var(--text-primary)]">
                      <div>{row.metric}</div>
                      <div className="text-xs text-[var(--text-secondary)] mt-0.5 font-normal">{row.detail}</div>
                    </td>
                    <td className={`py-4 px-4 transition-colors ${
                      comparisonMode === 'manual' 
                        ? 'bg-rose-50/40 font-medium text-rose-800 border-l border-r border-rose-100' 
                        : 'text-[var(--text-secondary)]'
                    }`}>
                      <div className="flex items-center space-x-2">
                        {comparisonMode === 'manual' && (
                          <X className="h-4 w-4 text-rose-600 shrink-0" />
                        )}
                        <span>{row.manual}</span>
                      </div>
                    </td>
                    <td className={`py-4 px-4 transition-colors ${
                      comparisonMode === 'deterministic' 
                        ? 'bg-indigo-50/20 font-semibold text-[var(--text-primary)] border-l border-r border-indigo-100' 
                        : 'text-[var(--text-secondary)]'
                    }`}>
                      <div className="flex items-center space-x-2">
                        {comparisonMode === 'deterministic' && (
                          <Check className="h-4 w-4 text-[#6366F1] shrink-0" />
                        )}
                        <span>{row.deterministic}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Banner */}
          <div className="mt-6 p-4 rounded-xl bg-[#FAF8F5] border border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans">
            <span className="text-[var(--text-secondary)]">
              {comparisonMode === 'manual'
                ? 'Manual SDR bottlenecks lead to a 391% decrease in qualification rates according to Harvard Business Review.'
                : 'Deterministic automated data plumbing secures sub-60s response times and recaptures up to $420k/yr in pipeline.'}
            </span>
            <Link
              to="/intake"
              className="text-[#6366F1] hover:underline font-semibold inline-flex items-center gap-1 shrink-0"
            >
              Protect Inbound Conversion →
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: 3 STRICT TIERED PRICING CARDS (INTERACTIVE SELECTION)
         ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-serif text-[var(--text-primary)] tracking-tight font-normal">
            Transparent Sprints. Bound By Contract.
          </h2>
          <p className="mt-2 text-base text-[var(--text-secondary)] max-w-xl mx-auto font-sans">
            Clear deliverables, established delivery timelines, and strict anti-scope definitions to guarantee results.
          </p>
        </div>

        {/* Card Grid with container onMouseLeave to reset to selectedTier */}
        <div 
          onMouseLeave={() => setHoveredTier(null)}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch"
        >
          {tiers.map((tier) => {
            const isFocused = effectiveTier === tier.id;
            const isSelected = selectedTier === tier.id;
            const Icon = tier.icon;

            return (
              <TiltCard
                key={tier.id}
                onClick={() => setSelectedTier(tier.id)}
                onMouseEnter={() => setHoveredTier(tier.id)}
                hoverEffect={false}
                style={{
                  transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: isFocused ? '0 10px 25px -5px rgba(99, 102, 241, 0.16)' : undefined,
                }}
                className={`p-7 flex flex-col justify-between relative cursor-pointer ${
                  isFocused
                    ? 'border-2 border-[#6366F1] bg-[#FAF8F5] -translate-y-1'
                    : 'border border-[#E5DDD0] bg-white hover:border-[#d6cbbf]'
                }`}
              >
                {/* Floating Pill Badge pinned to top-center of the focused card */}
                {isFocused && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#6366F1] text-white text-[11px] font-mono font-semibold uppercase tracking-wider flex items-center gap-1 shadow-xs pointer-events-none whitespace-nowrap z-20">
                    <Sparkles className="h-3 w-3" />
                    <span>
                      {tier.id === 'tier-2' && isSelected
                        ? '★ MOST SELECTED'
                        : isSelected
                        ? '★ ACTIVE SELECTION'
                        : tier.id === 'tier-2'
                        ? '★ MOST SELECTED'
                        : '★ ACTIVE SELECTION'}
                    </span>
                  </div>
                )}

                <div>
                  {/* Top Category Badge & Icon */}
                  <div className="flex items-center justify-between mb-4 mt-1">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-medium font-sans border transition-colors ${
                      isFocused 
                        ? 'bg-indigo-50 text-[#6366F1] border-indigo-200 font-semibold' 
                        : 'bg-[#f5ede4] text-[var(--text-primary)] border-[#e6ded5]'
                    }`}>
                      {tier.label}
                    </span>
                    <Icon className={`h-4 w-4 transition-colors ${isFocused ? 'text-[#6366F1]' : 'text-[var(--text-secondary)]'}`} />
                  </div>

                  <h3 className="text-2xl font-serif text-[var(--text-primary)] font-normal">
                    {tier.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed font-sans min-h-[36px]">
                    {tier.desc}
                  </p>

                  {/* Pricing Box */}
                  <div className="mt-6 mb-6 p-4 rounded-xl bg-white border border-[var(--border-subtle)] transition-colors">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-serif text-[var(--text-primary)] font-normal">{tier.price}</span>
                      <span className="text-xs text-[var(--text-secondary)] font-medium uppercase font-sans">{tier.period}</span>
                    </div>
                    <div className="text-xs text-[var(--text-primary)] mt-1 font-medium flex items-center gap-1 font-sans">
                      <Check className="h-3.5 w-3.5 text-[#059669]" />
                      <span>{tier.timeline}</span>
                    </div>
                  </div>

                  {/* Deliverables List */}
                  <div className="space-y-3 mb-6 font-sans">
                    <div className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider">
                      Included Deliverables:
                    </div>
                    <ul className="space-y-2.5 text-xs text-[var(--text-secondary)]">
                      {tier.deliverables.map((d, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-[#6366F1] shrink-0 mt-0.5" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Anti Scope Box */}
                  <div className="p-3.5 rounded-xl bg-rose-500/[0.04] border border-dashed border-[#FCA5A5] text-xs mb-6 font-sans shadow-2xs">
                    <div className="font-semibold text-rose-900 mb-1 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider">
                      <ShieldAlert className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                      <span>Strict Anti-Scope Protection:</span>
                    </div>
                    <p className="text-rose-950/80 leading-relaxed font-mono text-[11px]">
                      {tier.antiScope}
                    </p>
                  </div>
                </div>

                {/* Contractual SLA Guarantee Pill & Dynamic CTA Button */}
                <div className="space-y-3 pt-2">
                  <div className="w-full py-1.5 px-2.5 rounded-md bg-[#FAF8F5] border border-[#E5DDD0] text-[11px] font-mono font-medium text-[var(--text-secondary)] text-center flex items-center justify-center gap-1.5 shadow-2xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#059669] shrink-0" />
                    <span className="truncate">{tier.slaGuarantee}</span>
                  </div>

                  <Link
                    to={tier.ctaHref}
                    onClick={(e) => e.stopPropagation()}
                    className={`w-full inline-flex items-center justify-center py-3 px-4 rounded-lg text-sm font-medium font-sans transition-all shadow-xs ${
                      isFocused
                        ? 'text-white bg-[#6366F1] hover:bg-[#4f46e5] shadow-[0_4px_12px_rgba(99,102,241,0.25)]'
                        : 'text-[var(--text-primary)] bg-white hover:bg-[#f5ede4] border border-[#e6ded5]'
                    }`}
                  >
                    <span>{tier.ctaText}</span>
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </div>
              </TiltCard>
            );
          })}
        </div>
      </section>

    </div>
  );
};
