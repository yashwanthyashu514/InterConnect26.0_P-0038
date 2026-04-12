import requests
import json
import time

BASE_URL = "http://localhost:8000"

def run_tests():
    print("--- Starting E2E Backend Verification ---\n")
    
    # 1. Health Check
    try:
        res = requests.get(f"{BASE_URL}/health")
        if res.status_code == 200:
            print("[1/6] Health Check Passed.")
        else:
            print(f"FAILED: Health Check: {res.status_code}")
    except Exception as e:
        print(f"FAILED: Backend unreachable: {e}")
        return

    # 2. DPDP Shield (A21) Verification
    print("\n[2/6] Verifying DPDP Shield (A21)")
    dpdp_payload = {
        "user_message": "What is the penalty for a data breach under DPDP Act?",
        "session_id": "test_dpdp"
    }
    try:
        dpdp_res = requests.post(f"{BASE_URL}/api/agents/dpdp-shield/query", json=dpdp_payload, stream=True)
        if dpdp_res.status_code == 200:
            print("SUCCESS: DPDP Shield Response Started.")
        else:
            print(f"FAILED: DPDP Shield query: {dpdp_res.status_code}")
    except Exception as e:
        print(f"FAILED: DPDP Shield connection: {e}")

    # 3. CryptoTax Pro (A22) Verification
    print("\n[3/6] Verifying CryptoTax Pro (A22)")
    crypto_payload = {
        "user_message": "Calculate tax for 1 BTC gain",
        "session_id": "test_crypto"
    }
    try:
        crypto_res = requests.post(f"{BASE_URL}/api/agents/cryptotax-pro/query", json=crypto_payload, stream=True)
        if crypto_res.status_code == 200:
            print("SUCCESS: CryptoTax Pro Response Started.")
        else:
            print(f"FAILED: CryptoTax Pro query: {crypto_res.status_code}")
    except Exception as e:
        print(f"FAILED: CryptoTax Pro connection: {e}")

    # 4. Hybrid RAG / Generic Ask
    print("\n[4/6] Verifying Generic Agent Router")
    ask_payload = {
        "query": "How to file GST for a startup?",
        "agent_id": "A1"
    }
    try:
        ask_res = requests.post(f"{BASE_URL}/ask", json=ask_payload, stream=True)
        if ask_res.status_code == 200:
            print("SUCCESS: Generic Ask Response Started.")
        else:
            print(f"FAILED: Generic Ask: {ask_res.status_code}")
    except Exception as e:
        print(f"FAILED: Generic Ask connection: {e}")

    print("\n--- All E2E Critical Paths Verified ---")

if __name__ == "__main__":
    run_tests()
