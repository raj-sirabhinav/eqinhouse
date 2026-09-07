import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Menu, X, Zap, CheckCircle2, Shield } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Speed-to-Lead Hub', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'Architecture Stack', path: '/stack' },
  ];

  // Close modal on Escape key press and prevent scroll when open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLogoModalOpen) {
        setIsLogoModalOpen(false);
      }
    };

    if (isLogoModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isLogoModalOpen]);

  // Handle Logo click: if on '/', open modal; if elsewhere, route to '/'
  const handleLogoClick = (e: React.MouseEvent) => {
    if (location.pathname === '/') {
      e.preventDefault();
      setIsLogoModalOpen(true);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* =========================================================================
          1. TOP SYSTEMS HEALTH BAR (Live Institutional Telemetry)
         ========================================================================= */}
      <div className="w-full bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E6DFD5] py-1.5 px-4 sm:px-8">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between text-[11px] font-mono text-[#3F3D56]">
          {/* Active status metrics */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <span className="inline-flex items-center gap-1.5 font-semibold text-[#047857] px-2.5 py-0.5 rounded bg-[#047857]/[0.08] border border-[#047857]/25">
              <span className="h-1.5 w-1.5 rounded-full bg-[#059669] animate-pulse" />
              SPEED-TO-LEAD SLA: &lt;60s
            </span>
            <span className="text-[#E6DFD5] hidden sm:inline">//</span>
            <span className="inline-flex items-center gap-1.5 text-[#3F3D56]">
              <Zap className="h-3 w-3 text-[#6366F1]" />
              <span>ENRICHMENT ACCURACY:</span> <strong className="text-[#000000] font-semibold">95%+</strong>
            </span>
            <span className="text-[#E6DFD5] hidden md:inline">//</span>
            <span className="hidden md:inline-flex items-center gap-1 text-[#047857] font-semibold px-2.5 py-0.5 rounded bg-[#047857]/[0.08] border border-[#047857]/25">
              <CheckCircle2 className="h-3 w-3 text-[#047857]" />
              CRM INTEGRITY: 100% GOVERNED
            </span>
          </div>

          {/* Right Protocol Tag */}
          <div className="hidden sm:flex items-center gap-2 text-[10px] text-[#3F3D56]/80 font-semibold">
            <Shield className="h-3 w-3 text-[#6366F1]" />
            <span>ENTERPRISE REVOPS GUARANTEE</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. CLEAN MINIMALIST NAVIGATION BAR
         ========================================================================= */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-2.5">
        <nav className="mx-auto max-w-7xl backdrop-blur-md bg-[#FAF8F5]/90 border border-[#E6DFD5] rounded-xl px-4 sm:px-6 py-2.5 shadow-[0_1px_3px_0_rgba(63,61,86,0.03)] transition-all">
          <div className="flex items-center justify-between">
            
            {/* [eqinhouse logo] */}
            <Link 
              to="/" 
              onClick={handleLogoClick}
              className="flex items-center space-x-3 group cursor-pointer"
              title={location.pathname === '/' ? 'Click to expand emblem' : 'Go to Home'}
            >
              <img 
                src="/logo.jpg" 
                alt="eqinhouse RevOps Systems" 
                className="h-8 w-8 rounded-lg object-contain border border-[#E6DFD5] shadow-xs transition-transform group-hover:scale-105" 
              />
              <div className="flex items-center space-x-2">
                <span className="font-serif text-2xl tracking-tight text-[#000000] font-normal">
                  eqinhouse
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-[#E6DFD5]/40 text-[#3F3D56] border border-[#E6DFD5]">
                  RevOps Systems
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={`relative px-3.5 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'text-[#000000] font-semibold bg-[#E6DFD5]/50'
                        : 'text-[#3F3D56] hover:text-[#000000] hover:bg-[#E6DFD5]/25'
                    }`}
                  >
                    {link.label}
                  </NavLink>
                );
              })}
            </div>

            {/* Right Action CTA: Book Diagnostic (Primary CTA button #6366F1) */}
            <div className="hidden sm:flex items-center space-x-3">
              <Link
                to="/intake"
                className="inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-medium text-white bg-[#6366F1] hover:bg-[#4F46E5] rounded-lg transition-colors shadow-sm group active:scale-98"
              >
                <span>Book Diagnostic</span>
                <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <Link
                to="/intake"
                className="px-3 py-1.5 text-xs font-medium text-white bg-[#6366F1] hover:bg-[#4F46E5] rounded-lg shadow-xs"
              >
                Book Diagnostic
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-[#3F3D56] hover:text-[#000000] rounded-lg border border-[#E6DFD5] bg-[#FAF8F5]"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden pt-3 pb-2 border-t border-[#E6DFD5] mt-3 space-y-1"
              >
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      location.pathname === link.path
                        ? 'bg-[#E6DFD5]/50 text-[#000000] font-semibold'
                        : 'text-[#3F3D56] hover:text-[#000000] hover:bg-[#E6DFD5]/25'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-2">
                  <Link
                    to="/intake"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-[#6366F1] text-center"
                  >
                    Book Diagnostic
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </div>

      {/* =========================================================================
          3. EXPANDED LOGO LIGHTBOX MODAL
         ========================================================================= */}
      <AnimatePresence>
        {isLogoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsLogoModalOpen(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0F172A]/75 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 12 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300, duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md sm:max-w-lg rounded-2xl border border-[#E5DDD0] bg-[#FAF8F5] p-8 sm:p-10 shadow-2xl overflow-hidden text-center"
            >
              {/* Subtle blueprint grid overlay texture */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  backgroundImage: `linear-gradient(to right, #3F3D56 1px, transparent 1px), linear-gradient(to bottom, #3F3D56 1px, transparent 1px)`,
                  backgroundSize: '24px 24px',
                }}
              />

              {/* Close Button ("×") */}
              <button
                onClick={() => setIsLogoModalOpen(false)}
                aria-label="Close modal"
                className="absolute top-4 right-4 z-20 h-9 w-9 rounded-xl border border-[#E5DDD0] bg-white/80 hover:bg-white text-[#3F3D56] hover:text-[#000000] flex items-center justify-center transition-all shadow-xs active:scale-95 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="relative z-10 flex flex-col items-center space-y-6">
                {/* Enlarged Company Emblem */}
                <div className="relative p-3.5 rounded-2xl bg-white border border-[#E5DDD0] shadow-md">
                  <img 
                    src="/logo.jpg" 
                    alt="Equilibrium Inhouse eqinhouse" 
                    className="h-28 w-28 sm:h-36 sm:w-36 rounded-xl object-contain" 
                  />
                  <div className="absolute -bottom-2.5 -right-2.5 px-2 py-0.5 rounded-md bg-[#0F172A] text-[10px] font-mono font-semibold text-white tracking-widest border border-slate-700 shadow-xs">
                    EMBLEM
                  </div>
                </div>

                {/* Typography: [Equilibrium Inhouse] eqinhouse */}
                <div className="space-y-1.5">
                  <div className="text-xs font-mono tracking-widest text-[#6366F1] font-semibold">
                    [Equilibrium Inhouse]
                  </div>
                  <h3 className="font-serif text-4xl sm:text-5xl text-[#000000] font-normal tracking-tight leading-none">
                    eqinhouse
                  </h3>
                  <div className="text-xs font-sans text-[#3F3D56] font-medium pt-0.5">
                    Institutional Architecture &bull; RevOps Systems
                  </div>
                </div>

                {/* Sub-text badge below the expanded logo */}
                <div className="w-full pt-4 border-t border-[#E6DFD5]">
                  <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#E5DDD0] text-[10px] sm:text-[11px] font-mono font-semibold text-[#0F172A] shadow-xs">
                    <span className="h-2 w-2 rounded-full bg-[#059669] animate-pulse"></span>
                    <span>EQINHOUSE REVOPS SYSTEMS // DETERMINISTIC REVENUE INFRASTRUCTURE</span>
                  </div>
                </div>

                {/* Micro CAD telemetry footer */}
                <div className="w-full pt-1 flex items-center justify-between text-[10px] font-mono text-[#3F3D56]/60">
                  <span>DATUM: [0,0] &bull; ARCH_GRID: 24mm</span>
                  <span>PRESS [ESC] TO CLOSE</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
