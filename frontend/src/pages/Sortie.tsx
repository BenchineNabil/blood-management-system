import { useState, useEffect, useCallback } from 'react';
import { bagService } from '@/services/bagService';
import {
  PageTitle,
  TableShell,
  ErrorMessage,
  LoadingSpinner,
  EmptyState,
  Status,
} from '@/components/shared';
import { Icon } from '@/components/Icon';
import { formatDate, today } from '@/utils/dates';
import { SERVICES } from '@/types';
import type { BagAPI } from '@/types';

export function Sortie() {
  const [bags, setBags] = useState<BagAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<BagAPI | null>(null);
  const [dateSortie, setDateSortie] = useState(today());
  const [service, setService] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bagService.getAll();
      setBags(data.filter(b => b.status === 'Disponible'));
    } catch (e) {
      setError((e as Error).message ?? 'Erreur lors du chargement.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadAll(); }, [loadAll]);

  const handleIssue = async () => {
    if (!selected) return;
    if (!service) { setFormError('Le service est obligatoire.'); return; }
    if (!dateSortie) { setFormError('La date de sortie est obligatoire.'); return; }
    setSaving(true);
    setFormError(null);
    try {
      await bagService.issue(selected.id, dateSortie, service);
      setSuccess(`Poche ${selected.numero} sortie vers ${service} le ${formatDate(dateSortie)}.`);
      setSelected(null);
      setService('');
      await loadAll();
    } catch (e) {
      setFormError((e as Error).message ?? 'Erreur lors de la sortie.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageTitle
        title="Sortie"
        subtitle="Enregistrer la sortie d'une poche de sang."
      />
      {error && <div className="mb-4"><ErrorMessage message={error} /></div>}
      {success && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* Sortie form */}
      {selected && (
        <div className="card p-6 mb-5">
          <h2 className="mb-4">Enregistrer la sortie — Poche {selected.numero}</h2>
          {formError && <div className="mb-4"><ErrorMessage message={formError} /></div>}
          <div className="form-grid">
            <label>
              <span className="field-label">Date de Sortie <b>*</b></span>
              <input
                type="date"
                value={dateSortie}
                onChange={e => setDateSortie(e.target.value)}
              />
            </label>
            <label>
              <span className="field-label">
                Service <b>*</b>
                {/* TODO(API): Service list not defined in API. Using seeded list from PDF examples. */}
              </span>
              <select value={service} onChange={e => setService(e.target.value)}>
                <option value="">-- Sélectionner un service --</option>
                {SERVICES.map(s => <option key={s}>{s}</option>)}
              </select>
            </label>
          </div>
          <div className="mt-4 flex gap-3 justify-end">
            <button className="secondary" onClick={() => setSelected(null)}>Annuler</button>
            <button className="primary" disabled={saving} onClick={handleIssue}>
              {saving ? 'Enregistrement…' : <><Icon name="check" size={16} /> Valider la sortie</>}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <TableShell>
          <table>
            <thead>
              <tr>
                <th>Numéro</th>
                <th>Date Prélèvement</th>
                <th>Groupage</th>
                <th>Sexe</th>
                <th>Date Péremption</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {bags.length === 0 ? (
                <tr><td colSpan={7}><EmptyState message="Aucune poche disponible pour la sortie." /></td></tr>
              ) : (
                bags.map((b) => (
                  <tr
                    key={b.id}
                    className={`clickable ${selected?.id === b.id ? 'bg-red-50' : ''}`}
                    onClick={() => { setSelected(b); setFormError(null); setSuccess(null); }}
                  >
                    <td className="id-cell">{b.numero}</td>
                    <td>{formatDate(b.datePrelevement)}</td>
                    <td><b className="blood-chip">{b.groupage}</b></td>
                    <td>{b.sexe}</td>
                    <td>{formatDate(b.datePeremption)}</td>
                    <td><Status>{b.status}</Status></td>
                    <td><Icon name="chevron" size={17} className="text-slate-400" /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </TableShell>
      )}
      <p className="table-foot">
        {bags.length} poche{bags.length !== 1 ? 's' : ''} disponible{bags.length !== 1 ? 's' : ''}
        {' · '}Cliquer sur une ligne pour enregistrer sa sortie.
      </p>
    </>
  );
}
