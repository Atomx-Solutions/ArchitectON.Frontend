<script setup lang="ts">
import type { PlatformBuild, PlatformInfo } from '~/data/platforms'

const props = defineProps<{
  platform: PlatformInfo
  builds: PlatformBuild[]
}>()

const selectedVersion = defineModel<string>('version', { required: true })
const versionOptions = computed(() => props.builds.map(build => ({
  label: `${props.platform.name} ${build.version}`,
  value: build.version
})))
const selectedBuild = computed(() => props.builds.find(build => build.version === selectedVersion.value))
const isDownloadAvailable = computed(() => selectedBuild.value?.status === 'available' && Boolean(selectedBuild.value.releaseUrl))
const installerName = computed(() => selectedBuild.value?.releaseUrl?.split('/').at(-1) ?? `${props.platform.name.toLowerCase()}-installer.exe`)
const buildStatus = computed(() => {
  if (selectedBuild.value?.status === 'available') return 'Verified release'
  if (selectedBuild.value?.status === 'preview') return 'Preview build'
  return 'Planned compatibility'
})
</script>

<template>
  <aside class="overflow-hidden rounded-[1.15rem] border border-white/12 bg-[#151a17]/92 shadow-[0_38px_90px_rgba(0,0,0,.42)] backdrop-blur-xl" aria-label="Download Architecton installer">
    <header class="flex items-center justify-between border-b border-white/10 px-6 py-5 max-sm:px-5">
      <div class="flex min-w-0 items-center gap-3.5">
        <img :src="platform.iconUrl" :alt="`${platform.name} icon`" class="size-10 shrink-0 object-contain" :class="platform.id === 'revit' ? 'bg-transparent' : 'rounded-lg bg-white'">
        <div class="min-w-0">
          <p class="m-0 truncate text-sm font-semibold text-white">Architecton for {{ platform.name }}</p>
          <p class="mt-1 mb-0 text-[.68rem] text-white/42">Windows installer</p>
        </div>
      </div>
      <span class="flex shrink-0 items-center gap-2 text-[.65rem] font-bold tracking-[.08em] text-white/55 uppercase">
        <span class="size-1.5 rounded-full" :class="isDownloadAvailable ? (platform.id === 'revit' ? 'bg-[#2f7cf6]' : 'bg-[#00a6d6]') : 'bg-[#737b76]'" />
        {{ buildStatus }}
      </span>
    </header>

    <div class="p-6 max-sm:p-5">
      <label for="platform-version" class="mb-3 block text-[.68rem] font-bold tracking-[.12em] text-white/48 uppercase">{{ platform.name }} version</label>
      <USelect
        id="platform-version"
        v-model="selectedVersion"
        :items="versionOptions"
        :content="{ bodyLock: false }"
        size="xl"
        aria-label="Host application version"
        class="w-full"
        :ui="{
          base: 'h-14 cursor-pointer rounded-lg bg-white/[.055] px-4 text-white ring-white/12 hover:bg-white/[.075] hover:ring-white/20 focus-visible:ring-2',
          value: 'font-semibold',
          trailingIcon: 'text-white/45'
        }"
      />

      <div class="mt-5 grid grid-cols-2 divide-x divide-white/10 rounded-lg border border-white/10 bg-black/10">
        <div class="px-4 py-3.5">
          <p class="m-0 text-[.62rem] font-bold tracking-[.1em] text-white/35 uppercase">System</p>
          <p class="mt-1.5 mb-0 flex items-center gap-2 text-xs font-semibold text-white/82"><UIcon name="i-lucide-monitor" class="size-3.5" /> Windows x64</p>
        </div>
        <div class="px-4 py-3.5">
          <p class="m-0 text-[.62rem] font-bold tracking-[.1em] text-white/35 uppercase">Package</p>
          <p class="mt-1.5 mb-0 flex items-center gap-2 text-xs font-semibold text-white/82"><UIcon name="i-lucide-package-check" class="size-3.5" /> Installer .exe</p>
        </div>
      </div>

      <div class="mt-6 flex items-start gap-3 border-t border-white/10 pt-5">
        <UIcon name="i-lucide-shield-check" class="mt-0.5 size-4 shrink-0" :class="platform.id === 'revit' ? 'text-[#6ea0ff]' : 'text-[#4dc9e8]'" />
        <div class="min-w-0">
          <p class="m-0 truncate font-mono text-[.65rem] text-white/52">{{ installerName }}</p>
          <p class="mt-1 mb-0 text-[.68rem] leading-5 text-white/38">Close {{ platform.name }} before setup. Your project files are not modified during installation.</p>
        </div>
      </div>

      <UButton
        v-if="isDownloadAvailable"
        :href="selectedBuild!.releaseUrl!"
        size="xl"
        block
        external
        trailing-icon="i-lucide-arrow-down-to-line"
        class="mt-5 min-h-14 justify-between rounded-lg px-5 font-bold transition hover:-translate-y-0.5"
        :class="platform.id === 'revit' ? 'bg-[#2f7cf6] text-white hover:bg-[#236ce1]' : 'bg-[#00a6d6] text-[#071113] hover:bg-[#13b5e4]'"
        download
      >
        Download {{ platform.name }} installer
      </UButton>
      <UButton v-else color="neutral" size="xl" disabled block class="mt-5 min-h-14">
        <template #leading><UIcon name="i-lucide-clock-3" /></template>
        Installer coming soon
      </UButton>
    </div>

    <footer class="flex items-center justify-between gap-4 border-t border-white/10 bg-black/10 px-6 py-4 text-[.68rem] max-sm:px-5">
      <span class="text-white/38">Need help with setup?</span>
      <UButton :to="`/docs/${platform.id}-installation`" label="Installation guide" trailing-icon="i-lucide-arrow-up-right" color="neutral" variant="link" size="xs" class="p-0 font-semibold text-white/72 hover:text-white" />
    </footer>
  </aside>
</template>
