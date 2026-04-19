-- ================================================================
-- maCA Empire Marketplace — Core Database Schema
-- Version: 1.1 | Run in Supabase SQL Editor
-- ================================================================

-- 1. Unified User Table
CREATE TABLE IF NOT EXISTS marketplace_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'ca', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- 2. CA Profiles
CREATE TABLE IF NOT EXISTS ca_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES marketplace_users(id) ON DELETE CASCADE,
  icai_registration_no TEXT UNIQUE NOT NULL,
  specialties TEXT[],
  bio TEXT,
  listed_price_paise INTEGER NOT NULL DEFAULT 300000,
  profile_photo_url TEXT,
  kyc_document_url TEXT,
  kyc_status TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'approved', 'rejected')),
  is_available BOOLEAN DEFAULT true,
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_reviews INTEGER DEFAULT 0,
  bank_account_number_enc TEXT,
  bank_ifsc TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES marketplace_users(id),
  ca_id UUID REFERENCES ca_profiles(id),
  status TEXT DEFAULT 'requested' CHECK (status IN ('requested','accepted','declined','payment_pending','paid','completed','disputed','refunded')),
  amount_paise INTEGER NOT NULL,
  commission_paise INTEGER NOT NULL,
  ca_payout_paise INTEGER NOT NULL,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  payout_status TEXT DEFAULT 'pending' CHECK (payout_status IN ('pending','processed','failed')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- 4. Marketplace Notifications
CREATE TABLE IF NOT EXISTS marketplace_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID REFERENCES marketplace_users(id),
  type TEXT CHECK (type IN ('booking_request','ca_accepted','ca_declined','payment_confirmed','payout_processed')),
  booking_id UUID REFERENCES bookings(id),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES marketplace_users(id),
  ca_id UUID REFERENCES ca_profiles(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Developer Keys (External API Access)
CREATE TABLE IF NOT EXISTS developer_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES marketplace_users(id),
  key TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used TIMESTAMPTZ
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ca_specialties ON ca_profiles USING GIN (specialties);
CREATE INDEX IF NOT EXISTS idx_ca_kyc_status ON ca_profiles(kyc_status);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_ca_id ON bookings(ca_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON marketplace_notifications(recipient_id, is_read);

-- RLS (service_role bypass)
ALTER TABLE marketplace_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ca_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Allow service_role full access
DO $$
DECLARE
  tbl TEXT;
  tables TEXT[] := ARRAY['marketplace_users','ca_profiles','bookings','marketplace_notifications','reviews'];
BEGIN
  FOREACH tbl IN ARRAY tables LOOP
    EXECUTE format('DROP POLICY IF EXISTS "%s_service_only" ON %I;', tbl, tbl);
    EXECUTE format('CREATE POLICY "%s_service_only" ON %I FOR ALL TO service_role USING (true) WITH CHECK (true);', tbl, tbl);
  END LOOP;
END;
$$;

-- Seed a demo admin user (password: admin123)
INSERT INTO marketplace_users (name, email, password_hash, phone, role) VALUES
  ('Imperio Admin', 'admin@imperio.in', '$2b$12$LJ3m4ys4Fp2Kd7Q5Z5x5UOqg5v8Xr5Z5X5Z5X5Z5X5Z5X5Z5X5Z5X', '+919999999999', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Seed 3 demo approved CAs for immediate demo
INSERT INTO marketplace_users (name, email, password_hash, phone, role) VALUES
  ('CA Rajesh Sharma', 'rajesh@demo.in', '$2b$12$LJ3m4ys4Fp2Kd7Q5Z5x5UOqg5v8Xr5Z5X5Z5X5Z5X5Z5X5Z5X5Z5X', '+919800000001', 'ca'),
  ('CA Priya Mehta', 'priya@demo.in', '$2b$12$LJ3m4ys4Fp2Kd7Q5Z5x5UOqg5v8Xr5Z5X5Z5X5Z5X5Z5X5Z5X5Z5X', '+919800000002', 'ca'),
  ('CA Vikram Desai', 'vikram@demo.in', '$2b$12$LJ3m4ys4Fp2Kd7Q5Z5x5UOqg5v8Xr5Z5X5Z5X5Z5X5Z5X5Z5X5Z5X', '+919800000003', 'ca')
ON CONFLICT (email) DO NOTHING;

-- Link CA profiles (approved for demo)
INSERT INTO ca_profiles (user_id, icai_registration_no, specialties, bio, listed_price_paise, kyc_status, rating, total_reviews) VALUES
  ((SELECT id FROM marketplace_users WHERE email='rajesh@demo.in'), 'ICAI-MRN-045821', ARRAY['GST','ITR','Corporate Tax','DTAA'], 'Senior CA with 22 years experience in corporate tax structuring for HNI families. Former partner at Deloitte India. Specializes in cross-border DTAA optimization and family trust advisory.', 500000, 'approved', 4.8, 47),
  ((SELECT id FROM marketplace_users WHERE email='priya@demo.in'), 'ICAI-MRN-078432', ARRAY['Succession','Trusts','RERA','Company Law'], 'Specialist in succession planning and wealth transfer for ultra-HNW families. 15 years of experience in RERA compliance and family office structuring. SEBI registered investment advisor.', 750000, 'approved', 4.9, 31),
  ((SELECT id FROM marketplace_users WHERE email='vikram@demo.in'), 'ICAI-MRN-091567', ARRAY['Forensic Audit','FEMA','Crypto','GST'], 'Forensic audit specialist and FEMA compliance expert. Former investigation officer at SFIO. Now advises family offices on offshore structuring, VDA taxation, and anti-money laundering compliance.', 1000000, 'approved', 4.7, 23)
ON CONFLICT (icai_registration_no) DO NOTHING;

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

-- RLS
ALTER TABLE marketplace_chats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "chat_access" ON marketplace_chats FOR ALL USING (
  EXISTS (
    SELECT 1 FROM bookings b
    WHERE b.id = marketplace_chats.booking_id
    AND (b.user_id = auth.uid() OR b.ca_id = (SELECT id FROM ca_profiles WHERE user_id = auth.uid()))
  )
);

-- Indexes for CFO
CREATE INDEX IF NOT EXISTS idx_rev_created_at ON platform_revenue(created_at);

-- RLS
ALTER TABLE platform_revenue ENABLE ROW LEVEL SECURITY;
CREATE POLICY "platform_revenue_service_only" ON platform_revenue FOR ALL TO service_role USING (true) WITH CHECK (true);
