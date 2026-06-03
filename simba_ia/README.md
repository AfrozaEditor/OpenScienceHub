# simba_ia

Microservice **IA** d'OpenScience Hub : extraction de métadonnées PDF + Assistant IA sourcé, similarité, résumé. **FastAPI / PostgreSQL + pgvector**. Appelé uniquement par le backend Django.

Voir les docs de référence dans [`docs/`](docs/) (PRD, ARCHITECTURE, RAG_PIPELINE, DATA_MODEL, API_SPEC, INTEGRATION, FREE_STACK_OPTIONS).

Guides opérationnels :

- [`docs/LIVE_RUNBOOK.md`](docs/LIVE_RUNBOOK.md) — configuration et exploitation en full live.
- [`docs/TEST_PLAN.md`](docs/TEST_PLAN.md) — description des tests à exécuter et critères d'acceptation.

## Stack retenue

- Texte PDF : `pdfplumber` (+ OCR `OCRmyPDF`/`Tesseract` FR/EN pour les scannés)
- Métadonnées : LLM (Groq), avec GROBID optionnel plus tard
- Embeddings : **Mistral** (`mistral-embed`, 1024d) → `pgvector VECTOR(1024)`
- Génération : **Groq** (`qwen/qwen3-32b`), fallback Gemini (`gemini-2.0-flash`)
- Tout est live : aucun fallback simulé n'est activé en runtime.

## Démarrage rapide (mode live)

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements-dev.txt
cp .env.example .env          # renseigner MISTRAL_API_KEY, GROQ_API_KEY, GEMINI_API_KEY
docker compose up -d db        # PostgreSQL + pgvector
uvicorn app.main:app --reload --port 8001
# http://localhost:8001/health  ·  http://localhost:8001/docs
```

GROBID est optionnel et désactivé par défaut (`GROBID_URL=`). Ne le lancez que si vous voulez enrichir l'extraction académique depuis des PDF.

Pour activer l'OCR local des PDF scannés hors Docker, installer aussi les binaires système `tesseract-ocr`, `tesseract-ocr-fra`, `tesseract-ocr-eng`, `ghostscript`, puis `pip install -r requirements-ocr.txt`.

## Tests & qualité

```bash
pytest
pytest -W error
ruff check . && black --check .
```

## Endpoints

`GET /health` · `POST /v1/extract` · `POST /v1/index` · `DELETE /v1/index/{version_id}` · `POST /v1/assistant/query` · `POST /v1/similar` · `POST /v1/summarize`

Auth service-to-service : header `X-API-Key` (sauf `/health`). Contrat détaillé : [`docs/API_SPEC.md`](docs/API_SPEC.md).
