#!/usr/bin/env bash
set -e

echo "[entrypoint] Attente de la base de donnees..."
python - <<'PY'
import os, time, sys
import psycopg
url = os.environ.get("DATABASE_URL", "postgresql://osh:osh@db:5432/osh")
for attempt in range(30):
    try:
        psycopg.connect(url, connect_timeout=3).close()
        print("[entrypoint] Base de donnees prete.")
        sys.exit(0)
    except Exception as exc:
        print(f"[entrypoint] DB indisponible ({attempt+1}/30): {exc}")
        time.sleep(2)
print("[entrypoint] Echec de connexion a la base.")
sys.exit(1)
PY

echo "[entrypoint] Migrations..."
python manage.py makemigrations --noinput
python manage.py migrate --noinput

echo "[entrypoint] Fichiers statiques..."
python manage.py collectstatic --noinput || true

# Superuser optionnel (variables d'environnement)
if [ -n "$DJANGO_SUPERUSER_EMAIL" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ]; then
  echo "[entrypoint] Creation du superuser (si absent)..."
  python manage.py shell <<PY || true
from django.contrib.auth import get_user_model
U = get_user_model()
email = "${DJANGO_SUPERUSER_EMAIL}"
if not U.objects.filter(email=email).exists():
    U.objects.create_superuser(email=email, password="${DJANGO_SUPERUSER_PASSWORD}", full_name="Administrateur")
    print("Superuser cree.")
else:
    print("Superuser deja present.")
PY
fi

echo "[entrypoint] Demarrage : $@"
exec "$@"
