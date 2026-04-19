import os
import subprocess
import sys

print("Installing reportlab...")
subprocess.run([sys.executable, "-m", "pip", "install", "reportlab"], check=True)

from reportlab.pdfgen import canvas

paths = {
    'backend/docs/esg_compass/': [
        'SEBI_BRSR_Core_Framework_2023.pdf',
        'SEBI_BRSR_Master_Circular_2021.pdf',
        'MCA_NGRBC_National_Guidelines.pdf',
        'EU_CBAM_Carbon_Border_Adjustment.pdf',
        'GHG_Protocol_Scope123_Standards.pdf',
        'SEBI_ESG_Rating_Providers_2023.pdf',
        'India_Carbon_Credit_Market_RBI_Guidelines.pdf',
        'SEBI_Sustainability_Reporting_IFRS_Alignment.pdf'
    ],
    'backend/docs/heirguard/': [
        'Indian_Succession_Act_1925.pdf',
        'Hindu_Succession_Act_1956.pdf',
        'Hindu_Succession_Amendment_Act_2005.pdf',
        'Muslim_Personal_Law_Shariat_Application_Act.pdf',
        'Transfer_of_Property_Act_1882.pdf',
        'Registration_Act_1908.pdf',
        'Probate_Administration_Letters_CPC.pdf',
        'SEBI_Transmission_Mutual_Fund_Circular.pdf',
        'NSDL_CDSL_Demat_Transmission_Guide.pdf',
        'EPF_Nominee_Declaration_Form_2_Guide.pdf'
    ]
}

for folder, files in paths.items():
    os.makedirs(folder, exist_ok=True)
    for f in files:
        c = canvas.Canvas(os.path.join(folder, f))
        c.drawString(100, 750, 'Dummy text representing ' + f + ' for RAG embedding.')
        c.drawString(100, 720, 'Testing the vector store search intent.')
        c.save()

print("Dummy PDFs created.")

print("Running Ingestion for ESG Compass...")
subprocess.run([sys.executable, "backend/ingester.py", "--agent", "esg_compass"], check=True)

print("Running Ingestion for HeirGuard...")
subprocess.run([sys.executable, "backend/ingester.py", "--agent", "heirguard"], check=True)

print("runng")