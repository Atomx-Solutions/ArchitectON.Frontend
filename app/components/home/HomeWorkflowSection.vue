<script setup lang="ts">
import type { CSSProperties } from 'vue'

const { t } = useI18n()
const localePath = useLocalePath()
const sectionRef = ref<HTMLElement | null>(null)
const progress = ref(0)
let frame = 0

const steps = [
  { key: 'install', icon: 'i-lucide-download' },
  { key: 'chat', icon: 'i-lucide-message-square-text' },
  { key: 'prompt', icon: 'i-lucide-text-cursor-input' },
  { key: 'understand', icon: 'i-lucide-brain-circuit' },
  { key: 'approve', icon: 'i-lucide-circle-check' },
  { key: 'building', icon: 'i-lucide-building-2' }
] as const

const activeStep = computed(() => Math.min(
  steps.length - 1,
  Math.floor(progress.value * steps.length)
))

const flowStyle = computed<CSSProperties>(() => ({
  '--flow-progress': `${Math.min(100, progress.value * 108)}%`
} as CSSProperties))

const updateProgress = () => {
  frame = 0
  const section = sectionRef.value
  if (!section) return

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    progress.value = 1
    return
  }

  const rect = section.getBoundingClientRect()
  const distance = Math.max(1, section.offsetHeight - window.innerHeight)
  progress.value = Math.max(0, Math.min(1, -rect.top / distance))
}

const scheduleUpdate = () => {
  if (frame) return
  frame = window.requestAnimationFrame(updateProgress)
}

onMounted(() => {
  updateProgress()
  window.addEventListener('scroll', scheduleUpdate, { passive: true })
  window.addEventListener('resize', scheduleUpdate)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', scheduleUpdate)
  window.removeEventListener('resize', scheduleUpdate)
  if (frame) window.cancelAnimationFrame(frame)
})
</script>

<template>
  <section
    id="how-it-works"
    ref="sectionRef"
    aria-labelledby="workflow-title"
    class="relative h-[440vh] scroll-mt-20 bg-[#f1f3f0]"
  >
    <div class="sticky top-0 flex min-h-screen items-center overflow-hidden py-5 max-md:items-start max-md:py-4">
      <UContainer class="w-full px-5 max-sm:px-4">
        <header class="grid grid-cols-12 items-end gap-6 border-t border-[#bec7c1] pt-5">
          <div class="col-span-7 max-md:col-span-12">
            <p class="m-0 text-[0.6875rem] font-bold tracking-[0.14em] text-architecton-700 uppercase">
              {{ t('landing.workflow.eyebrow') }}
            </p>
            <h2 id="workflow-title" class="mt-2 mb-0 max-w-3xl text-[clamp(1.75rem,3.2vw,3.25rem)] leading-[1.03] font-semibold tracking-[-0.035em] text-[#101412]">
              {{ t('landing.workflow.title') }}
            </h2>
          </div>
          <p class="col-span-5 m-0 max-w-lg justify-self-end text-sm leading-6 text-[#626d67] max-md:col-span-12 max-md:hidden">
            {{ t('landing.workflow.description') }}
          </p>
        </header>

        <div class="mt-4 border-y border-[#bec7c1] py-3" :style="flowStyle">
          <div class="mb-3 flex items-center justify-between text-[0.625rem] font-bold tracking-[0.12em] text-[#707a74] uppercase">
            <span class="flex items-center gap-2">
              <span class="size-1.5 rounded-full bg-[#1595a5]" />
              {{ t('landing.workflow.canvas.live') }}
            </span>
            <span>0{{ activeStep + 1 }} / 06</span>
          </div>

          <div class="flow-map relative mx-auto h-[clamp(23rem,58vh,31rem)] max-w-5xl max-md:h-[clamp(22rem,62vh,28rem)]">
            <div class="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 bg-[#c8d0cb] max-sm:left-6" aria-hidden="true">
              <div class="flow-line w-full bg-[#1595a5]" />
            </div>

            <ol class="relative grid h-full list-none grid-rows-6 p-0">
              <li
                v-for="(step, index) in steps"
                :key="step.key"
                class="flow-step grid grid-cols-[1fr_3.5rem_1fr] items-center gap-6 max-sm:grid-cols-[3rem_1fr] max-sm:gap-3"
                :class="{
                  active: activeStep === index,
                  complete: activeStep > index
                }"
              >
                <div
                  class="step-copy max-w-sm max-sm:col-start-2 max-sm:row-start-1"
                  :class="index % 2 === 0 ? 'col-start-1 row-start-1 justify-self-end text-right max-sm:justify-self-start max-sm:text-left' : 'col-start-3 row-start-1 justify-self-start text-left max-sm:col-start-2'"
                >
                  <p class="m-0 text-[0.625rem] font-bold tracking-[0.1em] text-architecton-700 uppercase">0{{ index + 1 }}</p>
                  <h3 class="mt-0.5 mb-0 text-sm font-semibold text-[#17201b]">{{ t(`landing.workflow.steps.${step.key}.title`) }}</h3>
                  <p v-if="activeStep === index" class="mt-1 mb-0 max-w-xs text-[0.6875rem] leading-4 text-[#69736e]">
                    {{ t(`landing.workflow.steps.${step.key}.description`) }}
                  </p>
                </div>

                <div class="step-node relative z-10 col-start-2 row-start-1 flex items-center justify-center justify-self-center bg-[#f1f3f0] px-2.5 max-sm:col-start-1">
                  <UIcon :name="step.icon" class="size-5.5" />
                </div>

                <div
                  class="step-visual flex h-18 items-center max-sm:hidden"
                  :class="index % 2 === 0 ? 'col-start-3 row-start-1 justify-self-start' : 'col-start-1 row-start-1 justify-self-end'"
                  aria-hidden="true"
                >
                  <div v-if="step.key === 'install'" class="w-44 border-y border-[#aeb9b2] bg-white px-3 py-2.5">
                    <div class="flex items-center gap-3">
                      <span class="flex size-8 shrink-0 items-center justify-center bg-[#e2efef] text-[#117d8a]">
                        <UIcon name="i-lucide-download" class="size-4.5" />
                      </span>
                      <span class="min-w-0 flex-1">
                        <span class="block text-[0.625rem] font-bold text-[#26312b]">Architecton</span>
                        <span class="mt-1 block h-1 overflow-hidden bg-[#dce2de]"><span class="block h-full w-3/4 bg-[#1595a5]" /></span>
                      </span>
                      <UIcon name="i-lucide-check" class="size-3.5 text-[#2d7b59]" />
                    </div>
                  </div>

                  <div v-else-if="step.key === 'chat'" class="w-44 border border-[#aeb9b2] bg-white shadow-[0_8px_20px_rgba(31,44,37,.08)]">
                    <div class="flex items-center gap-2 border-b border-[#d1d8d4] px-2.5 py-1.5">
                      <span class="flex size-4 items-center justify-center rounded-full bg-[#17211c] text-[0.4375rem] font-bold text-white">A</span>
                      <span class="text-[0.5625rem] font-semibold text-[#26312b]">Architecton</span>
                    </div>
                    <div class="space-y-1.5 px-2.5 py-2">
                      <span class="block h-2.5 w-24 bg-[#e1e6e3]" />
                      <span class="ml-auto block h-2.5 w-20 bg-[#d7e9e9]" />
                      <span class="block h-2.5 w-28 bg-[#e1e6e3]" />
                    </div>
                  </div>

                  <div v-else-if="step.key === 'prompt'" class="w-48 border border-[#aeb9b2] bg-white p-2 shadow-[0_8px_20px_rgba(31,44,37,.07)]">
                    <div class="flex min-h-9 items-end gap-2 border border-[#cbd3ce] px-2 py-1.5">
                      <span class="flex-1 text-[0.5rem] leading-3 text-[#4e5a53]">{{ t('landing.workflow.canvas.prompt') }}</span>
                      <span class="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#18221d] text-white">
                        <UIcon name="i-lucide-arrow-up" class="size-3" />
                      </span>
                    </div>
                  </div>

                  <div v-else-if="step.key === 'understand'" class="relative size-14">
                    <span class="absolute top-1/2 left-1/2 size-5 -translate-1/2 border border-[#26332c] bg-white" />
                    <span class="absolute top-0 left-1/2 size-2 -translate-x-1/2 bg-[#1595a5]" />
                    <span class="absolute bottom-0 left-0 size-2 bg-[#1595a5]" />
                    <span class="absolute right-0 bottom-0 size-2 bg-[#1595a5]" />
                    <svg class="absolute inset-0 size-full"><path d="M28 8v18M8 48l18-16M48 48 32 32" fill="none" stroke="#87938c" /></svg>
                  </div>

                  <div v-else-if="step.key === 'approve'" class="flex items-center gap-3 border-y border-[#aeb9b2] py-2 text-[0.625rem] font-bold tracking-[0.08em] text-[#26312b] uppercase">
                    <span class="flex size-7 items-center justify-center bg-[#dbece5] text-[#217452]"><UIcon name="i-lucide-check" class="size-4" /></span>
                    {{ t('landing.workflow.canvas.approved') }}
                  </div>

                  <svg v-else class="h-20 w-28 overflow-visible" viewBox="0 0 130 110">
                    <path d="m28 19 39-16 36 16-36 17Z" fill="#66726b" stroke="#26332c" stroke-width="1.2" />
                    <path d="m28 19 39 17v69L28 88Z" fill="#e4e9e6" stroke="#26332c" stroke-width="1.2" />
                    <path d="m67 36 36-17v70l-36 16Z" fill="#c9d4cd" stroke="#26332c" stroke-width="1.2" />

                    <g fill="none" stroke="#69766f" stroke-width=".75">
                      <path d="m28 33 39 17 36-17" />
                      <path d="m28 47 39 17 36-17" />
                      <path d="m28 61 39 17 36-17" />
                      <path d="m28 75 39 17 36-17" />
                    </g>

                    <g fill="#a8d6da" stroke="#314039" stroke-width=".65">
                      <path d="m39 28 12 5v8l-12-5Z" />
                      <path d="m39 42 12 5v8l-12-5Z" />
                      <path d="m39 56 12 5v8l-12-5Z" />
                      <path d="m39 70 12 5v8l-12-5Z" />
                      <path d="m39 84 12 5v8l-12-5Z" />

                      <path d="m80 31 12-6v8l-12 6Z" />
                      <path d="m80 45 12-6v8l-12 6Z" />
                      <path d="m80 59 12-6v8l-12 6Z" />
                      <path d="m80 73 12-6v8l-12 6Z" />
                      <path d="m80 87 12-6v8l-12 6Z" />
                    </g>

                    <g fill="none" stroke="#eff7f7" stroke-width=".55">
                      <path d="m45 31v8M45 45v8M45 59v8M45 73v8M45 87v8" />
                      <path d="m86 28v8M86 42v8M86 56v8M86 70v8M86 84v8" />
                    </g>

                    <path d="m55 85 12 5v15l-12-5Z" fill="#f8faf8" stroke="#26332c" stroke-width=".8" />
                    <path d="M23 91 67 110l41-19" fill="none" stroke="#9aa59f" stroke-width=".8" />
                  </svg>
                </div>
              </li>
            </ol>
          </div>

          <div class="flex justify-end pt-5 text-[0.625rem] font-medium text-[#727d77]">
            <NuxtLink
              :to="localePath('/get-started')"
              class="group flex items-center gap-2 font-semibold text-[#264d40] transition-colors hover:text-[#1595a5]"
            >
              {{ t('landing.workflow.canvas.result') }}
              <UIcon name="i-lucide-arrow-right" class="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </NuxtLink>
          </div>
        </div>
      </UContainer>
    </div>
  </section>
</template>

<style scoped>
.flow-line {
  height: var(--flow-progress);
  transition: height .08s linear;
}

.flow-step {
  opacity: .28;
  transition: opacity .3s ease;
}

.flow-step.active,
.flow-step.complete {
  opacity: 1;
}

.step-visual {
  opacity: 0;
  transform: translateY(8px);
  transition: opacity .3s ease, transform .4s ease;
}

.flow-step.active .step-visual,
.flow-step.complete .step-visual {
  opacity: 1;
  transform: translateY(0);
}

.step-node {
  color: #7a857e;
  transition: color .3s ease;
}

.flow-step.active .step-node {
  color: #1595a5;
}

.flow-step.complete .step-node {
  color: #217452;
}

@media (prefers-reduced-motion: reduce) {
  .flow-line,
  .flow-step,
  .step-visual,
  .step-node {
    transition: none;
  }
}
</style>
