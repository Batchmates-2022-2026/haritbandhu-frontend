import React, { useState, useMemo, useEffect } from 'react';
import { cropService } from '@/services/cropService';

interface Crop {
  id: string; name: string; nameHi: string; emoji: string;
  season: 'Rabi' | 'Kharif' | 'Zaid' | string;
  sowingTime: string; harvestTime: string;
  waterNeeds: 'Low' | 'Medium' | 'High' | string;
  soilType: string; tempRange: string; regions: string; yield: string;
  tips: string[]; bestFor: string;
}

// Local fallback — used if API is unavailable
const LOCAL_CROPS: Crop[] = [
  { id: 'wheat', name: 'Wheat', nameHi: 'गेहूं', emoji: '🌾', season: 'Rabi', sowingTime: 'Oct – Nov', harvestTime: 'Mar – Apr', waterNeeds: 'Medium', soilType: 'Loamy, Well-drained', tempRange: '10 – 25°C', regions: 'Punjab, Haryana, UP, MP', yield: '3 – 6 t/ha', tips: ['Apply basal N:P:K before sowing', 'Irrigate at crown root initiation stage', 'Watch for rust disease post-flowering'], bestFor: 'Flat fertile plains with cool winters' },
  { id: 'rice', name: 'Rice', nameHi: 'चावल', emoji: '🍚', season: 'Kharif', sowingTime: 'Jun – Jul', harvestTime: 'Nov – Dec', waterNeeds: 'High', soilType: 'Clay loam, Waterlogged tolerant', tempRange: '20 – 35°C', regions: 'West Bengal, UP, Bihar, Tamil Nadu', yield: '2 – 5 t/ha', tips: ['Transplant seedlings at 20–25 days', 'Maintain 2–5 cm standing water', 'Drain field 15 days before harvest'], bestFor: 'High-rainfall regions with clayey soil' },
  { id: 'maize', name: 'Maize', nameHi: 'मक्का', emoji: '🌽', season: 'Kharif', sowingTime: 'Jun – Jul', harvestTime: 'Sep – Oct', waterNeeds: 'Medium', soilType: 'Well-drained Sandy loam', tempRange: '21 – 27°C', regions: 'Karnataka, AP, Maharashtra, MP', yield: '2 – 4 t/ha', tips: ['Ensure proper spacing: 60×20 cm', 'Apply nitrogen in splits', 'Control fall armyworm early'], bestFor: 'Warm regions with moderate rainfall' },
  { id: 'mustard', name: 'Mustard', nameHi: 'सरसों', emoji: '🌼', season: 'Rabi', sowingTime: 'Oct – Nov', harvestTime: 'Feb – Mar', waterNeeds: 'Low', soilType: 'Sandy loam, Loamy', tempRange: '10 – 25°C', regions: 'Rajasthan, Haryana, MP, UP', yield: '1 – 2 t/ha', tips: ['Thin plants to 15 cm after emergence', 'Apply sulphur for better oil content', 'One irrigation at flowering is critical'], bestFor: 'Dry regions with short cool winters' },
  { id: 'chickpea', name: 'Chickpea', nameHi: 'चना', emoji: '🫘', season: 'Rabi', sowingTime: 'Oct – Nov', harvestTime: 'Feb – Mar', waterNeeds: 'Low', soilType: 'Sandy loam to Clay loam', tempRange: '15 – 30°C', regions: 'MP, Rajasthan, Maharashtra, UP', yield: '1.5 – 2.5 t/ha', tips: ['Treat seeds with Rhizobium', 'Avoid waterlogging', 'Monitor for Helicoverpa pod borer'], bestFor: 'Dryland farming on residual moisture' },
  { id: 'sugarcane', name: 'Sugarcane', nameHi: 'गन्ना', emoji: '🎋', season: 'Zaid', sowingTime: 'Feb – Mar', harvestTime: 'Nov – Feb', waterNeeds: 'High', soilType: 'Deep loamy, Rich in organic matter', tempRange: '24 – 35°C', regions: 'UP, Maharashtra, Karnataka, Tamil Nadu', yield: '60 – 100 t/ha', tips: ['Use disease-free setts', 'Earthing up at 90 and 120 DAS', 'Avoid early harvesting for better sugar recovery'], bestFor: 'Long growing season with ample water supply' },
  { id: 'soybean', name: 'Soybean', nameHi: 'सोयाबीन', emoji: '🫛', season: 'Kharif', sowingTime: 'Jun – Jul', harvestTime: 'Sep – Oct', waterNeeds: 'Medium', soilType: 'Well-drained Loamy', tempRange: '25 – 30°C', regions: 'MP, Maharashtra, Rajasthan', yield: '1.5 – 2.5 t/ha', tips: ['Inoculate seeds with Bradyrhizobium', 'Keep row spacing at 45 cm', 'Control yellow mosaic virus via whitefly management'], bestFor: 'Deccan plateau with black cotton soil' },
  { id: 'cotton', name: 'Cotton', nameHi: 'कपास', emoji: '🌿', season: 'Kharif', sowingTime: 'May – Jun', harvestTime: 'Oct – Jan', waterNeeds: 'Medium', soilType: 'Deep Black (Vertisols)', tempRange: '21 – 30°C', regions: 'Gujarat, Maharashtra, Telangana, Punjab', yield: '1.5 – 2.5 t/ha (lint)', tips: ['Choose Bt varieties for bollworm management', 'Topping at 90 DAS improves boll development', 'Monitor for pink bollworm in late season'], bestFor: 'Black cotton soil belt in peninsular India' },
];

// Map API response → Crop shape
function mapApiCrop(item: any, idx: number): Crop {
  return {
    id: item.id ?? String(idx),
    name: item.name ?? 'Unknown',
    nameHi: item.nameHi ?? item.localName ?? '',
    emoji: item.emoji ?? '🌱',
    season: item.season ?? 'Kharif',
    sowingTime: item.sowingTime ?? item.sowing_time ?? '—',
    harvestTime: item.harvestTime ?? item.harvest_time ?? '—',
    waterNeeds: item.waterRequirement ?? item.waterNeeds ?? 'Medium',
    soilType: item.soilType ?? item.soil_type ?? '—',
    tempRange: item.tempRange ?? item.temperature ?? '—',
    regions: item.regions ?? item.region ?? '—',
    yield: item.yield ?? item.yieldPerHa ?? '—',
    tips: item.tips ?? (item.description ? [item.description] : ['Consult local agronomist for best practices.']),
    bestFor: item.bestFor ?? item.description ?? '',
  };
}

const seasonColors = {
  Rabi:  { bg: 'rgba(56,189,248,0.12)',  text: '#38bdf8', label: '❄️ Rabi' },
  Kharif:{ bg: 'rgba(34,197,94,0.12)',   text: '#4ade80', label: '🌧️ Kharif' },
  Zaid:  { bg: 'rgba(251,191,36,0.12)',  text: '#fbbf24', label: '☀️ Zaid' },
};
const waterColors = { Low: { bar: '#4ade80', fill: 1 }, Medium: { bar: '#fbbf24', fill: 2 }, High: { bar: '#38bdf8', fill: 3 } };
const SEASONS = ['All', 'Rabi', 'Kharif', 'Zaid'];

export default function CropSelection() {
  const [crops, setCrops] = useState<Crop[]>(LOCAL_CROPS);
  const [apiMode, setApiMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeSeason, setActiveSeason] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(LOCAL_CROPS[0]);
  const [activeTab, setActiveTab] = useState<'details' | 'tips'>('details');

  // ── Fetch from API ────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchCrops = async () => {
      setLoading(true);
      try {
        // GET /crop/filter?season=Kharif  etc.
        const [kharif, rabi, zaid] = await Promise.allSettled([
          cropService.getCrops('Kharif'),
          cropService.getCrops('Rabi'),
          cropService.getCrops('Zaid'),
        ]);
        const all: Crop[] = [];
        [kharif, rabi, zaid].forEach((r, si) => {
          if (r.status === 'fulfilled' && Array.isArray(r.value) && r.value.length > 0) {
            r.value.forEach((item, i) => all.push(mapApiCrop(item, si * 100 + i)));
            setApiMode(true);
          }
        });
        if (all.length > 0) {
          setCrops(all);
          setSelectedCrop(all[0]);
        }
      } catch { /* use local fallback */ }
      finally { setLoading(false); }
    };
    fetchCrops();
  }, []);

  // Also search by keyword when user types
  useEffect(() => {
    if (!search || !apiMode) return;
    const timer = setTimeout(async () => {
      try {
        const results = await cropService.getCrops(activeSeason === 'All' ? undefined : activeSeason, search);
        if (Array.isArray(results) && results.length > 0) setCrops(results.map(mapApiCrop));
      } catch { /* keep current */ }
    }, 600);
    return () => clearTimeout(timer);
  }, [search, activeSeason, apiMode]);

  const filtered = useMemo(() =>
    crops.filter(c =>
      (activeSeason === 'All' || c.season === activeSeason) &&
      (c.name.toLowerCase().includes(search.toLowerCase()) ||
       c.nameHi.includes(search) ||
       c.regions.toLowerCase().includes(search.toLowerCase()))
    ), [crops, search, activeSeason]);

  const card = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)' } as React.CSSProperties;
  const sc = selectedCrop ? (seasonColors[selectedCrop.season as keyof typeof seasonColors] ?? seasonColors.Kharif) : null;
  const wc = selectedCrop ? (waterColors[selectedCrop.waterNeeds as keyof typeof waterColors] ?? waterColors.Medium) : null;

  return (
    <div className="min-h-screen py-10 px-4 relative overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div aria-hidden className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #22c55e 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full opacity-8" style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-1">Crop Selection 🌱</h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {apiMode ? `Live data via GET /crop/filter — ${crops.length} crops loaded` : `${crops.length} crops with agronomic guidance`}
          </p>
        </div>

        {/* Search + Season Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input className="flex-1 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
            placeholder="🔍  Search by crop, Hindi name, or region..."
            value={search} onChange={e => setSearch(e.target.value)} />
          <div className="flex gap-1.5">
            {SEASONS.map(s => (
              <button key={s} onClick={() => setActiveSeason(s)}
                className="px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap"
                style={activeSeason === s
                  ? { background: 'rgba(34,197,94,0.15)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.4)' }
                  : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {s === 'Rabi' ? '❄️' : s === 'Kharif' ? '🌧️' : s === 'Zaid' ? '☀️' : '🌍'} {s}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="text-center py-12" style={{ color: 'rgba(255,255,255,0.4)' }}>
            <p className="text-4xl mb-2 animate-pulse">🌱</p>
            <p className="text-sm">Loading crops from backend...</p>
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* Crop List */}
            <div className="lg:col-span-2 rounded-2xl overflow-hidden" style={card}>
              <div className="px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)' }}>
                {filtered.length} crop{filtered.length !== 1 ? 's' : ''} {apiMode ? '(from API)' : '(demo)'}
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: '560px' }}>
                {filtered.length === 0 && (
                  <div className="text-center py-16" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    <p className="text-3xl mb-2">🌾</p><p className="text-sm">No crops match your search.</p>
                  </div>
                )}
                {filtered.map(crop => {
                  const s = seasonColors[crop.season as keyof typeof seasonColors] ?? seasonColors.Kharif;
                  const isActive = selectedCrop?.id === crop.id;
                  return (
                    <button key={crop.id} onClick={() => { setSelectedCrop(crop); setActiveTab('details'); }}
                      className="w-full text-left px-4 py-3.5 flex items-center gap-3 transition-all duration-200"
                      style={{ background: isActive ? 'rgba(34,197,94,0.10)' : 'transparent', borderLeft: isActive ? '3px solid #22c55e' : '3px solid transparent', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <span className="text-2xl shrink-0">{crop.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate" style={{ color: isActive ? 'white' : 'rgba(255,255,255,0.75)' }}>
                          {crop.name}
                          {crop.nameHi && <span className="ml-1.5 text-xs font-normal" style={{ color: 'rgba(255,255,255,0.35)' }}>{crop.nameHi}</span>}
                        </p>
                        <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{crop.regions.split(',')[0]?.trim()}</p>
                      </div>
                      <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: s.bg, color: s.text }}>{crop.season}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Detail Panel */}
            <div className="lg:col-span-3">
              {!selectedCrop ? (
                <div className="h-full flex items-center justify-center rounded-2xl" style={card}>
                  <div className="text-center" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    <p className="text-5xl mb-3">🌱</p><p className="text-sm">Select a crop to see details</p>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl overflow-hidden" style={card}>
                  {/* Hero */}
                  <div className="relative p-6 pb-4" style={{ background: `linear-gradient(135deg, ${sc?.bg?.replace('0.12', '0.2')}, rgba(0,0,0,0.2))` }}>
                    <div className="absolute top-4 right-4 text-6xl opacity-20 select-none">{selectedCrop.emoji}</div>
                    <div className="flex items-start gap-4 relative">
                      <span className="text-4xl">{selectedCrop.emoji}</span>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h2 className="text-2xl font-bold text-white">{selectedCrop.name}</h2>
                          {selectedCrop.nameHi && <span className="text-base" style={{ color: 'rgba(255,255,255,0.4)' }}>{selectedCrop.nameHi}</span>}
                        </div>
                        {selectedCrop.bestFor && <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>{selectedCrop.bestFor}</p>}
                        <div className="flex gap-2 flex-wrap">
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold" style={{ background: sc?.bg, color: sc?.text, border: `1px solid ${sc?.text}33` }}>{sc?.label}</span>
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.10)' }}>📍 {selectedCrop.regions}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {(['details', 'tips'] as const).map(tab => (
                      <button key={tab} onClick={() => setActiveTab(tab)}
                        className="flex-1 py-3 text-sm font-semibold capitalize transition-all"
                        style={activeTab === tab ? { color: '#4ade80', borderBottom: '2px solid #22c55e' } : { color: 'rgba(255,255,255,0.35)', borderBottom: '2px solid transparent' }}>
                        {tab === 'details' ? '📋 Details' : '💡 Expert Tips'}
                      </button>
                    ))}
                  </div>

                  <div className="p-5">
                    {activeTab === 'details' && (
                      <>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          {[
                            { label: 'Sowing Time', val: selectedCrop.sowingTime, icon: '🗓️' },
                            { label: 'Harvest Time', val: selectedCrop.harvestTime, icon: '🌾' },
                            { label: 'Temperature', val: selectedCrop.tempRange, icon: '🌡️' },
                            { label: 'Soil Type', val: selectedCrop.soilType, icon: '🪨' },
                            { label: 'Regions', val: selectedCrop.regions, icon: '📍' },
                            { label: 'Average Yield', val: selectedCrop.yield, icon: '📦' },
                          ].map(item => (
                            <div key={item.label} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                              <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>{item.icon} {item.label}</p>
                              <p className="text-sm font-medium text-white">{item.val}</p>
                            </div>
                          ))}
                        </div>
                        <div className="p-3.5 rounded-xl mb-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>💧 Water Requirements</p>
                            <p className="text-xs font-bold" style={{ color: wc?.bar }}>{selectedCrop.waterNeeds}</p>
                          </div>
                          <div className="flex gap-1.5">
                            {[1, 2, 3].map(i => (
                              <div key={i} className="h-2 flex-1 rounded-full" style={{ background: i <= (wc?.fill ?? 2) ? wc?.bar : 'rgba(255,255,255,0.08)' }} />
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                    {activeTab === 'tips' && (
                      <div className="space-y-3">
                        <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>Expert agronomic tips for growing {selectedCrop.name} successfully:</p>
                        {selectedCrop.tips.map((tip, i) => (
                          <div key={i} className="flex gap-3 p-3.5 rounded-xl" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.12)' }}>
                            <span className="w-6 h-6 rounded-full text-xs font-bold shrink-0 flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.2)', color: '#4ade80' }}>{i + 1}</span>
                            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>{tip}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    <button className="mt-5 w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                      style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)', color: 'white', boxShadow: '0 4px 20px rgba(34,197,94,0.25)' }}>
                      🤖 Get AI Personalised Tips for {selectedCrop.name}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
