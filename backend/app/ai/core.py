
from typing import Any, Dict, List, Optional
from pydantic import BaseModel
import openai
from app.core.config import settings
from app.ai.mcp_client import mcp_manager

# Note: We will use a simplified Agent structure here.
# In a robust implementation, we would use pydantic-ai or langchain agents.

class AgentResponse(BaseModel):
    content: str
    tool_calls: List[Dict[str, Any]] = []

from app.ai.models import model_gateway

class BaseAgent:
    def __init__(self, model: str = "gpt-4-turbo-preview"):
        self.model = model
        self.provider = model_gateway.get_provider_client(model)
        self.client = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self.system_prompt = "You are a helpful AI assistant with access to external tools via MCP."

    async def _get_tools_schema(self) -> List[Dict[str, Any]]:
        """
        Convert internal Services + MCP tools to OpenAI function schema.
        This enables 'Single Prompt' execution of complex tasks.
        """
        # 1. Get MCP Tools
        mcp_tools = await mcp_manager.get_all_tools()
        openai_tools = []
        for tool in mcp_tools:
            openai_tools.append({
                "type": "function",
                "function": {
                    "name": tool.name,
                    "description": tool.description,
                    "parameters": tool.input_schema
                }
            })
            
        # 2. Add Native Service Tools (The "Internal" MCP)
        # In a full implementation, we'd inspect these automatically.
        internal_tools = [
            {
                "type": "function",
                "function": {
                    "name": "provision_hosting",
                    "description": "Deploy a new project/container (Python, Node, PHP, Java).",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "project_name": {"type": "string"},
                            "tech_stack": {"type": "string", "enum": ["python-fastapi", "node-next", "java-tomcat", "php-lamp", "sap-dev"]}
                        },
                        "required": ["project_name", "tech_stack"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "check_domain_availability",
                    "description": "Check if a domain name is available.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "keyword": {"type": "string"}
                        },
                        "required": ["keyword"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "deploy_k3s_cluster",
                    "description": "Deploy a lightweight Kubernetes cluster on a node.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "node_ip": {"type": "string"},
                            "node_name": {"type": "string"}
                        },
                        "required": ["node_ip"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "create_gcp_server",
                    "description": "Create a FREE Tier Google Cloud server (e2-micro).",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "project_id": {"type": "string", "description": "GCP Project ID"},
                            "instance_name": {"type": "string", "description": "Name for the server"}
                        },
                        "required": ["project_id", "instance_name"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "search_nearby_business",
                    "description": "Find businesses/NGOs near a location via Google Maps.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "keyword": {"type": "string", "description": "Type of business (e.g. 'Schools', 'NGO')"},
                            "location": {"type": "string", "description": "Lat,Lng string (default: SF)"}
                        },
                        "required": ["keyword"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "search_social_identity",
                    "description": "Search social media (Meta/Yahoo) for a profile.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "query": {"type": "string", "description": "Name or Username"}
                        },
                        "required": ["query"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "lookup_phone",
                    "description": "Identify a phone number (Truecaller style).",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "phone_number": {"type": "string"}
                        },
                        "required": ["phone_number"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "search_products",
                    "description": "Find products prices on Amazon, Flipkart, Shopify.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "keyword": {"type": "string", "description": "Product name (e.g. 'iPhone 15', 'Shoes')"}
                        },
                        "required": ["keyword"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "generate_workflow",
                    "description": "AUTONOMOUS: Write and execute a Python script to solve ANY task not covered by other tools.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "task_name": {"type": "string", "description": "Name of the task (e.g., 'scrape_rss')"},
                            "python_code": {"type": "string", "description": "Complete, valid Python code to execute."}
                        },
                        "required": ["task_name", "python_code"]
                    }
                }
            }
        ]
        
        return openai_tools + internal_tools

    async def chat(self, user_message: str) -> AgentResponse:
        """
        Process a user message, determine if tools are needed, and return a response.
        Executes internal tools 'In Process' for single-prompt capabilities.
        """
        tools = await self._get_tools_schema()
        
        messages = [
            {"role": "system", "content": self.system_prompt},
            {"role": "user", "content": user_message}
        ]
        
        provider = self.provider

        if provider == "ollama_local":
            # Keyless / Local Inference
            import httpx
            # Convert tools to Ollama format if needed, or just prompt for now
            # For simplicity in this demo, we just pass the prompt
            async with httpx.AsyncClient() as client:
                try:
                    ollama_res = await client.post("http://localhost:11434/api/chat", json={
                        "model": "llama3", # Default local model
                        "messages": messages,
                        "stream": False
                    }, timeout=60.0)
                    if ollama_res.status_code == 200:
                        data = ollama_res.json()
                        message = type('obj', (object,), {'content': data['message']['content'], 'tool_calls': []})
                    else:
                        message = type('obj', (object,), {'content': "Error connecting to Local AI.", 'tool_calls': []})
                except Exception as e:
                     message = type('obj', (object,), {'content': f"Local AI unavailable: {str(e)}", 'tool_calls': []})
        else:
            # Standard OpenAI/Compatible API
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                tools=tools if tools else None,
                tool_choice="auto" if tools else None
            )
            message = response.choices[0].message
        
        # If tool calls are requested
        if message.tool_calls:
            tool_calls_data = []
            
            # --- AUTO-EXECUTE INTERNAL TOOLS (Single Prompt Magic) ---
            # For this MVP, we execute the internal tools *immediately* and return the result.
            from app.services.provisioning import provisioning_service
            from app.services.domain import domain_service
            from app.services.k3s_manager import k3s_manager
            import json
            
            content_response = ""
            
            for tool_call in message.tool_calls:
                fn_name = tool_call.function.name
                args = json.loads(tool_call.function.arguments)
                
                result = None
                
                if fn_name == "provision_hosting":
                    result = await provisioning_service.provision_space("user_auto", args.get("project_name"), args.get("tech_stack"))
                    content_response += f"✅ Successfully provisioned {args.get('project_name')} ({args.get('tech_stack')}). URL: {result.url}\n"
                    
                elif fn_name == "check_domain_availability":
                    results = await domain_service.check_availability(args.get("keyword"))
                    avail = [d.domain for d in results if d.available]
                    content_response += f"🔎 Domain Check: Available: {', '.join(avail[:3])}\n"

                elif fn_name == "deploy_k3s_cluster":
                   # Mock node
                   from app.services.node_manager import ServerNode
                   node = ServerNode(ip=args.get("node_ip"), name=args.get("node_name", "k3s-master"))
                   res = await k3s_manager.bootstrap_master(node)
                   content_response += f"☸️  K3s Cluster '{res.name}' deployed (Status: {res.status}).\n"

                elif fn_name == "create_gcp_server":
                   from app.services.gcp_manager import gcp_manager
                   res = await gcp_manager.create_free_tier_instance(args.get("project_id"), args.get("instance_name"))
                   content_response += f"☁️  Google Cloud: Server '{res.name}' created at {res.ip_address} ({res.machine_type}).\n"
                   
                elif fn_name == "search_nearby_business":
                    from app.services.data.google import google_service
                    res = await google_service.search_nearby_business(args.get("keyword"), args.get("location", "37.7749,-122.4194"))
                    names = [p.name for p in res]
                    content_response += f"📍 Found {len(res)} businesses near you: {', '.join(names[:3])}...\n"

                elif fn_name == "search_social_identity":
                    from app.services.data.social import social_service
                    res = await social_service.search_social_identity(args.get("query"))
                    found = [f"{p.platform}: {p.username}" for p in res]
                    content_response += f"👥 Social Identities Found: {', '.join(found)}\n"
                    
                elif fn_name == "lookup_phone":
                    from app.services.data.identity import identity_service
                    res = await identity_service.lookup_phone(args.get("phone_number"))
                    content_response += f"📞 Caller ID Result: {res.get('name')} ({res.get('carrier')})\n"
                
                elif fn_name == "search_products":
                    from app.services.data.commerce import commerce_service
                    res = await commerce_service.search_products(args.get("keyword"))
                    found_strs = [f"{p.store}: {p.title} - {p.price} {p.currency}" for p in res[:3]]
                    content_response += f"🛒 Commerce Results: {', '.join(found_strs)}\n"
                
                elif fn_name == "generate_workflow":
                    from app.services.workflow import workflow_engine
                    res = await workflow_engine.generate_and_execute(args.get("task_name"), args.get("python_code"))
                    content_response += f"🧬 Autonomous Workflow '{res.filename}' finished ({res.status}).\nOutput:\n{res.output}\n"

                # Record the call
                tool_calls_data.append({
                    "id": tool_call.id,
                    "function": fn_name,
                    "arguments": tool_call.function.arguments,
                    "result": str(result)
                })

            if content_response:
                return AgentResponse(
                    content=content_response.strip(),
                    tool_calls=tool_calls_data
                )
            # ---------------------------------------------------------
            
            return AgentResponse(
                content=message.content or "I need to use some tools to answer that.",
                tool_calls=tool_calls_data
            )

        return AgentResponse(content=message.content)

# Factory to get default agent
def get_agent() -> BaseAgent:
    return BaseAgent()
