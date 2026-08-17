<script setup lang="ts">
import { Blocks, Building2, RefreshCw, ScanSearch, Workflow } from '@lucide/vue'

const { locale, t } = useI18n()
const capabilities = [
  { key: 'building', icon: Building2 },
  { key: 'create', icon: Blocks },
  { key: 'revise', icon: RefreshCw },
  { key: 'experts', icon: Workflow },
  { key: 'read', icon: ScanSearch }
] as const
</script>

<template>
  <section id="features" aria-labelledby="capabilities-title" class="scroll-mt-[70px] bg-[#edf1ef]">
    <UContainer class="px-5 max-sm:px-4">
      <div class="grid grid-cols-12 border-t border-[#cbd2ce] py-24 max-md:gap-y-10 max-md:py-18">
        <div class="col-span-4 min-w-0 pr-14 max-lg:col-span-5 max-md:col-span-12 max-md:pr-0">
          <div class="sticky top-28 max-md:static">
            <p class="mb-5 text-xs font-bold tracking-[0.12em] text-architecton-700 uppercase">{{ t('landing.features.eyebrow') }}</p>
            <h2 id="capabilities-title" class="m-0 max-w-sm text-[clamp(2rem,3.4vw,3rem)] leading-[1.06] font-semibold tracking-[-0.02em] break-words hyphens-auto text-[#101412]" :lang="locale">
              {{ t('landing.features.title') }}
            </h2>
            <p class="mt-6 max-w-sm text-base leading-7 text-[#616a65]">
              {{ t('landing.features.description') }}
            </p>
            <UButton
              to="/get-started"
              :label="t('landing.features.explore')"
              trailing-icon="i-lucide-arrow-right"
              color="neutral"
              variant="link"
              class="mt-5 p-0 font-semibold text-[#101412]"
            />
          </div>
        </div>

        <div class="col-span-8 max-lg:col-span-7 max-md:col-span-12">
          <article
            v-for="(feature, index) in capabilities"
            :key="feature.key"
            class="grid grid-cols-[3rem_minmax(12rem,.78fr)_1fr] items-center gap-7 border-b border-[#cbd2ce] py-7 max-lg:grid-cols-[2.75rem_1fr] max-lg:gap-x-5 max-sm:min-h-0 max-sm:grid-cols-[2.25rem_1fr] max-sm:gap-x-3 max-sm:py-6"
            :class="feature.key === 'building' ? 'min-h-[11.5rem] border-t-2 border-t-[#171c19]' : 'min-h-[9.5rem]'"
          >
            <span class="self-start pt-1 text-[0.6875rem] font-semibold text-[#8a938e]">{{ String(index + 1).padStart(2, '0') }}</span>

            <div class="self-start max-lg:pr-5">
              <component :is="feature.icon" class="mb-4 text-[#c45340]" :class="feature.key === 'building' ? 'size-6' : 'size-5'" aria-hidden="true" />
              <h3
                class="m-0 max-w-[16rem] font-semibold text-[#171c19]"
                :class="feature.key === 'building' ? 'text-[1.4rem] leading-7 tracking-[-0.02em]' : 'text-[1.2rem] leading-6'"
              >
                {{ t(`landing.features.items.${feature.key}.title`) }}
              </h3>
            </div>

            <div class="max-lg:col-start-2">
              <p class="m-0 max-w-lg text-[0.9375rem] leading-6 text-[#616a65]">{{ t(`landing.features.items.${feature.key}.description`) }}</p>
              <div class="mt-4 flex items-center gap-2.5 text-[0.625rem] font-bold tracking-[0.1em] text-[#78817c] uppercase">
                <span class="h-px w-5 bg-[#9da7a1]" aria-hidden="true" />
                {{ t(`landing.features.items.${feature.key}.detail`) }}
              </div>
            </div>
          </article>
        </div>
      </div>
    </UContainer>
  </section>
</template>
