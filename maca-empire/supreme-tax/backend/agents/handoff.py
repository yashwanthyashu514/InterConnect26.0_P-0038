import anthropic

client = anthropic.Anthropic()

async def get_last_agent(conversation_id: str) -> str:
    from db.supabase_client import supabase
    res = supabase.table('messages').select('agent_id').eq('conversation_id', conversation_id).not_.is_('agent_id', 'null').order('created_at', desc=True).limit(1).execute()
    return res.data[0]['agent_id'] if res.data else None

def build_handoff_context(messages: list, from_agent: str, to_agent: str) -> str:
    facts = extract_key_facts(messages)
    return f'''
[SYSTEM HANDOFF — TOPIC SHIFT DETECTED]
You ({to_agent}) are taking over from {from_agent}.
THE USER HAS RAISED A NEW CRISIS. IGNORE PREV CALCULATIONS.

Key Facts for your reference:
{facts}

INSTRUCTION: Address the latest message IMMEDIATELY. Do not provide generic reports. 
If it's a Notice, draft a reply. If it's Fraud, provide forensic steps.
[END HANDOFF]
'''


def extract_key_facts(messages: list) -> str:
    response = client.messages.create(
        model='claude-sonnet-4-20250514',
        max_tokens=200,
        system="Extract key facts from this conversation as a concise bullet list. Include: income/revenue figures, entity names, deductions mentioned, deadlines, tax regime preference, concerns raised, decisions made. Maximum 8 bullets. Be specific with numbers.",
        messages=[{'role': m['role'], 'content': m['content']} for m in messages if isinstance(m, dict)]
    )
    return response.content[0].text
