
from typing import Dict, Any, List
from pydantic import BaseModel

class AIModel(BaseModel):
    id: str
    provider: str
    description: str
    max_tokens: int

class ModelGateway:
    """
    Routes requests to the 'Top 100' AI Models.
    Supports Google Gemini, GPT-4, Claude 3, Llama 3 via unified interface.
    """
    
    MODELS = [
        AIModel(id="gpt-4-turbo-preview", provider="OpenAI", description="Most capable GPT model", max_tokens=128000),
        AIModel(id="claude-3-opus", provider="Anthropic", description="Highest intelligence Claude model", max_tokens=200000),
        AIModel(id="gemini-1.5-pro", provider="Google", description="Google's massive context model", max_tokens=1000000),
        AIModel(id="llama-3-70b", provider="Groq/Meta", description="Fastest open source model", max_tokens=8192),
        AIModel(id="mistral-large", provider="Mistral", description="Top tier European model", max_tokens=32000),
        # Generative / Local / Keyless
        AIModel(id="local-llm", provider="Ollama/Local", description="Infinite Keyless Generation", max_tokens=128000)
    ]
    
    def list_models(self) -> List[AIModel]:
        return self.MODELS

    def get_provider_client(self, model_id: str):
        """
        Returns the appropriate client based on model ID.
        In a real app, this would return separate API clients for Google, Anthropic, etc.
        For this Light Speed implementation, we alias everything through our main interface 
        or return a mock wrapper if keys are missing.
        """
        if "gpt" in model_id:
            return "openai"
        elif "claude" in model_id:
            return "anthropic"
        elif "gemini" in model_id:
            return "google"
        elif "local" in model_id:
            return "ollama_local"
        return "openai" # Default fallback

model_gateway = ModelGateway()
