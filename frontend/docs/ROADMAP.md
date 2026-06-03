# frontend — Roadmap

> Priorisation des écrans et fonctionnalités frontend. Voir [PAGES.md](PAGES.md), [PRD.md](PRD.md).

---

## Phase 1 — Socle compétition (MVP démontrable)

Objectif : le parcours de démo complet, premium et fluide.

- **Fondations** : setup React + TypeScript + **Vite** + **React Router**, Tailwind + thème (palette noir/rouge), client `lib/api` + TanStack Query, auth JWT + `accounts/me`, gardes de routes par rôle, composants `ui` de base (`Button`, `StatusBadge`, `Card`, `DataTable`, `Modal`, `EmptyState`, `ErrorState`, skeletons, `Toast`).
- **Public** : Accueil, Catalogue + **recherche à facettes**, Fiche document, **Assistant IA** (sourcé), **Vérification QR**.
- **Déposant** : Dashboard, Mes dossiers, **Wizard de dépôt (6 étapes)** dont upload PDF + Analyse IA + vérification métadonnées + soumission, Détail dossier, Preuve.
- **Validation** : Inbox, Détail à valider (onglets), Décision finale (checklist), Archivage + preuve.
- **Admin** : Dashboard minimal (KPIs + état services).
- **Mock API (MSW)** pour tourner sans backend.

### Critères de sortie Phase 1
- Parcours démo bout en bout sans accroc.
- Recherche à facettes (≥ 5 filtres) + résultats expliqués.
- Assistant IA affiche toujours ses sources ; refus propre sinon.
- Vérification QR avec états clairs.
- Cohérence design (palette, badges, états) ; accessibilité de base.

## Phase 2 — Produit institutionnel

- Déposant : corrections (réponse + nouvelle version), notifications, profil complet, versions.
- Validation : avis détaillés, gestion corrections, module articles / peer review (interne), historique/audit.
- Admin : utilisateurs, rôles & permissions (matrice), institutions/structures, types de documents, paramètres IA, **paramètres SSI/e-IDStack** (secrets masqués), preuves & vérifications, statistiques.
- Recherche : tri avancé, sauvegarde de recherche, fiche institution.
- Qualité : tests composants (Vitest) + e2e (Playwright), i18n FR/EN.

## Phase 3 — Échelle & finition

- Workflows configurables (builder visuel) côté admin.
- Tendances scientifiques (visualisations).
- Notifications temps réel, exports (CSV/PDF), tableaux de bord analytiques riches.
- Optimisations perf (cache, lazy-loading, préchargement), accessibilité avancée (audit WCAG) ; SSR/SEO seulement si réellement nécessaire.
- Multi-institutions / personnalisation de marque par institution.

## À éviter pendant la compétition

- Sur-design ; bibliothèques lourdes inutiles.
- Appels directs à `simba_ia` / `e-IDStack` (toujours via le backend).
- Exposer du vocabulaire technique (`RAG`, `DID`, `wallet`) dans l'UI.
- Logique de sécurité « côté client seulement » (le backend reste l'autorité).

## Ordre d'implémentation recommandé (Phase 1)

```text
1. Setup + thème + lib/api + auth + gardes
2. Composants ui de base + layouts (public / interne)
3. Accueil public + Catalogue + Recherche à facettes
4. Fiche document + Vérification QR
5. Assistant IA (sourcé)
6. Wizard de dépôt (upload + analyse IA + métadonnées + soumission)
7. Détail dossier déposant + Preuve
8. Validation : inbox + détail + décision + archivage
9. Dashboard admin minimal
10. Mock API (MSW) + passes d'états vide/chargement/erreur
```
