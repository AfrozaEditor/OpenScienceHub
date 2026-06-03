from fastapi import APIRouter

from app.schemas.extract import ExtractRequest, ExtractResponse
from app.services.extraction import extract_metadata

router = APIRouter(tags=["extract"])


@router.post("/extract", response_model=ExtractResponse)
def post_extract(req: ExtractRequest) -> ExtractResponse:
    return extract_metadata(req)
