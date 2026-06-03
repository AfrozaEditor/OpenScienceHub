# AGENTS.md — frontend OpenScience Hub

Règles pour les assistants de code travaillant dans `frontend/`. Complète `../AGENTS.md` et `docs/SYSTEM_PROMPT.md`.

## Rôle

Application web d'OpenScience Hub (4 portails : Déposant, Validation académique, Archive publique, Administration). **React 18 + TypeScript + Vite + React Router (SPA)**. Consomme **uniquement l'API du backend Django**.

Docs de référence (lire avant de coder) : `docs/SYSTEM_PROMPT.md`, `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/DESIGN_SYSTEM.md`, `docs/PAGES.md`, `docs/API_INTEGRATION.md`, `docs/ROADMAP.md`, `docs/GLOSSARY.md`. Source design : `../../Docs/OpenScienceHub_UIUX_Specification_complete.md` et `..._Textual_Wireframes_complete.md`.

## Stack

- React 18 + TypeScript (strict), **Vite** + **React Router** (SPA, pas de SSR).
- Tailwind CSS (thème palette noir/rouge — voir `docs/DESIGN_SYSTEM.md`), composants style shadcn/ui (Radix).
- TanStack Query (données serveur), Zustand (état client léger), react-hook-form + zod (formulaires).
- Client API centralisé (`lib/api`) + JWT ; MSW pour mocker l'API.
- Tests : Vitest + Testing Library ; Playwright (roadmap). ESLint + Prettier.

## Structure

```text
frontend/
├── index.html · vite.config.ts · tsconfig.json · tailwind.config.ts
└── src/
    ├── main.tsx · App.tsx        # entrée + déclaration des routes (React Router)
    ├── routes/      # public/ deposant/ validation/ admin/ auth/
    ├── components/  # ui/ (boutons, badges, table, modale, skeletons) + layout/
    ├── features/    # works, validation, search, assistant, ssi, admin : {components,hooks,api,types}
    ├── lib/         # api (client + endpoints typés), auth (session, gardes), utils
    └── styles/
```

## Conventions

- TypeScript strict (pas de `any`) ; types alignés sur l'OpenAPI backend (génération recommandée).
- Données serveur via hooks TanStack Query ; mutations + invalidation + toasts.
- Tout accès réseau via `lib/api` (conforme `docs/API_INTEGRATION.md`) ; jamais d'appel direct à `simba_ia`/`e-IDStack`.
- Composants UI réutilisables (`components/ui`) ; logique métier dans `features/*`.
- Styles via tokens Tailwind (pas de couleurs en dur dispersées).
- Pas de commentaires qui paraphrasent le code.

## Commandes (à adapter une fois le projet initialisé)

```bash
npm install
npm run dev          # vite
npm run build && npm run preview
npm run lint
npm run test         # vitest
```

## Variables d'environnement

```text
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_APP_NAME=OpenScience Hub
VITE_API_MODE=mock        # mock (MSW) | live
# Aucune clé IA/SSI côté frontend.
```

## Garde-fous (rappel)

- **Le frontend ne parle qu'au backend** (jamais `simba_ia` ni `e-IDStack` en direct).
- **Assistant IA** : toujours afficher les **sources** ; message clair si aucune. « L'analyse IA est une aide ; la décision reste humaine ».
- **Métadonnées IA = propositions** (distinguer proposé / validé).
- **Confirmations critiques** en modale (soumission, décision, archivage, révocation, rôle/SSI).
- **Branding strict** : palette noir/rouge/gris/blanc, rouge parcimonieux, rendu premium.
- **Accessibilité** + **états systématiques** (vide/chargement/erreur) sur chaque écran.
- **Aucun secret côté client** ; gardes de routes par rôle (le backend reste l'autorité).
- **Vocabulaire** : « Assistant IA », « document vérifiable », « e-IDStack de IDS » ; jamais « RAG »/« DID »/« wallet » en surface.
- Suivre le scope **Phase 1** de `docs/ROADMAP.md` ; mocker l'API (MSW) si le backend n'est pas prêt.
