import { useState } from 'react';
import { settingsService } from '@/services/settingsService';
import { PageTitle, ErrorMessage } from '@/components/shared';
import { Icon } from '@/components/Icon';
import { useEffect } from 'react';

export function Parametres() {
  const [duree, setDuree] = useState(35);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    void settingsService.get().then(s => { setDuree(s.dureePeremptionJours); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await settingsService.update({ dureePeremptionJours: duree });
      setSuccess(true);
    } catch (e) {
      setError((e as Error).message ?? 'Erreur lors de l\'enregistrement.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageTitle title="Paramètres" subtitle="Configuration générale du système." />
      <div className="card p-6 max-w-md">
        <h2 className="mb-4">Durée de péremption</h2>
        {error && <div className="mb-4"><ErrorMessage message={error} /></div>}
        {success && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            Paramètres enregistrés avec succès.
          </div>
        )}
        <label>
          <span className="field-label">Durée de péremption (jours) <b>*</b></span>
          <input
            type="number"
            min={1}
            max={365}
            value={duree}
            disabled={loading}
            onChange={e => setDuree(parseInt(e.target.value, 10))}
          />
        </label>
        <p className="mt-2 text-xs text-slate-400">
          Cette durée est appliquée automatiquement aux nouveaux prélèvements (date péremption = date prélèvement + durée).
          Les poches existantes ne sont pas affectées.
        </p>
        <div className="mt-5">
          <button className="primary" disabled={saving || loading} onClick={save}>
            {saving ? 'Enregistrement…' : <><Icon name="check" size={16} /> Enregistrer</>}
          </button>
        </div>
      </div>
    </>
  );
}
