<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const { profile, usage, isLoading, errorMessage, loadAccount } = useAccountSession()

useSeoMeta({
  title: 'Account overview | Architecton',
  description: 'Review your Architecton plan, monthly AI usage and BIM integrations.',
  robots: 'noindex, nofollow'
})

const numberFormatter = new Intl.NumberFormat('en-US')
const usagePercent = computed(() => {
  const limit = profile.value?.monthly_token_limit ?? 0
  return limit ? Math.min(100, Math.round(((usage.value?.total_tokens ?? 0) / limit) * 100)) : 0
})
const planName = computed(() => {
  const plan = profile.value?.plan || 'free'
  return `${plan.charAt(0).toUpperCase()}${plan.slice(1)}`
})
const resetDate = computed(() => {
  const date = new Date()
  date.setMonth(date.getMonth() + 1, 1)
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
})

onMounted(() => loadAccount())
</script>

<template>
  <main class="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 lg:py-16">
    <header class="mb-9">
      <p class="mb-2 text-xs font-medium text-muted">Account</p>
      <h1 class="text-2xl font-medium tracking-[-0.025em] text-highlighted">Overview</h1>
      <p class="mt-2 text-sm text-muted">Your plan and Architecton activity in one place.</p>
    </header>

    <UAlert
      v-if="errorMessage"
      class="mb-6"
      color="error"
      variant="subtle"
      icon="i-lucide-circle-alert"
      title="Account unavailable"
      :description="errorMessage"
      :actions="[{ label: 'Try again', onClick: () => loadAccount(true) }]"
    />

    <section class="grid gap-5 md:grid-cols-2">
      <UCard :ui="{ root: 'ring-1 ring-default shadow-none', body: 'p-6 sm:p-7' }">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-sm text-muted">Included usage</p>
            <p class="mt-5 text-3xl font-medium tracking-[-0.04em] text-highlighted">
              {{ isLoading && !usage ? '—' : `${usagePercent}%` }}
              <span class="text-base font-normal text-muted">used</span>
            </p>
          </div>
          <span class="grid size-9 place-items-center rounded-lg bg-elevated text-muted">
            <UIcon name="i-lucide-chart-no-axes-column-increasing" class="size-4" />
          </span>
        </div>
        <UProgress :model-value="usagePercent" size="xs" class="mt-6" />
        <div class="mt-5 flex items-center justify-between gap-4 text-xs text-muted">
          <span>{{ numberFormatter.format(usage?.total_tokens ?? 0) }} of {{ numberFormatter.format(profile?.monthly_token_limit ?? 0) }} tokens</span>
          <span>Resets {{ resetDate }}</span>
        </div>
      </UCard>

      <UCard :ui="{ root: 'ring-1 ring-default shadow-none', body: 'p-6 sm:p-7' }">
        <div class="flex items-start justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-lg font-medium text-highlighted">{{ planName }}</h2>
              <UBadge label="Current plan" color="neutral" variant="soft" size="sm" />
            </div>
            <p class="mt-3 max-w-sm text-sm leading-6 text-muted">
              Built for focused BIM work with secure access from your desktop integrations.
            </p>
          </div>
          <span class="grid size-9 place-items-center rounded-lg bg-elevated text-muted">
            <UIcon name="i-lucide-sparkles" class="size-4" />
          </span>
        </div>
        <div class="mt-6 flex items-center gap-3">
          <UButton to="mailto:support@architecton.ai" external label="Talk to us" color="neutral" variant="solid" size="sm" />
          <span class="text-xs text-muted">Need more monthly usage?</span>
        </div>
      </UCard>
    </section>

    <section class="mt-10">
      <div class="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 class="text-base font-medium text-highlighted">Desktop integrations</h2>
          <p class="mt-1 text-sm text-muted">Install Architecton where your BIM work happens.</p>
        </div>
      </div>

      <UCard :ui="{ root: 'ring-1 ring-default shadow-none', body: 'p-0 sm:p-0' }">
        <NuxtLink
          v-for="platform in [
            { name: 'Revit', description: 'Architecton assistant for Autodesk Revit', image: '/images/platforms/revit.png', to: '/get-started/revit' },
            { name: 'Archicad', description: 'Architecton assistant for Graphisoft Archicad', image: '/images/platforms/archicad.png', to: '/get-started/archicad' }
          ]"
          :key="platform.name"
          :to="platform.to"
          class="group flex items-center gap-4 border-b border-default px-5 py-4 last:border-b-0 hover:bg-elevated/60 sm:px-6"
        >
          <img :src="platform.image" :alt="`${platform.name} logo`" class="size-9 shrink-0 object-contain">
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium text-highlighted">{{ platform.name }}</p>
            <p class="mt-0.5 truncate text-xs text-muted">{{ platform.description }}</p>
          </div>
          <span class="inline-flex items-center gap-2 text-xs font-medium text-muted group-hover:text-highlighted">
            Download
            <UIcon name="i-lucide-arrow-up-right" class="size-3.5" />
          </span>
        </NuxtLink>
      </UCard>
    </section>
  </main>
</template>
