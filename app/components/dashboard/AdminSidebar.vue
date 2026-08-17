<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import type { AdminProfile } from '~/types/admin-dashboard'

const props = defineProps<{
  admin: AdminProfile | null
}>()

const emit = defineEmits<{
  signOut: []
}>()

const open = defineModel<boolean>('open', { default: false })

const navigationItems: NavigationMenuItem[] = [
  {
    label: 'Overview',
    icon: 'i-lucide-layout-dashboard',
    to: '/admin'
  },
  {
    label: 'Users',
    icon: 'i-lucide-users',
    to: '/users'
  }
]

const adminName = computed(() => props.admin?.display_name?.trim() || 'Administrator')
const adminInitials = computed(() => {
  const source = props.admin?.display_name?.trim() || props.admin?.email || 'Admin'
  return source
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join('')
})
</script>

<template>
  <UDashboardSidebar
    id="architecton-admin-sidebar"
    v-model:open="open"
    collapsible
    resizable
    :default-size="17"
    :min-size="14"
    :max-size="22"
    :ui="{
      root: 'bg-default',
      header: 'border-b border-default',
      footer: 'border-t border-default'
    }"
  >
    <template #header="{ collapsed }">
      <div class="flex min-w-0 flex-1 items-center gap-3">
        <span class="grid size-9 shrink-0 place-items-center rounded-lg bg-primary font-bold text-inverted shadow-sm">
          A
        </span>
        <div v-if="!collapsed" class="min-w-0">
          <p class="truncate text-sm font-semibold text-highlighted">
            Architect<span class="text-primary">ON</span>
          </p>
          <p class="truncate text-xs text-muted">Admin workspace</p>
        </div>
      </div>

      <UDashboardSidebarCollapse />
    </template>

    <template #default="{ collapsed }">
      <div class="flex min-h-0 flex-1 flex-col gap-4">
        <p v-if="!collapsed" class="px-2 pt-1 text-[11px] font-semibold tracking-widest text-dimmed uppercase">
          Management
        </p>
        <UNavigationMenu
          :items="navigationItems"
          :collapsed="collapsed"
          orientation="vertical"
          tooltip
          popover
          highlight
          class="flex-1"
        />

        <div
          v-if="!collapsed"
          class="rounded-xl border border-primary/20 bg-primary/5 p-3"
        >
          <div class="mb-2 flex items-center gap-2">
            <span class="size-2 rounded-full bg-success ring-4 ring-success/10" />
            <p class="text-xs font-medium text-highlighted">System operational</p>
          </div>
          <p class="text-xs leading-5 text-muted">User data and desktop connections are synchronized.</p>
        </div>
      </div>
    </template>

    <template #footer="{ collapsed }">
      <div class="flex min-w-0 items-center gap-2" :class="collapsed ? 'flex-col' : ''">
        <UUser
          v-if="!collapsed"
          :name="adminName"
          :description="props.admin?.email"
          :avatar="{ text: adminInitials, color: 'primary', variant: 'soft' }"
          :ui="{ root: 'min-w-0 flex-1', description: 'truncate' }"
        />
        <UTooltip text="Sign out">
          <UButton
            icon="i-lucide-log-out"
            color="neutral"
            variant="ghost"
            aria-label="Sign out"
            @click="emit('signOut')"
          />
        </UTooltip>
      </div>
    </template>
  </UDashboardSidebar>
</template>
