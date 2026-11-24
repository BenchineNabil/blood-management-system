import { useState } from 'react';
import { statsService } from '@/services/statsService';
import { PageTitle, ErrorMessage, LoadingSpinner } from '@/components/shared';
import { Icon } from '@/components/Icon';
import { today } from '@/utils/dates';
import type { StatsResponse } from '@/types';

export function Statistiques() {
  const [du, setDu] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().slice(0, 10);
  });
  const [au, setAu] = useState(today());
  const [data, setData] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await statsService.get(du, au);
      setData(result);
    } catch (e) {
      setError((e as Error).message ?? 'Erreur lors du chargement des statistiques.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageTitle title="Statistiques" subtitle="Analyse de l'activité du service de transfusion." />
      <div className="card p-5 mb-5">
        <div className="flex flex-wrap items-end gap-4">
          <label className="flex flex-col gap-1">
            <span className="field-label">Du</span>
            <input type="date" value={du} onChange={e => setDu(e.target.value)} style={{ width: 160 }} />
          </label>
          <label className="flex flex-col gap-1">
            <span className="field-label">Au</span>
            <input type="date" value={au} onChange={e => setAu(e.target.value)} style={{ width: 160 }} />
          </label>
          <button className="primary" onClick={search} disabled={loading}>
            <Icon name="search" size={16} /> Afficher
          </button>
        </div>
      </div>

      {error && <div className="mb-4"><ErrorMessage message={error} /></div>}
      {loading && <LoadingSpinner />}

      {data && !loading && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* (a) Poches sorties par service */}
          <div className="card overflow-hidden">
            <div className="card-heading"><h2>Sorties par service</h2></div>
            <table>
              <thead><tr><th>Service</th><th>Poches sorties</th></tr></thead>
              <tbody>
                {data.parService.length === 0 ? (
                  <tr><td colSpan={2} className="text-center text-slate-400 py-6">Aucune donnée</td></tr>
                ) : (
                  data.parService.map(r => (
                    <tr key={r.service}><td>{r.service}</td><td className="font-semibold">{r.count}</td></tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* (b) Prélèvements par site */}
          <div className="card overflow-hidden">
            <div className="card-heading"><h2>Prélèvements par site</h2></div>
            <table>
              <thead><tr><th>Site</th><th>Prélèvements</th></tr></thead>
              <tbody>
                {data.parSite.length === 0 ? (
                  <tr><td colSpan={2} className="text-center text-slate-400 py-6">Aucune donnée</td></tr>
                ) : (
                  data.parSite.map(r => (
                    <tr key={r.site}><td>{r.site}</td><td className="font-semibold">{r.count}</td></tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* (c) Prélèvements par site et sexe */}
          <div className="card overflow-hidden">
            <div className="card-heading"><h2>Prélèvements par site et sexe</h2></div>
            <table>
              <thead><tr><th>Site</th><th>Sexe</th><th>Total</th></tr></thead>
              <tbody>
                {data.parSiteEtSexe.length === 0 ? (
                  <tr><td colSpan={3} className="text-center text-slate-400 py-6">Aucune donnée</td></tr>
                ) : (
                  data.parSiteEtSexe.map(r => (
                    <tr key={`${r.site}-${r.sexe}`}>
                      <td>{r.site}</td>
                      <td>{r.sexe}</td>
                      <td className="font-semibold">{r.count}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
