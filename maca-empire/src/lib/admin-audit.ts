import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

type AdminAuditInput = {
  adminUserId: string;
  action: string;
  targetType?: string | null;
  targetId?: string | null;
  metadata?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
};

export async function logAdminAudit(input: AdminAuditInput): Promise<void> {
  const payload = {
    admin_user_id: input.adminUserId,
    action: input.action,
    target_type: input.targetType ?? null,
    target_id: input.targetId ?? null,
    metadata: input.metadata ?? {},
    ip_address: input.ipAddress ?? null,
    user_agent: input.userAgent ?? null,
  };

  const { error } = await supabase.from("admin_audit_logs").insert(payload);
  if (error) {
    console.error("admin_audit_log_failed", error.message);
  }
}
