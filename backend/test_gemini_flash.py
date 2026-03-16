import os
import asyncio
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv(dotenv_path='c:/Users/user/Desktop/SEO Tool/backend/.env')

async def test_gemini():
    gemini_key = os.getenv("GEMINI_API_KEY")
    print(f"Testing Gemini Flash Latest...")
    
    try:
        genai.configure(api_key=gemini_key)
        model = genai.GenerativeModel('gemini-flash-latest')
        response = model.generate_content("Say 'Flash is working'")
        print(f"Response: {response.text}")
        print("Success")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_gemini())
