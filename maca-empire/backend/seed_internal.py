import os
from dotenv import load_dotenv
from supabase import create_client, Client
from datetime import date, timedelta

load_dotenv()

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def seed_internal():
    print("Seeding Imperio Neural Internal Tables...")

    # 1. Clients
    clients = [
        {"name": "Adani Family Office", "retainer_tier": "sovereign_titan", "retainer_amount_inr": 15000000, "payment_status": "current", "net_worth_cr": 800000},
        {"name": "Ambani Heritage Trust", "retainer_tier": "sovereign_titan", "retainer_amount_inr": 20000000, "payment_status": "current", "net_worth_cr": 950000},
        {"name": "Jindal Steel Promoters", "retainer_tier": "elite_empire", "retainer_amount_inr": 7500000, "payment_status": "overdue", "net_worth_cr": 45000},
        {"name": "Zomato Founder (Private)", "retainer_tier": "family_trust", "retainer_amount_inr": 2500000, "payment_status": "current", "net_worth_cr": 5000},
    ]
    supabase.table("clients").upsert(clients, on_conflict="name").execute()
    print("Clients seeded.")

    # 2. Sales Pipeline
    pipeline = [
        {"prospect_name": "Byju Raveendran (Restructuring)", "estimated_net_worth_cr": 2000, "stage": "negotiating", "recommended_tier": "elite_empire", "estimated_retainer_inr": 7500000},
        {"prospect_name": "Zerodha Founders (Family Office)", "estimated_net_worth_cr": 30000, "stage": "qualified", "recommended_tier": "sovereign_titan", "estimated_retainer_inr": 15000000},
        {"prospect_name": "Mamaearth Promoters", "estimated_net_worth_cr": 1500, "stage": "referred"},
    ]
    supabase.table("sales_pipeline").upsert(pipeline, on_conflict="prospect_name").execute()
    print("Sales pipeline seeded.")

    # 3. Marketing Calendar
    marketing = [
        {"content_type": "article", "title": "The 2026 Succession Crisis: Why Family Trusts are Failing", "status": "published", "planned_date": str(date.today() - timedelta(days=5))},
        {"content_type": "linkedin_post", "title": "Crypto Tax Section 115BBH: The 1% TDS Trap", "status": "planned", "planned_date": str(date.today() + timedelta(days=2))},
    ]
    supabase.table("marketing_calendar").upsert(marketing, on_conflict="title").execute()
    print("Marketing calendar seeded.")

    # 4. Vendors
    vendors = [
        {"name": "Khaitan & Co (Legal Review)", "service_type": "legal_review", "monthly_cost_inr": 500000, "status": "active", "contract_end": str(date.today() + timedelta(days=90))},
        {"name": "AWS (Infrastructure)", "service_type": "other", "monthly_cost_inr": 120000, "status": "active"},
    ]
    supabase.table("vendors").upsert(vendors, on_conflict="name").execute()
    print("Vendors seeded.")

    print("Internal Team Data Seeded Successfully!")

if __name__ == "__main__":
    seed_internal()
