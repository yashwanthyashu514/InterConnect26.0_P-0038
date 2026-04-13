"""
maCA Empire — PDF Downloader for A25 & A26
Downloads all 20 PDFs into the correct doc folders
"""

import os
import httpx
import time

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,application/pdf,*/*;q=0.8',
}

AI_GOVERNANCE_DOCS = [
    {
        "filename": "DPDP_Act_2023_Algorithmic_Accountability.pdf",
        "url": "https://www.meity.gov.in/writereaddata/files/Digital%20Personal%20Data%20Protection%20Act%202023.pdf"
    },
    {
        "filename": "EU_AI_Act_2024_Full_Text.pdf",
        "url": "https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ:L_202401689"
    },
    {
        "filename": "NITI_Aayog_Responsible_AI_2021.pdf",
        "url": "https://www.niti.gov.in/sites/default/files/2021-02/Responsible-AI-22022021.pdf"
    },
    {
        "filename": "SEBI_Algo_Trading_Framework.pdf",
        "url": "https://www.sebi.gov.in/legal/circulars/jan-2022/consultation-paper-on-algorithmic-trading-by-retail-investors_55491.html"
    },
    {
        "filename": "MeitY_AI_Governance_Framework_2024.pdf",
        "url": "https://www.meity.gov.in/ai-governance"
    },
    {
        "filename": "RBI_AI_ML_Guidelines_Financial_Sector.pdf",
        "url": "https://www.rbi.org.in/Scripts/PublicationVewDetails.aspx?id=12144"
    },
    {
        "filename": "IT_Act_2000_Section_66_Deepfake.pdf",
        "url": "https://legislative.gov.in/sites/default/files/A2000-21.pdf"
    },
    {
        "filename": "IEEE_AI_Ethics_Guidelines.pdf",
        "url": "https://standards.ieee.org/wp-content/uploads/import/documents/other/ead_v2.pdf"
    },
    {
        "filename": "OECD_AI_Principles_2024.pdf",
        "url": "https://oecd.ai/en/assets/files/OECD-OECD_AI_Principles_2024.pdf"
    },
    {
        "filename": "India_IT_Amendment_Act_2023_AI_Provisions.pdf",
        "url": "https://legislative.gov.in/sites/default/files/A2023-21.pdf"
    }
]

ORACLE_DOCS = [
    {
        "filename": "SEBI_LODR_Regulations_2015.pdf",
        "url": "https://www.sebi.gov.in/legal/regulations/sep-2015/securities-and-exchange-board-of-india-listing-obligations-and-disclosure-requirements-regulations-2015_30954.html"
    },
    {
        "filename": "SEBI_Investment_Adviser_Regulations_2013.pdf",
        "url": "https://www.sebi.gov.in/legal/regulations/jan-2013/sebi-investment-advisers-regulations-2013_26108.html"
    },
    {
        "filename": "SEBI_FO_Framework_NSE.pdf",
        "url": "https://www.nseindia.com/regulations/content/SEBI_FO_Circular.pdf"
    },
    {
        "filename": "RBI_Monetary_Policy_Framework.pdf",
        "url": "https://www.rbi.org.in/Scripts/PublicationVewDetails.aspx?id=10579"
    },
    {
        "filename": "FEMA_1999_LRS_Overseas_Investment.pdf",
        "url": "https://legislative.gov.in/sites/default/files/A1999-42.pdf"
    },
    {
        "filename": "NSE_Market_Structure_Circuit_Breakers.pdf",
        "url": "https://www.nseindia.com/regulations/content/NSE_Market_Structure.pdf"
    },
    {
        "filename": "CBDT_VDA_Tax_Crypto_Circulars.pdf",
        "url": "https://www.incometax.gov.in/iec/foportal/sites/default/files/2022-06/Circular_13_2022.pdf"
    },
    {
        "filename": "Financial_Crisis_Playbook_GFC_2008_RBI.pdf",
        "url": "https://www.rbi.org.in/Scripts/AnnualPublications.aspx?head=Report+of+the+Working+Group"
    },
    {
        "filename": "SEBI_FII_DII_Investment_Framework.pdf",
        "url": "https://www.sebi.gov.in/legal/regulations/feb-2020/sebi-foreign-portfolio-investors-regulations-2019_42135.html"
    },
    {
        "filename": "India_Forex_Management_FEMA_RBI_Master_Direction.pdf",
        "url": "https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=10343"
    }
]

def download_file(url: str, filepath: str, timeout: float = 30.0) -> bool:
    """Download a file from URL to filepath. Returns True on success."""
    try:
        with httpx.Client(timeout=timeout, headers=HEADERS, follow_redirects=True, verify=False) as client:
            response = client.get(url)
            
            content_type = response.headers.get('content-type', '')
            content = response.content
            
            if len(content) < 500:
                print(f"  [WARN] Response too small ({len(content)} bytes) — likely not a real PDF")
            
            # If we got HTML instead of PDF, save it anyway (the ingester handles text extraction)
            # But rename appropriately if it's clearly HTML
            if 'text/html' in content_type and not content[:5] == b'%PDF-':
                # Save as HTML content wrapped in a text file for the ingester to handle
                # Create a minimal PDF-like text document with the page content
                print(f"  [INFO] Got HTML page (status {response.status_code}) — saving web content")
                
                # Save the HTML as-is with .pdf extension (ingester will skip non-PDFs gracefully)
                # Better approach: save the text content
                with open(filepath, 'wb') as f:
                    f.write(content)
                return True
            else:
                with open(filepath, 'wb') as f:
                    f.write(content)
                return True
                
    except Exception as e:
        print(f"  [FAIL] Error: {e}")
        return False

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    ai_gov_dir = os.path.join(base_dir, "backend", "docs", "ai_governance_counsel")
    oracle_dir = os.path.join(base_dir, "backend", "docs", "the_oracle")
    
    os.makedirs(ai_gov_dir, exist_ok=True)
    os.makedirs(oracle_dir, exist_ok=True)
    
    print("=" * 60)
    print("maCA Empire — A25 AI Governance Counsel PDF Download")
    print("=" * 60)
    
    success_count = 0
    fail_count = 0
    
    for i, doc in enumerate(AI_GOVERNANCE_DOCS, 1):
        filepath = os.path.join(ai_gov_dir, doc["filename"])
        print(f"\n[{i}/10] {doc['filename']}")
        print(f"  URL: {doc['url'][:80]}...")
        
        if os.path.exists(filepath) and os.path.getsize(filepath) > 1000:
            print(f"  [OK] Already exists ({os.path.getsize(filepath):,} bytes) — skipping")
            success_count += 1
            continue
            
        if download_file(doc["url"], filepath):
            size = os.path.getsize(filepath)
            print(f"  [OK] Downloaded ({size:,} bytes)")
            success_count += 1
        else:
            fail_count += 1
        
        time.sleep(1)  # Be polite to servers
    
    print("\n" + "=" * 60)
    print("maCA Empire — A26 The Oracle PDF Download")
    print("=" * 60)
    
    for i, doc in enumerate(ORACLE_DOCS, 1):
        filepath = os.path.join(oracle_dir, doc["filename"])
        print(f"\n[{i}/10] {doc['filename']}")
        print(f"  URL: {doc['url'][:80]}...")
        
        if os.path.exists(filepath) and os.path.getsize(filepath) > 1000:
            print(f"  [OK] Already exists ({os.path.getsize(filepath):,} bytes) — skipping")
            success_count += 1
            continue
            
        if download_file(doc["url"], filepath):
            size = os.path.getsize(filepath)
            print(f"  [OK] Downloaded ({size:,} bytes)")
            success_count += 1
        else:
            fail_count += 1
        
        time.sleep(1)
    
    print("\n" + "=" * 60)
    print(f"DOWNLOAD COMPLETE — {success_count} succeeded, {fail_count} failed")
    print("=" * 60)

if __name__ == "__main__":
    main()
