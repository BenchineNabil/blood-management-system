import { useState } from 'react';
import { PageTitle } from '@/components/shared';
import { Icon } from '@/components/Icon';
import type { Screen } from '@/App';
import { NotifyPanel, useOverdueCount } from '@/components/NotifyPanel';

const BLOOD_GROUPS_STATS = [
  ['O Pos', 42],
  ['O Nég', 18],
  ['A Pos', 35],
  ['A Nég', 9],
  ['B Pos', 21],
  ['B Nég', 7],
  ['AB Pos', 73],
  ['AB Nég', 12],
] as const;

export function TableauDeBord({ navigate }: { navigate: (s: Screen) => void }) {
  const [showNotify, setShowNotify] = useState(false);
  const overdueCount = useOverdueCount(90);

  return (
    <>
      <PageTitle
        title="Tableau de bord"
        subtitle="Aperçu de l'activité du service de transfusion."
        action={
          <div className="flex gap-2">
            <button
              className="secondary"
              onClick={() => setShowNotify(true)}
              style={{ position: 'relative' }}
            >
              <Icon name="bell" size={16} />
              Notifier les donneurs
              {overdueCount > 0 && (
                <em style={{
                  position: 'absolute', top: -6, right: -6, minWidth: 18, height: 18,
                  borderRadius: 9, background: '#c62e3a', color: '#fff',
                  fontSize: 10, fontWeight: 700, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', padding: '0 4px',
                }}>
                  {overdueCount}
                </em>
              )}
            </button>
            <button className="primary" onClick={() => navigate('Registre des poches')}>
              <Icon name="plus" size={17} /> Nouveau prélèvement
            </button>
          </div>
        }
      />
      <div className="grid grid-cols-4 gap-4 max-xl:grid-cols-2 max-sm:grid-cols-1">
        {(
          [
            ['Poches disponibles', '284', '12 ajoutées cette semaine', 'drop', 'red'],
            ["Prélèvements aujourd'hui", '7', '2 ajoutés cette heure', 'plus', 'violet'],
            ['Poches périmées', '14', '2 à traiter', 'alert', 'amber'],
            ['Donneurs actifs', '1 248', '36 ce mois', 'users', 'blue'],
          ] as const
        ).map(([label, value, note, icon, color]) => (
          <div className="stat-card" key={label}>
            <div className={`stat-icon ${color}`}>
              <Icon name={icon} size={20} />
            </div>
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <strong>{value}</strong>
            <span>{note}</span>
          </div>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-[1.35fr_.65fr] gap-5 max-lg:grid-cols-1">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2>Disponibilité par groupe</h2>
              <p className="section-subtitle">Poches disponibles par groupe sanguin</p>
            </div>
            <button className="text-button" onClick={() => navigate('Registre des poches')}>
              Voir registre <Icon name="arrow" size={15} />
            </button>
          </div>
          <div className="mt-7 grid grid-cols-4 gap-3 max-sm:grid-cols-2">
            {BLOOD_GROUPS_STATS.map(([type, qty]) => (
              <div className="blood-tile" key={type}>
                <span>{type}</span>
                <strong>{qty}</strong>
                <small>poches</small>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-6">
          <h2>Activité récente</h2>
          <p className="section-subtitle">Derniers prélèvements enregistrés</p>
          <div className="mt-5 space-y-5">
            {[
              ['Nouveau prélèvement', '1095/2026 · il y a 12 min'],
              ['Nouveau prélèvement', '1094/2026 · il y a 38 min'],
              ['Poche sortie', '1090/2026 · il y a 1 h'],
            ].map(([title, meta]) => (
              <div className="activity" key={meta}>
                <div className="activity-icon red">
                  <Icon name="drop" size={16} />
                </div>
                <div>
                  <p>{title}</p>
                  <span>{meta}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showNotify && <NotifyPanel onClose={() => setShowNotify(false)} />}
    </>
  );
}
