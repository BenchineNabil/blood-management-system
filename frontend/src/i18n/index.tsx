// ─── Internationalisation context ─────────────────────────────────────────────
// Pure client-side, zero dependencies. French is the default.
// Add keys here and they are available everywhere via useT().

import { createContext, useContext, useState, type ReactNode } from 'react';

export type Lang = 'fr' | 'en';

export const translations = {
  fr: {
    // Nav
    nav_dashboard: 'Tableau de bord',
    nav_donors: 'Donneurs',
    nav_register: 'Registre des poches',
    nav_issue: 'Sortie',
    nav_questionnaire: 'Questionnaire',
    nav_stats: 'Statistiques',
    nav_settings: 'Paramètres',
    // General
    save: 'Enregistrer',
    cancel: 'Annuler',
    close: 'Fermer',
    confirm: 'Confirmer',
    delete: 'Supprimer',
    edit: 'Modifier',
    new: 'Nouveau',
    search: 'Rechercher',
    loading: 'Chargement…',
    saving: 'Enregistrement…',
    no_data: 'Aucune donnée.',
    error_load: 'Erreur lors du chargement.',
    error_save: 'Erreur lors de l\'enregistrement.',
    // Auth
    login_title: 'Connexion',
    login_subtitle: 'Accédez au système de gestion des dons de sang.',
    login_email: 'Identifiant',
    login_password: 'Mot de passe',
    login_btn: 'Se connecter',
    login_error: 'Identifiant ou mot de passe incorrect.',
    logout: 'Se déconnecter',
    // Dashboard
    dashboard_title: 'Tableau de bord',
    dashboard_subtitle: 'Aperçu de l\'activité du service de transfusion.',
    dashboard_new_donation: 'Nouveau prélèvement',
    dashboard_available: 'Poches disponibles',
    dashboard_today: 'Prélèvements aujourd\'hui',
    dashboard_expired: 'Poches périmées',
    dashboard_donors: 'Donneurs actifs',
    dashboard_notify: 'Notifier les donneurs',
    // Donors
    donors_title: 'Donneurs',
    donors_subtitle: 'Gérer les fiches donneurs et l\'historique des dons.',
    donors_new: 'Nouveau donneur',
    donors_code: 'Code',
    donors_nom: 'Nom',
    donors_prenom: 'Prénom',
    donors_sexe: 'Sexe',
    donors_dob: 'Date naissance',
    donors_address: 'Adresse',
    donors_groupe: 'Groupe sanguin',
    donors_phenotype: 'Phénotype',
    donors_tel: 'Tél',
    donors_notify: 'Notifier les donneurs inactifs',
    donors_history: 'Historique des dons',
    donors_no_donations: 'Aucun prélèvement enregistré.',
    donors_search_in: 'Dans',
    donors_delete_confirm: 'Supprimer le donneur ?',
    // Bags
    bags_title: 'Registre des poches',
    bags_subtitle: 'Registre de collecte de sang — poches et prélèvements.',
    bags_add: 'Ajouter',
    bags_numero: 'Numéro',
    bags_date_prel: 'Date Prélèvement',
    bags_date_nee: 'Date Né',
    bags_age: 'Âge',
    bags_sexe: 'Sexe',
    bags_site: 'Site',
    bags_type: 'Type',
    bags_groupage: 'Groupage',
    bags_expiry: 'Date Péremption',
    bags_issue_date: 'Date de Sortie',
    bags_service: 'Service',
    bags_status: 'Statut',
    bags_donor: 'Donneur',
    bags_details: 'Détails de la poche',
    // Issue
    issue_title: 'Sortie',
    issue_subtitle: 'Enregistrer la sortie d\'une poche de sang.',
    issue_validate: 'Valider la sortie',
    // Questionnaire
    quest_title: 'Questionnaire Médical Type',
    quest_subtitle: 'Évaluation médicale préalable au don de sang.',
    quest_submit: 'Soumettre le questionnaire',
    quest_yes: 'Oui',
    quest_no: 'Non',
    quest_eligible: 'Résultat préliminaire : Éligible',
    quest_not_eligible: 'Résultat préliminaire : Non éligible',
    quest_physician_note: 'La décision finale revient au médecin.',
    quest_candidate: 'Identification du candidat',
    quest_conclusion: 'Conclusion médicale',
    // Settings
    settings_title: 'Paramètres',
    settings_subtitle: 'Configuration générale du système.',
    settings_shelf: 'Durée de péremption (jours)',
    settings_saved: 'Paramètres enregistrés avec succès.',
    // Stats
    stats_title: 'Statistiques',
    stats_subtitle: 'Analyse de l\'activité du service de transfusion.',
    stats_from: 'Du',
    stats_to: 'Au',
    stats_show: 'Afficher',
    stats_by_service: 'Sorties par service',
    stats_by_site: 'Prélèvements par site',
    stats_by_site_sex: 'Prélèvements par site et sexe',
    // Notify
    notify_title: 'Donneurs à relancer',
    notify_subtitle: 'Donneurs n\'ayant pas donné depuis plus de 3 mois.',
    notify_threshold: 'Seuil (mois)',
    notify_last_donation: 'Dernier don',
    notify_days_since: 'Jours depuis dernier don',
    notify_action: 'Marquer comme notifié',
    notify_none: 'Tous les donneurs ont donné récemment.',
    notify_info: 'Aucun système de notification backend n\'est défini dans l\'API. Cette liste peut être utilisée pour contacter les donneurs manuellement.',
    // Bell dropdown
    bell_title: 'Notifications',
    bell_overdue: 'donneurs inactifs (> 3 mois)',
    bell_view_all: 'Voir tous',
    // Status
    status_available: 'Disponible',
    status_issued: 'Sorti',
    status_expired: 'Périmé',
    // Login page labels
    login_welcome: 'Bienvenue sur HemoCare',
    login_system: 'Système de gestion des dons de sang',
  },
  en: {
    nav_dashboard: 'Dashboard',
    nav_donors: 'Donors',
    nav_register: 'Blood Bag Register',
    nav_issue: 'Issue',
    nav_questionnaire: 'Questionnaire',
    nav_stats: 'Statistics',
    nav_settings: 'Settings',
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    new: 'New',
    search: 'Search',
    loading: 'Loading…',
    saving: 'Saving…',
    no_data: 'No data.',
    error_load: 'Error loading data.',
    error_save: 'Error saving data.',
    login_title: 'Sign In',
    login_subtitle: 'Access the blood donation management system.',
    login_email: 'Username',
    login_password: 'Password',
    login_btn: 'Sign In',
    login_error: 'Invalid username or password.',
    logout: 'Sign Out',
    dashboard_title: 'Dashboard',
    dashboard_subtitle: 'Overview of transfusion service activity.',
    dashboard_new_donation: 'New collection',
    dashboard_available: 'Available bags',
    dashboard_today: 'Collections today',
    dashboard_expired: 'Expired bags',
    dashboard_donors: 'Active donors',
    dashboard_notify: 'Notify donors',
    donors_title: 'Donors',
    donors_subtitle: 'Manage donor profiles and donation history.',
    donors_new: 'New donor',
    donors_code: 'Code',
    donors_nom: 'Last name',
    donors_prenom: 'First name',
    donors_sexe: 'Sex',
    donors_dob: 'Date of birth',
    donors_address: 'Address',
    donors_groupe: 'Blood group',
    donors_phenotype: 'Phenotype',
    donors_tel: 'Phone',
    donors_notify: 'Notify inactive donors',
    donors_history: 'Donation history',
    donors_no_donations: 'No donations recorded.',
    donors_search_in: 'In',
    donors_delete_confirm: 'Delete donor?',
    bags_title: 'Blood Bag Register',
    bags_subtitle: 'Blood collection register — bags and donations.',
    bags_add: 'Add',
    bags_numero: 'Number',
    bags_date_prel: 'Collection date',
    bags_date_nee: 'Date of birth',
    bags_age: 'Age',
    bags_sexe: 'Sex',
    bags_site: 'Site',
    bags_type: 'Type',
    bags_groupage: 'Blood group',
    bags_expiry: 'Expiry date',
    bags_issue_date: 'Issue date',
    bags_service: 'Service',
    bags_status: 'Status',
    bags_donor: 'Donor',
    bags_details: 'Bag details',
    issue_title: 'Issue',
    issue_subtitle: 'Record the issue of a blood bag.',
    issue_validate: 'Confirm issue',
    quest_title: 'Medical Questionnaire',
    quest_subtitle: 'Medical assessment prior to blood donation.',
    quest_submit: 'Submit questionnaire',
    quest_yes: 'Yes',
    quest_no: 'No',
    quest_eligible: 'Preliminary result: Eligible',
    quest_not_eligible: 'Preliminary result: Not eligible',
    quest_physician_note: 'Final decision rests with the physician.',
    quest_candidate: 'Candidate identification',
    quest_conclusion: 'Medical conclusion',
    settings_title: 'Settings',
    settings_subtitle: 'General system configuration.',
    settings_shelf: 'Shelf life (days)',
    settings_saved: 'Settings saved successfully.',
    stats_title: 'Statistics',
    stats_subtitle: 'Analysis of transfusion service activity.',
    stats_from: 'From',
    stats_to: 'To',
    stats_show: 'Show',
    stats_by_service: 'Issues by service',
    stats_by_site: 'Collections by site',
    stats_by_site_sex: 'Collections by site and sex',
    notify_title: 'Donors to contact',
    notify_subtitle: 'Donors who have not donated in over 3 months.',
    notify_threshold: 'Threshold (months)',
    notify_last_donation: 'Last donation',
    notify_days_since: 'Days since last donation',
    notify_action: 'Mark as notified',
    notify_none: 'All donors have donated recently.',
    notify_info: 'No backend notification endpoint is defined in the API. This list can be used to contact donors manually.',
    bell_title: 'Notifications',
    bell_overdue: 'inactive donors (> 3 months)',
    bell_view_all: 'View all',
    status_available: 'Available',
    status_issued: 'Issued',
    status_expired: 'Expired',
    login_welcome: 'Welcome to HemoCare',
    login_system: 'Blood donation management system',
  },
} as const;

export type TranslationKey = keyof typeof translations.fr;

type I18nContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKey) => string;
};

export const I18nContext = createContext<I18nContextType>({
  lang: 'fr',
  setLang: () => {},
  t: (k) => translations.fr[k],
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem('app_lang');
    return saved === 'en' ? 'en' : 'fr';
  });

  const handleSetLang = (l: Lang) => {
    setLang(l);
    localStorage.setItem('app_lang', l);
  };

  const t = (key: TranslationKey): string => translations[lang][key] ?? translations.fr[key];

  return (
    <I18nContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useT() {
  return useContext(I18nContext);
}
