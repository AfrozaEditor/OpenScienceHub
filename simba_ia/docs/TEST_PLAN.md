# simba_ia — Plan de tests

Ce plan décrit les tests à exécuter pour valider `simba_ia` en mode **full live strict**.

## 1. Préconditions

Avant de tester :

```bash
cd simba_ia
source .venv/bin/activate
docker compose up -d db
```

Vérifier la configuration sans afficher les secrets :

```bash
python - <<'PY'
from app.core.config import settings
for key in [
    "simba_mode",
    "embedding_provider",
    "embedding_model",
    "embedding_dim",
    "llm_provider",
    "llm_model",
    "llm_fallbacks",
    "grobid_url",
]:
    print(f"{key}={getattr(settings, key)!r}")
print("mistral_api_key=set" if settings.mistral_api_key else "mistral_api_key=missing")
print("groq_api_key=set" if settings.groq_api_key else "groq_api_key=missing")
print("gemini_api_key=set" if settings.gemini_api_key else "gemini_api_key=missing")
PY
```

Valeurs attendues :

- `simba_mode='live'`
- `embedding_provider='mistral'`
- `embedding_dim=1024`
- `llm_provider='groq'`
- `llm_model='qwen/qwen3-32b'`
- `llm_fallbacks='gemini'`
- clés Mistral, Groq et Gemini présentes

## 2. Tests qualité obligatoires

### Lint

```bash
ruff check app tests
```

Attendu : `All checks passed!`

### Formatage

```bash
black --check app tests
```

Attendu : aucun fichier à reformater.

### Tests automatisés live

```bash
pytest -W error
```

Attendu : tous les tests passent, sans warning.

Ces tests couvrent :

- `/health` en mode live.
- Auth `X-API-Key` sur les endpoints protégés.
- Extraction métadonnées via LLM live.
- Indexation réelle en PostgreSQL + pgvector.
- Embeddings Mistral (dimension 1024).
- Retrieval avec filtres de visibilité.
- Réponse Assistant IA sourcée via Groq/Gemini live.
- Suppression d'index par version.
- Résumé et similarité sur chunks indexés.

## 3. Smoke test HTTP live

Démarrer le service sur un port libre :

```bash
uvicorn app.main:app --host 127.0.0.1 --port 8018
```

### Health

```bash
curl -sS http://127.0.0.1:8018/health
```

Attendu :

- `status=ok`
- `mode=live`
- `embedding_provider=mistral`
- `llm_provider=groq`
- `db=ok`

### Indexation

```bash
curl -sS -X POST http://127.0.0.1:8018/v1/index \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $SIMBA_API_KEY" \
  -d '{
    "work_id":"77777777-7777-7777-7777-777777777998",
    "document_id":"88888888-8888-8888-8888-888888888998",
    "version_id":"99999999-9999-9999-9999-999999999998",
    "text":"OpenScience Hub archive les mémoires, thèses et articles universitaires. La vérification repose sur un hash SHA-256, une preuve numérique et des sources indexées accessibles à l Assistant IA.",
    "metadata":{
      "title":"Smoke documentation live",
      "author":"Bell Aqil",
      "type":"MEMOIRE",
      "institution":"Université Test",
      "department":"Informatique",
      "year":2026,
      "keywords":["preuve","hash","assistant IA"]
    },
    "visibility":"PUBLIC"
  }'
```

Attendu :

- `status=INDEXED`
- `chunk_count >= 1`

### Assistant IA sourcé

```bash
curl -sS -X POST http://127.0.0.1:8018/v1/assistant/query \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $SIMBA_API_KEY" \
  -d '{
    "question":"Comment la plateforme vérifie un mémoire ?",
    "filters":{"allowed_visibilities":["PUBLIC"],"type":"MEMOIRE"},
    "top_k":2
  }'
```

Attendu :

- `answer_status=ANSWERED`
- `answer` non vide
- `sources` non vide
- chaque source a `title`, `excerpt`, `score`
- `score` entre `0.0` et `1.0`

## 4. Tests de sécurité

### Requête sans API key

```bash
curl -sS -o /tmp/simba_unauthorized.txt -w "%{http_code}\n" \
  -X POST http://127.0.0.1:8018/v1/assistant/query \
  -H "Content-Type: application/json" \
  -d '{"question":"test"}'
```

Attendu : `401`

### Filtre de visibilité

Créer un document `PRIVATE`, puis interroger avec :

```json
{"allowed_visibilities":["PUBLIC"]}
```

Attendu : le document privé n'apparaît jamais dans `sources`.

## 5. Tests à faire avant intégration backend

- Tester `/v1/extract` avec un vrai PDF numérique via `file_url`.
- Tester un PDF scanné pour valider la route OCR (`OCRmyPDF + Tesseract`).
- Tester la taille limite de PDF et les timeouts.
- Tester `/v1/index` sur un document long (plusieurs dizaines de chunks).
- Tester la réindexation d'une même `version_id` : les anciens chunks doivent être remplacés.
- Tester `DELETE /v1/index/{version_id}` après retrait/changement de visibilité.
- Tester `/v1/assistant/query` avec `allowed_visibilities=["INSTITUTION_ONLY"]` et filtres par département/année.
- Tester le fallback Gemini en simulant une indisponibilité Groq.
- Tester la non-exposition des secrets dans les logs en cas d'erreur provider.

## 6. Tests à faire plus tard quand GROBID sera réactivé

GROBID est désactivé pour l'instant (`GROBID_URL=`). Quand il sera disponible :

- Démarrer GROBID.
- Définir `GROBID_URL=http://localhost:8070`.
- Tester `/v1/extract` sur un article académique.
- Vérifier que titre, auteurs, résumé et mots-clés GROBID sont fusionnés avec la sortie LLM.
- Tester le comportement si GROBID est indisponible : extraction LLM seule, sans blocage.

## 7. Critères d'acceptation

Le module est considéré prêt côté IA si :

- La suite qualité passe (`ruff`, `black`, `pytest -W error`).
- `/health` est `ok` en live.
- Mistral retourne des embeddings de dimension 1024.
- Groq génère une réponse propre sans raisonnement interne exposé.
- L'Assistant IA répond uniquement avec sources, ou renvoie `NO_CONTEXT_FOUND`.
- Les filtres de visibilité sont respectés.
- Aucun secret n'apparaît dans les logs.
