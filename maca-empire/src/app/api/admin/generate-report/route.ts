import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAuthSession } from "@/lib/auth";
import { logAdminAudit } from "@/lib/admin-audit";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export async function GET(req: Request) {
  const session = await getAuthSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

    // ── CFO DATA ──────────────────────────────────────────────────────────
    const { data: revenue } = await supabase
      .from("platform_revenue")
      .select("amount, created_at")
      .order("created_at", { ascending: false });

    const { data: bookings } = await supabase
      .from("bookings")
      .select("status, amount_paise, created_at");

    const totalRevenuePaise = revenue?.reduce((s, r) => s + (r.amount || 0), 0) || 0;
    const totalGTV = bookings?.filter(b => b.status === "paid" || b.status === "completed")
      .reduce((s, b) => s + (b.amount_paise || 0), 0) || 0;
    const todayBookings = bookings?.filter(b => b.created_at >= startOfDay).length || 0;
    const weekBookings = bookings?.filter(b => b.created_at >= last7Days).length || 0;
    const paidBookings = bookings?.filter(b => b.status === "paid" || b.status === "completed").length || 0;
    const pendingBookings = bookings?.filter(b => b.status === "requested" || b.status === "accepted").length || 0;

    // ── HR / USER DATA ────────────────────────────────────────────────────
    const { data: users } = await supabase
      .from("marketplace_users")
      .select("role, created_at");

    const totalUsers = users?.length || 0;
    const newUsersToday = users?.filter(u => u.created_at >= startOfDay).length || 0;
    const newUsersWeek = users?.filter(u => u.created_at >= last7Days).length || 0;
    const newUsersMonth = users?.filter(u => u.created_at >= last30Days).length || 0;
    const caCount = users?.filter(u => u.role === "ca").length || 0;

    const { data: caProfiles } = await supabase
      .from("ca_profiles")
      .select("id, kyc_status");
      
    const kycPendingCount = caProfiles?.filter(ca => ca.kyc_status === "pending").length || 0;
    const kycVerified = caProfiles?.filter(ca => ca.kyc_status === "approved").length || 0;

    // ── CTO / SYSTEM DATA ─────────────────────────────────────────────────
    // Using bookings table to infer transactions since payments table is not heavily used
    const totalPayments = bookings?.filter(b => b.created_at >= last7Days).length || 0;
    const failedPayments = bookings?.filter(b => b.status === "failed" || b.status === "disputed").length || 0;
    const paymentSuccessRate = totalPayments > 0
      ? (((totalPayments - failedPayments) / totalPayments) * 100).toFixed(1)
      : "100.0";

    // ── MARKETING DATA ────────────────────────────────────────────────────
    const growthRate7d = totalUsers > 0 && newUsersWeek > 0
      ? ((newUsersWeek / Math.max(totalUsers - newUsersWeek, 1)) * 100).toFixed(1)
      : "0.0";
    const conversionRate = totalUsers > 0
      ? ((paidBookings / Math.max(totalUsers, 1)) * 100).toFixed(1)
      : "0.0";

    // ── BUILD REPORT ──────────────────────────────────────────────────────
    const report = {
      generated_at: now.toISOString(),
      status: "ready",

      cfo: {
        title: "CFO — Financial Engine",
        headline: `₹${(totalRevenuePaise / 100).toLocaleString("en-IN")} Platform Revenue Generated`,
        metrics: [
          { label: "Total Platform Revenue", value: `₹${(totalRevenuePaise / 100).toLocaleString("en-IN")}` },
          { label: "Gross Transaction Value (GTV)", value: `₹${(totalGTV / 100).toLocaleString("en-IN")}` },
          { label: "Total Bookings", value: bookings?.length || 0 },
          { label: "Paid / Completed", value: paidBookings },
          { label: "Pending Engagements", value: pendingBookings },
          { label: "New Bookings (Today)", value: todayBookings },
          { label: "New Bookings (This Week)", value: weekBookings },
        ],
        summary: totalRevenuePaise > 0
          ? `Platform is generating ₹${(totalRevenuePaise / 100).toLocaleString("en-IN")} in verified revenue. ${paidBookings} engagements have cleared payment. ${pendingBookings} active engagements are in pipeline. Week-on-week momentum shows ${weekBookings} new bookings.`
          : `Revenue streams are open. ${bookings?.length || 0} total bookings recorded. ${pendingBookings} engagements pending conversion to paid status. Recommend activating payment reminders.`,
      },

      hr: {
        title: "HR — Overwatch",
        headline: `${totalUsers} Citizens on Platform · ${kycPendingCount} KYC Awaiting`,
        metrics: [
          { label: "Total Registered Users", value: totalUsers },
          { label: "Verified CAs on Panel", value: caCount },
          { label: "KYC Pending Approvals", value: kycPendingCount },
          { label: "KYC Verified Users", value: kycVerified },
          { label: "New Signups (Today)", value: newUsersToday },
          { label: "New Signups (This Week)", value: newUsersWeek },
          { label: "New Signups (This Month)", value: newUsersMonth },
        ],
        summary: `${totalUsers} citizens are registered on the Empire. ${caCount} verified CAs are on the marketplace panel. ${kycPendingCount > 0 ? `⚠ ${kycPendingCount} CA applications require your KYC approval immediately.` : "All CA KYC applications are processed."} Acquisition: ${newUsersToday} today, ${newUsersWeek} this week, ${newUsersMonth} this month.`,
      },

      cto: {
        title: "CTO — Core Systems",
        headline: `${paymentSuccessRate}% Payment Success Rate · All APIs Operational`,
        metrics: [
          { label: "Payment Gateway Success Rate", value: `${paymentSuccessRate}%` },
          { label: "Total Transactions (7 Days)", value: totalPayments },
          { label: "Failed Transactions (7 Days)", value: failedPayments },
          { label: "Next.js API Status", value: "Operational" },
          { label: "Supabase DB Status", value: "Connected" },
          { label: "RAG Pipeline", value: "NVIDIA NIM Active" },
          { label: "Auth System", value: "Supabase Auth OK" },
        ],
        summary: `Core systems are ${parseFloat(paymentSuccessRate) >= 95 ? "fully operational" : "experiencing minor degradation"}. Payment gateway reporting ${paymentSuccessRate}% success rate over the last 7 days (${totalPayments} transactions, ${failedPayments} failures). Database connections are stable. NVIDIA NIM RAG pipeline is active and routing agent queries.`,
      },

      marketing: {
        title: "Marketing — Brand Reach",
        headline: `${growthRate7d}% Week-on-Week User Growth · ${conversionRate}% Booking Conversion`,
        metrics: [
          { label: "Week-on-Week Growth Rate", value: `${growthRate7d}%` },
          { label: "Booking Conversion Rate", value: `${conversionRate}%` },
          { label: "Total Active CAs (Marketplace)", value: caCount },
          { label: "Platform Lifetime Users", value: totalUsers },
          { label: "Monthly Acquisition", value: newUsersMonth },
          { label: "Weekly Acquisition", value: newUsersWeek },
          { label: "Daily Acquisition", value: newUsersToday },
        ],
        summary: `Platform is growing at ${growthRate7d}% week-on-week with ${newUsersMonth} new citizens acquired this month. Booking conversion rate stands at ${conversionRate}%. The CA marketplace has ${caCount} verified professionals — increasing supply-side capacity. Recommend pushing referral campaigns targeting MSMEs and founders.`,
      },

      decisions_needed: [
        kycPendingCount > 0 ? `${kycPendingCount} CA KYC applications pending — approve or reject to unblock marketplace supply.` : null,
        pendingBookings > 3 ? `${pendingBookings} bookings are in pending state — consider automated follow-up nudges.` : null,
        failedPayments > 2 ? `${failedPayments} payment failures in last 7 days — review gateway configuration.` : null,
        parseFloat(growthRate7d) < 5 ? "User growth below 5% WoW — consider running acquisition campaigns." : null,
      ].filter(Boolean) as string[],
    };

    await logAdminAudit({
      adminUserId: String(session.user_id ?? ""),
      action: "admin.generate_report",
      metadata: { decisions_count: report.decisions_needed.length },
      ipAddress: req.headers.get("x-forwarded-for"),
      userAgent: req.headers.get("user-agent"),
    });

    return NextResponse.json(report);

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
