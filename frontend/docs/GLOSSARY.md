# frontend — Glossaire (UI / front)

> Termes spécifiques au frontend. Pour le glossaire métier/SSI/IA complet, voir `../../docs/GLOSSARY.md`. Vocabulaire d'interface : « Assistant IA » (jamais « RAG »), « e-IDStack de IDS » (jamais « eidStack-CMU »), pas de « wallet »/« DID » en surface.

---

## Portails et navigation

| Terme | Définition |
|---|---|
| **Portail** | Espace de l'app : Déposant, Validation académique, Archive publique, Administration. |
| **Layout de portail** | Coquille (header + sidebar + zone contenu) propre à un portail. |
| **Garde de route** | Vérification de session + rôle avant d'afficher une route. |
| **Périmètre** | Limite d'accès d'un utilisateur (institution/faculté/département) renvoyée par le backend. |

## Composants UI

| Terme | Définition |
|---|---|
| **StatusBadge** | Badge de statut (couleur + libellé), non dépendant uniquement de la couleur. |
| **StatCard** | Carte de statistique (libellé, nombre, icône, lien filtré). |
| **DataTable** | Tableau de données (tri, pagination, actions par ligne). |
| **FacetPanel** | Panneau de facettes de la recherche avancée. |
| **Stepper** | Indicateur d'étapes du wizard de dépôt (6 étapes). |
| **Timeline** | Frise du cycle de vie d'un dossier (statuts). |
| **UploadZone** | Zone de dépôt PDF (drag-and-drop) + infos fichier (hash). |
| **PdfViewer** | Visualiseur de PDF (navigation, zoom). |
| **QrCard** | Carte affichant le QR de vérification + détails de preuve. |
| **ConfirmModal** | Modale de confirmation d'action critique. |
| **EmptyState / ErrorState / Skeleton** | États standard d'un écran (vide / erreur / chargement). |

## États et statuts (UI)

| Terme | Définition |
|---|---|
| **État vide** | Aucun contenu : message + action principale. |
| **État chargement** | Skeletons / progress bar (upload, analyse IA). |
| **État erreur** | Message clair + action `Réessayer`. |
| **Statut de dossier** | DRAFT, SUBMITTED, UNDER_REVIEW, CORRECTION_REQUESTED, RESUBMITTED, VALIDATED, ARCHIVED, REJECTED. |
| **Résultat de vérification** | VALID / INVALID_HASH / NOT_FOUND / REVOKED / EXPIRED / TECHNICAL_ERROR. |

## Data / intégration

| Terme | Définition |
|---|---|
| **lib/api** | Client HTTP centralisé (JWT, endpoints typés) — seul point d'accès au backend. |
| **TanStack Query** | Cache et états des données serveur (loading/error/invalidations). |
| **MSW** | Mock Service Worker : API simulée pour dev/démo hors-ligne. |
| **OpenAPI types** | Types TS générés depuis le schéma backend. |

## Produit (rappel)

| Terme UI | À NE PAS dire | À dire |
|---|---|---|
| Recherche intelligente | RAG, embeddings | **Assistant IA** |
| Preuve | DID, VC, wallet | **preuve de vérification**, **document vérifiable** |
| SSI | eidStack-CMU | **couche SSI basée sur e-IDStack de IDS** |

## Branding

Palette : noir `#050505`, rouge `#C40012`, rouge profond `#8B000B`, gris `#9CA3AF`, argent `#E5E7EB`, blanc `#FFFFFF` ; succès `#10B981`, avertissement `#F59E0B`, erreur `#EF4444`. Slogan : « Le hub intelligent des travaux scientifiques universitaires ». Promesse : Archiver. Valider. Explorer. Vérifier.
