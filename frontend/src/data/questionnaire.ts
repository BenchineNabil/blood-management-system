import type { Question } from '@/types';

// NOTE: Q7 and Q8 share the same text "Avez-vous été traité pour l'acné ?" in
// the PDF — this appears to be a print duplicate. Both are kept here with their
// original numbers. TODO: confirm correct wording for Q8 with the medical team.
export const QUESTIONS: Question[] = [
  // ── Section A : État de santé ────────────────────────────────────────────
  {
    numero: 1,
    section: 'A',
    texte: 'Êtes-vous en bonne santé et vous sentez-vous bien aujourd\'hui ?',
    type: 'oui_non',
  },
  {
    numero: 2,
    section: 'A',
    texte: 'Avez-vous de la fièvre ou des symptômes grippaux ?',
    type: 'oui_non',
  },
  {
    numero: 3,
    section: 'A',
    texte: 'Prenez-vous des médicaments en ce moment ?',
    type: 'oui_non',
    detailIfOui: true,
  },
  {
    numero: 4,
    section: 'A',
    texte: 'Êtes-vous actuellement sous traitement antibiotique ?',
    type: 'oui_non',
    detailIfOui: true,
  },
  {
    numero: 5,
    section: 'A',
    texte: 'Avez-vous un problème cardiaque ou une tension artérielle élevée ?',
    type: 'oui_non',
  },
  {
    numero: 6,
    section: 'A',
    texte: 'Avez-vous un problème pulmonaire ou respiratoire ?',
    type: 'oui_non',
  },
  {
    numero: 7,
    section: 'A',
    texte: 'Avez-vous été traité pour l\'acné ?',
    type: 'oui_non',
  },
  {
    numero: 8,
    section: 'A',
    // TODO: PDF duplicate of Q7 — confirm correct wording for Q8 with medical team.
    texte: 'Avez-vous été traité pour l\'acné ?',
    type: 'oui_non',
    note: 'DUPLICATE: même texte que Q7 dans le PDF. Confirmer le libellé correct.',
    detailIfOui: true,
  },
  {
    numero: 9,
    section: 'A',
    texte: 'Souffrez-vous d\'une maladie chronique (diabète, épilepsie, etc.) ?',
    type: 'oui_non',
    detailIfOui: true,
  },
  {
    numero: 10,
    section: 'A',
    texte: 'Avez-vous subi une intervention chirurgicale au cours des 6 derniers mois ?',
    type: 'oui_non',
  },
  {
    numero: 11,
    section: 'A',
    texte: 'Avez-vous reçu une transfusion sanguine ou des produits dérivés du sang ?',
    type: 'oui_non',
  },
  {
    numero: 12,
    section: 'A',
    texte: 'Avez-vous donné du sang dans les 8 dernières semaines ?',
    type: 'oui_non',
  },
  {
    numero: 13,
    section: 'A',
    texte: 'Avez-vous été vacciné au cours des 4 dernières semaines ?',
    type: 'oui_non',
  },
  {
    numero: 14,
    section: 'A',
    texte: 'Avez-vous un tatouage ou un piercing datant de moins de 6 mois ?',
    type: 'oui_non',
  },
  {
    numero: 15,
    section: 'A',
    texte: 'Avez-vous subi un acupuncture dans les 4 dernières semaines ?',
    type: 'oui_non',
  },
  // Pour les femmes (Q16–17) ─────────────────────────────────────────────────
  {
    numero: 16,
    section: 'A',
    texte: 'Êtes-vous enceinte ou avez-vous accouché au cours des 6 derniers mois ?',
    type: 'oui_non',
    detailIfOui: true, // number of pregnancies
    womenOnly: true,
  },
  {
    numero: 17,
    section: 'A',
    texte: 'Allaitez-vous actuellement ?',
    type: 'oui_non',
    womenOnly: true,
  },
  // ── Section B-1 : Voyages ─────────────────────────────────────────────────
  {
    numero: 18,
    section: 'B-1',
    texte: 'Avez-vous voyagé à l\'étranger au cours des 12 derniers mois ?',
    type: 'oui_non',
    detailIfOui: true,
  },
  {
    numero: 19,
    section: 'B-1',
    texte: 'Avez-vous séjourné dans une zone à risque de paludisme ?',
    type: 'oui_non',
  },
  {
    numero: 20,
    section: 'B-1',
    texte: 'Avez-vous résidé plus de 6 mois dans un pays à forte prévalence de maladies infectieuses ?',
    type: 'oui_non',
  },
  // ── Section B-2 : Soins et antécédents ────────────────────────────────────
  {
    numero: 21,
    section: 'B-2',
    texte: 'Avez-vous subi une endoscopie dans les 6 derniers mois ?',
    type: 'oui_non',
  },
  {
    numero: 22,
    section: 'B-2',
    texte: 'Avez-vous subi une transfusion de globules rouges ou de plasma ?',
    type: 'oui_non',
  },
  {
    numero: 23,
    section: 'B-2',
    texte: 'Avez-vous reçu des soins dentaires dans les 7 derniers jours ?',
    type: 'oui_non',
  },
  {
    numero: 24,
    section: 'B-2',
    texte: 'Avez-vous un antécédent d\'ictère ou d\'hépatite ?',
    type: 'oui_non',
    detailIfOui: true,
  },
  {
    numero: 25,
    section: 'B-2',
    texte: 'Avez-vous un antécédent de tuberculose ?',
    type: 'oui_non',
  },
  {
    numero: 26,
    section: 'B-2',
    texte: 'Avez-vous un antécédent de cancer ou de tumeur maligne ?',
    type: 'oui_non',
  },
  {
    numero: 27,
    section: 'B-2',
    texte: 'Avez-vous un antécédent de maladie de la coagulation ?',
    type: 'oui_non',
  },
  {
    numero: 28,
    section: 'B-2',
    texte: 'Avez-vous un antécédent d\'allergie grave ou de choc anaphylactique ?',
    type: 'oui_non',
  },
  // Sous-section : Au cours de votre vie (Q29–31)
  {
    numero: 29,
    section: 'B-2',
    texte: 'Au cours de votre vie, avez-vous consommé des drogues par voie injectable ?',
    type: 'oui_non',
  },
  {
    numero: 30,
    section: 'B-2',
    texte: 'Au cours de votre vie, avez-vous été incarcéré ?',
    type: 'oui_non',
  },
  {
    numero: 31,
    section: 'B-2',
    texte: 'Au cours de votre vie, avez-vous souffert d\'une maladie neurologique grave ?',
    type: 'oui_non',
  },
  // ── Section B-3 : Exposition sanguine ou sexuelle ─────────────────────────
  {
    numero: 32,
    section: 'B-3',
    texte: 'Avez-vous eu un contact accidentel avec du sang dans les 6 derniers mois ?',
    type: 'oui_non',
  },
  {
    numero: 33,
    section: 'B-3',
    texte: 'Avez-vous eu de nouveaux partenaires sexuels dans les 6 derniers mois ?',
    type: 'oui_non',
  },
  {
    numero: 34,
    section: 'B-3',
    texte: 'Avez-vous eu des rapports sexuels avec une personne porteuse du VIH ou d\'une hépatite ?',
    type: 'oui_non',
  },
  {
    numero: 35,
    section: 'B-3',
    texte: 'Avez-vous eu des rapports sexuels contre rémunération ?',
    type: 'oui_non',
  },
];
