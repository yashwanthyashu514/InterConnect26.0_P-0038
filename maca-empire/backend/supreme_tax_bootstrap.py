import os
import sys
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()


def supabase_client():
    url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")
    if not url or not key:
        raise RuntimeError("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_KEY in env")
    return create_client(url, key)


def table_exists(s, name: str) -> bool:
    try:
        s.table(name).select("*").limit(1).execute()
        return True
    except Exception:
        return False


def rpc_exists(s, name: str) -> bool:
    try:
        # Call with the expected named args. If PostgREST schema cache doesn't
        # see the function, it returns PGRST202.
        if name == "match_tax_docs":
            s.rpc(
                name,
                {
                    "query_embedding": [0.0] * 4096,
                    "match_threshold": 0.0,
                    "match_count": 1,
                },
            ).execute()
        else:
            s.rpc(name, {}).execute()
        return True
    except Exception as e:
        msg = str(e)
        if "Could not find the function" in msg or "PGRST202" in msg:
            return False
        return True


def main() -> None:
    s = supabase_client()

    need_sql = []
    if not table_exists(s, "tax_knowledge"):
        need_sql.append("tax_knowledge")
    if not rpc_exists(s, "match_tax_docs"):
        need_sql.append("match_tax_docs")

    if need_sql:
        print("Supreme Tax is not provisioned yet in Supabase.")
        print("Missing:", ", ".join(need_sql))
        print()
        print("Run this SQL in Supabase SQL Editor first:")
        print("  backend/supreme_tax_rag_setup.sql")
        sys.exit(2)

    # If provisioned, migrate any fallback rows and re-ingest.
    from migrate_supreme_tax_from_oracle import main as migrate_main  # noqa: WPS433
    migrate_main()

    # Re-ingest from local docs folder into tax_knowledge.
    from ingester import ingest_agent  # noqa: WPS433
    ingest_agent("supreme_tax")

    print("Supreme Tax bootstrap complete (migrated + re-ingested).")


if __name__ == "__main__":
    main()

