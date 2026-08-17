<script setup lang="ts">
import type { PlatformInfo } from '~/data/platforms'

withDefaults(defineProps<{
  platform: PlatformInfo
  compact?: boolean
}>(), {
  compact: false
})
</script>

<template>
  <article
    class="grid min-h-[9.5rem] grid-cols-[1fr_12rem_8rem] items-center gap-5 border-b border-[#d2d8d4] px-7 last:border-b-0 max-md:grid-cols-1 max-md:gap-5 max-md:px-5 max-md:py-7"
  >
    <div class="flex min-w-0 items-center gap-4">
      <img :src="platform.iconUrl" :alt="`${platform.name} application icon`" class="size-11 shrink-0 object-contain" :class="platform.id === 'revit' ? 'bg-transparent' : 'rounded-lg bg-white'">
      <div class="min-w-0">
        <p class="m-0 text-[0.6875rem] font-bold tracking-[0.08em] uppercase" :class="platform.id === 'revit' ? 'text-[#2f7cf6]' : 'text-[#008fb8]'">{{ platform.company }}</p>
        <h2 class="mt-1 mb-0 text-xl font-semibold text-[#101412]">Architecton for {{ platform.name }}</h2>
        <p class="mt-2 mb-0 max-w-xl text-sm leading-6 text-[#66706b]">{{ platform.description }}</p>
      </div>
    </div>

    <div>
      <div class="flex flex-wrap gap-1.5">
        <span v-for="build in platform.verifiedBuilds" :key="build.version" class="border border-[#cbd2ce] bg-white px-2 py-1 text-[0.6875rem] font-semibold text-[#39423e]">{{ build.version }}</span>
      </div>
      <p class="mt-2 mb-0 text-xs text-[#737d78]">Windows x64 / Planned</p>
    </div>

    <UButton
      :to="`/get-started/${platform.id}`"
      label="View builds"
      trailing-icon="i-lucide-arrow-right"
      color="neutral"
      variant="outline"
      class="justify-self-end font-semibold max-md:justify-self-start"
      :aria-label="`View Architecton builds for ${platform.name}`"
    />
  </article>
</template>
