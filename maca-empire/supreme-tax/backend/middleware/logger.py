import logging
from db.supabase_client import supabase

def setup_logging():
    logging.basicConfig(level=logging.INFO)

def log_usage(user_id, agent_id, response):
    inp = response.usage.input_tokens
    out = response.usage.output_tokens
    cost_usd = (inp * 3 + out * 15) / 1_000_000  # claude-sonnet-4-20250514 pricing
    cost_inr = cost_usd * 84
    try:
        supabase.table('usage_logs').insert({
            'user_id': user_id,
            'agent_id': agent_id,
            'input_tokens': inp,
            'output_tokens': out,
            'cost_inr': cost_inr
        }).execute()
    except Exception as e:
        logging.error(f"Usage logging failed: {e}")
