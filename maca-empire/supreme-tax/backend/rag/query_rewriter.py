import anthropic
import os

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

REWRITE_SYSTEM = """You are a search query optimizer for Supreme Tax's knowledge base. Given a conversation history and the latest user message, output ONE clean search query of maximum 12 words that will best retrieve relevant tax/legal/financial knowledge from a vector database. Output ONLY the query string. No explanation. No punctuation at end."""

async def rewrite_query(latest_message: str, messages: list) -> str:
    # Build a short history summary (last 6 messages max)
    history_text = "\n".join([
        f"{m['role']}: {m['content'][:200]}"
        for m in messages[-6:]
        if isinstance(m, dict)
    ])

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=50,
        system=REWRITE_SYSTEM,
        messages=[{
            "role": "user",
            "content": f"Conversation:\n{history_text}\n\nLatest message: {latest_message}"
        }]
    )
    return response.content[0].text.strip()
