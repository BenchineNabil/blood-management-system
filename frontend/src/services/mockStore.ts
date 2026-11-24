// ─── Mock data store ──────────────────────────────────────────────────────────
// Pure browser/localStorage store. No server process involved.
// Returns data in exactly the shapes the API document specifies.

import type {
  DonorAPI,
  DonationAPI,
  BagAPI,
  Settings,
  StatsResponse,
  BloodGroup,
  Sexe,
  Site,
  TypeDon,
  BagStatus,
} from '@/types';
import { addDays, today } from '@/utils/dates';

const KEY_DONORS = 'mock_donors';
const KEY_DONATIONS = 'mock_donations';
const KEY_BAGS = 'mock_bags';
const KEY_SETTINGS = 'mock_settings';
// Bump this version whenever the seed schema changes so old data is wiped.
const SEED_VERSION = '2';
const KEY_SEED_VERSION = 'mock_seed_version';

function load<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function save<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

function loadObj<T>(key: string, def: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : def;
  } catch {
    return def;
  }
}

// ─── Seed data ────────────────────────────────────────────────────────────────

function seed(): void {
  if (localStorage.getItem(KEY_DONORS)) return; // already seeded

  const donors: DonorAPI[] = [
    { donor_id: 1, first_name: 'Amina', last_name: 'Benali', date_of_birth: '1990-03-15', sex: 'F', address: '12 rue des Jasmins, Alger', phone: '0770 11 22 33', blood_type: 'O+', created_at: '2024-01-10T08:00:00Z' },
    { donor_id: 2, first_name: 'Karim', last_name: 'Mansouri', date_of_birth: '1985-07-22', sex: 'M', address: '5 bd Krim Belkacem, Oran', phone: '0661 44 55 66', blood_type: 'A+', created_at: '2024-01-15T09:00:00Z' },
    { donor_id: 3, first_name: 'Fatima', last_name: 'Zerrouki', date_of_birth: '1978-11-05', sex: 'F', address: '8 rue Ben Mhidi, Constantine', phone: '0555 77 88 99', blood_type: 'B-', created_at: '2024-02-01T10:00:00Z' },
    { donor_id: 4, first_name: 'Youcef', last_name: 'Hamidi', date_of_birth: '1995-01-30', sex: 'M', address: '3 cité Diar El Mahçoul, Alger', phone: '0770 22 33 44', blood_type: 'AB+', created_at: '2024-02-10T11:00:00Z' },
    { donor_id: 5, first_name: 'Nadia', last_name: 'Belkhir', date_of_birth: '1988-09-18', sex: 'F', address: '20 rue Didouche Mourad, Alger', phone: '0661 55 66 77', blood_type: 'O-', created_at: '2024-03-05T08:30:00Z' },
    { donor_id: 6, first_name: 'Omar', last_name: 'Khaldi', date_of_birth: '1972-04-25', sex: 'M', address: '11 allée des Roses, Annaba', phone: '0555 88 99 00', blood_type: 'A-', created_at: '2024-03-12T09:30:00Z' },
    { donor_id: 7, first_name: 'Lila', last_name: 'Aoudia', date_of_birth: '1993-12-08', sex: 'F', address: '7 rue Hassiba Ben Bouali, Alger', phone: '0770 33 44 55', blood_type: 'B+', created_at: '2024-04-01T10:30:00Z' },
    { donor_id: 8, first_name: 'Rafik', last_name: 'Boumaza', date_of_birth: '1980-06-14', sex: 'M', address: '15 bd de l\'ALN, Blida', phone: '0661 66 77 88', blood_type: 'AB-', created_at: '2024-04-15T11:30:00Z' },
    { donor_id: 9, first_name: 'Soraya', last_name: 'Mekki', date_of_birth: '1991-02-28', sex: 'F', address: '2 rue Larbi Ben M\'hidi, Sétif', phone: '0555 99 00 11', blood_type: 'O+', created_at: '2024-05-01T08:00:00Z' },
    { donor_id: 10, first_name: 'Bilal', last_name: 'Rahmani', date_of_birth: '1987-08-10', sex: 'M', address: '9 cité OPGI, Tizi Ouzou', phone: '0770 44 55 66', blood_type: 'A+', created_at: '2024-05-20T09:00:00Z' },
    { donor_id: 11, first_name: 'Zineb', last_name: 'Abboud', date_of_birth: '1996-05-03', sex: 'F', address: '4 rue Zighout Youcef, Béjaïa', phone: '0661 77 88 99', blood_type: 'B+', created_at: '2024-06-10T10:00:00Z' },
    { donor_id: 12, first_name: 'Hamza', last_name: 'Ferhat', date_of_birth: '1983-10-20', sex: 'M', address: '6 bd Colonel Amirouche, Alger', phone: '0555 00 11 22', blood_type: 'O-', created_at: '2024-06-25T11:00:00Z' },
  ];

  const donations: DonationAPI[] = [
    { donation_id: 1, donor_id: 1, donation_date: '2026-01-10T09:00:00Z' },
    { donation_id: 2, donor_id: 2, donation_date: '2026-01-15T10:00:00Z' },
    { donation_id: 3, donor_id: 3, donation_date: '2026-01-20T11:00:00Z' },
    { donation_id: 4, donor_id: 1, donation_date: '2026-02-10T09:00:00Z' },
    { donation_id: 5, donor_id: 4, donation_date: '2026-02-15T10:00:00Z' },
    { donation_id: 6, donor_id: 5, donation_date: '2026-02-20T11:00:00Z' },
    { donation_id: 7, donor_id: 6, donation_date: '2026-03-05T09:00:00Z' },
    { donation_id: 8, donor_id: 7, donation_date: '2026-03-10T10:00:00Z' },
    { donation_id: 9, donor_id: 2, donation_date: '2026-03-15T11:00:00Z' },
    { donation_id: 10, donor_id: 8, donation_date: '2026-04-01T09:00:00Z' },
    { donation_id: 11, donor_id: 9, donation_date: '2026-04-05T10:00:00Z' },
    { donation_id: 12, donor_id: 10, donation_date: '2026-04-10T11:00:00Z' },
    { donation_id: 13, donor_id: 1, donation_date: '2026-05-01T09:00:00Z' },
    { donation_id: 14, donor_id: 11, donation_date: '2026-05-05T10:00:00Z' },
    { donation_id: 15, donor_id: 12, donation_date: '2026-05-10T11:00:00Z' },
  ];

  const getShelf = (): number => loadObj<Settings>(KEY_SETTINGS, { dureePeremptionJours: 35 }).dureePeremptionJours;

  const bags: BagAPI[] = donations.map((d, i) => {
    const donorId = d.donor_id;
    const donor = donors.find(dn => dn.donor_id === donorId)!;
    const datePrelevement = d.donation_date.slice(0, 10);
    const isExpired = i < 5;
    const isIssued = i >= 5 && i < 10;
    const datePeremption = addDays(datePrelevement, getShelf());
    return {
      id: i + 1,
      numero: `${1080 + i}/2026`,
      datePrelevement,
      dateNaissance: donor.date_of_birth,
      sexe: donor.sex as Sexe,
      site: (i % 2 === 0 ? 'Fixe' : 'Mobile') as Site,
      type: (i % 3 === 0 ? 'Occ' : 'Rég') as TypeDon,
      groupage: (donor.blood_type?.replace('+', ' Pos').replace('-', ' Nég') ?? 'O Pos') as BloodGroup,
      datePeremption,
      dateSortie: isIssued ? addDays(datePrelevement, 15) : null,
      service: isIssued ? (i % 2 === 0 ? 'Urgences Médico-Chir' : 'Médecine Infantile') : null,
      status: isExpired ? 'Périmé' : isIssued ? 'Sorti' : 'Disponible' as BagStatus,
      donorId,
    };
  });

  save(KEY_DONORS, donors);
  save(KEY_DONATIONS, donations);
  save(KEY_BAGS, bags);
}

// ─── Seed / migration logic ───────────────────────────────────────────────────
// If the stored seed version is old, wipe and re-seed so bags always have donorId.
function initStore(): void {
  const storedVersion = localStorage.getItem(KEY_SEED_VERSION);
  if (storedVersion !== SEED_VERSION) {
    // Clear all mock keys so seed() re-runs fresh
    localStorage.removeItem(KEY_DONORS);
    localStorage.removeItem(KEY_DONATIONS);
    localStorage.removeItem(KEY_BAGS);
    localStorage.setItem(KEY_SEED_VERSION, SEED_VERSION);
  }
  seed();
  // Repair any bags still missing donorId (e.g. created via the add-bag form with donorId=0)
  const bags = load<BagAPI>(KEY_BAGS);
  const donations = load<DonationAPI>(KEY_DONATIONS);
  let dirty = false;
  const fixed = bags.map(b => {
    if (b.donorId && b.donorId !== 0) return b;
    // Best-effort: find a donation whose date matches the bag's collection date
    const match = donations.find(d => d.donation_date.startsWith(b.datePrelevement));
    const donorId = match?.donor_id ?? 0;
    if (donorId !== b.donorId) { dirty = true; return { ...b, donorId }; }
    return b;
  });
  if (dirty) save(KEY_BAGS, fixed);
}

// Auto-init on import
initStore();

// ─── Mock API implementations ─────────────────────────────────────────────────

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

// Donors
export const mockDonorService = {
  getAll: (): Promise<DonorAPI[]> => delay(load<DonorAPI>(KEY_DONORS)),

  getById: (donorNumber: number): Promise<DonorAPI | undefined> =>
    delay(load<DonorAPI>(KEY_DONORS).find((d) => d.donor_id === donorNumber)),

  create: (data: Omit<DonorAPI, 'donor_id' | 'created_at'>): Promise<DonorAPI> => {
    const donors = load<DonorAPI>(KEY_DONORS);
    const newId = Math.max(0, ...donors.map((d) => d.donor_id)) + 1;
    const newDonor: DonorAPI = {
      ...data,
      donor_id: newId,
      created_at: new Date().toISOString(),
    };
    save(KEY_DONORS, [...donors, newDonor]);
    return delay(newDonor);
  },

  update: (donorNumber: number, data: Partial<DonorAPI>): Promise<DonorAPI> => {
    const donors = load<DonorAPI>(KEY_DONORS);
    const idx = donors.findIndex((d) => d.donor_id === donorNumber);
    if (idx === -1) throw new Error('Donneur introuvable');
    donors[idx] = { ...donors[idx], ...data };
    save(KEY_DONORS, donors);
    return delay(donors[idx]);
  },

  getDonations: (donorNumber: number): Promise<DonationAPI[]> =>
    delay(load<DonationAPI>(KEY_DONATIONS).filter((d) => d.donor_id === donorNumber)),
};

// Donations
export const mockDonationService = {
  getAll: (): Promise<DonationAPI[]> => delay(load<DonationAPI>(KEY_DONATIONS)),

  getById: (id: number): Promise<DonationAPI | undefined> =>
    delay(load<DonationAPI>(KEY_DONATIONS).find((d) => d.donation_id === id)),

  create: (data: Omit<DonationAPI, 'donation_id'>): Promise<DonationAPI> => {
    const donations = load<DonationAPI>(KEY_DONATIONS);
    const newId = Math.max(0, ...donations.map((d) => d.donation_id)) + 1;
    const newDonation: DonationAPI = { ...data, donation_id: newId };
    save(KEY_DONATIONS, [...donations, newDonation]);
    return delay(newDonation);
  },
};

// Bags
export const mockBagService = {
  getAll: (): Promise<BagAPI[]> => {
    const bags = load<BagAPI>(KEY_BAGS);
    const now = today();
    // Auto-mark expired bags
    const updated = bags.map((b) => ({
      ...b,
      status: (!b.dateSortie && b.datePeremption < now ? 'Périmé' : b.status) as BagStatus,
    }));
    save(KEY_BAGS, updated);
    return delay(updated);
  },

  create: (data: Omit<BagAPI, 'id'>): Promise<BagAPI> => {
    const bags = load<BagAPI>(KEY_BAGS);
    const newId = Math.max(0, ...bags.map((b) => b.id)) + 1;
    const newBag: BagAPI = { ...data, id: newId };
    save(KEY_BAGS, [...bags, newBag]);
    return delay(newBag);
  },

  issue: (id: number, dateSortie: string, service: string): Promise<BagAPI> => {
    const bags = load<BagAPI>(KEY_BAGS);
    const idx = bags.findIndex((b) => b.id === id);
    if (idx === -1) throw new Error('Poche introuvable');
    bags[idx] = { ...bags[idx], dateSortie, service, status: 'Sorti' };
    save(KEY_BAGS, bags);
    return delay(bags[idx]);
  },
};

// Settings
export const mockSettingsService = {
  get: (): Promise<Settings> =>
    delay(loadObj<Settings>(KEY_SETTINGS, { dureePeremptionJours: 35 })),

  update: (data: Settings): Promise<Settings> => {
    localStorage.setItem(KEY_SETTINGS, JSON.stringify(data));
    return delay(data);
  },
};

// Stats
export const mockStatsService = {
  get: (du: string, au: string): Promise<StatsResponse> => {
    const bags = load<BagAPI>(KEY_BAGS).filter(
      (b) => b.datePrelevement >= du && b.datePrelevement <= au,
    );
    const issuedBags = bags.filter((b) => b.dateSortie);

    const parService: Record<string, number> = {};
    issuedBags.forEach((b) => {
      const s = b.service ?? 'Inconnu';
      parService[s] = (parService[s] ?? 0) + 1;
    });

    const parSite: Record<string, number> = {};
    bags.forEach((b) => {
      parSite[b.site] = (parSite[b.site] ?? 0) + 1;
    });

    const parSiteEtSexeMap: Record<string, number> = {};
    bags.forEach((b) => {
      const key = `${b.site}|${b.sexe}`;
      parSiteEtSexeMap[key] = (parSiteEtSexeMap[key] ?? 0) + 1;
    });

    return delay({
      parService: Object.entries(parService).map(([service, count]) => ({ service, count })),
      parSite: Object.entries(parSite).map(([site, count]) => ({ site: site as 'Fixe' | 'Mobile', count })),
      parSiteEtSexe: Object.entries(parSiteEtSexeMap).map(([key, count]) => {
        const [site, sexe] = key.split('|');
        return { site: site as 'Fixe' | 'Mobile', sexe: sexe as 'M' | 'F', count };
      }),
    });
  },
};

import { QUESTIONS } from '@/data/questionnaire';

// Questionnaire (TODO(API): API only defines /questionnaire GET and /questionnaire/validate POST)
export const mockQuestionnaireService = {
  getQuestions: () => delay(QUESTIONS),
  validate: (answers: Record<number, string>) => {
    // Preliminary client-side check — final decision is always with the physician
    const oui = Object.values(answers).filter((a) => a === 'Oui').length;
    return delay({ eligible: oui === 0, details: answers });
  },
};
