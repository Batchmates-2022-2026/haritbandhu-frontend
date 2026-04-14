import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { soilTypes } from '@/data/appData';
import { soilService } from '@/services/soilService';

export default function SoilHealth() {
  const { t } = useLanguage();
  const [selectedSoil, setSelectedSoil] = useState<string | null>(null);
  const [formData, setFormData] = useState({ nitrogen: '', phosphorus: '', potassium: '', ph: '', organic: '' });
  const [result, setResult] = useState<{ status?: string; tips?: string[]; recommendation?: string; suitable_crops?: string[]; deficiencies?: string[]; amendments?: string[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const soil = soilTypes.find(s => s.name === selectedSoil);

  const analyzeManual = async () => {
    setLoading(true);
    setError(null);
    try {
      // ── REAL API: POST /soil/analyze ──────────────────────────────
      const response = await soilService.analyzeSoil({
        nitrogen: parseFloat(formData.nitrogen) || 0,
        phosporous: parseFloat(formData.phosphorus) || 0,   // note: backend key is "phosporous"
        potassium: parseFloat(formData.potassium) || 0,
        ph: parseFloat(formData.ph) || 7,
        organic: parseFloat(formData.organic) || 0,
      });
      setResult({
        status: 'API Result',
        recommendation: response.recommendation,
        suitable_crops: response.suitable_crops,
        deficiencies: response.deficiencies,
        amendments: response.amendments,
        tips: [
          response.recommendation,
          ...(response.suitable_crops?.length ? [`Suitable crops: ${response.suitable_crops.join(', ')}`] : []),
          ...(response.deficiencies?.length ? [`Deficiencies: ${response.deficiencies.join(', ')}`] : []),
          ...(response.amendments?.length ? [`Amendments: ${response.amendments.join(', ')}`] : []),
        ].filter(Boolean) as string[],
      });
    } catch (err: any) {
      console.error('Soil analyze error:', err);
      // Fallback to local analysis
      const ph = parseFloat(formData.ph);
      const n = parseFloat(formData.nitrogen);
      let status = 'Good';
      const tips: string[] = [];
      if (ph < 6) { status = 'Acidic'; tips.push('Add lime to increase pH'); }
      else if (ph > 8) { status = 'Alkaline'; tips.push('Add gypsum to reduce pH'); }
      if (n < 200) tips.push('Add nitrogen-rich fertilizers (Urea)');
      if (parseFloat(formData.phosphorus) < 15) tips.push('Add DAP or SSP for phosphorus');
      if (parseFloat(formData.potassium) < 150) tips.push('Add MOP (Muriate of Potash)');
      if (parseFloat(formData.organic) < 0.5) tips.push('Add vermicompost or green manure');
      if (tips.length === 0) tips.push('Your soil is healthy! Maintain with organic practices.');
      setResult({ status, tips });
      setError('Backend unavailable — showing local analysis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="soil" className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 text-xs font-bold text-primary uppercase tracking-wider mb-4">
            🧪 Analysis
          </span>
          <h2 className="text-3xl font-display font-bold text-foreground">{t.soilHealth}</h2>
        </div>

        {error && (
          <div className="mb-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 text-sm text-yellow-400 text-center">⚠️ {error}</div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">Select Soil Type</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {soilTypes.map(s => (
                <button key={s.name} onClick={() => setSelectedSoil(s.name)}
                  className={`glass-card p-3 rounded-xl text-center transition-all ${selectedSoil === s.name ? 'border-primary bg-primary/10' : ''}`}>
                  <div className="w-8 h-8 rounded-full mx-auto mb-2" style={{ backgroundColor: s.color }} />
                  <div className="text-xs font-bold text-foreground">{s.name}</div>
                  <div className="text-[10px] text-muted-foreground">{s.nameHi}</div>
                </button>
              ))}
            </div>

            {soil && (
              <div className="glass rounded-xl p-4 animate-fade-in">
                <h4 className="font-bold text-foreground text-sm mb-2">{soil.name} ({soil.nameHi})</h4>
                <p className="text-xs text-muted-foreground mb-2">pH Range: {soil.ph}</p>
                <p className="text-xs text-muted-foreground">Best Crops: {soil.crops.join(', ')}</p>
              </div>
            )}

            <div className="glass rounded-xl p-4 space-y-3">
              <h4 className="font-bold text-foreground text-sm">Soil Analysis — Enter Values</h4>
              {[
                { key: 'nitrogen', label: 'Nitrogen (N) kg/ha', placeholder: '0-500' },
                { key: 'phosphorus', label: 'Phosphorus (P) kg/ha', placeholder: '0-100' },
                { key: 'potassium', label: 'Potassium (K) kg/ha', placeholder: '0-500' },
                { key: 'ph', label: 'pH Level', placeholder: '0-14' },
                { key: 'organic', label: 'Organic Carbon %', placeholder: '0-5' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs text-muted-foreground">{f.label}</label>
                  <input type="number" placeholder={f.placeholder}
                    value={formData[f.key as keyof typeof formData]}
                    onChange={e => setFormData(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary mt-1" />
                </div>
              ))}
              <button onClick={analyzeManual} disabled={loading}
                className="w-full bg-primary text-primary-foreground font-bold py-2.5 rounded-xl text-sm hover:opacity-90 disabled:opacity-50">
                {loading ? '🔄 Analyzing...' : '🧪 Analyze Soil'}
              </button>
            </div>
          </div>

          <div>
            {result ? (
              <div className="glass rounded-2xl p-6 animate-fade-in-up">
                <h3 className="text-lg font-bold text-foreground mb-4">🧪 Soil Analysis Result</h3>
                <div className={`text-2xl font-bold mb-4 ${result.status === 'Good' || result.status === 'API Result' ? 'text-primary' : 'text-warning'}`}>
                  {result.status === 'Good' || result.status === 'API Result' ? '✅' : '⚠️'} {result.status}
                </div>
                {result.suitable_crops && (
                  <div className="mb-3 p-3 rounded-xl bg-primary/5 border border-primary/10">
                    <p className="text-xs font-bold text-primary mb-1">🌱 Suitable Crops</p>
                    <p className="text-sm text-foreground/80">{result.suitable_crops.join(', ')}</p>
                  </div>
                )}
                {result.deficiencies && result.deficiencies.length > 0 && (
                  <div className="mb-3 p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
                    <p className="text-xs font-bold text-yellow-400 mb-1">⚠️ Deficiencies Found</p>
                    <p className="text-sm text-foreground/80">{result.deficiencies.join(', ')}</p>
                  </div>
                )}
                {result.amendments && result.amendments.length > 0 && (
                  <div className="mb-4 p-3 rounded-xl bg-secondary/30">
                    <p className="text-xs font-bold text-muted-foreground mb-1">🧪 Amendments</p>
                    <p className="text-sm text-foreground/80">{result.amendments.join(', ')}</p>
                  </div>
                )}
                {result.tips && (
                  <ul className="space-y-2">
                    {result.tips.map((tip, i) => tip && (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                        <span className="text-primary mt-0.5">→</span> {tip}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <div className="glass rounded-2xl p-6 text-center text-muted-foreground">
                <div className="text-4xl mb-3">🧪</div>
                <p className="text-sm">Enter your soil test values and click Analyze to get AI recommendations from your backend.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
