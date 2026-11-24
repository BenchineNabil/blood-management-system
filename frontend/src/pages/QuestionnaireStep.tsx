// ─── QuestionnaireStep ───────────────────────────────────────────────────────
// Embeddable questionnaire modal used inside the "Nouveau donneur" workflow.
// Per API doc: "questionnaire will appear as a popup inside the Add Donor form".
// After successful validation → parent calls onEligible(eligible) to continue.

import { useState } from 'react';
import { questionnaireService } from '@/services/questionnaireService';
import { Icon } from '@/components/Icon';
import { ErrorMessage } from '@/components/shared';
import { QUESTIONS } from '@/data/questionnaire';
import { SEXES } from '@/types';
import type { QuestionnaireCandidate, Sexe } from '@/types';
import { today } from '@/utils/dates';

interface Props {
  /** Pre-filled from the donor form */
  donorName?: string;
  donorSexe?: Sexe | '';
  donorDob?: string;
  donorTel?: string;
  donorAddress?: string;
  /** Called when user submits; passes eligibility result */
  onEligible: (eligible: boolean) => void;
  /** Called when user cancels (goes back to form) */
  onBack: () => void;
}

const CONTRAINDICATION_QUESTIONS = new Set([2,3,4,5,6,10,11,12,13,14,15,16,17,19,20,22,24,25,26,27,28,29,30,31,32,33,34,35]);

function emptyCandidate(props: Props): QuestionnaireCandidate {
  return {
    date: today(),
    numeroIdentification: '',
    nomJeuneFille: props.donorName ?? '',
    prenom: '',
    epouseDe: '',
    neeLe: props.donorDob ?? '',
    lieuNaissance: '',
    adresse: props.donorAddress ?? '',
    telephone: props.donorTel ?? '',
    sexe: props.donorSexe ?? '',
  };
}

export function QuestionnaireStep(props: Props) {
  const [candidate, setCandidate] = useState<QuestionnaireCandidate>(() => emptyCandidate(props));
  const [answers, setAnswers] = useState<Map<number, 'Oui' | 'Non'>>(new Map());
  const [details, setDetails] = useState<Map<number, string>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [eligible, setEligible] = useState<boolean | null>(null);

  const isFemale = candidate.sexe === 'F';
  const visibleQuestions = QUESTIONS.filter(q => !q.womenOnly || isFemale);
  const answered = [...answers.keys()].filter(k => visibleQuestions.some(q => q.numero === k)).length;
  const total = visibleQuestions.length;

  const hasWarning = [...answers.entries()].some(
    ([num, rep]) => rep === 'Oui' && CONTRAINDICATION_QUESTIONS.has(num)
  );

  const setAnswer = (numero: number, rep: 'Oui' | 'Non') => {
    setAnswers(prev => { const n = new Map(prev); n.set(numero, rep); return n; });
  };

  const setDetail = (numero: number, val: string) => {
    setDetails(prev => { const n = new Map(prev); n.set(numero, val); return n; });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload: Record<number, string> = {};
      answers.forEach((rep, num) => { payload[num] = rep; });
      const result = await questionnaireService.validate({ answers: payload });
      setEligible(result.eligible);
      setSubmitted(true);
    } catch (e) {
      setError((e as Error).message ?? 'Erreur lors de la validation.');
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { key: 'A', label: 'Section A — État de santé' },
    { key: 'B-1', label: 'Section B-1 — Voyages' },
    { key: 'B-2', label: 'Section B-2 — Soins et antécédents' },
    { key: 'B-3', label: 'Section B-3 — Exposition sanguine ou sexuelle' },
  ];

  return (
    <>
      {/* Full-screen overlay */}
      <div
        style={{
          position: 'fixed', inset: 0, background: 'rgba(13,20,38,0.45)',
          zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          overflowY: 'auto', padding: '24px 16px',
        }}
        onClick={e => { if (e.target === e.currentTarget) props.onBack(); }}
      >
        <div style={{ width: 'min(760px, 100%)', background: '#fff', borderRadius: 16, boxShadow: '0 24px 64px rgba(0,0,0,0.18)', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f2f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fdf2f3' }}>
            <div>
              <p style={{ fontSize: 11, color: '#c62e3a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', margin: 0 }}>Étape 2 / 2</p>
              <h2 style={{ margin: '2px 0 0', fontSize: 16, color: '#172033' }}>Questionnaire médical préalable</h2>
            </div>
            <button
              onClick={props.onBack}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8a94a5', padding: 4 }}
              aria-label="Retour"
            >
              <Icon name="x" size={20} />
            </button>
          </div>

          <div style={{ padding: '20px 24px', maxHeight: '70vh', overflowY: 'auto' }}>
            {error && <div className="mb-4"><ErrorMessage message={error} /></div>}

            {hasWarning && !submitted && (
              <div className="mb-4" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 8, border: '1px solid #fed7aa', background: '#fff7ed', color: '#c05a1a', fontSize: 13 }}>
                <Icon name="alert" size={17} />
                Certaines réponses peuvent indiquer une contre-indication. La décision finale revient au médecin.
              </div>
            )}

            {/* Candidate ID (pre-filled, editable) */}
            <div className="card p-5 mb-5">
              <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Identification du candidat</h3>
              <div className="form-grid">
                <label><span className="field-label">Nom</span><input value={candidate.nomJeuneFille} onChange={e => setCandidate(c => ({ ...c, nomJeuneFille: e.target.value }))} /></label>
                <label><span className="field-label">Prénom</span><input value={candidate.prenom} onChange={e => setCandidate(c => ({ ...c, prenom: e.target.value }))} /></label>
                <label>
                  <span className="field-label">Sexe</span>
                  <select value={candidate.sexe} onChange={e => setCandidate(c => ({ ...c, sexe: e.target.value as Sexe | '' }))}>
                    <option value="">-- Sélectionner --</option>
                    {SEXES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </label>
                <label><span className="field-label">Né(e) le</span><input type="date" value={candidate.neeLe} onChange={e => setCandidate(c => ({ ...c, neeLe: e.target.value }))} /></label>
                <label><span className="field-label">Téléphone</span><input value={candidate.telephone} onChange={e => setCandidate(c => ({ ...c, telephone: e.target.value }))} /></label>
                <label><span className="field-label">Date</span><input type="date" value={candidate.date} onChange={e => setCandidate(c => ({ ...c, date: e.target.value }))} /></label>
              </div>
            </div>

            {/* Questions */}
            {sections.map(sec => {
              const sectionQs = visibleQuestions.filter(q => q.section === sec.key);
              if (sectionQs.length === 0) return null;
              return (
                <div className="card overflow-hidden mb-4" key={sec.key}>
                  <div className="card-heading">
                    <h2>{sec.label}</h2>
                    <span className="question-progress">{sectionQs.filter(q => answers.has(q.numero)).length}/{sectionQs.length}</span>
                  </div>
                  {sectionQs.map(q => {
                    const rep = answers.get(q.numero);
                    const isOui = rep === 'Oui';
                    const isContra = isOui && CONTRAINDICATION_QUESTIONS.has(q.numero);
                    return (
                      <div key={q.numero}>
                        <div className={`question-row ${isContra ? 'bg-amber-50' : ''}`}>
                          <div>
                            <span>{q.numero}</span>
                            <div>
                              <p>{q.texte}</p>
                              {q.womenOnly && <p style={{ fontSize: 11, color: '#98a1b0', marginTop: 2 }}>Pour les femmes</p>}
                            </div>
                          </div>
                          <div className="answer-options">
                            {(['Oui', 'Non'] as const).map(opt => (
                              <button
                                key={opt}
                                className={rep === opt ? 'selected' : ''}
                                onClick={() => setAnswer(q.numero, opt)}
                                disabled={submitted}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                        {q.detailIfOui && isOui && (
                          <div style={{ padding: '0 20px 12px', background: '#fffbf0' }}>
                            <label>
                              <span className="field-label">Si oui, préciser :</span>
                              <input
                                value={details.get(q.numero) ?? ''}
                                onChange={e => setDetail(q.numero, e.target.value)}
                                disabled={submitted}
                                placeholder="Préciser…"
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div style={{ padding: '16px 24px', borderTop: '1px solid #f0f2f6', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {submitted && eligible !== null && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px',
                  borderRadius: 8, fontSize: 13, fontWeight: 600,
                  background: eligible ? '#f0fdf4' : '#fff1f2',
                  color: eligible ? '#166534' : '#b42336',
                  border: `1px solid ${eligible ? '#bbf7d0' : '#fcc8cc'}`,
                }}>
                  <Icon name={eligible ? 'check' : 'x'} size={16} />
                  {eligible ? 'Éligible au don' : 'Non éligible au don'}
                </div>
              )}
              <span style={{ fontSize: 11, color: '#8a94a5' }}>{answered}/{total} réponses</span>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="secondary" onClick={props.onBack}>
                <Icon name="x" size={15} /> Annuler
              </button>
              {!submitted ? (
                <button
                  className="primary"
                  disabled={answered < total || loading}
                  onClick={handleSubmit}
                >
                  {loading ? 'Validation…' : 'Soumettre le questionnaire'}
                </button>
              ) : (
                <button
                  className="primary"
                  onClick={() => props.onEligible(eligible ?? false)}
                >
                  <Icon name="check" size={16} />
                  Continuer vers la fiche donneur
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
