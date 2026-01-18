from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import init_db

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="High-performance AI Backend with Local Authentication",
    version="0.1.0",
)

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    init_db()
    print("✅ Database initialized")

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

# Include routers
from app.routers.api import router as api_router
from app.routers.hosting import router as hosting_router
from app.routers.intelligence import router as intel_router
from app.routers.auth import router as auth_router

app.include_router(auth_router, prefix=settings.API_V1_STR, tags=["Authentication"])
app.include_router(api_router, prefix=settings.API_V1_STR)
app.include_router(hosting_router, prefix=settings.API_V1_STR)
app.include_router(intel_router, prefix=settings.API_V1_STR)
