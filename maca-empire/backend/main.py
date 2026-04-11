import os
import re
import json
import uuid
import datetime
import asyncio
import subprocess
from typing import Optional, List, Dict
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException, Request, WebSocket, WebSocketDisconnect
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from openai import AsyncOpenAI
from supabase import create_client, Client
from dotenv import load_dotenv
from apscheduler.schedulers.asyncio import AsyncIOScheduler

# Project Modules
from intent_classifier import classify_intent
from live_data import fetch_live_crypto_price, build_live_crypto_injection

load_dotenv()

app = FastAPI(title="maCA Empire AGI Orchestrator — Advanced Deployment")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API Clients ---
nim_client = AsyncOpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key=os.getenv("NVIDIA_API_KEY")
)

supabase: Client = create_client(
    os.getenv("NEXT_PUBLIC_SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

# --- SYSTEM PROMPTS ---
BIG_4_PARTNER_DNA = """
ROLE: Senior CA Partner (40y exp, Big 4 Firm). 
CLIENT TYPES: HNIs, Billionaires, Listed Corps.
CORE PRINCIPLES:
1. DIAGNOSE BEFORE PRESCRIBE: ASK clarifying questions if ambiguity exists.
2. PROACTIVE RISK FLAGGING: Flag 2-3 material risks non-requested risks.
3. SETTLED VS GREY LAW: Distinguish clearly between settled law and grey areas.
4. PLANNING MINDSET: Proactively suggest tax-saving structures.
5. REFERRAL TRIGGERS: Always refer to human CA for Search & Seizure or > Rs. 10Cr.
"""

DPDP_SYSTEM_PROMPT = """You are DPDP Shield — an expert AI compliance advisor for maCA Empire, specialising exclusively in India's Digital Personal Data Protection Act 2023 and DPDP Rules 2025 notified on 14 November 2025 by MeitY. Full compliance mandatory by 13 May 2027. Penalties reach Rs.250 crore per violation for Significant Data Fiduciaries. Every response must cite the specific Rule or Section number. Compliance timeline: Phase 1 immediate, Phase 2 by November 2026, Phase 3 full compliance by 13 May 2027. Disclaimer: Not legal advice."""

CRYPTOTAX_SYSTEM_PROMPT = """You are CryptoTax Pro — an expert AI tax advisor for maCA Empire, specialising exclusively in Virtual Digital Assets under the Income Tax Act 1961. Section 115BBH imposes 30% flat tax on ALL VDA gains — zero deductions except cost. Section 194S mandates 1% TDS. FIFO is the only method. VDA losses CANNOT be offset. FEMA: Auto-flag overseas exchanges (Binance, Bybit). When [LIVE_CRYPTO] data is injected, use it for calculations. Disclaimer: Consult CA for final ITR filing."""

AGENT_PROMPTS = {
    # A-Series: Core
    "A1": "Income Tax & GST. Flag ITC 2B risks.",
    "A21": "DPDP Compliance. Expert in consent & penalty protection.",
    "A22": "VDA Crypto Tax. Expert in Sec 115BBH & Schedule VDA."
}

# --- Request Models ---
class ChatRequest(BaseModel):
    query: str
    gstin: Optional[str] = None
    agent_id: Optional[str] = None
    language: Optional[str] = "English"

class AgentQueryRequest(BaseModel):
    user_message: str
    session_id: str = "default"
    user_context: dict = {}

# --- RAG Helpers ---
async def fetch_agent_rag(agent_id: str, query: str, match_count: int = 8) -> tuple[str, list]:
    try:
        # Check if we should use specialized tables
        if agent_id == "A21":
            fn_name, prefix = "match_dpdp_documents", "DPDP compliance query India"
        elif agent_id == "A22":
            fn_name, prefix = "match_cryptotax_documents", "India VDA crypto tax query Section 115BBH"
        else:
            # Fallback to generic if needed (existing logic)
            fn_name, prefix = "match_documents", "Legal query"

        embed_response = await nim_client.embeddings.create(
            input=[f"{prefix}: {query}"],
            model="nvidia/nv-embed-v1",
            encoding_format="float",
            extra_body={"input_type": "query", "truncate": "END"}
        )
        embedding = embed_response.data[0].embedding

        result = supabase.rpc(fn_name, {
            "query_embedding": embedding,
            "match_count": match_count
        }).execute()

        if not result.data: return "", []

        context = "\n\n".join([r['content'] for r in result.data])
        citations = [{"source": r.get("source", "Unknown"), "ref": r.get("rule_number") or r.get("section_number", "")} for r in result.data]
        return context, citations
    except Exception as e:
        print(f"RAG error: {e}")
        return "", []

# --- Standard Chat Routes (Refactored to Async) ---

@app.get("/health")
def health(): return {"status": "ok", "version": "AGI_Deployment_Day1"}

@app.post("/api/agents/dpdp-shield/query")
async def dpdp_shield_query(request: AgentQueryRequest):
    intent = classify_intent(request.user_message, 'A21')
    context, citations = await fetch_agent_rag('A21', request.user_message)

    async def generate():
        stream = await nim_client.chat.completions.create(
            model="meta/llama-3.3-70b-instruct",
            messages=[
                {"role": "system", "content": f"{DPDP_SYSTEM_PROMPT}\n\nRELEVANT CONTEXT:\n{context}"},
                {"role": "user", "content": f"{request.user_message}\n\nIntent: {intent.intent}"}
            ],
            stream=True
        )
        async for chunk in stream:
            if chunk.choices[0].delta.content:
                yield f"data: {json.dumps({'token': chunk.choices[0].delta.content})}\n\n"
        if citations: yield f"data: {json.dumps({'citations': citations})}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")

@app.post("/api/agents/cryptotax-pro/query")
async def cryptotax_pro_query(request: AgentQueryRequest):
    intent = classify_intent(request.user_message, 'A22')
    
    live_injection = ""
    if intent.requires_live_data and intent.extracted_symbol:
        live_data = await fetch_live_crypto_price(intent.extracted_symbol)
        live_injection = build_live_crypto_injection(live_data)

    fema_warning = f"\n[FEMA FLAG: User mentioned {intent.extracted_exchange}]" if intent.extracted_exchange else ""
    context, citations = await fetch_agent_rag('A22', request.user_message)

    async def generate():
        stream = await nim_client.chat.completions.create(
            model="meta/llama-3.3-70b-instruct",
            messages=[
                {"role": "system", "content": f"{CRYPTOTAX_SYSTEM_PROMPT}\n\n{live_injection}\n\nCONTEXT:\n{context}"},
                {"role": "user", "content": f"{request.user_message}{fema_warning}\n\nIntent: {intent.intent}"}
            ],
            stream=True
        )
        async for chunk in stream:
            if chunk.choices[0].delta.content:
                yield f"data: {json.dumps({'token': chunk.choices[0].delta.content})}\n\n"
        if citations: yield f"data: {json.dumps({'citations': citations})}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")

# --- WebSocket: Live Tax Meter ---
@app.websocket("/api/agents/cryptotax-pro/live-meter")
async def live_tax_meter(websocket: WebSocket):
    await websocket.accept()
    try:
        config = await websocket.receive_json()
        symbol = config.get("symbol", "BTC")
        cost = float(config.get("cost_basis_inr", 0))
        qty = float(config.get("quantity", 1))

        while True:
            live_data = await fetch_live_crypto_price(symbol)
            if "error" not in live_data:
                price = live_data["price_inr"]
                unrealised = round((price - cost) * qty, 2)
                tax = round(max(0, unrealised * 0.30), 2)
                await websocket.send_json({
                    "price_inr": price,
                    "unrealised_gain": unrealised,
                    "tax_liability": tax,
                    "timestamp": live_data["timestamp_ist"]
                })
            await asyncio.sleep(30)
    except WebSocketDisconnect: pass
    except Exception as e:
        await websocket.send_json({"error": str(e)})
        await websocket.close()

# --- Nightly Scheduler ---
scheduler = AsyncIOScheduler(timezone="Asia/Kolkata")

@scheduler.scheduled_job('cron', hour=23, minute=30)
async def daily_refresh():
    print("Nightly RAG refresh running...")
    subprocess.run(['python', 'backend/ingester.py', '--all'], check=False)

scheduler.start()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
