
import React, { Suspense, lazy } from 'react';
import { useSettings, SettingsProvider } from './context/SettingsContext';
import Header from './components/Header';
import Hero from './components/Hero';
import NewsGrid from './components/NewsGrid';
import GameShowcase from './components/GameShowcase';
import DownloadCenter from './components/DownloadCenter';
import SupportForm from './components/SupportForm';
import Footer from './components/Footer';
import { ShieldAlert, Anchor } from 'lucide-react';

// Lazy load heavy administrative components to keep the main bundle light
const AdminLogin = lazy(() => import('./components/AdminLogin'));
const Dashboard = lazy(() => import('./components/Dashboard'));

// Optimized loading screen with refined CSS
const LoadingScreen = () => (
  <div className="fixed inset-0 bg-[#050505] flex flex-col items-center justify-center z-[999]">
    <Anchor className="text-gold animate-bounce mb-4" size={40} />
    <div className="w-24 h-[2px] bg-white/5 overflow-hidden rounded-full">
      <div className="h-full bg-gold animate-[reveal_1.5s_infinite] will-change-transform"></div>
    </div>
  </div>
);

const MaintenanceScreen = () => {
  const { settings, navigateTo } = useSettings();
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mb-6 border border-gold/20">
        <ShieldAlert size={40} className="text-gold animate-pulse" />
      </div>
      <h1 className="text-4xl md:text-5xl font-display font-black text-white uppercase mb-4 tracking-tighter">System Locked</h1>
      <p className="text-slate-500 max-w-md mx-auto font-arabic mb-8" dir="rtl">{settings.maintenanceMessage}</p>
      <button onClick={() => navigateTo('login')} className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-gold transition-colors">
        Access Port
      </button>
    </div>
  );
};

function AppContent() {
  const { currentPage, settings, isAuthenticated, isLoading } = useSettings();

  if (isLoading) return <LoadingScreen />;

  // Protected route handling with Suspense fallback
  if (currentPage === 'login') {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <AdminLogin />
      </Suspense>
    );
  }

  if (currentPage === 'admin') {
    return (
      <Suspense fallback={<LoadingScreen />}>
        {isAuthenticated ? <Dashboard /> : <AdminLogin />}
      </Suspense>
    );
  }

  if (settings.isMaintenanceMode && !isAuthenticated) {
    return <MaintenanceScreen />;
  }

  return (
    <div className="min-h-screen bg-[#050505] selection:bg-gold/30 selection:text-gold overflow-x-hidden">
      <Header />
      <main className="relative">
        <Hero />
        <NewsGrid />
        <GameShowcase />
        <DownloadCenter />
        <SupportForm />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}
