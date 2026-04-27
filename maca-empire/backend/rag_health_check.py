"""
maCA Empire — RAG Health Check Script
Checks: env vars, doc files, Supabase tables, RPC match functions, embedding pipeline
"""
import os, sys
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

PASS = "[PASS]"
FAIL = "[FAIL]"
WARN = "[WARN]"

results = []

def check(label, ok, detail=""):
    icon = PASS if ok else FAIL
    line = f"  {icon} {label}"
    if detail:
        line += f"  →  {detail}"
    print(line)
    results.append((ok, label))

# ─────────────────────────────────────────────
# 1. ENV VARS
# ─────────────────────────────────────────────
print("\n══════════════════════════════════════════")
print("  1. ENVIRONMENT VARIABLES")
print("══════════════════════════════════════════")

SUPABASE_URL  = os.getenv("NEXT_PUBLIC_SUPABASE_URL") or os.getenv("SUPABASE_URL")
SUPABASE_KEY  = os.getenv("SUPABASE_KEY")
NVIDIA_KEY    = os.getenv("NVIDIA_API_KEY")

check("SUPABASE_URL",    bool(SUPABASE_URL),  SUPABASE_URL[:40] + "..." if SUPABASE_URL else "MISSING")
check("SUPABASE_KEY",    bool(SUPABASE_KEY),  "present" if SUPABASE_KEY else "MISSING")
check("NVIDIA_API_KEY",  bool(NVIDIA_KEY),    "present" if NVIDIA_KEY else "MISSING")

if not all([SUPABASE_URL, SUPABASE_KEY, NVIDIA_KEY]):
    print("\n[FATAL] Critical env vars missing — cannot continue RAG checks.\n")
    sys.exit(1)

# ─────────────────────────────────────────────
# 2. DOC FILES
# ─────────────────────────────────────────────
print("\n══════════════════════════════════════════")
print("  2. LOCAL KNOWLEDGE BASE FILES")
print("══════════════════════════════════════════")

BASE = Path(__file__).parent / "docs"

AGENT_DOCS = {
    "A1  Supreme Tax":         BASE / "supreme_tax",
    "A21 DPDP Shield":         BASE / "dpdp_shield",
    "A22 CryptoTax Pro":       BASE / "cryptotax_pro",
    "A23 ESG Compass":         BASE / "esg_compass",
    "A24 HeirGuard":           BASE / "heirguard",
    "A25 AI Governance":       BASE / "ai_governance_counsel",
    "A26 The Oracle":          BASE / "the_oracle",
}

for agent, folder in AGENT_DOCS.items():
    if not folder.exists():
        check(agent, False, f"folder missing: {folder}")
        continue
    files = list(folder.glob("*.pdf")) + list(folder.glob("*.txt"))
    total_kb = sum(f.stat().st_size for f in files) // 1024
    check(agent, len(files) > 0, f"{len(files)} files  ({total_kb} KB)")

# ─────────────────────────────────────────────
# 3. SUPABASE TABLE ROW COUNTS
# ─────────────────────────────────────────────
print("\n══════════════════════════════════════════")
print("  3. SUPABASE TABLE ROW COUNTS")
print("══════════════════════════════════════════")

try:
    from supabase import create_client
    sb = create_client(SUPABASE_URL, SUPABASE_KEY)
except Exception as e:
    print(f"  [FAIL] Cannot connect to Supabase: {e}")
    sys.exit(1)

TABLES = {
    "A1  Supreme Tax":   "tax_knowledge",
    "A21 DPDP Shield":   "dpdp_shield_documents",
    "A22 CryptoTax":     "cryptotax_documents",
    "A23 ESG Compass":   "esg_compass_documents",
    "A24 HeirGuard":     "heirguard_documents",
    "A25 AI Gov":        "ai_governance_documents",
    "A26 Oracle KB":     "oracle_static_kb",
    "    oracle_live":   "oracle_live_news",
    "    documents":     "documents",
}

for label, table in TABLES.items():
    try:
        res = sb.table(table).select("id", count="exact").limit(1).execute()
        count = res.count if hasattr(res, "count") and res.count is not None else len(res.data)
        check(f"{label}  [{table}]", True, f"{count} rows")
    except Exception as e:
        err = str(e)
        # PGRST116 = table not found, PGRST200 = schema issue
        if "does not exist" in err or "PGRST116" in err:
            check(f"{label}  [{table}]", False, "TABLE NOT FOUND — run SQL setup")
        else:
            check(f"{label}  [{table}]", False, err[:80])

# ─────────────────────────────────────────────
# 4. RPC MATCH FUNCTIONS
# ─────────────────────────────────────────────
print("\n══════════════════════════════════════════")
print("  4. RPC VECTOR SEARCH FUNCTIONS")
print("══════════════════════════════════════════")

# Use a dummy 1024-dim embedding (nvidia/nv-embed-v1 outputs 1024 dims)
DUMMY_EMBEDDING = [0.0] * 1024

RPC_FUNCTIONS = {
    "match_tax_docs":              "A1  Supreme Tax",
    "match_dpdp_documents":        "A21 DPDP Shield",
    "match_cryptotax_documents":   "A22 CryptoTax",
    "match_esg_documents":         "A23 ESG Compass",
    "match_heirguard_documents":   "A24 HeirGuard",
    "match_ai_governance_documents": "A25 AI Gov",
    "match_oracle_static":         "A26 Oracle KB",
    "match_documents":             "Generic",
}

for fn, agent in RPC_FUNCTIONS.items():
    try:
        res = sb.rpc(fn, {"query_embedding": DUMMY_EMBEDDING, "match_count": 1}).execute()
        check(f"{fn}  ({agent})", True, f"{len(res.data)} result(s) returned")
    except Exception as e:
        err = str(e)
        if "function" in err.lower() and "does not exist" in err.lower():
            check(f"{fn}  ({agent})", False, "FUNCTION MISSING — run rag_pipeline_setup.sql")
        else:
            check(f"{fn}  ({agent})", False, err[:90])

# ─────────────────────────────────────────────
# 5. EMBEDDING PIPELINE (NVIDIA NIM)
# ─────────────────────────────────────────────
print("\n══════════════════════════════════════════")
print("  5. NVIDIA NIM EMBEDDING API")
print("══════════════════════════════════════════")

try:
    from openai import OpenAI
    nim = OpenAI(base_url="https://integrate.api.nvidia.com/v1", api_key=NVIDIA_KEY)
    resp = nim.embeddings.create(
        input=["test query for RAG health check"],
        model="nvidia/nv-embed-v1",
        encoding_format="float",
        extra_body={"input_type": "query", "truncate": "END"}
    )
    dims = len(resp.data[0].embedding)
    check("nvidia/nv-embed-v1  (embedding)", True, f"dims={dims}  ✓")
except Exception as e:
    check("nvidia/nv-embed-v1  (embedding)", False, str(e)[:100])

# ─────────────────────────────────────────────
# 6. LLM INFERENCE (NVIDIA NIM)
# ─────────────────────────────────────────────
print("\n══════════════════════════════════════════")
print("  6. NVIDIA NIM LLM INFERENCE")
print("══════════════════════════════════════════")

try:
    resp = nim.chat.completions.create(
        model="meta/llama-3.3-70b-instruct",
        messages=[{"role": "user", "content": "Reply with exactly: RAG_OK"}],
        max_tokens=10
    )
    reply = resp.choices[0].message.content.strip()
    check("meta/llama-3.3-70b-instruct", True, f'LLM replied: "{reply}"')
except Exception as e:
    check("meta/llama-3.3-70b-instruct", False, str(e)[:100])

# ─────────────────────────────────────────────
# SUMMARY
# ─────────────────────────────────────────────
print("\n══════════════════════════════════════════")
print("  SUMMARY")
print("══════════════════════════════════════════")
passed = sum(1 for ok, _ in results if ok)
failed = sum(1 for ok, _ in results if not ok)
print(f"  {PASS} Passed : {passed}")
print(f"  {FAIL} Failed : {failed}")
print(f"  Total  : {len(results)}")

if failed == 0:
    print("\n  🟢  ALL RAG SYSTEMS OPERATIONAL — Production Ready\n")
else:
    print("\n  🔴  ACTION REQUIRED — Fix failed items above\n")
    for ok, label in results:
        if not ok:
            print(f"       → {label}")
    print()
