import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import logo from '@/assets/logo.png';

export default function Signup() {
  const { signup } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', phone: '', city: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    setLoading(true); setError('');
    const ok = await signup({ username: form.username, email: form.email, phone: form.phone, city: form.city, password: form.password });
    setLoading(false);
    if (ok) navigate('/dashboard');
    else setError('Email already exists');
  };

  const update = (key: string, val: string) => setForm(p => ({ ...p, [key]: val }));

  const fields: { key: keyof typeof form; label: string; type: string; placeholder: string }[] = [
    { key: 'username', label: t.fullName, type: 'text', placeholder: 'Ravi Kumar' },
    { key: 'email', label: t.email, type: 'email', placeholder: 'you@example.com' },
    { key: 'phone', label: t.phone, type: 'text', placeholder: '+91 98765 43210' },
    { key: 'city', label: t.city, type: 'text', placeholder: 'Kanpur' },
    { key: 'password', label: t.password, type: 'password', placeholder: '••••••••' },
    { key: 'confirmPassword', label: t.confirmPassword, type: 'password', placeholder: '••••••••' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative" style={{ background: 'var(--gradient-dark)' }}>
      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-primary/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="animate-fade-in-up w-full max-w-sm relative z-10">
        {/* Back */}
        <button onClick={() => navigate('/')} className="mb-6 text-sm text-white/40 hover:text-white/70 transition-colors flex items-center gap-1">
          ← Back to Home
        </button>

        <div className="text-center mb-6">
          <img src={logo} alt="HaritBandhu" className="w-14 h-14 mx-auto mb-3 rounded-xl object-contain" />
          <h1 className="text-2xl font-display font-bold text-green-grad">{t.signup}</h1>
          <p className="text-muted-foreground text-sm mt-1">Join 50,000+ smart farmers 🌱</p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-3">
          {error && (
            <div className="bg-destructive/20 border border-destructive/30 rounded-lg p-3 text-sm text-destructive animate-fade-in">
              {error}
            </div>
          )}
          {fields.map(({ key, label, type, placeholder }, i) => (
            <div key={key} className="animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
              <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
              <input
                type={type} value={form[key]} onChange={e => update(key, e.target.value)} required
                placeholder={placeholder}
                className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-2.5 text-foreground text-sm outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/30"
              />
            </div>
          ))}
          <button
            type="submit" disabled={loading}
            className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg hover:opacity-90 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 shadow-lg shadow-primary/20 mt-2"
          >
            {loading ? 'Creating account...' : t.signup}
          </button>
          <p className="text-center text-sm text-muted-foreground pt-1">
            {t.hasAccount}{' '}
            <Link to="/login" className="text-primary hover:underline font-semibold">{t.login}</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
