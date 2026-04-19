import os
import asyncio
from openai import AsyncOpenAI

class NIMEmbedder:
    def __init__(self, nim_client: AsyncOpenAI, supabase_client):
        self.client = nim_client
        self.supabase = supabase_client

    async def get_embedding(self, query: str, booking_id: str = None) -> tuple[Optional[list], bool]:
        try:
            # Try NIM with timeout
            response = await asyncio.wait_for(
                self.client.embeddings.create(
                    input=[query],
                    model="nvidia/nv-embed-v1",
                    extra_body={"input_type": "query", "truncate": "END"}
                ),
                timeout=3.0
            )
            return response.data[0].embedding, False
        except Exception as e:
            # Fallback to Supabase Full-Text Search
            print(f"NIM Fallback Triggered: {e}")
            self.log_error("nim_fallback", str(e))
            return None, True

    def log_error(self, event: str, reason: str):
        try:
            self.supabase.table("rag_errors").insert({
                "event": event,
                "reason": reason,
                "timestamp": dt_mod.now().isoformat()
            }).execute()
        except: pass

    async def keyword_fallback(self, query: str, booking_id: str):
        # F6 Fallback query
        res = self.supabase.table("document_chunks").select("*").text_search(
            "content", query.replace(" ", " | ")
        ).eq("booking_id", booking_id).limit(5).execute()
        
        return [{"content": r["content"], "similarity": 0.51} for r in res.data] if res.data else []
