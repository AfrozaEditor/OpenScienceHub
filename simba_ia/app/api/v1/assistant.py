from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.assistant import AssistantQueryRequest, AssistantQueryResponse
from app.services.generation import answer_query

router = APIRouter(tags=["assistant"])


@router.post("/assistant/query", response_model=AssistantQueryResponse)
def post_assistant_query(
    req: AssistantQueryRequest, db: Session = Depends(get_db)
) -> AssistantQueryResponse:
    return answer_query(db, req)
