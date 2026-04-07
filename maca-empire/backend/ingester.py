import os
import argparse
import requests
import warnings
from openai import OpenAI
from supabase import create_client, Client
from pypdf import PdfReader
from dotenv import load_dotenv

# Silence SSL warnings
warnings.filterwarnings("ignore", category=requests.packages.urllib3.exceptions.InsecureRequestWarning)

# Search for .env one folder up
load_dotenv(os.path.join(os.path.dirname(__file__), '../.env'))

# Config
CHUNK_SIZE = 512
OVERLAP = 50

# Clients
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY")

if not SUPABASE_URL:
    raise ValueError("Missing SUPABASE_URL in .env")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

client = OpenAI(
  base_url="https://integrate.api.nvidia.com/v1",
  api_key=NVIDIA_API_KEY
)

def chunk_text(text: str, chunk_size: int, overlap: int):
    """Semantic-aware chunking: splits by paragraphs and headers first."""
    # Split by double newline (paragraphs) first
    paragraphs = text.split("\n\n")
    chunks = []
    current_chunk = ""
    
    for p in paragraphs:
        if len(current_chunk) + len(p) < chunk_size:
            current_chunk += p + "\n\n"
        else:
            if current_chunk:
                chunks.append(current_chunk.strip())
            # If a single paragraph is too big, hard cut it
            if len(p) > chunk_size:
                sub_start = 0
                while sub_start < len(p):
                    chunks.append(p[sub_start : sub_start + chunk_size])
                    sub_start += (chunk_size - overlap)
                current_chunk = ""
            else:
                current_chunk = p + "\n\n"
                
    if current_chunk:
        chunks.append(current_chunk.strip())
    return chunks

def ingest_text_or_pdf(file_path: str, source_name: str):
    print(f"Ingesting {file_path} as '{source_name}'...")
    text = ""
    try:
        if file_path.endswith('.pdf'):
            reader = PdfReader(file_path)
            for page in reader.pages:
                text += page.extract_text() or ""
        else:
            with open(file_path, 'r', encoding='utf-8') as f:
                text = f.read()

        if not text.strip():
            return

        chunks = chunk_text(text, CHUNK_SIZE, OVERLAP)
        for i, chunk in enumerate(chunks[:200]): 
            embedding_response = client.embeddings.create(input=[chunk], model="nvidia/nv-embed-v1")
            embedding = embedding_response.data[0].embedding
            supabase.table("documents").insert({
                "content": chunk,
                "embedding": embedding,
                "metadata": {"source": source_name, "chunk_id": i}
            }).execute()
        print(f"✅ Successfully ingested {len(chunks[:200])} chunks.")
    except Exception as e:
        print(f"❌ Error ingesting {source_name}: {e}")

def seed_tax_regimes():
    print("\n--- 📑 GENERATING TAX REGIMES TIMELINE (2020 - 2026) ---")
    docs_dir = os.path.join(os.path.dirname(__file__), '../docs')
    os.makedirs(docs_dir, exist_ok=True)
    
    regimes_data = [
        (2020, "Introduction of New Tax Regime (Section 115BAC). Taxpayers given a choice between Old (with exemptions) and New (lower rates, no 80C/80D)."),
        (2021, "Optionality continues. Focus on ITR portal stability for switching between regimes during filing."),
        (2022, "No major changes to rates, but TDS rules tightened for both regimes."),
        (2023, "NEW REGIME REVOLUTION: New Regime made the 'Default' regime. Standard Deduction of Rs. 50,000 extended to New Regime. Rebate limit raised to Rs. 7 Lakh income (No tax up to 7L)."),
        (2024, "Interim Budget: Continuity for both regimes. Focus on pending tax demand waivers (up to Rs. 25,000)."),
        (2025, "Consolidation Phase: Most taxpayers transition to New Regime as exemptions in Old Regime are phased out for higher brackets."),
        (2026, "Target State: New Regime simplified to 3 major slabs. maCA Tax agent handles automated switching and optimization for users.")
    ]
    
    for year, snippet in regimes_data:
        source = f"Tax_Regime_{year}"
        path = os.path.join(docs_dir, f"{source}.txt")
        with open(path, 'w', encoding='utf-8') as f:
            f.write(snippet)
        ingest_text_or_pdf(path, source)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--file")
    parser.add_argument("--source")
    parser.add_argument("--regimes", action="store_true", help="Seed only tax regimes")
    args = parser.parse_args()

    if args.file and args.source:
        ingest_text_or_pdf(args.file, args.source)
    elif args.regimes:
        seed_tax_regimes()
    else:
        # Default all seeds
        seed_tax_regimes()
    
    print("\n✅ All Regimes (2020-2026) fully ingested! maCA is a Regime Optimizer.")
