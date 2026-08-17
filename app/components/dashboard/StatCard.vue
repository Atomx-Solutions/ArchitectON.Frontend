<script setup lang="ts">
defineProps<{
  label: string
  value: string
  description: string
  icon: string
  loading?: boolean
}>()
</script>

<template>
  <UCard
    :ui="{ root: 'group relative overflow-hidden transition-shadow hover:shadow-md', body: 'p-5 sm:p-6' }"
  >
    <span class="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary to-primary/20" />
    <div class="flex items-start justify-between gap-4">
      <div class="min-w-0">
        <p class="text-sm font-medium text-muted">{{ label }}</p>
        <USkeleton v-if="loading" class="mt-3 h-9 w-20" />
        <p v-else class="mt-2 text-3xl font-semibold tracking-tight text-highlighted">{{ value }}</p>
        <p class="mt-1.5 truncate text-xs text-dimmed">{{ description }}</p>
      </div>
      <span class="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-inverted">
        <UIcon :name="icon" class="size-5" />
      </span>
    </div>
  </UCard>
</template>
