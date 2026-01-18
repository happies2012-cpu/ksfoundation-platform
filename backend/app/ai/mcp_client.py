
import asyncio
from typing import Any, Dict, List, Optional
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
from pydantic import BaseModel

class ToolDefinition(BaseModel):
    name: str
    description: str
    input_schema: Dict[str, Any]

class MCPClientWrapper:
    """
    Wrapper for Model Context Protocol (MCP) Client.
    Allows the AI agent to connect to external tools standardized by MCP.
    """
    def __init__(self, command: str, args: List[str], env: Optional[Dict[str, str]] = None):
        self.server_params = StdioServerParameters(
            command=command,
            args=args,
            env=env
        )
        self.session: Optional[ClientSession] = None
        self._exit_stack = None

    async def connect(self):
        """Connect to the MCP server."""
        # Note: In a real implementation, we would manage the context manager properly.
        # This is a simplified pattern for demonstration/integration.
        self.ctx = stdio_client(self.server_params)
        self.read, self.write = await self.ctx.__aenter__()
        self.session = ClientSession(self.read, self.write)
        await self.session.__aenter__()
        await self.session.initialize()

    async def list_tools(self) -> List[ToolDefinition]:
        """List available tools from the connected MCP server."""
        if not self.session:
            raise RuntimeError("MCP Client not connected")
        
        result = await self.session.list_tools()
        tools = []
        for tool in result.tools:
            tools.append(ToolDefinition(
                name=tool.name,
                description=tool.description or "",
                input_schema=tool.inputSchema
            ))
        return tools

    async def call_tool(self, name: str, arguments: Dict[str, Any]) -> Any:
        """Execute a tool on the MCP server."""
        if not self.session:
            raise RuntimeError("MCP Client not connected")
        
        result = await self.session.call_tool(name, arguments)
        return result

    async def close(self):
        """Close the connection."""
        if self.session:
            await self.session.__aexit__(None, None, None)
        if hasattr(self, 'ctx'):
            await self.ctx.__aexit__(None, None, None)

class MCPManager:
    """
    Manages multiple MCP clients (plugins).
    """
    def __init__(self):
        self.clients: Dict[str, MCPClientWrapper] = {}

    async def register_server(self, name: str, command: str, args: List[str], env: Optional[Dict[str, str]] = None):
        client = MCPClientWrapper(command, args, env)
        await client.connect()
        self.clients[name] = client
        print(f"✅ Registered MCP Server: {name}")

    async def get_all_tools(self) -> List[ToolDefinition]:
        all_tools = []
        for client in self.clients.values():
            try:
                tools = await client.list_tools()
                all_tools.extend(tools)
            except Exception as e:
                print(f"Error fetching tools from client: {e}")
        return all_tools

    async def cleanup(self):
        for client in self.clients.values():
            await client.close()

# Global singleton for managing plugins
mcp_manager = MCPManager()
