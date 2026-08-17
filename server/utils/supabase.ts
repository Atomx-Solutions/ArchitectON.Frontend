import { createClient } from '@supabase/supabase-js'
import type { H3Event } from 'h3'
import { useRuntimeConfig } from '#imports'

const serverAuthOptions = {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  }
} as const

const required = (value: string, name: string) => {
  if (!value) throw new Error(`${name} is not configured.`)
  return value
}

export const createSupabaseAuthClient = (event: H3Event) => {
  const config = useRuntimeConfig(event)
  return createClient(
    required(config.public.supabaseUrl, 'Supabase URL'),
    required(config.public.supabasePublishableKey, 'Supabase publishable key'),
    serverAuthOptions
  )
}

export const createSupabaseAdminClient = (event: H3Event) => {
  const config = useRuntimeConfig(event)
  return createClient(
    required(config.public.supabaseUrl, 'Supabase URL'),
    required(config.supabaseSecretKey, 'Supabase secret key'),
    serverAuthOptions
  )
}
