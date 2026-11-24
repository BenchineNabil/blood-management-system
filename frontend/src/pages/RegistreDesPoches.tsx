import { useState, useEffect, useCallback } from 'react';
import { bagService } from '@/services/bagService';
import { settingsService } from '@/services/settingsService';
import {
  PageTitle,
  TableShell,
  ErrorMessage,
  LoadingSpinner,
  EmptyState,
  Status,
} from '@/components/shared';
import { Icon } from '@/components/Icon';
import { formatDate, calculateAge, addDays, today } from '@/utils/dates';
import { BLOOD_GROUPS, SEXES, SITES, TYPES_DON } from '@/types';
import type { BagAPI, BagFormData, BloodGroup, Sexe, Site, TypeDon } from '@/types';
import { BagDetailPanel } from '@/components/BagDetailPanel';

function emptyForm(): BagFormData {
  return {
    code: '',
    datePrelevement: today(),
    groupage: '',
    dateNaissance: '',
    sexe: '',
    type: '',
    site: '',
  };
}

export function RegistreDesPoches() {
  const [bags, setBags] = useState<BagAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'list' | 'form'>('list');
  const [form, setForm] = useState<BagFormData>(emptyForm());
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [shelfLife, setShelfLife] = useState(35);
  const [detailBag, setDetailBag] = useState<BagAPI | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [bagsData, settings] = await Promise.all([
        bagService.getAll(),
        settingsService.get(),
      ]);
      setBags(bagsData);
      setShelfLife(settings.dureePeremptionJours);
    } catch (e) {
      setError((e as Error).message ?? 'Erreur lors du chargement.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadAll(); }, [loadAll]);

  const nextCode = () => {
    if (bags.length === 0) return `1/${new Date().getFullYear()}`;
    const max = Math.max(...bags.map(b => parseInt(b.numero.split('/')[0], 10)));
    return `${max + 1}/${new Date().getFullYear()}`;
  };

  const openNew = () => {
    const f = emptyForm();
    f.code = nextCode();
    setForm(f);
    setMode('form');
    setFormError(null);
  };

  const expiryDate = form.datePrelevement ? addDays(form.datePrelevement, shelfLife) : '';
  const age = form.dateNaissance && form.datePrelevement
    ? calculateAge(form.dateNaissance, form.datePrelevement)
    : null;

  const saveForm = async () => {
    if (!form.groupage || !form.sexe || !form.type || !form.site) {
      setFormError('Tous les champs obligatoires doivent être remplis.');
      return;
    }
    if (!form.dateNaissance) {
      setFormError('La date de naissance est obligatoire.');
      return;
    }
    if (!form.datePrelevement) {
      setFormError('La date de prélèvement est obligatoire.');
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      await bagService.create({
        numero: form.code,
        datePrelevement: form.datePrelevement,
        dateNaissance: form.dateNaissance,
        sexe: form.sexe as Sexe,
        site: form.site as Site,
        type: form.type as TypeDon,
        groupage: form.groupage as BloodGroup,
        datePeremption: expiryDate,
        dateSortie: null,
        service: null,
        status: 'Disponible',
        donorId: 0, // TODO(API): donor linkage not defined for bag creation
      });
      await loadAll();
      setMode('list');
    } catch (e) {
      setFormError((e as Error).message ?? 'Erreur lors de l\'enregistrement.');
    } finally {
      setSaving(false);
    }
  };

  if (mode === 'form') {
    return (
      <>
        <PageTitle title="Ajouter une poche" subtitle="Enregistrer un nouveau prélèvement." />
        {formError && <div className="mb-4"><ErrorMessage message={formError} /></div>}
        <div className="card p-6">
          <div className="form-grid">
            <label>
              <span className="field-label">Code (Numéro/Année) <b>*</b></span>
              <input value={form.code} disabled />
            </label>
            <label>
              <span className="field-label">Date Prélèvement <b>*</b></span>
              <input
                type="date"
                value={form.datePrelevement}
                onChange={e => setForm(f => ({ ...f, datePrelevement: e.target.value }))}
              />
            </label>
            <label>
              <span className="field-label">Groupage <b>*</b></span>
              <select value={form.groupage} onChange={e => setForm(f => ({ ...f, groupage: e.target.value as BloodGroup | '' }))}>
                <option value="">-- Sélectionner --</option>
                {BLOOD_GROUPS.map(g => <option key={g}>{g}</option>)}
              </select>
            </label>
            <label>
              <span className="field-label">Date Péremption (auto)</span>
              <input value={expiryDate ? formatDate(expiryDate) : ''} disabled />
            </label>
            <label>
              <span className="field-label">Date Naissance <b>*</b></span>
              <input
                type="date"
                value={form.dateNaissance}
                onChange={e => setForm(f => ({ ...f, dateNaissance: e.target.value }))}
              />
            </label>
            <label>
              <span className="field-label">Âge (calculé)</span>
              <input value={age !== null ? `${age} ans` : ''} disabled />
            </label>
            <label>
              <span className="field-label">Sexe <b>*</b></span>
              <select value={form.sexe} onChange={e => setForm(f => ({ ...f, sexe: e.target.value as Sexe | '' }))}>
                <option value="">-- Sélectionner --</option>
                {SEXES.map(s => <option key={s}>{s}</option>)}
              </select>
            </label>
            <label>
              <span className="field-label">Type <b>*</b></span>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as TypeDon | '' }))}>
                <option value="">-- Sélectionner --</option>
                {TYPES_DON.map(t => <option key={t}>{t}</option>)}
              </select>
            </label>
            <label>
              <span className="field-label">Site <b>*</b></span>
              <select value={form.site} onChange={e => setForm(f => ({ ...f, site: e.target.value as Site | '' }))}>
                <option value="">-- Sélectionner --</option>
                {SITES.map(s => <option key={s}>{s}</option>)}
              </select>
            </label>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button className="secondary" onClick={() => setMode('list')}>Annuler</button>
            <button className="primary" disabled={saving} onClick={saveForm}>
              {saving ? 'Enregistrement…' : <><Icon name="check" size={16} /> Enregistrer</>}
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageTitle
        title="Registre des poches"
        subtitle="Registre de collecte de sang — poches et prélèvements."
        action={
          <button className="primary" onClick={openNew}>
            <Icon name="plus" size={17} /> Ajouter
          </button>
        }
      />
      {error && <div className="mb-4"><ErrorMessage message={error} /></div>}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <TableShell>
          <table>
            <thead>
              <tr>
                <th>Numéro</th>
                <th>Date Prélèvement</th>
                <th>Date Né</th>
                <th>Âge</th>
                <th>Sexe</th>
                <th>Site</th>
                <th>Type</th>
                <th>Groupage</th>
                <th>Date Péremption</th>
                <th>Date de Sortie</th>
                <th>Service</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {bags.length === 0 ? (
                <tr><td colSpan={12}><EmptyState message="Aucune poche enregistrée." /></td></tr>
              ) : (
                bags.map((b) => (
                  <tr key={b.id} className="clickable" style={{ cursor: 'pointer' }} onClick={() => setDetailBag(b)}>
                    <td className="id-cell">{b.numero}</td>
                    <td>{formatDate(b.datePrelevement)}</td>
                    <td>{formatDate(b.dateNaissance)}</td>
                    <td>{calculateAge(b.dateNaissance, b.datePrelevement)} ans</td>
                    <td>{b.sexe}</td>
                    <td>{b.site}</td>
                    <td>{b.type}</td>
                    <td><b className="blood-chip">{b.groupage}</b></td>
                    <td>{formatDate(b.datePeremption)}</td>
                    <td>{b.dateSortie ? formatDate(b.dateSortie) : '—'}</td>
                    <td>{b.service ?? '—'}</td>
                    <td><Status>{b.status}</Status></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </TableShell>
      )}
      <p className="table-foot">{bags.length} poche{bags.length !== 1 ? 's' : ''} enregistrée{bags.length !== 1 ? 's' : ''}</p>
      {detailBag && <BagDetailPanel bag={detailBag} onClose={() => setDetailBag(null)} />}
    </>
  );
}
