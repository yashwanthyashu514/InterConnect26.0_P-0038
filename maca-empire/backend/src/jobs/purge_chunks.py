import os
from supabase import create_client

def purge_expired_chunks():
    supabase = create_client(os.getenv("NEXT_PUBLIC_SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
    
    # 1. Soft-delete chunks for completed bookings
    # This logic would typically check the bookings table
    
    # 2. Hard-delete chunks that were soft-deleted > 90 days ago
    res = supabase.table("document_chunks").delete().lt(
        "deleted_at", "now() - interval '90 days'"
    ).execute()
    
    print(f"Purged {len(res.data) if res.data else 0} expired chunks.")

if __name__ == "__main__":
    purge_expired_chunks()
