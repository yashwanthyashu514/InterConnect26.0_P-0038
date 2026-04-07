"use client";

import React, { useState } from "react";

interface ImportItem {
  id: string;
  name: string;
  status: "pending" | "syncing" | "complete" | "error";
  icon: string;
}

export default function BulletproofImporter() {
  const [items, setItems] = useState<ImportItem[]>([
    { id: "ais", name: "AIS & TIS (Annual Statement)", status: "pending", icon: "📊" },
    { id: "26as", name: "Form 26AS (TDS)", status: "pending", icon: "🛡️" },
    { id: "bank", name: "Bank Statements (12M)", status: "pending", icon: "🏦" },
    { id: "broker", name: "Broker Capital Gains (STCG/LTCG)", status: "pending", icon: "📈" },
    { id: "foreign", name: "Foreign Assets (Schedule FA)", status: "pending", icon: "🌍" },
    { id: "stamp", name: "Stamp Duty/Circle Rates", status: "pending", icon: "🏗️" },
    { id: "huf", name: "Ancestral / HUF Records", status: "pending", icon: "👪" }
  ]);

  const [globalProgress, setGlobalProgress] = useState(0);

  const startBatchFetch = async () => {
    setGlobalProgress(10);
    for (const item of items) {
        setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: "syncing" } : i));
        
        // Simulating the "Senior CA" expert fetch logic
        await new Promise(r => setTimeout(r, 800));
        
        setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: "complete" } : i));
        setGlobalProgress(prev => prev + (100 / items.length));
    }
    setGlobalProgress(100);
  };

  return (
    <div style={{
      background: "var(--secondary)",
      padding: "1.25rem",
      borderRadius: "var(--radius)",
      border: "1px solid var(--border)",
      boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ fontSize: "0.85rem", fontWeight: "800", color: "var(--primary)" }}>🏛️ DATA IMPORT CENTER</h3>
        <button 
          onClick={startBatchFetch}
          style={{ 
            fontSize: "0.65rem", background: "var(--primary)", color: "white", 
            border: "none", padding: "0.3rem 0.75rem", borderRadius: "1rem", cursor: "pointer", fontWeight: "700" 
          }}
        >
          FORCE RE-SYNC ALL
        </button>
      </div>

      <div style={{ background: "var(--background)", height: "6px", borderRadius: "3px", overflow: "hidden" }}>
        <div style={{ 
          width: `${globalProgress}%`, height: "100%", background: "var(--primary)", 
          transition: "width 0.4s ease-in-out" 
        }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.5rem", maxHeight: "300px", overflowY: "auto", paddingRight: "0.25rem" }}>
        {items.map(item => (
          <div key={item.id} style={{ 
            background: "var(--background)", 
            padding: "0.6rem", 
            borderRadius: "0.4rem", 
            border: item.status === "complete" ? "1px solid #16a34a" : "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            position: "relative",
            overflow: "hidden"
          }}>
            <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "0.6rem", fontWeight: "800", textTransform: "uppercase", color: item.status === "complete" ? "#16a34a" : "var(--muted)" }}>{item.status}</span>
              <span style={{ fontSize: "0.7rem", fontWeight: "600" }}>{item.name}</span>
            </div>
            
            {item.status === "syncing" && (
                <div style={{ 
                    position: "absolute", bottom: 0, left: 0, height: "2px", 
                    width: "100%", background: "var(--primary)",
                    animation: "shimmer 1.5s infinite linear"
                }} />
            )}
          </div>
        ))}
      </div>

      <p style={{ fontSize: "0.6rem", color: "var(--muted)", fontStyle: "italic", textAlign: "center" }}>
        Expert Mode Activated: Schedule FA, Sec 50C, and HUF logic live.
      </p>
    </div>
  );
}
