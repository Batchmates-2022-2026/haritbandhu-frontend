import { useState, useMemo, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { marketPriceService } from '@/services/marketPriceService';

// ── Local fallback data (used if API is down) ─────────────────────────────────
const FALLBACK_DATA = [
  { id: 1, name: 'Wheat (Sharbati)', nameHi: 'गेहूं (शरबती)', emoji: '🌾', price: 2450, prev: 2400, trend: 'up', market: 'Delhi NCR', state: 'Delhi', type: 'wheat', season: 'Rabi' },
  { id: 2, name: 'Wheat (Lokwan)',    nameHi: 'गेहूं (लोकवान)',  emoji: '🌾', price: 2325, prev: 2350, trend: 'down', market: 'Punjab Mandi', state: 'Punjab', type: 'wheat', season: 'Rabi' },
  { id: 3, name: 'Basmati Rice',      nameHi: 'बासमती चावल',    emoji: '🍚', price: 6250, prev: 6300, trend: 'down', market: 'Delhi NCR', state: 'Delhi', type: 'rice', season: 'Kharif' },
  { id: 4, name: 'Non-Basmati Rice',  nameHi: 'साधारण चावल',   emoji: '🍚', price: 2850, prev: 2800, trend: 'up', market: 'West Bengal Mandi', state: 'West Bengal', type: 'rice', season: 'Kharif' },
  { id: 5, name: 'Yellow Corn',       nameHi: 'पीला मक्का',     emoji: '🌽', price: 2150, prev: 2100, trend: 'up', market: 'Karnataka Mandi', state: 'Karnataka', type: 'corn', season: 'Kharif' },
  { id: 6, name: 'Arhar Dal (Tur)',   nameHi: 'अरहर दाल',       emoji: '🫘', price: 8750, prev: 8800, trend: 'down', market: 'MP Mandi', state: 'Madhya Pradesh', type: 'pulses', season: 'Kharif' },
  { id: 7, name: 'Moong Dal',         nameHi: 'मूंग दाल',       emoji: '🫘', price: 7250, prev: 7150, trend: 'up', market: 'Rajasthan Mandi', state: 'Rajasthan', type: 'pulses', season: 'Zaid' },
  { id: 8, name: 'Tomato',            nameHi: 'टमाटर',          emoji: '🍅', price: 2450, prev: 2200, trend: 'up', market: 'Maharashtra Mandi', state: 'Maharashtra', type: 'vegetables', season: 'Year Round' },
  { id: 9, name: 'Onion',             nameHi: 'प्याज',          emoji: '🧅', price: 1850, prev: 1950, trend: 'down', market: 'Nashik Mandi', state: 'Maharashtra', type: 'vegetables', season: 'Rabi' },
  { id: 10, name: 'Potato',           nameHi: 'आलू',            emoji: '🥔', price: 1650, prev: 1700, trend: 'down', market: 'UP Mandi', state: 'UP', type: 'vegetables', season: 'Rabi' },
  { id: 11, name: 'Mustard',          nameHi: 'सरसों',          emoji: '🌼', price: 5400, prev: 5350, trend: 'up', market: 'Punjab Mandi', state: 'Punjab', type: 'oilseeds', season: 'Rabi' },
  { id: 12, name: 'Cotton',           nameHi: 'कपास',           emoji: '🌿', price: 6250, prev: 6300, trend: 'down', market: 'Gujarat Mandi', state: 'Gujarat', type: 'cotton', season: 'Kharif' },
  { id: 13, name: 'Sugarcane',        nameHi: 'गन्ना',          emoji: '🎋', price: 3650, prev: 3600, trend: 'up', market: 'UP Mandi', state: 'UP', type: 'sugarcane', season: 'Year Round' },
  { id: 14, name: 'Soybean',          nameHi: 'सोयाबीन',        emoji: '🫛', price: 4200, prev: 4150, trend: 'up', market: 'MP Mandi', state: 'Madhya Pradesh', type: 'oilseeds', season: 'Kharif' },
  { id: 15, name: 'Apple',            nameHi: 'सेब',            emoji: '🍎', price: 8500, prev: 8200, trend: 'up', market: 'Himachal Mandi', state: 'Himachal Pradesh', type: 'fruits', season: 'Autumn' },
];

// Map API response → display shape
function mapApiItem(item: any, idx: number) {
  const price = item.modalPrice ?? item.maxPrice ?? item.price ?? 0;
  const prev  = item.minPrice  ?? item.prev ?? price - 50;
  return {
    id: item.id ?? idx,
    name: item.crop ?? item.name ?? 'Unknown',
    nameHi: item.nameHi ?? '',
    emoji: item.emoji ?? '🌾',
    price,
    prev,
    trend: price >= prev ? 'up' : 'down',
    market: item.market ?? item.state ?? '—',
    state: item.state ?? '—',
    type: item.type ?? 'other',
    season: item.season ?? '—',
  };
}

const cropTypes = [
  { value: 'all', label: 'All Crops', icon: '🌾' },
  { value: 'wheat', label: 'Wheat', icon: '🌾' },
  { value: 'rice', label: 'Rice', icon: '🍚' },
  { value: 'corn', label: 'Corn', icon: '🌽' },
  { value: 'pulses', label: 'Pulses', icon: '🫘' },
  { value: 'vegetables', label: 'Vegetables', icon: '🥬' },
  { value: 'fruits', label: 'Fruits', icon: '🍎' },
  { value: 'oilseeds', label: 'Oilseeds', icon: '🌼' },
  { value: 'cotton', label: 'Cotton', icon: '🌿' },
  { value: 'sugarcane', label: 'Sugarcane', icon: '🎋' },
];

// Popular crops to fetch from API  (matches Postman: mustard, wheat, rice etc)
const API_CROPS = ['mustard', 'wheat', 'rice', 'maize', 'tomato', 'onion', 'potato', 'soybean', 'cotton', 'sugarcane'];

export default function MarketPrices() {
  const { t } = useLanguage();
  const [allData, setAllData] = useState(FALLBACK_DATA);
  const [apiMode, setApiMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedState, setSelectedState] = useState('All States');
  const [sortBy, setSortBy] = useState('default');
  const [showFilters, setShowFilters] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [animateCards, setAnimateCards] = useState(false);

  // ── Fetch from API on mount ──────────────────────────────────────────────
  const fetchAllPrices = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch multiple crops in parallel: GET /market-price/:crop
      const results = await Promise.allSettled(
        API_CROPS.map(crop => marketPriceService.getPrice(crop))
      );
      const apiItems: any[] = [];
      results.forEach((r, i) => {
        if (r.status === 'fulfilled') {
          const data = r.value;
          const items = Array.isArray(data) ? data : [data];
          items.forEach((item, j) => {
            if (item && (item.crop || item.name || item.price)) {
              apiItems.push(mapApiItem({ ...item, crop: item.crop ?? API_CROPS[i] }, i * 10 + j));
            }
          });
        }
      });
      if (apiItems.length > 0) {
        setAllData(apiItems);
        setApiMode(true);
      }
      setLastUpdated(new Date());
    } catch (e) {
      // use fallback
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllPrices();
    const interval = setInterval(() => {
      setAnimateCards(true);
      setTimeout(() => setAnimateCards(false), 500);
      setLastUpdated(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchAllPrices]);

  const availableStates = useMemo(() =>
    ['All States', ...new Set(allData.map(i => i.state).filter(Boolean))], [allData]);

  const filtered = useMemo(() => {
    let data = [...allData];
    if (searchQuery) data = data.filter(i =>
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.nameHi.includes(searchQuery) ||
      i.market.toLowerCase().includes(searchQuery.toLowerCase()));
    if (selectedState !== 'All States') data = data.filter(i => i.state === selectedState);
    if (selectedType !== 'all') data = data.filter(i => i.type === selectedType);
    switch (sortBy) {
      case 'price_high': data.sort((a, b) => b.price - a.price); break;
      case 'price_low':  data.sort((a, b) => a.price - b.price); break;
      case 'trend_up':   data = data.filter(i => i.trend === 'up'); break;
      case 'trend_down': data = data.filter(i => i.trend === 'down'); break;
    }
    return data;
  }, [allData, searchQuery, selectedState, selectedType, sortBy]);

  const stats = useMemo(() => ({
    total: filtered.length,
    avg: filtered.reduce((s, i) => s + i.price, 0) / (filtered.length || 1),
    up: filtered.filter(i => i.trend === 'up').length,
  }), [filtered]);

  return (
    <section id="market" className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 text-xs font-bold text-primary uppercase tracking-wider mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            {apiMode ? 'Live Mandi Prices — Backend API' : 'Market Prices (Demo Data)'}
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">{t.marketPrices}</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            {apiMode ? 'Real-time data from your Spring Boot backend · /market-price/:crop' : 'Backend unavailable — showing demo prices'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { emoji: '🌾', val: stats.total, label: 'Crops Available' },
            { emoji: '💰', val: `₹${stats.avg.toFixed(0)}`, label: 'Avg Price/quintal' },
            { emoji: '📈', val: stats.up, label: 'Trending Up', color: 'text-green-500' },
          ].map(s => (
            <div key={s.label} className="glass-card rounded-xl p-4 text-center">
              <div className="text-2xl mb-1">{s.emoji}</div>
              <div className={`text-2xl font-bold ${s.color ?? 'text-foreground'}`}>{s.val}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-3 mb-3">
            <div className="flex-1 relative">
              <input type="text" placeholder="🔍 Search crops, mandi, or state..."
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-primary" />
              {searchQuery && <button onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">✖</button>}
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-5 py-3 bg-secondary/50 rounded-xl text-sm font-medium hover:bg-secondary">
              ⚙️ Filters {showFilters ? '▲' : '▼'}
            </button>
            <button onClick={() => { setLoading(true); fetchAllPrices(); }}
              className="flex items-center gap-2 px-5 py-3 bg-primary/10 border border-primary/30 rounded-xl text-sm font-medium hover:bg-primary/20 text-primary">
              🔄 Refresh
            </button>
          </div>

          {showFilters && (
            <div className="space-y-4 pt-4 border-t border-border/30">
              {/* Crop type */}
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-2 block">🌱 Crop Category</label>
                <div className="flex flex-wrap gap-2">
                  {cropTypes.map(ct => (
                    <button key={ct.value} onClick={() => setSelectedType(ct.value)}
                      className={`px-3 py-1.5 rounded-full text-xs border transition-all ${selectedType === ct.value ? 'bg-primary text-primary-foreground border-transparent' : 'border-border/50 bg-secondary/30 hover:bg-secondary/50'}`}>
                      {ct.icon} {ct.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* State */}
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-2 block">📍 State / Mandi</label>
                <div className="flex flex-wrap gap-2">
                  {availableStates.map(st => (
                    <button key={st} onClick={() => setSelectedState(st)}
                      className={`px-3 py-1.5 rounded-full text-xs border transition-all ${selectedState === st ? 'bg-primary text-primary-foreground border-transparent' : 'border-border/50 bg-secondary/30 hover:bg-secondary/50'}`}>
                      {st}
                    </button>
                  ))}
                </div>
              </div>
              {/* Sort */}
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-2 block">📊 Sort By</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'default', label: 'Default' },
                    { value: 'price_high', label: 'Price: High → Low' },
                    { value: 'price_low', label: 'Price: Low → High' },
                    { value: 'trend_up', label: 'Trending Up ↑' },
                    { value: 'trend_down', label: 'Trending Down ↓' },
                  ].map(o => (
                    <button key={o.value} onClick={() => setSortBy(o.value)}
                      className={`px-3 py-1.5 rounded-full text-xs border transition-all ${sortBy === o.value ? 'bg-primary text-primary-foreground border-transparent' : 'border-border/50 bg-secondary/30 hover:bg-secondary/50'}`}>
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results bar */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-bold text-primary">{filtered.length}</span> results
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-16">
            <div className="text-4xl mb-3 animate-pulse">📊</div>
            <p className="text-muted-foreground text-sm">Fetching mandi prices from backend...</p>
          </div>
        )}

        {/* Cards */}
        {!loading && (
          filtered.length === 0 ? (
            <div className="text-center py-16 glass-card rounded-2xl">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No crops found</h3>
              <p className="text-muted-foreground text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((item, idx) => {
                const change = item.price - item.prev;
                const pct = ((Math.abs(change) / (item.prev || 1)) * 100).toFixed(1);
                const isUp = item.trend === 'up';
                return (
                  <div key={`${item.id}-${idx}`}
                    className={`glass-card rounded-xl p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:border-primary/40 ${animateCards ? 'scale-[1.01]' : ''}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{item.emoji}</span>
                        <div>
                          <div className="font-bold text-foreground text-sm">{item.name}</div>
                          {item.nameHi && <div className="text-xs text-muted-foreground">{item.nameHi}</div>}
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-1 rounded-full bg-white/5 border border-white/10">{item.season}</span>
                    </div>
                    <div className="mb-2">
                      <div className="text-2xl font-bold text-foreground">
                        ₹{item.price.toLocaleString()}<span className="text-xs text-muted-foreground font-normal ml-1">/qtl</span>
                      </div>
                      <div className={`text-xs font-bold mt-1 flex items-center gap-1 ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                        {isUp ? '↑' : '↓'} ₹{Math.abs(change)} ({pct}%)
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/30">
                      <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <span>📍</span> {item.market}
                      </div>
                      <div className="flex items-center gap-1 text-[10px]">
                        <span className={`w-1.5 h-1.5 rounded-full ${isUp ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span className="text-muted-foreground">{isUp ? 'Rising' : 'Falling'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

        <div className="text-center mt-8 text-xs text-muted-foreground">
          <p>Prices sourced from backend via <code className="bg-secondary/50 px-1 rounded">GET /market-price/:crop</code></p>
          <p className="mt-1">📞 For accurate prices, contact your local mandi or use our AI Assistant</p>
        </div>
      </div>
    </section>
  );
}
