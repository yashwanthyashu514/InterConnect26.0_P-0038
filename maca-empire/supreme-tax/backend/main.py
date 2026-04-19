from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes_chat import router as chat_router
from api.routes_auth import router as auth_router
from api.routes_pdf import router as pdf_router
from api.routes_voice import router as voice_router
from middleware.auth_middleware import AuthMiddleware
from middleware.rate_limit import RateLimitMiddleware
from middleware.logger import setup_logging

app = FastAPI(title='Supreme Tax API', version='1.0')
setup_logging()

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"error": "Sovereign Core Error", "message": "An unexpected error occurred in the neural pool."}
    )

app.add_middleware(CORSMiddleware,
    allow_origins=['https://yourdomain.com', 'http://localhost:5173', 'http://localhost:3000'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'])

app.add_middleware(AuthMiddleware)
app.add_middleware(RateLimitMiddleware)
app.include_router(chat_router, prefix='/api')
app.include_router(auth_router, prefix='/api/auth')
app.include_router(pdf_router, prefix='/api')
app.include_router(voice_router, prefix='/api')
