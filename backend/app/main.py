
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="High-performance AI Backend using uv, FastAPI, and MCP integration.",
    version="0.1.0",
)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin).rstrip("/") for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

@app.get("/health")
async def health_check():
    return {
        "status": "online",
        "project": settings.PROJECT_NAME,
        "mode": "light_speed_ai",
        "version": "0.1.0"
    }

@app.get("/")
async def root():
    return {
        "message": "Welcome to the KSF AI Platform Backend. Visit /docs for API documentation."
    }

from app.routers.api import router as api_router
from app.routers.hosting import router as hosting_router
from app.routers.intelligence import router as intel_router

app.include_router(api_router, prefix=settings.API_V1_STR)
app.include_router(hosting_router, prefix=settings.API_V1_STR)
app.include_router(intel_router, prefix=settings.API_V1_STR)
