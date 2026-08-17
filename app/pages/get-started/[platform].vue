<script setup lang="ts">
import { isPlatformId, platforms, type PlatformId } from '~/data/platforms'

const route = useRoute()
const requestUrl = useRequestURL()
const platformParam = getRouteParam(route.params.platform).toLowerCase()

if (!isPlatformId(platformParam)) {
  throw createError({ statusCode: 404, statusMessage: 'Platform not found' })
}

const platformId = platformParam
const platform = platforms[platformId]
const { data: builds } = await usePlatformBuilds(platformId)
const selectedVersion = ref(builds.value[0]?.version ?? '')
const selectedBuild = computed(() => builds.value.find(build => build.version === selectedVersion.value))
const otherPlatformId: PlatformId = platformId === 'revit' ? 'archicad' : 'revit'
const otherPlatform = platforms[otherPlatformId]

const platformContent = {
  revit: {
    eyebrow: 'Native Autodesk Revit integration',
    headline: 'Architecton, inside Revit.',
    introduction: 'Use Architecton with the Revit project you already have open. Ask about the model, create native elements, and review the work without switching tools.',
    signal: 'Made for Revit',
    proof: 'Works with the active model',
    capabilities: [
      { number: '01', icon: 'i-lucide-scan-search', title: 'Ask about the model', text: 'Get clear answers about levels, rooms, families, and elements in the open Revit project.' },
      { number: '02', icon: 'i-lucide-blocks', title: 'Create in Revit', text: 'Create walls, floors, openings, and other native elements that stay editable.' },
      { number: '03', icon: 'i-lucide-list-checks', title: 'Review the result', text: 'See what was done and keep control of changes made to the project.' }
    ],
    steps: [
      { title: 'Close Revit', text: 'Save your active project and close Revit before starting setup.' },
      { title: 'Run the installer', text: 'Open the downloaded Windows installer and approve the installation.' },
      { title: 'Open Architecton', text: 'Launch Revit and open Architecton from the Add-Ins ribbon.' },
      { title: 'Sign in and work', text: 'Connect your account, open a project, and start with a clear model request.' }
    ],
    requirement: 'A supported Autodesk Revit release',
    location: 'Add-Ins ribbon'
  },
  archicad: {
    eyebrow: 'Native Graphisoft Archicad integration',
    headline: 'Architecton, inside Archicad.',
    introduction: 'Use Architecton with your open Archicad project. Ask about the model, work with native building elements, and review each result in one place.',
    signal: 'Made for Archicad',
    proof: 'Works with the active project',
    capabilities: [
      { number: '01', icon: 'i-lucide-panels-top-left', title: 'Ask about the project', text: 'Get clear answers about storeys, zones, walls, slabs, and project information.' },
      { number: '02', icon: 'i-lucide-building-2', title: 'Create in Archicad', text: 'Work with native building elements while keeping the project structured and editable.' },
      { number: '03', icon: 'i-lucide-shield-check', title: 'Review the result', text: 'See what was done and keep control of changes made to the project.' }
    ],
    steps: [
      { title: 'Close Archicad', text: 'Save the project and fully close Archicad before installation.' },
      { title: 'Run the installer', text: 'Open the verified Windows installer and allow setup to finish.' },
      { title: 'Open Architecton', text: 'Launch Archicad and choose Architecton Chat from the Architecton menu.' },
      { title: 'Sign in and work', text: 'Connect your account, open a project, and describe the outcome you need.' }
    ],
    requirement: 'A supported Graphisoft Archicad release',
    location: 'Architecton menu'
  }
} as const

const content = platformContent[platformId]
const canonicalUrl = computed(() => new URL(route.path, requestUrl.origin).toString())
const downloadUrl = computed(() => selectedBuild.value?.releaseUrl
  ? new URL(selectedBuild.value.releaseUrl, requestUrl.origin).toString()
  : canonicalUrl.value)

useSeoMeta({
  title: `Download Architecton for ${platform.name} | AI BIM Integration`,
  description: `Download Architecton for ${platform.company} ${platform.name}. Install the verified Windows x64 integration and bring model-aware AI assistance into your BIM workflow.`,
  ogType: 'website',
  ogTitle: `Architecton for ${platform.name}`,
  ogDescription: content.introduction,
  ogUrl: canonicalUrl,
  ogImage: new URL('/images/architecton-hero-bim.png', requestUrl.origin).toString(),
  ogImageAlt: `Architecton AI BIM integration for ${platform.name}`,
  twitterCard: 'summary_large_image',
  twitterTitle: `Download Architecton for ${platform.name}`,
  twitterDescription: `Install Architecton inside ${platform.name} and work with a model-aware AI assistant.`,
  robots: 'index, follow'
})

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl.value }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: `Architecton for ${platform.name}`,
        applicationCategory: 'BusinessApplication',
        applicationSubCategory: 'Building Information Modeling software',
        operatingSystem: 'Windows 64-bit',
        softwareVersion: selectedVersion.value,
        description: content.introduction,
        url: canonicalUrl.value,
        downloadUrl: downloadUrl.value,
        featureList: content.capabilities.map(item => item.title)
      })
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: `How to install Architecton for ${platform.name}`,
        description: `Install the verified Architecton integration for ${platform.name} on Windows.`,
        totalTime: 'PT5M',
        step: content.steps.map((step, index) => ({
          '@type': 'HowToStep',
          position: index + 1,
          name: step.title,
          text: step.text
        }))
      })
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Architecton', item: new URL('/', requestUrl.origin).toString() },
          { '@type': 'ListItem', position: 2, name: 'Get started', item: new URL('/get-started', requestUrl.origin).toString() },
          { '@type': 'ListItem', position: 3, name: platform.name, item: canonicalUrl.value }
        ]
      })
    }
  ]
})
</script>

<template>
  <main class="bg-[#f2f1ec] text-[#111512]">
    <section class="relative isolate overflow-hidden bg-[#0b0f0d] pt-[70px] text-white" aria-labelledby="platform-title">
      <div class="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,.025),transparent_42%)]" aria-hidden="true" />
      <div class="pointer-events-none absolute top-1/2 right-[8%] size-[30rem] -translate-y-1/2 rounded-full blur-[130px]" :class="platformId === 'revit' ? 'bg-[#2f7cf6]/10' : 'bg-[#00a6d6]/10'" aria-hidden="true" />
      <svg class="pointer-events-none absolute top-[10%] right-[-8rem] h-[78%] w-[58%] opacity-[.14] max-lg:opacity-[.08] max-md:hidden" viewBox="0 0 760 620" fill="none" aria-hidden="true">
        <path d="M88 434 354 280l278 160-267 155L88 434Z" stroke="currentColor" />
        <path d="M179 381v-148l177-103 185 106v150M179 233l181 104 181-101M360 337v181" stroke="currentColor" />
        <path d="m224 207 132-77 138 79M216 404l144 83 146-84" stroke="currentColor" stroke-dasharray="5 8" />
        <circle cx="360" cy="337" r="5" :class="platformId === 'revit' ? 'fill-[#2f7cf6]' : 'fill-[#00a6d6]'" stroke="none" />
      </svg>

      <UContainer class="relative px-5 max-sm:px-4">
        <nav class="flex h-16 items-center gap-2 border-b border-white/10 text-[.72rem] text-white/45" aria-label="Breadcrumb">
          <NuxtLink to="/get-started" class="transition hover:text-white">Get started</NuxtLink>
          <UIcon name="i-lucide-chevron-right" class="size-3.5" />
          <span class="text-white/75">{{ platform.name }}</span>
        </nav>

        <div class="grid min-h-[45rem] grid-cols-12 items-center gap-x-16 gap-y-12 py-16 max-lg:min-h-0 max-lg:py-20 max-md:grid-cols-1 max-md:py-14">
          <div class="col-span-7 max-lg:col-span-6 max-md:col-span-1">
            <div class="mb-9 flex items-center gap-4">
              <img :src="platform.iconUrl" :alt="`${platform.name} application icon`" class="size-14 shrink-0 object-contain" :class="platformId === 'revit' ? 'bg-transparent' : 'rounded-xl bg-white'">
              <div>
                <p class="m-0 text-[.65rem] font-bold tracking-[.17em] uppercase" :class="platformId === 'revit' ? 'text-[#6ea0ff]' : 'text-[#4dc9e8]'">{{ platform.company }} BIM platform</p>
                <p class="mt-1.5 mb-0 text-sm font-semibold text-white/82">{{ content.eyebrow }}</p>
              </div>
            </div>
            <h1 id="platform-title" class="m-0 max-w-[48rem] text-[clamp(3.2rem,6.4vw,6.35rem)] leading-[.92] font-medium tracking-[-.06em]">
              {{ content.headline }}
            </h1>
            <p class="mt-8 max-w-[39rem] text-[clamp(1rem,1.4vw,1.15rem)] leading-8 text-[#aab4ae]">
              {{ content.introduction }}
            </p>
            <div class="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/10 pt-6 text-xs text-white/65">
              <span class="flex items-center gap-2.5"><UIcon name="i-lucide-badge-check" class="size-4" :class="platformId === 'revit' ? 'text-[#6ea0ff]' : 'text-[#4dc9e8]'" /> {{ content.signal }}</span>
              <span class="flex items-center gap-2.5"><UIcon name="i-lucide-cpu" class="size-4" /> Windows x64</span>
              <span class="flex items-center gap-2.5"><UIcon name="i-lucide-box" class="size-4" /> {{ content.proof }}</span>
            </div>
          </div>

          <div class="col-span-5 max-lg:col-span-6 max-md:col-span-1">
            <DownloadPlatformDownloadPanel v-model:version="selectedVersion" :platform="platform" :builds="builds" class="download-panel" />
          </div>
        </div>
      </UContainer>
    </section>

    <section class="border-b border-[#d6d8d2] bg-[#e9eae4]" aria-label="Compatibility summary">
      <UContainer class="grid grid-cols-3 divide-x divide-[#cfd2cb] px-5 max-sm:grid-cols-1 max-sm:divide-x-0 max-sm:divide-y max-sm:px-4">
        <div class="py-7 pr-8 max-sm:px-0">
          <p class="m-0 text-[.65rem] font-bold tracking-[.14em] text-[#737b76] uppercase">Required host</p>
          <p class="mt-2 mb-0 text-sm font-semibold">{{ content.requirement }}</p>
        </div>
        <div class="px-8 py-7 max-sm:px-0">
          <p class="m-0 text-[.65rem] font-bold tracking-[.14em] text-[#737b76] uppercase">Find it inside</p>
          <p class="mt-2 mb-0 text-sm font-semibold">{{ content.location }}</p>
        </div>
        <div class="py-7 pl-8 max-sm:px-0">
          <p class="m-0 text-[.65rem] font-bold tracking-[.14em] text-[#737b76] uppercase">Installation</p>
          <p class="mt-2 mb-0 text-sm font-semibold">Verified Windows installer</p>
        </div>
      </UContainer>
    </section>

    <section class="py-28 max-md:py-20" aria-labelledby="capabilities-title">
      <UContainer class="px-5 max-sm:px-4">
        <div class="grid grid-cols-12 gap-8 border-b border-[#cfd2cc] pb-12">
          <p class="col-span-3 m-0 text-[.68rem] font-bold tracking-[.16em] text-[#68716c] uppercase max-md:col-span-12">Inside the integration</p>
          <h2 id="capabilities-title" class="col-span-8 col-start-5 m-0 max-w-[47rem] text-[clamp(2.25rem,4.2vw,4rem)] leading-[1.02] font-medium tracking-[-.045em] max-md:col-span-12 max-md:col-start-1">
            Work with the BIM model you already have.
          </h2>
        </div>

        <div class="grid grid-cols-3 divide-x divide-[#cfd2cc] max-md:grid-cols-1 max-md:divide-x-0 max-md:divide-y">
          <article v-for="item in content.capabilities" :key="item.number" class="group min-h-[22rem] px-9 py-12 first:pl-0 last:pr-0 max-md:min-h-0 max-md:px-0">
            <div class="flex items-center justify-between text-[#747c77]">
              <span class="font-mono text-[.65rem]">{{ item.number }}</span>
              <UIcon :name="item.icon" class="size-5 transition-transform duration-300 group-hover:-translate-y-1" :class="platformId === 'revit' ? 'text-[#2f7cf6]' : 'text-[#008fb8]'" />
            </div>
            <h3 class="mt-20 mb-0 max-w-[16rem] text-[1.45rem] leading-tight font-semibold tracking-[-.025em] max-md:mt-10">{{ item.title }}</h3>
            <p class="mt-4 mb-0 max-w-[19rem] text-sm leading-6 text-[#68706b]">{{ item.text }}</p>
          </article>
        </div>
      </UContainer>
    </section>

    <section class="bg-[#dfe3de] py-28 max-md:py-20" aria-labelledby="installation-title">
      <UContainer class="grid grid-cols-12 gap-x-12 gap-y-14 px-5 max-sm:px-4">
        <div class="col-span-4 max-md:col-span-12">
          <p class="mb-5 text-[.68rem] font-bold tracking-[.16em] text-[#65706a] uppercase">Installation</p>
          <h2 id="installation-title" class="m-0 text-[clamp(2.5rem,4.5vw,4.25rem)] leading-[.98] font-medium tracking-[-.05em]">Install it. Open {{ platform.name }}.</h2>
          <p class="mt-6 max-w-[22rem] text-sm leading-6 text-[#626b66]">Choose your version, run the installer, and open Architecton from {{ content.location }}.</p>
        </div>

        <ol class="col-span-7 col-start-6 m-0 list-none p-0 max-md:col-span-12 max-md:col-start-1">
          <li v-for="(step, index) in content.steps" :id="`installation-step-${index + 1}`" :key="step.title" class="grid grid-cols-[3rem_1fr_auto] items-start gap-5 border-t border-[#bfc5bf] py-7 last:border-b max-sm:grid-cols-[2.5rem_1fr]">
            <span class="font-mono text-xs text-[#7a827d]">0{{ index + 1 }}</span>
            <div>
              <h3 class="m-0 text-base font-semibold">{{ step.title }}</h3>
              <p class="mt-2 mb-0 max-w-[31rem] text-sm leading-6 text-[#65706a]">{{ step.text }}</p>
            </div>
            <UIcon name="i-lucide-arrow-down-right" class="mt-1 size-4 text-[#7b837e] max-sm:hidden" />
          </li>
        </ol>
      </UContainer>
    </section>

    <section class="bg-[#101412] py-20 text-white">
      <UContainer class="flex items-end justify-between gap-12 px-5 max-md:flex-col max-md:items-start max-sm:px-4">
        <div>
          <p class="mb-4 text-[.68rem] font-bold tracking-[.16em] text-white/45 uppercase">Also available for</p>
          <h2 class="m-0 text-[clamp(2rem,4vw,3.6rem)] leading-none font-medium tracking-[-.045em]">Architecton for {{ otherPlatform.name }}.</h2>
        </div>
        <UButton :to="`/get-started/${otherPlatformId}`" color="neutral" variant="ghost" size="xl" trailing-icon="i-lucide-arrow-up-right" class="shrink-0 bg-transparent px-5 text-white ring-1 ring-inset ring-white/25 hover:bg-white/10 hover:text-white">
          Download for {{ otherPlatform.name }}
        </UButton>
      </UContainer>
    </section>
  </main>
</template>
