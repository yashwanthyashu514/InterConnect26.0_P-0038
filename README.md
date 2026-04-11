# 🏛️ maCA Empire: The Future of Indian Legal & Financial Intelligence

[![Production Ready](https://img.shields.io/badge/Status-Live%20&%20Production%20Ready-teal?style=for-the-badge&logo=rocket)](https://github.com/yashwanthyashu514/InterConnect26.0_P-0038)
[![Tech Stack](https://img.shields.io/badge/Stack-Next.js%20|%20FastAPI%20|%20NVIDIA%20NIM-black?style=for-the-badge)](https://github.com/yashwanthyashu514/InterConnect26.0_P-0038)

**maCA Empire** is an elite, high-performance suite of 22 autonomous AI agents designed to replace expensive manual legal and financial jobs for 1.3 billion Indian citizens. Powered by a premium **RAG pipeline**, **NVIDIA NIM**, and **Supabase Vector**, it delivers institutional-grade intelligence for the price of a Netflix subscription.

---

## 🚀 The 22-Agent Ecosystem (Current Progress)

We are systematically deploying 22 autonomous agents. Phase 1 deployment is **LIVE**.

| ID | Agent | Core Capability | Status |
|:---|:---|:---|:---|
| **A1** | **maCA Tax** | Live Penalty Clock (Rs. 50/day) & 11-Language RAG | ✅ LIVE |
| **A2** | **BankFight** | 30-Day RBI Deadline Timer & Nodal Officer Letters | ✅ LIVE |
| **A3** | **ComplianceBot** | CIN-to-Deadline Calendar (AOC-4, MGT-7A) | ✅ LIVE |
| **A4** | **AI Judge** | Pre-trial verdict forecasting & deep case analysis | ✅ LIVE |
| **A5** | **Notice Fighter** | Instant IT & GST Notice drafting from PDF text | ✅ LIVE |
| **A6** | **RTI / RERA** | Automated public records filing & real estate legal scout | ✅ LIVE |
| **A7** | **Credit Fixer** | CIBIL dispute automation & debt recovery strategy | ✅ LIVE |
| **A8** | **The Vault** | Secure, AES-256 encrypted legal document repository | ✅ LIVE |
| **A9** | **Labour Law** | Dispute resolution helper for EPF, Gratuity & ESIC | ✅ LIVE |
| **A10** | **Voice CA** | Multilingual WhatsApp-style voice consultation | ✅ BETA |

---

## ✨ Key Features & UX

### 💎 Premium Design System
- **Apple-Inspired Identity**: Cinematic section rhythm, SF Pro typography with precise tracking, and glassmorphic UI components.
- **Teal & Silver Palette**: A professional, high-trust color system tailored for the legal industry.
- **Dynamic Interactions**: Fluid animations for agent transitions and real-time data visualization.

### 💬 Advanced Agent Chat (RAG)
- **Real-Time Synergy**: Direct integration with FastAPI backend for low-latency legal queries.
- **Source Verification**: Every answer provided by the agents includes clickable citations from official Indian Law PDFs.
- **Context Awareness**: Maintains deep conversational history for complex multi-step legal processes.

---

## 🛠️ Technical Masterpiece

### Frontend: The Apple-Style Experience
- **Framework**: Next.js 14/15 (App Router)
- **Logic**: Unified `AgentChatLayout` for consistent UX across 22 agents.
- **Styling**: Vanilla CSS (Global Design Tokens).

### Backend: The AGI Engine
- **Orchestrator**: FastAPI with asynchronous task handling.
- **AI Models**: `meta/llama-3.3-70b-instruct` (Reasoning) & `nvidia/nv-embed-v1` (Embeddings).
- **Database**: Supabase + `pgvector` (4096-dim support).
- **Inference**: NVIDIA NIM Integration for institutional-grade reliability.

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
Place your legal PDFs (CGST Act, Income Tax Act, RB-IOS 2011/2026) in the `/docs` folder and run:
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
