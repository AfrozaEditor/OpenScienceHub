# frontend — Design System

> Charte visuelle et composants de l'application. Basé sur `../../../Docs/OpenScienceHub_UIUX_Specification_complete.md`. Style : **premium, institutionnel, académique, technologique, sobre**.

---

## 1. Palette officielle

### Couleurs de marque
| Rôle | Nom | Hex | Usage |
|---|---|---|---|
| Noir principal | Primary Black | `#050505` | logo, titres, sidebar, texte premium |
| Rouge signature | Academic Red | `#C40012` | boutons principaux, accents, actions fortes |
| Rouge profond | Deep Red | `#8B000B` | hover, états actifs |
| Gris techno | Tech Gray | `#9CA3AF` | icônes secondaires, texte tertiaire |
| Argent clair | Light Silver | `#E5E7EB` | bordures, séparateurs, fonds doux |
| Blanc pur | Pure White | `#FFFFFF` | fonds, cartes, lecture |

### Couleurs fonctionnelles
| Rôle | Hex |
|---|---|
| Texte principal | `#111827` |
| Texte secondaire | `#4B5563` |
| Fond clair (dashboard) | `#F8F9FA` |
| Bordure | `#D1D5DB` |
| Succès / authentique | `#10B981` |
| Avertissement / correction | `#F59E0B` |
| Erreur / rejeté | `#EF4444` |

### Règle d'usage
- **Rouge avec parcimonie** : CTA forts (Soumettre, Archiver, Vérifier, Confirmer), accent de navigation actif, éléments de preuve. Il guide l'œil, il ne sature pas.
- **Noir** : titres, sidebar, badge `ARCHIVÉ`, zones premium.
- **Gris** : bordures, fonds de cartes, états désactivés, squelettes.
- **Vert/Orange/Rouge erreur** : réservés aux **statuts**.

## 2. Tokens Tailwind (extrait `tailwind.config.ts`)

```ts
theme: {
  extend: {
    colors: {
      ink: "#050505",
      academic: { DEFAULT: "#C40012", deep: "#8B000B" },
      tech: "#9CA3AF",
      silver: "#E5E7EB",
      surface: "#F8F9FA",
      text: { DEFAULT: "#111827", muted: "#4B5563" },
      border: "#D1D5DB",
      success: "#10B981",
      warning: "#F59E0B",
      danger: "#EF4444",
    },
    borderRadius: { btn: "12px", card: "18px", field: "10px" },
    boxShadow: {
      card: "0 8px 24px rgba(5,5,5,0.06)",
      cardLg: "0 12px 32px rgba(5,5,5,0.08)",
    },
  },
}
```

## 3. Typographie

- Police principale : **Inter** ou **Satoshi** (alternatives : Manrope, IBM Plex Sans).
- Hiérarchie :

| Élément | Taille | Poids |
|---|---|---|
| Titre page | 28–36 px | 700 |
| Titre section | 20–24 px | 600 |
| Titre carte | 16–18 px | 600 |
| Texte normal | 14–16 px | 400 |
| Texte secondaire | 13–14 px | 400 |
| Badge | 11–12 px | 600 uppercase |
| Bouton | 14–15 px | 600 |

## 4. Composants UI standard

### Boutons
- **Principal** : fond `#C40012`, texte blanc, hover `#8B000B`, radius 12px, hauteur 44–48px. (Nouveau dépôt, Soumettre, Archiver, Vérifier, Confirmer décision.)
- **Secondaire** : fond blanc, bordure `#D1D5DB`, texte `#111827`, hover `#F8F9FA`. (Annuler, Voir détails, Retour, Exporter.)
- **Danger** : fond `#EF4444`, texte blanc. (Révoquer preuve, Désactiver utilisateur, Rejeter.)

### Badges de statut (`StatusBadge`)
| Statut | Style |
|---|---|
| BROUILLON | fond `#F3F4F6`, texte `#4B5563` |
| SOUMIS | fond `#050505`, texte blanc |
| EN INSTRUCTION | fond `#E5E7EB`, texte `#111827` |
| CORRECTION DEMANDÉE | fond `#FEF3C7`, texte `#92400E` |
| VALIDÉ | fond `#D1FAE5`, texte `#065F46` |
| ARCHIVÉ | fond noir, accent rouge |
| REJETÉ | fond `#FEE2E2`, texte `#991B1B` |
| AUTHENTIQUE | fond `#D1FAE5`, texte `#065F46` |
| INVALIDE | fond `#FEE2E2`, texte `#991B1B` |
| RESTREINT | fond `#FFF7ED`, texte `#9A3412` |

> Accessibilité : un badge ne doit **pas** dépendre uniquement de la couleur (libellé texte toujours présent).

### Autres composants
- `Card` (radius 18px, ombre `card`), `StatCard`, `DataTable` (tri, pagination), `Modal` (confirmations critiques), `Stepper` (wizard de dépôt), `Timeline` (statuts dossier), `Tabs`, `FacetPanel`, `UploadZone` (drag-and-drop PDF + hash), `PdfViewer`, `QrCard`, `Toast`.

### Radius & ombres
- Boutons 10–12px, cartes 16–20px, champs 10–12px, badges 999px ou 8px.
- Ombres faibles (voir tokens).

## 5. Layouts

- **Dashboard interne** : sidebar gauche fixe (noire, élément actif rouge), header supérieur, contenu sur fond `#F8F9FA`, cartes blanches.
- **Portail public** : header horizontal, hero aéré, recherche centrale premium, cartes, footer institutionnel, beaucoup de blanc.
- **Pages critiques** (décision finale, archivage, paramètres SSI) : design sérieux, blocs de confirmation, checklist, alertes, historique visible, peu de distraction.

## 6. États standard (obligatoires)

- **Vide** : icône fine, titre clair, description utile, action principale. Ex. « Aucun dossier scientifique. Commencez par déposer un mémoire, une thèse ou un article. »
- **Chargement** : **skeletons** (cartes, lignes de table), progress bar pour upload et analyse IA ; spinner réservé aux petites actions.
- **Erreur** : carte blanche, bordure rouge clair, message en `#991B1B`, action `Réessayer`. Message qui dit *ce qui s'est passé* + *ce que l'utilisateur peut faire*.

## 7. Confirmations critiques (modale)

Actions nécessitant une modale : soumission officielle, décision finale, archivage, révocation de preuve, modification de workflow actif, désactivation utilisateur, changement de paramètres SSI, changement de permission critique. La modale résume action + objet + conséquence.

## 8. Ton de l'interface

- Clair, institutionnel, rassurant, précis, non publicitaire.
- À éviter en surface : `RAG`, `DID Registry`, `Credential Issuer`, `Vector DB`, `Chunking`, vocabulaire crypto/blockchain, `wallet`.
- À privilégier : **Assistant IA**, **preuve de vérification**, **document vérifiable**, **version finale archivée**, **métadonnées validées**, **couche SSI basée sur e-IDStack de IDS**.
- Mention obligatoire là où l'IA aide la validation : « L'analyse IA est une aide à la lecture. La décision académique reste humaine. »

## 9. Accessibilité

- Contraste suffisant (texte/fond), focus visible, navigation clavier complète.
- Labels de formulaires visibles ; erreurs textuelles (pas seulement couleur).
- Cibles tactiles suffisantes ; hiérarchie de titres cohérente.

## 10. Logo & marque

- Logo OpenScience Hub (document + livre + check + circuits + laurier), charte noir/rouge/gris/blanc.
- Slogan : « Le hub intelligent des travaux scientifiques universitaires ».
- Promesse : Archiver. Valider. Explorer. Vérifier.
