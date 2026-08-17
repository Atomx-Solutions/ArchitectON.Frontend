export interface AdminProfile {
  id: string
  email: string
  display_name: string | null
  role: 'admin'
}

export interface DashboardUser {
  id: string
  email: string
  display_name: string | null
  role: 'user' | 'admin'
  plan: string
  monthly_token_limit: number
  created_at: string
  totalTokens: number
  currentMonthTokens: number
  connectedVersions: string[]
  lastConnectedAt: string | null
}

export interface DashboardPagination {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface DashboardSummary {
  totalUsers: number
  totalAdmins: number
  activeDesktopSessions: number
}

export interface DashboardChartPoint {
  month: string
  label: string
  users: number
  tokens: number
}

export interface DashboardPlatform {
  label: string
  sessions: number
}

export interface DashboardRecentUser {
  id: string
  email: string
  display_name: string | null
  created_at: string
}

export interface DashboardOverviewResponse {
  admin: AdminProfile
  summary: DashboardSummary & {
    totalTokens: number
    newUsersThisMonth: number
  }
  activity: DashboardChartPoint[]
  platforms: DashboardPlatform[]
  recentUsers: DashboardRecentUser[]
}

export interface DashboardResponse {
  admin: AdminProfile
  users: DashboardUser[]
  pagination: DashboardPagination
  summary: DashboardSummary
}
