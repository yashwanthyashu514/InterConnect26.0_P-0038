from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
import json
import asyncio
from src.rag.pipeline import RAGPipeline
from src.rag.embedder import NIMEmbedder

router = APIRouter()

@router.post("/api/rag/query")
async def rag_query(request: Request):
    data = await request.json()
    query = data.get("query")
    booking_id = data.get("booking_id")
    
    # Dependencies (typically through DI)
    # mock clients for demo
    from main import nim_client, supabase
    embedder = NIMEmbedder(nim_client, supabase)
    pipeline = RAGPipeline(embedder)
    
    result = await pipeline.execute(query, booking_id)
    
    # If guard fired, return immediate JSON
    if result.get("hallucination_guard_fired"):
        return result

    # F4: ndjson Streaming
    async def generate():
        # Meta info first (TTFT < 800ms)
        yield json.dumps({"type": "meta", "latency_ms": result["latency_ms"], "chunks": result["chunks"]}) + "\n"
        
        # Simulate Claude-Sonnet-4 streaming tokens
        answer = f"According to the ITR notice [Chunk 1], {query} is..."
        for word in answer.split():
            yield json.dumps({"type": "token", "text": word + " "}) + "\n"
            await asyncio.sleep(0.05)
            
    return StreamingResponse(generate(), media_type="application/x-ndjson")
