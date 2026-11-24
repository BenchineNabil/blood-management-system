// ─── Date utilities ───────────────────────────────────────────────────────────

/** Format an ISO date string as dd/mm/yyyy for display */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(`${iso.slice(0, 10)}T12:00:00`);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/** Add days to an ISO date string and return ISO date */
export function addDays(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T12:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Calculate age in full years from an ISO birth date and reference date */
export function calculateAge(dateNaissance: string, referenceDate?: string): number {
  const ref = referenceDate ? new Date(`${referenceDate}T12:00:00`) : new Date();
  const dob = new Date(`${dateNaissance}T12:00:00`);
  if (isNaN(dob.getTime())) return 0;
  let age = ref.getFullYear() - dob.getFullYear();
  const m = ref.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && ref.getDate() < dob.getDate())) age--;
  return age;
}

/** Convert a dd/mm/yyyy display string to ISO yyyy-mm-dd */
export function parseFrDate(display: string): string {
  const parts = display.split('/');
  if (parts.length !== 3) return '';
  const [dd, mm, yyyy] = parts;
  return `${yyyy}-${mm}-${dd}`;
}

/** Return today as ISO date yyyy-mm-dd */
export function today(): string {
  return new Date().toISOString().slice(0, 10);
}
