import time
from typing import List, Dict
from src.rag.rewriter import QueryRewriter
from src.rag.reranker import Reranker
from src.rag.embedder import NIMEmbedder

class RAGPipeline:
    def __init__(self, embedder: NIMEmbedder):
        self.rewriter = QueryRewriter()
        self.reranker = Reranker(threshold=0.65)
        self.embedder = embedder

    async def execute(self, query: str, booking_id: str):
        start_time = time.time()
        
        # 1. Expand (F2.1)
        expanded_query = self.rewriter.expand(query)
        
        # 2. Embed (F6 NIM Fallback)
        embedding, is_fallback = await self.embedder.get_embedding(expanded_query, booking_id)
        
        if is_fallback:
            chunks = await self.embedder.keyword_fallback(expanded_query, booking_id)
        else:
            # Vector Search
            res = self.embedder.supabase.rpc("match_documents", {
                "query_embedding": embedding,
                "match_count": 10,
                "filter": {"source_booking_id": booking_id}
            }).execute()
            chunks = res.data if res.data else []

        # 3. Hallucination Guard (F5)
        top_similarity = chunks[0].get('similarity', 0) if chunks else 0
        if not chunks or top_similarity < 0.40:
             return {
                 "answer": "Insufficient document data to answer this query.", 
                 "hallucination_guard_fired": True, 
                 "latency_ms": int((time.time() - start_time) * 1000)
             }

        # 4. Rerank (F2.2)
        final_chunks = self.reranker.rerank(chunks)
        
        return {
            "query": expanded_query,
            "chunks": final_chunks,
            "latency_ms": int((time.time() - start_time) * 1000)
        }
