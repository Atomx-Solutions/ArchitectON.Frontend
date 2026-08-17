<script setup lang="ts">
const isMenuOpen = ref(false)
const route = useRoute()
const { locale, setLocale, t } = useI18n()
const localePath = useLocalePath()

type LocaleCode = 'en' | 'sq' | 'de'

const localeItems = [
  { label: 'EN', value: 'en' },
  { label: 'SQ', value: 'sq' },
  { label: 'DE', value: 'de' }
]

const selectedLocale = computed<LocaleCode>({
  get: () => locale.value as LocaleCode,
  set: value => { void setLocale(value) }
})

const navigation = computed(() => [
  { label: t('landing.nav.download'), to: `${localePath('/')}#download` },
  { label: t('landing.nav.capabilities'), to: `${localePath('/')}#features` },
  { label: t('landing.nav.howItWorks'), to: `${localePath('/')}#how-it-works` },
  { label: t('landing.nav.documentation'), to: localePath('/docs/revit-installation') }
])

watch(() => route.fullPath, () => {
  isMenuOpen.value = false
})
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 h-[70px] border-b border-white/12 bg-[#0d1110c7] text-white backdrop-blur-[18px] has-[.mobile-navigation]:h-auto"
    @keyup.esc="isMenuOpen = false"
  >
    <UContainer class="grid h-[70px] grid-cols-[1fr_auto_1fr] items-center gap-7 px-5 max-[760px]:grid-cols-[1fr_auto] max-[720px]:px-3.5">
      <NuxtLink :to="localePath('/')" :aria-label="t('landing.nav.home')">
        <BrandLogo />
      </NuxtLink>
      <nav class="flex gap-[30px] text-[13px] text-[#c5cbc8] max-[760px]:hidden [&_a:hover]:text-white" :aria-label="t('landing.nav.primary')">
        <NuxtLink v-for="item in navigation" :key="item.to" :to="item.to">
          {{ item.label }}
        </NuxtLink>
      </nav>
      <div class="flex items-center justify-self-end gap-2">
        <USelect
          id="site-language"
          v-model="selectedLocale"
          :items="localeItems"
          value-key="value"
          label-key="label"
          icon="i-lucide-languages"
          color="neutral"
          variant="outline"
          size="sm"
          :content="{ bodyLock: false }"
          :aria-label="t('landing.nav.language')"
          class="w-24"
          :ui="{
            base: 'h-[38px] cursor-pointer justify-center bg-white/8 text-white ring-white/20 hover:bg-white/12',
            leadingIcon: 'text-white/70',
            trailingIcon: 'text-white/70',
            value: 'text-center font-semibold tracking-wide',
            content: 'min-w-24',
            item: 'justify-center',
            itemLabel: 'font-semibold tracking-wide'
          }"
        />
        <UButton
          :to="localePath('/get-started')"
          :label="t('landing.nav.getStarted')"
          trailing-icon="i-lucide-arrow-up-right"
          class="min-h-[38px] px-3.5 font-bold text-[#081112] hover:-translate-y-px max-[760px]:hidden"
        />
        <UButton
          :icon="isMenuOpen ? 'i-lucide-x' : 'i-lucide-menu'"
          color="neutral"
          variant="ghost"
          class="hidden size-10 items-center justify-center p-0 text-white max-[760px]:inline-flex"
          :aria-label="isMenuOpen ? t('landing.nav.close') : t('landing.nav.open')"
          aria-controls="mobile-navigation"
          :aria-expanded="isMenuOpen"
          @click="isMenuOpen = !isMenuOpen"
        />
      </div>
    </UContainer>
    <nav
      v-if="isMenuOpen"
      id="mobile-navigation"
      class="mobile-navigation grid w-full gap-1 border-t border-[#dfe1dc] bg-[#f5f5f1] px-3.5 py-3 shadow-[0_18px_35px_rgba(16,20,18,0.12)] min-[761px]:hidden [&_a]:rounded-lg [&_a]:px-4 [&_a]:py-3 [&_a]:text-sm [&_a]:font-medium [&_a]:text-[#202522] [&_a]:transition-colors [&_a:hover]:bg-[#e9ebe6] [&_a:hover]:text-[#087f8f]"
      :aria-label="t('landing.nav.primary')"
    >
      <NuxtLink v-for="item in navigation" :key="item.to" :to="item.to">
        {{ item.label }}
      </NuxtLink>
      <NuxtLink :to="localePath('/get-started')">{{ t('landing.nav.getStarted') }}</NuxtLink>
    </nav>
  </header>
</template>
