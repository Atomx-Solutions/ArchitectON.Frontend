import { createError } from 'h3'

export interface DesktopRequest {
  platform: 'revit' | 'archicad'
  hostVersion: '2026' | '29'
  redirectUri: string
}

const supportedDesktopClients = {
  revit: '2026',
  archicad: '29'
} as const

export const validateDesktopRequest = (body: Record<string, unknown>): DesktopRequest => {
  const platform = body.platform
  const hostVersion = body.hostVersion
  if (platform !== 'revit' && platform !== 'archicad')
    throw createError({ statusCode: 400, statusMessage: 'Unsupported desktop client.' })

  const supportedHostVersion = supportedDesktopClients[platform]
  if (hostVersion !== supportedHostVersion)
    throw createError({ statusCode: 400, statusMessage: 'Unsupported desktop client.' })

  const redirectUri = typeof body.redirectUri === 'string' ? body.redirectUri : ''
  try {
    const callback = new URL(redirectUri)
    const port = Number(callback.port)
    if (callback.protocol !== 'http:'
      || callback.hostname !== '127.0.0.1'
      || callback.pathname !== '/callback/'
      || !Number.isInteger(port)
      || port < 1024
      || port > 65535
      || callback.username
      || callback.password
      || callback.search
      || callback.hash) {
      throw new Error('Untrusted callback')
    }
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Invalid desktop callback URI.' })
  }

  return { platform, hostVersion: supportedHostVersion, redirectUri }
}
