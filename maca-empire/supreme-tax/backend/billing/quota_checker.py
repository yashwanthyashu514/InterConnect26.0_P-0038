from fastapi import HTTPException
from db.supabase_client import supabase

PLAN_LIMITS = {
    "free": 20,
    "pro": 500,
    "enterprise": -1  # unlimited
}

PLAN_AGENT_ACCESS = {
    "free": ["A0", "A1", "A6"],
    "pro": ["A0","A1","A2","A3","A4","A5","A6","A7","A8","A12","A13","A21","A22","A23","A24","A25","A26","A28"],
    "enterprise": None  # all agents
}

async def check_and_decrement_quota(user_id: str):
    result = supabase.table("user_profiles").select(
        "queries_used, queries_limit, plan"
    ).eq("id", user_id).single().execute()
    profile = result.data

    if profile["plan"] == "enterprise":
        return  # unlimited

    if profile["queries_used"] >= profile["queries_limit"]:
        raise HTTPException(
            status_code=429,
            detail="Query limit reached. Upgrade your plan at supremetax.in/billing"
        )

    supabase.table("user_profiles").update({
        "queries_used": profile["queries_used"] + 1
    }).eq("id", user_id).execute()


def check_agent_access(user_plan: str, agent_id: str) -> bool:
    allowed = PLAN_AGENT_ACCESS.get(user_plan)
    if allowed is None:  # enterprise — all agents
        return True
    return agent_id in allowed
