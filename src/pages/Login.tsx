import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import logo from '@/assets/logo.png';

export default function Login() {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const ok = await login(email, password);
    setLoading(false);
    if (ok) {
      const user = JSON.parse(localStorage.getItem('hb_user') || '{}');
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative" style={{ background: 'var(--gradient-dark)' }}>
      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="animate-fade-in-up w-full max-w-sm relative z-10">
        {/* Back */}
        <button onClick={() => navigate('/')} className="mb-6 text-sm text-white/40 hover:text-white/70 transition-colors flex items-center gap-1">
          ← Back to Home
        </button>

        <div className="text-center mb-8">
          <img src={logo} alt="HaritBandhu" className="w-16 h-16 mx-auto mb-4 rounded-xl object-contain" />
          <h1 className="text-2xl font-display font-bold text-green-grad">{t.login}</h1>
          <p className="text-muted-foreground text-sm mt-1">Welcome back, farmer 🌾</p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-4">
          {error && (
            <div className="bg-destructive/20 border border-destructive/30 rounded-lg p-3 text-sm text-destructive animate-fade-in">
              {error}
            </div>
          )}
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">{t.email}</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground text-sm outline-none focus:border-primary transition-colors"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">{t.password}</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)} required
              className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground text-sm outline-none focus:border-primary transition-colors"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg hover:opacity-90 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 shadow-lg shadow-primary/20"
          >
            {loading ? 'Signing in...' : t.login}
          </button>
          <p className="text-center text-sm text-muted-foreground">
            {t.noAccount}{' '}
            <Link to="/signup" className="text-primary hover:underline font-semibold">{t.signup}</Link>
          </p>
          <p className="text-center text-xs text-muted-foreground/40 pt-1 border-t border-border/30">
            Admin: admin@haritbandhu.com / admin123
          </p>
        </form>
      </div>
    </div>
  );
}
