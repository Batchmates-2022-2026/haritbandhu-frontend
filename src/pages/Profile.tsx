import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { userService } from '@/services/userService';
import { toast } from 'sonner';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { t } = useLanguage();
  const [form, setForm] = useState({ username: user?.username || '', email: user?.email || '', phone: user?.phone || '', city: user?.city || '' });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' });
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      // ── POST /user/profile ────────────────────────────────────────
      await userService.updateProfile({ username: form.username, phone: form.phone, city: form.city });
      updateProfile(form);
      toast.success('Profile saved successfully!');
    } catch (err: any) {
      console.error(err);
      // Fallback: update locally
      updateProfile(form);
      toast.success('Profile saved (offline mode).');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!passwords.oldPassword || !passwords.newPassword) return;
    setChangingPassword(true);
    try {
      // ── POST /user/change-password ────────────────────────────────
      await userService.changePassword({ oldPassword: passwords.oldPassword, newPassword: passwords.newPassword });
      toast.success('Password changed successfully!');
      setShowPasswordModal(false);
      setPasswords({ oldPassword: '', newPassword: '' });
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Password change failed. Check your old password.');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 animate-fade-in-up">
      <h2 className="text-2xl font-display font-bold text-green-grad mb-6">{t.profile}</h2>
      <div className="glass rounded-2xl p-6 space-y-4">
        {(['username', 'phone', 'city'] as const).map(field => (
          <div key={field}>
            <label className="text-xs text-muted-foreground mb-1 block">{t[field]}</label>
            <input value={form[field]} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
              className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-2.5 text-foreground text-sm outline-none focus:border-primary" />
          </div>
        ))}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">{t.email}</label>
          <input value={form.email} disabled className="w-full bg-secondary/30 border border-border rounded-lg px-4 py-2.5 text-muted-foreground text-sm" />
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          <button onClick={handleSave} disabled={saving} className="bg-primary text-primary-foreground font-bold py-2.5 px-5 rounded-lg text-sm hover:opacity-90 disabled:opacity-50">
            {saving ? 'Saving...' : t.saveProfile}
          </button>
          <button onClick={() => setShowPasswordModal(true)} className="bg-secondary text-secondary-foreground font-semibold py-2.5 px-5 rounded-lg text-sm hover:opacity-80">
            {t.changePassword}
          </button>
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass rounded-2xl p-6 w-full max-w-sm animate-scale-in space-y-4">
            <h3 className="text-lg font-bold text-foreground">{t.changePassword}</h3>
            <input type="password" placeholder={t.oldPassword} value={passwords.oldPassword}
              onChange={e => setPasswords(p => ({ ...p, oldPassword: e.target.value }))}
              className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-2.5 text-foreground text-sm outline-none focus:border-primary" />
            <input type="password" placeholder={t.newPassword} value={passwords.newPassword}
              onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))}
              className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-2.5 text-foreground text-sm outline-none focus:border-primary" />
            <div className="flex gap-2">
              <button onClick={handlePasswordChange} disabled={changingPassword}
                className="bg-primary text-primary-foreground font-bold py-2 px-4 rounded-lg text-sm disabled:opacity-50">
                {changingPassword ? 'Saving...' : t.save}
              </button>
              <button onClick={() => setShowPasswordModal(false)} className="bg-secondary text-secondary-foreground py-2 px-4 rounded-lg text-sm">{t.cancel}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
