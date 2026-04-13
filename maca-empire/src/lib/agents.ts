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
  // CORE BLOCK
  {
    id: "A1",
    name: "Supreme Tax",
    description: "Integrated Income Tax, GST & TDS intelligence with predictive optimization.",
    icon: "FileText",
    category: "CORE",
    path: "/tax",
  },
  {
    id: "A2",
    name: "Banking & Credit",
    description: "Dispute resolution for banking transactions and credit score restoration.",
    icon: "Landmark",
    category: "CORE",
    path: "/bankfight",
  },
  {
    id: "A3",
    name: "Notice & Disputes",
    description: "AI-powered notice reply drafting and legal risk simulation (Mock Judge).",
    icon: "Scale",
    category: "CORE",
    path: "/notice",
  },
  {
    id: "A4",
    name: "Payroll & HR",
    description: "Automated payroll compliance, ESOP management, and labor law advisor.",
    icon: "Users",
    category: "CORE",
    path: "/payroll",
  },

  // GROWTH BLOCK
  {
    id: "A5",
    name: "Corporate Counsel",
    description: "Startup legal, ROC compliance, and IP/Trademark protection.",
    icon: "Rocket",
    category: "GROWTH",
    path: "/compliance",
  },
  {
    id: "A6",
    name: "Voice CA",
    description: "Flagship multimodal AI — Talk to your personal CA in Hindi or English.",
    icon: "Mic",
    category: "GROWTH",
    path: "/voice",
  },
  {
    id: "A7",
    name: "Deal Reviewer",
    description: "Deep-link analysis for SPA, SHA, and high-stakes commercial contracts.",
    icon: "Search",
    category: "GROWTH",
    path: "/contract-reviewer",
  },
  {
    id: "A8",
    name: "Filing Ops",
    description: "E-court filing automation and professional RTI drafting.",
    icon: "Files",
    category: "GROWTH",
    path: "/court-filer",
  },

  // ELITE BLOCK
  {
    id: "A12",
    name: "Forensic Audit",
    description: "AI-driven investigative auditing for corporate fraud and leakage.",
    icon: "ShieldAlert",
    category: "ELITE",
    path: "/audit-shield",
  },
  {
    id: "A13",
    name: "Trade & Forex",
    description: "Cross-border FEMA compliance and EXIM logistics intelligence.",
    icon: "Globe",
    category: "ELITE",
    path: "/trade",
  },

  // EMPIRE BLOCK (Specialized High-Stakes)
  {
    id: "A23",
    name: "ESG Compass",
    description: "BRSR reporting, carbon credit tracking, and sustainability audits.",
    icon: "Leaf",
    category: "EMPIRE",
    path: "/esg-compass",
  },
  {
    id: "A24",
    name: "HeirGuard",
    description: "Personal succession planning, digital wills, and trust management.",
    icon: "ScrollText",
    category: "EMPIRE",
    path: "/heirguard",
  },
  {
    id: "A22",
    name: "CryptoTax Pro",
    description: "30% VDA tax calculation and 1% TDS monitoring with live meter.",
    icon: "Coins",
    category: "EMPIRE",
    path: "/crypto-tax",
  },
  {
    id: "A25",
    name: "Data & AI Safety",
    description: "DPDP Act compliance and EU AI Act Governance framework.",
    icon: "ShieldCheck",
    category: "EMPIRE",
    path: "/ai-governance",
  },
  {
    id: "A26",
    name: "The Oracle",
    description: "The Crown Jewel: 50-year market wisdom with Live Market Feeds.",
    icon: "TrendingUp",
    category: "EMPIRE",
    path: "/the-oracle",
  },
];
