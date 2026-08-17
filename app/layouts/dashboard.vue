<script setup lang="ts">
const route = useRoute()
const sidebarOpen = ref(false)
const { profile, loadAccount, signOut } = useAccountSession()

const pageTitle = computed(() => route.path.endsWith('/settings') ? 'Settings' : 'Overview')

onMounted(() => loadAccount())
</script>

<template>
  <UDashboardGroup storage-key="architecton-account" class="h-screen bg-[#fafbf9] dark:bg-[#111412]">
    <DashboardAccountSidebar v-model:open="sidebarOpen" :profile="profile" @sign-out="signOut" />

    <UDashboardPanel id="architecton-account-panel">
      <template #header>
        <UDashboardNavbar :title="pageTitle" class="lg:hidden" />
      </template>

      <template #body>
        <slot />
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
