import sys
import os
sys.path.append(os.getcwd())

from app.core.database import engine

print(f"✅ Engine Configured with Dialect: {engine.dialect.name}")
print(f"✅ Connection String: {engine.url}")
