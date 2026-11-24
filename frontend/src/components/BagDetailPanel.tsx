// ─── BagDetailPanel ──────────────────────────────────────────────────────────
// Slide-in panel showing all details of a blood bag.
// Shows only the donation data + donor ID reference.
// Full donor info lives in the Donors page (donor history).

import type { ReactNode } from 'react';
import { useT } from '@/i18n';
import { Icon } from '@/components/Icon';
import { Status } from '@/components/shared';
import { formatDate, calculateAge } from '@/utils/dates';
import type { BagAPI } from '@/types';

interface Props {
  bag: BagAPI;
  onClose: () => void;
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '10px 0', borderBottom: '1px solid #f1f3f7',
    }}>
      <span style={{ fontSize: 11, color: '#8a94a5', minWidth: 150 }}>{label}</span>
      <span style={{ fontSize: 13, color: '#344054', textAlign: 'right', fontWeight: 500 }}>{value}</span>
    </div>
  );
}

export function BagDetailPanel({ bag, onClose }: Props) {
  const { t } = useT();
  const age = calculateAge(bag.dateNaissance, bag.datePrelevement);

  return (
    <>
      {/* No background overlay — panel slides in without darkening the table */}
      <div
        className="side-panel"
        style={{ width: 'min(460px, 94vw)', borderLeft: '1px solid #e9edf1' }}
      >
        {/* Header */}
        <div className="panel-header">
          <div>
            <p className="eyebrow">{t('bags_title')}</p>
            <h2>{t('bags_details')}</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label={t('close')}>
            <Icon name="x" size={20} />
          </button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1 }}>
          {/* Bag number + status banner */}
          <div style={{
            padding: '14px 20px', background: '#fdf2f3', borderBottom: '1px solid #f1e3e4',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              background: '#c62e3a', color: '#fff', borderRadius: 10,
              padding: '6px 16px', fontSize: 15, fontWeight: 700, letterSpacing: '0.3px',
            }}>
              {bag.numero}
            </div>
            <Status>{bag.status}</Status>
          </div>

          {/* Bag details */}
          <div className="panel-section">
            <p style={{ fontSize: 11, fontWeight: 700, color: '#c62e3a', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 10 }}>
              Poche de sang
            </p>
            <Row label={t('bags_numero')}    value={bag.numero} />
            <Row label={t('bags_groupage')}  value={<b className="blood-chip">{bag.groupage}</b>} />
            <Row label={t('bags_date_prel')} value={formatDate(bag.datePrelevement)} />
            <Row label={t('bags_expiry')}    value={formatDate(bag.datePeremption)} />
            <Row label={t('bags_type')}      value={bag.type} />
            <Row label={t('bags_site')}      value={bag.site} />
            <Row label={t('bags_sexe')}      value={bag.sexe} />
            <Row label={t('bags_age')}       value={`${age} ans`} />
            <Row label={t('bags_status')}    value={<Status>{bag.status}</Status>} />
            {bag.dateSortie && <Row label={t('bags_issue_date')} value={formatDate(bag.dateSortie)} />}
            {bag.service    && <Row label={t('bags_service')}    value={bag.service} />}
          </div>

          {/* Donor reference — ID only */}
          <div className="panel-section">
            <p style={{ fontSize: 11, fontWeight: 700, color: '#c62e3a', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 10 }}>
              {t('bags_donor')}
            </p>
            <Row
              label="ID donneur"
              value={
                bag.donorId && bag.donorId !== 0
                  ? <span style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 700, color: '#c62e3a' }}>#{bag.donorId}</span>
                  : <span style={{ color: '#b0b8c6' }}>—</span>
              }
            />
            <p style={{ fontSize: 11, color: '#a0a8b6', marginTop: 10, lineHeight: 1.6 }}>
              Pour consulter les informations complètes du donneur et son historique de dons, ouvrez la page <strong>Donneurs</strong>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
