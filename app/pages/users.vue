<script setup lang="ts">
import type { DashboardResponse } from '~/types/admin-dashboard'

definePageMeta({ layout: 'admin' })

const { admin, getAccessToken, handleAdminError } = useAdminSession()
const dashboard = ref<DashboardResponse | null>(null)
const isLoading = ref(true)
const errorMessage = ref('')
const searchInput = ref('')
const activeSearch = ref('')
const page = ref(1)

useSeoMeta({
  title: 'Users',
  description: 'Manage Architecton users and review their usage.'
})

const loadUsers = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const accessToken = await getAccessToken()
    if (!accessToken) return

    const response = await $fetch<DashboardResponse>('/api/v1/admin/users', {
      headers: { Authorization: `Bearer ${accessToken}` },
      query: { page: page.value, search: activeSearch.value || undefined }
    })
    dashboard.value = response
    admin.value = response.admin
  } catch (error: unknown) {
    errorMessage.value = await handleAdminError(error, 'Users could not be loaded.')
  } finally {
    isLoading.value = false
  }
}

const search = () => {
  activeSearch.value = searchInput.value.trim()
  page.value = 1
  loadUsers()
}

const changePage = (nextPage: number) => {
  if (!dashboard.value || nextPage < 1 || nextPage > dashboard.value.pagination.totalPages) return
  page.value = nextPage
  loadUsers()
}

onMounted(loadUsers)
</script>

<template>
  <div class="mx-auto w-full max-w-[1500px] space-y-6 p-4 sm:p-6 lg:p-8">
    <section class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="mb-2 text-xs font-semibold tracking-[0.14em] text-primary uppercase">Management</p>
        <h1 class="text-2xl font-semibold tracking-tight text-highlighted sm:text-3xl">Users</h1>
        <p class="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Review accounts, token consumption and the Revit or Archicad versions connected to each user.
        </p>
      </div>
      <UBadge
        v-if="dashboard"
        :label="`${dashboard.pagination.total} accounts`"
        icon="i-lucide-users"
        color="neutral"
        variant="subtle"
        size="lg"
      />
    </section>

    <UAlert
      v-if="errorMessage"
      color="error"
      variant="subtle"
      icon="i-lucide-circle-alert"
      title="Users could not be loaded"
      :description="errorMessage"
    />

    <DashboardUsersTable
      v-if="dashboard"
      v-model:search="searchInput"
      :users="dashboard.users"
      :pagination="dashboard.pagination"
      :loading="isLoading"
      @search="search"
      @refresh="loadUsers"
      @page="changePage"
    />

    <UCard v-else-if="isLoading">
      <div class="space-y-4">
        <USkeleton class="h-8 w-52" />
        <USkeleton v-for="index in 7" :key="index" class="h-14 w-full" />
      </div>
    </UCard>
  </div>
</template>
