import os
import json
import base64
from typing import List, Optional, Dict, Any
from openai import OpenAI
from google.generativeai import types
from dotenv import load_dotenv
from services.seo_analyzer import SEOAnalyzer

load_dotenv()

class AIEngine:
    def __init__(self):
        # Initialize OpenAI
        self.openai_key = os.getenv("OPENAI_API_KEY")
        self.openai_client = None
        if self.openai_key:
            self.openai_client = OpenAI(api_key=self.openai_key)
        
        # Initialize Gemini
        self.gemini_key = os.getenv("GEMINI_API_KEY")
        self.gemini_model = None
        if self.gemini_key:
            genai.configure(api_key=self.gemini_key)
            self.gemini_model = genai.GenerativeModel('gemini-flash-latest')

        # Default Provider
        self.provider = os.getenv("AI_PROVIDER", "openai").lower()
        self.seo_analyzer = SEOAnalyzer()

    def _get_provider(self) -> str:
        # We can make this dynamic if we add a database setting or global state
        return os.getenv("AI_PROVIDER", "openai").lower()

    async def generate_seo_content(self, keyword: Optional[str] = None, context: str = "", url: str = "", files: List[Dict[str, Any]] = []) -> Dict[str, Any]:
        # Scrape URL if provided for more context
        scraped_content = ""
        if url:
            analysis = await self.seo_analyzer.analyze_url(url)
            if "raw" in analysis:
                raw = analysis["raw"]
                scraped_content = f"URL Content: Title: {raw.get('title')}, Meta: {raw.get('meta_description')}, Keywords: {raw.get('detected_keywords')}, Headings: {raw.get('headings')}"

        prompt = f"""
        Generate highly optimized SEO and AEO content based on the provided inputs.
        
        Inputs:
        - Target Keyword: {keyword if keyword else "Not provided (Derive from other inputs)"}
        - User Context: {context if context else "Not provided"}
        - Reference URL Analyzed: {url if url else "Not provided"}
        - Scraped Data from URL: {scraped_content if scraped_content else "N/A"}
        - Image/Media context: Provided in vision analysis (if any)

        Instructions:
        1. If 'Target Keyword' is not provided, you MUST analyze the 'Scraped Data', 'User Context', and any images to determine the most relevant topic/keyword and generate content for that.
        2. Full article in HTML (using h1, h2, h3, p, strong, lists).
        3. Ensure beautiful vertical spacing by using appropriate HTML tags.
        4. Do NOT include any markdown code blocks (like ```html) inside the JSON 'content' field.
        5. Meta Title (max 60 chars) and Meta Description (max 160 chars).
        6. AEO section with direct answers to potential user questions.
        7. FAQ Schema (JSON-LD format).
        8. Keyword suggestions with estimated density.
        9. Internal linking suggestions based on common SEO structures.
        10. Readability score and SEO score (0-100).

        Return ONLY a JSON object with this structure:
        {{
            "content": "<h1>Title</h1><p>Paragraph with <strong>bold</strong> text...</p><h2>Section</h2><ul><li>List item</li></ul>",
            "meta_title": "string",
            "meta_description": "string",
            "faq_schema": {{}},
            "keywords": [{{ "word": "string", "density": "string" }}],
            "tags": ["string"],
            "internal_links": ["string"],
            "seo_score": 85,
            "readability_score": 90,
            "aeo_answers": [{{ "question": "string", "answer": "string" }}]
        }}
        """

        provider = self._get_provider()
        
        if provider == "openai" and self.openai_client:
            messages = [
                {"role": "system", "content": "You are an expert SEO Content Strategist. Return only valid JSON."},
                {"role": "user", "content": [{"type": "text", "text": prompt}]}
            ]
            for f in files:
                if "image" in f["mime_type"]:
                    messages[1]["content"].append({
                        "type": "image_url",
                        "image_url": {"url": f"data:{f['mime_type']};base64,{f['data']}"}
                    })
            response = self.openai_client.chat.completions.create(
                model="gpt-4o",
                messages=messages,
                response_format={ "type": "json_object" }
            )
            return json.loads(response.choices[0].message.content)

        elif provider == "gemini" and self.gemini_model:
            parts = [prompt]
            for f in files:
                parts.append({"mime_type": f["mime_type"], "data": f["data"]})
            response = self.gemini_model.generate_content(parts)
            res_text = response.text.replace("```json", "").replace("```", "").strip()
            return json.loads(res_text)
        
        return {"error": "AI Provider not configured correctly"}

    async def analyze_image(self, image_data: str, mime_type: str) -> Dict[str, Any]:
        prompt = """
        Analyze this image for SEO purposes.
        Return ONLY a JSON object with this structure:
        {
            "fileName": "optimized-hyphenated-name.jpg",
            "altText": "Descriptive alt text for accessibility",
            "titleAttribute": "Concise title for image tag",
            "caption": "Helpful visible caption",
            "schema": "JSON-LD ImageObject schema string (escaped)"
        }
        """
        provider = self._get_provider()

        if provider == "openai" and self.openai_client:
            response = self.openai_client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "user", "content": [
                        {"type": "text", "text": prompt},
                        {"type": "image_url", "image_url": {"url": f"data:{mime_type};base64,{image_data}"}}
                    ]}
                ],
                response_format={ "type": "json_object" }
            )
            return json.loads(response.choices[0].message.content)

        elif provider == "gemini" and self.gemini_model:
            response = self.gemini_model.generate_content([
                prompt,
                {"mime_type": mime_type, "data": image_data}
            ])
            res_text = response.text.replace("```json", "").replace("```", "").strip()
            return json.loads(res_text)

        return {"error": "AI Provider not configured correctly"}

    async def generate_keywords(self, root_keyword: str) -> Dict[str, Any]:
        prompt = f"""
        Generate a comprehensive keyword research report for: '{root_keyword}'.
        Provide:
        1. Monthly search volume, keyword difficulty (0-100), primary intent, and estimated CPC.
        2. Long-tail keyword ideas with metrics (volume, kd, intent).
        3. A list of relevant questions people ask.
        4. Topic clusters for content planning.

        Return ONLY a JSON object with this exact structure:
        {{
            "volume": "Estimated Monthly Volume (e.g. '12,500')",
            "kd": 45,
            "intent": "Commercial",
            "cpc": "$1.20",
            "ideas": [
                {{ "keyword": "string", "volume": "string", "kd": 30, "cpc": "$0.80", "intent": "Informational" }}
            ],
            "questions": [
                {{ "question": "string", "volume": "string" }}
            ],
            "clusters": [
                {{ "name": "string", "count": 12 }}
            ]
        }}
        """
        provider = self._get_provider()

        if provider == "openai" and self.openai_client:
            response = self.openai_client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": prompt}],
                response_format={ "type": "json_object" }
            )
            return json.loads(response.choices[0].message.content)

        elif provider == "gemini" and self.gemini_model:
            response = self.gemini_model.generate_content(prompt)
            res_text = response.text.replace("```json", "").replace("```", "").strip()
            return json.loads(res_text)

        return {"error": "AI Provider not configured"}

    async def generate_backlinks(self, keyword: str) -> Dict[str, Any]:
        prompt = f"""
        Find high-quality backlink opportunities for a site targeting: '{keyword}'.
        Provide:
        1. A summary of total opportunities, average Domain Rating (DR), and traffic potential.
        2. A list of 5-8 specific prospect domains with DR, traffic, type (Guest Post, etc.), and relevance.
        3. Professional outreach templates for Guest Posts and Broken Link Building.

        Return ONLY a JSON object with this structure:
        {{
            "totalOpportunities": 1200,
            "averageDr": 65,
            "estTraffic": "500K+",
            "opportunities": [
                {{ "domain": "example.com", "dr": 70, "traffic": "50K", "type": "Guest Post", "relevance": "High", "contact": "editor@example.com" }}
            ],
            "outreachTemplates": {{
                "guestPost": "Professional email template...",
                "brokenLink": "Professional email template..."
            }}
        }}
        """
        provider = self._get_provider()

        if provider == "openai" and self.openai_client:
            response = self.openai_client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": prompt}],
                response_format={ "type": "json_object" }
            )
            return json.loads(response.choices[0].message.content)

        elif provider == "gemini" and self.gemini_model:
            response = self.gemini_model.generate_content(prompt)
            res_text = response.text.replace("```json", "").replace("```", "").strip()
            return json.loads(res_text)

        return {"error": "AI Provider not configured"}
        # Final cleanup for unused methods or logic if needed.
