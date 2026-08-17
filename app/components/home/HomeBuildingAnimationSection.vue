<script setup lang="ts">
import type { CSSProperties } from 'vue'

const { t } = useI18n()
const sectionRef = ref<HTMLElement | null>(null)
const progress = ref(0)
const stickyOffset = 70
let frame = 0

const phases = [
  { key: 'brief', icon: 'i-lucide-message-square-text', at: 0 },
  { key: 'plan', icon: 'i-lucide-scan-search', at: 0.13 },
  { key: 'ground', icon: 'i-lucide-panels-top-left', at: 0.24 },
  { key: 'upper', icon: 'i-lucide-layers-3', at: 0.54 },
  { key: 'complete', icon: 'i-lucide-badge-check', at: 0.85 }
] as const

const activePhase = computed(() => phases.reduce(
  (active, phase, index) => progress.value >= phase.at ? index : active,
  0
))
const activePhaseData = computed(() => phases[activePhase.value] ?? phases[0])
const percentage = computed(() => Math.round(progress.value * 100))

const stepStyle = (at: number): CSSProperties => ({
  '--reveal': progress.value >= at ? '1' : '0'
} as CSSProperties)

const introStyle = computed<CSSProperties>(() => ({
  opacity: progress.value < 0.13 ? 1 : 0,
  visibility: progress.value < 0.13 ? 'visible' : 'hidden'
}))

const modelChromeStyle = computed<CSSProperties>(() => ({
  opacity: progress.value >= 0.13 ? 1 : 0
}))

const updateProgress = () => {
  frame = 0
  const section = sectionRef.value
  if (!section) return

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    progress.value = 1
    return
  }

  const rect = section.getBoundingClientRect()
  const stickyViewportHeight = window.innerHeight - stickyOffset
  const distance = Math.max(1, section.offsetHeight - stickyViewportHeight)
  progress.value = Math.max(0, Math.min(1, (stickyOffset - rect.top) / distance))
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
    id="building-animation"
    ref="sectionRef"
    aria-labelledby="building-animation-title"
    class="building-story relative h-[380vh] scroll-mt-[70px] bg-[#101412] text-white"
  >
    <div class="story-sticky sticky top-[70px] flex min-h-[calc(100vh-70px)] items-center overflow-hidden py-16 max-md:py-10">
      <div class="pointer-events-none absolute inset-0" aria-hidden="true">
        <div class="absolute top-[8%] right-[8%] size-[28rem] rounded-full bg-[#11c5db]/8 blur-[110px]" />
        <div class="absolute bottom-[4%] left-[18%] size-80 rounded-full bg-[#d35f48]/6 blur-[100px]" />
        <div class="story-grid absolute inset-0 opacity-20" />
      </div>

      <UContainer class="relative w-full px-5 max-sm:px-4">
        <div class="story-layout grid min-h-[calc(100vh-8rem)] grid-cols-12 items-center gap-x-10 gap-y-8 max-md:min-h-[calc(100vh-5rem)]">
          <div class="story-copy col-span-5 max-lg:col-span-6 max-md:col-span-12">
            <p class="story-eyebrow mb-5 flex items-center gap-3 text-xs font-bold tracking-[0.13em] text-[#63d6df] uppercase">
              <span class="size-1.5 rounded-full bg-[#63d6df] shadow-[0_0_18px_#63d6df]" />
              {{ t('landing.building.eyebrow') }}
            </p>
            <h2 id="building-animation-title" class="story-title m-0 max-w-xl text-[clamp(2.35rem,4.5vw,4.25rem)] leading-[1.02] font-semibold tracking-[-0.035em]">
              {{ t('landing.building.title') }}
            </h2>
            <p class="story-description mt-6 max-w-lg text-base leading-7 text-[#aeb9b4]">
              {{ t('landing.building.description') }}
            </p>

            <ol class="story-phases mt-10 grid list-none gap-2 p-0 max-md:hidden">
              <li
                v-for="(phase, index) in phases"
                :key="phase.key"
                class="phase-card grid grid-cols-[2rem_1fr_auto] items-center gap-3 border px-3 py-2.5 transition-all duration-300"
                :class="index === activePhase ? 'phase-card-active border-white/15 bg-white/[0.055] text-white' : 'border-transparent text-[#77817c]'"
              >
                <span class="text-[0.65rem] font-semibold tracking-[0.08em]">0{{ index + 1 }}</span>
                <span class="text-sm font-medium">{{ t(`landing.building.steps.${phase.key}`) }}</span>
                <UIcon :name="phase.icon" class="size-4" aria-hidden="true" />
              </li>
            </ol>
          </div>

          <div class="col-span-7 max-lg:col-span-6 max-md:col-span-12">
            <div class="visual-shell relative mx-auto aspect-[1.08] w-full max-w-[42rem] overflow-hidden rounded-xl border border-white/12 bg-[#171d1a]/90 shadow-[0_28px_80px_rgba(0,0,0,0.3)]">
              <div class="chat-intro" :style="introStyle">
                <header class="chat-header">
                  <span class="chat-header-action"><UIcon name="i-lucide-menu" /></span>
                  <strong>Architecton</strong>
                  <span class="chat-header-action chat-new"><UIcon name="i-lucide-plus" /></span>
                </header>

                <div class="chat-body">
                  <div class="chat-user-row">
                    <div>
                      <p class="chat-message">{{ t('landing.building.chat.request') }}</p>
                      <small>12:58 PM · <UIcon name="i-lucide-copy" /></small>
                    </div>
                    <span class="chat-avatar user-avatar">E</span>
                  </div>

                  <div class="chat-agent-row">
                    <span class="chat-avatar agent-avatar"><UIcon name="i-lucide-house" /></span>
                    <div class="agent-progress">
                      <span class="working-state">
                        <UIcon name="i-lucide-loader-circle" class="working-spinner" />
                        <strong>{{ t('landing.building.chat.working') }}</strong>
                        <UIcon name="i-lucide-chevron-down" />
                      </span>
                      <span class="thinking-dots"><i /><i /><i /></span>
                      <small>12:58 PM ·</small>
                    </div>
                  </div>
                </div>

                <div class="chat-composer">
                  <span>{{ t('landing.building.chat.placeholder') }}</span>
                  <div class="chat-composer-actions">
                    <span><UIcon name="i-lucide-plus" /></span>
                    <span class="approval-mode"><UIcon name="i-lucide-hand" /> {{ t('landing.building.chat.approval') }} <UIcon name="i-lucide-chevron-down" /></span>
                    <span class="chat-stop"><UIcon name="i-lucide-square" /></span>
                  </div>
                </div>
                <p class="chat-disclaimer">{{ t('landing.building.chat.disclaimer') }}</p>
              </div>

              <div class="model-chrome absolute inset-x-5 top-5 z-20 flex items-center justify-between gap-4 max-sm:inset-x-4 max-sm:top-4" :style="modelChromeStyle">
                <div class="build-command flex min-w-0 items-center gap-3 border border-white/10 bg-black/20 px-3 py-2 backdrop-blur-md">
                  <span class="relative flex size-2">
                    <span class="absolute inline-flex size-full animate-ping rounded-full bg-[#63d6df] opacity-50" />
                    <span class="relative inline-flex size-2 rounded-full bg-[#63d6df]" />
                  </span>
                  <span class="truncate text-xs text-[#dce4e0]">{{ t('landing.building.prompt') }}</span>
                </div>
                <span class="shrink-0 font-mono text-xs text-[#8b9892]">{{ percentage }}%</span>
              </div>

              <div class="scene" aria-hidden="true">
                <div class="view-label"><span>3D View</span><span>Fine</span><span>Hidden line</span></div>
                <svg class="bim-model" viewBox="0 0 720 560" role="presentation">
                  <defs>
                    <linearGradient id="front-wall" x1="0" y1="0" x2=".9" y2="1">
                      <stop stop-color="#ffffff" />
                      <stop offset="1" stop-color="#e8e9e7" />
                    </linearGradient>
                    <linearGradient id="side-wall" x1="0" y1="0" x2="1" y2="1">
                      <stop stop-color="#f2f3f1" />
                      <stop offset="1" stop-color="#d5d8d5" />
                    </linearGradient>
                    <pattern id="floor-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(28)">
                      <line x1="0" y1="0" x2="0" y2="6" stroke="#aeb5b1" stroke-width="1" />
                    </pattern>
                    <filter id="model-shadow" x="-20%" y="-20%" width="150%" height="170%">
                      <feDropShadow dx="0" dy="13" stdDeviation="11" flood-color="#26302c" flood-opacity=".22" />
                    </filter>

                    <mask id="front-ground-mask">
                      <rect width="720" height="560" fill="white" />
                      <polygon points="390,496 430,475 430,388 390,409" fill="black" />
                      <polygon points="480,420 530,393 530,340 480,367" fill="black" />
                    </mask>
                    <mask id="side-ground-mask">
                      <rect width="720" height="560" fill="white" />
                      <polygon points="220,403 268,429 268,376 220,350" fill="black" />
                    </mask>
                    <mask id="front-upper-mask">
                      <rect width="720" height="560" fill="white" />
                      <polygon points="397,354 447,327 447,274 397,301" fill="black" />
                      <polygon points="495,309 545,282 545,229 495,256" fill="black" />
                    </mask>
                    <mask id="side-upper-mask">
                      <rect width="720" height="560" fill="white" />
                      <polygon points="220,298 268,323 268,270 220,245" fill="black" />
                    </mask>
                  </defs>

                  <g filter="url(#model-shadow)">
                    <g class="bim-element" :style="stepStyle(0.14)">
                      <polygon class="site" points="72,390 347,244 650,400 370,548" />
                    </g>

                    <g class="bim-element" :style="stepStyle(0.19)">
                      <polygon class="foundation-top" points="128,383 353,264 594,388 366,509" />
                      <polygon class="foundation-edge" points="366,509 594,388 594,400 366,522" />
                      <polygon class="foundation-side" points="128,383 366,509 366,522 128,396" />
                    </g>

                    <!-- Ground floor: every complete wall appears in its own scroll step. -->
                    <g class="bim-element wall-step" :style="stepStyle(0.25)">
                      <polygon class="wall-back" points="128,383 353,264 353,153 128,272" />
                      <polygon class="wall-cap" points="128,272 353,153 360,157 135,276" />
                    </g>
                    <g class="bim-element wall-step" :style="stepStyle(0.31)">
                      <polygon class="wall-side" points="128,383 366,509 366,398 128,272" mask="url(#side-ground-mask)" />
                      <polygon class="wall-cap" points="128,272 366,398 373,394 135,268" />
                    </g>
                    <g class="bim-element wall-step" :style="stepStyle(0.37)">
                      <polygon class="wall-back-right" points="353,264 594,388 594,277 353,153" />
                      <polygon class="wall-cap shade" points="353,153 594,277 587,281 346,157" />
                    </g>
                    <g class="bim-element wall-step" :style="stepStyle(0.43)">
                      <polygon class="wall-front" points="366,509 594,388 594,277 366,398" mask="url(#front-ground-mask)" />
                      <polygon class="wall-cap" points="366,398 594,277 601,281 373,402" />
                    </g>

                    <g class="bim-element" :style="stepStyle(0.49)">
                      <polygon class="mid-slab" points="124,267 353,146 599,272 366,396" />
                      <polygon class="mid-slab-hatch" points="139,266 353,153 583,271 366,386" />
                      <polygon class="slab-edge" points="366,396 599,272 599,283 366,408" />
                      <polygon class="slab-side-edge" points="124,267 366,396 366,408 124,279" />
                    </g>

                    <!-- Upper floor walls remain open at the top, like a Revit axonometric model. -->
                    <g class="bim-element wall-step" :style="stepStyle(0.55)">
                      <polygon class="wall-back" points="124,267 353,146 353,50 124,171" />
                      <polygon class="wall-cap" points="124,171 353,50 360,54 131,175" />
                    </g>
                    <g class="bim-element wall-step" :style="stepStyle(0.61)">
                      <polygon class="wall-side" points="124,267 366,396 366,300 124,171" mask="url(#side-upper-mask)" />
                      <polygon class="wall-cap" points="124,171 366,300 373,296 131,167" />
                    </g>
                    <g class="bim-element wall-step" :style="stepStyle(0.67)">
                      <polygon class="wall-back-right" points="353,146 599,272 599,176 353,50" />
                      <polygon class="wall-cap shade" points="353,50 599,176 592,180 346,54" />
                    </g>
                    <g class="bim-element wall-step" :style="stepStyle(0.73)">
                      <polygon class="wall-front" points="366,396 599,272 599,176 366,300" mask="url(#front-upper-mask)" />
                      <polygon class="wall-cap" points="366,300 599,176 606,180 373,304" />
                    </g>

                    <g class="bim-element interior" :style="stepStyle(0.79)">
                      <polygon class="top-floor" points="143,172 353,61 580,177 366,290" />
                      <polygon class="top-floor-hatch" points="156,173 353,69 566,178 366,281" />
                    </g>

                    <!-- Revit-style hosted windows appear only after all wall openings exist. -->
                    <g class="bim-element fixtures" :style="stepStyle(0.86)">
                      <g class="window side-window">
                        <polygon class="window-frame" points="220,403 268,429 268,376 220,350" />
                        <polygon class="window-pane" points="226,396 262,415 262,383 226,363" />
                        <path d="M238 402v-33m12 39v-33M226 379l36 19" />
                        <path class="sill" d="m217 403 52 29 5-3-52-29Z" />
                      </g>
                      <g class="window front-window">
                        <polygon class="window-frame" points="480,420 530,393 530,340 480,367" />
                        <polygon class="window-pane" points="486,411 524,391 524,351 486,371" />
                        <path d="M499 404v-40m12 33v-40M486 391l38-20" />
                        <path class="sill" d="m477 421 54-29 5 3-54 29Z" />
                      </g>
                      <g class="window side-window">
                        <polygon class="window-pane" points="226,291 262,310 262,277 226,258" />
                        <path d="M238 297v-33m12 39v-33M226 274l36 19" />
                        <path class="sill" d="m217 298 52 28 5-3-52-28Z" />
                      </g>
                      <g class="window front-window">
                        <polygon class="window-frame" points="397,354 447,327 447,274 397,301" />
                        <polygon class="window-pane" points="403,345 441,325 441,285 403,305" />
                        <path d="M416 338v-40m12 33v-40M403 325l38-20" />
                        <path class="sill" d="m394 355 54-29 5 3-54 29Z" />
                      </g>
                      <g class="window front-window">
                        <polygon class="window-frame" points="495,309 545,282 545,229 495,256" />
                        <polygon class="window-pane" points="501,300 539,280 539,240 501,260" />
                        <path d="M514 293v-40m12 33v-40M501 280l38-20" />
                        <path class="sill" d="m492 310 54-29 5 3-54 29Z" />
                      </g>
                    </g>

                    <g class="bim-element entrance" :style="stepStyle(0.91)">
                      <polygon class="door-frame" points="390,496 430,475 430,388 390,409" />
                      <polygon class="door-panel" points="396,488 424,473 424,399 396,414" />
                      <circle cx="418" cy="440" r="2" />
                      <polygon class="threshold" points="386,497 430,474 437,478 393,502" />
                    </g>

                    <g class="bim-element top-rim" :style="stepStyle(0.94)">
                      <path d="M124 171 353 50 599 176 366 300 124 171" />
                      <path d="M137 174 353 60 585 179 366 290 137 174" />
                    </g>

                    <g class="bim-element roof" :style="stepStyle(0.97)">
                      <polygon class="roof-plane roof-north" points="110,171 353,42 360,116" />
                      <polygon class="roof-plane roof-east" points="353,42 614,175 360,116" />
                      <polygon class="roof-plane roof-south" points="614,175 366,315 360,116" />
                      <polygon class="roof-plane roof-west" points="366,315 110,171 360,116" />
                      <path class="roof-hips" d="M360 116 110 171M360 116 353 42M360 116 614 175M360 116 366 315" />
                      <path class="roof-eave" d="M110 171 366 315M353 42 614 175" />
                    </g>
                  </g>

                </svg>
                <div class="view-cube" aria-label="3D view orientation">
                  <svg viewBox="0 0 120 108" role="img" aria-hidden="true">
                    <path class="orbit orbit-back" d="M17 67C4 75 7 87 25 94c20 8 57 7 78-3 14-7 16-17 5-24" />
                    <path class="orbit orbit-front" d="M10 79c2 9 16 17 35 20 23 4 49-1 61-10" />
                    <path class="orbit-arrow-head" d="m13 65 7 1-3 7" />
                    <path class="orbit-arrow-head" d="m107 89-7-1 3-7" />

                    <polygon class="cube-face cube-top" points="58,7 94,27 58,47 22,27" />
                    <polygon class="cube-face cube-front" points="22,27 58,47 58,85 22,65" />
                    <polygon class="cube-face cube-right" points="58,47 94,27 94,65 58,85" />

                    <path class="cube-edge" d="M58 7 94 27 94 65 58 85 22 65 22 27 58 7Zm0 40L22 27m36 20 36-20m-36 20v38" />
                    <text class="cube-label cube-label-top" x="58" y="27">TOP</text>
                    <text class="cube-label cube-label-front" x="40" y="58">FRONT</text>
                    <text class="cube-label cube-label-right" x="77" y="58">RIGHT</text>

                    <g class="orbit-control orbit-control-left">
                      <circle cx="15" cy="82" r="7" />
                      <path d="m17 78-4 4 4 4" />
                    </g>
                    <g class="orbit-control orbit-control-right">
                      <circle cx="105" cy="82" r="7" />
                      <path d="m103 78 4 4-4 4" />
                    </g>
                  </svg>
                </div>
              </div>

              <div class="build-status model-chrome absolute inset-x-5 bottom-5 z-20 grid grid-cols-[1fr_auto] items-center gap-4 border border-white/10 bg-[#111613]/94 p-4 backdrop-blur-md max-sm:inset-x-4 max-sm:bottom-4" :style="modelChromeStyle">
                <div class="min-w-0">
                  <p class="m-0 text-[0.65rem] font-bold tracking-[0.12em] text-[#63d6df] uppercase">{{ t('landing.building.agent') }}</p>
                  <p class="mt-1 mb-0 truncate text-sm font-medium text-white">{{ t(`landing.building.status.${activePhaseData.key}`) }}</p>
                </div>
                <span class="grid size-9 place-items-center rounded-full border border-[#63d6df]/25 bg-[#63d6df]/10">
                  <UIcon :name="activePhaseData.icon" class="size-4 text-[#63d6df]" aria-hidden="true" />
                </span>
              </div>
            </div>

            <div class="mt-5 flex items-center gap-4 md:hidden">
              <span class="text-xs font-semibold text-[#63d6df]">0{{ activePhase + 1 }}</span>
              <div class="h-px flex-1 bg-white/10"><div class="h-px bg-[#63d6df]" :style="{ width: `${percentage}%` }" /></div>
              <span class="text-xs text-[#aeb9b4]">{{ t(`landing.building.steps.${activePhaseData.key}`) }}</span>
            </div>
          </div>
        </div>
      </UContainer>
    </div>
  </section>
</template>

<style scoped>
.story-grid {
  background-image: linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px);
  background-size: 4.5rem 4.5rem;
  mask-image: linear-gradient(to bottom, transparent, black 20%, black 80%, transparent);
}
.phase-card { position: relative; overflow: hidden; border-radius: .42rem; }
.phase-card::before { position: absolute; inset-block: .55rem; left: 0; width: 2px; background: transparent; content: ''; transition: background-color 180ms ease; }
.phase-card-active::before { background: #63d6df; }
.visual-shell { isolation: isolate; }
.visual-shell::before { position: absolute; z-index: 30; inset: 0; pointer-events: none; border: 1px solid rgba(255,255,255,.035); border-radius: inherit; content: ''; }
.visual-shell::after { position: absolute; inset: 0; pointer-events: none; box-shadow: inset 0 0 70px rgba(0,0,0,.22); content: ''; }
.build-command,.build-status { border-radius: .5rem; box-shadow: 0 8px 24px rgba(0,0,0,.12); }
.scene { position: absolute; inset: 3.75rem .35rem 4.75rem; overflow: hidden; border: 1px solid rgba(45,58,52,.15); border-radius: .55rem; background: radial-gradient(circle at 52% 42%,#fbfcfb 0,#eef1ef 52%,#d9dedb 100%); }
.scene::before { position: absolute; inset: 0; z-index: 1; pointer-events: none; background: linear-gradient(135deg,rgba(255,255,255,.82),transparent 38%); content: ''; }
.bim-model { position: absolute; z-index: 2; inset: 0; width: 100%; height: 100%; }
.model-chrome { transition: opacity 180ms ease; }
.chat-intro { position: absolute; z-index: 40; inset: 0; display: flex; flex-direction: column; overflow: hidden; border-radius: inherit; background: #222623; color: #f4f6f5; transition: opacity 180ms ease; }
.chat-header { display: grid; grid-template-columns: 2.15rem 1fr 2.15rem; align-items: center; gap: .75rem; min-height: 4rem; border-bottom: 1px solid #383d3a; padding: 0 1rem; }
.chat-header strong { font-size: 1rem; font-weight: 650; letter-spacing: -.015em; }
.chat-header-action { display: grid; width: 1.8rem; height: 1.8rem; place-items: center; border: 1px solid #414743; border-radius: .38rem; background: #2d322f; color: #d8ddda; }
.chat-header-action :deep(svg) { width: .95rem; height: .95rem; }
.chat-new { justify-self: end; }
.chat-body { display: flex; flex: 1; flex-direction: column; gap: 2.5rem; padding: 1.6rem 1.1rem; }
.chat-user-row { display: flex; align-items: flex-start; justify-content: flex-end; gap: .7rem; }
.chat-user-row > div { max-width: 78%; }
.chat-message { margin: 0; border: 1px solid #4a504c; border-radius: .7rem; background: #353a36; padding: .75rem .9rem; box-shadow: 0 7px 20px rgba(0,0,0,.1); font-size: .78rem; line-height: 1.5; color: #fff; }
.chat-user-row small,.chat-agent-row small { display: flex; align-items: center; gap: .32rem; margin-top: .35rem; color: #87918c; font-size: .58rem; }
.chat-user-row small { justify-content: flex-end; }
.chat-user-row small :deep(svg) { width: .7rem; height: .7rem; }
.chat-avatar { display: grid; width: 2rem; height: 2rem; flex: 0 0 2rem; place-items: center; border-radius: 999px; font-size: .68rem; font-weight: 650; }
.user-avatar { background: #454b47; color: #fff; }
.agent-avatar { border: 1px solid #d8ddda; background: #f6f8f7; color: #34433c; }
.agent-avatar :deep(svg) { width: 1rem; height: 1rem; }
.chat-agent-row { display: flex; align-items: flex-start; gap: .8rem; }
.agent-progress { display: flex; flex-direction: column; align-items: flex-start; }
.working-state { display: inline-flex; min-height: 2.15rem; align-items: center; gap: .45rem; border: 1px solid #414843; border-radius: .5rem; padding: 0 .7rem; color: #dce2de; font-size: .68rem; }
.working-state :deep(svg) { width: .78rem; height: .78rem; color: #9ba59f; }
.working-spinner { animation: working-spin 1.1s linear infinite; }
.thinking-dots { display: flex; gap: .25rem; margin-top: 1rem; }
.thinking-dots i { width: .34rem; height: .34rem; border-radius: 999px; background: #8d9691; animation: thinking 1.2s infinite ease-in-out; }
.thinking-dots i:nth-child(2) { animation-delay: 120ms; }
.thinking-dots i:nth-child(3) { animation-delay: 240ms; }
.chat-composer { margin: 0 1rem; border: 1px solid #48504b; border-radius: .65rem; background: #252a27; padding: 1rem; box-shadow: 0 10px 28px rgba(0,0,0,.12); color: #9ca6a1; font-size: .78rem; }
.chat-composer-actions { display: flex; align-items: center; gap: .8rem; margin-top: 1rem; color: #d7ddd9; }
.chat-composer-actions > span { display: flex; align-items: center; gap: .35rem; }
.chat-composer-actions :deep(svg) { width: .8rem; height: .8rem; }
.approval-mode { font-size: .65rem; }
.chat-stop { display: grid !important; width: 1.75rem; height: 1.75rem; margin-left: auto; place-items: center; border-radius: 999px; background: #eef1ef; color: #333a36; }
.chat-disclaimer { margin: .5rem 0 .6rem; text-align: center; color: #748079; font-size: .5rem; }
@keyframes thinking { 0%,60%,100% { opacity: .35; transform: translateY(0); } 30% { opacity: 1; transform: translateY(-2px); } }
@keyframes working-spin { to { transform: rotate(360deg); } }
.bim-element { opacity: var(--reveal); transition: opacity 90ms linear; }
.wall-step { transition: opacity 70ms linear; }
.site { fill: #e8ecea; stroke: #7c8a84; stroke-width: 1.1; }
.foundation-top,.mid-slab { fill: #f7f8f7; stroke: #26322d; stroke-width: 1.25; }
.foundation-edge,.slab-edge { fill: #c9cfcc; stroke: #26322d; stroke-width: 1.15; }
.foundation-side,.slab-side-edge { fill: #d8ddda; stroke: #26322d; stroke-width: 1.15; }
.mid-slab-hatch,.top-floor-hatch { fill: url(#floor-hatch); stroke: #747f7a; stroke-width: .7; }
.top-floor { fill: #f3f4f2; stroke: #26322d; stroke-width: 1.1; }
.wall-front { fill: url(#front-wall); stroke: #202824; stroke-width: 1.35; stroke-linejoin: round; }
.wall-side { fill: url(#side-wall); stroke: #202824; stroke-width: 1.35; stroke-linejoin: round; }
.wall-back { fill: #dfe2e0; stroke: #202824; stroke-width: 1.25; }
.wall-back-right { fill: #d4d8d5; stroke: #202824; stroke-width: 1.25; }
.wall-cap { fill: #fafbfa; stroke: #202824; stroke-width: 1.05; }
.wall-cap.shade { fill: #e4e7e5; }
.window-frame { fill: #f7f8f7; stroke: #121815; stroke-width: 3; stroke-linejoin: round; }
.window-pane { fill: #dce3e0; stroke: #202824; stroke-width: 1.1; }
.window path { fill: none; stroke: #202824; stroke-width: 1.25; }
.window .sill { fill: #eef0ef; stroke: #202824; stroke-width: .85; }
.door-frame { fill: #f8f9f8; stroke: #151c19; stroke-width: 2.6; }
.door-panel { fill: #eceeec; stroke: #202824; stroke-width: 1.1; }
.entrance circle { fill: #303a35; }
.threshold { fill: #d2d7d4; stroke: #202824; stroke-width: .8; }
.top-rim path { fill: none; stroke: #151d19; stroke-width: 5.5; stroke-linejoin: miter; }
.top-rim path + path { stroke: #f8f9f8; stroke-width: 3.4; }
.roof-plane { stroke: #252d29; stroke-width: 1.35; stroke-linejoin: round; }
.roof-north { fill: #d9dcda; }
.roof-east { fill: #c9ceca; }
.roof-south { fill: #e2e5e2; }
.roof-west { fill: #eef0ed; }
.roof-hips { fill: none; stroke: #3b4540; stroke-width: 1.4; stroke-linecap: round; }
.roof-eave { fill: none; stroke: #38433e; stroke-width: 2; stroke-linecap: square; }
.view-label { position: absolute; z-index: 4; top: .75rem; left: .75rem; display: flex; gap: .35rem; color: #53615b; font-size: .6rem; font-weight: 650; letter-spacing: .04em; text-transform: uppercase; }
.view-label span { border: 1px solid #aeb9b4; border-radius: .2rem; background: rgba(247,249,248,.9); padding: .28rem .42rem; }
.view-cube { position: absolute; z-index: 4; top: .65rem; right: .75rem; width: 6.25rem; height: 5.65rem; filter: drop-shadow(0 4px 7px rgba(42,53,48,.14)); }
.view-cube > svg { display: block; width: 100%; height: 100%; overflow: visible; }
.cube-face { stroke: none; }
.cube-top { fill: rgba(251,252,251,.98); }
.cube-front { fill: rgba(230,234,231,.98); }
.cube-right { fill: rgba(207,214,210,.98); }
.cube-edge { fill: none; stroke: #75817b; stroke-width: 1.15; stroke-linecap: square; stroke-linejoin: miter; }
.cube-label { fill: #52605a; font-family: Inter,sans-serif; font-size: 7px; font-weight: 700; letter-spacing: .35px; text-anchor: middle; dominant-baseline: middle; }
.cube-label-top { transform: rotate(29deg); transform-origin: 58px 27px; }
.cube-label-front { transform: rotate(29deg); transform-origin: 40px 58px; }
.cube-label-right { transform: rotate(-29deg); transform-origin: 77px 58px; }
.orbit { fill: none; stroke: #929d97; stroke-width: 1; stroke-linecap: round; }
.orbit-back { stroke-dasharray: 2 3; opacity: .62; }
.orbit-front { opacity: .9; }
.orbit-arrow-head { fill: none; stroke: #7c8882; stroke-width: 1.2; stroke-linecap: round; stroke-linejoin: round; }
.orbit-control circle { fill: rgba(247,249,248,.98); stroke: #8d9993; stroke-width: 1; }
.orbit-control path { fill: none; stroke: #5f6d66; stroke-width: 1.2; stroke-linecap: round; stroke-linejoin: round; }
/* Keep the complete copy and all five phases visible on standard laptop screens. */
@media (min-width: 768px) and (max-height: 900px) {
  .story-sticky { padding-block: 1.5rem; }
  .story-layout { min-height: calc(100vh - 70px - 3rem); }
  .story-eyebrow { margin-bottom: .75rem; }
  .story-title { font-size: clamp(2.35rem, 3.7vw, 3.75rem); line-height: 1; }
  .story-description { margin-top: 1rem; line-height: 1.5rem; }
  .story-phases { margin-top: 1.5rem; gap: .25rem; }
  .phase-card { padding-block: .5rem; }
  .visual-shell { width: min(100%, calc((100vh - 70px - 3rem) * 1.08)); }
}
@media (max-width: 767px) {
  .building-story { height: 340vh; }
  .visual-shell { max-height: 49vh; }
  .scene { inset: 3rem .15rem 4rem; }
  .view-label { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .bim-element { transition: none; }
  .visual-shell .animate-ping { animation: none; }
}
</style>
