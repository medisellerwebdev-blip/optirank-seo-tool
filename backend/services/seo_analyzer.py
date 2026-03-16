import httpx
from bs4 import BeautifulSoup
from typing import Dict, Any, Optional
import re

class SEOAnalyzer:
    async def analyze_url(self, url: str) -> Dict[str, Any]:
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(url, timeout=10.0, follow_redirects=True)
                response.raise_for_status()
                html = response.text
                
                soup = BeautifulSoup(html, 'html.parser')
                
                # Basic Meta Data
                title = soup.title.string if soup.title else "No title found"
                meta_desc = soup.find('meta', attrs={'name': 'description'})
                desc = meta_desc['content'] if meta_desc else "No description found"
                
                # Headings
                headings = {
                    "h1": [h.get_text(strip=True) for h in soup.find_all('h1')],
                    "h2": [h.get_text(strip=True) for h in soup.find_all('h2')],
                    "h3": [h.get_text(strip=True) for h in soup.find_all('h3')]
                }
                
                # Tech checks
                has_favicon = soup.find('link', rel=re.compile(r'icon', re.I)) is not None
                
                # Extract text for basic keyword detection (naive)
                text = soup.get_text()
                words = re.findall(r'\w+', text.lower())
                word_freq = {}
                stops = set(['the', 'and', 'a', 'to', 'of', 'in', 'is', 'it', 'you', 'for', 'on', 'with', 'as', 'this'])
                for w in words:
                    if len(w) > 3 and w not in stops:
                        word_freq[w] = word_freq.get(w, 0) + 1
                
                top_keywords = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)[:10]
                
                # Robots.txt check (naive)
                domain = '/'.join(url.split('/')[:3])
                robots_url = f"{domain}/robots.txt"
                has_robots = False
                try:
                    robots_res = await client.get(robots_url)
                    has_robots = robots_res.status_code == 200
                except:
                    pass

                # Calculate metrics
                suggestions = self._generate_suggestions(title, desc, headings, has_favicon, has_robots)
                critical = sum(1 for s in suggestions if "missing" in s.lower() or "multiple" in s.lower())
                warnings = len(suggestions) - critical
                health_score = max(0, 100 - (critical * 15) - (warnings * 5))

                # Format elements for frontend
                elements = [
                    {"name": "Title Tag", "status": "success" if 30 <= len(title) <= 60 else "warning", "message": title},
                    {"name": "Meta Description", "status": "success" if len(desc) > 120 else "warning", "message": desc},
                    {"name": "H1 Heading", "status": "success" if len(headings["h1"]) == 1 else "error", "message": f"{len(headings['h1'])} detected"},
                    {"name": "Favicon", "status": "success" if has_favicon else "warning", "message": "Present" if has_favicon else "Missing"},
                    {"name": "Robots.txt", "status": "success" if has_robots else "warning", "message": "Detected" if has_robots else "Missing"}
                ]

                return {
                    "healthScore": health_score,
                    "criticalErrors": critical,
                    "warnings": warnings,
                    "elements": elements,
                    "robotsTxt": "User-agent: *\nDisallow: /admin\nAllow: /",
                    "sitemapPages": 12, # Static placeholder for now
                    "raw": {
                        "url": url,
                        "title": title,
                        "meta_description": desc,
                        "headings": headings,
                        "detected_keywords": [k for k, v in top_keywords]
                    }
                }
        except Exception as e:
            return {"error": f"Failed to analyze URL: {str(e)}"}

    def _generate_suggestions(self, title, desc, headings, has_favicon, has_robots) -> list:
        suggestions = []
        if len(title) < 30 or len(title) > 60:
            suggestions.append("Title tag length should be between 30 and 60 characters.")
        if desc == "No description found" or len(desc) < 120:
             suggestions.append("Meta description is missing or too short (target 120-160 chars).")
        if not headings["h1"]:
            suggestions.append("Missing H1 heading. Every page should have exactly one H1.")
        elif len(headings["h1"]) > 1:
            suggestions.append("Multiple H1 headings detected. Use only one per page.")
        if not has_favicon:
            suggestions.append("Favicon not detected.")
        if not has_robots:
            suggestions.append("Robots.txt not found.")
        return suggestions
