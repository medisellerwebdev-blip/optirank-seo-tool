import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv(dotenv_path='c:/Users/user/Desktop/SEO Tool/backend/.env')

def list_models():
    gemini_key = os.getenv("GEMINI_API_KEY")
    genai.configure(api_key=gemini_key)
    print("Listing Gemini Models:")
    try:
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(m.name)
    except Exception as e:
        print(f"Error listing models: {e}")

if __name__ == "__main__":
    list_models()
