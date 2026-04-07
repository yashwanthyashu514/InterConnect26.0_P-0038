import os
import time
from dotenv import load_dotenv
from openai import OpenAI
from supabase import create_client, Client

load_dotenv()

# Initialize NVIDIA NIM and Supabase
NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY")
nim_client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key=NVIDIA_API_KEY
)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# High-Value Precedents for the AI Judge
LANDMARK_CASES = [
    {
        "content": "Section 148 of Income Tax Act. Reassessment notice issued after 4 years without pointing out failure on part of assessee to disclose material facts is invalid. The Supreme Court held that mere change of opinion by the Assessing Officer does not confer jurisdiction to reopen an assessment.",
        "metadata": {"case_name": "CIT vs. Kelvinator of India Ltd.", "year": 2010, "outcome": "Appeal Allowed for Assessee", "area": "Income Tax"}
    },
    {
        "content": "Under Section 74 of the CGST Act, regarding input tax credit (ITC) mismatch. The High Court stated that recovery of ITC from the buyer cannot be done without first exhausting remedies against the defaulting seller who failed to deposit the collected tax, unless there is proof of collusion.",
        "metadata": {"case_name": "D.Y. Beathel Enterprises vs. State Tax Officer", "year": 2021, "outcome": "Notice Quashed", "area": "GST"}
    },
    {
        "content": "Section 28 of the Customs Act. Demand of customs duty alleging misdeclaration of value. The Tribunal observed that transaction value cannot be rejected solely based on NIDB data unless there is contemporaneous import of identical goods at higher prices.",
        "metadata": {"case_name": "Eicher Tractors vs. Commissioner of Customs", "year": 2000, "outcome": "Favorable to Importer", "area": "Customs"}
    },
    {
        "content": "In GST registration cancellation under Section 29, the Department cancelled registration retrospectively without giving proper reasons in the Show Cause Notice. The Court held that retrospective cancellation cannot be done mechanically and must establish intent to defraud.",
        "metadata": {"case_name": "Aggarwal Dyeing vs. State of Gujarat", "year": 2022, "outcome": "Cancellation Overturned", "area": "GST"}
    },
    {
        "content": "FEMA violation regarding cross-border remittances. The Enforcement Directorate issued notices for penalty. The Appellate Tribunal ruled that technical defaults without malafide intent, where funds were legitimately utilized for business, do not warrant maximum penalty under FEMA Section 13.",
        "metadata": {"case_name": "Tech Mahindra vs. ED", "year": 2018, "outcome": "Penalty Reduced", "area": "FEMA"}
    }
]

def seed_cases():
    print("🚀 Starting AI Judge Knowledge Ingestion...")
    for idx, case in enumerate(LANDMARK_CASES):
        print(f"[{idx+1}/5] Embedding: {case['metadata']['case_name']}")
        
        try:
            # Generate 4096-dim vector via NVIDIA NIM
            embedding_response = nim_client.embeddings.create(
                input=[case['content']],
                model="nvidia/nv-embed-v1"
            )
            embedding = embedding_response.data[0].embedding
            
            # Insert into Supabase
            supabase.table("court_cases").insert({
                "content": case['content'],
                "embedding": embedding,
                "metadata": case['metadata']
            }).execute()
            
            print(f"   ✅ Saved to Database!")
            time.sleep(1) # Prevent ratelimits
        except Exception as e:
            print(f"   ❌ Failed: {e}")

    print("\n👑 Empire Knowledge Base Seeded Successfully!")
    
if __name__ == "__main__":
    seed_cases()
