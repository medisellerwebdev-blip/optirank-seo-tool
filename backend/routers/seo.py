from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from services.seo_analyzer import SEOAnalyzer
from services.ai_engine import AIEngine
from database import get_db, SEOReport
from sqlalchemy.orm import Session
import base64

router = APIRouter()
seo_analyzer = SEOAnalyzer()
ai_engine = AIEngine()

@router.get("/analyze")
async def analyze_seo(url: str, db: Session = Depends(get_db)):
    try:
        result = await seo_analyzer.analyze_url(url)
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
            
        # Save to DB
        report = SEOReport(
            url=url,
            overall_score=80, # Placeholder logic
            data=result
        )
        db.add(report)
        db.commit()
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/image-analyze")
async def analyze_image(file: UploadFile = File(...)):
    try:
        content = await file.read()
        image_data = base64.b64encode(content).decode("utf-8")
        result = await ai_engine.analyze_image(image_data, file.content_type)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
