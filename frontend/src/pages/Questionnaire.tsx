import { useState, useEffect } from 'react';
import { questionnaireService } from '@/services/questionnaireService';
import { PageTitle, ErrorMessage, LoadingSpinner } from '@/components/shared';
import { Icon } from '@/components/Icon';
import { QUESTIONS } from '@/data/questionnaire';
import { SEXES } from '@/types';
import type { QuestionnaireCandidate, QuestionnaireAnswer, Sexe } from '@/types';
import { today } from '@/utils/dates';

function emptyCandidate(): QuestionnaireCandidate {
  return {
    date: today(),
    numeroIdentification: '',
    nomJeuneFille: '',
    prenom: '',
    epouseDe: '',
    neeLe: '',
    lieuNaissance: '',
    adresse: '',
    telephone: '',
    sexe: '',
  };
}

// Questions that may suggest a contraindication when answered Oui
const CONTRAINDICATION_QUESTIONS = new Set([2,3,4,5,6,10,11,12,13,14,15,16,17,19,20,22,24,25,26,27,28,29,30,31,32,33,34,35]);

export function Questionnaire() {
  const [candidate, setCandidate] = useState<QuestionnaireCandidate>(emptyCandidate());
  const [answers, setAnswers] = useState<Map<number, QuestionnaireAnswer>>(new Map());
  const [details, setDetails] = useState<Map<number, string>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [eligible, setEligible] = useState<boolean | null>(null);

  // Conclusion block
  const [aptitudeDon, setAptitudeDon] = useState<boolean | null>(null);
  const [contreDefin, setContreDefin] = useState<boolean | null>(null);
  const [contreTemp, setContreTemp] = useState<boolean | null>(null);
  const [duree, setDuree] = useState('');
  const [identiteMedecin, setIdentiteMedecin] = useState('');

  const setAnswer = (numero: number, rep: 'Oui' | 'Non') => {
    setAnswers(prev => {
      const next = new Map(prev);
      next.set(numero, { questionNumero: numero, reponse: rep });
      return next;
    });
  };

  const setDetail = (numero: number, val: string) => {
    setDetails(prev => { const n = new Map(prev); n.set(numero, val); return n; });
  };

  const isFemale = candidate.sexe === 'F';
  const visibleQuestions = QUESTIONS.filter(q => !q.womenOnly || isFemale);
  const answered = [...answers.values()].filter(a => a.reponse !== null).length;
  const total = visibleQuestions.length;

  // Highlight: any Oui to a contraindication question
  const hasWarning = [...answers.entries()].some(
    ([num, ans]) => ans.reponse === 'Oui' && CONTRAINDICATION_QUESTIONS.has(num)
  );

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload: Record<number, string> = {};
      answers.forEach((v, k) => { if (v.reponse) payload[k] = v.reponse; });
      const result = await questionnaireService.validate({ answers: payload });
      setEligible(result.eligible);
      setSubmitted(true);
    } catch (e) {
      setError((e as Error).message ?? 'Erreur lors de la validation.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setCandidate(emptyCandidate());
    setAnswers(new Map());
    setDetails(new Map());
    setSubmitted(false);
    setEligible(null);
    setAptitudeDon(null);
    setContreDefin(null);
    setContreTemp(null);
    setDuree('');
    setIdentiteMedecin('');
    setError(null);
  };

  const sections = [
    { key: 'A', label: 'Section A — État de santé' },
    { key: 'B-1', label: 'Section B-1 — Voyages' },
    { key: 'B-2', label: 'Section B-2 — Soins et antécédents' },
    { key: 'B-3', label: 'Section B-3 — Exposition sanguine ou sexuelle' },
  ];

  return (
    <>
      <PageTitle
        title="Questionnaire Médical Type"
        subtitle="Évaluation médicale préalable au don de sang."
        action={
          <div className="flex gap-2">
            <button className="secondary" onClick={reset}>Réinitialiser</button>
          </div>
        }
      />
      {error && <div className="mb-4"><ErrorMessage message={error} /></div>}
      {hasWarning && !submitted && (
        <div className="mb-4 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          <Icon name="alert" size={18} />
          Certaines réponses peuvent indiquer une contre-indication. La décision finale revient au médecin.
        </div>
      )}

      {/* Identification candidat */}
      <div className="card p-6 mb-5">
        <h2 className="mb-4">Identification du candidat</h2>
        <div className="form-grid">
          <label><span className="field-label">Date</span><input type="date" value={candidate.date} onChange={e => setCandidate(c => ({ ...c, date: e.target.value }))} /></label>
          <label><span className="field-label">N° d'identification</span><input value={candidate.numeroIdentification} onChange={e => setCandidate(c => ({ ...c, numeroIdentification: e.target.value }))} /></label>
          <label><span className="field-label">Nom (jeune fille)</span><input value={candidate.nomJeuneFille} onChange={e => setCandidate(c => ({ ...c, nomJeuneFille: e.target.value }))} /></label>
          <label><span className="field-label">Prénom</span><input value={candidate.prenom} onChange={e => setCandidate(c => ({ ...c, prenom: e.target.value }))} /></label>
          <label><span className="field-label">Épouse de</span><input value={candidate.epouseDe} onChange={e => setCandidate(c => ({ ...c, epouseDe: e.target.value }))} /></label>
          <label><span className="field-label">Né(e) le</span><input type="date" value={candidate.neeLe} onChange={e => setCandidate(c => ({ ...c, neeLe: e.target.value }))} /></label>
          <label><span className="field-label">à (lieu de naissance)</span><input value={candidate.lieuNaissance} onChange={e => setCandidate(c => ({ ...c, lieuNaissance: e.target.value }))} /></label>
          <label><span className="field-label">Téléphone</span><input value={candidate.telephone} onChange={e => setCandidate(c => ({ ...c, telephone: e.target.value }))} /></label>
          <label><span className="field-label">Sexe</span>
            <select value={candidate.sexe} onChange={e => setCandidate(c => ({ ...c, sexe: e.target.value as Sexe | '' }))}>
              <option value="">-- Sélectionner --</option>
              {SEXES.map(s => <option key={s}>{s}</option>)}
            </select>
          </label>
        </div>
        <label className="mt-4 block"><span className="field-label">Adresse</span><textarea value={candidate.adresse} onChange={e => setCandidate(c => ({ ...c, adresse: e.target.value }))} rows={2} /></label>
      </div>

      {/* Questions par section */}
      {sections.map(sec => {
        const sectionQs = visibleQuestions.filter(q => q.section === sec.key);
        if (sectionQs.length === 0) return null;
        return (
          <div className="card overflow-hidden mb-5" key={sec.key}>
            <div className="card-heading">
              <h2>{sec.label}</h2>
              <span className="question-progress">{sectionQs.filter(q => answers.has(q.numero)).length}/{sectionQs.length}</span>
            </div>
            {/* Sub-heading for Q29-31 */}
            {sec.key === 'B-2' && (
              <div className="px-5 pt-4 pb-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">Au cours de votre vie (Q29–31)</div>
            )}
            {sectionQs.map(q => {
              const ans = answers.get(q.numero);
              const isOui = ans?.reponse === 'Oui';
              const isContra = isOui && CONTRAINDICATION_QUESTIONS.has(q.numero);
              return (
                <div key={q.numero}>
                  <div className={`question-row ${isContra ? 'bg-amber-50' : ''}`}>
                    <div>
                      <span>{q.numero}</span>
                      <div>
                        <p>{q.texte}</p>
                        {q.note && <p className="text-xs text-amber-600 mt-1">⚠ {q.note}</p>}
                        {q.womenOnly && <p className="text-xs text-slate-400 mt-1">Pour les femmes</p>}
                      </div>
                    </div>
                    <div className="answer-options">
                      {(['Oui', 'Non'] as const).map(opt => (
                        <button
                          key={opt}
                          className={ans?.reponse === opt ? 'selected' : ''}
                          onClick={() => setAnswer(q.numero, opt)}
                          disabled={submitted}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                  {q.detailIfOui && isOui && (
                    <div className="px-5 pb-4 bg-amber-50/40">
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

      {/* Conclusion médicale */}
      <div className="card p-6 mb-5">
        <h2 className="mb-4">Conclusion médicale</h2>
        <div className="form-grid">
          <label>
            <span className="field-label">Aptitude au don de sang</span>
            <select value={aptitudeDon === null ? '' : aptitudeDon ? 'Oui' : 'Non'} onChange={e => setAptitudeDon(e.target.value === 'Oui' ? true : e.target.value === 'Non' ? false : null)}>
              <option value="">--</option>
              <option>Oui</option>
              <option>Non</option>
            </select>
          </label>
          <label>
            <span className="field-label">Contre-indication définitive</span>
            <select value={contreDefin === null ? '' : contreDefin ? 'Oui' : 'Non'} onChange={e => setContreDefin(e.target.value === 'Oui' ? true : e.target.value === 'Non' ? false : null)}>
              <option value="">--</option>
              <option>Oui</option>
              <option>Non</option>
            </select>
          </label>
          <label>
            <span className="field-label">Contre-indication temporaire</span>
            <select value={contreTemp === null ? '' : contreTemp ? 'Oui' : 'Non'} onChange={e => setContreTemp(e.target.value === 'Oui' ? true : e.target.value === 'Non' ? false : null)}>
              <option value="">--</option>
              <option>Oui</option>
              <option>Non</option>
            </select>
          </label>
          <label>
            <span className="field-label">Durée {!contreTemp && '(désactivé)'}</span>
            <input value={duree} disabled={!contreTemp} onChange={e => setDuree(e.target.value)} placeholder="ex: 3 mois" />
          </label>
        </div>
        <label className="mt-4 block">
          <span className="field-label">Identité du médecin du don et signature</span>
          <input value={identiteMedecin} onChange={e => setIdentiteMedecin(e.target.value)} placeholder="Nom, prénom, cachet…" />
        </label>
      </div>

      {/* Submit */}
      <div className="question-actions">
        {submitted ? (
          <div className={`inline-flex items-center gap-2 rounded-lg px-5 py-3 font-semibold text-sm ${eligible ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            <Icon name={eligible ? 'check' : 'x'} size={18} />
            {eligible ? 'Résultat préliminaire : Éligible' : 'Résultat préliminaire : Non éligible'}
            <span className="ml-2 font-normal text-xs opacity-70">— La décision finale revient au médecin.</span>
          </div>
        ) : (
          <button
            className="primary"
            disabled={answered < total || loading}
            onClick={handleSubmit}
          >
            {loading ? 'Validation…' : <>Soumettre le questionnaire <Icon name="arrow" size={16} /></>}
          </button>
        )}
        <span className="ml-4 text-xs text-slate-400">{answered}/{total} réponses</span>
      </div>
    </>
  );
}
