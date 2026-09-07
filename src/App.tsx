import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BackgroundEffects } from './components/BackgroundEffects';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { StackPage } from './pages/StackPage';
import { IntakePage } from './pages/IntakePage';

// Scroll to top helper & document title sync on route navigation
const RouteWatcher: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Equilibrium Inhouse';
  }, [pathname]);
  return null;
};

// Animated route wrapper with subtle enterprise transition
const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="w-full flex-1"
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/stack" element={<StackPage />} />
          <Route path="/intake" element={<IntakePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

export function App() {
  return (
    <BrowserRouter>
      <RouteWatcher />
      <div className="relative min-h-screen flex flex-col bg-[var(--bg-canvas)] text-[var(--text-primary)] selection:bg-[var(--accent-navy)] selection:text-[#f9f8f6]">
        {/* Subtle architectural background texture */}
        <BackgroundEffects />

        {/* Sticky top navigation */}
        <Navbar />

        {/* Dynamic page content */}
        <main className="flex-1 w-full relative z-10">
          <AnimatedRoutes />
        </main>

        {/* Global architectural footer */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
