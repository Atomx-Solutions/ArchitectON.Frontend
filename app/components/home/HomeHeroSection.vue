<script setup lang="ts">
import { ArrowDown, Download, RefreshCw, ShieldCheck } from '@lucide/vue'

const { t } = useI18n()
</script>

<template>
  <section class="relative h-[92vh] min-h-[700px] max-h-[860px] overflow-hidden bg-[#0c1110] text-white max-md:h-[90vh] max-md:min-h-[680px]">
    <img
      src="/images/architecton-hero-bim.png"
      :alt="t('landing.hero.imageAlt')"
      class="absolute inset-0 size-full object-cover object-center max-md:object-[62%_center]"
    >
    <div class="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,12,11,.97)_0%,rgba(8,12,11,.88)_34%,rgba(8,12,11,.28)_63%,rgba(8,12,11,.12)_100%),linear-gradient(0deg,rgba(8,12,11,.62),transparent_45%)] max-md:bg-[linear-gradient(90deg,rgba(8,12,11,.97),rgba(8,12,11,.64)),linear-gradient(0deg,rgba(8,12,11,.72),transparent)]" />

    <UContainer class="relative z-[2] flex h-full animate-[fade-up_.7s_ease_both] flex-col justify-center px-5 pt-[58px] max-sm:px-4 motion-reduce:animate-none">
      <p class="mb-6 flex items-center gap-2.5 text-[0.6875rem] font-bold tracking-[0.12em] text-[#b8c1bd] uppercase">
        <span class="size-1.5 rounded-full bg-architecton-500" aria-hidden="true" />
        {{ t('landing.hero.eyebrow') }}
      </p>
      <h1 class="m-0 max-w-[820px] whitespace-pre-line text-[clamp(2.85rem,5.4vw,4.85rem)] leading-[1] font-semibold max-sm:text-[2.5rem]">
        {{ t('landing.hero.title') }}
      </h1>
      <p class="mt-7 max-w-[640px] text-lg leading-[1.65] text-[#c5ccc8] max-sm:text-base">
        {{ t('landing.hero.description') }}
      </p>

      <div class="mt-9 flex items-center gap-6 max-sm:items-start">
        <UButton to="#download" :label="t('landing.hero.download')" size="lg" class="justify-center px-5 font-bold text-[#081112] hover:-translate-y-px">
          <template #trailing><Download aria-hidden="true" /></template>
        </UButton>
        <NuxtLink to="#building-animation" class="group inline-flex items-center gap-2 py-2 text-sm font-semibold text-[#d4dbd7] transition-colors hover:text-white">
          {{ t('landing.hero.discover') }}
          <ArrowDown class="size-4 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
        </NuxtLink>
      </div>

      <div class="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-xs text-[#9fa8a3]">
        <span class="flex items-center gap-2"><UIcon name="i-lucide-monitor" class="size-4" aria-hidden="true" /> {{ t('landing.hero.windows') }}</span>
        <span class="flex items-center gap-2"><RefreshCw class="size-4" aria-hidden="true" /> {{ t('landing.hero.versions') }}</span>
        <span class="flex items-center gap-2"><ShieldCheck class="size-4" aria-hidden="true" /> {{ t('landing.hero.confirmation') }}</span>
      </div>
    </UContainer>

    <div class="absolute right-7 bottom-6 z-[2] flex items-center gap-3 text-[0.6875rem] text-[#aeb6b2] max-md:hidden">
      <span class="size-1.5 rounded-full bg-[#55d59f]" aria-hidden="true" />
      {{ t('landing.hero.availability') }}
    </div>
  </section>
</template>
