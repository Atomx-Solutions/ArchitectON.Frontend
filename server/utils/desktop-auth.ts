import { createHash, randomBytes } from 'node:crypto'

const accessLifetimeSeconds = 15 * 60
const refreshLifetimeSeconds = 30 * 24 * 60 * 60

export interface DesktopTokenPayload {
  sessionId: string
  accessToken: string
  refreshToken: string
  accessExpiresAt: string
  refreshExpiresAt: string
  user: {
    id: string
    email: string
  }
}

export const createDesktopTokenValues = () => {
  const now = Date.now()
  return {
    accessToken: randomBytes(32).toString('base64url'),
    refreshToken: randomBytes(32).toString('base64url'),
    accessExpiresAt: new Date(now + accessLifetimeSeconds * 1000).toISOString(),
    refreshExpiresAt: new Date(now + refreshLifetimeSeconds * 1000).toISOString()
  }
}

export const tokenHash = (value: string) => createHash('sha256').update(value).digest('hex')

export const tokenResponse = (payload: DesktopTokenPayload) => ({
  accessToken: payload.accessToken,
  refreshToken: payload.refreshToken,
  expiresIn: Math.max(1, Math.floor((Date.parse(payload.accessExpiresAt) - Date.now()) / 1000)),
  user: payload.user
})
