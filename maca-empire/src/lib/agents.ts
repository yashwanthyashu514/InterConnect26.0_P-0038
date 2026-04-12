export interface Agent {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: "CORE" | "GROWTH" | "EMPIRE";
  status: "LIVE" | "BETA" | "DEV";
  href: string;
}

export const agents: Agent[] = [
  // A-Series: The Core 8
  { id: "A1", name: "maCA Tax", icon: "⚖️", description: "GST, IT, TDS. Penalty clock + GSTR-1 draft.", category: "CORE", status: "LIVE", href: "/tax" },
  { id: "A2", name: "BankFight", icon: "⚔️", description: "RB-IOS 2026. Automated nodal officer letters.", category: "CORE", status: "LIVE", href: "/bankfight" },
  { id: "A3", name: "ComplianceBot", icon: "🏢", description: "GIN → Deadline calendar. AOC-4 automation.", category: "CORE", status: "LIVE", href: "/compliance" },
  { id: "A4", name: "PayrollPilot", icon: "💸", description: "TDS, PF, ESI. One-tap payslip PDFs.", category: "CORE", status: "LIVE", href: "/payroll" },
  { id: "A5", name: "Voice CA", icon: "🗣️", description: "Hindi/English voice LAW interaction.", category: "CORE", status: "LIVE", href: "/voice" },
  { id: "A6", name: "Notice Fighter", icon: "🏰", description: "Upload IT/GST notice PDF → Cited reply.", category: "CORE", status: "LIVE", href: "/notice" },
  { id: "A7", name: "Audit Shield", icon: "🛡️", description: "GSTIN audit risk score and fix logic.", category: "CORE", status: "LIVE", href: "/audit-shield" },
  { id: "A8", name: "Court Filer", icon: "🏛️", description: "Bank→RBI→Court escalation petitions.", category: "CORE", status: "LIVE", href: "/court-filer" },
  
  // B-Series: The Growth 8
  { id: "B1", name: "Startup Legal", icon: "🚀", description: "Term sheet analysis & FEMA/DPIIT compliance.", category: "GROWTH", status: "LIVE", href: "/startup-legal" },
  { id: "B2", name: "RERA Agent", icon: "🏗️", description: "Builder delay compensation & RERA Section 18.", category: "GROWTH", status: "LIVE", href: "/rera" },
  { id: "B3", name: "Labour Law", icon: "💼", description: "Worker rights, PF disputes, wrongful termination.", category: "GROWTH", status: "LIVE", href: "/labour-law" },
  { id: "B4", name: "Insurance Fighter", icon: "🛡️", description: "Rejection reversal & IRDAI complaint drafting.", category: "GROWTH", status: "LIVE", href: "/insurance-fighter" },
  { id: "B5", name: "Credit Fixer", icon: "💳", description: "CIBIL dispute letters & CIC Act accuracy.", category: "GROWTH", status: "LIVE", href: "/credit-fixer" },
  { id: "B6", name: "Trade Agent", icon: "🚢", description: "Customs duty calc & Export RoDTEP rebates.", category: "GROWTH", status: "LIVE", href: "/trade" },
  { id: "B7", name: "RTI Agent", icon: "📄", description: "Automated RTI application drafting (Act 2005).", category: "GROWTH", status: "LIVE", href: "/rti" },
  { id: "B8", name: "Pension Agent", icon: "👵", description: "Gratuity formula & EPS-95 pension disputes.", category: "GROWTH", status: "LIVE", href: "/pension" },

  { id: "A21", name: "DPDP Shield", icon: "🛡️", description: "DPDP Act 2023 Compliance, Gap Analysis & Audit.", category: "EMPIRE", status: "LIVE", href: "/dpdp" },
  { id: "A22", name: "CryptoTax Pro", icon: "🪙", description: "30% VDA Tax Calculator & Schedule VDA ITR Filing.", category: "EMPIRE", status: "LIVE", href: "/crypto-tax" },
  { id: "A23", name: "ESG Compass", icon: "🍃", description: "SEBI BRSR Core Auto-fill, GHG Scope & EU CBAM.", category: "EMPIRE", status: "LIVE", href: "/esg-compass" },
  { id: "A24", name: "HeirGuard", icon: "📜", description: "Will Drafting, Succession Advisory & Assets.", category: "EMPIRE", status: "LIVE", href: "/heirguard" },

  // C-Series: The Empire Suite (Phase 4)
  { id: "C1", name: "AI Judge", icon: "⚖️", description: "Predict win probability using Supreme Court precedents.", category: "EMPIRE", status: "LIVE", href: "/ai-judge" },
  { id: "C2", name: "Contract Reviewer", icon: "📄", description: "Upload contract → Red flag detection in 30s.", category: "EMPIRE", status: "LIVE", href: "/contract-reviewer" },
  { id: "C3", name: "B2B Legal Ops", icon: "💼", description: "Full legal department for SMEs. One-tap dashboard.", category: "EMPIRE", status: "LIVE", href: "/b2b" },
  { id: "C4", name: "maCA API", icon: "⚡", description: "Embed legal AI into fintech with 5 lines of code.", category: "EMPIRE", status: "LIVE", href: "/api-portal" },
  { id: "C5", name: "NRI Agent", icon: "🌍", description: "Cross-border Tax & FEMA compliance for 32M NRIs.", category: "EMPIRE", status: "LIVE", href: "/nri" }
];
