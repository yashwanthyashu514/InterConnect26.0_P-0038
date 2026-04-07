
import os
from supabase import create_client, Client
from dotenv import load_dotenv
import uuid

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not all([SUPABASE_URL, SUPABASE_KEY]):
    print("Missing env vars")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def test_supabase_tables():
    print("Testing Supabase Table Presence...")
    tables = ["users", "vault", "documents", "court_cases"]
    for t in tables:
        try:
            res = supabase.table(t).select("count", count="exact").limit(1).execute()
            print(f"✅ Table '{t}' exists.")
        except Exception as e:
            print(f"❌ Table '{t}' check failed: {e}")

def test_rpc_functions():
    print("\nTesting RPC Functions...")
    funcs = ["match_documents", "match_court_cases"]
    for f in funcs:
        try:
            # We call with dummy data
            res = supabase.rpc(f, {
                "query_embedding": [0.0]*4096,
                "match_threshold": 0.5,
                "match_count": 1
            }).execute()
            print(f"✅ Function '{f}' exists.")
        except Exception as e:
            print(f"❌ Function '{f}' check failed: {e}")

if __name__ == "__main__":
    test_supabase_tables()
    test_rpc_functions()
