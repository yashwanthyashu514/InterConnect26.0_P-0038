import asyncio
import httpx
import pytest

@pytest.mark.asyncio
async def test_concurrent_privacy():
    url = "http://localhost:8000/api/rag/query"
    test_bookings = [
        {"id": f"b{i}", "query": f"Privacy query {i}"} for i in range(1, 6)
    ]

    async def run_query(b):
        async with httpx.AsyncClient() as client:
            resp = await client.post(url, json={"query": b["query"], "booking_id": b["id"]})
            data = resp.json()
            # Assert only chunks from this booking are returned
            for chunk in data.get("chunks", []):
                assert chunk["booking_id"] == b["id"], f"DATA LEAK: Found {chunk['booking_id']} in {b['id']}"
            return {"booking_id": b["id"], "isolation_confirmed": True}

    results = await asyncio.gather(*[run_query(b) for b in test_bookings])
    print(results)
    assert len(results) == 5
