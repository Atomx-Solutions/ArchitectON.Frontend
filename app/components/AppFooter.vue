<script setup lang="ts">
const currentYear = new Date().getFullYear()
const { t } = useI18n()
const footerColumns = computed(() => [
  {
    label: t('landing.footer.product'),
    links: [
      { label: t('landing.footer.capabilities'), to: '/#features' },
      { label: t('landing.footer.howItWorks'), to: '/#how-it-works' },
      { label: t('landing.footer.download'), to: '/get-started' }
    ]
  },
  {
    label: t('landing.footer.resources'),
    links: [
      { label: t('landing.footer.documentation'), to: '/docs/revit-installation' },
      { label: t('landing.footer.support'), to: 'mailto:support@architecton.ai', external: true }
    ]
  },
  {
    label: t('landing.footer.legal'),
    links: [
      { label: t('landing.footer.privacy'), to: '/privacy' },
      { label: t('landing.footer.terms'), to: '/terms' }
    ]
  }
])
</script>

<template>
  <footer class="bg-[#101412] pt-[68px] pb-6 text-white">
    <UContainer class="grid grid-cols-[2fr_repeat(3,1fr)] gap-[50px] px-5 max-[700px]:grid-cols-2 max-[720px]:px-3.5">
      <div class="max-[700px]:col-span-full">
        <NuxtLink to="/" :aria-label="t('landing.footer.home')"><BrandLogo /></NuxtLink>
        <p class="max-w-[300px] leading-[1.6] text-[#8f9893]">{{ t('landing.footer.description') }}</p>
      </div>
      <div v-for="column in footerColumns" :key="column.label" class="flex flex-col gap-[11px] text-[13px] [&_a:hover]:text-architecton-500">
        <h2 class="mb-[7px] text-[11px] tracking-[.12em] text-[#8f9893] uppercase">{{ column.label }}</h2>
        <template v-for="link in column.links" :key="link.to">
          <a v-if="link.external" :href="link.to">{{ link.label }}</a>
          <NuxtLink v-else :to="link.to">{{ link.label }}</NuxtLink>
        </template>
      </div>
    </UContainer>
    <UContainer class="mt-[58px] flex justify-between border-t border-[#2a302d] px-5 pt-[22px] text-xs text-[#737b77] max-[700px]:flex-col max-[700px]:gap-2.5 max-[720px]:px-3.5">
      <span>&copy; {{ currentYear }} Architecton</span>
      <span>{{ t('landing.footer.tagline') }}</span>
    </UContainer>
  </footer>
</template>
