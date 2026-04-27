import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Initialize client with custom config to prevent redundant auth fetch errors
// We disable persistence and auto-refresh to stop background AuthRetryableFetchErrors,
// but keep detectSessionInUrl: true to handle password reset links properly.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: true
  }
});
