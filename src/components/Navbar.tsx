import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { languageOptions } from '@/data/translations';
import logo from '@/assets/logo.png';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { t, lang, setLang } = useLanguage();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const navLinks = isAdmin
    ? [{ label: t.adminDashboard, href: '/admin' }]
    : [
        { label: t.home, href: '/dashboard' },
        { label: t.profile, href: '/profile' },
      ];

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const sectionLinks = isAdmin ? [] : [
    { label: t.pestDetection, id: 'pest' },
    { label: t.aiChat, id: 'chat' },
    { label: t.marketPrices, id: 'market' },
    { label: t.schemes, id: 'schemes' },
    { label: t.soilHealth, id: 'soil' },
    { label: t.weather, id: 'weather' },
  ];

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border/30">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to={isAdmin ? '/admin' : '/dashboard'} className="flex items-center gap-2">
          <img src={logo} alt="HaritBandhu" className="w-8 h-8 rounded-lg object-contain" />
          <span className="text-lg font-bold text-green-grad font-display">HaritBandhu</span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map(l => (
            <Link key={l.href} to={l.href} className="text-sm text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg hover:bg-secondary/50 transition-colors">{l.label}</Link>
          ))}
          {sectionLinks.map(l => (
            <button key={l.id} onClick={() => scrollTo(l.id)} className="text-sm text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg hover:bg-secondary/50 transition-colors">{l.label}</button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select value={lang} onChange={e => setLang(e.target.value as typeof lang)}
            className="bg-secondary/50 border border-border rounded-lg text-xs text-foreground px-2 py-1.5 outline-none">
            {languageOptions.map(l => <option key={l.code} value={l.code}>{l.flag} {l.nativeName}</option>)}
          </select>
          {user && (
            <>
              <span className="text-xs text-muted-foreground hidden sm:inline">👋 {user.username}</span>
              <button onClick={handleLogout} className="text-xs bg-destructive/20 text-destructive px-3 py-1.5 rounded-lg hover:bg-destructive/30">{t.logout}</button>
            </>
          )}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-foreground text-xl">☰</button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden glass border-t border-border/30 p-4 space-y-1 animate-slide-in">
          {navLinks.map(l => (
            <Link key={l.href} to={l.href} onClick={() => setMobileOpen(false)} className="block text-sm text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg">{l.label}</Link>
          ))}
          {sectionLinks.map(l => (
            <button key={l.id} onClick={() => scrollTo(l.id)} className="block w-full text-left text-sm text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg">{l.label}</button>
          ))}
        </div>
      )}
    </nav>
  );
}
