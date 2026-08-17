<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { DashboardPagination, DashboardUser } from '~/types/admin-dashboard'

const props = defineProps<{
  users: DashboardUser[]
  pagination: DashboardPagination
  loading: boolean
}>()

const emit = defineEmits<{
  search: []
  refresh: []
  page: [value: number]
}>()

const search = defineModel<string>('search', { default: '' })

const columns: TableColumn<DashboardUser>[] = [
  { id: 'user', accessorKey: 'display_name', header: 'User' },
  { accessorKey: 'role', header: 'Role' },
  { accessorKey: 'plan', header: 'Plan' },
  { accessorKey: 'currentMonthTokens', header: 'Tokens this month' },
  { accessorKey: 'totalTokens', header: 'Total tokens' },
  { id: 'connectedVersions', accessorFn: row => row.connectedVersions.join(', '), header: 'Connected versions' },
  { accessorKey: 'lastConnectedAt', header: 'Last connected' }
]

const numberFormatter = new Intl.NumberFormat('en-US')
const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric'
})

const formatNumber = (value: number) => numberFormatter.format(value)
const formatDate = (value: string | null) => value ? dateFormatter.format(new Date(value)) : 'Never'
const tokenUsage = (user: DashboardUser) => {
  if (user.monthly_token_limit <= 0) return 0
  return Math.min(100, Math.round((user.currentMonthTokens / user.monthly_token_limit) * 100))
}

const initials = (user: DashboardUser) => {
  const source = user.display_name?.trim() || user.email
  return source
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join('')
}
</script>

<template>
  <UCard
    id="users"
    :ui="{
      root: 'overflow-hidden scroll-mt-20',
      header: 'p-4 sm:px-6 sm:py-5',
      body: 'p-0 sm:p-0',
      footer: 'p-4 sm:px-6'
    }"
  >
    <template #header>
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 class="text-base font-semibold text-highlighted">All users</h2>
          <p class="mt-1 text-sm text-muted">
            {{ formatNumber(pagination.total) }} matching account{{ pagination.total === 1 ? '' : 's' }}
          </p>
        </div>

        <form class="flex w-full gap-2 lg:max-w-lg" @submit.prevent="emit('search')">
          <div class="min-w-0 flex-1">
            <UInput
              v-model="search"
              icon="i-lucide-search"
              type="search"
              placeholder="Search name or email"
              class="w-full"
            />
          </div>
          <UButton type="submit" label="Search" icon="i-lucide-search" :loading="loading" />
          <UTooltip text="Refresh users">
            <UButton
              icon="i-lucide-refresh-cw"
              color="neutral"
              variant="outline"
              aria-label="Refresh users"
              :loading="loading"
              @click="emit('refresh')"
            />
          </UTooltip>
        </form>
      </div>
    </template>

    <div class="overflow-x-auto">
      <UTable
        :data="users"
        :columns="columns"
        :loading="loading"
        sticky="header"
        empty="No users match this search."
        class="min-w-[1080px]"
        :ui="{
          thead: 'bg-elevated/60',
          th: 'px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted',
          td: 'px-5 py-4',
          tr: 'border-b border-default last:border-0 hover:bg-elevated/40'
        }"
      >
        <template #user-cell="{ row }">
          <UUser
            :name="row.original.display_name || 'Unnamed user'"
            :description="row.original.email"
            :avatar="{ text: initials(row.original), color: 'neutral' }"
            :ui="{ name: 'font-medium text-highlighted', description: 'max-w-52 truncate' }"
          />
        </template>

        <template #role-cell="{ row }">
          <UBadge
            :label="row.original.role"
            :color="row.original.role === 'admin' ? 'primary' : 'neutral'"
            variant="subtle"
            class="capitalize"
          />
        </template>

        <template #plan-cell="{ row }">
          <span class="font-medium capitalize text-highlighted">{{ row.original.plan }}</span>
        </template>

        <template #currentMonthTokens-cell="{ row }">
          <div class="w-36">
            <div class="mb-1.5 flex items-center justify-between gap-3 text-xs">
              <span class="font-medium text-highlighted">{{ formatNumber(row.original.currentMonthTokens) }}</span>
              <span class="text-muted">{{ tokenUsage(row.original) }}%</span>
            </div>
            <UProgress :model-value="tokenUsage(row.original)" size="xs" />
            <p class="mt-1.5 text-xs text-dimmed">Limit {{ formatNumber(row.original.monthly_token_limit) }}</p>
          </div>
        </template>

        <template #totalTokens-cell="{ row }">
          <span class="font-medium tabular-nums text-highlighted">{{ formatNumber(row.original.totalTokens) }}</span>
        </template>

        <template #connectedVersions-cell="{ row }">
          <div v-if="row.original.connectedVersions.length" class="flex max-w-60 flex-wrap gap-1.5">
            <UBadge
              v-for="version in row.original.connectedVersions"
              :key="version"
              :label="version"
              color="neutral"
              variant="soft"
            />
          </div>
          <span v-else class="text-sm text-dimmed">Not connected</span>
        </template>

        <template #lastConnectedAt-cell="{ row }">
          <span class="whitespace-nowrap text-sm text-muted">{{ formatDate(row.original.lastConnectedAt) }}</span>
        </template>
      </UTable>
    </div>

    <template #footer>
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-sm text-muted">
          Page {{ pagination.page }} of {{ pagination.totalPages }}
        </p>
        <UPagination
          :page="pagination.page"
          :total="pagination.total"
          :items-per-page="pagination.pageSize"
          :disabled="loading"
          :sibling-count="1"
          size="sm"
          @update:page="emit('page', $event)"
        />
      </div>
    </template>
  </UCard>
</template>
