from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import anthropic
from agents.agent_registry import get_system_prompt
from agents.orchestrator import route_to_agent
from agents.handoff import build_handoff_context, get_last_agent
from rag.query_rewriter import rewrite_query
from rag.retriever import retrieve_chunks
from rag.injector import inject_chunks
from db.supabase_client import supabase
from middleware.auth_middleware import get_current_user
from billing.quota_checker import check_and_decrement_quota
from middleware.logger import log_usage

router = APIRouter()
client = anthropic.Anthropic()

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    agent_id: str
    messages: List[Message]
    conversation_id: Optional[str] = None

@router.post('/chat')
async def chat(req: ChatRequest, user=Depends(get_current_user)):
    await check_and_decrement_quota(user['id'])
    
    # A0 auto-routing
    if req.agent_id == 'A0':
        routing = await route_to_agent([m.dict() for m in req.messages])
        actual_agent = routing['agent_id']
    else:
        actual_agent = req.agent_id
        
    # Handoff context if agent switched
    prev_agent = await get_last_agent(req.conversation_id) if req.conversation_id else None
    if prev_agent and prev_agent != actual_agent:
        handoff_ctx = build_handoff_context([m.dict() for m in req.messages], prev_agent, actual_agent)
        base_prompt = handoff_ctx + get_system_prompt(actual_agent)
    else:
        base_prompt = get_system_prompt(actual_agent)
        
    # RAG
    last_user = next((m.content for m in reversed(req.messages) if m.role == 'user'), '')
    rewritten = await rewrite_query(last_user, [m.dict() for m in req.messages])
    chunks = await retrieve_chunks(rewritten, actual_agent)
    final_system = inject_chunks(base_prompt, chunks)
    
    # Claude call
    response = client.messages.create(
        model='claude-sonnet-4-20250514',
        max_tokens=1500,
        system=final_system,
        messages=[{'role': m.role, 'content': m.content} for m in req.messages]
    )
    reply = response.content[0].text
    
    # Persist
    if req.conversation_id:
        supabase.table('messages').insert([
            {'conversation_id': req.conversation_id, 'role': 'user', 'content': last_user, 'agent_id': actual_agent},
            {'conversation_id': req.conversation_id, 'role': 'assistant', 'content': reply, 'agent_id': actual_agent}
        ]).execute()
        
    log_usage(user['id'], actual_agent, response)
    return {'reply': reply, 'agent_id': actual_agent}
