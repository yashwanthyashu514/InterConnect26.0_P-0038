import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

supabase = create_client(
    os.environ['NEXT_PUBLIC_SUPABASE_URL'],
    os.environ['SUPABASE_KEY']
)

# The table used for supreme_tax in ingester.py is 'tax_knowledge' (if exists) or 'oracle_static_kb'
tables = ['tax_knowledge', 'oracle_static_kb']
file_names = ['Income_Tax_AY_2024_25_Master_Rules.txt', 'supreme_tax::Income_Tax_AY_2024_25_Master_Rules.txt']

for table in tables:
    for fname in file_names:
        try:
            res = supabase.table(table).delete().eq('source', fname).execute()
            print(f"Deleted records from {table} for source {fname}: {len(res.data) if res.data else 0}")
        except Exception as e:
            print(f"Table {table} probably doesn't exist or is not available: {e}")
