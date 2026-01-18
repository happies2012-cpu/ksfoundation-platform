
from typing import List, Dict
from pydantic import BaseModel

class AppPreset(BaseModel):
    id: str
    name: str
    description: str
    docker_image: str
    default_ports: List[int]
    category: str

class AppStoreService:
    """
    Manages One-Click Applications ("Own Cloud").
    """
    
    CATALOG = [
        AppPreset(
            id="nextcloud",
            name="Nextcloud",
            description="Your private file storage and cloud suite.",
            docker_image="nextcloud:latest",
            default_ports=[8080],
            category="Productivity"
        ),
        AppPreset(
            id="filebrowser",
            name="File Browser",
            description="Simple web-based file manager.",
            docker_image="filebrowser/filebrowser",
            default_ports=[80],
            category="Utilities"
        ),
        AppPreset(
            id="wordpress",
            name="WordPress",
            description="The world's most popular website builder.",
            docker_image="wordpress:latest",
            default_ports=[80],
            category="CMS"
        ),
        AppPreset(
            id="uptime-kuma",
            name="Uptime Kuma",
            description="Self-hosted monitoring tool.",
            docker_image="louislam/uptime-kuma:1",
            default_ports=[3001],
            category="Monitoring"
        ),
        # --- Polyglot Stacks for 'Single Prompt' Deployment ---
        AppPreset(
            id="java-tomcat",
            name="Java (Tomcat)",
            description="Apache Tomcat 10 for Java Web Apps.",
            docker_image="tomcat:10-jdk17",
            default_ports=[8080],
            category="Development"
        ),
        AppPreset(
            id="php-lamp",
            name="PHP (LAMP)",
            description="Apache + PHP 8.2 environment.",
            docker_image="php:8.2-apache",
            default_ports=[80],
            category="Development"
        ),
        AppPreset(
            id="sap-dev",
            name="SAP NetWeaver (Dev)",
            description="SAP ABAP AS NetWeaver 7.5x (Requires 16GB+ RAM).",
            docker_image="sapse/abap-platform-trial:1909",
            default_ports=[3200, 3300, 8000, 44300],
            category="Enterprise"
        )
    ]

    def get_catalog(self) -> List[AppPreset]:
        return self.CATALOG

    def generate_deploy_command(self, app_id: str, subdomain: str) -> str:
        """
        Generates the Docker command to deploy an app with Traefik labels.
        """
        app = next((a for a in self.CATALOG if a.id == app_id), None)
        if not app:
            raise ValueError("App not found")
            
        port = app.default_ports[0]
        
        # Generates a clean docker run command
        # In production this might use docker-compose
        return (
            f"docker run -d --name {app_id}-{subdomain} --restart always "
            f"--label 'traefik.enable=true' "
            f"--label 'traefik.http.routers.{app_id}-{subdomain}.rule=Host(`{subdomain}.ksfoundation.space`)' "
            f"--label 'traefik.http.services.{app_id}-{subdomain}.loadbalancer.server.port={port}' "
            f"{app.docker_image}"
        )

app_store_service = AppStoreService()
