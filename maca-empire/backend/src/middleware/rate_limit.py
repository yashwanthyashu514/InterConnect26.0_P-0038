from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
import time

class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)
        # In-memory mock for Redis in MVP
        self.counters = {}

    async def dispatch(self, request: Request, call_next):
        # Only rate limit RAG endpoints
        if request.url.path.startswith("/api/rag"):
            # Use user_id from headers (simulated)
            user_id = request.headers.get("x-user-id", "anonymous")
            limit = 30 if "query" in request.url.path else 10
            
            key = f"{user_id}:{request.url.path}:{int(time.time() // 3600)}"
            count = self.counters.get(key, 0)
            
            if count >= limit:
                raise HTTPException(status_code=429, detail="Rate limit exceeded", headers={"Retry-After": "3600"})
            
            self.counters[key] = count + 1
            
        return await call_next(request)
