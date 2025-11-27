import { createClient } from '@supabase/supabase-js';

// Use environment variables so configuration can differ between local/staging/prod.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: true }
});

export const getSupabaseAnonKey = () => supabaseAnonKey;
