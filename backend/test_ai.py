import os
import asyncio
from openai import OpenAI
import google.generativeai as genai
from dotenv import load_dotenv

# Use absolute path to the .env file
load_dotenv(dotenv_path='c:/Users/user/Desktop/SEO Tool/backend/.env')

async def test_keys():
    openai_key = os.getenv("OPENAI_API_KEY")
    gemini_key = os.getenv("GEMINI_API_KEY")
    provider = os.getenv("AI_PROVIDER", "openai")
    
    print(f"Provider: {provider}")
    print(f"OpenAI Key: {openai_key[:10] if openai_key else 'None'}...")
    print(f"Gemini Key: {gemini_key[:10] if gemini_key else 'None'}...")
    
    # Test OpenAI
    if openai_key:
        try:
            client = OpenAI(api_key=openai_key)
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": "test"}]
            )
            print("OpenAI Success")
        except Exception as e:
            print(f"OpenAI Error: {e}")
    
    # Test Gemini
    if gemini_key:
        try:
            genai.configure(api_key=gemini_key)
            model = genai.GenerativeModel('gemini-1.5-flash')
            response = model.generate_content("test")
            print("Gemini Success")
        except Exception as e:
            print(f"Gemini Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_keys())
