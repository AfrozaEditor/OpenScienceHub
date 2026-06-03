# AGENTS.md — OpenScience Hub (monorepo)

Règles et contexte pour les assistants de code travaillant dans ce dépôt.

## Produit

**OpenScience Hub** — « Le hub intelligent des travaux scientifiques universitaires ». Plateforme institutionnelle pour **archiver, classifier, valider, explorer (IA) et vérifier** les mémoires, thèses et articles. Voir `docs/PRD.md`.

Documents de référence (lire avant de coder) : `docs/SYSTEM_PROMPT.md`, `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/DATA_MODEL.md`, `docs/SSI_INTEGRATION.md`, `docs/API_SPEC.md`, `docs/ROADMAP.md`, `docs/GLOSSARY.md`.

## Structure du monorepo

```text
OpenScienceHub/
├── backend/     # API principale — Django + DRF + PostgreSQL  (voir backend/AGENTS.md)
├── frontend/    # App web (4 portails) — consomme l'API
├── simba_ia/    # Microservice IA — Python/FastAPI (extraction PDF + Assistant IA / RAG, pgvector)
├── ids/         # e-IDStack de IDS — couche SSI
│   ├── eidStack-CMU/   # Backend NestJS + Credo-TS (émission/vérification VC) — NE PAS modifier sans raison
│   ├── e-IDapp_CMU/    # Wallet mobile (React Native)
│   └── eid-sandbox-CMU/
└── docs/        # Documents fondateurs
```

## Règles transverses

1. **Le dossier (`ScientificWork`) est l'objet central**, pas le PDF.
2. **Orchestration, pas réimplémentation** : l'IA vit dans `simba_ia`, le SSI dans `ids/eidStack-CMU`. Le backend les **appelle** via des clients dédiés.
3. **L'IA ne décide jamais** : extraction et Assistant IA sont des aides ; la décision académique est humaine. L'Assistant IA cite toujours ses sources.
4. **SSI uniquement via e-IDStack de IDS** ; jamais de crypto/DID/VC « maison ».
5. **Preuve uniquement après archivage** d'une version finale verrouillée ; cohérence des hash (version finale == preuve == claim).
6. **Vocabulaire** : « Assistant IA » (jamais « RAG » en surface) ; « e-IDStack de IDS » (jamais « eidStack-CMU »/« CMU »).
7. **Sécurité** : aucun secret en clair ; tout via variables d'environnement ; clés e-IDStack/IA jamais exposées par l'API.
8. **RBAC + confidentialité** : un utilisateur n'agit que dans son périmètre ; les vues publiques ne révèlent jamais de documents privés.
9. **Auditabilité** : toute action sensible est journalisée (immuable).
10. **Périmètre** : ne pas modifier `ids/*` (sous-modules tiers) sauf demande explicite.

## Branding

Palette noir `#050505` / rouge `#C40012` / gris `#9CA3AF` / blanc `#FFFFFF`. Slogan : « Le hub intelligent des travaux scientifiques universitaires ». Promesse : Archiver. Valider. Explorer. Vérifier.

## Périmètre par dossier

- `backend/` → Python/Django (voir `backend/AGENTS.md`).
- `simba_ia/` → Python/FastAPI.
- `frontend/` → app web.
- `ids/eidStack-CMU/` → TypeScript/NestJS (tiers).
