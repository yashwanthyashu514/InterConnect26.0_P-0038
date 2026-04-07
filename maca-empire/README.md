# 🏛️ maCA Empire: The Future of Indian Legal & Financial Intelligence

**maCA Empire** is a high-performance, AI-driven suite of legal and financial agents designed for 1.3 billion Indian citizens. It replaces expensive manual jobs (CA assistants, Company Secretaries, Payroll Managers) with a premium AI RAG pipeline powered by **NVIDIA NIM** and **Supabase Vector**.

---

## 🚦 Phase 1: Foundation & RAG Status (Sprint 1)
**Deadline:** April 12 Demo Ready | **Current Date:** April 6 | **Status:** ✅ GO FOR LAUNCH

### 🚀 The 7 AI Agents (A1-A7)

| ID | Agent | Key Feature | Status |
|----|-------|-------------|--------|
| **A1** | **maCA Tax** | Live Penalty Clock (Rs. 50/day) & 11-Language RAG | ✅ LIVE |
| **A2** | **BankFight** | 30-Day RBI Deadline Timer & Nodal Officer Letters | ✅ LIVE |
| **A3** | **ComplianceBot** | CIN-to-Deadline Calendar (AOC-4, MGT-7A) | ✅ LIVE |
| **A4** | **PayrollPilot** | Indian Salary Gross-to-Net Calculator (TDS, PF, ESI) | ✅ LIVE |
| **A5** | **Voice CA** | Hindi WhatsApp voice note query shell | ✅ SHELL |
| **A6** | **Notice Fighter** | Instant IT & GST Notice drafting from PDF text | ✅ LIVE |
| **A7** | **Audit Shield** | GSTIN-based audit risk scoring & gauge | ✅ SHELL |

### 🛠️ Technical Stack
- **Frontend**: Next.js 16 (App Router), TypeScript, Vanilla CSS (Premium Teal/Glassmorphism).
- **Backend**: FastAPI, OpenAI SDK (NVIDIA NIM Integration).
- **AI Models**: `meta/llama-3.3-70b-instruct` (Reasoning), `nvidia/nv-embed-v1` (Embeddings).
- **Database**: Supabase + `pgvector` (4096-dim support).

---

## 📦 Zero-Click Setup Instructions

### 1. Backend Integration (FastAPI)
- **Directory**: `/backend`
- **Install**: `pip install -r requirements.txt`
- **Run**: `uvicorn main:app --reload`
- **Database**: Execute `backend/setup.sql` in your Supabase SQL Editor.

### 2. Ingestion (Training the AI)
Place your legal PDFs (CGST Act, Income Tax Act, RB-IOS 2011/2026) in the `/docs` folder and run:
`python backend/ingester.py` (Script includes auto-download for key laws).

### 3. Frontend (Next.js)
- **Directory**: `/maca-empire`
- **Install**: `npm install`
- **Run**: `npm run dev`
- **URL**: [http://localhost:3000](http://localhost:3000)

---

## 🗺️ Revenue Projections (Year 1)
- **Base Plan**: Rs. 999/month (maCA Tax Bundle + Notice Fighter + Voice)
- **Target ARR**: Rs. 14.5 Cr - Rs. 15 Cr (Conservative)
- **Pitch Tagline**: *Access the secret legal tools of the elite for the price of a Netflix subscription.*

---

## 🔒 Environment Variables (`.env`)
Make sure your root `.env` includes:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_URL`
- `SUPABASE_KEY` (Service Role)
- `NVIDIA_API_KEY`
- `NEXT_PUBLIC_BACKEND_URL=http://localhost:8000`

---

**© 2026 maCA Empire — We are 81 Days Early for RB-IOS 2026.**
