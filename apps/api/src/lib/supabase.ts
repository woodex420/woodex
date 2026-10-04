import { createClient } from '@supabase/supabase-js'
import { config } from '../config/index.js'

export const supabase = createClient(
  config.supabaseUrl,
  config.supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  },
)

export const getSupabaseServiceRole = () => {
  const serviceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || ''
  return createClient(config.supabaseUrl, serviceRoleKey)
}
