import { useState, useRef, useEffect } from 'react';
import type { Screen } from '@/App';
import { Icon } from '@/components/Icon';
import { useT, I18nContext, type TranslationKey } from '@/i18n';
import { useContext } from 'react';
import { NotifyPanel, useOverdueCount } from '@/components/NotifyPanel';
import type { AuthUser } from '@/services/authService';

type NavItem = { screen: Screen; icon: Parameters<typeof Icon>[0]['name'] };

const NAV_ITEMS: NavItem[] = [
  { screen: 'Tableau de bord', icon: 'grid' },
  { screen: 'Donneurs', icon: 'users' },
  { screen: 'Registre des poches', icon: 'drop' },
  { screen: 'Sortie', icon: 'arrow' },
  { screen: 'Questionnaire', icon: 'clipboard' },
  { screen: 'Statistiques', icon: 'chart' },
  { screen: 'Paramètres', icon: 'settings' },
];

/** Nav label translations for each Screen value */
const NAV_LABELS: Record<Screen, TranslationKey> = {
  'Tableau de bord': 'nav_dashboard',
  'Donneurs': 'nav_donors',
  'Registre des poches': 'nav_register',
  'Sortie': 'nav_issue',
  'Questionnaire': 'nav_questionnaire',
  'Statistiques': 'nav_stats',
  'Paramètres': 'nav_settings',
};

type TransKey = TranslationKey;

export function Sidebar({
  screen,
  navigate,
  user,
  onLogout,
}: {
  screen: Screen;
  navigate: (s: Screen) => void;
  user: AuthUser | null;
  onLogout: () => void;
}) {
  const { t } = useT();
  const initials = user
    ? `${user.name.split(' ')[0]?.[0] ?? ''}${user.name.split(' ')[1]?.[0] ?? ''}`.toUpperCase()
    : '??';

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <Icon name="drop" size={21} />
        </div>
        <div>
          <b>HemoCare</b>
          <span>Gestion des dons</span>
        </div>
      </div>
      <nav>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.screen}
            className={screen === item.screen ? 'active' : ''}
            onClick={() => navigate(item.screen)}
          >
            <Icon name={item.icon} size={18} />
            <span>{t(NAV_LABELS[item.screen] as TranslationKey)}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-foot">
        <div className="user-mini">
          <div className="avatar">{initials}</div>
          <div>
            <b>{user?.name ?? '—'}</b>
            <span>{user?.role ?? ''}</span>
          </div>
          <Icon name="chevron" size={15} />
        </div>
        <button className="signout" onClick={onLogout}>
          <Icon name="logout" size={17} /> {t('logout')}
        </button>
      </div>
    </aside>
  );
}

/** Language switcher dropdown */
function LangSwitcher() {
  const { lang, setLang } = useContext(I18nContext);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        className="icon-button"
        aria-label="Changer de langue"
        onClick={() => setOpen(o => !o)}
        title={lang === 'fr' ? 'Langue : Français' : 'Language: English'}
      >
        {/* Globe SVG icon */}
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span style={{ fontSize: 11, fontWeight: 700, marginLeft: 2, letterSpacing: '0.3px' }}>{lang.toUpperCase()}</span>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', right: 0, marginTop: 4,
          background: '#fff', border: '1px solid #e5e9ef', borderRadius: 10,
          boxShadow: '0 8px 24px rgba(0,0,0,0.11)', zIndex: 500, minWidth: 130, overflow: 'hidden',
        }}>
          {(['fr', 'en'] as const).map(l => (
            <button
              key={l}
              onClick={() => { setLang(l); setOpen(false); }}
              style={{
                display: 'block', width: '100%', padding: '10px 14px', textAlign: 'left',
                background: lang === l ? '#fdf2f3' : 'transparent',
                color: lang === l ? '#c62e3a' : '#344054',
                border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: lang === l ? 700 : 400,
              }}
            >
              {l === 'fr' ? '🇫🇷  Français' : '🇬🇧  English'}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Bell button that opens NotifyPanel */
function BellButton() {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const count = useOverdueCount(90);

  return (
    <>
      <button
        className="icon-button notification"
        aria-label={t('bell_title')}
        onClick={() => setOpen(true)}
        style={{ position: 'relative' }}
      >
        <Icon name="bell" size={19} />
        {count > 0 && (
          <i style={{
            position: 'absolute', top: 2, right: 2, minWidth: 14, height: 14,
            borderRadius: 7, background: '#c62e3a', color: '#fff',
            fontSize: 9, fontWeight: 700, display: 'flex',
            alignItems: 'center', justifyContent: 'center', padding: '0 3px',
            fontStyle: 'normal',
          }}>
            {count}
          </i>
        )}
      </button>
      {open && <NotifyPanel onClose={() => setOpen(false)} />}
    </>
  );
}

export function Header({
  title,
  user,
}: {
  title: string;
  user: AuthUser | null;
}) {
  const initials = user
    ? `${user.name.split(' ')[0]?.[0] ?? ''}${user.name.split(' ')[1]?.[0] ?? ''}`.toUpperCase()
    : '??';

  return (
    <header>
      <div className="mobile-brand">
        <div className="brand-mark">
          <Icon name="drop" size={18} />
        </div>
        <b>HemoCare</b>
      </div>
      <div className="breadcrumb">
        <span>HemoCare</span>
        <b>/</b>
        <strong>{title}</strong>
      </div>
      <div className="header-actions">
        <button className="icon-button" aria-label="Rechercher">
          <Icon name="search" size={19} />
        </button>
        <LangSwitcher />
        <BellButton />
        <div className="header-avatar">{initials}</div>
      </div>
    </header>
  );
}
