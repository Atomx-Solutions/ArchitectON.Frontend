import { createError, defineEventHandler, readBody, setResponseHeader } from 'h3'
import { createDesktopTokenValues, tokenHash, tokenResponse } from '~~/server/utils/desktop-auth'
import { createSupabaseAdminClient } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'no-store')
  const body = await readBody<Record<string, unknown>>(event)
  const refreshToken = typeof body.refreshToken === 'string' ? body.refreshToken.trim() : ''
  if (refreshToken.length < 32 || refreshToken.length > 128) {
    throw createError({ statusCode: 401, statusMessage: 'The desktop refresh token is invalid.' })
  }

  const nextTokens = createDesktopTokenValues()
  const admin = createSupabaseAdminClient(event)
  const { data, error } = await admin.rpc('rotate_desktop_session', {
    p_refresh_token_hash: tokenHash(refreshToken),
    p_new_access_token_hash: tokenHash(nextTokens.accessToken),
    p_new_refresh_token_hash: tokenHash(nextTokens.refreshToken),
    p_access_expires_at: nextTokens.accessExpiresAt,
    p_refresh_expires_at: nextTokens.refreshExpiresAt
  })
  const session = data?.[0]
  if (error || !session) {
    throw createError({ statusCode: 401, statusMessage: 'The desktop refresh token is invalid or expired.' })
  }

  const { data: account, error: accountError } = await admin
    .from('users')
    .select('email')
    .eq('id', session.user_id)
    .single()
  if (accountError || !account?.email) {
    throw createError({ statusCode: 401, statusMessage: 'The Architecton account no longer exists.' })
  }

  return tokenResponse({
    sessionId: session.session_id,
    ...nextTokens,
    user: { id: session.user_id, email: account.email }
  })
})
