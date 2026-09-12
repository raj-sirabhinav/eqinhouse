import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, CheckCircle, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 mt-28 border-t border-[var(--border-subtle)] bg-[#f4efe8]/70 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Systems Standards Banner */}
        <div className="mb-12 p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col md:flex-row items-center justify-between gap-4 text-xs shadow-subtle">
          <div className="flex items-center space-x-2.5 text-[var(--text-primary)] font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-600" />
            <span className="tracking-tight text-[var(--text-primary)] text-sm font-sans">
              Deterministic Revenue Infrastructure for Venture-Backed Scaleups ($3M–$30M ARR)
            </span>
          </div>
          <div className="flex items-center space-x-6 text-[var(--text-secondary)] text-xs">
            <span className="flex items-center space-x-1.5">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-700" />
              <span>Inbound SLA: &lt;60s</span>
            </span>
            <span className="hidden sm:inline-block text-[#d6cbbf]">|</span>
            <span className="flex items-center space-x-1.5">
              <Shield className="h-3.5 w-3.5 text-[var(--accent-navy)]" />
              <span>CRM Validation: Governed</span>
            </span>
            <span className="hidden sm:inline-block text-[#d6cbbf]">|</span>
            <span className="text-[var(--text-primary)] font-medium">Series A – C Focus</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-[var(--border-subtle)]">
          {/* Col 1 & 2: Brand & Positioning */}
          <div className="md:col-span-2 space-y-3.5">
            <div className="flex items-center space-x-2.5">
              <img 
                src="/logo.jpg" 
                alt="Equilibrium Inhouse" 
                className="h-8 w-8 rounded-lg object-contain border border-[var(--border-subtle)] shadow-xs" 
              />
              <span className="font-serif text-2xl text-[var(--text-primary)] tracking-tight font-normal">
                eqinhouse
              </span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-sm">
              Equilibrium Inhouse is an end-to-end RevOps systems studio for scaling B2B SaaS companies ($3M–$30M ARR). We build the connected revenue engine behind your sales team—integrating instant lead capture, automated multi-source research, and strict CRM governance so high-intent buyers are engaged in under 60 seconds.
            </p>
            <div className="pt-1 flex items-center space-x-2 text-xs text-[var(--text-secondary)]">
              <span className="px-2.5 py-1 rounded-md bg-white border border-[var(--border-subtle)] font-medium text-[var(--text-primary)]">
                San Francisco &bull; Bangalore &bull; Remote
              </span>
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] mb-4 font-sans">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                  Speed-to-Lead Hub
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                  Productized Sprints
                </Link>
              </li>
              <li>
                <Link to="/stack" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                  Our Tool Belt
                </Link>
              </li>
              <li>
                <Link to="/intake" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                  Book Diagnostic
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Systems */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] mb-4 font-sans">
              Core Capabilities
            </h4>
            <ul className="space-y-2.5 text-sm text-[var(--text-secondary)]">
              <li className="hover:text-[var(--text-primary)] transition-colors">Clay 5-Vendor Waterfalls</li>
              <li className="hover:text-[var(--text-primary)] transition-colors">Sub-60s Webhook Routers</li>
              <li className="hover:text-[var(--text-primary)] transition-colors">HubSpot &amp; Salesforce Locks</li>
              <li className="hover:text-[var(--text-primary)] transition-colors">Slack Real-Time Deal Desks</li>
              <li className="hover:text-[var(--text-primary)] transition-colors">Secret-Shopper Audits</li>
            </ul>
          </div>

          {/* Col 5: Direct Inquiries */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] mb-4 font-sans">
              Direct Inquiries
            </h4>
            <div className="space-y-2.5 text-sm">
              <a
                href="https://www.linkedin.com/company/equilibrium-inhouse"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <span>Follow on LinkedIn</span>
                <ExternalLink className="h-3 w-3 text-[#a89f91]" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <span>Twitter / X (@eqinhouse)</span>
                <ExternalLink className="h-3 w-3 text-[#a89f91]" />
              </a>
              <div className="pt-2">
                <span className="inline-block text-xs font-medium text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  2 Sprint Slots Available for Q3
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-secondary)]">
          <div>
            &copy; {new Date().getFullYear()} eqinhouse.com. All rights reserved. Enterprise GTM Systems Architecture.
          </div>
          <div className="flex items-center space-x-6">
            <span className="hover:text-[var(--text-primary)] cursor-pointer">Confidentiality Agreement</span>
            <span className="hover:text-[var(--text-primary)] cursor-pointer">Security &amp; SOC-2 Posture</span>
            <span className="hover:text-[var(--text-primary)] cursor-pointer">Privacy Policy</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
