export interface AccountProfile {
  id: string
  email: string
  display_name: string | null
  avatar_url: string | null
  role: 'user' | 'admin'
  plan: 'free' | 'pro' | 'team' | 'enterprise'
  monthly_token_limit: number
  created_at: string
}

export interface AccountUsage {
  request_count: number
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
}
