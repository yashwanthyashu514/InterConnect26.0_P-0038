"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";

interface PenaltyClockProps {
  gstin?: string;
  dueDateStr?: string; // "YYYY-MM-DD" — default Apr 11 2026
}

export default function PenaltyClock({ gstin, dueDateStr = "2026-04-11" }: PenaltyClockProps) {
  const daysOverdue = useMemo(() => {
    const dueDate = new Date(dueDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    const msOverdue = today.getTime() - dueDate.getTime();
    return msOverdue > 0 ? Math.ceil(msOverdue / 86400000) : 0;
  }, [dueDateStr]);

  const basePenalty = useMemo(() => daysOverdue * 50, [daysOverdue]); // Rs. 50/day per Section 47 CGST Act

  const [accrued, setAccrued] = useState(basePenalty);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAccrued(basePenalty);

    // Tick every second: Rs.50/day = Rs.0.000578/second
    intervalRef.current = setInterval(() => {
      setAccrued(prev => parseFloat((prev + 0.000578).toFixed(4)));
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [basePenalty]); // only re-run if the due date-derived baseline changes

  const color = daysOverdue === 0 ? "#16a34a" : daysOverdue <= 10 ? "#f59e0b" : "#dc2626";

  return (
    <div style={{
      background: "var(--secondary)",
      padding: "1.25rem",
      borderRadius: "var(--radius)",
      border: `2px solid ${color}`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "0.4rem",
      boxShadow: `0 0 20px ${color}22`
    }}>
      <div style={{ fontSize: "0.7rem", textTransform: "uppercase", fontWeight: "700", color: "var(--muted)" }}>
        ⏰ ACCRUED PENALTY — Sec. 47 CGST Act
      </div>
      <div style={{ fontSize: "2.2rem", fontWeight: "900", color, fontFamily: "monospace", letterSpacing: "-1px" }}>
        ₹ {accrued.toFixed(2)}
      </div>
      <div style={{ fontSize: "0.75rem", fontWeight: "700", color }}>
        {daysOverdue > 0 ? `${daysOverdue} Days Overdue` : "Filing On Time ✓"}
      </div>
      <div style={{ fontSize: "0.6rem", color: "var(--muted)" }}>
        GSTIN: {gstin || "N/A"} · ₹50/day ticking live
      </div>
    </div>
  );
}
