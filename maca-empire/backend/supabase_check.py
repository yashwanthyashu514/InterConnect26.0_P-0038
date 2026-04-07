
import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

s = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
tables = ["users", "vault", "documents", "court_cases"]
results = {}

for t in tables:
    try:
        res = s.table(t).select("count", count="exact").limit(1).execute()
        results[t] = "Exists"
    except Exception as e:
        results[t] = str(e)

with open("supabase_check.txt", "w") as f:
    for t, status in results.items():
        f.write(f"{t}: {status}\n")

print("Done")
