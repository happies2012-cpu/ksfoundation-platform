
import asyncio
import docker
from typing import Dict, Any, Optional
from pydantic import BaseModel

class ContainerInfo(BaseModel):
    id: str
    name: str
    status: str
    ports: Dict[str, Any]
    url: Optional[str] = None

class ProvisioningService:
    """
    Manages "Space Allocation" using Docker Containers.
    Creates isolated environments for Student/NGO projects.
    """
    
    def __init__(self):
        try:
            self.client = docker.from_env()
        except Exception:
            print("⚠️ Docker not available locally. Using mock client.")
            self.client = None

    async def provision_space(self, user_id: str, project_name: str, tech_stack: str = "python-fastapi") -> ContainerInfo:
        """
        Allocates a new container for a user project.
        """
        container_name = f"ksf-{user_id}-{project_name}".lower().replace(" ", "-")
        
        # Image selection based on stack
        image = "python:3.11-slim"
        command = "python -m http.server 8000" # Default placeholder
        
        if tech_stack == "node-next":
            image = "node:18-alpine"
            command = "npm start"
        
        print(f"🏗️  Provisioning space: {container_name} using {image}...")
        
        if self.client:
            try:
                # Run the container
                # In production, we would use network='traefik_web' to auto-expose
                container = self.client.containers.run(
                    image,
                    name=container_name,
                    command=command,
                    detach=True,
                    # Limits for Free Tier (Students/NGOs)
                    mem_limit="512m",
                    cpu_quota=50000, # 50% of 1 CPU
                    labels={
                        "traefik.enable": "true",
                        f"traefik.http.routers.{container_name}.rule": f"Host(`{project_name}.ksfoundation.space`)"
                    },
                    remove=True # For demo purposes, ephemeral
                )
                
                return ContainerInfo(
                    id=container.id[:12],
                    name=container_name,
                    status="running",
                    ports={"8000/tcp": None}, # Internal routing only
                    url=f"https::{project_name}.ksfoundation.space"
                )
            except Exception as e:
                print(f"❌ Docker Error: {e}")
                # Fallback implementation for when Docker isn't actually running in this agent env
                return self._mock_provision(container_name, project_name)
        
        return self._mock_provision(container_name, project_name)

    def _mock_provision(self, name: str, project_name: str) -> ContainerInfo:
        """Mock response when Docker is unavailable."""
        return ContainerInfo(
            id="mock-7f8a9d",
            name=name,
            status="provisioned (mock)",
            ports={"80/tcp": 80},
            url=f"https::{project_name}.ksfoundation.space"
        )

provisioning_service = ProvisioningService()
