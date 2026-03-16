import os
import asyncio
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv(dotenv_path='c:/Users/user/Desktop/SEO Tool/backend/.env')

async def test_gemini():
    gemini_key = os.getenv("GEMINI_API_KEY")
    provider = os.getenv("AI_PROVIDER")
    print(f"Testing Gemini... Provider={provider}")
    
    try:
        genai.configure(api_key=gemini_key)
        model = genai.GenerativeModel('gemini-2.0-flash')
        response = model.generate_content("Say 'Gemini is working'")
        print(f"Response: {response.text}")
        print("Gemini Success")
    except Exception as e:
        print(f"Gemini Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_gemini())
