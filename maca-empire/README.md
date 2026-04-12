# 🏛️ maCA Empire: The Future of Indian Legal & Financial Intelligence

**maCA Empire** is a high-performance, AI-driven suite of 22 specialized legal and financial agents designed for 1.3 billion Indian citizens. It replaces expensive manual jobs (CA assistants, Company Secretaries, Payroll Managers) with a premium AI RAG pipeline powered by **NVIDIA NIM** and **Supabase Vector**.

---

## 🚦 Project Status: Phase 1 Complete (Production Ready)
**Deadline:** April 12 Demo Ready | **Current Date:** April 12 | **Status:** ✅ MISSION SUCCESS

### 🚀 The 22 AI Agents (Core, Growth & Elite)

| ID | Agent | Key Feature | Status |
|----|-------|-------------|--------|
| **A1** | **maCA Tax** | Live Penalty Clock (Rs. 50/day) & 11-Language RAG | ✅ LIVE |
| **A2** | **BankFight** | 30-Day RBI Deadline Timer & Nodal Officer Letters | ✅ LIVE |
| **A3** | **ComplianceBot** | CIN-to-Deadline Calendar (AOC-4, MGT-7A) | ✅ LIVE |
| **A4** | **PayrollPilot** | Indian Salary Gross-to-Net Calculator (TDS, PF, ESI) | ✅ LIVE |
| **A5** | **Voice CA** | Hindi WhatsApp voice note query shell | ✅ SHELL |
| **A6** | **Notice Fighter** | Instant IT & GST Notice drafting from PDF text | ✅ LIVE |
| **A7** | **Audit Shield** | GSTIN-based audit risk scoring & gauge | ✅ LIVE |
| **A8-A20**| **Growth Pillar** | RTI Filer, RERA Scout, Credit Fixer, Startup Legal, etc. | ✅ ACTIVE |
| A21 | DPDP Shield | DPDP Act 2023 Gap Analysis, Consent Drafting & Rs.250Cr Penalty Shield | LIVE |
| A22 | CryptoTax Pro | VDA 30% Tax Calculator, Schedule VDA ITR Filing & Live Tax Meter | LIVE |
| A23 | ESG Compass | SEBI BRSR Core Auto-fill, GHG Calculator & EU CBAM Analyser | LIVE |
| A24 | HeirGuard | Will Drafting, Succession Advisory & Asset Transmission Engine | LIVE |
| **A25** | *AI Governance Counsel* | *AI Act Compliance & Algorithmic Audit (Building Next)* | |
| **A26** | *The Oracle* | *General Counsel AGI (Phase 5)* | |

### 🛠️ Technical Stack
- **Frontend**: Next.js 16 (App Router), TypeScript, Vanilla CSS (Apple Cinematic Design).
- **Backend**: FastAPI (Python), OpenAI SDK (NVIDIA NIM meta/llama-3.3-70b-instruct).
- **AI RAG**: `nvidia/nv-embed-v1` (4096-dim), pgvector on Supabase.
- **Real-time**: WebSockets for Live Tax Meters & SSE for response streaming.

---

## 📦 Zero-Click Setup Instructions

### 1. Backend Integration (FastAPI)
- **Directory**: `/backend`
- **Install**: `pip install -r requirements.txt`
- **Run**: `uvicorn main:app --reload`
- **Database**: Execute `backend/setup.sql` in your Supabase SQL Editor.

### 2. Ingestion (Training the AI)
Place legal PDFs in the `/docs` folder and run:
`python backend/ingester.py --all` (Includes DPDP, IT Act, and VDA Rules).

### 3. Frontend (Next.js)
- **Directory**: `/maca-empire`
- **Install**: `npm install`
- **Run**: `npm run dev`
- **URL**: [http://localhost:3000](http://localhost:3000)

---

## 🔒 Environment Variables (`.env`)
Ensure your root `.env` includes:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_KNOWLEDGE_KEY` (For RAG)
- `NVIDIA_API_KEY`
- `NEXT_PUBLIC_BACKEND_URL=http://localhost:8000`

---

**© 2026 maCA Empire — Submission for InterConnect 26.0.**
*Built by Antigravity in collaboration with Team GMIT.*
