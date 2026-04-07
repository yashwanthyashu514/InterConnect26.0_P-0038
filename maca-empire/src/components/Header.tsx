"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  return (
    <header style={{
      padding: "1.5rem 2rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: pathname === "/" ? "none" : "1px solid var(--border)",
      background: pathname === "/" ? "transparent" : "var(--background)",
      position: pathname === "/" ? "relative" : "sticky",
      top: 0,
      zIndex: 100,
      backdropFilter: pathname === "/" ? "none" : "blur(10px)",
    }}>
      <Link href="/" style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        textDecoration: "none",
        color: "var(--primary)",
        fontWeight: "900",
        fontSize: "1.2rem",
        letterSpacing: "-0.5px"
      }}>
        🏺 maCA Empire
      </Link>

      <nav style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <Link 
          href="/vault" 
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.5rem 1rem",
            borderRadius: "0.75rem",
            background: pathname === "/vault" ? "var(--primary)" : "var(--primary-glow)",
            color: pathname === "/vault" ? "white" : "var(--primary)",
            fontWeight: "800",
            fontSize: "0.85rem",
            textDecoration: "none",
            transition: "0.2s"
          }}
          onMouseOver={e => {
            if (pathname !== "/vault") e.currentTarget.style.filter = "brightness(1.1)";
          }}
          onMouseOut={e => {
            if (pathname !== "/vault") e.currentTarget.style.filter = "none";
          }}
        >
          🗄️ Document Vault
        </Link>
        <Link 
          href="/dashboard" 
          style={{
            fontSize: "0.85rem",
            fontWeight: "800",
            color: pathname === "/dashboard" ? "var(--primary)" : "var(--muted)",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "0.3rem"
          }}
        >
          📈 Dashboard
        </Link>
        <Link 
          href="/b2b" 
          style={{
            fontSize: "0.85rem",
            fontWeight: "800",
            color: pathname === "/b2b" ? "var(--primary)" : "var(--muted)",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "0.3rem"
          }}
        >
          💼 B2B Ops
        </Link>
        <Link 
          href="/" 
          style={{
            fontSize: "0.85rem",
            fontWeight: "800",
            color: pathname === "/" ? "var(--primary)" : "var(--muted)",
            textDecoration: "none"
          }}
        >
          🏺 Marketplace
        </Link>
      </nav>
    </header>
  );
}
