from fastapi import UploadFile, File, APIRouter, Depends
import openai
import os
from middleware.auth_middleware import get_current_user

router = APIRouter()
oai_client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@router.post("/transcribe")
async def transcribe(file: UploadFile = File(...), user=Depends(get_current_user)):
    audio_bytes = await file.read()
    transcript = oai_client.audio.transcriptions.create(
        model="whisper-1",
        file=(file.filename, audio_bytes, file.content_type),
        language="hi"  # Hindi + English mixed input
    )
    return {"text": transcript.text}
