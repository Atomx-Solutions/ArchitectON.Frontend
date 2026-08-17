<script setup lang="ts">
const route = useRoute()
const usesStandaloneLayout = computed(() =>
  route.path === '/login'
  || route.path.startsWith('/admin')
  || route.path.startsWith('/dashboard')
  || route.path.startsWith('/users'))
</script>

<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <AppHeader v-if="!usesStandaloneLayout" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <AppFooter v-if="!usesStandaloneLayout" />
  </UApp>
</template>
