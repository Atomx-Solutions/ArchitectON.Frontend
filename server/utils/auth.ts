import { createError, getHeader } from 'h3'
import type { H3Event } from 'h3'

export const requireBearerToken = (event: H3Event) => {
  const header = getHeader(event, 'authorization')
  if (!header?.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, statusMessage: 'A valid Supabase session is required.' })
  }

  const token = header.slice('Bearer '.length).trim()
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'A valid Supabase session is required.' })
  }

  return token
}
