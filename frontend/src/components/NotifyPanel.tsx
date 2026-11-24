// Notify panel — shared between Dashboard and Donors page
// Computes overdue donors client-side from donation history.
// TODO(API): No /notify or /reminders endpoint exists in the API doc.
// The backend README mentions a "Reminders" module — wire this up when available.

import { useState, useEffect } from 'react';
import { donorService } from '@/services/donorService';
import { donationService } from '@/services/donationService';
import { useT } from '@/i18n';
import { Icon } from '@/components/Icon';
import { formatDate } from '@/utils/dates';
import type { DonorAPI, DonationAPI } from '@/types';

interface OverdueDonor {
  donor: DonorAPI;
  lastDonation: DonationAPI | null;
  daysSince: number;
}

function computeOverdue(
  donors: DonorAPI[],
  donations: DonationAPI[],
  thresholdDays: number,
): OverdueDonor[] {
  const now = Date.now();
  return donors
    .map((donor) => {
      const donorDonations = donations
        .filter((d) => d.donor_id === donor.donor_id)
        .sort((a, b) => b.donation_date.localeCompare(a.donation_date));
      const last = donorDonations[0] ?? null;
      const lastMs = last ? new Date(last.donation_date).getTime() : 0;
      const daysSince = Math.floor((now - lastMs) / 86_400_000);
      return { donor, lastDonation: last, daysSince };
    })
    .filter((o) => o.daysSince >= thresholdDays)
    .sort((a, b) => b.daysSince - a.daysSince);
}

export function NotifyPanel({ onClose }: { onClose: () => void }) {
  const { t } = useT();
  const [donors, setDonors] = useState<DonorAPI[]>([]);
  const [donations, setDonations] = useState<DonationAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [thresholdMonths, setThresholdMonths] = useState(3);
  const [notified, setNotified] = useState<Set<number>>(new Set());

  useEffect(() => {
    setLoading(true);
    Promise.all([donorService.getAll(), donationService.getAll()])
      .then(([d, don]) => { setDonors(d); setDonations(don); })
      .catch(() => setError(t('error_load')))
      .finally(() => setLoading(false));
  }, [t]);

  const thresholdDays = thresholdMonths * 30;
  const overdue = computeOverdue(donors, donations, thresholdDays);

  return (
    <>
      <div className="modal-overlay" onClick={onClose} style={{ background: 'transparent' }} />
      <div className="side-panel" style={{ width: 'min(560px, 94vw)', borderLeft: '1px solid #e9edf1' }}>
        <div className="panel-header">
          <div>
            <p className="eyebrow">{t('bell_title')}</p>
            <h2>{t('notify_title')}</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label={t('close')}>
            <Icon name="x" size={20} />
          </button>
        </div>

        {/* Info banner — no backend notification endpoint */}
        <div className="privacy-banner" style={{ margin: '16px 20px 0', borderRadius: 8 }}>
          <Icon name="alert" size={18} />
          <p style={{ fontSize: 11, lineHeight: 1.6 }}>{t('notify_info')}</p>
        </div>

        {/* Threshold selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px' }}>
          <label className="field-label" style={{ margin: 0, whiteSpace: 'nowrap' }}>
            {t('notify_threshold')} :
          </label>
          {[1, 2, 3, 6, 12].map((m) => (
            <button
              key={m}
              onClick={() => setThresholdMonths(m)}
              style={{
                height: 30, padding: '0 11px', borderRadius: 7, border: '1px solid',
                borderColor: thresholdMonths === m ? '#c62e3a' : '#dfe4eb',
                background: thresholdMonths === m ? '#fff1f2' : '#fff',
                color: thresholdMonths === m ? '#b62531' : '#5d6879',
                fontSize: 11, fontWeight: 600, cursor: 'pointer',
              }}
            >
              {m}m
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex min-h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-200 border-t-red-600" />
          </div>
        )}
        {error && <div style={{ padding: '0 20px' }}><p className="text-sm text-red-600">{error}</p></div>}

        {!loading && !error && overdue.length === 0 && (
          <div style={{ padding: '32px 20px', textAlign: 'center', color: '#8a94a5', fontSize: 13 }}>
            <Icon name="check" size={32} className="mx-auto mb-3 text-green-500" />
            <p>{t('notify_none')}</p>
          </div>
        )}

        {!loading && overdue.length > 0 && (
          <div style={{ overflowY: 'auto', flex: 1 }}>
            <div style={{ padding: '0 20px 8px', fontSize: 11, color: '#8a94a5' }}>
              {overdue.length} donneur{overdue.length > 1 ? 's' : ''} inactif{overdue.length > 1 ? 's' : ''} depuis &gt; {thresholdMonths} mois
            </div>
            {overdue.map(({ donor, lastDonation, daysSince }) => {
              const isNotified = notified.has(donor.donor_id);
              return (
                <div key={donor.donor_id} className="panel-section" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div className="avatar" style={{ flex: 'none', background: isNotified ? '#d1fae5' : '#fde8ea', color: isNotified ? '#065f46' : '#9b1c28' }}>
                    {donor.first_name[0]}{donor.last_name[0]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 650, fontSize: 13, color: '#344054' }}>
                      {donor.first_name} {donor.last_name}
                    </p>
                    <p style={{ fontSize: 11, color: '#8a94a5', marginTop: 2 }}>
                      {t('notify_last_donation')} : {lastDonation ? formatDate(lastDonation.donation_date) : '—'}
                      {' · '}{daysSince} {t('notify_days_since').split(' ').slice(-3).join(' ')}
                    </p>
                    <p style={{ fontSize: 11, color: '#8a94a5' }}>{donor.phone}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 650, padding: '3px 8px', borderRadius: 10,
                      background: isNotified ? '#d1fae5' : '#fff1f2',
                      color: isNotified ? '#065f46' : '#b42336',
                    }}>
                      {isNotified ? '✓ Notifié' : `${daysSince}j`}
                    </span>
                    {!isNotified && (
                      <button
                        style={{ fontSize: 10, fontWeight: 600, color: '#c62e3a', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        onClick={() => setNotified(prev => new Set([...prev, donor.donor_id]))}
                      >
                        {t('notify_action')}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

// Hook used by Dashboard and Donors to get the overdue count for the badge
export function useOverdueCount(thresholdDays = 90): number {
  const [count, setCount] = useState(0);
  useEffect(() => {
    Promise.all([donorService.getAll(), donationService.getAll()])
      .then(([donors, donations]) => {
        setCount(computeOverdue(donors, donations, thresholdDays).length);
      })
      .catch(() => {});
  }, [thresholdDays]);
  return count;
}
