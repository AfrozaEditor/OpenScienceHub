# frontend — Pages, routes et écrans

> Cartographie des écrans par portail, avec route, composants clés, données et actions. Détails UI dans `../../../Docs/OpenScienceHub_UIUX_Specification_complete.md` et `..._Textual_Wireframes_complete.md`. Routes **React Router** (SPA, Vite). Les segments `(public)`, `(deposant)`, etc. désignent des **groupes de routes**, pas des dossiers Next.

---

## 0. Conventions

- Chaque écran gère **vide / chargement (skeleton) / erreur**.
- Actions visibles selon **rôle** et **statut** (l'UI masque, le backend autorise).
- Endpoints cités → voir [API_INTEGRATION.md](API_INTEGRATION.md).

## 1. Auth (`(auth)`)

| Route | Écran | Données / Actions |
|---|---|---|
| `/login` | Connexion | `POST /auth/login` → stocke JWT, charge `/accounts/me` |
| `/register` | Inscription déposant | `POST /auth/register` |

## 2. Portail Déposant (`(deposant)`)

| Route | Écran | Composants / Données | Actions |
|---|---|---|---|
| `/dashboard` | Tableau de bord | `StatCard` x8, `RecentWorksTable`, notifications urgentes | Nouveau dépôt, ouvrir dossier |
| `/mes-dossiers` | Mes dossiers | recherche, filtres (type, statut, année…), `DataTable`, badges | Voir / Modifier / Soumettre / Répondre / Voir preuve |
| `/nouveau-depot` | **Wizard 6 étapes** | `Stepper` + panneau d'aide | voir 2.1 |
| `/dossiers/:id` | Détail dossier | header + `Timeline` + `Tabs` | actions selon statut |
| `/dossiers/:id/corrections` | Corrections | cartes correction (type, priorité, statut) | répondre, déposer nouvelle version |
| `/dossiers/:id/preuve` | Preuve & vérification | `QrCard`, détails preuve (hash, statut, réf. e-IDStack de IDS) | copier lien, télécharger QR, ouvrir `/verify` |
| `/notifications` `/profil` | Notifications / Profil | liste, formulaire profil | marquer lu, modifier profil |

### 2.1 Wizard Nouveau dépôt
1. **Type de travail** : cartes Mémoire / Thèse / Article → `documentType`.
2. **Infos académiques** : champs communs + blocs conditionnels (mémoire/thèse/article).
3. **Upload PDF** : `UploadZone`, progression, carte fichier (nom, taille, pages, **hash SHA-256**). `POST /works/{id}/documents`.
4. **Analyse IA** : bouton « Lancer l'analyse IA », progression par sous-tâches, carte résultat + `confidence`. `POST /works/{id}/extract-metadata`.
5. **Vérification métadonnées** : 2 colonnes (champs vs propositions IA), accepter/modifier, badges de confiance. `POST /works/{id}/metadata/accept`.
6. **Soumission** : récapitulatif + cases de confirmation → modale → `POST /works/{id}/submit`.

### 2.2 Onglets du détail dossier
Vue d'ensemble · Métadonnées · Document (`PdfViewer`) · Versions · Avis & décisions · Corrections · Preuve · Historique.

## 3. Portail Validation académique (`(validation)`)

| Route | Écran | Composants / Données | Actions |
|---|---|---|---|
| `/validation/dashboard` | Dashboard | stats cliquables, file prioritaire, résumé par type | filtrer, ouvrir |
| `/validation/a-traiter` | Dossiers à traiter (inbox) | recherche, filtres, `DataTable` + priorité | ouvrir, assigner, avis, correction, décider |
| `/validation/dossiers/:id` | Détail à valider | header + `Timeline` + `Tabs` | voir 3.1 |

### 3.1 Onglets validation
- **Document** : `PdfViewer` + version examinée (hash).
- **Métadonnées** : tableau comparatif (déposant / IA / institution) + statuts de champ. `POST /works/{id}/metadata/validate`.
- **Analyse IA** : résumé, points à vérifier, travaux similaires + mention « aide à la lecture, décision humaine ».
- **Avis** : liste + formulaire (`POST /works/{id}/reviews`), recommandations.
- **Corrections** : créer/suivre (`POST /works/{id}/corrections`).
- **Décision** : checklist bloquante → `POST /works/{id}/decision` (modale).
- **Archivage** : checklist + options preuve/QR/publication → `POST /works/{id}/archive` (modale) → preuve générée.
- **Historique** : `WorkflowEvent`.

## 4. Portail Archive publique (`(public)`, accès sans token)

| Route | Écran | Composants / Données | Actions |
|---|---|---|---|
| `/` | Accueil | hero, recherche, actions rapides, stats, travaux récents, bloc vérification | explorer, vérifier, Assistant IA |
| `/catalog` | Catalogue | cartes documents, badges (`ARCHIVÉ`, `VÉRIFIABLE`, `PDF DISPONIBLE`) | consulter, vérifier, similaires |
| `/catalog?…` ou `/recherche` | Recherche à facettes | `FacetPanel` (type, institution, faculté, département, domaine, année, auteur, encadreur, mots-clés, langue, statut, vérifiable, PDF) + résultats expliqués + tri | combiner filtres, réinitialiser |
| `/works/:slug` | Fiche publique | header, résumé, métadonnées, accès PDF, **bloc preuve** (`QrCard`), Assistant IA contextuel, travaux similaires, citation | lire/télécharger si autorisé, vérifier, synthèse IA |
| `/assistant` | Assistant IA | zone question, filtres contextuels, réponse + **sources visibles** | poser question, ouvrir source, exporter |
| `/verify/:code` | Vérification | résultat (authentique / introuvable / invalide / révoqué) + métadonnées publiques | re-vérifier, ouvrir fiche |

Endpoints : `GET /catalog`, `GET /catalog/search`, `GET /catalog/{slug}`, `POST /ai/assistant/query`, `GET /verify/{code}`.

## 5. Portail Administration (`(admin)`)

| Route | Écran | Données / Actions |
|---|---|---|
| `/admin/dashboard` | Dashboard | KPIs + état des services |
| `/admin/utilisateurs` | Utilisateurs | CRUD, rôles, statut |
| `/admin/roles` | Rôles & permissions | matrice, périmètres |
| `/admin/institutions` | Institutions | CRUD, config |
| `/admin/structures` | Facultés / départements / filières | arbre + détails |
| `/admin/workflows` | Workflows | étapes/transitions (builder) |
| `/admin/types-documents` | Types de documents | config par type |
| `/admin/ia` | Paramètres IA | extraction, Assistant, sécurité |
| `/admin/ssi` | Paramètres SSI / e-IDStack | connexion, émission (secrets masqués) |
| `/admin/preuves` | Preuves & vérifications | liste + journal |
| `/admin/statistiques` | Statistiques | KPIs, graphiques, exports |
| `/admin/audit` | Audit système | journal lecture seule |

## 6. Composants transverses

`AppHeader`, `PortalSidebar` (filtrée par rôle), `PageHeader`, `StatusBadge`, `DataTable`, `FacetPanel`, `Stepper`, `Timeline`, `UploadZone`, `PdfViewer`, `QrCard`, `ConfirmModal`, `EmptyState`, `ErrorState`, `Skeletons`, `Toast`.

## 7. Priorités de réalisation (démo)

1. Accueil public · 2. Recherche à facettes · 3. Fiche document · 4. Wizard de dépôt · 5. Analyse IA / métadonnées · 6. Détail validation · 7. Décision finale · 8. Archivage + preuve · 9. Vérification QR · 10. Dashboard admin.

## 8. Parcours de démonstration

```text
Accueil public → Nouveau dépôt → Upload PDF (hash) → Analyse IA → Soumission
→ Validation : ouvrir dossier, vérifier métadonnées → Décision archivable
→ Archivage : QR + preuve (e-IDStack de IDS)
→ Archive publique : retrouver par facettes → Assistant IA (sourcé)
→ Vérification QR : document authentique
```
