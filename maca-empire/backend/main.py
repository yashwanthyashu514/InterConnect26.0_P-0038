import os
import re
import json
import uuid
import datetime
from typing import Optional, List, Dict
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="maCA Empire AGI Orchestrator v3")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Clients
nim_client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key=os.getenv("NVIDIA_API_KEY")
)

supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

# --- BIG 4 PARTNER PERSONA (CONSOLIDATED LOGIC) ---
BIG_4_PARTNER_DNA = """
ROLE: Senior CA Partner (40y exp, Big 4 Firm). 
CLIENT TYPES: HNIs, Billionaires, Listed Corps.

CORE PRINCIPLES:
1. DIAGNOSE BEFORE PRESCRIBE: If a query is ambiguous, ASK clarifying questions before giving advice.
2. PROACTIVE RISK FLAGGING: Always flag 2-3 material risks the user did NOT ask about (e.g., e-invoicing thresholds, GSTR-2B mismatches, FEMA limits).
3. SETTLED VS GREY LAW: Distinguish clearly between settled law, common practice, and grey areas with conflicting AAR/HC rulings.
4. PLANNING MINDSET: Suggest tax-saving structures (Sec 54/54F/54EC) proactively.
5. TONE CALIBRATION:
   - Layman: Simple English/Hindi, Rs. examples, zero jargon. 
   - Professional: Cite specific Sections, Circulars, and Supreme Court judgments.
   - HNI/Billionaire: Switch to Strategic M&A/FEMA/Trust mode.
6. REFERRAL TRIGGERS: Always refer to a human CA/Advocate for:
   - Search & Seizure (Sec 132)
   - Criminal Prosecution
   - Transactions > Rs. 10 Crores
   - Formal Sign-offs (Form 15CA/CB)

HALLUCINATION PREVENTION: Never guess a Section number. If uncertain, say 'I believe this is under Section X - verify on CBIC/IncomeTax.gov.in'.
"""

AGENT_PROMPTS = {
    # A-Series: Core
    "A1": "Specialization: Income Tax & GST. Proactively flag ITC 2B risks and e-invoice mandates.",
    "A2": "Specialization: Banking Law & RB-IOS 2026. Prioritize nodal officer escalations.",
    "A3": "Specialization: Company Law & ROC. Cite exact penalty clauses for MGT-7/AOC-4 delays.",
    "A4": "Specialization: Payroll & TDS. Prioritize Section 192/194 compliance and PF/ESI interest.",
    "A5": "Specialization: Voice CA. Simplified Partner logic for 2-3 sentence speech output.",
    "A6": "Specialization: Notice Defense. Deep analysis of Sec 148/142 notices. Draft cited replies.",
    "A7": "Specialization: Audit Risk. Scrutinize GSTIN patterns for potential red flags.",
    "A8": "Specialization: Court Petitions. Formulating Consumer Court (CPA 2019) cases.",
    
    # B-Series: Growth
    "B1": "Specialization: Startups & FEMA. Focus on ESOP tax and DPIIT benefits.",
    "B2": "Specialization: RERA. Calculate Section 18 compensation at SBI+2%.",
    "B3": "Specialization: Labour Law. Industrial Disputes & EPF grievance handling.",
    "B4": "Specialization: Insurance. IRDAI claim reversal logic.",
    "B5": "Specialization: Credit Fix. CIC Act 2005 dispute drafting.",
    "B6": "Specialization: Trade & Customs. HS Code tariff and RoDTEP rebate mapping.",
    "B7": "Specialization: RTI. Automated Section 6 drafting.",
    "B8": "Specialization: Pension. Gratuity Act and EPS-95 calculations.",
    
    # C-Series: Elite
    "C1": "Specialization: Succession & Wills. Indian Succession Act 1925 compliance.",
    "C2": "Specialization: Contracts. Identify Killer Clauses in NDAs/Leases.",
    "C3": "Specialization: IP Sentinel. Trademark/Patent infringement assessment.",
    "C4": "Specialization: Consumer King. Zomato/Amazon/Flipkart dispute drafting.",
    "C5": "Specialization: MSME Recovery. MSME Samadhaan Section 18 procedure.",
    "C6": "Specialization: Global Tax. DTAA, Transfer Pricing, and Foreign Remittance."
}

# --- Request/Response Schemas ---
class ChatRequest(BaseModel):
    query: str
    gstin: Optional[str] = None
    agent_id: Optional[str] = None
    language: Optional[str] = "English"

class VaultDoc(BaseModel):
    user_id: str
    agent_id: str
    doc_type: str
    content: str

vault_db = []

def route_agent(query: str) -> str:
    # LLM Routing for accuracy between 22 agents
    try:
        resp = nim_client.chat.completions.create(
            model="meta/llama-3.3-70b-instruct",
            messages=[
                {"role": "system", "content": "Reply with ONLY one of: A1-A8, B1-B8, C1-C6. Choose the best specialist for the query."},
                {"role": "user", "content": query[:200]}
            ],
            temperature=0.0,
            max_tokens=6
        )
        agent = resp.choices[0].message.content.strip().upper()
        match = re.search(r"[ABC][1-8]", agent)
        return match.group() if match else "A1"
    except:
        return "A1"

def fetch_rag_context(query: str):
    try:
        query_embedding = nim_client.embeddings.create(
            input=[query],
            model="nvidia/nv-embed-v1",
            encoding_format="float"
        ).data[0].embedding

        res = supabase.rpc("match_documents", {
            "query_embedding": query_embedding,
            "match_threshold": 0.5,
            "match_count": 3
        }).execute()
        
        context = "\n\n".join([r['content'] for r in res.data])
        sources = [r['metadata'].get('source', 'Unknown') for r in res.data]
        return context, sources
    except:
        return "", []

@app.get("/health")
def health(): return {"status": "ok", "version": "Partner_AGI_v3"}

@app.post("/ask")
async def ask_agent(request: ChatRequest):
    query = request.query.strip()
    if not query: raise HTTPException(status_code=400, detail="Query empty")

    # 1. Route
    agent_id = request.agent_id or route_agent(query)
    persona = AGENT_PROMPTS.get(agent_id, AGENT_PROMPTS["A1"])

    # 2. Context
    context, sources = fetch_rag_context(query)

    # 3. Assemble Big 4 Partner Prompt
    system_prompt = f"{BIG_4_PARTNER_DNA}\n\nSPECIALIST PERSONA: {persona}\n\nRELEVANT LAW CONTEXT:\n{context}\n\nSTRICT INSTRUCTION: Respond in {request.language}."

    try:
        resp = nim_client.chat.completions.create(
            model="meta/llama-3.3-70b-instruct",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": query}
            ],
            temperature=0.2, # Slight creativity for 'Strategic Planning'
            max_tokens=600
        )
        return {
            "agent": agent_id,
            "answer": resp.choices[0].message.content,
            "citations": sources
        }
    except Exception as e:
        return {"error": str(e)}

@app.post("/vault/save")
async def save_vault(doc: VaultDoc):
    entry = {
        "doc_id": str(uuid.uuid4()),
        "user_id": doc.user_id,
        "agent_id": doc.agent_id,
        "doc_type": doc.doc_type,
        "content": doc.content,
        "created_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    vault_db.insert(0, entry)
    return {"status": "success", "doc_id": entry["doc_id"]}

@app.get("/vault/user/{user_id}")
async def get_vault(user_id: str):
    return {"documents": [d for d in vault_db if d["user_id"] == user_id]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
