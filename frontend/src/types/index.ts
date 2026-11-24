// ─── Shared constants ────────────────────────────────────────────────────────

export const BLOOD_GROUPS = [
  'O Pos',
  'O Nég',
  'A Pos',
  'A Nég',
  'B Pos',
  'B Nég',
  'AB Pos',
  'AB Nég',
] as const;

export type BloodGroup = (typeof BLOOD_GROUPS)[number];

export const SEXES = ['M', 'F'] as const;
export type Sexe = (typeof SEXES)[number];

export const SITES = ['Fixe', 'Mobile'] as const;
export type Site = (typeof SITES)[number];

export const TYPES_DON = ['Rég', 'Occ'] as const;
export type TypeDon = (typeof TYPES_DON)[number];

export const ANALYSES_STATUS = ['NEG', 'REC', 'OCC'] as const;
export type AnalysesStatus = (typeof ANALYSES_STATUS)[number];

export const BAG_STATUS = ['Disponible', 'Sorti', 'Périmé'] as const;
export type BagStatus = (typeof BAG_STATUS)[number];

// Services list – TODO(API): The API document does not define a /services endpoint or a fixed list.
// Using a seeded list from the PDF examples. Backend team should confirm the full list.
export const SERVICES = [
  'Périmé',
  'Clinique',
  'EH',
  'Urgences Médico-Chir',
  'Médecine Infantile',
] as const;
export type Service = (typeof SERVICES)[number];

// ─── Donor ───────────────────────────────────────────────────────────────────

/** API request/response shape for a donor (matches /donors endpoint) */
export interface DonorAPI {
  donor_id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string; // ISO date
  sex: 'M' | 'F';
  address: string;
  phone: string;
  blood_type: string | null;
  created_at: string;
}

/** Extended donor fields from the PDF (beyond the DB schema) */
export interface DonorFormData {
  code: string; // e.g. "3/09"
  nom: string;
  prenom: string;
  sexe: Sexe;
  dateNaissance: string; // ISO date
  groupe: BloodGroup | '';
  phenotype: string;
  tel: string;
  adresse: string;
}

/** Donor as displayed in the UI */
export interface Donneur extends DonorFormData {
  id: number;
  createdAt: string;
}

// ─── Donation (Prélèvement) ───────────────────────────────────────────────────

/** API shape for a donation */
export interface DonationAPI {
  donation_id: number;
  donor_id: number;
  donation_date: string; // ISO datetime
}

/** Donation row displayed inside donor's PRELEVEMENTS grid */
export interface PrelevementRow {
  date: string;
  lieuDuDon: string;
  nbreDon: number; // n-th donation, auto-computed
  volumePreLeve: number; // ml
  ta: string; // e.g. "13/07"
  analysesBiologiques: AnalysesStatus;
}

// ─── Blood Bag (Poche) ────────────────────────────────────────────────────────

/** API shape for a blood bag/donation */
export interface BagAPI {
  id: number;
  numero: string; // e.g. "1093/2026"
  datePrelevement: string; // ISO date
  dateNaissance: string; // ISO date
  sexe: Sexe;
  site: Site;
  type: TypeDon;
  groupage: BloodGroup;
  datePeremption: string; // ISO date
  dateSortie: string | null; // ISO date
  service: string | null;
  status: BagStatus;
  donorId: number;
}

/** Form data for adding a new bag */
export interface BagFormData {
  code: string;
  datePrelevement: string;
  groupage: BloodGroup | '';
  dateNaissance: string;
  sexe: Sexe | '';
  type: TypeDon | '';
  site: Site | '';
}

// ─── Questionnaire ───────────────────────────────────────────────────────────

export type QuestionType = 'oui_non' | 'text';

export interface Question {
  numero: number;
  section: string;
  texte: string;
  type: QuestionType;
  detailIfOui?: boolean; // show text field when answer is Oui
  womenOnly?: boolean; // only shown / relevant for female donors
  note?: string; // internal note (e.g. duplicate warning)
}

export interface QuestionnaireCandidate {
  date: string;
  numeroIdentification: string;
  nomJeuneFille: string;
  prenom: string;
  epouseDe: string;
  neeLe: string;
  lieuNaissance: string;
  adresse: string;
  telephone: string;
  sexe: Sexe | '';
}

export interface QuestionnaireAnswer {
  questionNumero: number;
  reponse: 'Oui' | 'Non' | null;
  detail?: string;
}

export interface QuestionnaireMedical {
  candidate: QuestionnaireCandidate;
  answers: QuestionnaireAnswer[];
  aptitudeDon: boolean | null;
  contreIndicationDefinitive: boolean | null;
  contreIndicationTemporaire: boolean | null;
  duree: string;
  identiteMedecin: string;
}

// ─── Settings ────────────────────────────────────────────────────────────────

export interface Settings {
  dureePeremptionJours: number; // default 35
}

// ─── Statistics ──────────────────────────────────────────────────────────────

export interface StatsRequest {
  du: string; // ISO date
  au: string; // ISO date
}

export interface StatsByService {
  service: string;
  count: number;
}

export interface StatsBySite {
  site: Site;
  count: number;
}

export interface StatsBySiteEtSexe {
  site: Site;
  sexe: Sexe;
  count: number;
}

export interface StatsResponse {
  parService: StatsByService[];
  parSite: StatsBySite[];
  parSiteEtSexe: StatsBySiteEtSexe[];
}

// ─── API error ───────────────────────────────────────────────────────────────

export interface ApiError {
  message: string;
  status?: number;
}
