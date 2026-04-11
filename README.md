# 🏛️ maCA Empire: The Future of Indian Legal & Financial Intelligence

[![Production Ready](https://img.shields.io/badge/Status-Live%20&%20Production%20Ready-teal?style=for-the-badge&logo=rocket)](https://github.com/yashwanthyashu514/InterConnect26.0_P-0038)
[![Tech Stack](https://img.shields.io/badge/Stack-Next.js%20|%20FastAPI%20|%20Nvidia%20NIM-black?style=for-the-badge)](https://github.com/yashwanthyashu514/InterConnect26.0_P-0038)

**maCA Empire** is an elite, high-performance suite of 22 autonomous AI agents designed to replace expensive manual legal and financial jobs for 1.3 billion Indian citizens. Powered by a premium **RAG pipeline**, **NVIDIA NIM**, and **Supabase Vector**, it delivers institutional-grade intelligence for the price of a Netflix subscription.

---

## 🚀 The 7 Core Pillars (Phase 1)

| ID | Agent | Key Feature | Status |
|:---|:---|:---|:---|
| **A1** | **maCA Tax** | Live Penalty Clock (Rs. 50/day) & 11-Language RAG | ✅ LIVE |
| **A2** | **BankFight** | 30-Day RBI Deadline Timer & Nodal Officer Letters | ✅ LIVE |
| **A3** | **ComplianceBot** | CIN-to-Deadline Calendar (AOC-4, MGT-7A) | ✅ LIVE |
| **A4** | **PayrollPilot** | Indian Salary Gross-to-Net (TDS, PF, ESI) | ✅ LIVE |
| **A5** | **Voice CA** | Hindi/Multilingual WhatsApp Voice Note Query Shell | ✅ SHELL |
| **A6** | **Notice Fighter** | Instant IT & GST Notice drafting from PDF text | ✅ LIVE |
| **A7** | **Audit Shield** | GSTIN-based audit risk scoring & gauge | ✅ SHELL |

---

## 🛠️ Technical Masterpiece

### Frontend: The Apple-Style Experience
- **Framework**: Next.js 14/15 (App Router)
- **Language**: TypeScript
- **Styling**: Vanilla CSS (Premium Teal/Glassmorphic Design System)
- **Experience**: Cinematic section rhythm, smooth fluid animations, and high-tracking typography.

### Backend: The AGI Engine
- **Orchestrator**: FastAPI with Pydantic validation.
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

## 💰 Business Intelligence
- **Target ARR**: Rs. 14.5 Cr - Rs. 15 Cr (Conservative Year 1).
- **Base Plan**: Rs. 999/month (maCA Tax Bundle + Notice Fighter + Voice).
- **Tagline**: *Access the secret legal tools of the elite for the price of a coffee.*

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
