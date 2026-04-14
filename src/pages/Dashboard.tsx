import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import PestDetection from '@/components/PestDetection';
import AIChat from '@/components/AIChat';
import WeatherSection from '@/components/WeatherSection';
import MarketPrices from '@/components/MarketPrices';
import Schemes from '@/components/Schemes';
import SoilHealth from '@/components/SoilHealth';
import CropSelection from '@/components/Cropselection';
import Community from '@/components/community';
import { useState, useEffect } from 'react';
import { requestPermissionAndGetToken, saveFCMTokenToBackend } from '@/firebaseMessaging';

export default function Dashboard() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Register FCM token with backend on dashboard load
  useEffect(() => {
    requestPermissionAndGetToken().then((token) => {
      if (token) {
        const jwt = localStorage.getItem('hb_jwt') || '';
        saveFCMTokenToBackend(token, jwt);
      }
    });
  }, []);

  useEffect(() => {
    const handler = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <PestDetection />
      <AIChat />
      <WeatherSection />
      <MarketPrices />
      <Schemes />
       <SoilHealth />
       <CropSelection />
      <Community/>
     

      <footer className="py-8 text-center border-t border-border/30">
        <p className="text-sm text-muted-foreground">© 2026 <span className="text-green-grad font-bold">HaritBandhu</span> — Your Smart Farming Partner</p>
      </footer>

      {showScrollTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center text-lg shadow-lg hover:opacity-90 transition-all z-50 animate-scale-in">
          ↑
        </button>
      )}
    </div>
  );
}
