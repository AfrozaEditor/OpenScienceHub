from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.similar import SimilarRequest, SimilarResponse
from app.services.similarity import find_similar

router = APIRouter(tags=["similar"])


@router.post("/similar", response_model=SimilarResponse)
def post_similar(req: SimilarRequest, db: Session = Depends(get_db)) -> SimilarResponse:
    return find_similar(db, req)
