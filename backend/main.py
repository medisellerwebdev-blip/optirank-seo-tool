from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
from routers import content, keywords, seo, backlinks, dashboard, settings
import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="OptiRank AI API")

@app.middleware("http")
async def log_requests(request, call_next):
    print(f"Incoming request: {request.method} {request.url}")
    response = await call_next(request)
    print(f"Response status: {response.status_code}")
    return response

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/")
def read_root():
    return {"message": "Welcome to OptiRank AI API", "status": "online"}

app.include_router(content.router, prefix="/api/content", tags=["Content"])
app.include_router(keywords.router, prefix="/api/keywords", tags=["Keywords"])
app.include_router(seo.router, prefix="/api/seo", tags=["SEO"])
app.include_router(backlinks.router, prefix="/api/backlinks", tags=["Backlinks"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(settings.router)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
