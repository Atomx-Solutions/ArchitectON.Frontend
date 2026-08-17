<script setup lang="ts">
import { installationGuides, installationSlugToPlatform } from '~/data/installation'
import { platforms } from '~/data/platforms'

const route = useRoute()
const slug = getRouteParam(route.params.slug)
const platformId = installationSlugToPlatform[slug]

if (!platformId) {
  throw createError({ statusCode: 404, statusMessage: 'Guide not found' })
}

const platform = platforms[platformId]
const steps = installationGuides[platformId]
const documentationLinks = [
  { label: 'Revit installation', to: '/docs/revit-installation', platform: 'revit' },
  { label: 'Archicad installation', to: '/docs/archicad-installation', platform: 'archicad' }
] as const

useSeoMeta({
  title: `${platform.name} Installation`,
  description: `Install the version-specific Architecton integration for ${platform.name} on Windows x64.`
})
</script>

<template>
  <main class="bg-white pt-[70px] pb-[110px]">
    <UContainer class="grid grid-cols-[220px_1fr] gap-20 px-5 pt-[70px] max-[720px]:grid-cols-1 max-[720px]:gap-10 max-[720px]:px-3.5 max-[720px]:pt-[45px]">
      <aside class="sticky top-[110px] grid self-start gap-[5px] max-[720px]:static">
        <p class="mb-4 text-[11px] font-extrabold tracking-[.1em] text-[#8a928e] uppercase">Documentation</p>
        <NuxtLink
          v-for="link in documentationLinks"
          :key="link.to"
          :to="link.to"
          class="border-l-2 border-transparent px-3 py-2.5 text-[13px] text-[#6c746f]"
          :class="platformId === link.platform ? 'border-architecton-500 bg-[#f0f7f7] text-[#101412]' : ''"
        >
          {{ link.label }}
        </NuxtLink>
      </aside>
      <article class="max-w-[760px]">
        <p class="mb-[18px] text-xs font-extrabold tracking-[.12em] text-architecton-700 uppercase">Installation guide</p>
        <h1 class="m-0 text-[clamp(42px,6vw,68px)] leading-none font-semibold">Install Architecton<br>for {{ platform.name }}</h1>
        <p class="text-lg leading-[1.7] text-[#626a66] max-[720px]:text-base">Follow these steps after downloading a build matched to your host application version.</p>
        <div class="my-9 flex gap-3.5 border-l-[3px] border-[#ee6d52] bg-[#fff5f2] p-[18px] text-[#ee6d52]">
          <UIcon name="i-lucide-triangle-alert" class="mt-0.5 shrink-0" />
          <p class="m-0 text-[13px] leading-[1.6] text-[#5d625f]"><strong class="text-[#101412]">Do not mix host versions.</strong> {{ platform.name }} add-ons depend on version-specific APIs. Only install the build listed for your exact version.</p>
        </div>
        <ol class="mb-9 list-none p-0">
          <li v-for="(step, index) in steps" :key="step.title" class="grid grid-cols-[55px_1fr] border-t border-[#d9ddd8] py-[25px]">
            <span class="text-[11px] text-architecton-700">{{ String(index + 1).padStart(2, '0') }}</span>
            <div><h2 class="mb-[7px] text-lg font-bold">{{ step.title }}</h2><p class="m-0 leading-[1.6] text-[#626a66]">{{ step.description }}</p></div>
          </li>
        </ol>
        <UButton :to="`/get-started/${platformId}`" label="Select a build" trailing-icon="i-lucide-arrow-right" color="neutral" size="lg" class="font-bold hover:-translate-y-px" />
      </article>
    </UContainer>
  </main>
</template>
