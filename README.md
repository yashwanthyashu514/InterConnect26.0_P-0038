# 🏛️ maCA Empire: The Future of Indian Legal & Financial Intelligence

[![Production Ready](https://img.shields.io/badge/Status-Live%20&%20Production%20Ready-teal?style=for-the-badge&logo=rocket)](https://github.com/yashwanthyashu514/InterConnect26.0_P-0038)
[![Tech Stack](https://img.shields.io/badge/Stack-Next.js%20|%20FastAPI%20|%20NVIDIA%20NIM-black?style=for-the-badge)](https://github.com/yashwanthyashu514/InterConnect26.0_P-0038)

**maCA Empire** is an elite, high-performance suite of 22 autonomous AI agents designed to replace expensive manual legal and financial jobs for 1.3 billion Indian citizens. Powered by a premium **RAG pipeline**, **NVIDIA NIM**, and **Supabase Vector**, it delivers institutional-grade intelligence for the price of a Netflix subscription.

---

## 🚀 The 20+ Autonomous Agents Ecosystem

We have deployed a comprehensive suite of 20+ specialized agents, each fine-tuned for a specific legal or financial pillar of the Indian ecosystem.

| ID | Agent | Core Capability | Status |
|:---|:---|:---|:---|
| **A1** | **maCA Tax** | Live Penalty Clock (Rs. 50/day) & 11-Language RAG | ✅ LIVE |
| **A2** | **BankFight** | 30-Day RBI Deadline Timer & Nodal Officer Letters | ✅ LIVE |
| **A3** | **ComplianceBot** | CIN-to-Deadline Calendar (AOC-4, MGT-7A) | ✅ LIVE |
| **A4** | **AI Judge** | Pre-trial verdict forecasting & deep case analysis | ✅ LIVE |
| **A5** | **Notice Fighter** | Instant IT & GST Notice drafting from PDF text | ✅ LIVE |
| **A6** | **RTI Filer** | Automated Right to Information applications & tracking | ✅ LIVE |
| **A7** | **RERA Scout** | Real Estate legal audit & developer compliance check | ✅ LIVE |
| **A8** | **Credit Fixer** | CIBIL dispute automation & debt recovery strategy | ✅ LIVE |
| **A9** | **The Vault** | Secure, AES-256 encrypted legal document repository | ✅ LIVE |
| **A10** | **Labour Law** | Dispute resolution for EPF, Gratuity & ESIC | ✅ LIVE |
| **A11** | **Court Filer** | Automated drafting for Civil and Criminal filings | ✅ LIVE |
| **A12** | **Insurance Fighter** | Health/Motor claim rejection dispute & legal notice | ✅ LIVE |
| **A13** | **Pension Planner** | EPF 95 strategy & government pension optimization | ✅ LIVE |
| **A14** | **Startup Legal** | Incorporation, Term Sheets, and Founder Agreements | ✅ LIVE |
| **A15** | **Trade Mark** | IP registration, brand protection & scout | ✅ LIVE |
| **A16** | **NRI Counsel** | Cross-border property & investment legal aid | ✅ LIVE |
| **A17** | **Audit Shield** | GSTIN-based audit risk scoring & profiling | ✅ LIVE |
| **A18** | **Contract Reviewer** | Deep-scan for "Toxic Clauses" in any agreement | ✅ LIVE |
| **A19** | **Payroll Pilot** | Gross-to-Net Salary (TDS, PF, ESI) Calculator | ✅ LIVE |
| **A20** | **Voice CA** | Multilingual WhatsApp-style voice consultation | ✅ BETA |
| **A21** | **DPDP Shield** | DPDP Act 2023 Gap Analysis, Consent Drafting & ₹250Cr Penalty Shield | ✅ LIVE |
| **A22** | **CryptoTax Pro** | VDA 30% Tax Calculator, Schedule VDA ITR Filing & Live Crypto Tax Meter | ✅ LIVE |

---

## ✨ Key Features & UX

### 💎 Premium Design System
- **Apple-Inspired Identity**: Cinematic section rhythm, SF Pro typography with precise tracking, and glassmorphic UI components.
- **Teal & Silver Palette**: A professional, high-trust color system tailored for the legal industry.
- **Dynamic Interactions**: Fluid animations for agent transitions and real-time data visualization.

### 💬 Advanced Agent Chat (RAG)
- **Real-Time Synergy**: Direct integration with FastAPI backend for low-latency legal queries.
- **Source Verification**: Every answer includes clickable legal citations from official Indian Government Law PDFs.
- **Context Awareness**: Maintains deep conversational history for complex multi-step legal processes.

---

## 🛠️ Technical Masterpiece

### Frontend: The Apple-Style Experience
- **Framework**: Next.js 14/15 (App Router)
- **Logic**: Unified `AgentChatLayout` for consistent UX across 20+ agents.
- **Styling**: Vanilla CSS (Global Design Tokens).

### Backend: The AGI Engine
- **Orchestrator**: FastAPI with asynchronous task handling.
- **AI Models**: `meta/llama-3.3-70b-instruct` (Reasoning) & `nvidia/nv-embed-v1` (Embeddings).
- **Database**: Supabase + `pgvector` (4096-dim support).
- **Inference**: NVIDIA NIM Integration for ultra-low latency.

---

## 📦 Zero-Click Setup Instructions

### 1. Backend Integration
```bash
cd maca-empire/backend
pip install -r requirements.txt
# Run the uvicorn server
uvicorn main:app --reload
```
*Note: Execute `backend/setup.sql` in your Supabase SQL Editor to initialize the vector database.*

### 2. AI Training (Ingestion)
Place your legal PDFs in the `/docs` folder and run:
```bash
python backend/ingester.py
```

### 3. Frontend Activation
```bash
cd maca-empire
npm install
npm run dev
# URL: http://localhost:3000
```

---

## 🔐 Environment Configuration
Ensure your root `.env` includes:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_KEY` (Service Role)
- `NVIDIA_API_KEY`
- `NEXT_PUBLIC_BACKEND_URL`

---
© 2026 maCA Empire • Built for the 1.3 Billion.
