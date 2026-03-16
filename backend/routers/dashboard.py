from fastapi import APIRouter, HTTPException
from services.ai_engine import AIEngine
import json

router = APIRouter()
ai_engine = AIEngine()

@router.get("/insights")
async def get_insights():
    try:
        data_summary = """
        - Overall SEO Score: 89/100 (+4% from last week)
        - Organic Traffic: 24.5K (+12% from last month)
        - Keywords Ranked: 1,204 (+84 new keywords)
        - Content Issues: 12 (-2 from yesterday)
        """
        
        prompt = f"""
        Act as an expert SEO analyst. Analyze this data:
        {data_summary}
        
        Return ONLY a JSON object:
        {{
            "summary": "2-sentence performance summary",
            "topRecommendation": "Most important next step",
            "trendAnalysis": "Brief 7-day trend analysis"
        }}
        """
        
        response = ai_engine.model.generate_content(prompt)
        res_text = response.text.replace("```json", "").replace("```", "").strip()
        return json.loads(res_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
