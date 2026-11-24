# API Mapping — Frontend ↔ Backend

> Source of truth for all screen→service→endpoint relationships and known gaps.

## Endpoint Map

| Écran | Fonction service | Méthode | Chemin |
|---|---|---|---|
| Donneurs (liste) | `donorService.getAll` | GET | `/donors` |
| Donneurs (détail) | `donorService.getById` | GET | `/donors/:donorNumber` |
| Donneurs (nouveau) | `donorService.create` | POST | `/donors` |
| Donneurs (modifier) | `donorService.update` | PUT | `/donors/:donorNumber` |
| Donneurs (historique) | `donorService.getDonations` | GET | `/donors/:donorNumber/donations` |
| Questionnaire (questions) | `questionnaireService.getQuestions` | GET | `/questionnaire` |
| Questionnaire (validation) | `questionnaireService.validate` | POST | `/questionnaire/validate` |
| Registre des poches (liste) | `donationService.getAll` | GET | `/donations` |
| Enregistrer un don | `donationService.create` | POST | `/donations` |

## TODO(API) — Endpoints manquants ou ambigus

| # | Écran | Problème | Comportement actuel |
|---|---|---|---|
| 1 | Registre des poches | **Pas d'endpoint `/bags`** défini dans le document API. Les poches ne sont pas le même concept que les donations (une donation = une poche, mais les colonnes sont différentes). | Mock localStorage uniquement |
| 2 | Sortie | **Pas d'endpoint `/bags/:id/issue`** défini. | Mock localStorage uniquement |
| 3 | Statistiques | **Pas d'endpoint `/stats`** défini. | Calculé côté client depuis le mock |
| 4 | Paramètres | **Pas d'endpoint `/settings`** défini. | Stocké en localStorage |
| 5 | Donneurs | **Pas d'endpoint `DELETE /donors/:id`** défini. La suppression est bloquée avec un message d'erreur. | Bloqué |
| 6 | Sortie | **Liste des services** non définie dans l'API. Seeded : Périmé, Clinique, EH, Urgences Médico-Chir, Médecine Infantile. | Liste configurable côté client |
| 7 | Questionnaire | **Q7 et Q8** ont le même libellé dans le PDF (doublon d'impression). Q8 est conservé avec un TODO. | Voir `src/data/questionnaire.ts` |
| 8 | Général | **CORS** : En production Electron, l'origine est `file://` ou `null`. Le backend doit autoriser `null` et `http://localhost:8443`. | Voir `README.md` |

## Questions à soumettre à l'équipe backend

Voir `README.md` section "Questions pour l'équipe backend".
