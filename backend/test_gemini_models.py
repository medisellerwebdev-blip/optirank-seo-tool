import os
import asyncio
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv(dotenv_path='c:/Users/user/Desktop/SEO Tool/backend/.env')

async def test_models():
    gemini_key = os.getenv("GEMINI_API_KEY")
    genai.configure(api_key=gemini_key)
    
    models_to_test = ['gemini-1.5-flash', 'gemini-pro', 'gemini-1.5-pro']
    
    for model_name in models_to_test:
        print(f"Testing model: {model_name}...")
        try:
            model = genai.GenerativeModel(model_name)
            response = model.generate_content("test")
            print(f"Success with {model_name}!")
            return model_name
        except Exception as e:
            print(f"Error with {model_name}: {e}")
    return None

if __name__ == "__main__":
    asyncio.run(test_models())
