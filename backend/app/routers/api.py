
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict, Any
from app.ai.core import get_agent, AgentResponse

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    model: str = "gpt-4-turbo-preview"

class ChatResponse(BaseModel):
    response: str
    tools_used: List[Dict[str, Any]] = []

@router.post("/agent/chat", response_model=ChatResponse)
async def chat_with_agent(request: ChatRequest):
    """
    Interact with the AI Agent.
    The agent can check for available MCP tools and choose to use them.
    """
    try:
        agent = get_agent()
        # Override model if requested (and allowed/valid)
        if request.model:
            agent.model = request.model
            
        result: AgentResponse = await agent.chat(request.message)
        
        return ChatResponse(
            response=result.content,
            tools_used=result.tool_calls
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/mcp/tools")
async def list_mcp_tools():
    """List all currently available MCP tools connected to this backend."""
    from app.ai.mcp_client import mcp_manager
    try:
        tools = await mcp_manager.get_all_tools()
        return {"tools": [tool.dict() for tool in tools]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
