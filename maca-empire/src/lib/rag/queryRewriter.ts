/**
 * RAG Query Rewriter
 * Expands tax and legal abbreviations before embedding to improve retrieval accuracy.
 * Fix: F2.1
 */

const ABBREVIATION_MAP: Record<string, string> = {
  "ITR": "Income Tax Return",
  "GST": "Goods and Services Tax",
  "FEMA": "Foreign Exchange Management Act",
  "TDS": "Tax Deducted at Source",
  "HUF": "Hindu Undivided Family",
  "DTAA": "Double Taxation Avoidance Agreement",
  "RERA": "Real Estate Regulatory Authority",
  "PAN": "Permanent Account Number",
  "TAN": "Tax Deduction and Collection Account Number",
  "LLP": "Limited Liability Partnership"
};

export async function rewriteQuery(query: string): Promise<string> {
  let rewritten = query;
  
  // Case-insensitive expansion
  for (const [abbr, full] of Object.entries(ABBREVIATION_MAP)) {
    const regex = new RegExp(`\\b${abbr}\\b`, "gi");
    rewritten = rewritten.replace(regex, full);
  }

  return rewritten;
}
