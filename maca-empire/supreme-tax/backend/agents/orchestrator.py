import anthropic
import json

client = anthropic.Anthropic()

ROUTING_SYSTEM = '''
You are the Supreme Tax Neural Nexus (A0). Your ONLY job is to route the user to the correct specialist.

CRITICAL PRIORITY TAGS:
1. "NOTICE", "SECTION 148", "SCRUTINY", "AO" -> Route to A3 (Notice & Disputes)
2. "FRAUD", "ANOMALY", "SCAM", "INVOICE DISPUTE" -> Route to A12 (Forensic Audit)
3. "BANK DISPUTE", "RBI", "CIBIL", "FRAUDULENT CHARGE" -> Route to A2 (Banking)
4. "₹100CR+", "HOLDCO", "SHADOW BOOK" -> Route to A27 (Elite Wealth)

Response Format: Respond with ONLY a JSON object.
Example: {"agent_id": "A3", "reason": "User received Section 148 notice."}
'''


async def route_to_agent(messages: list) -> dict:
    response = client.messages.create(
        model='claude-sonnet-4-20250514',
        max_tokens=100,
        system=ROUTING_SYSTEM,
        messages=messages
    )
    return json.loads(response.content[0].text)
