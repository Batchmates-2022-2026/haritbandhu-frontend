import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth, getActivityLogs } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';

export default function AdminDashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [apiAvailable, setApiAvailable] = useState(false);

  useEffect(() => {
    // ── GET /admin/stats ──────────────────────────────────────────
    adminService.getStats()
      .then(s => { setStats(s); setApiAvailable(true); })
      .catch(() => setStats({ totalUsers: '—', activeUsers: '—' }));

    // ── GET /admin/users ──────────────────────────────────────────
    adminService.getUsers()
      .then(u => { setUsers(u); setLoadingUsers(false); setApiAvailable(true); })
      .catch(() => { setUsers([]); setLoadingUsers(false); });

    // ── GET /admin/activity ───────────────────────────────────────
    adminService.getActivity()
      .then(a => setActivity(Array.isArray(a) ? a : []))
      .catch(() => setActivity(getActivityLogs()));
  }, []);

  const handleDeleteUser = async (id: string | number) => {
    if (!confirm('Delete this user?')) return;
    try {
      await adminService.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      alert('Delete failed — check backend.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 animate-fade-in-up">
      <h2 className="text-2xl font-display font-bold text-green-grad mb-2">{t.adminDashboard}</h2>
      {!apiAvailable && (
        <p className="text-xs text-yellow-400 mb-4">⚠️ Backend not connected — some data may be unavailable.</p>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass-card p-5 text-center rounded-xl">
          <div className="text-3xl font-bold text-primary">{stats?.totalUsers ?? users.length}</div>
          <div className="text-sm text-muted-foreground">{t.totalUsers}</div>
        </div>
        <div className="glass-card p-5 text-center rounded-xl">
          <div className="text-3xl font-bold text-accent">{stats?.activeUsers ?? users.length}</div>
          <div className="text-sm text-muted-foreground">{t.activeUsers}</div>
        </div>
        <div className="glass-card p-5 text-center rounded-xl">
          <div className="text-3xl font-bold text-warning">{stats?.totalPosts ?? activity.length}</div>
          <div className="text-sm text-muted-foreground">Total Activities</div>
        </div>
      </div>

      {/* Users */}
      <div className="glass rounded-2xl p-6 mb-6">
        <h3 className="text-lg font-bold text-foreground mb-4">👥 Registered Users</h3>
        {loadingUsers && <p className="text-sm text-muted-foreground">Loading from backend...</p>}
        {!loadingUsers && users.length === 0 && <p className="text-muted-foreground text-sm">No users found from API.</p>}
        <div className="space-y-2">
          {users.map(u => (
            <div key={u.id} className="flex items-center justify-between bg-secondary/30 rounded-lg p-3">
              <div>
                <div className="text-sm font-semibold text-foreground">{u.name ?? u.username}</div>
                <div className="text-xs text-muted-foreground">{u.email} • {u.city ?? '—'}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">{u.role}</span>
                <button onClick={() => handleDeleteUser(u.id)}
                  className="text-xs text-destructive hover:bg-destructive/10 px-2 py-1 rounded transition-all">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">📋 {t.recentActivity}</h3>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {activity.length === 0 && <p className="text-sm text-muted-foreground">No activity data.</p>}
          {activity.slice(0, 50).map((log: any, i) => (
            <div key={i} className="flex items-center justify-between bg-secondary/20 rounded-lg p-3">
              <div className="text-sm text-foreground">{log.action ?? JSON.stringify(log)}</div>
              <div className="text-xs text-muted-foreground">
                {log.timestamp ? new Date(log.timestamp).toLocaleString() : ''}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
