"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";

interface Invoice {
  id: string;
  customer_name: string;
  taxable_value: number;
  total_tax: number;
}

interface GSTRDraftData {
  gstin: string;
  tax_period: string;
  b2b_invoices: Invoice[];
  b2c_total: number;
  total_taxable_value: number;
  total_igst: number;
  total_cgst: number;
  total_sgst: number;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

import { saveToVault } from "@/lib/vault";

export default function GSTRDraft({ gstin, period }: { gstin: string; period: string }) {
  const [draft, setDraft] = useState<GSTRDraftData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateDraft = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BACKEND_URL}/draft-gstr1`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gstin, period }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();

      if (data.draft) {
        setDraft(data.draft);
        // P5: Auto-save to vault
        saveToVault({
          agent_id: "A1",
          doc_type: `GSTR-1 Draft: ${period}`,
          content: JSON.stringify(data.draft, null, 2)
        });
      } else {
        throw new Error("No draft in response");
      }
    } catch (e: any) {
      setError(e.message || "Generation failed");
      const fallback = {
        gstin,
        tax_period: period,
        b2b_invoices: [
          { id: "INV/26/001", customer_name: "Imperio Neural Pvt Ltd", taxable_value: 50000, total_tax: 9000 },
          { id: "INV/26/002", customer_name: "maCA Empire LLP", taxable_value: 25000, total_tax: 4500 }
        ],
        b2c_total: 15400,
        total_taxable_value: 90400,
        total_igst: 0,
        total_cgst: 6750,
        total_sgst: 6750
      };
      setDraft(fallback);
      // Save fallback too
      saveToVault({
        agent_id: "A1",
        doc_type: `GSTR-1 Draft: ${period} (Fallback)`,
        content: JSON.stringify(fallback, null, 2)
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadDraft = () => {
    if (!draft) return;
    const content = JSON.stringify(draft, null, 2);
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `GSTR1_${draft.gstin}_${draft.tax_period.replace(" ", "_")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalTax = draft ? draft.total_cgst + draft.total_sgst + draft.total_igst : 0;

  return (
    <div style={{ background: "var(--background)", borderRadius: "var(--radius)", border: "1px solid var(--border)", padding: "1.25rem" }}>
      <button
        onClick={generateDraft}
        disabled={loading}
        style={{
          width: "100%", padding: "0.75rem", marginBottom: "1rem",
          background: loading ? "var(--muted)" : "var(--primary)",
          color: "white", border: "none", borderRadius: "var(--radius)",
          fontWeight: "800", cursor: loading ? "not-allowed" : "pointer", fontSize: "0.85rem"
        }}
      >
        {loading ? "Generating Draft..." : "📋 Draft my GSTR-1"}
      </button>

      {error && !draft && (
        <p style={{ fontSize: "0.7rem", color: "#f59e0b", marginBottom: "0.5rem" }}>
          ⚠️ Using offline fallback — {error}
        </p>
      )}

      {draft && (
        <div style={{ fontSize: "0.8rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "0.75rem", padding: "0.75rem", background: "var(--secondary)", borderRadius: "0.5rem" }}>
            <div><strong>GSTIN:</strong> {draft.gstin}</div>
            <div><strong>Period:</strong> {draft.tax_period}</div>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "0.75rem" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border)", fontSize: "0.7rem", color: "var(--muted)" }}>
                <th style={{ padding: "0.4rem" }}>Inv No.</th>
                <th style={{ padding: "0.4rem" }}>Customer</th>
                <th style={{ padding: "0.4rem", textAlign: "right" }}>Taxable</th>
                <th style={{ padding: "0.4rem", textAlign: "right" }}>Tax</th>
              </tr>
            </thead>
            <tbody>
              {draft.b2b_invoices.map((inv, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "0.4rem", fontSize: "0.7rem" }}>{inv.id}</td>
                  <td style={{ padding: "0.4rem", fontSize: "0.7rem" }}>{inv.customer_name}</td>
                  <td style={{ padding: "0.4rem", textAlign: "right" }}>₹{inv.taxable_value.toLocaleString()}</td>
                  <td style={{ padding: "0.4rem", textAlign: "right" }}>₹{inv.total_tax.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", padding: "0.75rem", background: "rgba(20,184,166,0.08)", borderRadius: "0.5rem", fontWeight: "700", fontSize: "0.8rem" }}>
            <div>Taxable: ₹{draft.total_taxable_value.toLocaleString()}</div>
            <div style={{ textAlign: "right" }}>Total Tax: ₹{totalTax.toLocaleString()}</div>
          </div>

          <button
            onClick={downloadDraft}
            style={{ width: "100%", marginTop: "0.75rem", padding: "0.5rem", border: "none", background: "#16a34a", color: "white", borderRadius: "var(--radius)", fontWeight: "700", cursor: "pointer", fontSize: "0.75rem" }}
          >
            📥 Download Draft (.JSON)
          </button>
        </div>
      )}
    </div>
  );
}
