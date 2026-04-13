# 🏛️ maCA Empire: The Future of Indian Legal & Financial Intelligence

**maCA Empire** is a 24-agent autonomous ecosystem designed to democratize access to elite-level financial, tax, and legal advisory services. Through specialized AI personas (e.g., CryptoTax Pro, DPDP Shield, BankFight), the platform acts as a digital "Big 4 Senior Partner," providing zero-latency, highly accurate guidance on complex regulations, penalty avoidance, and compliance tracking. It directly solves the real-world problem of specialized legal services being inaccessible and unaffordable for the average citizen.

---

## 🚦 Project Status: Phase 1 — Orchestrator Build Complete
**Deadline:** April 18 Final Demo | **Current Date:** April 14 | **Status:** ✅ STABLE & VALIDATED

### 🚀 The 24 AI Agents (Core, Growth & Elite)

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
| **A21** | **DPDP Shield** | DPDP Act 2023 Gap Analysis, Consent Drafting & Rs.250Cr Penalty Shield | ✅ LIVE |
| **A22** | **CryptoTax Pro** | VDA 30% Tax Calculator, Schedule VDA ITR Filing & Live Tax Meter | ✅ LIVE |
| **A23** | **ESG Compass** | SEBI BRSR Core Auto-fill, GHG Calculator & EU CBAM Analyser | ✅ LIVE |
| **A24** | **HeirGuard** | Will Drafting, Succession Advisory & Asset Transmission Engine | ✅ LIVE |
| **A25** | **AI Governance** | EU AI Act Compliance & Algorithmic Accountability | ✅ LIVE |
| **A26** | **The Oracle** | Live Market Pulse & 50-year Global Knowledge Graph | ✅ LIVE |

### 🛠️ Technical Stack
- **Frontend**: Next.js 16 (App Router), TypeScript, Vanilla CSS (High-Authority Cinematic Design).
- **Search Engine**: Real-time Global Intelligence Search (Filters 26+ Agents).
- **Backend**: FastAPI (Python), OpenAI SDK (NVIDIA NIM meta/llama-3.3-70b-instruct).
- **AI RAG**: `nvidia/nv-embed-v1` (4096-dim), pgvector on Supabase.
- **Navigation**: Zero-Shift Overlay Sidebar & Persistent Command Top-Navbar.
- **Real-time**: WebSockets for Live Tax Meters & SSE for response streaming.

---

## 📦 Zero-Click Setup Instructions

### 1. Backend Integration (FastAPI)
- **Directory**: `/backend`
- **Install**: `pip install -r requirements.txt`
- **Run**: `uvicorn main:app --reload`
- **Database**: Execute `backend/setup.sql` and `backend/a23_a24_setup.sql` in your Supabase SQL Editor.

### 2. Ingestion (Training the AI)
Place legal PDFs in the `/docs` folder and run:
`python backend/ingester.py --all` (Includes IT Act, DPDP, VDA Rules, ESG Standards, and Succession Acts).

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

### ⚡ InterConnect 26.0: Innovation Challenge
**MaCA Empire** is the flagship submission for **InterConnect 26.0**, an Interdisciplinary Innovation Challenge organized by the **Dept. of CSE, GMIT**. 

*   **Build Period:** 1 April – 17 April 2026.
*   **Final Demo:** 18 April 2026.
*   **Focus:** Interdisciplinary problem solving for campus and global legal tech.
*   **Evaluation Lead:** Dr. Shivanagowda G M (Convenor) & Ms. Ranjitha D S (Coordinator).

---

**© 2026 maCA Empire — Official Submission for InterConnect 26.0.**
*Built by Antigravity in collaboration with Team GMIT CSE.*
