import { randomBytes } from 'node:crypto'
import { createError, defineEventHandler, readBody, setResponseHeader } from 'h3'
import { tokenHash } from '~~/server/utils/desktop-auth'
import { requireBearerToken } from '~~/server/utils/auth'
import { validateDesktopRequest } from '~~/server/utils/desktop-request'
import { createSupabaseAdminClient, createSupabaseAuthClient } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'no-store')
  const accessToken = requireBearerToken(event)
  const body = await readBody<Record<string, unknown>>(event)
  const request = validateDesktopRequest(body)

  const authClient = createSupabaseAuthClient(event)
  const { data: userData, error: userError } = await authClient.auth.getUser(accessToken)
  if (userError || !userData.user?.email) {
    throw createError({ statusCode: 401, statusMessage: 'The Supabase session is invalid or expired.' })
  }

  const admin = createSupabaseAdminClient(event)
  const code = randomBytes(32).toString('base64url')

  const { error: codeError } = await admin.from('desktop_auth_codes').insert({
    code_hash: tokenHash(code),
    user_id: userData.user.id,
    platform: request.platform,
    host_version: request.hostVersion,
    redirect_uri: request.redirectUri,
    expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString()
  })
  if (codeError) {
    throw createError({ statusCode: 500, statusMessage: 'The desktop authorization could not be created.' })
  }

  return { code }
})
