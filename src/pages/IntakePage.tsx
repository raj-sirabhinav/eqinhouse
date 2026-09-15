import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import Cal, { getCalApi } from '@calcom/embed-react';
import { 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  AlertTriangle, 
  Lock, 
  Mail,
  User,
  Building2,
  Globe,
  CheckCircle2,
  Cpu,
  RefreshCw
} from 'lucide-react';
import { TiltCard } from '../components/TiltCard';

export const IntakePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tierParam = searchParams.get('tier');

  // Submission & Navigation State
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [transmissionError, setTransmissionError] = useState<string | null>(null);
  const webhookDispatchedRef = useRef<boolean>(false);

  // Form State - Lead Identity
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [workEmail, setWorkEmail] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [websiteDomain, setWebsiteDomain] = useState<string>('');
  
  // Form State - ARR & ACV
  const [arrTier, setArrTier] = useState<string>('$3M–$10M');
  const [acvValue, setAcvValue] = useState<number>(25000);
  
  // Architectural Parameters (Optional & Contextual)
  const [crm, setCrm] = useState<string>('Salesforce');
  type PackageTier = 'diagnostic' | 'core-engine' | 'fractional';
  const [selectedPackage, setSelectedPackage] = useState<PackageTier>(() => {
    if (tierParam === 'core-engine') return 'core-engine';
    if (tierParam === 'fractional') return 'fractional';
    return 'diagnostic';
  });

  // Validation States
  const [emailError, setEmailError] = useState<string>('');
  const [firstNameError, setFirstNameError] = useState<string>('');
  const [lastNameError, setLastNameError] = useState<string>('');
  const [companyError, setCompanyError] = useState<string>('');
  const [domainError, setDomainError] = useState<string>('');

  // Free / Consumer Email Providers Denylist
  const FREE_EMAIL_DOMAINS = [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'icloud.com',
    'aol.com',
    'protonmail.com',
    'mail.com',
    'zoho.com',
    'yandex.com',
    'gmx.com'
  ];

  // Domain Sanitizer: Strip protocol, www, subpaths, trailing slashes, ports
  const sanitizeDomain = (val: string): string => {
    if (!val) return '';
    let clean = val.trim().toLowerCase();
    clean = clean.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '');
    clean = clean.split('/')[0].split('?')[0].split('#')[0].split(':')[0];
    return clean.trim();
  };

  // Auto-extract domain & company when work email is typed
  const handleEmailChange = (val: string) => {
    setWorkEmail(val);
    setTransmissionError(null);
    validateWorkEmail(val);

    const parts = val.split('@');
    if (parts.length === 2 && parts[1].includes('.')) {
      const extractedDomain = parts[1].toLowerCase().trim();
      if (!FREE_EMAIL_DOMAINS.includes(extractedDomain)) {
        if (!websiteDomain) {
          setWebsiteDomain(extractedDomain);
        }
        if (!companyName) {
          const rootName = extractedDomain.split('.')[0];
          if (rootName) {
            const formatted = rootName.charAt(0).toUpperCase() + rootName.slice(1);
            setCompanyName(formatted);
          }
        }
      }
    }
  };

  // Work Email Validator
  const validateWorkEmail = (val: string): boolean => {
    const trimmed = val.trim().toLowerCase();
    if (!trimmed) {
      setEmailError('Work email is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setEmailError('Please enter a valid work email address');
      return false;
    }
    const domainPart = trimmed.split('@')[1];
    if (FREE_EMAIL_DOMAINS.includes(domainPart)) {
      setEmailError('Please provide your corporate email domain (e.g., sarah@company.com)');
      return false;
    }
    setEmailError('');
    return true;
  };

  // Package display helpers
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

  // Dynamic Cal link mapping based on selected package
  const getCalLink = (pkg: string): string => {
    const title = getPackageDisplayTitle(pkg as PackageTier) || pkg || '';
    if (title.includes('7-Day') || title.includes('Tier 1') || pkg === 'diagnostic') {
      return 'eqinhouse/diagnostic';
    }
    if (title.includes('Core GTM') || title.includes('Tier 2') || pkg === 'core-engine') {
      return 'eqinhouse/sprint';
    }
    if (title.includes('Fractional') || title.includes('Tier 3') || pkg === 'fractional') {
      return 'eqinhouse/fractional';
    }
    return 'eqinhouse/diagnostic';
  };

  const calLink = getCalLink(selectedPackage);

  // Initialize Cal.com Embed API
  useEffect(() => {
    (async function () {
      try {
        const cal = await getCalApi();
        cal('ui', {
          theme: 'dark',
          styles: { branding: { brandColor: '#8B5CF6' } },
          hideEventTypeDetails: false,
          layout: 'month_view',
        });
        cal('on', {
          action: 'bookingSuccessful',
          callback: () => {
            try {
              confetti({
                particleCount: 75,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#0F172A', '#10B981', '#8B5CF6', '#38BDF8'],
              });
            } catch {
              // safe fallback
            }
          },
        });
      } catch (err) {
        console.warn('Cal.com embed initialization notice:', err);
      }
    })();
  }, []);

  // Form submission & webhook transmission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTransmissionError(null);

    // Validate fields
    let hasError = false;

    if (!firstName.trim()) {
      setFirstNameError('First name is required');
      hasError = true;
    } else {
      setFirstNameError('');
    }

    if (!lastName.trim()) {
      setLastNameError('Last name is required');
      hasError = true;
    } else {
      setLastNameError('');
    }

    if (!validateWorkEmail(workEmail)) {
      hasError = true;
    }

    if (!companyName.trim()) {
      setCompanyError('Company name is required');
      hasError = true;
    } else {
      setCompanyError('');
    }

    const cleanDomain = sanitizeDomain(websiteDomain);
    if (!cleanDomain) {
      setDomainError('Company domain is required (e.g., acme.com)');
      hasError = true;
    } else {
      setDomainError('');
    }

    if (hasError) {
      return;
    }

    // Prepare JSON payload with exact required schema
    const payload = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      work_email: workEmail.trim().toLowerCase(),
      company_name: companyName.trim(),
      website_domain: cleanDomain,
      company_arr_tier: arrTier,
      average_contract_value_acv: parseInt(String(acvValue), 10),
      // Enriched architectural parameters
      primary_crm: crm,
      target_package: getPackageDisplayTitle(selectedPackage),
      submitted_at: new Date().toISOString()
    };

    setIsSubmitting(true);

    const webhookUrl = (import.meta as any).env?.VITE_WEBHOOK_URL || 'https://hook.eu1.make.com/1i1kj99381i8ot88gqlj1vwn0vt0itku';

    try {
      console.log('Transmitting Telemetry Payload to Webhook:', payload);

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        webhookDispatchedRef.current = true;
        setIsSubmitted(true);
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#10B981', '#8B5CF6', '#0F172A', '#FFFFFF'],
          });
        } catch {
          // safe fallback
        }
      } else {
        setTransmissionError('Transmission interrupted. Please retry.');
      }
    } catch (err) {
      console.warn('Webhook transmission error:', err);
      setTransmissionError('Transmission interrupted. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const cleanDomainDisplay = sanitizeDomain(websiteDomain) || (workEmail.includes('@') ? workEmail.split('@')[1] : '');

  return (
    <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      
      {/* Top Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300 mb-3 backdrop-blur-md shadow-xs">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
          </span>
          <span className="text-[#10B981] font-semibold">REVOPS_TELEMETRY //</span>
          <span>Deterministic Intake Protocol</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif text-[var(--text-primary)] tracking-tight font-normal">
          Book GTM Architecture Diagnostic
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[var(--text-secondary)] font-sans max-w-xl mx-auto">
          7-day forensic audit of your inbound pipeline, webhook SLAs, and CRM data architecture calibrated for scaleups.
        </p>
      </div>

      {/* Main Elevated Engineering Slate Card */}
      <TiltCard maxTiltDeg={1.0} hoverEffect={true} className="relative rounded-2xl border border-slate-800 bg-[#0F172A] shadow-2xl overflow-hidden backdrop-blur-xl">
        
        {/* Optical Accent Top Line with Telemetry Gradient */}
        <div className="h-1 w-full bg-gradient-to-r from-[#10B981] via-[#8B5CF6] to-[#6366F1]" />

        {/* Telemetry Header Badge Row */}
        <div className="px-6 sm:px-8 py-3.5 border-b border-slate-800/80 bg-slate-950/40 flex items-center justify-between font-mono text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Cpu className="h-3.5 w-3.5 text-[#8B5CF6]" />
            <span className="text-slate-200 font-semibold tracking-wider uppercase text-[11px]">SPEC_ID // INTAKE-2026</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]"></span>
            <span className="text-[11px] text-emerald-400 font-medium">PIPELINE_ROUTER: ONLINE</span>
          </div>
        </div>

        {/* Form Body or Confirmation View */}
        <div className="p-6 sm:p-8 font-sans">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* 1. LEAD IDENTITY ROW (FIRST NAME & LAST NAME) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-300">
                      Lead Identity <span className="text-rose-400">*</span>
                    </label>
                    <span className="text-[10px] font-mono text-slate-500">2-COLUMN DESKTOP</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* First Name */}
                    <div>
                      <div className="relative">
                        <input
                          type="text"
                          name="first_name"
                          required
                          value={firstName}
                          onChange={(e) => {
                            setFirstName(e.target.value);
                            if (firstNameError) setFirstNameError('');
                            setTransmissionError(null);
                          }}
                          placeholder="e.g., Sarah"
                          className={`w-full pl-9 pr-3.5 py-2.5 rounded-lg border text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none transition-all bg-slate-950/60 font-sans ${
                            firstNameError 
                              ? 'border-rose-500/80 focus:border-rose-500 ring-1 ring-rose-500/20' 
                              : 'border-slate-800 hover:border-slate-700 focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/30'
                          }`}
                        />
                        <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                      </div>
                      {firstNameError && (
                        <p className="mt-1 text-[11px] font-mono text-rose-400">{firstNameError}</p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div>
                      <div className="relative">
                        <input
                          type="text"
                          name="last_name"
                          required
                          value={lastName}
                          onChange={(e) => {
                            setLastName(e.target.value);
                            if (lastNameError) setLastNameError('');
                            setTransmissionError(null);
                          }}
                          placeholder="e.g., Connor"
                          className={`w-full pl-9 pr-3.5 py-2.5 rounded-lg border text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none transition-all bg-slate-950/60 font-sans ${
                            lastNameError 
                              ? 'border-rose-500/80 focus:border-rose-500 ring-1 ring-rose-500/20' 
                              : 'border-slate-800 hover:border-slate-700 focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/30'
                          }`}
                        />
                        <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                      </div>
                      {lastNameError && (
                        <p className="mt-1 text-[11px] font-mono text-rose-400">{lastNameError}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. WORK EMAIL */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-300">
                      Work Email Address <span className="text-rose-400">*</span>
                    </label>
                    <span className="text-[10px] font-mono text-slate-500">CORPORATE DOMAIN REQUIRED</span>
                  </div>
                  <div className="relative">
                    <input
                      type="email"
                      name="work_email"
                      required
                      value={workEmail}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      placeholder="sarah@company.com"
                      className={`w-full pl-9 pr-10 py-2.5 rounded-lg border text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none transition-all bg-slate-950/60 font-sans ${
                        emailError 
                          ? 'border-rose-500/80 focus:border-rose-500 ring-1 ring-rose-500/20' 
                          : 'border-slate-800 hover:border-slate-700 focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/30'
                      }`}
                    />
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    {workEmail && !emailError && (
                      <CheckCircle2 className="absolute right-3.5 top-3 h-4 w-4 text-[#10B981]" />
                    )}
                  </div>
                  {emailError ? (
                    <div className="mt-1.5 p-2.5 rounded-md bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2 font-mono">
                      <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
                      <span>{emailError}</span>
                    </div>
                  ) : (
                    <p className="mt-1 text-[11px] font-mono text-slate-400">
                      Used to deliver the benchmark diagnostic dossier &amp; architecture recommendations.
                    </p>
                  )}
                </div>

                {/* 3. COMPANY NAME & WEBSITE DOMAIN (2-COLUMN INLINE) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Company Name */}
                  <div>
                    <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Company Name <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="company_name"
                        required
                        value={companyName}
                        onChange={(e) => {
                          setCompanyName(e.target.value);
                          if (companyError) setCompanyError('');
                          setTransmissionError(null);
                        }}
                        placeholder="e.g., Acme Corp"
                        className={`w-full pl-9 pr-3.5 py-2.5 rounded-lg border text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none transition-all bg-slate-950/60 font-sans ${
                          companyError 
                            ? 'border-rose-500/80 focus:border-rose-500 ring-1 ring-rose-500/20' 
                            : 'border-slate-800 hover:border-slate-700 focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/30'
                        }`}
                      />
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    </div>
                    {companyError && (
                      <p className="mt-1 text-[11px] font-mono text-rose-400">{companyError}</p>
                    )}
                  </div>

                  {/* Company Domain / Website */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-300">
                        Website Domain <span className="text-rose-400">*</span>
                      </label>
                      <span className="text-[10px] font-mono text-slate-500">AUTO-SANITIZED</span>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        name="website_domain"
                        required
                        value={websiteDomain}
                        onChange={(e) => {
                          setWebsiteDomain(e.target.value);
                          if (domainError) setDomainError('');
                          setTransmissionError(null);
                        }}
                        onBlur={() => {
                          if (websiteDomain) {
                            setWebsiteDomain(sanitizeDomain(websiteDomain));
                          }
                        }}
                        placeholder="acme.com"
                        className={`w-full pl-9 pr-3.5 py-2.5 rounded-lg border text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none transition-all bg-slate-950/60 font-sans ${
                          domainError 
                            ? 'border-rose-500/80 focus:border-rose-500 ring-1 ring-rose-500/20' 
                            : 'border-slate-800 hover:border-slate-700 focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/30'
                        }`}
                      />
                      <Globe className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    </div>
                    {domainError ? (
                      <p className="mt-1 text-[11px] font-mono text-rose-400">{domainError}</p>
                    ) : (
                      <p className="mt-1 text-[10px] font-mono text-slate-400">
                        Clean root domain: <span className="text-[#38BDF8]">{sanitizeDomain(websiteDomain) || 'acme.com'}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* 4. COMPANY ARR TIER PILL-PICKER */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-300">
                      Company ARR Tier <span className="text-rose-400">*</span>
                    </label>
                    <span className="text-[10px] font-mono text-slate-400">CALIBRATED SCOPE</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['<$3M', '$3M–$10M', '$10M–$30M', '$30M+'].map((tier) => {
                      const isSelected = arrTier === tier;
                      return (
                        <button
                          type="button"
                          key={tier}
                          onClick={() => {
                            setArrTier(tier);
                            setTransmissionError(null);
                          }}
                          className={`py-2.5 px-3 rounded-lg text-xs font-mono font-medium border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-white shadow-[0_0_12px_rgba(139,92,246,0.25)] font-semibold'
                              : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                          }`}
                        >
                          {tier}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. AVERAGE CONTRACT VALUE (ACV) PILL-PICKER */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-300">
                      Average Contract Value (ACV) <span className="text-rose-400">*</span>
                    </label>
                    <span className="text-[10px] font-mono text-[#10B981]">
                      {acvValue >= 25000 ? 'PRIORITY CALENDAR UNLOCKED' : 'STANDARD AUDIT'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { label: '$10,000', val: 10000, desc: '<$15k' },
                      { label: '$25,000', val: 25000, desc: 'Standard' },
                      { label: '$50,000', val: 50000, desc: 'Growth' },
                      { label: '$100,000+', val: 100000, desc: 'Enterprise' },
                    ].map((item) => {
                      const isSelected = acvValue === item.val;
                      return (
                        <button
                          type="button"
                          key={item.val}
                          onClick={() => {
                            setAcvValue(item.val);
                            setTransmissionError(null);
                          }}
                          className={`py-2.5 px-3 rounded-lg text-xs border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#10B981]/20 border-[#10B981] text-white shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                              : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                          }`}
                        >
                          <div className="font-mono font-bold">{item.label}</div>
                          <div className="text-[10px] text-slate-400">{item.desc}</div>
                        </button>
                      );
                    })}
                  </div>

                  {acvValue < 25000 && (
                    <div className="mt-2.5 p-3 rounded-lg bg-amber-950/30 border border-amber-800/40 text-xs text-amber-300 flex items-start gap-2 font-mono">
                      <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Advisory:</span> Our custom sub-60s webhook architecture is optimized for $25k+ ACVs where immediate pipeline acceleration generates 6-figure net-new pipeline.
                      </div>
                    </div>
                  )}
                </div>

                {/* 6. CONTEXTUAL ARCHITECTURE SPECIFICATIONS (CRM & PACKAGE) */}
                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-3.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pb-2 border-b border-slate-800/60">
                    <span className="font-semibold text-slate-300 uppercase tracking-wider">
                      SYSTEMS_ENVIRONMENT // ARCHITECTURE
                    </span>
                    <span className="text-[10px] text-slate-500">OPTIONAL CONFIG</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Primary CRM */}
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                        Primary CRM Ecosystem
                      </label>
                      <select
                        value={crm}
                        onChange={(e) => setCrm(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none focus:border-[#8B5CF6] bg-slate-900 cursor-pointer"
                      >
                        <option value="Salesforce">Salesforce CRM</option>
                        <option value="HubSpot">HubSpot CRM</option>
                        <option value="Other">Other / Custom Postgres</option>
                      </select>
                    </div>

                    {/* Target Package */}
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                        Desired Target Package
                      </label>
                      <select
                        value={selectedPackage}
                        onChange={(e) => setSelectedPackage(e.target.value as PackageTier)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none focus:border-[#8B5CF6] bg-slate-900 cursor-pointer"
                      >
                        <option value="diagnostic">Tier 1: 7-Day Architecture Diagnostic ($3,500)</option>
                        <option value="core-engine">Tier 2: Core GTM Engine Sprint ($12,500)</option>
                        <option value="fractional">Tier 3: Fractional Systems Architecture ($6,500/mo)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* INLINE ERROR BADGE */}
                {transmissionError && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-center justify-between font-mono"
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
                      <span className="font-semibold">{transmissionError}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="px-2.5 py-1 rounded bg-rose-900/60 hover:bg-rose-800 text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <RefreshCw className="h-3 w-3" />
                      <span>Retry</span>
                    </button>
                  </motion.div>
                )}

                {/* SUBMIT BUTTON */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#10B981] shrink-0" />
                    <span>Deterministic SLA &bull; Direct Architect Review</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-lg text-xs sm:text-sm font-mono font-semibold transition-all shadow-lg cursor-pointer ${
                      isSubmitting
                        ? 'bg-[#8B5CF6]/50 text-white cursor-wait'
                        : 'bg-gradient-to-r from-[#10B981] via-[#8B5CF6] to-[#6366F1] text-white hover:opacity-95 active:scale-[0.99] shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2.5">
                        <span className="relative flex h-3.5 w-3.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-white"></span>
                        </span>
                        <span>Transmitting Payload (&lt;120ms)...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>Initialize Architecture Diagnostic</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    )}
                  </button>
                </div>

              </form>
            ) : (
              /* =============================================================
                  CONFIRMATION VIEW (GATED BY ACV >= $25,000)
                 ============================================================= */
              <motion.div
                key="submitted-confirmation"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                className="space-y-6"
              >
                {acvValue >= 25000 ? (
                  /* -------------------------------------------------------------
                     HIGH-TIER GATE (ACV >= $25,000): LIVE CAL.COM SCHEDULING
                     ------------------------------------------------------------- */
                  <>
                    <div className="space-y-2 text-center sm:text-left">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold font-mono uppercase">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
                        <span>PRIORITY_ROUTING: ACTIVE</span>
                      </div>
                      <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal leading-snug tracking-tight">
                        Select Your Architecture Diagnostic Session
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                        Diagnostic parameters verified for <span className="font-semibold text-white">{companyName}</span>. Select a live briefing session with our principal systems team below.
                      </p>
                    </div>

                    {/* Audit Parameters Summary Card */}
                    <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 shadow-xl space-y-3 font-sans">
                      <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/80 text-[11px] font-mono">
                        <span className="text-slate-400 font-semibold uppercase tracking-wider">
                          PAYLOAD_DISPATCHED // ENRICHED LEAD PROFILE
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-[10px] text-emerald-400 font-medium border border-emerald-800/50">
                          VERIFIED &amp; SYNCHRONIZED
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                        {/* Lead Identity */}
                        <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                            Lead Executive
                          </div>
                          <div className="text-xs sm:text-sm font-semibold text-white font-mono truncate">
                            {firstName} {lastName}
                          </div>
                          <div className="text-[11px] text-[#38BDF8] font-mono truncate">
                            {workEmail}
                          </div>
                        </div>

                        {/* Organization */}
                        <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                            Organization &amp; Domain
                          </div>
                          <div className="text-xs sm:text-sm font-semibold text-white font-mono truncate">
                            {companyName}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono truncate">
                            {cleanDomainDisplay}
                          </div>
                        </div>

                        {/* Revenue & ACV */}
                        <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                            ARR &amp; Target ACV
                          </div>
                          <div className="text-xs sm:text-sm font-semibold text-[#10B981] font-mono">
                            {arrTier} ARR &bull; ${acvValue.toLocaleString()} ACV
                          </div>
                        </div>

                        {/* Selected Package */}
                        <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                            Target Architecture
                          </div>
                          <div className="text-xs sm:text-sm font-semibold text-[#8B5CF6] font-mono truncate">
                            {getPackageDisplayTitle(selectedPackage)}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono truncate">
                            {getTimelineText(selectedPackage)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Embedded Scheduling Engine with Live Cal.com */}
                    <div className="rounded-xl border border-slate-800 bg-slate-950/80 overflow-hidden shadow-2xl p-4 sm:p-6 font-sans space-y-4">
                      {/* Practice Lead Card Header */}
                      <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="h-9 w-9 rounded-xl bg-slate-900 border border-slate-700 text-white flex items-center justify-center font-bold text-xs font-mono shadow-xs">
                              AR
                            </div>
                            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#10B981] ring-2 ring-slate-950" />
                          </div>
                          <div>
                            <div className="font-semibold text-xs sm:text-sm text-white">
                              Abhinav Raj <span className="text-slate-400 font-medium">(Principal Systems Architect)</span>
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                              30-Min Forensic GTM Diagnostic Briefing
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 text-[#10B981] border border-emerald-500/30 text-[10px] sm:text-[11px] font-semibold font-mono uppercase tracking-wider">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
                          </span>
                          <span>LIVE CALENDAR</span>
                        </div>
                      </div>

                      {/* Dynamic Cal.com Inline Embed */}
                      <div className="w-full min-h-[650px] rounded-xl bg-[#0F172A] border border-slate-800 shadow-xl overflow-hidden p-1 sm:p-2">
                        <Cal
                          key={calLink}
                          calLink={calLink}
                          style={{ width: '100%', height: '100%', minHeight: '650px', overflow: 'auto' }}
                          config={{
                            name: `${firstName} ${lastName}`.trim() || companyName,
                            email: workEmail,
                            theme: 'dark',
                            layout: 'month_view',
                          }}
                        />
                      </div>
                    </div>

                    {/* Navigation Actions */}
                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setIsSubmitted(false);
                          webhookDispatchedRef.current = false;
                        }}
                        className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium text-slate-300 hover:text-white border border-slate-800 bg-slate-900/60 hover:bg-slate-800 transition-all font-mono cursor-pointer"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        <span>Edit Parameters</span>
                      </button>

                      <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                        <Lock className="h-3.5 w-3.5 text-[#10B981] shrink-0" />
                        <span>Direct integration with Cal.com &bull; Calendar invite + Zoom link dispatched instantly</span>
                      </div>
                    </div>
                  </>
                ) : (
                  /* -------------------------------------------------------------
                     MID-MARKET / FALLBACK (ACV < $25,000): CONFIRMATION CARD
                     ------------------------------------------------------------- */
                  <div className="space-y-6">
                    <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-6 sm:p-8 shadow-2xl text-center space-y-4 font-sans">
                      {/* Animated Green Checkmark Badge */}
                      <div className="h-14 w-14 mx-auto rounded-full bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-[#10B981] shadow-lg">
                        <CheckCircle2 className="h-7 w-7" />
                      </div>

                      <div className="space-y-1.5">
                        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold font-mono uppercase tracking-wider">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                          <span>TRANSMISSION CONFIRMED</span>
                        </div>
                        <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal tracking-tight">
                          Intake Parameters Received
                        </h2>
                      </div>

                      <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto leading-relaxed">
                        Thank you, <span className="font-semibold text-white">{firstName}</span>. Your architectural profile for{' '}
                        <span className="font-semibold text-white">{companyName}</span> has been dispatched to our systems engineering queue. Our complete Speed-to-Lead &amp; Pipeline Latency Diagnostic Framework will be sent directly to{' '}
                        <span className="font-semibold text-[#38BDF8] font-mono text-xs sm:text-sm">{workEmail}</span>.
                      </p>

                      <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 text-left leading-relaxed font-sans">
                        <span className="font-semibold text-white block mb-0.5 font-mono text-[11px] uppercase tracking-wider">
                          Review &amp; Evaluation Protocol
                        </span>
                        Our engineering team analyzes inbound pipeline telemetry against industry benchmarks. If your team requires bespoke multi-cloud orchestration or custom ERP syncing, you may reply directly to our confirmation dispatch.
                      </div>

                      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link
                          to="/"
                          className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg text-xs sm:text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-all font-mono"
                        >
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          <span>Back to Overview</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setIsSubmitted(false);
                            webhookDispatchedRef.current = false;
                          }}
                          className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 font-mono transition-colors"
                        >
                          <span>Submit New Architecture Profile</span>
                        </button>
                      </div>
                    </div>

                    {/* Parameters Summary Card */}
                    <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 shadow-lg space-y-3 font-sans">
                      <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 text-[11px] font-mono">
                        <span className="text-slate-400 font-semibold uppercase tracking-wider">
                          SUBMITTED_PROFILE // OVERVIEW
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-[10px] text-emerald-400 font-medium border border-emerald-800/40">
                          PAYLOAD DELIVERED
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                        <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                            Contact Lead
                          </div>
                          <div className="text-xs sm:text-sm font-semibold text-white font-mono truncate">
                            {firstName} {lastName}
                          </div>
                          <div className="text-[11px] text-[#38BDF8] font-mono truncate">
                            {workEmail}
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                            Company / Domain
                          </div>
                          <div className="text-xs sm:text-sm font-semibold text-white font-mono truncate">
                            {companyName}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono truncate">
                            {cleanDomainDisplay}
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                            Contract ACV Tier
                          </div>
                          <div className="text-xs sm:text-sm font-semibold text-white font-mono">
                            ${acvValue.toLocaleString()} (Benchmark)
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                            Annual ARR Tier
                          </div>
                          <div className="text-xs sm:text-sm font-semibold text-white font-mono">
                            {arrTier} ARR
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </TiltCard>
    </div>
  );
};
