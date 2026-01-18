
from fastapi import APIRouter, HTTPException
from typing import List
from app.services.domain import domain_service, DomainSearchResult
from app.services.provisioning import provisioning_service, ContainerInfo
from pydantic import BaseModel

router = APIRouter()

class ProvisionRequest(BaseModel):
    user_id: str
    project_name: str
    tech_stack: str = "python-fastapi"

@router.get("/domains/check", response_model=List[DomainSearchResult])
async def check_domain(q: str):
    """Check availability of a domain name."""
    return await domain_service.check_availability(q)

@router.post("/hosting/provision", response_model=ContainerInfo)
async def provision_hosting(request: ProvisionRequest):
    """Allocate server space (Docker Container) for a new project."""
    return await provisioning_service.provision_space(
        request.user_id,
        request.project_name,
        request.tech_stack
    )
