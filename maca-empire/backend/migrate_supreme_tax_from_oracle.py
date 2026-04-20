import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

supabase = create_client(
    os.environ["NEXT_PUBLIC_SUPABASE_URL"],
    os.environ["SUPABASE_KEY"],
)


def main() -> None:
    # Ensure target exists
    supabase.table("tax_knowledge").select("id").limit(1).execute()

    start = 0
    step = 1000
    moved = 0

    while True:
        batch = (
            supabase.table("oracle_static_kb")
            .select("source,content,embedding")
            .like("source", "supreme_tax::%")
            .range(start, start + step - 1)
            .execute()
            .data
            or []
        )
        if not batch:
            break

        rows = []
        for r in batch:
            rows.append(
                {
                    "topic_tag": "Income Tax",
                    "section_ref": "",
                    "ay": "2025-26",
                    "content": r.get("content"),
                    "embedding": r.get("embedding"),
                }
            )

        if rows:
            supabase.table("tax_knowledge").insert(rows).execute()
            moved += len(rows)

        if len(batch) < step:
            break
        start += step

    print(f"Moved {moved} rows into tax_knowledge")


if __name__ == "__main__":
    main()

