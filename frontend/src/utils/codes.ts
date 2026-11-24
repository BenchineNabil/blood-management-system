/** Generate a bag/donor code in number/year format, e.g. "1094/2026" */
export function generateCode(sequence: number, year?: number): string {
  const y = year ?? new Date().getFullYear();
  return `${sequence}/${y}`;
}

/** Extract the numeric sequence from a code like "1093/2026" */
export function parseCode(code: string): { sequence: number; year: number } | null {
  const parts = code.split('/');
  if (parts.length !== 2) return null;
  const sequence = parseInt(parts[0], 10);
  const year = parseInt(parts[1], 10);
  if (isNaN(sequence) || isNaN(year)) return null;
  return { sequence, year };
}
