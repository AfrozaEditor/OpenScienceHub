from fastapi import APIRouter

from app.api.v1 import assistant, extract, index, similar, summarize

api_router = APIRouter()
api_router.include_router(extract.router)
api_router.include_router(index.router)
api_router.include_router(assistant.router)
api_router.include_router(similar.router)
api_router.include_router(summarize.router)
