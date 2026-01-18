import psycopg2
import sys
import os

# Connection string provided by user
dsn = "postgresql://postgres:XN1nPJXNVebe4HRJ7uV4FpOMo0JMSEHZlFy81v0nDUoFjiKyEHhDMbBaPY9ChHWj@db.qszwmkspmamcvktkjprf.supabase.co:5432/postgres"

print(f"🔌 Attempting connection to: {dsn.split('@')[1]}")

try:
    conn = psycopg2.connect(dsn, connect_timeout=10)
    print("✅ Successfully connected to Postgres Database!")
    
    # Get server version
    cur = conn.cursor()
    cur.execute("SELECT version();")
    version = cur.fetchone()[0]
    print(f"📊 Server Version: {version}")
    
    cur.close()
    conn.close()

except psycopg2.OperationalError as e:
    print(f"❌ Connection Failed (OperationalError): {e}")
    # Check for hostname issues
    if "could not translate host name" in str(e):
        print("💡 Tip: The hostname 'sckkwkgsc4csgc0c48gckooo' looks incorrect. Is it a specialized internal DNS?")
    sys.exit(1)
except Exception as e:
    print(f"❌ Connection Failed: {e}")
    sys.exit(1)
