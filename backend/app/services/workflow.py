
import os
import subprocess
from pydantic import BaseModel
from typing import Optional

class WorkflowResult(BaseModel):
    filename: str
    status: str
    output: str

class WorkflowGenerator:
    """
    The 'Autonomous Engine'.
    Allows the Agent to write python scripts to solve problems it doesn't have tools for.
    "Generative Workflow" capabilities.
    """
    
    WORKFLOW_DIR = "app/workflows"
    
    def __init__(self):
        os.makedirs(self.WORKFLOW_DIR, exist_ok=True)
        
    async def generate_and_execute(self, task_name: str, python_code: str) -> WorkflowResult:
        """
        Writes code to a file and executes it.
        WARNING: In production this needs sandbox (Docker/Firecracker).
        """
        filename = f"{task_name.replace(' ', '_').lower()}.py"
        filepath = os.path.join(self.WORKFLOW_DIR, filename)
        
        print(f"🧬 GenAI: Creating autonomous workflow '{filename}'...")
        
        # 1. Write the code
        with open(filepath, "w") as f:
            f.write(python_code)
            
        # 2. Execute it
        try:
            # We use a subprocess to run the generated script
            # This allows "infinite" extensibility as the agent can write anything
            result = subprocess.run(
                ["python3", filepath],
                capture_output=True,
                text=True,
                timeout=30 # Safety timeout
            )
            
            output = result.stdout if result.returncode == 0 else result.stderr
            status = "success" if result.returncode == 0 else "error"
            
            return WorkflowResult(
                filename=filename,
                status=status,
                output=output.strip()
            )
            
        except Exception as e:
            return WorkflowResult(filename=filename, status="system_error", output=str(e))

workflow_engine = WorkflowGenerator()
