# 🏛️ maCA Empire: Autonomous Legal & Financial AI Ecosystem

**Submission for InterConnect 26.0 (Department of Computer Science & Engineering, GMIT)**
*Real-world problem solving through interdisciplinary AI integration.*

---

## 📌 1. About the Project
**maCA Empire** is a 22-agent autonomous ecosystem designed to democratize access to elite-level financial, tax, and legal advisory services. Through specialized AI personas (e.g., CryptoTax Pro, DPDP Shield, BankFight), the platform acts as a digital "Big 4 Senior Partner," providing zero-latency, highly accurate guidance on complex regulations, penalty avoidance, and compliance tracking. It directly solves the real-world problem of specialized legal services being inaccessible and unaffordable for the average citizen.

## 🎯 2. How it Fits the InterConnect 26.0 Objectives
* **Innovation & Creativity (25%)**: Moves beyond generic chatbots by using specialized RAG (Retrieval-Augmented Generation), intent classification, and hard-wired agent personas. It integrates real-time web-sockets for live financial data (e.g., Live Crypto Tax Meter).
* **Technical Implementation (25%)**: Built on a modern, high-performance stack. Utilizes Next.js 14 App Router for a lightning-fast responsive UI, paired with a FastAPI + AsyncOpenAI (NVIDIA NIM serverless) backend. The system leverages Supabase `pgvector` for localized, distinct vector embeddings.
* **UI / UX & Design (20%)**: Designed with an ultra-premium "cinematic" aesthetic featuring dynamic dark-mode interfaces, glassmorphism, instant stream-decoding for real-time text generation, and one-click interaction 'Prompt Pills'.
* **Impact & Feasibility (20%)**: Automates highly complex administrative clerical work, compliance checks, and legal drafting. Fully viable for modern interdisciplinary deployment bridging AI engineering and actual domain expertise.

---

## 🏗️ 3. Architecture & Technical Stack

### Frontend (Client)
* **Framework**: Next.js 14 (React) with App Router
* **Styling**: Contextual Dark Mode UI, Modular CSS, Glass-UI Sidebars
* **Communication**: Native SSE (Server-Sent Events) for real-time streaming, WebSockets for live meters

### Backend (Orchestration & Reasoning)
* **Framework**: FastAPI (Python) running on Uvicorn
* **AI Brain**: `meta/llama-3.3-70b-instruct` powered by NVIDIA NIM for sub-second inferencing
* **Routing**: Custom Intent Classifier for dynamic RAG pathway selection

### Database (Memory & Knowledge)
* **Platform**: Supabase
* **Vector DB**: `pgvector` extension for semantic search over specialized legal documents (DPDP Act 2023, Section 115BBH, RBI Circulars)
* **Embedding Model**: `nvidia/nv-embed-v1` (4096-dimensional high accuracy embeddings)

---

## ⚙️ 4. Local Setup & Execution

### Prerequisites
* Node.js (v18+)
* Python (3.10+)
* PostgreSQL / Supabase account

### Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/yashwanthyashu514/InterConnect26.0_P-0038.git
   cd InterConnect26.0_P-0038/maca-empire
   ```

2. **Backend Setup**
   ```bash
   pip install -r backend/requirements.txt
   # Start the AGI Orchestrator
   python backend/main.py
   ```

3. **Frontend Setup**
   ```bash
   npm install
   # Start the Client Dashboard (Runs on localhost:3000)
   npm run dev
   ```

---

*Built with passion for InterConnect 26.0 by Team maCA. Code and content developed between 1 Apr – 18 Apr 2026.*
