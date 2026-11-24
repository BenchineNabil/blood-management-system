import { useState } from 'react';
import { authService } from '@/services/authService';
import { useT } from '@/i18n';
import { Icon } from '@/components/Icon';

export function LoginPage({ onLogin }: { onLogin: () => void }) {
  const { t } = useT();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError(t('login_error'));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await authService.login({ email: email.trim(), password });
      onLogin();
    } catch {
      setError(t('login_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Brand */}
        <div className="login-brand">
          <div className="brand-mark" style={{ width: 52, height: 52, borderRadius: 14 }}>
            <Icon name="drop" size={28} />
          </div>
          <h1 className="login-title">{t('login_welcome')}</h1>
          <p className="login-system">{t('login_system')}</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="login-fields">
            <label>
              <span className="field-label">{t('login_email')}</span>
              <input
                type="email"
                autoComplete="username"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="nom@hemocare.dz"
                autoFocus
                disabled={loading}
              />
            </label>
            <label>
              <span className="field-label">{t('login_password')}</span>
              <div className="input-icon">
                <input
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  style={{ position: 'absolute', right: 10, top: 11, background: 'none', border: 'none', color: '#98a1af', cursor: 'pointer', padding: 0 }}
                  tabIndex={-1}
                  aria-label={showPw ? 'Masquer' : 'Afficher'}
                >
                  <Icon name="eye" size={16} />
                </button>
              </div>
            </label>
          </div>

          {error && (
            <div className="login-error">
              <Icon name="alert" size={15} />
              {error}
            </div>
          )}

          <button type="submit" className="primary login-submit" disabled={loading}>
            {loading ? t('loading') : t('login_btn')}
          </button>
        </form>

        {/* Demo hint */}
        <div className="login-hint">
          <strong>Comptes de démonstration :</strong>
          <ul>
            <li>elena@hemocare.dz / <code>admin123</code></li>
            <li>karim@hemocare.dz / <code>infirmier</code></li>
            <li>nadia@hemocare.dz / <code>gestion</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
