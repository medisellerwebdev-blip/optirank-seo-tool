from services.ai_engine import AIEngine
from typing import Dict, Any

class BacklinkEngine:
    def __init__(self, ai_engine: AIEngine):
        self.ai = ai_engine

    async def find_opportunities(self, target: str) -> Dict[str, Any]:
        return await self.ai.generate_backlinks(target)
