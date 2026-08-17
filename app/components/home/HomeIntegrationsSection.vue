<script setup lang="ts">
import { platforms, type PlatformId } from '~/data/platforms'

const platformOrder: PlatformId[] = ['revit', 'archicad']
const { t } = useI18n()
</script>

<template>
  <section id="download" aria-labelledby="download-title" class="scroll-mt-20 bg-[#edf1ef] py-24 max-md:py-18">
    <UContainer class="px-5 max-sm:px-4">
      <div class="grid grid-cols-12 gap-x-8 gap-y-6">
        <div class="col-span-7 max-lg:col-span-8 max-md:col-span-12">
          <p class="mb-5 text-xs font-bold tracking-[0.12em] text-architecton-700 uppercase">{{ t('landing.integrations.eyebrow') }}</p>
          <h2 id="download-title" class="m-0 max-w-3xl text-[clamp(2.25rem,4vw,3.5rem)] leading-[1.03] font-semibold text-[#101412]">
            {{ t('landing.integrations.title') }}
          </h2>
        </div>
        <div class="col-span-5 flex items-end max-lg:col-span-4 max-md:col-span-12">
          <p class="m-0 max-w-lg text-base leading-7 text-[#616a65]">
            {{ t('landing.integrations.description') }}
          </p>
        </div>
      </div>

      <div class="mt-12 border-y border-[#c4ccc8]">
        <div class="grid min-h-14 grid-cols-[minmax(15rem,1.2fr)_1fr_9rem] items-center gap-6 border-b border-[#d2d8d4] px-7 text-[0.6875rem] font-bold tracking-[0.08em] text-[#7b8580] uppercase max-md:hidden">
          <span>{{ t('landing.integrations.integration') }}</span>
          <span>{{ t('landing.integrations.platform') }}</span>
          <span class="text-right">{{ t('landing.integrations.action') }}</span>
        </div>

        <NuxtLink
          v-for="platformId in platformOrder"
          :key="platformId"
          :to="`/get-started/${platformId}`"
          class="group grid min-h-[9rem] grid-cols-[minmax(15rem,1.2fr)_1fr_9rem] items-center gap-6 border-b border-[#d2d8d4] px-7 transition-colors last:border-b-0 hover:bg-white/35 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-architecton-600 max-md:min-h-0 max-md:grid-cols-1 max-md:gap-5 max-md:px-5 max-md:py-7"
        >
          <span class="flex min-w-0 items-center gap-4">
            <img :src="platforms[platformId].iconUrl" :alt="`${platforms[platformId].name} application icon`" class="size-11 shrink-0 object-contain" :class="platformId === 'revit' ? 'bg-transparent' : 'rounded-lg bg-white'">
            <span>
              <span class="block text-lg font-semibold text-[#101412]">{{ t('landing.integrations.product', { platform: platforms[platformId].name }) }}</span>
              <span class="mt-1 block text-xs text-[#737d78]">{{ t('landing.integrations.company', { company: platforms[platformId].company }) }}</span>
            </span>
          </span>

          <span class="flex items-center gap-2 text-sm text-[#59635e]">
            <UIcon name="i-lucide-monitor" class="size-4" aria-hidden="true" />
            {{ platforms[platformId].name }} / Windows x64
          </span>

          <span class="flex items-center justify-end gap-2 text-sm font-semibold text-[#101412] max-md:justify-start">
            {{ t('landing.integrations.viewVersions') }}
            <UIcon name="i-lucide-arrow-right" class="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </NuxtLink>
      </div>

      <div class="mt-5 flex flex-wrap items-center justify-between gap-4 text-xs leading-5 text-[#6a746f]">
        <p class="m-0 flex items-center gap-2"><UIcon name="i-lucide-info" class="size-4" aria-hidden="true" /> {{ t('landing.integrations.note') }}</p>
        <NuxtLink to="/docs/revit-installation" class="font-semibold text-[#39423e] hover:text-architecton-700">{{ t('landing.integrations.readDocs') }}</NuxtLink>
      </div>
    </UContainer>
  </section>
</template>
