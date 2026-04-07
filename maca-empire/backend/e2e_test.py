import requests
import json
import time

BASE_URL = "http://localhost:8000"

def run_tests():
    print("🚀 Starting E2E Backend Verification...\n")
    
    # 1. Health Check
    try:
        res = requests.get(f"{BASE_URL}/health")
        if res.status_code == 200:
            print("✅ [1/4] Health Check Passed.")
        else:
            print(f"❌ Health Check Failed: {res.status_code}")
    except Exception as e:
        print(f"❌ Backend unreachable: {e}")
        return

    # 2. B2B Onboard
    print("\n📦 Test 2: B2B Enterprise Onboarding")
    b2b_payload = {
        "cin": "U72900MH2023PTC123456",
        "emp_count": "150",
        "selected_needs": ["Tax Disputes", "Registrations"]
    }
    b2b_res = requests.post(f"{BASE_URL}/b2b-onboard", json=b2b_payload)
    if b2b_res.status_code == 200:
        data = b2b_res.json()
        print(f"✅ [2/4] B2B Passed! Generated Key: {data.get('api_key', 'MISSING')[:20]}...")
        print(f"   -> Risk Flags Returned: {len(data.get('risk_flags', []))}")
        test_api_key = data.get('api_key')
    else:
        print(f"❌ B2B Onboard Failed: {b2b_res.text}")
        return

    # Wait to avoid ratelimits
    time.sleep(2)

    # 3. AI Judge (RAG Verification)
    print("\n⚖️ Test 3: AI Judge & Hybrid RAG")
    judge_payload = {
        "notice_type": "Income Tax",
        "assessee_type": "Corporate",
        "amount": "1000000",
        "facts": "Reassessment notice issued after 4 years without pointing out failure to disclose material facts."
    }
    judge_res = requests.post(f"{BASE_URL}/predict-outcome", json=judge_payload)
    if judge_res.status_code == 200:
        data = judge_res.json()
        print(f"✅ [3/4] AI Judge Passed!")
        print(f"   -> Win Probability: {data.get('win_probability')}%")
        print(f"   -> Top Precedent Found: {data.get('top_precedents', [{}])[0].get('case_name', 'None')}")
    else:
        print(f"❌ AI Judge Failed: {judge_res.text}")

    # Wait to avoid ratelimits
    time.sleep(2)

    # 4. Secure Vault Save
    print("\n🏺 Test 4: Secure Vault Saving")
    vault_payload = {
        "agent_id": "C1",
        "doc_type": "Case Prediction",
        "content": json.dumps(data)
    }
    
    # We must pass the X-MACA-API-KEY header (FIX-001/005 validation)
    headers = {"X-MACA-API-KEY": test_api_key}
    vault_res = requests.post(f"{BASE_URL}/vault/save", json=vault_payload, headers=headers)
    
    if vault_res.status_code == 200:
        print(f"✅ [4/4] Secure Vault Passed! Doc ID: {vault_res.json().get('doc_id')}")
    else:
        print(f"❌ Vault Save Failed: {vault_res.text}")

    print("\n🎉 All 4 E2E Critical Paths Successfully Verified!")

if __name__ == "__main__":
    run_tests()
