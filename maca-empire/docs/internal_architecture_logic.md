# Imperio Neural — Internal AI Executive Team Architecture

This document explains the end-to-end logic of the internal executive team system built for Imperio Neural. This system enables the human CEO to manage the entire platform through a structured AI heirarchy.

---

## 1. The Database Layer (Supabase)
The database serves as the specialized memory and communication hub for the internal team. It comprises 14 core tables defined in `backend/internal_setup.sql`.

### Core Registries
*   **`clients`**: Stores the high-net-worth client database, their retainer tiers (₹25L, ₹75L, etc.), and payment status. This is the CFO's primary ground truth.
*   **`vendors` & `team_members`**: Tracks external service providers and future human hires, managed by the HR AI.

### Monitoring & Telemetry
*   **`api_usage_logs`**: Tracks daily API calls and token counts for NVIDIA NIM, CoinGecko, and Alpha Vantage.
*   **`agent_performance_logs`**: Monitors response times and error rates for all 17 customer-facing agents.
*   **`system_health_log`**: CTO AI records snapshots of backend uptime and DB latency here.

### Communication & Reporting
*   **`internal_messages`**: The "Message Bus" for Agent-to-Agent (A2A) communication.
*   **`daily_briefings`**: Stores the compiled multi-layer reports generated every morning.
*   **`alerts`**: A high-priority queue of critical issues requiring CEO intervention.

---

## 2. The Backend Layer (FastAPI)
The backend logic is centralized in `backend/main.py` and `backend/internal_agents.py`.

### Agent Personas (System Prompts)
Each agent has a strictly defined **Senior Executive persona**:
*   **CFO AI**: Direct report to CEO. Focuses on MRR, burn rate, and billing.
*   **CTO AI**: Technical lead. Focuses on system uptime and RAG pipeline health.
*   **HR AI**: Operations lead. Manages the quotas and output of Sales and Marketing.
*   **Marketing & Sales AI**: Specialist executors focused on brand strategy and lead qualification.

### A2A Messaging & Chain of Command
The system enforces a strict hierarchy through the `allowed_message_pairs` table:
1.  **Enforcement**: A message from `Sales AI` to `CEO` is blocked. It must go `Sales → HR → CTO → CFO → CEO`.
2.  **Message Types**: Agents can send `DIRECTIVE`, `REPORT`, `ALERT`, or `DECISION` requests.
3.  **Override**: Only the CEO has the `OVERRIDE` authority to message any agent directly.

### The 08:00 AM IST Briefing Engine
Powered by `APScheduler`, the system follows a 30-minute compilation sequence:
*   **07:30 IST**: Sales & Marketing write their performance summaries to the DB.
*   **07:40 IST**: HR reads the L4 logs and adds vendor/team status.
*   **07:50 IST**: CTO adds system health and infrastructure snapshots.
*   **08:00 IST**: CFO adds financial metrics (MRR/Burn) and marks the briefing **READY** for the CEO.

---

## 3. The Frontend Layer (Next.js)
The CEO interacts with the system through the `/admin` path (protected by middleware).

### CEO Command Centre (`/admin`)
*   **Dashboard**: A high-level view showing the current status of all 5 internal agents and the "Today's Briefing" summary.
*   **CFO Chat (`/admin/cfo`)**: The CEO's primary interface. It allows bidirectional communication with the CFO AI to query finances or issue directives.

### Specialist Views (Read-Only)
*   **Sales Pipeline**: A visual board of high-value prospects and their qualification stages.
*   **CTO Status**: A live telemetry dashboard showing backend health and API quota usage.
*   **Alert Queue**: A specialized inbox for critical issues (e.g., API quota breach or payment overdue).

### Auth Logic
The system uses an `ADMIN_SECRET_KEY` (default: `imperio-admin-2025`) stored in `.env`. The `middleware.ts` ensures that even the `/admin` path is invisible to standard customers, redirecting all unauthorized attempts to `/admin/login`.

---

## 4. End-to-End Data Flow Example

1.  **Trigger**: A customer queries the `/tax` agent.
2.  **Usage Logging**: `main.py` records the token usage and cost in `api_usage_logs`.
3.  **Quota Breach**: If usage hits 90%, the **CTO AI** detects it during a health check.
4.  **Escalation**: CTO AI writes an `ALERT` to `internal_messages` for the **CFO AI**.
5.  **CEO Action**: The CFO AI notifies the CEO via the **Alert Queue** in the Admin panel.
6.  **Decision**: The CEO talks to CFO AI to approve a budget increase, which is then cascaded back down the chain.
