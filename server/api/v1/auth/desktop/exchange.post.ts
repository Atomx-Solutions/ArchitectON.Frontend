import { randomUUID } from 'node:crypto'
import { createError, defineEventHandler, readBody, setResponseHeader } from 'h3'
import { createDesktopTokenValues, tokenHash, tokenResponse } from '~~/server/utils/desktop-auth'
import { validateDesktopRequest } from '~~/server/utils/desktop-request'
import { createSupabaseAdminClient } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'no-store')
  const body = await readBody<Record<string, unknown>>(event)
  const request = validateDesktopRequest(body)
  const code = typeof body.code === 'string' ? body.code.trim() : ''
  if (code.length < 32 || code.length > 128) {
    throw createError({ statusCode: 400, statusMessage: 'The desktop authorization code is invalid.' })
  }

  const admin = createSupabaseAdminClient(event)
  const sessionId = randomUUID()
  const tokens = createDesktopTokenValues()
  const { data, error } = await admin.rpc('exchange_desktop_auth_code', {
    p_code_hash: tokenHash(code),
    p_redirect_uri: request.redirectUri,
    p_platform: request.platform,
    p_host_version: request.hostVersion,
    p_session_id: sessionId,
    p_access_token_hash: tokenHash(tokens.accessToken),
    p_refresh_token_hash: tokenHash(tokens.refreshToken),
    p_access_expires_at: tokens.accessExpiresAt,
    p_refresh_expires_at: tokens.refreshExpiresAt
  })
  const authorization = data?.[0]
  if (error || !authorization) {
    throw createError({ statusCode: 400, statusMessage: 'The desktop authorization code is invalid or expired.' })
  }

  const { data: account, error: accountError } = await admin
    .from('users')
    .select('email')
    .eq('id', authorization.authenticated_user_id)
    .single()
  if (accountError || !account?.email) {
    throw createError({ statusCode: 401, statusMessage: 'The Architecton account no longer exists.' })
  }

  return tokenResponse({
    sessionId,
    ...tokens,
    user: { id: authorization.authenticated_user_id, email: account.email }
  })
})
