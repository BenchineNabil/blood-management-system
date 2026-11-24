import type { ReactNode } from 'react';

export function PageTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-7 flex items-end justify-between gap-5">
      <div>
        <h1>{title}</h1>
        <p className="mt-1.5 text-sm text-slate-500">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

export function TableShell({ children }: { children: ReactNode }) {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export function SearchBox({
  placeholder = 'Rechercher…',
  value,
  onChange,
}: {
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
}) {
  return (
    <label className="search-box">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" />
      </svg>
      <input
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </label>
  );
}

export function Status({ children }: { children: ReactNode }) {
  const label = String(children);
  const tone = ['Disponible', 'Éligible', 'NEG'].includes(label)
    ? 'green'
    : ['Périmé', 'Non éligible', 'Critique'].includes(label)
      ? 'red'
      : ['OCC', 'REC'].includes(label)
        ? 'amber'
        : label === 'Sorti'
          ? 'purple'
          : 'blue';
  return <span className={`status status-${tone}`}>{children}</span>;
}

export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {message}
    </div>
  );
}

export function LoadingSpinner() {
  return (
    <div className="flex min-h-48 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-200 border-t-red-600" />
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-2 text-slate-400">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M12 2.8S5.5 10 5.5 15.3a6.5 6.5 0 0 0 13 0C18.5 10 12 2.8 12 2.8Z" />
      </svg>
      <p className="text-sm">{message}</p>
    </div>
  );
}

export function ConfirmModal({
  title,
  message,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <>
      <div className="modal-overlay" onClick={onCancel} />
      <div className="modal" role="dialog" aria-modal="true">
        <div className="warning-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10.3 3.8 2.5 18a2 2 0 0 0 1.8 3h15.4a2 2 0 0 0 1.8-3L13.7 3.8a2 2 0 0 0-3.4 0Z" />
            <path d="M12 9v4M12 17h.01" />
          </svg>
        </div>
        <h2>{title}</h2>
        <p className="modal-copy">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button className="secondary" onClick={onCancel}>Annuler</button>
          <button className="danger" onClick={onConfirm}>Supprimer</button>
        </div>
      </div>
    </>
  );
}
