<script setup lang="ts">
import { Download, ScanSearch, ShieldCheck, Workflow } from '@lucide/vue'

const { t } = useI18n()
</script>

<template>
  <section aria-labelledby="difference-title" class="bg-[#cfdede] text-[#101412]">
    <UContainer class="px-5 max-sm:px-4">
      <div class="grid grid-cols-12 gap-x-8 gap-y-10 border-t border-[#aebfbd] py-24 max-md:py-18">
        <div class="col-span-7 max-lg:col-span-6 max-md:col-span-12">
          <p class="mb-6 flex items-center gap-3 text-xs font-bold tracking-[0.12em] text-[#176f78] uppercase">
            <span class="h-px w-8 bg-[#176f78]" aria-hidden="true" />
            {{ t('landing.cta.eyebrow') }}
          </p>
          <h2 id="difference-title" class="m-0 max-w-2xl whitespace-pre-line text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.02] font-semibold">
            {{ t('landing.cta.title') }}
          </h2>
        </div>

        <div class="col-span-5 flex flex-col items-start justify-end max-lg:col-span-6 max-md:col-span-12">
          <p class="m-0 max-w-lg text-lg leading-8 text-[#4d5d58]">
            {{ t('landing.cta.description') }}
          </p>
          <UButton to="#download" :label="t('landing.cta.button')" color="neutral" size="lg" class="mt-8 bg-[#101412] px-5 font-semibold text-white hover:bg-[#252d29]">
            <template #trailing><Download aria-hidden="true" /></template>
          </UButton>
        </div>

        <div class="col-span-12 mt-8 grid grid-cols-3 border-y border-[#aebfbd] max-md:grid-cols-1 max-md:border-b-0">
          <div class="border-r border-[#aebfbd] px-6 py-7 max-md:border-r-0 max-md:border-b max-sm:px-4">
            <ScanSearch class="size-5 text-[#d35f48]" aria-hidden="true" />
            <h3 class="mt-5 mb-2 text-base font-semibold">{{ t('landing.cta.items.spatial.title') }}</h3>
            <p class="m-0 text-sm leading-6 text-[#5c6965]">{{ t('landing.cta.items.spatial.description') }}</p>
          </div>
          <div class="border-r border-[#aebfbd] px-6 py-7 max-md:border-r-0 max-md:border-b max-sm:px-4">
            <Workflow class="size-5 text-[#d35f48]" aria-hidden="true" />
            <h3 class="mt-5 mb-2 text-base font-semibold">{{ t('landing.cta.items.systems.title') }}</h3>
            <p class="m-0 text-sm leading-6 text-[#5c6965]">{{ t('landing.cta.items.systems.description') }}</p>
          </div>
          <div class="px-6 py-7 max-md:border-b max-sm:px-4">
            <ShieldCheck class="size-5 text-[#d35f48]" aria-hidden="true" />
            <h3 class="mt-5 mb-2 text-base font-semibold">{{ t('landing.cta.items.rules.title') }}</h3>
            <p class="m-0 text-sm leading-6 text-[#5c6965]">{{ t('landing.cta.items.rules.description') }}</p>
          </div>
        </div>
      </div>
    </UContainer>
  </section>
</template>
