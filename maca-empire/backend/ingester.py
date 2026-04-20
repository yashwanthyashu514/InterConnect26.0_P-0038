import os
import sys
import argparse
import re
import hashlib
from datetime import date
from pathlib import Path
from openai import OpenAI
from supabase import create_client
import pdfplumber
from dotenv import load_dotenv

load_dotenv()

supabase = create_client(
    os.environ['NEXT_PUBLIC_SUPABASE_URL'],
    os.environ['SUPABASE_KEY']
)

nim_client = OpenAI(
    base_url='https://integrate.api.nvidia.com/v1',
    api_key=os.environ['NVIDIA_API_KEY']
)

# Calculate base directory (maca-empire/backend)
BASE_DIR = Path(__file__).parent.resolve()

AGENT_CONFIG = {
    'dpdp_shield': {
        'folder': BASE_DIR / 'docs/dpdp_shield/',
        'table': 'dpdp_shield_documents',
        'default_category': 'DPDP Compliance'
    },
    'cryptotax_pro': {
        'folder': BASE_DIR / 'docs/cryptotax_pro/',
        'table': 'cryptotax_documents',
        'default_category': 'VDA Tax'
    },
    'esg_compass': {
        'folder': BASE_DIR / 'docs/esg_compass/',
        'table': 'esg_compass_documents',
        'default_category': 'ESG Compliance'
    },
    'heirguard': {
        'folder': BASE_DIR / 'docs/heirguard/',
        'table': 'heirguard_documents',
        'default_category': 'Succession Law'
    },
    'ai_governance_counsel': {
        'folder': BASE_DIR / 'docs/ai_governance_counsel/',
        'table': 'ai_governance_documents',
        'default_category': 'AI Governance'
    },
    'the_oracle': {
        'folder': BASE_DIR / 'docs/the_oracle/',
        'table': 'oracle_static_kb',
        'default_category': 'Financial Intelligence'
    },
    'supreme_tax': {
        'folder': BASE_DIR / 'docs/supreme_tax/',
        # Preferred production table for Supreme Tax is `tax_knowledge` (see `supreme_tax_rag_setup.sql`).
        # If not provisioned, ingestion will fall back to `oracle_static_kb` with a `supreme_tax::` source prefix.
        'table': 'tax_knowledge',
        'default_category': 'Taxation & Law'
    }
}

try:
    import tiktoken  # type: ignore
    _ENCODER = tiktoken.get_encoding("cl100k_base")
except Exception:
    _ENCODER = None


def estimate_tokens(text: str) -> int:
    if _ENCODER is not None:
        try:
            return len(_ENCODER.encode(text))
        except Exception:
            pass
    # Fallback heuristic: word/punctuation tokenization
    return len(re.findall(r"\w+|[^\w\s]", text, flags=re.UNICODE))


def split_sentences(text: str) -> list[str]:
    normalized = re.sub(r"\s+", " ", text).strip()
    if not normalized:
        return []
    parts = re.split(r"(?<=[\.\!\?\:\;])\s+", normalized)
    return [p.strip() for p in parts if p.strip()]


def enforce_chunk_caps(chunks: list[str], max_tokens: int = 260, overlap_words: int = 30) -> list[str]:
    capped: list[str] = []
    for chunk in chunks:
        if estimate_tokens(chunk) <= max_tokens:
            capped.append(chunk)
            continue
        words = chunk.split()
        i = 0
        window_words = 160
        step_words = max(20, window_words - overlap_words)
        while i < len(words):
            piece = " ".join(words[i:i + window_words]).strip()
            if piece and estimate_tokens(piece) > 0:
                capped.append(piece)
            i += step_words
    return capped


def chunk_text(full_text: str, target_tokens: int = 180, overlap_tokens: int = 30) -> list[str]:
    sentences = split_sentences(full_text)
    if not sentences:
        return []

    chunks: list[str] = []
    current: list[str] = []
    current_tokens = 0

    def flush_current() -> None:
        nonlocal current, current_tokens
        if not current:
            return
        chunk = " ".join(current).strip()
        if len(chunk) >= 120:
            chunks.append(chunk)
        # Retain overlap from tail of flushed chunk
        overlap: list[str] = []
        overlap_count = 0
        for sentence in reversed(current):
            t = estimate_tokens(sentence)
            if overlap_count + t > overlap_tokens and overlap:
                break
            overlap.insert(0, sentence)
            overlap_count += t
        current = overlap
        current_tokens = overlap_count

    for sentence in sentences:
        sentence_tokens = estimate_tokens(sentence)
        if sentence_tokens > target_tokens:
            # Hard split long run-on sentence by words
            words = sentence.split()
            partial: list[str] = []
            partial_tokens = 0
            for word in words:
                word_tokens = estimate_tokens(word)
                if partial_tokens + word_tokens > target_tokens and partial:
                    current.append(" ".join(partial))
                    current_tokens += partial_tokens
                    flush_current()
                    partial = []
                    partial_tokens = 0
                partial.append(word)
                partial_tokens += word_tokens
            if partial:
                sentence = " ".join(partial)
                sentence_tokens = estimate_tokens(sentence)
            else:
                continue

        if current_tokens + sentence_tokens > target_tokens and current:
            flush_current()

        current.append(sentence)
        current_tokens += sentence_tokens

    flush_current()
    chunks = enforce_chunk_caps(chunks, max_tokens=260, overlap_words=30)

    # Remove exact duplicates while preserving order
    seen = set()
    deduped: list[str] = []
    for chunk in chunks:
        h = hashlib.sha256(chunk.encode("utf-8")).hexdigest()
        if h not in seen:
            deduped.append(chunk)
            seen.add(h)
    return deduped


def infer_metadata(agent_name: str, file_name: str, chunk: str) -> dict[str, str]:
    lower_name = file_name.lower()
    lower_chunk = chunk.lower()

    section_match = re.search(
        r"\b(section|sec\.?|rule|article|act)\s*([0-9A-Za-z\-\(\)\/\.]+)",
        chunk,
        flags=re.IGNORECASE
    )
    section_ref = section_match.group(2) if section_match else ""

    year_match = re.search(r"\b(19|20)\d{2}(?:-\d{2})?\b", chunk)
    effective_date = ""
    if year_match:
        year_text = year_match.group(0)
        year_value = int(year_text[:4])
        effective_date = f"{year_value}-01-01"

    topic_tag = "General"
    jurisdiction = "India"
    if "sebi" in lower_name or "sebi" in lower_chunk:
        topic_tag = "SEBI"
    elif "gst" in lower_name or "gst" in lower_chunk:
        topic_tag = "GST"
    elif "income tax" in lower_chunk or "cbdt" in lower_name or "tax" in lower_name:
        topic_tag = "Income Tax"
    elif "rbi" in lower_name or "rbi" in lower_chunk:
        topic_tag = "RBI"
    elif "dpdp" in lower_name or "data protection" in lower_chunk:
        topic_tag = "DPDP"
    elif "ai" in lower_name or "algorithm" in lower_chunk:
        topic_tag = "AI Governance"
    elif "esg" in lower_name or "sustainability" in lower_chunk:
        topic_tag = "ESG"
    elif "succession" in lower_name or "probate" in lower_name:
        topic_tag = "Succession Law"

    if "eu" in lower_name or "european" in lower_chunk:
        jurisdiction = "EU"
    elif "oecd" in lower_name:
        jurisdiction = "OECD"

    if agent_name == "the_oracle":
        asset_class = "macro"
        if "crypto" in lower_name:
            asset_class = "crypto"
        elif "equity" in lower_chunk or "nse" in lower_name or "sebi" in lower_name:
            asset_class = "equity"
        elif "forex" in lower_name or "rbi" in lower_name:
            asset_class = "forex"
        return {
            "section_ref": section_ref,
            "topic_tag": topic_tag,
            "jurisdiction": jurisdiction,
            "effective_date": effective_date,
            "asset_class": asset_class,
            "knowledge_type": topic_tag
        }

    return {
        "section_ref": section_ref,
        "topic_tag": topic_tag,
        "jurisdiction": jurisdiction,
        "effective_date": effective_date
    }

def extract_text_from_pdf(pdf_path: str) -> list[str]:
    try:
        with pdfplumber.open(pdf_path) as pdf:
            full_text = ''
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    full_text += text + ' '
        return chunk_text(full_text)
    except Exception:
        # Some "PDF" assets are actually HTML/text blobs with a .pdf extension.
        with open(pdf_path, 'rb') as f:
            raw = f.read()
        decoded = raw.decode('utf-8', errors='ignore')
        stripped = re.sub(r'<[^>]+>', ' ', decoded)
        return chunk_text(stripped)

def extract_text_from_txt(txt_path: str) -> list[str]:
    with open(txt_path, 'r', encoding='utf-8') as f:
        full_text = f.read()
    return chunk_text(full_text)

def embed_text(text: str) -> list[float]:
    last_error = None
    for _ in range(3):
        try:
            response = nim_client.embeddings.create(
                input=[text],
                model='nvidia/nv-embed-v1',
                encoding_format='float',
                extra_body={'input_type': 'passage', 'truncate': 'END'}
            )
            return response.data[0].embedding
        except Exception as err:
            last_error = err
            continue
    raise RuntimeError(f"Embedding failed after retries: {last_error}")


def get_existing_hashes(table: str, source_name: str) -> set[str]:
    hashes: set[str] = set()
    try:
        resp = supabase.table(table).select("content").eq("source", source_name).execute()
        for row in (resp.data or []):
            content = row.get("content") if isinstance(row, dict) else None
            if isinstance(content, str):
                hashes.add(hashlib.sha256(content.encode("utf-8")).hexdigest())
    except Exception:
        return hashes
    return hashes


def build_payload(agent_name: str, file_name: str, chunk: str, embedding: list[float], category: str) -> dict:
    meta = infer_metadata(agent_name, file_name, chunk)
    payload = {"last_updated": date.today().isoformat()}

    if agent_name == "dpdp_shield":
        payload.update({"content": chunk, "embedding": embedding, "source": file_name, "category": category})
        payload["rule_number"] = meta["section_ref"]
    elif agent_name == "cryptotax_pro":
        payload.update({"content": chunk, "embedding": embedding, "source": file_name, "category": category})
        payload["section_number"] = meta["section_ref"]
        payload["cbdt_circular"] = meta["topic_tag"]
    elif agent_name == "esg_compass":
        payload.update({"content": chunk, "embedding": embedding, "source": file_name, "category": category})
        payload["framework"] = meta["topic_tag"]
        payload["section"] = meta["section_ref"]
    elif agent_name == "heirguard":
        payload.update({"content": chunk, "embedding": embedding, "source": file_name, "category": category})
        payload["act_name"] = meta["topic_tag"]
        payload["section_number"] = meta["section_ref"]
        payload["religion"] = meta["jurisdiction"]
    elif agent_name == "ai_governance_counsel":
        payload.update({"content": chunk, "embedding": embedding, "source": file_name, "category": category})
        payload["framework"] = meta["topic_tag"]
        payload["jurisdiction"] = meta["jurisdiction"]
        payload["risk_level"] = "medium"
    elif agent_name == "the_oracle":
        payload.update({"content": chunk, "embedding": embedding, "source": file_name, "category": category})
        payload["asset_class"] = meta["asset_class"]
        payload["knowledge_type"] = meta["knowledge_type"]
        payload["era"] = meta["effective_date"][:4] if meta["effective_date"] else "current"
    elif agent_name == "supreme_tax":
        # Supreme Tax uses a different schema (`tax_knowledge`) in production:
        # { topic_tag, section_ref, ay, content, embedding }
        payload = {
            "topic_tag": meta["topic_tag"],
            "section_ref": meta["section_ref"],
            "ay": "2025-26",
            "content": chunk,
            "embedding": embedding,
        }

    return payload


def table_exists(table: str) -> bool:
    try:
        supabase.table(table).select("*").limit(1).execute()
        return True
    except Exception:
        return False


def insert_with_schema_fallback(table: str, payload: dict) -> None:
    mutable = dict(payload)
    for _ in range(6):
        try:
            supabase.table(table).insert(mutable).execute()
            return
        except Exception as err:
            err_str = str(err)
            # PostgREST missing-column errors (PGRST204 / schema drift)
            missing = re.search(r"Could not find the '([^']+)' column", err_str)
            if missing:
                key = missing.group(1)
                if key in mutable:
                    mutable.pop(key, None)
                    continue
            raise
    raise RuntimeError(f"Insert failed after schema fallback attempts for table {table}")

def ingest_agent(agent_name: str, folder: str = None):
    config = AGENT_CONFIG.get(agent_name)
    if not config:
        print(f'Unknown agent: {agent_name}. Available: {list(AGENT_CONFIG.keys())}')
        sys.exit(1)

    docs_folder = Path(folder or config['folder'])
    table = config['table']
    if agent_name == "supreme_tax" and table == "tax_knowledge" and not table_exists("tax_knowledge"):
        # Supabase not provisioned with Supreme Tax schema yet.
        table = "oracle_static_kb"

    if not docs_folder.exists():
        print(f'Creating folder: {docs_folder}')
        docs_folder.mkdir(parents=True, exist_ok=True)
        print(f'Add PDF files to {docs_folder} and run again.')
        return

    pdf_files = list(docs_folder.glob('*.pdf'))
    txt_files = list(docs_folder.glob('*.txt'))
    all_files = pdf_files + txt_files
    if not all_files:
        print(f'No PDF or TXT files found in {docs_folder}')
        return

    print(f'Starting ingestion for {agent_name} — {len(pdf_files)} PDFs + {len(txt_files)} TXT files found')

    for file_path in all_files:
        print(f'Processing: {file_path.name}')
        try:
            if file_path.suffix.lower() == '.pdf':
                chunks = extract_text_from_pdf(str(file_path))
            else:
                chunks = extract_text_from_txt(str(file_path))
        except Exception as e:
            print(f'  Error reading {file_path.name}: {e}')
            continue
        print(f'  Extracted {len(chunks)} chunks')
        source_name = file_path.name if table != "oracle_static_kb" else (
            f"supreme_tax::{file_path.name}" if agent_name == "supreme_tax" else file_path.name
        )
        existing_hashes = get_existing_hashes(table, source_name)
        inserted_count = 0
        skipped_duplicates = 0

        for i, chunk in enumerate(chunks):
            try:
                chunk_hash = hashlib.sha256(chunk.encode("utf-8")).hexdigest()
                if chunk_hash in existing_hashes:
                    skipped_duplicates += 1
                    continue
                embedding = embed_text(chunk)
                try:
                    payload = build_payload(agent_name, source_name, chunk, embedding, config['default_category'])
                    insert_with_schema_fallback(table, payload)
                except Exception as insert_error:
                    err_str = str(insert_error)
                    if agent_name == 'supreme_tax':
                        # Always allow a robust fallback into oracle when tax_knowledge isn't available.
                        fallback_source = f"supreme_tax::{file_path.name}"
                        fallback_hashes = get_existing_hashes("oracle_static_kb", fallback_source)
                        if chunk_hash in fallback_hashes:
                            skipped_duplicates += 1
                            continue
                        payload = build_payload("the_oracle", fallback_source, chunk, embedding, "Taxation & Law")
                        payload["source"] = fallback_source
                        insert_with_schema_fallback("oracle_static_kb", payload)
                    else:
                        raise
                inserted_count += 1
                existing_hashes.add(chunk_hash)
                if (i + 1) % 10 == 0:
                    print(f'  Inserted {i + 1}/{len(chunks)} chunks')
            except Exception as e:
                print(f'  Error on chunk {i}: {e}')
                continue

        print(f'  Done: {file_path.name} | inserted={inserted_count} skipped_duplicates={skipped_duplicates}')

    print(f'Ingestion complete for {agent_name}')

def main():
    parser = argparse.ArgumentParser(description='maCA Empire Document Ingester')
    parser.add_argument('--agent', type=str, help='Agent name: dpdp_shield or cryptotax_pro')
    parser.add_argument('--folder', type=str, help='Override docs folder path')
    parser.add_argument('--all', action='store_true', help='Ingest all agents')
    args = parser.parse_args()

    if args.all:
        for agent_name in AGENT_CONFIG:
            ingest_agent(agent_name)
    elif args.agent:
        ingest_agent(args.agent, args.folder)
    else:
        print('Usage: python ingester.py --agent dpdp_shield')
        print('       python ingester.py --agent cryptotax_pro')
        print('       python ingester.py --all')

if __name__ == '__main__':
    main()
