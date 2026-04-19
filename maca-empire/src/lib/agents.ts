import { 
  FileText, Landmark, Scale, Rocket, Globe, 
  ShieldCheck, ShieldAlert, Cpu, Gavel, 
  Mic2, FileSearch, Coins, PieChart, Users,
  Gem, HeartHandshake, TrendingUp
} from "lucide-react";

export interface Agent {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "CORE" | "GROWTH" | "ELITE" | "EMPIRE";
  path: string;
}

export const AGENTS: Agent[] = [
  // TAX & BANKING (CORE) - 6 Agents
  { id: "A0", name: "Command Nexus", icon: "Cpu", description: "Master Orchestrator — intent routing, urgency triage, elite dispatch.", category: "CORE", path: "/command-nexus" },
  { id: "A1", name: "Supreme Tax", icon: "FileText", description: "Integrated Income Tax, GST & TDS intelligence.", category: "CORE", path: "/tax" },
  { id: "A2", name: "Banking & Credit", icon: "Landmark", description: "Dispute resolution and credit score restoration.", category: "CORE", path: "/bankfight" },
  { id: "A3", name: "Notice & Disputes", icon: "AlertTriangle", description: "Notice reply drafting and legal risk simulation.", category: "CORE", path: "/notice" },
  { id: "A4", name: "Payroll & HR", icon: "DollarSign", description: "Automated payroll and labor law compliance.", category: "CORE", path: "/payroll" },
  { id: "A6", name: "Voice CA", icon: "Mic", description: "Multimodal AI — Talk to your personal CA.", category: "CORE", path: "/voice" },

  // LEGAL & CORPORATE (GROWTH) - 6 Agents
  { id: "A5", name: "Corporate Counsel", icon: "Rocket", description: "Startup legal, ROC, and IP/Trademark protection.", category: "GROWTH", path: "/compliance" },
  { id: "A7", name: "Deal Reviewer", icon: "Search", description: "AI redlining for SHA/SPA and high-stakes contracts.", category: "GROWTH", path: "/contract-reviewer" },
  { id: "A8", name: "Filing Ops", icon: "Scale", description: "E-court filing automation and RTI drafting.", category: "GROWTH", path: "/court-filer" },
  { id: "A12", name: "Forensic Audit", icon: "Lock", description: "Investigative auditing for fraud and leakage.", category: "GROWTH", path: "/audit-shield" },
  { id: "A13", name: "Trade & Forex", icon: "Globe", description: "FEMA compliance and EXIM logistics intelligence.", category: "GROWTH", path: "/trade" },
  { id: "A25", name: "Data & AI Safety", icon: "Brain", description: "DPDP Act and EU AI Act Governance.", category: "GROWTH", path: "/ai-governance" },

  // SPECIALIZED INTELLIGENCE (ELITE) - 6 Agents
  { id: "A27", name: "Elite Wealth", icon: "Gem", description: "Crown Agent for ₹100Cr+ UHNWIs — shadow books & offshore SPV authority.", category: "ELITE", path: "/elite-wealth" },
  { id: "A23", name: "ESG Compass", icon: "Leaf", description: "SEBI BRSR Core Auto-fill and GHG Scope tracking.", category: "ELITE", path: "/esg-compass" },
  { id: "A24", name: "HeirGuard", icon: "ScrollText", description: "Will Drafting and Succession Planning.", category: "ELITE", path: "/heirguard" },
  { id: "A22", name: "CryptoTax Pro", icon: "Coins", description: "30% VDA Tax and live TDS monitoring.", category: "ELITE", path: "/crypto-tax" },
  { id: "A26", name: "The Oracle", icon: "TrendingUp", description: "50-Year Market Wisdom with Live Feeds.", category: "ELITE", path: "/the-oracle" },
  { id: "A28", name: "Victor Harlan", icon: "Banknote", description: "52-Year Wall Street MD — M&A, IPO, LBO & Capital Markets.", category: "ELITE", path: "/victor-harlan" },
];
