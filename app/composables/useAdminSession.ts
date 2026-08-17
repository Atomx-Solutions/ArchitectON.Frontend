import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { AdminProfile } from '~/types/admin-dashboard'

let browserClient: SupabaseClient | null = null

export const useAdminSession = () => {
  const config = useRuntimeConfig()
  const router = useRouter()
  const admin = useState<AdminProfile | null>('architecton-admin-profile', () => null)

  const getClient = () => {
    if (browserClient) return browserClient
    const { supabaseUrl, supabasePublishableKey } = config.public
    if (!supabaseUrl || !supabasePublishableKey) {
      throw new Error('Architecton authentication is not configured.')
    }
    browserClient = createClient(supabaseUrl, supabasePublishableKey)
    return browserClient
  }

  const getAccessToken = async () => {
    const { data, error } = await getClient().auth.getSession()
    if (error || !data.session) {
      await router.replace('/login')
      return null
    }
    return data.session.access_token
  }

  const handleAdminError = async (error: unknown, fallback: string) => {
    const statusCode = typeof error === 'object' && error && 'statusCode' in error
      ? Number(error.statusCode)
      : 0

    if (statusCode === 401 || statusCode === 403) {
      await router.replace('/login')
      return ''
    }

    return error instanceof Error ? error.message : fallback
  }

  const signOut = async () => {
    await getClient().auth.signOut()
    admin.value = null
    await router.replace('/login')
  }

  return { admin, getAccessToken, handleAdminError, signOut }
}
