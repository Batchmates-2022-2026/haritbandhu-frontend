import { useLanguage } from '@/contexts/LanguageContext';
import { languageOptions } from '@/data/translations';
import { useNavigate } from 'react-router-dom';
import logo from '@/assets/logo.png';

export default function LanguageSelect() {
  const { setLang } = useLanguage();
  const navigate = useNavigate();

  const handleSelect = (code: typeof languageOptions[number]['code']) => {
    setLang(code);
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative" style={{ background: 'var(--gradient-dark)' }}>
      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="animate-fade-in-up w-full max-w-md text-center relative z-10">
        {/* Back to home */}
        <button onClick={() => navigate('/')} className="absolute -top-12 left-0 text-sm text-white/40 hover:text-white/70 transition-colors flex items-center gap-1">
          ← Back
        </button>

        <img src={logo} alt="HaritBandhu" className="w-20 h-20 mx-auto mb-6 rounded-2xl object-contain animate-pulse-glow" />
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
          <span className="text-green-grad">HaritBandhu</span>
        </h1>
        <p className="text-muted-foreground mb-3 text-sm">Your Smart Farming Partner</p>
        <p className="text-lg font-semibold text-foreground mb-8">Choose your language / अपनी भाषा चुनें</p>

        <div className="grid grid-cols-2 gap-3">
          {languageOptions.map((lang, i) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className="glass-card p-5 text-center cursor-pointer border border-border rounded-2xl hover:border-primary/50 hover:scale-105 transition-all animate-fade-in-up group"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <span className="text-3xl block mb-2 group-hover:scale-110 transition-transform">{lang.flag}</span>
              <span className="text-foreground font-bold text-sm block">{lang.nativeName}</span>
              <span className="text-muted-foreground text-xs">{lang.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
