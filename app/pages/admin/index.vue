<script setup lang="ts">
import type { DashboardOverviewResponse } from '~/types/admin-dashboard'

definePageMeta({ layout: 'admin' })

const { admin, getAccessToken, handleAdminError } = useAdminSession()
const overview = ref<DashboardOverviewResponse | null>(null)
const isLoading = ref(true)
const errorMessage = ref('')
const chartMetric = ref<'users' | 'tokens'>('users')

useSeoMeta({
  title: 'Admin overview',
  description: 'Architecton administration overview.'
})

const numberFormatter = new Intl.NumberFormat('en-US')
const compactFormatter = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })
const dateFormatter = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

const summaryCards = computed(() => [
  {
    label: 'Total users',
    value: numberFormatter.format(overview.value?.summary.totalUsers ?? 0),
    icon: 'i-lucide-users',
    description: `${overview.value?.summary.newUsersThisMonth ?? 0} joined this month`
  },
  {
    label: 'AI tokens used',
    value: compactFormatter.format(overview.value?.summary.totalTokens ?? 0),
    icon: 'i-lucide-coins',
    description: 'Across all recorded requests'
  },
  {
    label: 'Active connections',
    value: numberFormatter.format(overview.value?.summary.activeDesktopSessions ?? 0),
    icon: 'i-lucide-monitor-up',
    description: 'Valid desktop sessions'
  },
  {
    label: 'Administrators',
    value: numberFormatter.format(overview.value?.summary.totalAdmins ?? 0),
    icon: 'i-lucide-shield-check',
    description: 'Accounts with full access'
  }
])

const totalPlatformSessions = computed(() => overview.value?.platforms
  .reduce((sum, platform) => sum + platform.sessions, 0) ?? 0)

const platformPercentage = (sessions: number) => totalPlatformSessions.value
  ? Math.round((sessions / totalPlatformSessions.value) * 100)
  : 0

const loadOverview = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const accessToken = await getAccessToken()
    if (!accessToken) return

    const response = await $fetch<DashboardOverviewResponse>('/api/v1/admin/overview', {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
    overview.value = response
    admin.value = response.admin
  } catch (error: unknown) {
    errorMessage.value = await handleAdminError(error, 'Dashboard overview could not be loaded.')
  } finally {
    isLoading.value = false
  }
}

onMounted(loadOverview)
</script>

<template>
  <div class="mx-auto w-full max-w-[1500px] space-y-6 p-4 sm:p-6 lg:p-8">
    <section class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="mb-2 text-xs font-semibold tracking-[0.14em] text-primary uppercase">Workspace</p>
        <h1 class="text-2xl font-semibold tracking-tight text-highlighted sm:text-3xl">Overview</h1>
        <p class="mt-2 max-w-2xl text-sm leading-6 text-muted">
          A clear view of your users, AI usage and connected Architecton integrations.
        </p>
      </div>
      <UButton
        label="Refresh"
        icon="i-lucide-refresh-cw"
        color="neutral"
        variant="outline"
        :loading="isLoading"
        @click="loadOverview"
      />
    </section>

    <UAlert
      v-if="errorMessage"
      color="error"
      variant="subtle"
      icon="i-lucide-circle-alert"
      title="Overview could not be loaded"
      :description="errorMessage"
    />

    <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <DashboardStatCard
        v-for="card in summaryCards"
        :key="card.label"
        v-bind="card"
        :loading="isLoading && !overview"
      />
    </section>

    <section class="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
      <UCard :ui="{ body: 'p-4 sm:p-6' }">
        <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="text-base font-semibold text-highlighted">Activity</h2>
            <p class="mt-1 text-sm text-muted">Performance over the last six months</p>
          </div>
          <div class="flex w-fit rounded-lg bg-elevated p-1">
            <UButton
              label="New users"
              size="xs"
              :color="chartMetric === 'users' ? 'primary' : 'neutral'"
              :variant="chartMetric === 'users' ? 'solid' : 'ghost'"
              @click="chartMetric = 'users'"
            />
            <UButton
              label="Tokens"
              size="xs"
              :color="chartMetric === 'tokens' ? 'primary' : 'neutral'"
              :variant="chartMetric === 'tokens' ? 'solid' : 'ghost'"
              @click="chartMetric = 'tokens'"
            />
          </div>
        </div>

        <USkeleton v-if="isLoading && !overview" class="h-64 w-full" />
        <DashboardActivityChart
          v-else
          :points="overview?.activity ?? []"
          :metric="chartMetric"
        />
      </UCard>

      <UCard :ui="{ body: 'p-5 sm:p-6' }">
        <div class="mb-6">
          <h2 class="text-base font-semibold text-highlighted">Connected platforms</h2>
          <p class="mt-1 text-sm text-muted">Active plugin sessions by version</p>
        </div>

        <div v-if="overview?.platforms.length" class="space-y-5">
          <div v-for="platform in overview.platforms" :key="platform.label">
            <div class="mb-2 flex items-center justify-between gap-3 text-sm">
              <div class="flex min-w-0 items-center gap-2.5">
                <span class="grid size-8 shrink-0 place-items-center rounded-lg bg-elevated text-muted">
                  <UIcon name="i-lucide-box" class="size-4" />
                </span>
                <span class="truncate font-medium text-highlighted">{{ platform.label }}</span>
              </div>
              <span class="tabular-nums text-muted">{{ platform.sessions }}</span>
            </div>
            <UProgress :model-value="platformPercentage(platform.sessions)" size="xs" />
          </div>
        </div>
        <div v-else-if="isLoading" class="space-y-5">
          <USkeleton v-for="index in 3" :key="index" class="h-10 w-full" />
        </div>
        <div v-else class="grid min-h-44 place-items-center text-center">
          <div>
            <UIcon name="i-lucide-monitor-off" class="mx-auto size-7 text-dimmed" />
            <p class="mt-3 text-sm font-medium text-highlighted">No active connections</p>
            <p class="mt-1 text-xs text-muted">Plugin sessions will appear here.</p>
          </div>
        </div>
      </UCard>
    </section>

    <UCard :ui="{ body: 'p-0 sm:p-0' }">
      <template #header>
        <div class="flex items-center justify-between gap-4">
          <div>
            <h2 class="text-base font-semibold text-highlighted">Recently joined</h2>
            <p class="mt-1 text-sm text-muted">The newest Architecton accounts</p>
          </div>
          <UButton to="/users" label="View all users" trailing-icon="i-lucide-arrow-right" color="neutral" variant="ghost" />
        </div>
      </template>

      <div v-if="overview?.recentUsers.length" class="divide-y divide-default">
        <div v-for="user in overview.recentUsers" :key="user.id" class="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
          <UUser
            :name="user.display_name || 'Unnamed user'"
            :description="user.email"
            :avatar="{ text: (user.display_name || user.email).slice(0, 2).toUpperCase(), color: 'neutral' }"
          />
          <span class="hidden whitespace-nowrap text-xs text-muted sm:block">{{ dateFormatter.format(new Date(user.created_at)) }}</span>
        </div>
      </div>
      <div v-else class="space-y-3 p-6">
        <USkeleton v-for="index in 4" :key="index" class="h-10 w-full" />
      </div>
    </UCard>
  </div>
</template>
