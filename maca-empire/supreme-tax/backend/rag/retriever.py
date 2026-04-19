import os
from openai import AsyncOpenAI
from db.supabase_client import supabase

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def get_embedding(text: str) -> list:
    try:
        response = await client.embeddings.create(
            model="text-embedding-3-small",
            input=text
        )
        return response.data[0].embedding
    except Exception as e:
        print(f"[EMBEDDING_CRITICAL_FAIL] {e}")
        return []

async def retrieve_chunks(query: str, agent_id: str, top_k: int = 4) -> list:
    if not query: return []
    try:
        query_embedding = await get_embedding(query)
        if not query_embedding: return []
        
        result = supabase.rpc("match_chunks", {
            "query_embedding": query_embedding,
            "target_agent_id": agent_id,
            "match_threshold": 0.5, # Relaxed for production coverage
            "match_count": top_k
        }).execute()
        
        return result.data if result and hasattr(result, 'data') else []
    except Exception as e:
        print(f"[RAG_RETRIEVER_FAIL] {e}")
        return []

