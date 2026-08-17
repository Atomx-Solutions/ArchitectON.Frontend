<script setup lang="ts">
const { admin, signOut } = useAdminSession()
const route = useRoute()
const sidebarOpen = ref(false)

const pageTitle = computed(() => route.path === '/users' ? 'Users' : 'Overview')
</script>

<template>
  <UDashboardGroup storage-key="architecton-admin" class="h-screen bg-elevated/30">
    <DashboardAdminSidebar
      v-model:open="sidebarOpen"
      :admin="admin"
      @sign-out="signOut"
    />

    <UDashboardPanel id="architecton-admin-panel">
      <template #header>
        <UDashboardNavbar :title="pageTitle">
          <template #right>
            <div class="flex items-center gap-2">
              <span class="hidden text-xs text-muted sm:inline">Secure workspace</span>
              <UBadge label="Admin" icon="i-lucide-shield-check" color="primary" variant="subtle" />
            </div>
          </template>
        </UDashboardNavbar>
      </template>

      <template #body>
        <slot />
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
