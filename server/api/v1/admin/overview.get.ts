import { createError, defineEventHandler, setResponseHeader } from 'h3'
import { requireAdmin } from '~~/server/utils/admin-auth'

interface CreatedUserRow {
  created_at: string
}

interface UsageRow {
  total_tokens: number
  created_at: string
}

interface PlatformRow {
  platform: string
  host_version: string
}

const monthKey = (date: Date) => date.toISOString().slice(0, 7)

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'no-store')
  const { adminClient, profile } = await requireAdmin(event)
  const now = new Date()
  const periodStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5, 1))

  const [
    userCountResult,
    adminCountResult,
    activeSessionsResult,
    createdUsersResult,
    usageResult,
    recentUsersResult
  ] = await Promise.all([
    adminClient.from('users').select('id', { count: 'exact', head: true }),
    adminClient.from('users').select('id', { count: 'exact', head: true }).eq('role', 'admin'),
    adminClient
      .from('desktop_sessions')
      .select('platform, host_version')
      .is('revoked_at', null)
      .gt('refresh_expires_at', now.toISOString()),
    adminClient.from('users').select('created_at').gte('created_at', periodStart.toISOString()),
    adminClient.from('usage_records').select('total_tokens, created_at'),
    adminClient
      .from('users')
      .select('id, email, display_name, created_at')
      .order('created_at', { ascending: false })
      .limit(5)
  ])

  const failed = [userCountResult, adminCountResult, activeSessionsResult, createdUsersResult, usageResult, recentUsersResult]
    .some(result => result.error)
  if (failed) {
    throw createError({ statusCode: 500, statusMessage: 'Dashboard overview could not be loaded.' })
  }

  const createdUsers = (createdUsersResult.data ?? []) as CreatedUserRow[]
  const usage = (usageResult.data ?? []) as UsageRow[]
  const sessions = (activeSessionsResult.data ?? []) as PlatformRow[]
  const activity = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(Date.UTC(periodStart.getUTCFullYear(), periodStart.getUTCMonth() + index, 1))
    const key = monthKey(date)
    return {
      month: key,
      label: new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' }).format(date),
      users: createdUsers.filter(row => row.created_at.startsWith(key)).length,
      tokens: usage
        .filter(row => row.created_at.startsWith(key))
        .reduce((sum, row) => sum + Number(row.total_tokens), 0)
    }
  })

  const platforms = Object.entries(sessions.reduce<Record<string, number>>((result, session) => {
    const platform = session.platform === 'revit' ? 'Revit' : 'Archicad'
    const label = `${platform} ${session.host_version}`
    result[label] = (result[label] ?? 0) + 1
    return result
  }, {}))
    .map(([label, sessionCount]) => ({ label, sessions: sessionCount }))
    .sort((left, right) => right.sessions - left.sessions)

  return {
    admin: profile,
    summary: {
      totalUsers: userCountResult.count ?? 0,
      totalAdmins: adminCountResult.count ?? 0,
      activeDesktopSessions: sessions.length,
      totalTokens: usage.reduce((sum, row) => sum + Number(row.total_tokens), 0),
      newUsersThisMonth: activity.at(-1)?.users ?? 0
    },
    activity,
    platforms,
    recentUsers: recentUsersResult.data ?? []
  }
})
