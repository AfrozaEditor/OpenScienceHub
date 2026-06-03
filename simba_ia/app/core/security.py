from fastapi import Header, HTTPException, status

from app.core.config import settings


async def require_api_key(
    x_api_key: str | None = Header(default=None, alias="X-API-Key"),
) -> None:
    """Auth service-to-service : seul le backend appelle simba_ia."""
    if not x_api_key or x_api_key != settings.simba_api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="X-API-Key manquante ou invalide",
            headers={"WWW-Authenticate": "API-Key"},
        )
