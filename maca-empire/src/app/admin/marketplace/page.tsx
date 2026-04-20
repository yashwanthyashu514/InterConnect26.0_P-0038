"use client";

import React, { useEffect, useState } from "react";
import { ShieldCheck, XCircle, CheckCircle, CreditCard, Users, TrendingUp, Filter, ExternalLink } from "lucide-react";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

const STATUS_COLORS: Record<string, string> = {
  requested: "#FBBF24", accepted: "#60A5FA", paid: "#34D399",
  completed: "#2DD4BF", declined: "#F87171", disputed: "#FB923C", refunded: "#A78BFA"
};

type Tab = "kyc" | "bookings" | "revenue";

type MarketplaceUser = { name?: string; email?: string; phone?: string };
type CAPending = {
  id: string;
  icai_registration_no?: string;
  listed_price_paise: number;
  specialties?: string[];
  marketplace_users?: MarketplaceUser;
};
type BookingRow = {
  id: string;
  status: string;
  amount_paise: number;
  commission_paise: number;
  created_at: string;
  marketplace_users?: MarketplaceUser;
  ca_profiles?: { marketplace_users?: MarketplaceUser };
};
type Revenue = {
  total_commission_paise: number;
  total_gmv_paise: number;
  total_transactions: number;
  pending_payouts?: Array<{
    id: string;
    ca_payout_paise: number;
    ca_profiles?: { bank_ifsc?: string; marketplace_users?: MarketplaceUser };
  }>;
};

export default function AdminMarketplace() {
  const [tab, setTab] = useState<Tab>("kyc");
  const [pending, setPending] = useState<CAPending[]>([]);
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [revenue, setRevenue] = useState<Revenue | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  const loadTab = async (t: Tab) => {
    setLoading(true);
    try {
      if (t === "kyc") {
        const res = await fetch(`${BACKEND}/api/marketplace/admin/ca-approvals`);
        const data: { pending?: CAPending[] } = await res.json();
        setPending(data.pending ?? []);
      } else if (t === "bookings") {
        const url = statusFilter
          ? `${BACKEND}/api/marketplace/admin/bookings?status_filter=${statusFilter}`
          : `${BACKEND}/api/marketplace/admin/bookings`;
        const res = await fetch(url);
        const data: { bookings?: BookingRow[] } = await res.json();
        setBookings(data.bookings ?? []);
      } else if (t === "revenue") {
        const res = await fetch(`${BACKEND}/api/marketplace/admin/revenue`);
        const data: Revenue = await res.json();
        setRevenue(data);
      }
    } catch (e: unknown) { 
      console.error("Marketplace Sync Error:", e);
      setPending([]); setBookings([]); // Clear on error
    }
    setLoading(false);
  };

  useEffect(() => {
     
    loadTab(tab);
  }, [tab, statusFilter]);

  const handleApprove = async (caId: string) => {
    try {
      const res = await fetch(`/api/admin/kyc/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile_id: caId, action: "approve" })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Approval Failed");
      loadTab("kyc");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      alert(`⚠️ KYC Approval Failed:\n${message}`);
    }
  };

  const handleReject = async (caId: string) => {
    try {
      const res = await fetch(`/api/admin/kyc/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile_id: caId, action: "reject" })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Rejection Failed");
      loadTab("kyc");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      alert(`⚠️ KYC Rejection Failed:\n${message}`);
    }
  };

  const handlePayout = async (bookingId: string) => {
    await fetch(`${BACKEND}/api/marketplace/admin/payouts/${bookingId}/process`, { method: "POST" });
    loadTab("revenue");
  };

  return (
    <div style={{ padding: "40px 48px" }}>
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "24px", color: "#fff", margin: "0 0 8px" }}>Marketplace Operations</h1>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)" }}>KYC approvals, booking oversight, and revenue management</p>
      </div>

      {/* Tab Switcher */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "32px", background: "rgba(255,255,255,0.03)", borderRadius: "12px", padding: "4px", width: "fit-content" }}>
        {([
          { id: "kyc", label: "KYC Queue", icon: <Users size={14} /> },
          { id: "bookings", label: "All Bookings", icon: <CreditCard size={14} /> },
          { id: "revenue", label: "Revenue & Payouts", icon: <TrendingUp size={14} /> }
        ] as { id: Tab; label: string; icon: React.ReactNode }[]).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "10px", fontSize: "13px", fontWeight: 700, cursor: "pointer", border: "none", transition: "all 0.2s",
            background: tab === t.id ? "#B5FF2E" : "transparent",
            color: tab === t.id ? "#000" : "rgba(255,255,255,0.5)"
          }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {loading && <p style={{ color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>Loading...</p>}

      {/* KYC TAB */}
      {!loading && tab === "kyc" && (
        <div>
          {pending.length === 0 ? (
            <div style={{ padding: "60px", textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: "20px", border: "0.5px dashed rgba(255,255,255,0.1)" }}>
              <ShieldCheck size={40} color="rgba(255,255,255,0.1)" style={{ marginBottom: "16px" }} />
              <p style={{ color: "rgba(255,255,255,0.3)" }}>No pending KYC applications.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {pending.map(ca => (
                <div key={ca.id} style={{ background: "rgba(255,255,255,0.02)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px", display: "grid", gridTemplateColumns: "1fr 200px 160px", alignItems: "center", gap: "20px" }}>
                  <div>
                    <p style={{ fontWeight: 800, fontSize: "16px", marginBottom: "4px" }}>{ca.marketplace_users?.name}</p>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "8px" }}>{ca.marketplace_users?.email} · {ca.marketplace_users?.phone}</p>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "10px", fontWeight: 800, padding: "3px 8px", borderRadius: "6px", background: "rgba(181,255,46,0.1)", color: "#B5FF2E" }}>ICAI: {ca.icai_registration_no}</span>
                      {ca.specialties?.map((s: string) => (
                        <span key={s} style={{ fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "6px", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)" }}>{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginBottom: "4px" }}>Listed Price</p>
                    <p style={{ fontSize: "18px", fontWeight: 800 }}>₹{ca.listed_price_paise / 100}</p>
                  </div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", fontWeight: 700 }}>
                    Auto ICAI verification enabled
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* BOOKINGS TAB */}
      {!loading && tab === "bookings" && (
        <div>
          <div style={{ display: "flex", gap: "6px", marginBottom: "20px" }}>
            {["", "requested", "accepted", "paid", "completed", "declined"].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)} style={{
                padding: "6px 14px", borderRadius: "100px", fontSize: "11px", fontWeight: 700, cursor: "pointer", border: "none",
                background: statusFilter === s ? "#B5FF2E" : "rgba(255,255,255,0.05)",
                color: statusFilter === s ? "#000" : "rgba(255,255,255,0.4)"
              }}>
                {s || "All"}
              </button>
            ))}
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>
                {["Booking ID", "User", "CA", "Amount", "Commission", "Status", "Date"].map(h => (
                  <th key={h} style={{ padding: "12px 10px", fontSize: "10px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "1px", textAlign: "left", fontWeight: 800 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id} style={{ borderBottom: "0.5px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding: "14px 10px", fontSize: "12px", fontFamily: "monospace", color: "rgba(255,255,255,0.5)" }}>{b.id?.slice(0, 8)}</td>
                  <td style={{ padding: "14px 10px", fontSize: "13px", fontWeight: 600 }}>{b.marketplace_users?.name || "—"}</td>
                  <td style={{ padding: "14px 10px", fontSize: "13px" }}>{b.ca_profiles?.marketplace_users?.name || "—"}</td>
                  <td style={{ padding: "14px 10px", fontSize: "13px", fontWeight: 700 }}>₹{b.amount_paise / 100}</td>
                  <td style={{ padding: "14px 10px", fontSize: "13px", color: "#B5FF2E" }}>₹{b.commission_paise / 100}</td>
                  <td style={{ padding: "14px 10px" }}>
                    <span style={{ fontSize: "10px", fontWeight: 800, padding: "4px 10px", borderRadius: "100px", background: `${STATUS_COLORS[b.status] || "#fff"}15`, color: STATUS_COLORS[b.status] || "#fff", textTransform: "uppercase" }}>{b.status}</span>
                  </td>
                  <td style={{ padding: "14px 10px", fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>{new Date(b.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {bookings.length === 0 && <p style={{ textAlign: "center", padding: "40px", color: "rgba(255,255,255,0.2)" }}>No bookings found.</p>}
        </div>
      )}

      {/* REVENUE TAB */}
      {!loading && tab === "revenue" && revenue && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "40px" }}>
            <div style={{ background: "rgba(181,255,46,0.04)", border: "1px solid rgba(181,255,46,0.15)", borderRadius: "20px", padding: "28px" }}>
              <p style={{ fontSize: "11px", color: "rgba(181,255,46,0.6)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Total Commission</p>
              <p style={{ fontSize: "36px", fontWeight: 800, color: "#B5FF2E" }}>₹{revenue.total_commission_paise / 100}</p>
            </div>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "0.5px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "28px" }}>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Total GMV</p>
              <p style={{ fontSize: "36px", fontWeight: 800 }}>₹{revenue.total_gmv_paise / 100}</p>
            </div>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "0.5px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "28px" }}>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Total Transactions</p>
              <p style={{ fontSize: "36px", fontWeight: 800 }}>{revenue.total_transactions}</p>
            </div>
          </div>

          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "16px", marginBottom: "20px" }}>Pending Payouts</h3>
          {revenue.pending_payouts?.length === 0 ? (
            <p style={{ color: "rgba(255,255,255,0.2)", fontStyle: "italic" }}>All payouts processed.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {revenue.pending_payouts?.map((p) => (
                <div key={p.id} style={{ display: "grid", gridTemplateColumns: "1fr 120px 120px 120px", alignItems: "center", padding: "20px 16px", background: "rgba(255,255,255,0.02)", border: "0.5px solid rgba(255,255,255,0.06)", borderRadius: "14px" }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: "14px" }}>{p.ca_profiles?.marketplace_users?.name || "CA"}</p>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>IFSC: {p.ca_profiles?.bank_ifsc || "N/A"}</p>
                  </div>
                  <p style={{ fontSize: "14px", fontWeight: 700 }}>₹{p.ca_payout_paise / 100}</p>
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>Ref: {p.id?.slice(0, 8)}</p>
                  <button onClick={() => handlePayout(p.id)} style={{ padding: "10px 16px", background: "#B5FF2E", color: "#000", border: "none", borderRadius: "10px", fontWeight: 800, fontSize: "12px", cursor: "pointer" }}>
                    Process Payout
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
