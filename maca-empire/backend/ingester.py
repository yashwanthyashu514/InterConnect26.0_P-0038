import os
import sys
import argparse
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

AGENT_CONFIG = {
    'dpdp_shield': {
        'folder': 'backend/docs/dpdp_shield/',
        'table': 'dpdp_shield_documents',
        'default_category': 'DPDP Compliance'
    },
    'cryptotax_pro': {
        'folder': 'backend/docs/cryptotax_pro/',
        'table': 'cryptotax_documents',
        'default_category': 'VDA Tax'
    },
    'esg_compass': {
        'folder': 'backend/docs/esg_compass/',
        'table': 'esg_compass_documents',
        'default_category': 'ESG Compliance'
    },
    'heirguard': {
        'folder': 'backend/docs/heirguard/',
        'table': 'heirguard_documents',
        'default_category': 'Succession Law'
    },
    'ai_governance_counsel': {
        'folder': 'backend/docs/ai_governance_counsel/',
        'table': 'ai_governance_documents',
        'default_category': 'AI Governance'
    },
    'the_oracle': {
        'folder': 'backend/docs/the_oracle/',
        'table': 'oracle_static_kb',
        'default_category': 'Financial Intelligence'
    }
}

def extract_text_from_pdf(pdf_path: str) -> list[str]:
    chunks = []
    with pdfplumber.open(pdf_path) as pdf:
        full_text = ''
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                full_text += text + ' '
        words = full_text.split()
        chunk_size = 400
        overlap = 50
        for i in range(0, len(words), chunk_size - overlap):
            chunk = ' '.join(words[i:i + chunk_size])
            if len(chunk.strip()) > 100:
                chunks.append(chunk.strip())
    return chunks

def extract_text_from_txt(txt_path: str) -> list[str]:
    chunks = []
    with open(txt_path, 'r', encoding='utf-8') as f:
        full_text = f.read()
    words = full_text.split()
    chunk_size = 400
    overlap = 50
    for i in range(0, len(words), chunk_size - overlap):
        chunk = ' '.join(words[i:i + chunk_size])
        if len(chunk.strip()) > 100:
            chunks.append(chunk.strip())
    return chunks

def embed_text(text: str) -> list[float]:
    response = nim_client.embeddings.create(
        input=[text],
        model='nvidia/nv-embed-v1',
        encoding_format='float',
        extra_body={'input_type': 'passage', 'truncate': 'END'}
    )
    return response.data[0].embedding

def ingest_agent(agent_name: str, folder: str = None):
    config = AGENT_CONFIG.get(agent_name)
    if not config:
        print(f'Unknown agent: {agent_name}. Available: {list(AGENT_CONFIG.keys())}')
        sys.exit(1)

    docs_folder = Path(folder or config['folder'])
    table = config['table']

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

        for i, chunk in enumerate(chunks):
            try:
                embedding = embed_text(chunk)
                supabase.table(table).insert({
                    'content': chunk,
                    'embedding': embedding,
                    'source': file_path.name,
                    'category': config['default_category']
                }).execute()
                if (i + 1) % 10 == 0:
                    print(f'  Inserted {i + 1}/{len(chunks)} chunks')
            except Exception as e:
                print(f'  Error on chunk {i}: {e}')
                continue

        print(f'  Done: {file_path.name}')

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
