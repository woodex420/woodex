import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://vocqqajpznqyopjcymer.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvY3FxYWpwem5xeW9wamN5bWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3MTM5MTMsImV4cCI6MjA3NzI4OTkxM30.b2ncZs7ETkh5_I9p7QP0kgUchDO166y5jUG-Na5yuEM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
