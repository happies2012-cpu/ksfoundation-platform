
from fastapi import APIRouter, HTTPException
from typing import List, Any
from app.services.data.google import google_service, PlaceResult
from app.services.data.social import social_service, SocialProfile
from app.services.data.identity import identity_service

router = APIRouter()

@router.get("/intel/places", response_model=List[PlaceResult])
async def search_places(keyword: str, location: str = "37.7749,-122.4194"):
    """Google Intelligence: Search for businesses/places."""
    return await google_service.search_nearby_business(keyword, location)

@router.get("/intel/social", response_model=List[SocialProfile])
async def search_social(query: str):
    """Social Graph: Search Meta/Yahoo."""
    return await social_service.search_social_identity(query)

@router.get("/intel/identity")
async def lookup_identity(phone: str):
    """Identity: Phone lookup."""
    return await identity_service.lookup_phone(phone)
