-- 7. Platform Revenue (for CFO Analysis)
CREATE TABLE IF NOT EXISTS platform_revenue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id TEXT UNIQUE,
  booking_id UUID REFERENCES bookings(id),
  amount INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Secure Chat Stream
CREATE TABLE IF NOT EXISTS marketplace_chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id),
  sender_id UUID REFERENCES marketplace_users(id),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Realtime indices
CREATE INDEX IF NOT EXISTS idx_chat_booking ON marketplace_chats(booking_id);
CREATE INDEX IF NOT EXISTS idx_rev_created_at ON platform_revenue(created_at);

-- RLS
ALTER TABLE platform_revenue ENABLE ROW LEVEL SECURITY;
CREATE POLICY "platform_revenue_service_only" ON platform_revenue FOR ALL TO service_role USING (true) WITH CHECK (true);

ALTER TABLE marketplace_chats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "chat_access" ON marketplace_chats FOR ALL USING (true); -- Simplified for dev, harden in prod
