import { createError, defineEventHandler, getQuery, setResponseHeader } from 'h3'
import { requireAdmin } from '~~/server/utils/admin-auth'

interface UserRow {
  id: string
  email: string
  display_name: string | null
  role: 'user' | 'admin'
  plan: string
  monthly_token_limit: number
  created_at: string
}

interface UsageRow {
  user_id: string
  month: string
  total_tokens: number
}

interface SessionRow {
  user_id: string
  platform: string
  host_version: string
  last_used_at: string | null
  created_at: string
}

const pageSize = 25

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'no-store')
  const { adminClient, profile } = await requireAdmin(event)
  const query = getQuery(event)
  const requestedPage = Number(query.page)
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1
  const rawSearch = typeof query.search === 'string' ? query.search.trim() : ''
  const search = rawSearch.replace(/[^\p{L}\p{N}@._+\-\s]/gu, '').slice(0, 100)
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let usersQuery = adminClient
    .from('users')
    .select('id, email, display_name, role, plan, monthly_token_limit, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (search) {
    usersQuery = usersQuery.or(`email.ilike.%${search}%,display_name.ilike.%${search}%`)
  }

  const { data: usersData, error: usersError, count } = await usersQuery
  if (usersError) {
    throw createError({ statusCode: 500, statusMessage: 'Dashboard users could not be loaded.' })
  }

  const users = (usersData ?? []) as UserRow[]
  const userIds = users.map(user => user.id)
  let usageRows: UsageRow[] = []
  let sessionRows: SessionRow[] = []

  if (userIds.length) {
    const [usageResult, sessionsResult] = await Promise.all([
      adminClient
        .from('user_monthly_usage')
        .select('user_id, month, total_tokens')
        .in('user_id', userIds),
      adminClient
        .from('desktop_sessions')
        .select('user_id, platform, host_version, last_used_at, created_at')
        .in('user_id', userIds)
        .is('revoked_at', null)
    ])

    if (usageResult.error || sessionsResult.error) {
      throw createError({ statusCode: 500, statusMessage: 'Dashboard usage data could not be loaded.' })
    }

    usageRows = (usageResult.data ?? []) as UsageRow[]
    sessionRows = (sessionsResult.data ?? []) as SessionRow[]
  }

  const [userCountResult, adminCountResult, activeSessionCountResult] = await Promise.all([
    adminClient.from('users').select('id', { count: 'exact', head: true }),
    adminClient.from('users').select('id', { count: 'exact', head: true }).eq('role', 'admin'),
    adminClient
      .from('desktop_sessions')
      .select('id', { count: 'exact', head: true })
      .is('revoked_at', null)
      .gt('refresh_expires_at', new Date().toISOString())
  ])

  if (userCountResult.error || adminCountResult.error || activeSessionCountResult.error) {
    throw createError({ statusCode: 500, statusMessage: 'Dashboard summary could not be loaded.' })
  }

  const currentMonth = new Date().toISOString().slice(0, 7)
  const responseUsers = users.map((user) => {
    const userUsage = usageRows.filter(row => row.user_id === user.id)
    const userSessions = sessionRows.filter(row => row.user_id === user.id)
    const versions = [...new Set(userSessions.map(session =>
      `${session.platform === 'revit' ? 'Revit' : 'Archicad'} ${session.host_version}`))]
    const lastConnectedAt = userSessions
      .map(session => session.last_used_at ?? session.created_at)
      .sort((left, right) => Date.parse(right) - Date.parse(left))[0] ?? null

    return {
      ...user,
      totalTokens: userUsage.reduce((sum, row) => sum + Number(row.total_tokens), 0),
      currentMonthTokens: userUsage
        .filter(row => row.month.startsWith(currentMonth))
        .reduce((sum, row) => sum + Number(row.total_tokens), 0),
      connectedVersions: versions,
      lastConnectedAt
    }
  })

  return {
    admin: profile,
    users: responseUsers,
    pagination: {
      page,
      pageSize,
      total: count ?? 0,
      totalPages: Math.max(1, Math.ceil((count ?? 0) / pageSize))
    },
    summary: {
      totalUsers: userCountResult.count ?? 0,
      totalAdmins: adminCountResult.count ?? 0,
      activeDesktopSessions: activeSessionCountResult.count ?? 0
    }
  }
})
