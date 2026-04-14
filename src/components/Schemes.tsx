import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { schemesData } from '@/data/appData';
import { schemesService } from '@/services/schemesService';

// Map API response → display shape
function mapApiScheme(item: any) {
  return {
    name: item.name ?? item.title ?? 'Unknown Scheme',
    full: item.full ?? item.subtitle ?? item.category ?? '',
    desc: item.description ?? item.desc ?? '',
    benefit: item.benefits ?? item.benefit ?? 'Available',
    emoji: item.emoji ?? '🏛️',
    link: item.applicationLink ?? item.link ?? '#',
  };
}

const CATEGORIES = ['FARMER', 'agriculture', 'livestock', 'irrigation', 'credit'];

export default function Schemes() {
  const { t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScheme, setSelectedScheme] = useState<any | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [allSchemes, setAllSchemes] = useState(schemesData);
  const [apiMode, setApiMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('FARMER');

  // ── Fetch from API ────────────────────────────────────────────────────────
  const fetchSchemes = useCallback(async (category: string) => {
    setLoading(true);
    try {
      // GET /schemes?category=FARMER  (and others)
      const data = await schemesService.getSchemes(category);
      if (Array.isArray(data) && data.length > 0) {
        setAllSchemes(data.map(mapApiScheme));
        setApiMode(true);
      }
    } catch {
      // fallback to local schemesData
      setAllSchemes(schemesData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSchemes(activeCategory); }, [fetchSchemes, activeCategory]);

  const filteredSchemes = useMemo(() => {
    if (!searchQuery.trim()) return allSchemes;
    const q = searchQuery.toLowerCase();
    return allSchemes.filter(s =>
      s.name.toLowerCase().includes(q) ||
      (s.full ?? '').toLowerCase().includes(q) ||
      (s.desc ?? '').toLowerCase().includes(q) ||
      (s.benefit ?? '').toLowerCase().includes(q)
    );
  }, [allSchemes, searchQuery]);

  const displaySchemes = useMemo(() =>
    filteredSchemes.length === 0 ? [] : [...filteredSchemes, ...filteredSchemes, ...filteredSchemes],
    [filteredSchemes]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || filteredSchemes.length === 0) return;
    let animId: number;
    let last = 0;
    const scroll = (ts: number) => {
      if (!last) last = ts;
      const elapsed = ts - last;
      if (!isPaused && el && elapsed > 16) {
        if (el.scrollLeft >= el.scrollWidth / 3 * 2) el.scrollLeft -= el.scrollWidth / 3;
        else if (el.scrollLeft <= 0) el.scrollLeft = el.scrollWidth / 3;
        el.scrollLeft += 0.8;
        last = ts;
      }
      animId = requestAnimationFrame(scroll);
    };
    if (el.scrollLeft === 0) el.scrollLeft = el.scrollWidth / 3;
    animId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animId);
  }, [isPaused, filteredSchemes.length]);

  const getBenefitColor = (benefit: string) => {
    if (!benefit) return 'bg-primary/20 text-primary border-primary/40';
    if (benefit.includes('₹') || benefit.toLowerCase().includes('subsid')) return 'bg-green-500/20 text-green-400 border-green-500/40';
    if (benefit.toLowerCase().includes('loan') || benefit.toLowerCase().includes('credit')) return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
    if (benefit.toLowerCase().includes('insur')) return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
    return 'bg-primary/20 text-primary border-primary/40';
  };

  const highlight = (text: string) => {
    if (!searchQuery.trim() || !text) return text;
    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((p, i) => regex.test(p)
      ? <mark key={i} className="bg-primary/30 text-primary-foreground px-0.5 rounded">{p}</mark>
      : p);
  };

  return (
    <section id="schemes" className="py-16 px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl animate-pulse-glow" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 text-xs font-bold text-primary uppercase tracking-wider mb-4">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
            🏛 {apiMode ? 'Government Schemes — Backend API' : 'Government Schemes (Demo)'}
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">{t.schemes}</h2>
          <p className="text-sm text-muted-foreground mt-2">
            {apiMode ? `Live data via GET /schemes?category=${activeCategory}` : 'Backend unavailable — showing demo schemes'}
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${activeCategory === cat ? 'bg-primary text-primary-foreground border-transparent' : 'border-border/50 bg-secondary/30 text-muted-foreground hover:bg-secondary/50'}`}>
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-6">
          <div className="relative">
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search schemes by name, benefit..."
              className="w-full pl-10 pr-10 py-3 rounded-xl bg-background/50 border border-border/50 focus:border-primary/50 outline-none transition-all text-foreground placeholder:text-muted-foreground" />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">🔍</span>
            {searchQuery && <button onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary">✕</button>}
          </div>
          {searchQuery && <p className="text-xs text-center text-muted-foreground mt-2">Found {filteredSchemes.length} scheme{filteredSchemes.length !== 1 ? 's' : ''}</p>}
        </div>

        {/* Pause / scroll control */}
        {filteredSchemes.length > 0 && (
          <div className="flex justify-end mb-3">
            <button onClick={() => setIsPaused(!isPaused)}
              className={`p-2 rounded-full transition-all hover:scale-110 ${isPaused ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-muted-foreground'}`}>
              {isPaused ? '▶️' : '⏸️'}
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-4xl mb-3 animate-pulse">🏛️</div>
            <p className="text-muted-foreground text-sm">Fetching schemes from backend...</p>
          </div>
        )}

        {/* Carousel */}
        {!loading && filteredSchemes.length > 0 && (
          <div ref={scrollRef}
            onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}
            className="flex gap-5 overflow-x-auto pb-6 cursor-grab active:cursor-grabbing"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {displaySchemes.map((scheme, idx) => (
              <div key={`${scheme.name}-${idx}`}
                className={`group relative flex-shrink-0 w-80 transition-all duration-500 cursor-pointer rounded-2xl p-5 backdrop-blur-xl border
                  ${selectedScheme?.name === scheme.name
                    ? 'border-primary shadow-2xl shadow-primary/30 scale-105 bg-gradient-to-br from-primary/15 to-transparent'
                    : 'border-border/40 hover:border-primary/40 hover:scale-[1.02] bg-background/30'}`}
                onClick={() => setSelectedScheme(selectedScheme?.name === scheme.name ? null : scheme)}>

                <div className="flex items-start justify-between mb-3">
                  <div className="text-4xl mb-2 transition-all group-hover:scale-110 group-hover:rotate-6">{scheme.emoji}</div>
                  <span className={`text-xs px-2 py-1 rounded-full border ${getBenefitColor(scheme.benefit)}`}>
                    {highlight(scheme.benefit)}
                  </span>
                </div>

                <h3 className="font-bold text-foreground text-base mb-1">{highlight(scheme.name)}</h3>
                {scheme.full && <p className="text-xs text-primary/80 mb-2 font-medium">{highlight(scheme.full)}</p>}
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 group-hover:line-clamp-3">
                  {highlight(scheme.desc)}
                </p>

                {selectedScheme?.name === scheme.name && (
                  <div className="mt-3 pt-3 border-t border-border/40 space-y-1">
                    <div className="flex items-start gap-2 text-xs"><span className="text-primary">📋</span><span className="text-foreground/80">Eligibility: All registered farmers</span></div>
                    <div className="flex items-start gap-2 text-xs"><span className="text-primary">📍</span><span className="text-foreground/80">Available across all states</span></div>
                  </div>
                )}

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/30">
                  <span className="text-xs text-muted-foreground">🏛️ Central Govt</span>
                  <a href={scheme.link} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                    className="text-xs text-primary hover:text-primary/80 flex items-center gap-1">
                    Apply Now <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredSchemes.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No schemes found</h3>
            <button onClick={() => setSearchQuery('')} className="mt-4 px-4 py-2 rounded-lg bg-primary/10 text-primary">Clear search</button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          {[
            { emoji: '📋', val: `${filteredSchemes.length}+`, label: 'Active Schemes' },
            { emoji: '👨‍🌾', val: '10M+', label: 'Beneficiaries' },
            { emoji: '💰', val: '₹25K Cr', label: 'Total Allocation' },
            { emoji: '⭐', val: '4.8', label: 'Rating' },
          ].map(s => (
            <div key={s.label} className="glass rounded-xl p-3 text-center hover:scale-105 transition-all">
              <div className="text-2xl mb-1">{s.emoji}</div>
              <div className="text-lg font-bold text-primary">{s.val}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
