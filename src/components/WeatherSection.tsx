import { useState, useEffect, useCallback, useRef } from 'react';
import { weatherService } from '@/services/weatherService';

interface WeatherInfo {
  temp: number; condition: string; location: string; humidity: number;
  wind: number; feelsLike: number; uvIndex: number; airQuality: string;
  pressure: number; visibility: number; sunrise: string; sunset: string;
  forecast: { day: string; icon: string; high: number; low: number; desc: string; rainChance?: number }[];
}
interface WeatherAlert { title: string; description: string; severity: 'warning' | 'info' | 'danger'; }

const defaultWeather: WeatherInfo = {
  temp: 34, condition: 'Partly Cloudy', location: 'Detecting...', humidity: 72, wind: 14,
  feelsLike: 36, uvIndex: 7, airQuality: 'Moderate', pressure: 1012, visibility: 10,
  sunrise: '6:30 AM', sunset: '6:15 PM',
  forecast: [
    { day: 'Tomorrow', icon: '⛅', high: 35, low: 26, desc: 'Partly cloudy', rainChance: 10 },
    { day: 'Wednesday', icon: '🌧️', high: 31, low: 24, desc: 'Rain likely', rainChance: 70 },
    { day: 'Thursday', icon: '⛈️', high: 29, low: 23, desc: 'Thunderstorm', rainChance: 85 },
    { day: 'Friday', icon: '🌤️', high: 33, low: 25, desc: 'Mostly sunny', rainChance: 20 },
    { day: 'Saturday', icon: '☀️', high: 36, low: 27, desc: 'Clear sky', rainChance: 5 },
  ],
};

const conditionIcons: Record<string, string> = {
  'Sunny': '☀️', 'Clear Night': '🌙', 'Partly Cloudy': '⛅', 'Cloudy': '☁️',
  'Rainy': '🌧️', 'Thunderstorm': '⛈️', 'Clear Evening': '🌆', 'Clear Sky': '✨', 'Haze': '🌫️', 'Mist': '🌫️',
};
const getConditionIcon = (c: string) => conditionIcons[c] ?? '🌤️';
const uvLabel = (uv: number) => {
  if (uv <= 2) return { label: 'Low', color: '#22c55e' };
  if (uv <= 5) return { label: 'Moderate', color: '#eab308' };
  if (uv <= 7) return { label: 'High', color: '#f97316' };
  if (uv <= 10) return { label: 'Very High', color: '#ef4444' };
  return { label: 'Extreme', color: '#a855f7' };
};
const aqiColor: Record<string, string> = { 'Good': '#22c55e', 'Moderate': '#eab308', 'Unhealthy for Sensitive': '#f97316' };

/** Map raw API response fields → WeatherInfo shape */
function mapApiToWeather(data: any, cityName: string): WeatherInfo {
  return {
    location: data.city ?? data.location ?? cityName,
    temp: data.temperature ?? data.temp ?? defaultWeather.temp,
    condition: data.description ?? data.condition ?? 'Partly Cloudy',
    humidity: data.humidity ?? defaultWeather.humidity,
    wind: data.windSpeed ?? data.wind ?? defaultWeather.wind,
    feelsLike: data.feelsLike ?? data.feels_like ?? defaultWeather.feelsLike,
    uvIndex: data.uvIndex ?? data.uv_index ?? defaultWeather.uvIndex,
    airQuality: data.airQuality ?? data.air_quality ?? defaultWeather.airQuality,
    pressure: data.pressure ?? defaultWeather.pressure,
    visibility: data.visibility ?? defaultWeather.visibility,
    sunrise: data.sunrise ?? defaultWeather.sunrise,
    sunset: data.sunset ?? defaultWeather.sunset,
    forecast: data.forecast ?? defaultWeather.forecast,
  };
}

export default function Weather() {
  const [weather, setWeather] = useState<WeatherInfo>(defaultWeather);
  const [locationStr, setLocationStr] = useState('Detecting location...');
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAlert, setShowAlert] = useState<WeatherAlert | null>(null);
  const [temperatureUnit, setTemperatureUnit] = useState<'C' | 'F'>('C');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [apiError, setApiError] = useState(false);
  const notificationIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const convertTemp = (c: number) => temperatureUnit === 'C' ? c : Math.round(c * 9 / 5 + 32);

  const checkForWeatherAlerts = useCallback((w: WeatherInfo) => {
    if (w.temp > 38) setShowAlert({ title: '🔥 Heat Wave Alert', description: 'Extreme heat expected. Stay hydrated.', severity: 'danger' });
    else if (w.humidity > 85) setShowAlert({ title: '💧 High Humidity Alert', description: 'May promote fungal growth in crops.', severity: 'warning' });
    else if (w.forecast.some(f => (f.rainChance ?? 0) > 60)) setShowAlert({ title: '🌧️ Rain Forecast', description: 'High chance of rain. Plan farming activities.', severity: 'info' });
  }, []);

  const fetchWeatherForCity = useCallback(async (city: string) => {
    setIsLoading(true);
    setApiError(false);
    try {
      // ── REAL API: GET /weather/:city ──────────────────────────────
      const data = await weatherService.getWeather(city);
      const mapped = mapApiToWeather(data, city);
      setWeather(mapped);
      setLastUpdated(new Date());
      checkForWeatherAlerts(mapped);
    } catch (err) {
      console.warn('Weather API error, using local simulation:', err);
      setApiError(true);
      // Fallback: local simulation
      const hour = new Date().getHours();
      const rand = Math.random();
      const condition = hour < 6 ? 'Clear Night' : hour < 10 ? 'Sunny' : rand > 0.85 ? 'Rainy' : 'Partly Cloudy';
      const temp = hour < 6 ? 20 : hour < 10 ? 26 : hour < 16 ? 34 : 23;
      const newW: WeatherInfo = { ...defaultWeather, location: city, temp, condition, humidity: Math.round(55 + Math.random() * 30), lastUpdated: new Date() } as any;
      setWeather(newW);
      checkForWeatherAlerts(newW);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [checkForWeatherAlerts]);

  const detectAndFetch = useCallback(async () => {
    if (!('geolocation' in navigator)) { setLocationStr('Kanpur'); fetchWeatherForCity('kanpur'); return; }
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude, longitude } = pos.coords;
        try {
          const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const geoData = await resp.json();
          const city = geoData.address?.city || geoData.address?.town || geoData.address?.village || 'Kanpur';
          setLocationStr(`${city}, ${geoData.address?.state ?? ''}`);
          fetchWeatherForCity(city.toLowerCase());
        } catch {
          setLocationStr('Kanpur');
          fetchWeatherForCity('kanpur');
        }
      },
      () => { setLocationStr('Kanpur'); fetchWeatherForCity('kanpur'); }
    );
  }, [fetchWeatherForCity]);

  useEffect(() => { detectAndFetch(); return () => { if (notificationIntervalRef.current) clearInterval(notificationIntervalRef.current); }; }, []);

  const uvInfo = uvLabel(weather.uvIndex);
  const severityStyles: Record<string, string> = {
    danger: 'border-red-500/60 bg-red-500/10 text-red-300',
    warning: 'border-amber-500/60 bg-amber-500/10 text-amber-300',
    info: 'border-sky-500/60 bg-sky-500/10 text-sky-300',
  };

  const getFarmingTip = () => {
    if (weather.temp > 35) return 'High temperature alert! Water crops early morning or late evening.';
    if (weather.humidity > 80) return 'High humidity may cause fungal diseases. Consider preventive spraying.';
    if (weather.wind > 20) return 'Strong winds expected. Secure loose structures and protect young plants.';
    if (weather.forecast.some(f => (f.rainChance ?? 0) > 60)) return 'Rain expected soon. Plan harvesting before the showers.';
    return 'Optimal conditions for farming. Good time for sowing or routine maintenance.';
  };

  return (
    <section id="weather" className="py-16 px-4 relative overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div aria-hidden className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-[-6rem] right-[-4rem] w-[32rem] h-[32rem] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #38bdf8 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-4rem] left-[-4rem] w-[24rem] h-[24rem] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-4"
            style={{ background: 'rgba(56,189,248,0.12)', border: '1px solid rgba(56,189,248,0.3)', color: '#38bdf8' }}>
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping inline-block" />
            {apiError ? 'Weather (Demo Mode)' : 'Live Weather from Backend'}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Weather &amp; Farm Insights</h2>
          <div className="flex items-center justify-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <span>📍</span><span>{locationStr}</span>
            <button onClick={() => { setIsRefreshing(true); detectAndFetch(); }} title="Refresh"
              className="ml-1 p-1 rounded-full transition-all duration-300 hover:bg-white/10">
              <span className={`text-base ${isRefreshing ? 'animate-spin inline-block' : ''}`}>🔄</span>
            </button>
          </div>
          <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>Last updated: {lastUpdated.toLocaleTimeString()}</p>
        </div>

        {showAlert && (
          <div className={`mb-6 rounded-2xl p-4 border-l-4 flex items-start gap-3 ${severityStyles[showAlert.severity]}`}>
            <span className="text-2xl shrink-0">{showAlert.severity === 'danger' ? '🚨' : showAlert.severity === 'warning' ? '⚠️' : '💡'}</span>
            <div className="flex-1">
              <h3 className="font-bold text-white">{showAlert.title}</h3>
              <p className="text-sm mt-0.5 opacity-80">{showAlert.description}</p>
              <button onClick={() => setShowAlert(null)} className="mt-2 text-xs underline opacity-70 hover:opacity-100">Dismiss</button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Current Weather */}
          <div className={`rounded-2xl p-6 col-span-1 transition-all duration-500 ${isLoading ? 'opacity-50 animate-pulse' : ''}`}
            style={{ background: 'linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(15,30,50,0.9) 100%)', border: '1px solid rgba(56,189,248,0.2)', backdropFilter: 'blur(20px)' }}>
            <div className="text-center">
              <div className="text-7xl mb-3 inline-block" style={{ filter: 'drop-shadow(0 0 24px rgba(255,200,0,0.3))' }}>
                {getConditionIcon(weather.condition)}
              </div>
              <div className="flex items-baseline justify-center gap-2 mb-1">
                <span className="text-6xl font-bold text-white">{convertTemp(weather.temp)}°</span>
                <button onClick={() => setTemperatureUnit(u => u === 'C' ? 'F' : 'C')}
                  className="text-xs px-2 py-1 rounded-lg font-semibold"
                  style={{ background: 'rgba(56,189,248,0.15)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.3)' }}>
                  °{temperatureUnit === 'C' ? 'F' : 'C'}
                </button>
              </div>
              <p className="text-lg font-semibold" style={{ color: '#38bdf8' }}>{weather.condition}</p>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Feels like {convertTemp(weather.feelsLike)}°{temperatureUnit}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-6 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              {[
                { icon: '💧', label: 'Humidity', val: `${weather.humidity}%` },
                { icon: '🌬️', label: 'Wind', val: `${weather.wind} km/h` },
                { icon: '☀️', label: 'UV Index', val: `${weather.uvIndex} (${uvInfo.label})`, color: uvInfo.color },
                { icon: '🌫️', label: 'Air Quality', val: weather.airQuality, color: aqiColor[weather.airQuality] ?? '#fff' },
                { icon: '📊', label: 'Pressure', val: `${weather.pressure} hPa` },
                { icon: '👁️', label: 'Visibility', val: `${weather.visibility} km` },
              ].map(s => (
                <div key={s.label} className="p-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="text-base mb-0.5">{s.icon}</div>
                  <div className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.label}</div>
                  <div className="text-xs font-semibold" style={{ color: s.color ?? 'white' }}>{s.val}</div>
                </div>
              ))}
            </div>
            <button onClick={async () => {
              if (!('Notification' in window)) return;
              const perm = await Notification.requestPermission();
              if (perm === 'granted') { setNotifEnabled(true); new Notification('🎉 Weather Alerts Activated!', { body: 'Daily weather updates enabled.' }); }
            }} disabled={notifEnabled}
              className="mt-5 w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
              style={notifEnabled
                ? { background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.4)', color: '#4ade80' }
                : { background: 'linear-gradient(135deg,#0ea5e9,#22c55e)', color: 'white' }}>
              {notifEnabled ? '🔔 Alerts Active' : '🔕 Enable Daily Alerts'}
            </button>
          </div>

          {/* Farming Tips */}
          <div className="rounded-2xl p-6" style={{ background: 'linear-gradient(135deg,rgba(15,40,20,0.9),rgba(15,30,15,0.9))', border: '1px solid rgba(34,197,94,0.2)', backdropFilter: 'blur(20px)' }}>
            <div className="flex items-center gap-2 mb-5"><span className="text-2xl">🌾</span><h3 className="font-bold text-white text-base">Smart Farming Insights</h3></div>
            <div className="space-y-3">
              {[
                { label: 'Farming Tip', val: getFarmingTip(), color: '#4ade80', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.15)' },
                { label: 'Sunrise / Sunset', val: `🌅 ${weather.sunrise}  |  🌇 ${weather.sunset}`, color: 'rgba(255,255,255,0.8)', bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.07)' },
                { label: 'Irrigation Advice', val: weather.humidity > 75 ? '💧 Reduce irrigation — high humidity risks fungal diseases.' : weather.temp > 32 ? '🚿 Increase irrigation; water early AM or late PM.' : '💦 Maintain regular irrigation schedule.', color: 'rgba(255,255,255,0.8)', bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.07)' },
                { label: 'Pest Alert', val: weather.humidity > 70 && weather.temp > 25 ? '🐛 High risk of pest infestation. Regular monitoring recommended.' : '✅ Low pest risk under current conditions.', color: 'rgba(255,255,255,0.8)', bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.07)' },
              ].map(item => (
                <div key={item.label} className="rounded-xl p-3.5" style={{ background: item.bg, border: `1px solid ${item.border}` }}>
                  <p className="text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: item.color === '#4ade80' ? '#4ade80' : 'rgba(255,255,255,0.4)' }}>{item.label}</p>
                  <p className="text-sm" style={{ color: item.color }}>{item.val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Crop Recommendations */}
          <div className="rounded-2xl p-6" style={{ background: 'linear-gradient(135deg,rgba(25,15,45,0.9),rgba(20,15,40,0.9))', border: '1px solid rgba(168,85,247,0.2)', backdropFilter: 'blur(20px)' }}>
            <div className="flex items-center gap-2 mb-5"><span className="text-2xl">📈</span><h3 className="font-bold text-white text-base">Crop Recommendations</h3></div>
            <div className="space-y-3">
              {[
                { label: 'Temperature Advice', val: weather.temp > 32 ? '🌽 Favour heat-resistant varieties.' : weather.temp < 20 ? '❄️ Protect sensitive crops with mulching.' : '✅ Optimal temperature for most crops.' },
                { label: 'Pressure Trend', val: weather.pressure > 1015 ? '📈 High pressure — stable, dry conditions.' : '📉 Low pressure — possible unsettled weather.' },
                { label: 'Harvest Window', val: weather.forecast.some(f => (f.rainChance ?? 0) > 60) ? '⚡ Harvest before rain arrives in 2–3 days.' : '✅ Clear window for harvesting next 3–4 days.' },
                { label: 'Soil Moisture', val: weather.humidity > 75 ? '💧 Soil likely moist — skip irrigation 1–2 days.' : weather.temp > 32 ? '🏜️ Soil drying fast — check moisture daily.' : '🌱 Moisture levels should be adequate.' },
              ].map(item => (
                <div key={item.label} className="rounded-xl p-3.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <p className="text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{item.label}</p>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>{item.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5-Day Forecast */}
        <div className="mt-8">
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            📅 5-Day Forecast
            <span className="text-xs font-normal" style={{ color: 'rgba(255,255,255,0.35)' }}>— from backend API</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {weather.forecast.map((f, idx) => (
              <div key={f.day} className="rounded-2xl p-4 text-center transition-all duration-300 hover:scale-105 cursor-pointer group"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', animationDelay: `${idx * 80}ms` }}>
                <p className="text-[11px] font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>{f.day}</p>
                <div className="text-3xl mb-2 transition-transform group-hover:scale-110">{f.icon}</div>
                <p className="text-base font-bold text-white">{convertTemp(f.high)}°</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{convertTemp(f.low)}°</p>
                <p className="text-[10px] mt-1 truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>{f.desc}</p>
                {(f.rainChance ?? 0) > 30 && <div className="mt-2 text-[10px] font-semibold" style={{ color: '#38bdf8' }}>💧 {f.rainChance}%</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
