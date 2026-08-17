<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: () => t('landing.meta.title'),
  description: () => t('landing.meta.description'),
  ogTitle: () => t('landing.meta.ogTitle'),
  ogDescription: () => t('landing.meta.ogDescription'),
  ogImage: '/images/architecton-hero-bim.png',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <main>
    <HomeHeroSection />
    <HomeIntegrationsSection />
    <HomeBuildingAnimationSection />
    <HomeFeaturesSection />
    <HomeWorkflowSection />
    <HomeCtaSection />
  </main>
</template>
