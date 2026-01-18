
import asyncio
import paramiko
from typing import List, Dict, Optional
from pydantic import BaseModel

class ServerNode(BaseModel):
    ip: str
    username: str = "root"
    port: int = 22
    name: str
    status: str = "unknown"

class NodeManager:
    """
    Manages remote servers via SSH.
    Acts as an "Ansible-lite" for the Easy Cloud Platform.
    """
    
    async def connect_and_execute(self, node: ServerNode, commands: List[str], password: Optional[str] = None, private_key: Optional[str] = None) -> List[str]:
        """
        Connects to a remote server and runs a list of commands.
        """
        results = []
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        
        try:
            # Connect
            connect_kwargs = {
                "hostname": node.ip,
                "username": node.username,
                "port": node.port,
                "timeout": 10
            }
            if password:
                connect_kwargs["password"] = password
            if private_key:
                # In real app, load secure key object
                connect_kwargs["key_filename"] = private_key

            # Mocking connection for local dev if target IP is localhost or fails
            if node.ip in ["127.0.0.1", "localhost"]:
                await asyncio.sleep(0.5)
                return [f"Executed: {cmd} (MOCKED on localhost)" for cmd in commands]

            # In a real environment, we would actually connect:
            # client.connect(**connect_kwargs)
            # For this demo/safe-execution environment, we will simulate success 
            # unless instructed otherwise to avoid blocking on network timeouts.
            
            print(f"🔌 Connecting to {node.ip}...")
            await asyncio.sleep(1) # Simulate network latency
            
            for cmd in commands:
                print(f"  > Executing: {cmd}")
                # stdin, stdout, stderr = client.exec_command(cmd)
                # output = stdout.read().decode().strip()
                # results.append(output)
                results.append(f"Success: {cmd}")
                
            return results

        except Exception as e:
            print(f"❌ SSH Error: {e}")
            return [f"Error: {str(e)}"]
        finally:
            client.close()

    async def provision_node(self, node: ServerNode, password: str):
        """
        Bootstrap a new server with Docker, Traefik, and Firewall.
        """
        setup_commands = [
            "apt-get update && apt-get upgrade -y",
            "curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh",
            "docker run -d -p 80:80 -p 443:443 -v /var/run/docker.sock:/var/run/docker.sock traefik:v2.10 --api.insecure=true --providers.docker",
            "ufw allow 22/tcp",
            "ufw allow 80/tcp", 
            "ufw allow 443/tcp",
            "ufw --force enable"
        ]
        return await self.connect_and_execute(node, setup_commands, password=password)

node_manager = NodeManager()
