from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.summarize import SummarizeRequest, SummarizeResponse
from app.services.summarization import summarize

router = APIRouter(tags=["summarize"])


@router.post("/summarize", response_model=SummarizeResponse)
def post_summarize(req: SummarizeRequest, db: Session = Depends(get_db)) -> SummarizeResponse:
    return summarize(db, req)
