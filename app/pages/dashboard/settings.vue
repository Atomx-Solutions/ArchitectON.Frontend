<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const { profile, isLoading, errorMessage, loadAccount, updateDisplayName, signOut } = useAccountSession()
const colorMode = useColorMode()
const toast = useToast()
const displayName = ref('')
const isSaving = ref(false)

const themeItems = [
  { label: 'System', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' }
]

const initials = computed(() => (profile.value?.display_name || profile.value?.email || 'A')
  .split(/[\s@._-]+/)
  .filter(Boolean)
  .slice(0, 2)
  .map(part => part[0]?.toUpperCase())
  .join(''))

watch(profile, value => {
  if (value) displayName.value = value.display_name || ''
}, { immediate: true })

const saveProfile = async () => {
  isSaving.value = true
  try {
    await updateDisplayName(displayName.value)
    toast.add({ title: 'Profile updated', description: 'Your account name has been saved.', color: 'success' })
  } catch (error) {
    toast.add({ title: 'Could not save profile', description: error instanceof Error ? error.message : 'Try again.', color: 'error' })
  } finally {
    isSaving.value = false
  }
}

useSeoMeta({
  title: 'Account settings | Architecton',
  description: 'Manage your Architecton profile and appearance preferences.',
  robots: 'noindex, nofollow'
})

onMounted(() => loadAccount())
</script>

<template>
  <main class="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 lg:py-16">
    <header class="mb-9">
      <p class="mb-2 text-xs font-medium text-muted">Account</p>
      <h1 class="text-2xl font-medium tracking-[-0.025em] text-highlighted">Settings</h1>
      <p class="mt-2 text-sm text-muted">Manage your profile and how Architecton looks.</p>
    </header>

    <UAlert
      v-if="errorMessage"
      class="mb-6"
      color="error"
      variant="subtle"
      icon="i-lucide-circle-alert"
      :description="errorMessage"
    />

    <section class="mb-10">
      <p class="mb-3 px-1 text-xs font-medium text-muted">Profile</p>
      <UCard :ui="{ root: 'ring-1 ring-default shadow-none', body: 'divide-y divide-default p-0 sm:p-0' }">
        <div class="grid gap-3 px-5 py-5 sm:grid-cols-[minmax(150px,1fr)_minmax(280px,1.5fr)] sm:items-center sm:px-6">
          <div>
            <p class="text-sm font-medium text-highlighted">Profile image</p>
            <p class="mt-1 text-xs text-muted">Used across your Architecton account.</p>
          </div>
          <UAvatar :text="initials" color="primary" variant="soft" size="xl" />
        </div>

        <div class="grid gap-3 px-5 py-5 sm:grid-cols-[minmax(150px,1fr)_minmax(280px,1.5fr)] sm:items-center sm:px-6">
          <label for="account-email" class="text-sm font-medium text-highlighted">Email</label>
          <UInput id="account-email" :model-value="profile?.email || ''" disabled class="w-full" />
        </div>

        <div class="grid gap-3 px-5 py-5 sm:grid-cols-[minmax(150px,1fr)_minmax(280px,1.5fr)] sm:items-center sm:px-6">
          <label for="account-name" class="text-sm font-medium text-highlighted">Display name</label>
          <UInput id="account-name" v-model="displayName" maxlength="80" placeholder="Your name" class="w-full" :disabled="isLoading" />
        </div>
      </UCard>
      <div class="mt-3 flex justify-end">
        <UButton label="Save changes" color="neutral" :loading="isSaving" @click="saveProfile" />
      </div>
    </section>

    <section class="mb-10">
      <p class="mb-3 px-1 text-xs font-medium text-muted">Appearance</p>
      <UCard :ui="{ root: 'ring-1 ring-default shadow-none', body: 'p-0 sm:p-0' }">
        <div class="grid gap-3 px-5 py-5 sm:grid-cols-[minmax(150px,1fr)_minmax(280px,1.5fr)] sm:items-center sm:px-6">
          <div>
            <p class="text-sm font-medium text-highlighted">Theme</p>
            <p class="mt-1 text-xs text-muted">Choose your preferred dashboard appearance.</p>
          </div>
          <USelect v-model="colorMode.preference" :items="themeItems" value-key="value" class="w-full sm:max-w-48" />
        </div>
      </UCard>
    </section>

    <section>
      <p class="mb-3 px-1 text-xs font-medium text-muted">Session</p>
      <UCard :ui="{ root: 'ring-1 ring-default shadow-none', body: 'p-0 sm:p-0' }">
        <div class="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p class="text-sm font-medium text-highlighted">Sign out of Architecton</p>
            <p class="mt-1 text-xs text-muted">You can sign back in at any time.</p>
          </div>
          <UButton label="Sign out" icon="i-lucide-log-out" color="neutral" variant="outline" @click="signOut" />
        </div>
      </UCard>
    </section>
  </main>
</template>
