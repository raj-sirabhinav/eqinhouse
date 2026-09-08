import React, { useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  AlertTriangle, 
  Lock, 
  Mail,
  CheckCircle2
} from 'lucide-react';

export const IntakePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tierParam = searchParams.get('tier');

  // Multi-step progress (Step 1, 2, 3, or submitted = 4)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const webhookDispatchedRef = useRef<boolean>(false);

  // Form State
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [arrRange, setArrRange] = useState<string>('$3M–$10M');
  const [acvRange, setAcvRange] = useState<string>('$25k–$50k');
  const [crm, setCrm] = useState<string>('Salesforce');
  const [enrichmentTools, setEnrichmentTools] = useState<string[]>(['Clay', 'Apollo']);
  const [secretShopperConsent, setSecretShopperConsent] = useState<boolean>(true);
  type PackageTier = 'diagnostic' | 'core-engine' | 'fractional';

  const [selectedPackage, setSelectedPackage] = useState<PackageTier>(() => {
    if (tierParam === 'core-engine') return 'core-engine';
    if (tierParam === 'fractional') return 'fractional';
    return 'diagnostic';
  });

  // Derived display details for Step 3 and confirmation
  const getPackageDisplayTitle = (pkg: PackageTier) => {
    switch (pkg) {
      case 'diagnostic':
        return '7-Day GTM Architecture Diagnostic';
      case 'core-engine':
        return 'Core GTM Engine Sprint (30-Day)';
      case 'fractional':
        return 'Fractional Systems Architecture';
    }
  };

  const getCtaButtonText = (pkg: PackageTier) => {
    switch (pkg) {
      case 'diagnostic':
        return 'Lock Diagnostic Slot →';
      case 'core-engine':
        return 'Lock Architecture Slot →';
      case 'fractional':
        return 'Lock Architecture Slot →';
    }
  };

  const getTimelineText = (pkg: PackageTier) => {
    switch (pkg) {
      case 'diagnostic':
        return '7 Business Days from Kickoff';
      case 'core-engine':
        return '30 Calendar Days Fixed-Scope';
      case 'fractional':
        return 'Quarterly Commitment • Async SLA';
    }
  };
  const [selectedSlot, setSelectedSlot] = useState<number>(0);

  const timeSlots = [
    { day: 'TOMORROW / LIVE', time: '10:00 AM ET' },
    { day: 'TOMORROW / LIVE', time: '2:30 PM ET' },
    { day: 'TOMORROW / LIVE', time: '4:00 PM ET' },
    { day: 'THURSDAY / LIVE', time: '11:00 AM ET' },
    { day: 'THURSDAY / LIVE', time: '1:30 PM ET' },
    { day: 'FRIDAY / LIVE', time: '3:00 PM ET' },
  ];

  // Email validation
  const validateWorkEmail = (val: string) => {
    setEmail(val);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) {
      setEmailError('Please enter a valid business email address');
      return false;
    }
    const freeDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];
    const domain = val.split('@')[1]?.toLowerCase();
    if (freeDomains.includes(domain)) {
      setEmailError('Please provide your corporate domain (e.g., name@company.com)');
      return false;
    }
    setEmailError('');
    return true;
  };

  // Toggle enrichment tools
  const toggleTool = (tool: string) => {
    if (tool === 'None') {
      setEnrichmentTools(['None']);
      return;
    }
    const filtered = enrichmentTools.filter((t) => t !== 'None');
    if (filtered.includes(tool)) {
      const next = filtered.filter((t) => t !== tool);
      setEnrichmentTools(next.length === 0 ? ['None'] : next);
    } else {
      setEnrichmentTools([...filtered, tool]);
    }
  };

  // Parse ACV string to clean numeric value
  const parseAcvToNumber = (val: string): number => {
    if (!val) return 25000;
    if (val.includes('15k–$25k') || val.includes('15k-25k')) return 20000;
    if (val.includes('25k–$50k') || val.includes('25k-50k')) return 37500;
    if (val.includes('50k–$100k') || val.includes('50k-100k')) return 75000;
    if (val.includes('15k')) return 15000;
    const match = val.match(/\d+/g);
    if (match && match.length > 0) {
      const num = parseInt(match[0], 10);
      return val.toLowerCase().includes('k') ? num * 1000 : num;
    }
    return 25000;
  };

  // Helper to compile unified payload from Step 1 (Company Profile) and Step 2 (Stack Architecture)
  const getFormDataPayload = () => {
    const cleanEmail = (email && typeof email === 'string') ? email.trim().toLowerCase() : '';
    const domain = cleanEmail.includes('@') ? cleanEmail.split('@')[1].trim() : '';
    const namePart = domain ? domain.split('.')[0] : '';
    const companyName = namePart
      ? namePart
          .split(/[-_]/)
          .filter(Boolean)
          .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
          .join(' ')
      : 'Enterprise Client';

    const cleanActiveTools: string[] = Array.isArray(enrichmentTools)
      ? enrichmentTools.filter((t) => typeof t === 'string' && t.trim() !== '' && t !== 'None')
      : [];

    const parsedAcv = Number(parseAcvToNumber(acvRange));
    const targetPkg = (selectedPackage && getPackageDisplayTitle(selectedPackage)) 
      ? getPackageDisplayTitle(selectedPackage) 
      : (selectedPackage || '7-Day GTM Architecture Diagnostic');

    return {
      work_email: cleanEmail,
      company_name: companyName,
      website_domain: domain,
      company_arr_tier: arrRange || '$3M–$10M',
      average_contract_value_acv: isNaN(parsedAcv) ? 25000 : parsedAcv,
      primary_crm: (crm && crm.trim()) ? crm.trim() : 'Salesforce',
      active_tools: cleanActiveTools,
      target_package: targetPkg,
    };
  };

  // Dispatch data to Make.com ingestion webhook (strictly fired once)
  const dispatchWebhook = async (): Promise<boolean> => {
    if (webhookDispatchedRef.current || isSubmitting) {
      return false;
    }

    setIsSubmitting(true);
    webhookDispatchedRef.current = true;

    try {
      const payload = getFormDataPayload();

      console.log("Intake Payload:", payload);

      await fetch('https://hook.eu1.make.com/1i1kj99381i8ot88gqlj1vwn0vt0itku', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      return true;
    } catch (err) {
      console.warn('Make.com webhook ingestion notice (non-blocking):', err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2 -> Step 3 transition handler
  const handleContinueToCalendarLock = async () => {
    if (isSubmitting) return;
    await dispatchWebhook();
    setCurrentStep(3);
  };

  // Form Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep === 1) {
      if (validateWorkEmail(email)) {
        setCurrentStep(2);
      }
      return;
    }

    if (currentStep === 2) {
      void handleContinueToCalendarLock();
      return;
    }

    // Step 3 final submit: only dispatch if not already sent during Step 2
    if (!webhookDispatchedRef.current) {
      void dispatchWebhook();
    }

    setIsSubmitted(true);

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#1e293b', '#854d0e', '#059669', '#e6ded5'],
      });
    } catch {
      // safe fallback
    }
  };

  const progressPercent = isSubmitted 
    ? 100 
    : currentStep === 1 ? 33 
    : currentStep === 2 ? 66 
    : 100;

  return (
    <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      
      {/* Top Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#f3ede4] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-secondary)] mb-3 font-sans">
          <ShieldCheck className="h-3.5 w-3.5 text-[#6366F1]" />
          <span>Executive Technical Intake &bull; Senior Architects Only</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif text-[var(--text-primary)] tracking-tight font-normal">
          Book GTM Architecture Diagnostic
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[var(--text-secondary)] font-sans">
          7-day forensic audit of your inbound pipeline, CRM data hygiene, and webhook SLAs.
        </p>
      </div>

      {/* Main Elevated Card */}
      <div className="relative rounded-2xl border border-[var(--border-subtle)] bg-[#FAF8F5] shadow-subtle overflow-hidden">
        
        {/* Accent Top Line */}
        <div className="h-1 w-full bg-[#6366F1]" />

        {/* Live Progress Bar */}
        <div className="px-6 sm:px-8 pt-6 pb-2 border-b border-[#f2ece3] font-sans">
          <div className="flex items-center justify-between text-xs font-medium text-[var(--text-secondary)] mb-2">
            <span>Diagnostic Intake</span>
            <span className="text-[var(--text-primary)] font-semibold">{progressPercent}% Completed</span>
          </div>
          <div className="h-1.5 w-full bg-[#f5ede4] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#6366F1] rounded-full"
              initial={{ width: '33%' }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            />
          </div>
          
          {!isSubmitted && (
            <div className="flex justify-between text-xs text-[var(--text-secondary)] mt-2 font-medium">
              <span className={currentStep >= 1 ? 'text-[var(--text-primary)] font-semibold' : ''}>1. Company Profile</span>
              <span className={currentStep >= 2 ? 'text-[var(--text-primary)] font-semibold' : ''}>2. Stack &amp; CRM</span>
              <span className={currentStep >= 3 ? 'text-[#6366F1] font-semibold' : ''}>3. Calendar Lock</span>
            </div>
          )}
        </div>

        {/* Form Body or Confirmation */}
        <div className="p-6 sm:p-8 font-sans">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* =============================================================
                    STEP 1: COMPANY PROFILE
                   ============================================================= */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-5"
                  >
                    <div>
                      <h3 className="font-serif text-2xl text-[var(--text-primary)] font-normal">
                        Step 1: Company Profile
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5 font-sans">
                        Our architectures are calibrated specifically for $3M–$30M ARR scaleups.
                      </p>
                    </div>

                    {/* Work Email */}
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-1.5">
                        Work Email Address *
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => validateWorkEmail(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              if (validateWorkEmail(email)) {
                                setCurrentStep(2);
                              }
                            }
                          }}
                          placeholder="cro@company.com"
                          className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-[var(--text-primary)] placeholder:text-[#a89f91] focus:outline-none transition-colors bg-white ${
                            emailError 
                              ? 'border-rose-500 focus:border-rose-600 ring-1 ring-rose-500/20' 
                              : 'border-[var(--border-subtle)] focus:border-[#6366F1]'
                          }`}
                        />
                        <Mail className="absolute right-3.5 top-3 h-4 w-4 text-[#a89f91]" />
                      </div>
                      {emailError ? (
                        <p className="mt-1 text-xs text-rose-700 flex items-center gap-1">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          <span>{emailError}</span>
                        </p>
                      ) : (
                        <p className="mt-1 text-xs text-[var(--text-secondary)]">
                          Used to prepare your speed-to-lead audit dossier.
                        </p>
                      )}
                    </div>

                    {/* Company ARR Range */}
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-1.5">
                        Current ARR Range
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {['$1M–$3M', '$3M–$10M', '$10M–$30M', '$30M+'].map((tier) => (
                          <button
                            type="button"
                            key={tier}
                            onClick={() => setArrRange(tier)}
                            className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                              arrRange === tier
                                ? 'bg-[#6366F1] text-white border-[#6366F1] shadow-xs font-semibold'
                                : 'bg-white border-[var(--border-subtle)] text-[var(--text-primary)] hover:bg-[#faf7f3]'
                            }`}
                          >
                            {tier}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* ACV Range */}
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-1.5">
                        Average Contract Value (ACV)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {[
                          { label: '<$15k (Low ROI for Custom)', val: '<$15k' },
                          { label: '$15k–$25k', val: '$15k–$25k' },
                          { label: '$25k–$50k', val: '$25k–$50k' },
                          { label: '$50k–$100k+', val: '$50k–$100k+' },
                        ].map((item) => (
                          <button
                            type="button"
                            key={item.val}
                            onClick={() => setAcvRange(item.val)}
                            className={`py-2.5 px-3 rounded-lg text-xs font-medium border text-left transition-all ${
                              acvRange === item.val
                                ? 'bg-[#6366F1] text-white border-[#6366F1] shadow-xs font-semibold'
                                : 'bg-white border-[var(--border-subtle)] text-[var(--text-primary)] hover:bg-[#faf7f3]'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>

                      {acvRange === '<$15k' && (
                        <div className="mt-2.5 p-3 rounded-lg bg-[#fefce8] border border-[#fef08a] text-xs text-[#854d0e]">
                          <div className="font-semibold mb-0.5 flex items-center gap-1">
                            <AlertTriangle className="h-3.5 w-3.5 text-[#ca8a04]" />
                            <span>Enterprise Advisory:</span>
                          </div>
                          Our custom RevOps engineering is calibrated for $15k+ ACVs where sub-60s SLA produces immediate 6-figure ROI.
                        </div>
                      )}
                    </div>

                    {/* Next Button */}
                    <div className="pt-3 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          if (!email || emailError) {
                            validateWorkEmail(email);
                            return;
                          }
                          setCurrentStep(2);
                        }}
                        className="inline-flex items-center px-5 py-2.5 rounded-lg text-xs font-medium text-white bg-[#6366F1] hover:bg-[#4f46e5] transition-colors shadow-xs"
                      >
                        <span>Continue to Stack Setup</span>
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* =============================================================
                    STEP 2: STACK SETUP
                   ============================================================= */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-5"
                  >
                    <div>
                      <h3 className="font-serif text-2xl text-[var(--text-primary)] font-normal">
                        Step 2: Stack Architecture
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                        Select your current CRM and enrichment middleware tools.
                      </p>
                    </div>

                    {/* Primary CRM */}
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-1.5">
                        Primary CRM of Record
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {['Salesforce', 'HubSpot', 'Other'].map((c) => (
                          <button
                            type="button"
                            key={c}
                            onClick={() => setCrm(c)}
                            className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                              crm === c
                                ? 'bg-[#6366F1] text-white border-[#6366F1] shadow-xs font-semibold'
                                : 'bg-white border-[var(--border-subtle)] text-[var(--text-primary)] hover:bg-[#faf7f3]'
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Middleware in use */}
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-1.5">
                        Active Enrichment &amp; Middleware (Select all that apply)
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {['Clay', 'Make', 'Zapier', 'Apollo', 'ZoomInfo', 'None'].map((tool) => {
                          const isSelected = enrichmentTools.includes(tool);
                          return (
                            <button
                              type="button"
                              key={tool}
                              onClick={() => toggleTool(tool)}
                              className={`py-2 px-3 rounded-lg text-xs font-medium border flex items-center justify-between transition-all ${
                                isSelected
                                  ? 'bg-indigo-50 border-indigo-200 text-[#6366F1] font-semibold'
                                  : 'bg-white border-[var(--border-subtle)] text-[var(--text-primary)] hover:bg-[#faf7f3]'
                              }`}
                            >
                              <span>{tool}</span>
                              {isSelected && <Check className="h-3.5 w-3.5 text-[#6366F1]" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Target Sprint Package */}
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-1.5">
                        Target Engagement Package
                      </label>
                      <select
                        value={selectedPackage}
                        onChange={(e) => setSelectedPackage(e.target.value as PackageTier)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs font-medium focus:outline-none focus:border-[#6366F1] bg-white"
                      >
                        <option value="diagnostic">
                          Tier 1: 7-Day GTM Architecture Diagnostic ($3,500 Fixed)
                        </option>
                        <option value="core-engine">
                          Tier 2: Core GTM Engine Sprint ($12,500 Fixed // 30 Days)
                        </option>
                        <option value="fractional">
                          Tier 3: Fractional Systems Architecture ($6,500/mo Retainer)
                        </option>
                      </select>
                    </div>

                    {/* Nav buttons */}
                    <div className="pt-3 flex justify-between">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="inline-flex items-center px-4 py-2 rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] bg-white"
                      >
                        <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                        <span>Back</span>
                      </button>
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={handleContinueToCalendarLock}
                        className="inline-flex items-center px-5 py-2.5 rounded-lg text-xs font-medium text-white bg-[#6366F1] hover:bg-[#4f46e5] transition-colors shadow-xs disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="inline-block h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin mr-1.5" />
                            <span>Securing Priority Routing...</span>
                          </>
                        ) : (
                          <>
                            <span>Continue to Calendar Lock</span>
                            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* =============================================================
                    STEP 3: LOCK FORENSIC AUDIT SLOT & DIRECT CALENDAR EMBED
                   ============================================================= */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.25 }}
                    className="mt-6 sm:mt-8 space-y-6"
                  >
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-50 border border-indigo-200 text-[#6366F1] text-[11px] font-semibold font-mono uppercase">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#059669] animate-pulse" />
                        <span>PRIORITY_ROUTING: ACTIVE</span>
                      </div>
                      <h2 className="font-serif text-2xl sm:text-3xl text-[#000000] font-normal leading-snug tracking-tight">
                        Your intake is prioritized. Lock your Forensic Audit Slot with our GTM Architects below.
                      </h2>
                      <p className="text-xs sm:text-sm text-[#334155] leading-relaxed pt-1 font-sans">
                        To maintain deterministic execution, our partners take only two audits per cohort. Pick a live briefing time slot or complete authorization below.
                      </p>
                    </div>

                    {/* Audit Parameters Summary Card */}
                    <div className="p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-3 font-sans">
                      <div className="flex items-center justify-between pb-2.5 border-b border-[#F1F5F9] text-[11px] font-mono">
                        <span className="text-[var(--text-secondary)] font-semibold uppercase tracking-wider">
                          AUDIT_PARAMETERS // SPECIFICATION
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-700 font-medium">
                          VERIFIED INPUTS
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                        {/* Field 1: Lead Contact */}
                        <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E2E8F0]/80">
                          <div className="text-[11px] font-mono text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                            Lead Contact
                          </div>
                          <div className="text-xs sm:text-sm font-semibold text-[#0F172A] font-mono truncate" title={email || 'executive@company.com'}>
                            {email || 'executive@company.com'}
                          </div>
                        </div>

                        {/* Field 2: Revenue Tier */}
                        <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E2E8F0]/80">
                          <div className="text-[11px] font-mono text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                            Revenue Tier
                          </div>
                          <div className="text-xs sm:text-sm font-semibold text-[#0F172A] font-mono">
                            {arrRange} ARR
                          </div>
                        </div>

                        {/* Field 3: Primary CRM */}
                        <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E2E8F0]/80">
                          <div className="text-[11px] font-mono text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                            Primary CRM
                          </div>
                          <div className="text-xs sm:text-sm font-semibold text-[#0F172A] font-mono">
                            {crm}
                          </div>
                        </div>

                        {/* Field 4: Selected Package */}
                        <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E2E8F0]/80">
                          <div className="text-[11px] font-mono text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                            Selected Package
                          </div>
                          <div className="text-xs sm:text-sm font-semibold text-[#0F172A] font-mono truncate" title={getPackageDisplayTitle(selectedPackage)}>
                            {getPackageDisplayTitle(selectedPackage)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Embedded Scheduling Engine */}
                    <div className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden shadow-xs p-5 sm:p-6 font-sans">
                      {/* Practice Lead Card Header */}
                      <div className="flex items-center justify-between pb-3.5 border-b border-[#E2E8F0] mb-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="h-9 w-9 rounded-xl bg-[#0F172A] border border-[#1E293B] text-white flex items-center justify-center font-bold text-xs font-mono shadow-xs">
                              AR
                            </div>
                            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#059669] ring-2 ring-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-xs sm:text-sm text-[#0F172A]">
                              Abhinav Raj <span className="text-[#64748B] font-medium">(Principal Systems Architect)</span>
                            </div>
                            <div className="text-[11px] text-[#64748B] mt-0.5">
                              30-Min Forensic GTM Diagnostic Briefing
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#047857]/[0.08] text-[#047857] border border-[#047857]/20 text-[10px] sm:text-[11px] font-semibold font-mono uppercase tracking-wider">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#059669] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#059669]"></span>
                          </span>
                          <span>LIVE OPENINGS</span>
                        </div>
                      </div>

                      {/* Cal.com / Scheduler Slot Picker Simulation */}
                      <div className="space-y-3">
                        <div className="text-[11px] font-semibold text-[#0F172A] uppercase tracking-wider font-mono">
                          Select Diagnostic Time Slot (Eastern Time):
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                          {timeSlots.map((slot, i) => {
                            const isSelected = selectedSlot === i;
                            return (
                              <button
                                type="button"
                                key={i}
                                onClick={() => setSelectedSlot(i)}
                                className={`p-[14px_18px] rounded-lg border text-left transition-all duration-150 flex flex-col justify-between cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#0F172A] border-[#0F172A] text-white shadow-sm scale-[1.01]'
                                    : 'bg-white border-[#E2E8F0] hover:border-[#6366F1] hover:bg-[#6366F1]/[0.04] hover:scale-[1.02] text-[#0F172A]'
                                }`}
                              >
                                <div className="flex items-center justify-between w-full mb-1">
                                  <span className={`text-[10px] font-mono font-medium tracking-wider uppercase ${
                                    isSelected ? 'text-slate-300' : 'text-[#64748B]'
                                  }`}>
                                    {slot.day}
                                  </span>
                                  {isSelected && (
                                    <span className="flex items-center justify-center h-4 w-4 rounded-full bg-[#6366F1] text-white shadow-2xs">
                                      <Check className="h-2.5 w-2.5 stroke-[2.5]" />
                                    </span>
                                  )}
                                </div>
                                <div className={`text-xs sm:text-sm font-bold font-mono tracking-tight ${
                                  isSelected ? 'text-white' : 'text-[#0F172A]'
                                }`}>
                                  {slot.time}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                        <div className="pt-2 text-[11px] font-mono text-[#64748B] text-center flex items-center justify-center gap-1.5">
                          <Lock className="h-3.5 w-3.5 text-[#64748B] shrink-0" />
                          <span>Direct integration with Cal.com &bull; Calendar invite + Zoom link dispatched instantly</span>
                        </div>
                      </div>
                    </div>

                    {/* Secret Shopper Checkbox */}
                    <div className="p-4 sm:p-5 rounded-xl bg-[#F8FAFC] border border-dashed border-[#CBD5E1] transition-colors">
                      <label className="flex items-start gap-3.5 cursor-pointer select-none group">
                        <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                          <input
                            type="checkbox"
                            checked={secretShopperConsent}
                            onChange={(e) => setSecretShopperConsent(e.target.checked)}
                            className="sr-only"
                          />
                          <div className={`h-5 w-5 rounded-md border transition-all flex items-center justify-center ${
                            secretShopperConsent
                              ? 'bg-[#6366F1] border-[#6366F1] text-white shadow-xs'
                              : 'bg-white border-[#CBD5E1] group-hover:border-[#6366F1]'
                          }`}>
                            {secretShopperConsent && <Check className="h-3.5 w-3.5 stroke-[2.5]" />}
                          </div>
                        </div>
                        <div className="text-xs">
                          <span className="text-[#0F172A] font-bold block mb-1">
                            Authorize Secret-Shopper Speed-to-Lead Test
                          </span>
                          <span className="text-[#475569] leading-relaxed block">
                            Authorize eqinhouse to run a secret-shopper test on our public demo form to measure exact latency from form submission to SDR outreach.
                          </span>
                        </div>
                      </label>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="inline-flex items-center justify-center px-4 py-3 rounded-lg text-xs sm:text-sm font-medium text-[#475569] hover:text-[#0F172A] border border-[#E2E8F0] bg-white hover:bg-[#FAF8F5] transition-all shadow-2xs active:scale-98 cursor-pointer font-mono"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        <span>Back</span>
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center px-6 py-3.5 rounded-lg text-xs sm:text-sm font-semibold text-white bg-[#6366F1] hover:bg-[#4F46E5] shadow-sm hover:shadow-md transition-all group active:scale-98 cursor-pointer font-sans disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <Lock className="mr-2 h-4 w-4 text-white/90" />
                        <span>{getCtaButtonText(selectedPackage)}</span>
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </motion.div>
                )}

              </form>
            ) : (
              /* =============================================================
                  EXECUTIVE CONFIRMATION CARD
                 ============================================================= */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center pb-2">
                  <div className="h-12 w-12 mx-auto rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-[#6366F1] mb-3 shadow-xs">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h3 className="font-serif text-3xl text-[var(--text-primary)] font-normal">
                    Architecture Slot Locked
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    Your technical intake is locked and routed directly to Abhinav Raj (Principal Systems Architect).
                  </p>
                </div>

                {/* Confirmation Summary */}
                <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 space-y-3 text-xs font-sans">
                  <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
                    <span className="text-[var(--text-secondary)] font-mono text-[11px]">Organization Contact:</span>
                    <span className="font-semibold text-[#0F172A] font-mono">{email}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
                    <span className="text-[var(--text-secondary)] font-mono text-[11px]">Selected Engagement:</span>
                    <span className="font-semibold text-[#0F172A] font-mono">{getPackageDisplayTitle(selectedPackage)}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
                    <span className="text-[var(--text-secondary)] font-mono text-[11px]">Turnaround Timeline:</span>
                    <span className="font-semibold text-[#0F172A] font-mono">{getTimelineText(selectedPackage)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-secondary)] font-mono text-[11px]">Assigned Practice Lead:</span>
                    <span className="font-semibold text-[#0F172A] font-mono">Abhinav Raj (Principal Systems Architect)</span>
                  </div>
                </div>

                {/* Action Links */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      webhookDispatchedRef.current = false;
                      setCurrentStep(1);
                    }}
                    className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline"
                  >
                    Submit another intake
                  </button>

                  <Link
                    to="/stack"
                    className="inline-flex items-center px-4 py-2 rounded-lg font-medium text-[var(--text-primary)] bg-white border border-[var(--border-subtle)] hover:bg-[#faf7f3] transition-colors shadow-xs"
                  >
                    <span>Inspect Our Architectural Stack</span>
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
