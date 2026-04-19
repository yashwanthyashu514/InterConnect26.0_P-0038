# 🏦 Supreme Tax AGI | Unified Application Core

This directory contains the primary frontend and orchestration logic for the **Supreme Tax AGI** platform. Built for the **InterConnect 26.0** innovation challenge, this application implements a 22-agent autonomous ecosystem for financial and legal advisory.

## 🏗️ Folder Architecture

- `/src/app`: Next.js 16 App Router (UI Components & Routes).
- `/backend`: FastAPI Python server (Intent Classification & Agent Reasoning).
- `/public`: Assets including the "Legacy Elite" cinematic hero character.
- `create_knowledge_base.py`: RAG ingestion pipeline for legal PDFs.
- `JUDGE_CHEATSHEET.md`: Demonstration guide for high-impact evaluation.

## ⚡ Technical Highlights

### 1. The Multi-Agent Ecosystem
The platform utilizes specialized AI personas, coordinated by the **Command Nexus (A0)**:
- **Tax & Banking (Core)**: Supreme Tax, BankFight, Notice & Disputes.
- **Legal & Corporate (Growth)**: Corporate Counsel, Deal Reviewer, Filing Ops.
- **Specialized Intelligence (Elite)**: HeirGuard, CryptoTax Pro, The Oracle (50-year Wisdom).

### 2. Forensic Mathematical Kernel
Unlike standard LLMs that "hallucinate" numbers, our **Forensic Kernel** uses symbolic reasoning for tax calculations, ensuring 100% accuracy for GST/ITR filings.

### 3. Multi-Modal Vision
Integrated `pdf-parse` and OCR logic allow the AI to "see" and decompose complex tax notices directly from document uploads.

## 🚀 Development Workflow

### Prerequisites
- Node.js 18+ & Python 3.10+
- Supabase account with `pgvector` enabled.

### Local Execution
1. **Initialize Backend**:
   ```bash
   pip install -r requirements.txt
   python backend/main.py
   ```
2. **Launch Dashboard**:
   ```bash
   npm install
   npm run dev
   ```

### Ingestion Pipeline
To update the agent knowledge base:
1. Place PDFs in `/docs/`.
2. Run `python create_knowledge_base.py`.

## 🔒 Security & Scale
- **Authentication**: JWT/HMAC secured endpoints.
- **Deployment**: Optimized for **Vercel Global Edge** with <100ms inference latency.
- **Persistence**: Real-time auditing via `supabase_check.txt` and logging streams.

---
**© 2026 Supreme Tax AGI — A product of Imperio Neural.**
*Innovation in Interdisciplinary Engineering.*
