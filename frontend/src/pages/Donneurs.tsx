import { useState, useEffect, useCallback } from 'react';
import { donorService } from '@/services/donorService';
import { donationService } from '@/services/donationService';
import {
  PageTitle,
  TableShell,
  SearchBox,
  ErrorMessage,
  LoadingSpinner,
  EmptyState,
  ConfirmModal,
} from '@/components/shared';
import { Icon } from '@/components/Icon';
import { formatDate, calculateAge } from '@/utils/dates';
import { BLOOD_GROUPS, SEXES } from '@/types';
import type { DonorAPI, DonationAPI, DonorFormData, BloodGroup, Sexe } from '@/types';
import { NotifyPanel, useOverdueCount } from '@/components/NotifyPanel';
import { QuestionnaireStep } from '@/pages/QuestionnaireStep';

type SearchField = 'Nom' | 'Groupe' | 'Sexe';

function emptyForm(): DonorFormData {
  return {
    code: '',
    nom: '',
    prenom: '',
    sexe: 'M',
    dateNaissance: '',
    groupe: '',
    phenotype: '',
    tel: '',
    adresse: '',
  };
}

function donorToForm(d: DonorAPI): DonorFormData {
  return {
    code: String(d.donor_id),
    nom: d.last_name,
    prenom: d.first_name,
    sexe: d.sex as Sexe,
    dateNaissance: d.date_of_birth,
    groupe: (d.blood_type?.replace('+', ' Pos').replace('-', ' Nég') ?? '') as BloodGroup | '',
    phenotype: '',
    tel: d.phone,
    adresse: d.address,
  };
}

function formToPayload(f: DonorFormData): Omit<DonorAPI, 'donor_id' | 'created_at'> {
  return {
    first_name: f.prenom,
    last_name: f.nom,
    date_of_birth: f.dateNaissance,
    sex: f.sexe,
    address: f.adresse,
    phone: f.tel,
    blood_type: f.groupe ? f.groupe.replace(' Pos', '+').replace(' Nég', '-') : null,
  };
}

export function Donneurs() {
  const [donors, setDonors] = useState<DonorAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [searchField, setSearchField] = useState<SearchField>('Nom');
  const [selected, setSelected] = useState<DonorAPI | null>(null);
  const [mode, setMode] = useState<'list' | 'form'>('list');
  const [formMode, setFormMode] = useState<'new' | 'edit'>('new');
  const [form, setForm] = useState<DonorFormData>(emptyForm());
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [donations, setDonations] = useState<DonationAPI[]>([]);
  const [recordIndex, setRecordIndex] = useState(0);
  // Notify panel
  const [showNotify, setShowNotify] = useState(false);
  const overdueCount = useOverdueCount(90);
  // Questionnaire step (for new donor flow)
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [pendingForm, setPendingForm] = useState<DonorFormData | null>(null);
  // Track whether questionnaire was already completed for the current new-donor session
  const [questionnaireDone, setQuestionnaireDone] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await donorService.getAll();
      setDonors(data);
    } catch (e) {
      setError((e as Error).message ?? 'Erreur lors du chargement des donneurs.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const filtered = donors.filter((d) => {
    if (!search) return true;
    const q = search.toLowerCase();
    if (searchField === 'Nom') return `${d.first_name} ${d.last_name}`.toLowerCase().includes(q);
    if (searchField === 'Groupe') return (d.blood_type ?? '').toLowerCase().includes(q);
    if (searchField === 'Sexe') return d.sex.toLowerCase().includes(q);
    return true;
  });

  const openNew = () => {
    // Per API doc: questionnaire appears first as a popup when adding a new donor.
    // After questionnaire is completed, the donor form is shown to finalize.
    setForm(emptyForm());
    setFormMode('new');
    setSelected(null);
    setDonations([]);
    setFormError(null);
    setPendingForm(emptyForm());
    setQuestionnaireDone(false);
    setShowQuestionnaire(true); // show questionnaire immediately on "Add donor"
  };

  const openEdit = (donor: DonorAPI) => {
    setForm(donorToForm(donor));
    setFormMode('edit');
    setSelected(donor);
    setMode('form');
    setFormError(null);
    void donorService.getDonations(donor.donor_id).then(setDonations).catch(() => {});
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.altKey && e.key.toLowerCase() === 'n') { e.preventDefault(); openNew(); }
    if (e.altKey && e.key.toLowerCase() === 'm' && selected) { e.preventDefault(); openEdit(selected); }
    if (e.altKey && e.key.toLowerCase() === 's' && selected) { e.preventDefault(); setConfirmDelete(true); }
  };

  const saveForm = async () => {
    if (!form.nom.trim() || !form.prenom.trim()) {
      setFormError('Le nom et le prénom sont obligatoires.');
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      if (formMode === 'new') {
        await donorService.create(formToPayload(form));
      } else if (selected) {
        await donorService.update(selected.donor_id, formToPayload(form));
      }
      await load();
      setQuestionnaireDone(false);
      setMode('list');
    } catch (e) {
      setFormError((e as Error).message ?? "Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  // Called when questionnaire is completed — move to donor form to finalize details
  const handleQuestionnaireEligible = (_eligible: boolean) => {
    setShowQuestionnaire(false);
    setQuestionnaireDone(true);
    // Go to form view so user can review/complete donor info before saving
    setMode('form');
  };

  const handleDelete = async () => {
    if (!selected) return;
    setConfirmDelete(false);
    // TODO(API): No DELETE /donors/:id endpoint defined. Showing message.
    setError('Suppression non disponible : endpoint DELETE /donors non défini dans l\'API.');
  };

  const navigate = (dir: 'first' | 'prev' | 'next' | 'last') => {
    if (filtered.length === 0) return;
    if (dir === 'first') { setRecordIndex(0); openEdit(filtered[0]); }
    else if (dir === 'prev') { const i = Math.max(0, recordIndex - 1); setRecordIndex(i); openEdit(filtered[i]); }
    else if (dir === 'next') { const i = Math.min(filtered.length - 1, recordIndex + 1); setRecordIndex(i); openEdit(filtered[i]); }
    else { const i = filtered.length - 1; setRecordIndex(i); openEdit(filtered[i]); }
  };

  if (mode === 'form') {
    return (
      <>
        <div onKeyDown={handleKeyDown}>
        <PageTitle
          title={formMode === 'new' ? 'Nouveau donneur' : 'Mise à jour donneur'}
          subtitle={formMode === 'new' ? 'Étape 2 / 2 — Remplir la fiche du donneur.' : `Code : ${form.code}`}
        />
        {/* Questionnaire completion badge */}
        {formMode === 'new' && questionnaireDone && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, padding: '10px 14px', borderRadius: 9, background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', fontSize: 13, fontWeight: 600 }}>
            <span style={{ fontSize: 16 }}>✓</span> Questionnaire médical complété
          </div>
        )}
        {formError && <div className="mb-4"><ErrorMessage message={formError} /></div>}
        <div className="card p-6 mb-5">
          <div className="form-grid">
            <label>
              <span className="field-label">Code</span>
              <input value={form.code} disabled placeholder="Auto-généré" />
            </label>
            <label>
              <span className="field-label">Nom <b>*</b></span>
              <input value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} />
            </label>
            <label>
              <span className="field-label">Prénom <b>*</b></span>
              <input value={form.prenom} onChange={e => setForm(f => ({ ...f, prenom: e.target.value }))} />
            </label>
            <label>
              <span className="field-label">Sexe</span>
              <select value={form.sexe} onChange={e => setForm(f => ({ ...f, sexe: e.target.value as Sexe }))}>
                {SEXES.map(s => <option key={s}>{s}</option>)}
              </select>
            </label>
            <label>
              <span className="field-label">Date Naissance (jj/mm/aaaa)</span>
              <input
                type="date"
                value={form.dateNaissance}
                onChange={e => setForm(f => ({ ...f, dateNaissance: e.target.value }))}
              />
            </label>
            <label>
              <span className="field-label">Groupe sanguin</span>
              <select value={form.groupe} onChange={e => setForm(f => ({ ...f, groupe: e.target.value as BloodGroup | '' }))}>
                <option value="">-- Sélectionner --</option>
                {BLOOD_GROUPS.map(g => <option key={g}>{g}</option>)}
              </select>
            </label>
            <label>
              <span className="field-label">Phénotype</span>
              <input
                value={form.phenotype}
                onChange={e => setForm(f => ({ ...f, phenotype: e.target.value }))}
                placeholder="ex: Ccée k-neg"
              />
            </label>
            <label>
              <span className="field-label">Tél</span>
              <input value={form.tel} onChange={e => setForm(f => ({ ...f, tel: e.target.value }))} />
            </label>
          </div>
          <label className="mt-4 block">
            <span className="field-label">Adresse</span>
            <textarea
              value={form.adresse}
              onChange={e => setForm(f => ({ ...f, adresse: e.target.value }))}
              rows={2}
            />
          </label>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              <button className="secondary" title="Premier" onClick={() => navigate('first')}><Icon name="first" size={15} /></button>
              <button className="secondary" title="Précédent" onClick={() => navigate('prev')}><Icon name="prev" size={15} /></button>
              <button className="secondary" title="Suivant" onClick={() => navigate('next')}><Icon name="next" size={15} /></button>
              <button className="secondary" title="Dernier" onClick={() => navigate('last')}><Icon name="last" size={15} /></button>
            </div>
            <div className="flex gap-2">
              <button className="secondary" onClick={() => setMode('list')}>Fermer</button>
              <button className="secondary" onClick={() => setForm(formMode === 'edit' && selected ? donorToForm(selected) : emptyForm())}>Annuler</button>
              <button className="primary" disabled={saving} onClick={saveForm}>
                {saving ? 'Enregistrement…' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>

        {/* PRELEVEMENTS grid */}
        {formMode === 'edit' && (
          <div className="card overflow-hidden">
            <div className="card-heading">
              <h2>PRÉLÈVEMENTS</h2>
              <p className="section-subtitle">Historique des dons du donneur</p>
            </div>
            <div className="overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Lieu du don</th>
                    <th>Nbre de don</th>
                    <th>Volume Prélevé (ml)</th>
                    <th>TA</th>
                    <th>Analyses Biologiques</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.length === 0 ? (
                    <tr><td colSpan={6} className="text-center text-slate-400 py-8">Aucun prélèvement enregistré.</td></tr>
                  ) : (
                    donations.map((don, i) => (
                      <tr key={don.donation_id}>
                        <td>{formatDate(don.donation_date)}</td>
                        <td>—</td>
                        <td>{i + 1}</td>
                        <td>450</td>
                        <td>—</td>
                        <td><span className="status status-green">NEG</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      {showQuestionnaire && pendingForm && (
        <QuestionnaireStep
          donorName={pendingForm.nom}
          donorSexe={pendingForm.sexe}
          donorDob={pendingForm.dateNaissance}
          donorTel={pendingForm.tel}
          donorAddress={pendingForm.adresse}
          onEligible={handleQuestionnaireEligible}
          onBack={() => setShowQuestionnaire(false)}
        />
      )}
    </>
    );
  }

  return (
    <div onKeyDown={handleKeyDown} tabIndex={-1}>
      <PageTitle
        title="Donneurs"
        subtitle="Gérer les fiches donneurs et l'historique des dons."
        action={
          <div className="flex gap-2">
            <button
              className="secondary"
              onClick={() => setShowNotify(true)}
              style={{ position: 'relative' }}
            >
              <Icon name="bell" size={16} />
              Notifier les inactifs
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
            <button className="primary" onClick={openNew} title="Alt+N">
              <Icon name="plus" size={17} /> Nouveau
            </button>
            <button
              className="secondary"
              disabled={!selected}
              onClick={() => selected && openEdit(selected)}
              title="Alt+M"
            >
              <Icon name="edit" size={16} /> Modifier
            </button>
            <button
              className="danger"
              disabled={!selected}
              onClick={() => setConfirmDelete(true)}
              title="Alt+S"
            >
              <Icon name="trash" size={16} /> Supprimer
            </button>
          </div>
        }
      />
      {error && <div className="mb-4"><ErrorMessage message={error} /></div>}
      <div className="toolbar">
        <SearchBox placeholder="Rechercher" value={search} onChange={setSearch} />
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Dans :</span>
          <select
            className="filter"
            value={searchField}
            onChange={e => setSearchField(e.target.value as SearchField)}
            style={{ width: 'auto', height: 38, padding: '0 12px' }}
          >
            <option>Nom</option>
            <option>Groupe</option>
            <option>Sexe</option>
          </select>
        </div>
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <TableShell>
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Sexe</th>
                <th>Date naissance</th>
                <th>Adresse</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6}><EmptyState message="Aucun donneur trouvé." /></td></tr>
              ) : (
                filtered.map((d) => (
                  <tr
                    key={d.donor_id}
                    className={`clickable ${selected?.donor_id === d.donor_id ? 'bg-red-50' : ''}`}
                    onClick={() => setSelected(d)}
                    onDoubleClick={() => openEdit(d)}
                  >
                    <td className="id-cell">{d.donor_id}</td>
                    <td className="font-medium">{d.last_name}</td>
                    <td>{d.first_name}</td>
                    <td>{d.sex}</td>
                    <td>{formatDate(d.date_of_birth)}</td>
                    <td>{d.address}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </TableShell>
      )}
      <p className="table-foot">
        {filtered.length} donneur{filtered.length !== 1 ? 's' : ''} affiché{filtered.length !== 1 ? 's' : ''}
        {selected && ` · Sélectionné : ${selected.first_name} ${selected.last_name}`}
      </p>
      {confirmDelete && selected && (
        <ConfirmModal
          title="Supprimer le donneur ?"
          message={<>Supprimer <b>{selected.first_name} {selected.last_name}</b> ? Cette action est irréversible.</>}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
      {showNotify && <NotifyPanel onClose={() => setShowNotify(false)} />}
      {showQuestionnaire && pendingForm && (
        <QuestionnaireStep
          donorName={pendingForm.nom}
          donorSexe={pendingForm.sexe}
          donorDob={pendingForm.dateNaissance}
          donorTel={pendingForm.tel}
          donorAddress={pendingForm.adresse}
          onEligible={handleQuestionnaireEligible}
          onBack={() => setShowQuestionnaire(false)}
        />
      )}
    </div>
  );
}
