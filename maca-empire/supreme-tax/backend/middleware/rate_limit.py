import time
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
from collections import defaultdict

# Simple In-Memory Rate Limiter (Production should use Redis)
rate_limit_store = defaultdict(list)
RATE_LIMIT_CALLS = 10
RATE_LIMIT_WINDOW_SECONDS = 60

class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.url.path not in ["/api/chat", "/api/generate-pdf"]:
            return await call_next(request)
            
        client_ip = request.client.host
        current_time = time.time()
        
        # Clean up old timestamps
        rate_limit_store[client_ip] = [t for t in rate_limit_store[client_ip] if current_time - t < RATE_LIMIT_WINDOW_SECONDS]
        
        if len(rate_limit_store[client_ip]) >= RATE_LIMIT_CALLS:
            return JSONResponse(
                status_code=429,
                content={"error": "Too Many Requests", "message": "Neural cooling in progress. Please wait 60 seconds."}
            )
            
        rate_limit_store[client_ip].append(current_time)
        return await call_next(request)
