export const config = {
  apiPort: Number(process.env.API_PORT || 3001),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'woodex-dev-secret',
  supabaseUrl: process.env.VITE_SUPABASE_URL || '',
  supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY || '',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
  sendgridApiKey: process.env.SENDGRID_API_KEY || '',
  whatsappAccessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
}
