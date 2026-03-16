from services.ai_engine import AIEngine
from typing import Dict, Any

class KeywordEngine:
    def __init__(self, ai_engine: AIEngine):
        self.ai = ai_engine

    async def get_keyword_report(self, keyword: str) -> Dict[str, Any]:
        # Coordinator for keyword research
        return await self.ai.generate_keywords(keyword)
