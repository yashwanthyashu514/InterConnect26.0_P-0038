CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  queries_used INT DEFAULT 0,
  queries_limit INT DEFAULT 20,
  razorpay_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO user_profiles(id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();
