from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os

router = APIRouter(prefix="/api/settings", tags=["settings"])

class AIProviderUpdate(BaseModel):
    provider: str

@router.get("/")
async def get_settings():
    return {
        "ai_provider": os.getenv("AI_PROVIDER", "openai")
    }

@router.post("/ai-provider")
async def update_ai_provider(update: AIProviderUpdate):
    provider = update.provider.lower()
    if provider not in ["openai", "gemini"]:
        raise HTTPException(status_code=400, detail="Invalid provider. Choose 'openai' or 'gemini'.")
    
    # Update environment variable in memory
    os.environ["AI_PROVIDER"] = provider
    return {"message": f"AI Provider switched to {provider}", "current": provider}
