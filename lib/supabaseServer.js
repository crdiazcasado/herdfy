import { createClient } from '@supabase/supabase-js'

// Este cliente bypasea RLS y solo debe usarse en server components / route handlers.
// NUNCA lo importes en componentes 'use client'.
export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)