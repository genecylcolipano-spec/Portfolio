import { createClient } from '@supabase/supabase-js'

// Vite exposes env vars prefixed with VITE_ on import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Supabase URL and Anon Key are required. For local development, copy .env.example to .env.development.local, fill in the values, then restart the dev server. For a deployed build, set them in your host\'s environment variables.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseKey)
