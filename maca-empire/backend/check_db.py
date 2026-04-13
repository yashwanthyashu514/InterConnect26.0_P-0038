import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not all([SUPABASE_URL, SUPABASE_KEY]):
    print("Missing env vars")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

tables = [
    "documents",
    "vault",
    "users",
    "dpdp_shield_documents",
    "cryptotax_documents",
    "esg_compass_documents",
    "heirguard_documents",
    "ai_governance_documents",
    "oracle_static_kb",
    "oracle_live_news"
]

print("Checking Tables:")
for t in tables:
    try:
        res = supabase.table(t).select("count", count="exact").limit(1).execute()
        print(f"OK: {t}")
    except Exception as e:
        print(f"ERR {t}: {e}")
