import { createError } from 'h3'
import type { H3Event } from 'h3'
import { requireBearerToken } from '~~/server/utils/auth'
import { createSupabaseAdminClient, createSupabaseAuthClient } from '~~/server/utils/supabase'

export const requireAdmin = async (event: H3Event) => {
  const accessToken = requireBearerToken(event)
  const authClient = createSupabaseAuthClient(event)
  const { data: authData, error: authError } = await authClient.auth.getUser(accessToken)

  if (authError || !authData.user) {
    throw createError({ statusCode: 401, statusMessage: 'Your session is invalid or expired.' })
  }

  const adminClient = createSupabaseAdminClient(event)
  const { data: profile, error: profileError } = await adminClient
    .from('users')
    .select('id, email, display_name, role')
    .eq('id', authData.user.id)
    .single()

  if (profileError || !profile) {
    throw createError({ statusCode: 401, statusMessage: 'Your Architecton account was not found.' })
  }
  if (profile.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Administrator access is required.' })
  }

  return { adminClient, profile }
}
