from fastapi import APIRouter, HTTPException
from services.ai_engine import AIEngine
from services.backlink_engine import BacklinkEngine

router = APIRouter()
ai_engine = AIEngine()
backlink_engine = BacklinkEngine(ai_engine)

@router.get("/find")
async def find_backlinks(target: str):
    try:
        return await backlink_engine.find_opportunities(target)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
