<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import type { AccountProfile } from '~/types/account-dashboard'

const props = defineProps<{ profile: AccountProfile | null }>()
const emit = defineEmits<{ signOut: [] }>()
const open = defineModel<boolean>('open', { default: false })

const navigationItems: NavigationMenuItem[] = [
  { label: 'Overview', icon: 'i-lucide-house', to: '/dashboard', exact: true },
  { label: 'Settings', icon: 'i-lucide-sliders-horizontal', to: '/dashboard/settings' }
]

const displayName = computed(() => props.profile?.display_name?.trim() || 'Architecton user')
const initials = computed(() => (props.profile?.display_name || props.profile?.email || 'A')
  .split(/[\s@._-]+/)
  .filter(Boolean)
  .slice(0, 2)
  .map(part => part[0]?.toUpperCase())
  .join(''))
</script>

<template>
  <UDashboardSidebar
    id="architecton-account-sidebar"
    v-model:open="open"
    :default-size="16"
    :min-size="14"
    :max-size="20"
    :ui="{ root: 'bg-[#f4f5f2] dark:bg-[#181b19]', header: 'border-b-0', footer: 'border-t-0' }"
  >
    <template #header>
      <div class="flex w-full items-center justify-between gap-3 px-1">
        <NuxtLink to="/" class="inline-flex min-w-0 items-center gap-2.5 text-sm font-semibold text-highlighted">
          <span class="size-7 shrink-0 overflow-hidden rounded-lg bg-white">
            <img src="/images/Icon.jpeg" alt="" class="size-full scale-125 object-cover -translate-y-[6%]" />
          </span>
          <span class="truncate">Architecton</span>
        </NuxtLink>
        <UDashboardSidebarCollapse />
      </div>
    </template>

    <template #default="{ collapsed }">
      <div class="flex min-h-0 flex-1 flex-col gap-5">
        <UButton
          to="/"
          label="Back to Architecton"
          icon="i-lucide-arrow-left"
          color="neutral"
          variant="ghost"
          :square="collapsed"
          :class="collapsed ? 'justify-center' : 'justify-start'"
        />

        <UNavigationMenu
          :items="navigationItems"
          :collapsed="collapsed"
          orientation="vertical"
          tooltip
          highlight
          class="flex-1"
        />

        <UButton
          to="/get-started"
          label="Download Architecton"
          icon="i-lucide-download"
          color="neutral"
          variant="outline"
          :square="collapsed"
          block
        />
      </div>
    </template>

    <template #footer="{ collapsed }">
      <div class="flex min-w-0 items-center gap-2" :class="collapsed ? 'flex-col' : ''">
        <UUser
          v-if="!collapsed"
          :name="displayName"
          :description="props.profile?.plan ? `${props.profile.plan.charAt(0).toUpperCase()}${props.profile.plan.slice(1)} plan` : 'Account'"
          :avatar="{ text: initials, color: 'primary', variant: 'soft' }"
          :ui="{ root: 'min-w-0 flex-1', name: 'truncate', description: 'capitalize' }"
        />
        <UTooltip text="Sign out">
          <UButton icon="i-lucide-log-out" color="neutral" variant="ghost" aria-label="Sign out" @click="emit('signOut')" />
        </UTooltip>
      </div>
    </template>
  </UDashboardSidebar>
</template>
