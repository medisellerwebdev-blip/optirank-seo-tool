from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from typing import Optional, List
from services.ai_engine import AIEngine
from database import get_db, GeneratedContent
from sqlalchemy.orm import Session
import base64

router = APIRouter()
ai_engine = AIEngine()

@router.post("/generate")
async def generate_content(
    keyword: str = Form(...),
    context: Optional[str] = Form(""),
    url: Optional[str] = Form(""),
    files: Optional[List[UploadFile]] = File(None),
    db: Session = Depends(get_db)
):
    try:
        processed_files = []
        if files:
            for file in files:
                content = await file.read()
                processed_files.append({
                    "mime_type": file.content_type,
                    "data": base64.b64encode(content).decode("utf-8")
                })
        
        result = await ai_engine.generate_seo_content(keyword, context, url, processed_files)
        
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])

        # Save to DB
        db_content = GeneratedContent(
            keyword=keyword,
            content=result.get("content"),
            meta_title=result.get("meta_title"),
            meta_description=result.get("meta_description"),
            seo_score=result.get("seo_score"),
            data=result
        )
        db.add(db_content)
        db.commit()
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history")
async def get_history(db: Session = Depends(get_db)):
    return db.query(GeneratedContent).order_by(GeneratedContent.created_at.desc()).limit(10).all()
