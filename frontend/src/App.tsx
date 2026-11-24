import { useState } from 'react';
import { Sidebar, Header } from '@/components/Layout';
import { TableauDeBord } from '@/pages/TableauDeBord';
import { Donneurs } from '@/pages/Donneurs';
import { RegistreDesPoches } from '@/pages/RegistreDesPoches';
import { Sortie } from '@/pages/Sortie';
import { Questionnaire } from '@/pages/Questionnaire';
import { Statistiques } from '@/pages/Statistiques';
import { Parametres } from '@/pages/Parametres';
import { LoginPage } from '@/pages/LoginPage';
import { I18nProvider } from '@/i18n';
import { authService, type AuthUser } from '@/services/authService';

export type Screen =
  | 'Tableau de bord'
  | 'Donneurs'
  | 'Registre des poches'
  | 'Sortie'
  | 'Questionnaire'
  | 'Statistiques'
  | 'Paramètres';

export default function App() {
  const [user, setUser] = useState<AuthUser | null>(() => authService.getCurrentUser());
  const [screen, setScreen] = useState<Screen>('Tableau de bord');

  const navigate = (next: Screen) => setScreen(next);

  const handleLogin = () => {
    setUser(authService.getCurrentUser());
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <I18nProvider>
      {!user ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <div className="app-shell">
          <Sidebar screen={screen} navigate={navigate} user={user} onLogout={handleLogout} />
          <div className="main-wrap">
            <Header title={screen} user={user} />
            <main>
              {screen === 'Tableau de bord' && <TableauDeBord navigate={navigate} />}
              {screen === 'Donneurs' && <Donneurs />}
              {screen === 'Registre des poches' && <RegistreDesPoches />}
              {screen === 'Sortie' && <Sortie />}
              {screen === 'Questionnaire' && <Questionnaire />}
              {screen === 'Statistiques' && <Statistiques />}
              {screen === 'Paramètres' && <Parametres />}
            </main>
          </div>
        </div>
      )}
    </I18nProvider>
  );
}
