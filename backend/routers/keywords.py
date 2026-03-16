from fastapi import APIRouter, Depends, HTTPException
from services.ai_engine import AIEngine
from services.keyword_engine import KeywordEngine
from database import get_db, KeywordResult
from sqlalchemy.orm import Session

router = APIRouter()
ai_engine = AIEngine()
keyword_engine = KeywordEngine(ai_engine)

@router.get("/research")
async def research_keywords(keyword: str, db: Session = Depends(get_db)):
    try:
        result = await keyword_engine.get_keyword_report(keyword)
        
        # Save to DB
        db_result = KeywordResult(
            keyword=keyword,
            data=result
        )
        db.add(db_result)
        db.commit()
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
