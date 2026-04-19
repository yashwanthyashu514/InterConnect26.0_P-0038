import jwt
import os
from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

JWT_SECRET = os.getenv("JWT_SECRET", "maca-empire-secure-default")

class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Whitelist public routes
        if request.url.path in ["/api/auth/login", "/api/auth/register", "/"]:
            return await call_next(request)
            
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return JSONResponse({"error": "Unauthorized", "message": "Missing token"}, status_code=401)
            
        try:
            token = auth_header.split(" ")[1]
            payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            request.state.user = payload
        except Exception as e:
            return JSONResponse({"error": "Unauthorized", "message": "Invalid token"}, status_code=401)
            
        return await call_next(request)

async def get_current_user(request: Request):
    if not hasattr(request.state, "user"):
        raise HTTPException(status_code=401, detail="User not authenticated")
    return request.state.user

