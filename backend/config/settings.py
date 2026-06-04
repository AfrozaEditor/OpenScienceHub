"""Configuration Django — OpenScience Hub (backend).

Pilotee par variables d'environnement (voir .env.example).
"""
from datetime import timedelta
from pathlib import Path

import environ

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env(
    DJANGO_DEBUG=(bool, False),
    DJANGO_ALLOWED_HOSTS=(list, ["localhost", "127.0.0.1"]),
    CORS_ALLOWED_ORIGINS=(list, ["http://localhost:5173"]),
    CORS_ALLOWED_ORIGIN_REGEXES=(str, ""),
)

# Charge .env si present (dev local). En Docker, les variables sont injectees.
env_file = BASE_DIR / ".env"
if env_file.exists():
    environ.Env.read_env(str(env_file))

SECRET_KEY = env("DJANGO_SECRET_KEY", default="dev-insecure-secret-key")
DEBUG = env("DJANGO_DEBUG")
ALLOWED_HOSTS = env("DJANGO_ALLOWED_HOSTS")

# --- Applications ---------------------------------------------------------
DJANGO_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]

THIRD_PARTY_APPS = [
    "rest_framework",
    "rest_framework_simplejwt",
    "drf_spectacular",
    "django_filters",
    "corsheaders",
]

LOCAL_APPS = [
    "apps.common",
    "apps.accounts",
    "apps.institutions",
    "apps.works",
    "apps.documents",
    "apps.validation",
    "apps.archive",
    "apps.search",
    "apps.ai",
    "apps.ssi",
    "apps.audit",
    "apps.administration",
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"
WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

# API sans slash final (cohérent avec API_SPEC.md et le frontend).
APPEND_SLASH = False

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# --- Base de donnees ------------------------------------------------------
DATABASES = {
    "default": env.db("DATABASE_URL", default="postgresql://osh:osh@localhost:5432/osh"),
}

# --- Utilisateur ----------------------------------------------------------
AUTH_USER_MODEL = "accounts.User"

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# --- International --------------------------------------------------------
LANGUAGE_CODE = "fr-fr"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# --- Fichiers statiques / media ------------------------------------------
STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STORAGES = {
    "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
    "staticfiles": {"BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage"},
}
MEDIA_URL = "media/"
MEDIA_ROOT = BASE_DIR / env("MEDIA_ROOT", default="media")

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# --- DRF ------------------------------------------------------------------
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.IsAuthenticated",),
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
    "DEFAULT_FILTER_BACKENDS": (
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ),
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
}

SPECTACULAR_SETTINGS = {
    "TITLE": "OpenScience Hub API",
    "DESCRIPTION": "API backend d'OpenScience Hub — archivage, validation, recherche, IA et preuve SSI.",
    "VERSION": "0.1.0",
    "SERVE_INCLUDE_SCHEMA": False,
}

# --- CORS -----------------------------------------------------------------
CORS_ALLOWED_ORIGINS = env("CORS_ALLOWED_ORIGINS")
_cors_allowed_origin_regexes = env("CORS_ALLOWED_ORIGIN_REGEXES").strip()
CORS_ALLOWED_ORIGIN_REGEXES = (
    [pattern.strip() for pattern in _cors_allowed_origin_regexes.split(";;") if pattern.strip()]
    if _cors_allowed_origin_regexes
    else []
)

# --- Integrations externes (clients) -------------------------------------
SIMBA_IA_URL = env("SIMBA_IA_URL", default="http://localhost:8001")
SIMBA_API_KEY = env("SIMBA_API_KEY", default="")
SIMBA_MODE = env("SIMBA_MODE", default="mock")

EIDSTACK_BASE_URL = env("EIDSTACK_BASE_URL", default="http://localhost:3000")
EIDSTACK_API_KEY = env("EIDSTACK_API_KEY", default="")
EIDSTACK_ENVIRONMENT = env("EIDSTACK_ENVIRONMENT", default="TEST")
EIDSTACK_CREDENTIAL_DEFINITION_ID = env("EIDSTACK_CREDENTIAL_DEFINITION_ID", default="")
EIDSTACK_CONNECTION_ID = env("EIDSTACK_CONNECTION_ID", default="")
EIDSTACK_WALLET_ID = env("EIDSTACK_WALLET_ID", default="openscience-hub-issuer-local")
EIDSTACK_WALLET_KEY = env("EIDSTACK_WALLET_KEY", default="openscience-hub-wallet-key")
EIDSTACK_AGENT_ENDPOINT = env("EIDSTACK_AGENT_ENDPOINT", default="http://localhost:3021")
EIDSTACK_AGENT_LABEL = env("EIDSTACK_AGENT_LABEL", default="OpenScienceHub IDS Local")
EIDSTACK_AGENT_SEED = env("EIDSTACK_AGENT_SEED", default="00000000000000000000000000000001")
SSI_MODE = env("SSI_MODE", default="mock")

PUBLIC_VERIFY_BASE_URL = env("PUBLIC_VERIFY_BASE_URL", default="http://localhost:5173/verify")
BACKEND_PUBLIC_BASE_URL = env("BACKEND_PUBLIC_BASE_URL", default="http://127.0.0.1:8000")
