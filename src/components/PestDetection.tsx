import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { pestDatabase } from '@/data/appData';
import { pestService } from '@/services/pestService';

export default function PestDetection() {
  const { t } = useLanguage();
  const [detectionResult, setDetectionResult] = useState<{ pest?: string; confidence?: number; disease?: string; description?: string } | null>(null);
  const [treatmentResult, setTreatmentResult] = useState<{ treatment?: string; pesticide?: string; organic?: string; prevention?: string } | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  // For local simulate buttons still (offline demo)
  const [selectedPest, setSelectedPest] = useState<string | null>(null);
  const pest = selectedPest ? pestDatabase[selectedPest] : null;

  useEffect(() => {
    if (detectionResult || pest) {
      setShowResult(false);
      const timer = setTimeout(() => setShowResult(true), 50);
      return () => clearTimeout(timer);
    }
  }, [detectionResult, pest]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setError(null);
    setDetectionResult(null);
    setTreatmentResult(null);
    setSelectedPest(null);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    try {
      // ── REAL API: POST /pest/detect ────────────────────────────────
      const detection = await pestService.detectPest(file);
      setDetectionResult(detection);

      // Auto-chain: get treatment if pest name returned
      if (detection.pest) {
        const treatment = await pestService.getTreatment({ pest: detection.pest });
        setTreatmentResult(treatment);
      }
    } catch (err: any) {
      console.error('Pest detect error:', err);
      setError('Could not reach the pest detection API. Make sure your backend is running.');
      // Fallback to local simulation
      const pests = Object.keys(pestDatabase);
      setSelectedPest(pests[Math.floor(Math.random() * pests.length)]);
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

  const handleCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch { setShowCamera(false); }
  };

  const capturePhoto = async () => {
    if (!videoRef.current) return;
    setIsAnalyzing(true);
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    setImagePreview(canvas.toDataURL());
    const stream = videoRef.current.srcObject as MediaStream;
    stream?.getTracks().forEach(t => t.stop());
    setShowCamera(false);

    // Convert canvas to file and send
    canvas.toBlob(async (blob) => {
      if (!blob) { setIsAnalyzing(false); return; }
      const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
      try {
        const detection = await pestService.detectPest(file);
        setDetectionResult(detection);
        if (detection.pest) {
          const treatment = await pestService.getTreatment({ pest: detection.pest });
          setTreatmentResult(treatment);
        }
      } catch {
        const pests = Object.keys(pestDatabase);
        setSelectedPest(pests[Math.floor(Math.random() * pests.length)]);
      } finally {
        setIsAnalyzing(false);
      }
    }, 'image/jpeg');
  };

  const handleSelectPest = (key: string) => {
    setSelectedPest(key);
    setDetectionResult(null);
    setTreatmentResult(null);
    setImagePreview(null);
  };

  // Determine what to render in results panel
  const apiPestName = detectionResult?.pest ?? detectionResult?.disease;
  const apiConfidence = detectionResult?.confidence;
  const apiTreatment = treatmentResult?.treatment ?? treatmentResult?.organic;

  return (
    <section id="pest" className="py-16 px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse-glow animation-delay-1000" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-10 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 text-xs font-bold text-primary uppercase tracking-wider mb-4 animate-scale-in">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-ping-glow" /> AI Detection
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">{t.pestDetection}</h2>
          <p className="text-muted-foreground mt-2 text-sm">Upload a photo or take a picture to identify pests instantly</p>
        </div>

        {error && (
          <div className="mb-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 text-sm text-yellow-400 text-center">
            ⚠️ {error} — Showing demo result below.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload */}
          <div className="space-y-4 animate-fade-in-left">
            <div
              className={`glass rounded-2xl p-6 min-h-[280px] flex items-center justify-center cursor-pointer border-2 border-dashed transition-all duration-300 group
                ${imagePreview ? 'border-primary/40 hover:border-primary/60' : 'border-primary/30 hover:border-primary/60 hover:bg-primary/5'}
                ${isUploading ? 'opacity-60 pointer-events-none' : ''}`}
              onClick={() => fileRef.current?.click()}
            >
              {isUploading || isAnalyzing ? (
                <div className="text-center animate-pulse">
                  <div className="text-4xl mb-2 animate-spin-slow">⏳</div>
                  <p className="text-sm text-primary">Analyzing with AI...</p>
                  <div className="w-16 h-1 bg-primary/20 rounded-full mt-3 mx-auto overflow-hidden">
                    <div className="h-full bg-primary rounded-full animate-loading-bar" />
                  </div>
                </div>
              ) : imagePreview ? (
                <img src={imagePreview} alt="Uploaded" className="max-h-64 rounded-xl object-contain animate-scale-in transition-transform duration-300 group-hover:scale-105" />
              ) : (
                <div className="text-center text-muted-foreground transition-all duration-300 group-hover:scale-105">
                  <div className="text-5xl mb-3 animate-bounce-subtle">📷</div>
                  <p className="text-sm font-medium">Click to upload or drag & drop</p>
                  <p className="text-xs mt-1 opacity-60">Supports JPG, PNG, WEBP</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />

            <div className="flex gap-3">
              <button onClick={handleCamera} className="flex-1 bg-secondary text-secondary-foreground font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 hover:opacity-80 transition-all duration-300 hover:scale-105">
                📸 {t.takePhoto}
              </button>
              <button onClick={() => fileRef.current?.click()} className="flex-1 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:scale-105">
                🔍 {t.analyzeImage}
              </button>
            </div>

            <div className="animate-fade-in-up animation-delay-300">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-bold flex items-center gap-2">
                <span className="w-1 h-1 bg-primary rounded-full" /> {t.simulatePest}
              </p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(pestDatabase).map(([key, p], idx) => (
                  <button key={key} onClick={() => handleSelectPest(key)}
                    className={`text-sm px-3 py-1.5 rounded-full border transition-all duration-300 hover:scale-105
                      ${selectedPest === key ? 'bg-primary/20 border-primary text-primary shadow-md shadow-primary/20' : 'border-border text-muted-foreground hover:border-primary/40 hover:bg-primary/5'}`}
                    style={{ animationDelay: `${idx * 50}ms` }}>
                    {p.emoji} {p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="glass rounded-2xl p-6 animate-fade-in-right relative overflow-hidden">
            {(isAnalyzing || isUploading) && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center animate-fade-in">
                <div className="text-5xl mb-3 animate-spin-slow">🔍</div>
                <p className="text-primary font-semibold">AI Analyzing Image...</p>
                <div className="w-32 h-1 bg-primary/20 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-primary rounded-full animate-loading-bar" />
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-lg animate-pulse-glow">🌾</div>
              <div>
                <h3 className="font-bold text-foreground">AI Analysis Results</h3>
                <p className="text-xs text-primary flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-ping-glow" /> Powered by Spring Boot + Gemini
                </p>
              </div>
            </div>

            {/* API result */}
            {apiPestName && !pest && (
              <div className={`space-y-4 transition-all duration-500 ${showResult ? 'animate-fade-in-up' : 'opacity-0'}`}>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10">
                  <span className="text-4xl">🐛</span>
                  <div>
                    <h4 className="text-xl font-bold text-foreground">{apiPestName}</h4>
                    <p className="text-xs text-primary">Pest Identified via Backend API</p>
                  </div>
                </div>
                {apiConfidence !== undefined && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{t.confidenceScore}</span>
                      <span className="text-primary font-bold">{apiConfidence}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all duration-1000" style={{ width: `${apiConfidence}%` }} />
                    </div>
                  </div>
                )}
                {detectionResult?.description && (
                  <p className="text-sm text-foreground/80 leading-relaxed">{detectionResult.description}</p>
                )}
                {apiTreatment && (
                  <div>
                    <h5 className="text-sm font-bold text-primary flex items-center gap-1 mb-2">🌿 {t.treatmentRec}</h5>
                    <p className="text-sm text-foreground/80 leading-relaxed">{apiTreatment}</p>
                  </div>
                )}
                {treatmentResult?.pesticide && (
                  <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                    <p className="text-xs text-yellow-400 font-bold mb-1">💊 Pesticide Recommendation</p>
                    <p className="text-sm text-foreground/80">{treatmentResult.pesticide}</p>
                  </div>
                )}
              </div>
            )}

            {/* Offline/local simulation result */}
            {pest && !apiPestName && (
              <div className={`space-y-4 transition-all duration-500 ${showResult ? 'animate-fade-in-up' : 'opacity-0'}`}>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10">
                  <span className="text-4xl animate-bounce-subtle">{pest.emoji}</span>
                  <div>
                    <h4 className="text-xl font-bold text-foreground">{pest.name}</h4>
                    <p className="text-xs text-yellow-400">⚠️ Demo result (API unavailable)</p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{t.confidenceScore}</span>
                    <span className="text-primary font-bold animate-pulse">{pest.confidence}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all duration-1000" style={{ width: `${pest.confidence}%` }} />
                  </div>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">{pest.message}</p>
                <div>
                  <h5 className="text-xs font-bold text-warning flex items-center gap-1 mb-2">⚠️ Symptoms Detected</h5>
                  <div className="flex flex-wrap gap-2">
                    {pest.symptoms.map(s => (
                      <span key={s} className="text-xs bg-warning/10 text-warning border border-warning/30 px-3 py-1 rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="text-sm font-bold text-primary flex items-center gap-1 mb-2">🌿 {t.treatmentRec}</h5>
                  <ul className="space-y-1.5">
                    {pest.treatments.map(tr => (
                      <li key={tr} className="text-sm text-foreground/80 flex items-start gap-2">
                        <span className="text-primary mt-0.5">→</span> {tr}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {!apiPestName && !pest && (
              <div className="text-center text-muted-foreground py-12 animate-fade-in">
                <div className="text-5xl mb-3 animate-float">🔬</div>
                <p className="text-sm font-medium">Upload an image or select a pest to analyze</p>
                <p className="text-xs mt-1 opacity-60">Our AI will identify the pest and provide treatment</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showCamera && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="glass rounded-2xl p-4 max-w-md w-full space-y-4 animate-scale-in">
            <video ref={videoRef} autoPlay playsInline className="w-full rounded-xl shadow-2xl" />
            <div className="flex gap-3">
              <button onClick={capturePhoto} className="flex-1 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-bold py-3 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
                📸 Capture
              </button>
              <button onClick={() => { setShowCamera(false); const s = videoRef.current?.srcObject as MediaStream; s?.getTracks().forEach(t => t.stop()); }}
                className="flex-1 bg-secondary text-secondary-foreground py-3 rounded-xl">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
