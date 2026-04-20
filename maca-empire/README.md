# 🏛️ MaCA Empire | The AGI Neural Registry

This directory contains the primary frontend and orchestration logic for the **MaCA Empire** platform. Built for the **InterConnect 26.0** innovation challenge, this application implements a highly advanced **28-agent autonomous ecosystem** for top-tier financial, corporate, and legal advisory.

## 🏗️ Architecture & Assets

- `/src/app`: Next.js 16 App Router (Agent Chat Interfaces, UI Dashboards, Admin Panels).
- `/backend`: FastAPI Python server (A0 Command Nexus, Intent Classification, RAG fetching, Multi-Turn Memory).
- `/backend/maca_storage.db` / Supabase: Hybrid vector storage for specialized legal/financial compliance documents.
- `DEMO_PLAYBOOK.md`: **[CRITICAL FOR JUDGES]** A complete cheat sheet of multi-turn prompts carefully engineered to demonstrate the elite capabilities of all 28 agents.

## ⚡ Technical Highlights

### 1. The 28-Node Multi-Agent Ecosystem
The platform utilizes deeply specialized personas, coordinated by the **Command Nexus (A0)**, divided into strict capability tiers:
- **Core Operations**: Supreme Tax, BankFight, Payroll Pilot, Compliance Bot, Notice Fighter.
- **Elite Shield Layer**: DPDP Shield (Privacy), AI Governance Counsel (Tech Law), ESG Compass (Carbon & Sustainability).
- **The Crown Agents**: 
  - **Victor Harlan (A28)**: Cut-throat Wall Street M&A / LBO execution.
  - **Elite Wealth Architect (A27)**: Billionaire multi-jurisdiction Trust & SPV structuring.
  - **The Oracle (A26)**: 50-year compound intelligence for live global macro trading.
  - **CryptoTax Pro (A22)** & **HeirGuard (A24)**: Niche expertise in VDA taxation and Indian Succession Act probates.

### 2. Live Memory & Neural Streaming
Implemented a custom `AgentQueryRequest` protocol allowing full context transmission. The LLM retains memory of complex user structures (e.g., $15M ARR SaaS companies, 40% export steel manufacturing) across multi-turn websockets and HTTP chunked streams.

### 3. Hyper-Specific RAG Ingestion
Agent logic is backed by custom embeddings (`nvidia/nv-embed-v1`) querying against granular compliance documents (SEBI BRSR protocols, EU CBAM, India-Singapore DTAA treaties, Hindu Succession Act).

## 🚀 Execution & Demo Workflow

### Prerequisites
- Node.js 18+ & Python 3.10+
- `.env` configured with necessary `SUPABASE_KEY` and `NVIDIA_API_KEY` (`Llama-3.3-70b-instruct`).

### Local Deployment
1. **Initialize Neuro-Backend (FastAPI)**:
   ```bash
   cd backend
   pip install -r requirements.txt
   python main.py
   ```
2. **Launch Empire Dashboard (Next.js)**:
   ```bash
   npm install
   npm run dev
   ```

### Day of Presentation
1. Ensure both the backend (Port 8000) and frontend (Port 3000) are running.
2. Open `DEMO_PLAYBOOK.md`.
3. Copy the exact prompts into the respective agent tabs to perfectly demonstrate multi-jurisdictional AI intelligence.

---
**© 2026 MaCA Empire — A product of Imperio Neural.**
*Architected for InterConnect 26.0*
