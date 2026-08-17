import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { AccountProfile, AccountUsage } from '~/types/account-dashboard'

let accountClient: SupabaseClient | null = null

export const useAccountSession = () => {
  const config = useRuntimeConfig()
  const router = useRouter()
  const profile = useState<AccountProfile | null>('architecton-account-profile', () => null)
  const usage = useState<AccountUsage | null>('architecton-account-usage', () => null)
  const isLoading = useState('architecton-account-loading', () => false)
  const errorMessage = useState('architecton-account-error', () => '')

  const getClient = () => {
    if (accountClient) return accountClient
    const { supabaseUrl, supabasePublishableKey } = config.public
    if (!supabaseUrl || !supabasePublishableKey) {
      throw new Error('Architecton authentication is not configured.')
    }
    accountClient = createClient(supabaseUrl, supabasePublishableKey)
    return accountClient
  }

  const getSession = async () => {
    const { data, error } = await getClient().auth.getSession()
    if (error || !data.session) {
      await router.replace('/login')
      return null
    }
    return data.session
  }

  const loadAccount = async (force = false) => {
    if (isLoading.value || (profile.value && !force)) return
    isLoading.value = true
    errorMessage.value = ''

    try {
      const session = await getSession()
      if (!session) return

      const monthStart = new Date()
      monthStart.setUTCDate(1)
      monthStart.setUTCHours(0, 0, 0, 0)
      const nextMonth = new Date(monthStart)
      nextMonth.setUTCMonth(nextMonth.getUTCMonth() + 1)

      const [profileResult, usageResult] = await Promise.all([
        getClient()
          .from('users')
          .select('id, email, display_name, avatar_url, role, plan, monthly_token_limit, created_at')
          .eq('id', session.user.id)
          .single(),
        getClient()
          .from('user_monthly_usage')
          .select('request_count, prompt_tokens, completion_tokens, total_tokens')
          .eq('user_id', session.user.id)
          .gte('month', monthStart.toISOString())
          .lt('month', nextMonth.toISOString())
          .maybeSingle()
      ])

      if (profileResult.error || !profileResult.data) {
        throw new Error('Your Architecton account could not be loaded.')
      }
      if (usageResult.error) {
        throw new Error('Your monthly usage could not be loaded.')
      }

      profile.value = profileResult.data as AccountProfile
      usage.value = usageResult.data
        ? { ...usageResult.data } as AccountUsage
        : { request_count: 0, prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : 'Your account could not be loaded.'
    } finally {
      isLoading.value = false
    }
  }

  const updateDisplayName = async (displayName: string) => {
    const session = await getSession()
    if (!session) return false

    const normalizedName = displayName.trim()
    if (normalizedName.length < 2) throw new Error('Enter a name with at least 2 characters.')

    const { error } = await getClient()
      .from('users')
      .update({ display_name: normalizedName })
      .eq('id', session.user.id)

    if (error) throw error
    if (profile.value) profile.value = { ...profile.value, display_name: normalizedName }
    return true
  }

  const signOut = async () => {
    await getClient().auth.signOut()
    profile.value = null
    usage.value = null
    await router.replace('/login')
  }

  return { profile, usage, isLoading, errorMessage, loadAccount, updateDisplayName, signOut }
}
