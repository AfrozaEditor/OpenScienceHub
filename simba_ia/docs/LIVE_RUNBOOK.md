# simba_ia — Runbook full live

Ce document décrit l'exploitation de `simba_ia` en **mode full live strict**.

## Objectif

`simba_ia` est le microservice IA interne d'OpenScience Hub. En mode live, il utilise uniquement des composants réels :

- FastAPI pour l'API interne consommée par le backend Django.
- PostgreSQL + pgvector pour les chunks et embeddings.
- Mistral Embeddings (`mistral-embed`, 1024 dimensions) pour l'indexation et le retrieval.
- Groq (`qwen/qwen3-32b`) pour la génération de réponse.
- Gemini (`gemini-2.0-flash`) comme fallback LLM live.
- pdfplumber pour l'extraction texte PDF.
- OCR local optionnel via OCRmyPDF/Tesseract si un PDF n'a pas de couche texte.

Il n'y a pas de provider simulé en runtime. Si un provider réel est absent ou indisponible, le service doit échouer explicitement.

## Configuration requise

Variables principales dans `.env` :

```text
SIMBA_MODE=live
SIMBA_API_KEY=<secret partagé avec le backend>
DATABASE_URL=postgresql+psycopg://simba:simba@localhost:5432/simba
DB_SCHEMA=simba

EMBEDDING_PROVIDER=mistral
EMBEDDING_MODEL=mistral-embed
EMBEDDING_DIM=1024
MISTRAL_API_KEY=<secret>

LLM_PROVIDER=groq
LLM_MODEL=qwen/qwen3-32b
LLM_FALLBACKS=gemini
GROQ_API_KEY=<secret>
GEMINI_API_KEY=<secret>
GEMINI_MODEL=gemini-2.0-flash

GROBID_URL=
OCR_ENABLED=true
OCR_LANGUAGES=fra+eng
```

`GROBID_URL` reste vide pour l'instant. GROBID sera activé uniquement quand le besoin et les ressources seront disponibles.

## Démarrage local

```bash
cd simba_ia
source .venv/bin/activate
docker compose up -d db
uvicorn app.main:app --host 127.0.0.1 --port 8001
```

Si `8001` est déjà occupé, utiliser un port libre :

```bash
uvicorn app.main:app --host 127.0.0.1 --port 8018
```

## Health check attendu

```bash
curl -sS http://127.0.0.1:8001/health
```

Réponse attendue :

```json
{
  "status": "ok",
  "mode": "live",
  "embedding_provider": "mistral",
  "llm_provider": "groq",
  "db": "ok"
}
```

## Flow live minimal

Le flow minimal à valider avant intégration backend est :

```text
/health
→ /v1/index (texte + métadonnées + visibilité)
→ /v1/assistant/query (question + allowed_visibilities)
→ réponse ANSWERED avec sources non vides
```

L'Assistant IA ne doit jamais répondre sans sources. Si aucun chunk autorisé n'est trouvé, il doit renvoyer `NO_CONTEXT_FOUND`.

## Règles de sécurité

- Ne jamais commiter `.env`.
- Ne jamais afficher les clés API dans les logs ou les exceptions.
- Les logs HTTP de bas niveau sont abaissés pour éviter d'exposer des URLs sensibles.
- La clé Gemini est transmise en header `x-goog-api-key`, pas dans l'URL.
- Le service est interne : les endpoints `/v1/*` exigent `X-API-Key`.
- Le backend reste responsable des droits métier ; `simba_ia` applique strictement les filtres reçus (`allowed_visibilities`, type, institution, département, année).

## Nettoyage des données de smoke test

Les tests automatisés nettoient leurs propres versions. Pour nettoyer manuellement une version de test connue :

```bash
python - <<'PY'
from uuid import UUID
from app.db import repositories
from app.db.session import SessionLocal

version_id = UUID("99999999-9999-9999-9999-999999999998")
with SessionLocal() as db:
    deleted = repositories.delete_version_chunks(db, version_id)
print(f"deleted_chunks={deleted}")
PY
```

Ne lancer cette commande que sur une version de test identifiée.
