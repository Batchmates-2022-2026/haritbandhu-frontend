import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '@/assets/logo.png';

/* ─── Reveal-on-scroll hook ─── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function RevealBox({ children, className = '', dir = 'up', delay = 0 }: { children: React.ReactNode; className?: string; dir?: 'up' | 'left' | 'right'; delay?: number }) {
  const { ref, visible } = useReveal();
  const base = 'transition-all duration-700 ease-out';
  const hidden = dir === 'up' ? 'opacity-0 translate-y-10' : dir === 'left' ? 'opacity-0 -translate-x-12' : 'opacity-0 translate-x-12';
  return (
    <div ref={ref} className={`${base} ${visible ? 'opacity-100 translate-x-0 translate-y-0' : hidden} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ─── Floating particles background ─── */
function Particles() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 12}s`,
    duration: `${8 + Math.random() * 10}s`,
    size: `${4 + Math.random() * 8}px`,
    opacity: 0.15 + Math.random() * 0.25,
  }));
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map(p => (
        <div key={p.id} className="absolute rounded-full bg-green-400" style={{ left: p.left, bottom: '-20px', width: p.size, height: p.size, opacity: p.opacity, animation: `particleFloat ${p.duration} ${p.delay} linear infinite` }} />
      ))}
    </div>
  );
}

const FEATURES = [
  { icon: '🔬', title: 'AI Pest Detection', desc: 'Upload a photo of your crop and get instant AI-powered pest identification with treatment plans.' },
  { icon: '🤖', title: 'Smart AI Chat', desc: 'Ask farming questions in your language. Get expert-level answers about crops, soil, and more.' },
  { icon: '🌦️', title: 'Weather Forecasts', desc: 'Hyperlocal weather alerts tailored to your farm location so you never get caught off guard.' },
  { icon: '📊', title: 'Market Prices', desc: 'Real-time mandi prices for your crops. Know when and where to sell for maximum profit.' },
  { icon: '🏛️', title: 'Govt Schemes', desc: 'Discover and apply for the latest government agriculture schemes and subsidies.' },
  { icon: '🌱', title: 'Soil Health', desc: 'Monitor your soil NPK, pH, and moisture levels. Get tailored fertilizer recommendations.' },
];

const STEPS = [
  { num: '01', title: 'Choose Language', desc: 'Select your preferred regional language for a fully localized experience.' },
  { num: '02', title: 'Create Account', desc: 'Sign up in 30 seconds with just your name, email, and location.' },
  { num: '03', title: 'Connect Your Farm', desc: 'Enter your crop and location details. Our AI personalizes instantly.' },
  { num: '04', title: 'Start Farming Smart', desc: 'Get real-time insights, alerts, and AI guidance right in your pocket.' },
];

const STATS = [
  { value: '50,000+', label: 'Farmers Helped' },
  { value: '6', label: 'Languages' },
  { value: '95%', label: 'Accuracy' },
  { value: '24/7', label: 'AI Support' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleGetStarted = () => {
    const lang = localStorage.getItem('hb_lang');
    navigate(lang ? '/login' : '/language');
  };

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: 'var(--gradient-dark)' }}>
      <Particles />

      {/* ── NAV ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300 ${scrolled ? 'bg-[hsl(150,60%,3%)/0.97] shadow-2xl py-3' : 'bg-[hsl(150,60%,4%)/0.7] backdrop-blur-xl'} border-b border-white/5`}
        style={{ animation: 'fadeInDown 0.6s ease both' }}>
        <div className="flex items-center gap-3">
          <img src={logo} alt="HaritBandhu" className="w-9 h-9 rounded-xl object-contain" />
          <span className="font-display font-bold text-lg text-green-grad">HaritBandhu</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
          {['Features', 'How It Works', 'About'].map(link => (
            <a key={link} href={`#${link.toLowerCase().replace(' ', '-')}`} className="hover:text-white transition-colors">{link}</a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/login')} className="hidden md:block text-sm text-white/70 hover:text-white transition-colors px-4 py-2">Login</button>
          <button onClick={handleGetStarted} className="text-sm font-bold px-5 py-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-primary/20">
            Get Started →
          </button>
          <button className="md:hidden text-white/70 hover:text-white" onClick={() => setMobileOpen(v => !v)}>
            <span className="text-2xl">{mobileOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </nav>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-[hsl(150,60%,3%)] pt-20 px-6 flex flex-col gap-6 text-lg animate-fade-in">
          {['Features', 'How It Works', 'About'].map(link => (
            <a key={link} href={`#${link.toLowerCase().replace(' ', '-')}`} onClick={() => setMobileOpen(false)} className="text-white/70 hover:text-white py-2 border-b border-white/5">{link}</a>
          ))}
          <button onClick={() => { setMobileOpen(false); navigate('/login'); }} className="text-left text-white/70 hover:text-white py-2 border-b border-white/5">Login</button>
          <button onClick={() => { setMobileOpen(false); handleGetStarted(); }} className="mt-4 w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl">Get Started</button>
        </div>
      )}

      {/* ── HERO ── */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-4">
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold mb-8 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            AI-Powered Smart Farming Platform
          </div>

          <h1 className="font-display font-black text-5xl md:text-7xl lg:text-8xl text-white leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Farm Smarter<br /><span className="text-green-grad">With AI</span>
          </h1>

          <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
            Pest detection, AI crop advisor, live market prices, weather alerts & government schemes — all in your language, all in one app.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <button onClick={handleGetStarted}
              className="group px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-all hover:scale-105 shadow-2xl shadow-primary/30 flex items-center justify-center gap-3">
              Start For Free
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 rounded-2xl glass border border-white/10 text-white/80 font-semibold text-lg hover:border-primary/40 hover:text-white transition-all">
              See Features
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 animate-fade-in-up" style={{ animationDelay: '0.55s' }}>
            {STATS.map(s => (
              <div key={s.label} className="glass rounded-2xl p-4 border border-white/5 hover:border-primary/20 transition-colors">
                <div className="font-display font-black text-3xl text-green-grad mb-1">{s.value}</div>
                <div className="text-white/40 text-xs font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-40">
          <span className="text-xs text-white/40">Scroll</span>
          <div className="w-0.5 h-8 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </section>

      {/* ── MARQUEE STRIP ── */}
      <div className="relative overflow-hidden py-4 border-y border-primary/10 bg-primary/5">
        <div className="flex gap-10 animate-marquee whitespace-nowrap">
          {Array.from({ length: 2 }, (_, i) =>
            ['🌾 Pest Detection', '🤖 AI Chat', '🌦️ Weather Alerts', '📊 Market Prices', '🏛️ Govt Schemes', '🌱 Soil Health', '📱 6 Languages', '✅ Free to Use'].map(item => (
              <span key={`${i}-${item}`} className="text-sm font-semibold text-white/50 px-6">{item}</span>
            ))
          )}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-4 max-w-6xl mx-auto">
        <RevealBox className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Features
          </div>
          <h2 className="font-display font-black text-4xl md:text-5xl text-white mb-4">Everything a Farmer Needs</h2>
          <p className="text-white/40 text-lg max-w-xl mx-auto">One platform. Six powerful tools. All powered by AI.</p>
        </RevealBox>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <RevealBox key={f.title} delay={i * 80} className="glass-card p-6 rounded-2xl border border-white/5 group hover:border-primary/30 transition-all">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform inline-block">{f.icon}</div>
              <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-white/45 text-sm leading-relaxed">{f.desc}</p>
            </RevealBox>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 px-4 bg-black/20">
        <div className="max-w-5xl mx-auto">
          <RevealBox className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Process
            </div>
            <h2 className="font-display font-black text-4xl md:text-5xl text-white mb-4">Up and Running in Minutes</h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">No complicated setup. Just sign up and start farming smarter today.</p>
          </RevealBox>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <RevealBox key={s.num} delay={i * 100} className="relative">
                <div className="glass-card p-6 rounded-2xl border border-white/5 h-full hover:border-primary/30 transition-all">
                  <div className="text-5xl font-display font-black text-primary/20 mb-3">{s.num}</div>
                  <h3 className="text-white font-bold mb-2">{s.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{s.desc}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 text-primary/30 text-xl z-10">→</div>
                )}
              </RevealBox>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT / LANGUAGES ── */}
      <section id="about" className="py-24 px-4 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <RevealBox dir="left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> About Us
            </div>
            <h2 className="font-display font-black text-4xl md:text-5xl text-white mb-6">Built for India's <span className="text-green-grad">160M</span> Farmers</h2>
            <p className="text-white/45 leading-relaxed mb-6">HaritBandhu was created to bridge the technology gap in Indian agriculture. We believe every farmer — regardless of literacy or region — deserves access to cutting-edge AI tools.</p>
            <p className="text-white/45 leading-relaxed">From Kanyakumari to Kashmir, our app speaks your language and understands your crops.</p>
          </RevealBox>
          <RevealBox dir="right">
            <div className="glass rounded-2xl p-6 border border-white/5">
              <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider text-white/50">Supported Languages</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { flag: '🇬🇧', lang: 'English' },
                  { flag: '🇮🇳', lang: 'हिन्दी' },
                  { flag: '🇮🇳', lang: 'मराठी' },
                  { flag: '🇮🇳', lang: 'ગુજરાતી' },
                  { flag: '🇮🇳', lang: 'ಕನ್ನಡ' },
                  { flag: '🇮🇳', lang: 'മലയാളം' },
                ].map(({ flag, lang }) => (
                  <div key={lang} className="flex items-center gap-3 glass-card px-4 py-3 rounded-xl border border-white/5 hover:border-primary/30">
                    <span className="text-2xl">{flag}</span>
                    <span className="text-white font-semibold text-sm">{lang}</span>
                  </div>
                ))}
              </div>
            </div>
          </RevealBox>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="cta" className="py-24 px-4">
        <RevealBox className="max-w-3xl mx-auto text-center glass rounded-3xl p-12 md:p-16 border border-primary/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
          <div className="relative">
            <h2 className="font-display font-black text-4xl md:text-5xl text-white mb-6">Ready to Farm <span className="text-green-grad">Smarter?</span></h2>
            <p className="text-white/50 text-lg mb-10 max-w-md mx-auto">Join thousands of farmers already using HaritBandhu. Free forever.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={handleGetStarted}
                className="px-10 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-all hover:scale-105 shadow-2xl shadow-primary/30">
                Get Started Free →
              </button>
              <button onClick={() => navigate('/login')}
                className="px-10 py-4 rounded-2xl glass border border-white/10 text-white font-semibold text-lg hover:border-primary/40 transition-all">
                Sign In
              </button>
            </div>
          </div>
        </RevealBox>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-12 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="HaritBandhu" className="w-8 h-8 rounded-lg object-contain" />
              <span className="font-display font-bold text-white">HaritBandhu</span>
            </div>
            <p className="text-white/35 text-sm leading-relaxed">AI-powered smart farming for every Indian farmer.</p>
          </div>
          <div>
            <h4 className="text-white/60 text-xs font-bold uppercase tracking-widest mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-white/35">
              {['Pest Detection', 'AI Chat', 'Market Prices', 'Govt Schemes'].map(i => <li key={i}><a href="#features" className="hover:text-white/60 transition-colors">{i}</a></li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-white/60 text-xs font-bold uppercase tracking-widest mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-white/35">
              {['About', 'Blog', 'Careers', 'Contact'].map(i => <li key={i}><a href="#about" className="hover:text-white/60 transition-colors">{i}</a></li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-white/60 text-xs font-bold uppercase tracking-widest mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-white/35">
              {['Help Center', 'Privacy Policy', 'Terms of Service'].map(i => <li key={i}><a href="#" className="hover:text-white/60 transition-colors">{i}</a></li>)}
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-white/25 text-xs">© 2026 HaritBandhu — All rights reserved</p>
          <p className="text-white/25 text-xs">Made with ❤️ for Indian Farmers</p>
        </div>
      </footer>
    </div>
  );
}
