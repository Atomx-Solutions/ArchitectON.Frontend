<script setup lang="ts">
import { platforms, type PlatformId } from '~/data/platforms'

const platformOrder: PlatformId[] = ['revit', 'archicad']
const requestUrl = useRequestURL()
const route = useRoute()

const installationSteps = [
  { icon: 'i-lucide-layout-grid', title: 'Choose the host', description: 'Select Revit or Archicad.' },
  { icon: 'i-lucide-git-compare-arrows', title: 'Match the version', description: 'Use your exact BIM release.' },
  { icon: 'i-lucide-download', title: 'Run the installer', description: 'Install the verified x64 build.' },
  { icon: 'i-lucide-message-square', title: 'Open Architecton', description: 'Sign in from the BIM toolbar.' }
] as const

const requirements = [
  { icon: 'i-lucide-monitor', label: 'Operating system', value: 'Windows 64-bit', note: 'A supported desktop edition of Windows.' },
  { icon: 'i-lucide-box', label: 'BIM application', value: 'Revit or Archicad', note: 'Install the build for the exact host release.' },
  { icon: 'i-lucide-user-round-check', label: 'Access', value: 'Architecton account', note: 'Sign in after the integration is installed.' }
] as const

const faqs = [
  {
    question: 'What does Architecton install?',
    answer: 'A version-specific integration inside Revit or Archicad. It works with the active BIM project; it does not replace your authoring application.'
  },
  {
    question: 'Why do host versions need to match?',
    answer: 'Each Revit and Archicad release uses a specific API. The matching Architecton build provides the correct and validated connection.'
  },
  {
    question: 'Are model changes applied automatically?',
    answer: 'No. Model-changing work remains reviewable and requires confirmation before it is applied to the active project.'
  }
] as const

const canonicalUrl = computed(() => new URL(route.path, requestUrl.origin).toString())
const socialImage = new URL('/images/architecton-hero-bim.png', requestUrl.origin).toString()

useSeoMeta({
  title: 'Download Architecton for Revit & Archicad',
  description: 'Download Architecton for Autodesk Revit or Graphisoft Archicad. Select your BIM host version, get the compatible Windows installer, and follow the setup guide.',
  ogType: 'website',
  ogTitle: 'Download Architecton for Revit & Archicad',
  ogDescription: 'Choose your BIM platform, match the host version, and install Architecton inside your Revit or Archicad workflow.',
  ogUrl: canonicalUrl,
  ogImage: socialImage,
  ogImageAlt: 'Architecton AI agent working with a coordinated BIM model',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Download Architecton for Revit & Archicad',
  twitterDescription: 'Choose a verified Architecton integration for your Revit or Archicad version.',
  twitterImage: socialImage,
  robots: 'index, follow'
})

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Architecton',
        applicationCategory: 'BusinessApplication',
        applicationSubCategory: 'Building Information Modeling software',
        operatingSystem: 'Windows 64-bit',
        description: 'AI-powered BIM integration for reading, creating, and coordinating native models in Autodesk Revit and Graphisoft Archicad.',
        url: canonicalUrl.value,
        downloadUrl: canonicalUrl.value,
        featureList: ['Native Revit and Archicad integration', 'Version-specific BIM builds', 'Reviewable AI-assisted model changes']
      })
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(item => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer }
        }))
      })
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: 'How to install Architecton for Revit or Archicad',
        description: 'Choose the correct BIM host and version, install the verified Architecton build, and sign in from the host application.',
        step: installationSteps.map((step, index) => ({
          '@type': 'HowToStep',
          position: index + 1,
          name: step.title,
          text: step.description,
          url: `${canonicalUrl.value}#installation-step-${index + 1}`
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
          { '@type': 'ListItem', position: 2, name: 'Download Architecton', item: canonicalUrl.value }
        ]
      })
    }
  ]
})
</script>

<template>
  <main class="bg-[#edf1ef] pt-[70px] text-[#101412]">
    <section aria-labelledby="get-started-title" class="relative isolate overflow-hidden bg-[#101412] text-white">
      <div class="pointer-events-none absolute inset-0" aria-hidden="true">
        <div class="hero-grid absolute inset-0" />
        <div class="hero-glow absolute top-1/2 right-[8%] size-[26rem] -translate-y-1/2 rounded-full bg-[#4bd3df]/10 blur-[110px]" />
      </div>

      <UContainer class="relative grid min-h-[34rem] grid-cols-12 items-center gap-x-14 gap-y-12 px-5 py-16 max-md:min-h-0 max-md:py-14 max-sm:px-4">
        <div class="col-span-7 max-lg:col-span-6 max-md:col-span-12">
          <p class="mb-5 flex items-center gap-3 text-xs font-bold tracking-[.14em] text-[#63d6df] uppercase">
            <span class="signal-dot size-1.5 rounded-full bg-[#63d6df]" />
            Download Architecton
          </p>
          <h1 id="get-started-title" class="m-0 max-w-3xl text-[clamp(2.8rem,5.4vw,4.9rem)] leading-[.98] font-semibold tracking-[-.045em]">
            Architecton,<br>ready for your BIM tool.
          </h1>
          <p class="mt-6 max-w-xl text-base leading-7 text-[#adb9b3]">
            Choose Revit or Archicad, match your installed version, and get the correct Architecton integration for Windows.
          </p>
          <a href="#platforms" class="mt-8 inline-flex items-center gap-2 border-b border-[#63d6df]/50 pb-1 text-sm font-semibold text-white transition-colors hover:border-[#63d6df] hover:text-[#63d6df]">
            Choose your platform
            <UIcon name="i-lucide-arrow-down" class="size-4" />
          </a>
        </div>

        <div class="col-span-5 max-lg:col-span-6 max-md:col-span-12" aria-label="Animated Architecton workflow from prompt to building">
          <div class="journey-window relative overflow-hidden rounded-xl border border-white/12 bg-[#151b18]/95 shadow-[0_28px_80px_rgba(0,0,0,.3)]">
            <div class="flex h-12 items-center justify-between border-b border-white/10 px-4">
              <span class="flex items-center gap-2.5 text-xs font-semibold text-[#dbe2de]"><span class="size-2 rounded-full bg-[#63d6df]" /> Architecton workflow</span>
              <span class="font-mono text-[.6rem] text-[#718079]">PROMPT → BIM</span>
            </div>

            <svg class="journey-scene block w-full" viewBox="0 0 720 410" role="img" aria-labelledby="journey-title journey-description">
              <title id="journey-title">From an architectural prompt to a BIM building</title>
              <desc id="journey-description">An Architecton AI agent reads a prompt, prepares and carries the coordinated plan, then turns it into a native BIM building.</desc>
              <defs>
                <linearGradient id="journey-building-front" x1="0" y1="0" x2="1" y2="1">
                  <stop stop-color="#e8efeb" />
                  <stop offset="1" stop-color="#9daaa4" />
                </linearGradient>
                <linearGradient id="journey-building-side" x1="0" y1="0" x2="1" y2="1">
                  <stop stop-color="#77867f" />
                  <stop offset="1" stop-color="#53615a" />
                </linearGradient>
                <radialGradient id="robot-shell" cx="35%" cy="22%" r="82%">
                  <stop stop-color="#ffffff" />
                  <stop offset=".55" stop-color="#eaf0ed" />
                  <stop offset="1" stop-color="#aab7b1" />
                </radialGradient>
                <linearGradient id="robot-body" x1=".2" y1="0" x2=".8" y2="1">
                  <stop stop-color="#f8fbf9" />
                  <stop offset=".58" stop-color="#d7e0dc" />
                  <stop offset="1" stop-color="#8e9c95" />
                </linearGradient>
                <radialGradient id="robot-visor" cx="50%" cy="38%" r="80%">
                  <stop stop-color="#24342d" />
                  <stop offset="1" stop-color="#080d0b" />
                </radialGradient>
                <pattern id="journey-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M20 0H0V20" fill="none" stroke="#839089" stroke-opacity=".09" stroke-width="1" />
                </pattern>
                <filter id="journey-shadow" x="-30%" y="-30%" width="170%" height="180%">
                  <feDropShadow dx="0" dy="10" stdDeviation="8" flood-color="#050807" flood-opacity=".28" />
                </filter>
              </defs>

              <rect width="720" height="410" fill="#141a17" />
              <rect width="720" height="410" fill="url(#journey-grid)" />
              <path class="journey-route" d="M210 327C285 327 299 327 354 327S455 327 526 327" />
              <path d="M24 328H696" stroke="#66746d" stroke-opacity=".28" />

              <!-- Prompt station -->
              <g class="prompt-station">
                <rect x="28" y="58" width="181" height="116" rx="8" fill="#0e1311" stroke="#39433e" />
                <rect x="39" y="69" width="159" height="94" rx="4" fill="#edf2ef" />
                <circle cx="48" cy="78" r="2.5" fill="#ee6d52" />
                <circle cx="57" cy="78" r="2.5" fill="#e0b84e" />
                <circle cx="66" cy="78" r="2.5" fill="#63d6df" />
                <rect x="48" y="94" width="132" height="48" rx="5" fill="#dfe7e3" stroke="#aebbb5" />
                <circle cx="58" cy="106" r="3" fill="#25bfcf" />
                <path class="typed-line typed-line-one" d="M68 106H165" />
                <path class="typed-line typed-line-two" d="M58 119H147" />
                <path class="typed-line typed-line-three" d="M58 132H123" />
                <rect class="prompt-cursor" x="126" y="127" width="2" height="8" fill="#1d817f" />
                <path d="M105 175v22m-30 7h60M50 214h137v10H50z" fill="none" stroke="#77857e" stroke-width="3" />
                <path d="M35 224h168" stroke="#8f9c95" stroke-width="3" />
                <text x="34" y="249" fill="#718079" font-size="9" font-weight="700" letter-spacing="1.2">01 / WRITE THE BRIEF</text>
              </g>

              <!-- Plan prepared by Architecton -->
              <g class="plan-station" filter="url(#journey-shadow)">
                <path d="M315 68h128v169H315z" fill="#f5f7f5" stroke="#63d6df" stroke-width="1.2" />
                <path d="m431 68 12 12h-12z" fill="#dbe4df" stroke="#9eaaa4" stroke-width=".6" />

                <!-- Drawing header and approval mark. -->
                <text x="323" y="80" fill="#24312b" font-size="5.2" font-weight="700" letter-spacing=".7">ARCHITECTON / GENERAL ARRANGEMENT</text>
                <text x="323" y="88" fill="#738079" font-size="4.2" letter-spacing=".45">GROUND FLOOR · LEVEL 01</text>
                <circle cx="431" cy="88" r="6" fill="#63d6df" />
                <path d="m427.8 88 2.1 2.1 4.2-5" fill="none" stroke="#0c1714" stroke-width="1.4" />

                <!-- Dimension strings. -->
                <g fill="none" stroke="#7d8a84" stroke-width=".45">
                  <path d="M328 101V94m93 7V94M328 96h93m-90-2-3 2 3 2m87-4 3 2-3 2" />
                  <path d="M325 103h-6m6 91h-6m2-91v91m-2-88 2-3 2 3m-4 85 2 3 2-3" />
                </g>
                <text x="368" y="94" fill="#64716b" font-size="4.4">9 600</text>
                <text x="318" y="153" fill="#64716b" font-size="4.4" transform="rotate(-90 318 153)">8 400</text>

                <!-- Architectural floor plan: exterior walls, rooms, openings, and fixtures. -->
                <g fill="none" stroke="#26342e">
                  <path d="M327 101h96v94h-96z" stroke-width="2.8" />
                  <path d="M370 102v54m0 17v21M327 151h31m17 0h48M394 151v16m0 16v11" stroke-width="1.8" />
                  <path d="M327 123h4m-4 19h4m88-25h4m-4 46h4M346 101v4h14v-4m42 0v4h12v-4" stroke="#63d6df" stroke-width="2.2" />
                  <path d="M370 156h12m-12 0a12 12 0 0 1 12 12M394 167h11m-11 0a11 11 0 0 0 11 11M358 151v11m0-11a11 11 0 0 1 11 11" stroke-width=".8" />
                </g>
                <g fill="#59665f" font-size="4.5" text-anchor="middle">
                  <text x="349" y="127">LIVING</text>
                  <text x="396" y="127">KITCHEN</text>
                  <text x="347" y="177">BED 01</text>
                  <text x="406" y="181">ENTRY</text>
                </g>
                <g fill="none" stroke="#829089" stroke-width=".55">
                  <path d="M380 112h29v18h-29zM383 115h9m-9 4h9m-9 4h9" />
                  <path d="M336 164h19v16h-19zm2 2 15 12m0-12-15 12" />
                  <circle cx="405" cy="173" r="3.5" />
                </g>

                <!-- Professional title block. -->
                <path d="M315 202h128M384 202v35M419 202v35M315 219h128" fill="none" stroke="#6f7d76" stroke-width=".55" />
                <text x="321" y="210" fill="#26342e" font-size="5" font-weight="700">A-101</text>
                <text x="321" y="216" fill="#6d7973" font-size="4">FLOOR PLAN</text>
                <text x="389" y="210" fill="#6d7973" font-size="3.7">SCALE</text>
                <text x="389" y="216" fill="#26342e" font-size="4.5" font-weight="700">1 : 100</text>
                <text x="423" y="210" fill="#6d7973" font-size="3.7">STATUS</text>
                <text x="423" y="216" fill="#247f85" font-size="4.5" font-weight="700">APPROVED</text>
                <path d="M321 227h26m-26 4h18" stroke="#a0aaa5" stroke-width=".6" />
                <text x="389" y="229" fill="#6d7973" font-size="3.7">AI COORDINATED</text>
              </g>
              <text x="326" y="260" fill="#718079" font-size="9" font-weight="700" letter-spacing="1.2">02 / APPROVED PLAN</text>

              <!-- Building assembled from the plan -->
              <g class="building-result" filter="url(#journey-shadow)">
                <polygon points="530,306 608,266 691,307 612,348" fill="#34413b" opacity=".7" />
                <polygon points="548,204 611,171 673,202 610,236" fill="#d8e0dc" stroke="#9ca9a3" />
                <polygon points="548,204 610,236 610,316 548,284" fill="url(#journey-building-front)" stroke="#73817a" />
                <polygon points="610,236 673,202 673,282 610,316" fill="url(#journey-building-side)" stroke="#73817a" />
                <path d="M548 244 610 276 673 242M610 236v80" fill="none" stroke="#65736c" />
                <path d="m558 225 17 9v22l-17-9zm26 13 17 9v22l-17-9zm-26 35 17 9v17l-17-9zm65-25 17-9v22l-17 9zm25-14 16-8v22l-16 9zm-25 50 17-9v18l-17 9z" fill="#16201c" opacity=".78" />
                <polygon class="building-roof" points="538,203 611,164 683,201 611,241" fill="#63d6df" fill-opacity=".18" stroke="#63d6df" />
                <path class="construction-line" d="M611 164v-46M538 203l-24-13M683 201l21-12" />
              </g>
              <text x="548" y="366" fill="#718079" font-size="9" font-weight="700" letter-spacing="1.2">03 / NATIVE BIM</text>

              <!-- The Architecton AI agent moves through all three phases. -->
              <g transform="translate(225 176)">
                <g class="journey-agent">
                  <ellipse class="agent-shadow" cx="0" cy="143" rx="31" ry="6" fill="#050807" opacity=".38" />
                  <g class="bot-hover">
                    <image class="generated-bot" href="/images/architecton-ai-mascot.png" x="-70" y="-5" width="140" height="140" preserveAspectRatio="xMidYMid meet" />
                    <g class="bot-vector-art" aria-hidden="true">
                    <!-- Soft oversized head, closely matching the friendly reference proportions. -->
                    <ellipse cx="-41" cy="29" rx="7.5" ry="15" fill="#cbd5d0" stroke="#f8fbf9" stroke-width="1.5" />
                    <ellipse cx="41" cy="29" rx="7.5" ry="15" fill="#cbd5d0" stroke="#f8fbf9" stroke-width="1.5" />
                    <rect x="-42" y="0" width="84" height="60" rx="27" fill="url(#robot-shell)" stroke="#ffffff" stroke-width="1.8" />
                    <path d="M-33 20Q-31 9-18 8h36q13 1 15 12v15q-2 14-15 15h-36q-13-1-15-15z" fill="url(#robot-visor)" stroke="#84938c" stroke-width="1" />
                    <path d="M-27 17Q0 6 27 17" fill="none" stroke="#ffffff" stroke-opacity=".13" stroke-width="2.2" stroke-linecap="round" />
                    <g class="bot-face">
                      <path d="M-18 27q5-7 10 0" fill="none" stroke="#72ecf4" stroke-width="3.2" stroke-linecap="round" />
                      <path d="M8 27q5-7 10 0" fill="none" stroke="#72ecf4" stroke-width="3.2" stroke-linecap="round" />
                      <path d="M-7 38q7 4 14 0" fill="none" stroke="#63d6df" stroke-width="1.4" stroke-linecap="round" opacity=".8" />
                    </g>

                    <!-- Small pear-shaped body, one continuous form with no legs. -->
                    <path d="M-11 57v7H11v-7" fill="#a8b5ae" />
                    <path d="M-15 60C-29 65-34 82-31 103c3 21 14 31 31 31s28-10 31-31C34 82 29 65 15 60Z" fill="url(#robot-body)" stroke="#ffffff" stroke-width="1.6" />
                    <path d="M-24 75Q0 62 24 75" fill="none" stroke="#ffffff" stroke-opacity=".8" stroke-width="1.2" />
                    <path d="M-18 68Q0 61 18 68" fill="none" stroke="#63d6df" stroke-opacity=".55" stroke-width="1" />

                    <!-- Architecton symbol from the supplied logo, without the old chest mark. -->
                    <g class="bot-chest-logo" transform="translate(0 84)">
                      <path d="M-14 17 0 0l14 17M-14 17h7" fill="none" stroke="#071a33" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M-6 6 7 18" fill="none" stroke="#071a33" stroke-width="3.2" stroke-linecap="round" />
                      <path d="M-5 15v4m6-4v4" stroke="#071a33" stroke-width="2.8" stroke-linecap="round" />
                      <path d="M10 19h8" stroke="#13bfe6" stroke-width="3.2" stroke-linecap="round" />
                    </g>
                    <path d="M-12 123Q0 128 12 123" fill="none" stroke="#8c9a93" stroke-width="1" />

                    <!-- Thick, rounded arms with shoulder shells, elbow joints, and compact hands. -->
                    <g transform="translate(-27 72)">
                      <g class="bot-arm-back">
                        <ellipse cx="0" cy="1" rx="8" ry="10" fill="url(#robot-shell)" stroke="#ffffff" stroke-width="1.2" />
                        <path d="M-3 5-12 19" stroke="url(#robot-body)" stroke-width="14" stroke-linecap="round" />
                        <circle cx="-12" cy="19" r="7" fill="#cbd6d1" stroke="#72827a" stroke-width="1.2" />
                        <circle cx="-12" cy="19" r="3" fill="#071a33" />
                        <path d="m-15 24-5 16" stroke="#f1f5f3" stroke-width="11" stroke-linecap="round" />
                        <circle cx="-20" cy="40" r="5.5" fill="#071a33" stroke="#63d6df" stroke-width="1" />
                        <path d="M-25 43q5-5 10 0v8q-5 7-10 0z" fill="url(#robot-shell)" stroke="#ffffff" stroke-width="1" />
                        <path d="M-24 49v8m3-8v9m3-9v8m3-11 4 4" fill="none" stroke="#edf3f0" stroke-width="2.3" stroke-linecap="round" />
                        <circle cx="-20" cy="47" r="1.8" fill="#63d6df" fill-opacity=".65" />
                      </g>
                    </g>
                    <g transform="translate(27 72)">
                      <g class="bot-arm-front">
                        <ellipse cx="0" cy="1" rx="8" ry="10" fill="url(#robot-shell)" stroke="#ffffff" stroke-width="1.2" />
                        <path d="M3 5 12 19" stroke="url(#robot-body)" stroke-width="14" stroke-linecap="round" />
                        <circle cx="12" cy="19" r="7" fill="#dce5e1" stroke="#7e8e86" stroke-width="1.2" />
                        <circle cx="12" cy="19" r="3" fill="#071a33" />
                        <path d="m15 24 5 16" stroke="#f7f9f8" stroke-width="11" stroke-linecap="round" />
                        <circle cx="20" cy="40" r="5.5" fill="#071a33" stroke="#63d6df" stroke-width="1" />
                        <path d="M15 43q5-5 10 0v8q-5 7-10 0z" fill="url(#robot-shell)" stroke="#ffffff" stroke-width="1" />
                        <path d="M16 49v8m3-8v9m3-9v8m3-11 4 4" fill="none" stroke="#f5f8f6" stroke-width="2.3" stroke-linecap="round" />
                        <circle cx="20" cy="47" r="1.8" fill="#63d6df" fill-opacity=".65" />
                      </g>
                    </g>

                    <!-- A light hover glow only; there are no feet or leg shapes. -->
                    <ellipse class="bot-thrust" cx="0" cy="137" rx="18" ry="4" fill="#63d6df" fill-opacity=".24" stroke="#63d6df" stroke-opacity=".55" />
                    </g>

                    <g class="carried-plan" transform="translate(58 32) rotate(5)">
                      <rect x="0" y="0" width="46" height="60" rx="1" fill="#f4f7f5" stroke="#63d6df" />
                      <path d="M6 7h34v38H6zm0 19h34M22 7v38M6 16h16m10 10v19" fill="none" stroke="#425149" stroke-width="1.1" />
                      <path d="M4 50h38M27 50v10" stroke="#75827c" stroke-width=".6" />
                      <text x="6" y="56" fill="#34423b" font-size="3.3" font-weight="700">A-101 / 1:100</text>
                    </g>
                  </g>
                </g>
              </g>

              <g class="architecton-plan-signal">
                <circle cx="377" cy="82" r="17" fill="#63d6df" fill-opacity=".08" stroke="#63d6df" stroke-opacity=".4" />
                <path d="M368 82h18m-9-9v18" stroke="#63d6df" stroke-width="1.4" />
              </g>
            </svg>

            <div class="grid grid-cols-3 border-t border-white/10 bg-[#111613] text-[.58rem] font-bold tracking-[.1em] text-[#77857e] uppercase">
              <span class="journey-phase phase-one px-4 py-3">Prompt</span>
              <span class="journey-phase phase-two border-x border-white/8 px-4 py-3 text-center">Plan</span>
              <span class="journey-phase phase-three px-4 py-3 text-right">Building</span>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <section id="platforms" aria-labelledby="platforms-title" class="scroll-mt-[90px] py-24 max-md:py-16">
      <UContainer class="px-5 max-sm:px-4">
        <div class="grid grid-cols-12 items-end gap-x-10 gap-y-5">
          <div class="col-span-7 max-md:col-span-12">
            <p class="mb-4 flex items-center gap-3 text-xs font-bold tracking-[.12em] text-architecton-700 uppercase"><span class="font-mono text-[#8a958f]">01</span> Available integrations</p>
            <h2 id="platforms-title" class="m-0 max-w-3xl text-[clamp(2.3rem,4vw,3.6rem)] leading-[1.02] font-semibold tracking-[-.038em]">Choose the application that owns your model.</h2>
          </div>
          <p class="col-span-5 m-0 max-w-lg text-base leading-7 text-[#616a65] max-md:col-span-12">Each build is compiled for a specific Revit or Archicad release. Select the host first, then confirm the version.</p>
        </div>

        <div class="mt-12 border-y border-[#b9c4be]">
          <div class="grid min-h-14 grid-cols-[minmax(18rem,1.3fr)_minmax(18rem,1fr)_10rem] items-center gap-7 border-b border-[#c8d1cc] px-6 text-[.64rem] font-bold tracking-[.11em] text-[#75817b] uppercase max-md:hidden">
            <span>Architecton integration</span>
            <span>Supported host releases</span>
            <span class="text-right">Continue</span>
          </div>

          <NuxtLink
            v-for="platformId in platformOrder"
            :key="platformId"
            :to="`/get-started/${platformId}`"
            class="download-row group relative grid min-h-[10.5rem] grid-cols-[minmax(18rem,1.3fr)_minmax(18rem,1fr)_10rem] items-center gap-7 overflow-hidden border-b border-[#c8d1cc] px-6 transition-colors last:border-b-0 hover:bg-white/55 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-architecton-600 max-md:min-h-0 max-md:grid-cols-1 max-md:gap-6 max-md:py-8"
            :aria-label="`Choose an Architecton build for ${platforms[platformId].name}`"
          >
            <span class="row-accent absolute inset-y-0 left-0 w-[3px] scale-y-0 transition-transform duration-300 group-hover:scale-y-100" :class="platformId === 'revit' ? 'bg-[#2f7cf6]' : 'bg-[#00a6d6]'" />

            <span class="flex min-w-0 items-center gap-5">
              <img :src="platforms[platformId].iconUrl" :alt="`${platforms[platformId].name} application icon`" class="size-12 shrink-0 object-contain" :class="platformId === 'revit' ? 'bg-transparent' : 'rounded-lg bg-white'">
              <span>
                <small class="block text-[.62rem] font-bold tracking-[.11em] uppercase" :class="platformId === 'revit' ? 'text-[#2f7cf6]' : 'text-[#008fb8]'">{{ platforms[platformId].company }} integration</small>
                <h3 class="mt-1.5 mb-0 text-xl font-semibold tracking-[-.015em] text-[#101412]">Architecton for {{ platforms[platformId].name }}</h3>
                <span class="mt-2 flex items-center gap-2 text-xs text-[#66726c]"><UIcon name="i-lucide-monitor" class="size-3.5" /> Windows 64-bit</span>
              </span>
            </span>

            <span>
              <span class="flex flex-wrap gap-2">
                <span v-for="build in platforms[platformId].verifiedBuilds" :key="build.version" class="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-semibold" :class="build.status === 'available' ? 'border-[#a9cbc8] bg-[#edf8f6] text-[#234f4e]' : 'border-[#cad3ce] bg-[#f4f7f5] text-[#66716c]'" :title="`${platforms[platformId].name} ${build.version}: ${build.status}`">
                  <span class="size-1.5 rounded-full" :class="build.status === 'available' ? 'bg-[#28aeb7]' : 'bg-[#aab4af]'" />
                  {{ build.version }}
                </span>
              </span>
              <small class="mt-3 block text-[.68rem] text-[#76817b]">Verified and planned releases are labeled separately.</small>
            </span>

            <span class="flex flex-col items-end gap-3 max-md:items-start">
              <span class="inline-flex items-center gap-2 text-[.65rem] font-bold tracking-[.08em] text-[#54716b] uppercase"><span class="size-1.5 rounded-full bg-[#2ab3ba]" /> Build available</span>
              <span class="flex items-center gap-2 text-sm font-semibold text-[#101412]">Select version <UIcon name="i-lucide-arrow-right" class="size-4 transition-transform duration-300 group-hover:translate-x-1" /></span>
            </span>
          </NuxtLink>
        </div>

        <div class="mt-5 flex flex-wrap items-center justify-between gap-4 text-xs leading-5 text-[#66716c]">
          <p class="m-0 flex items-center gap-2"><UIcon name="i-lucide-shield-check" class="size-4 text-architecton-700" /> Use only the installer made for your exact BIM host release.</p>
          <NuxtLink to="/docs/revit-installation" class="inline-flex items-center gap-2 font-semibold text-[#27332d] hover:text-architecton-700">Read installation documentation <UIcon name="i-lucide-arrow-up-right" class="size-3.5" /></NuxtLink>
        </div>
      </UContainer>
    </section>

    <section id="installation" aria-labelledby="install-title" class="relative overflow-hidden bg-[#101412] py-24 text-white max-md:py-16">
      <div class="installation-grid pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />
      <UContainer class="relative px-5 max-sm:px-4">
        <div class="grid grid-cols-12 items-end gap-x-12 gap-y-6">
          <div class="col-span-7 max-md:col-span-12">
            <p class="mb-4 flex items-center gap-3 text-xs font-bold tracking-[.12em] text-[#63d6df] uppercase"><span class="font-mono text-[#65736c]">02</span> Installation sequence</p>
            <h2 id="install-title" class="m-0 max-w-3xl text-[clamp(2.25rem,4vw,3.5rem)] leading-[1.02] font-semibold tracking-[-.038em]">A controlled setup. No changes to your model.</h2>
          </div>
          <p class="col-span-5 m-0 max-w-lg text-base leading-7 text-[#aab7b0] max-md:col-span-12">Close the BIM host, install the matching integration, then reopen the application and sign in.</p>
        </div>

        <ol class="mt-14 grid list-none grid-cols-4 border-y border-white/12 p-0 max-md:grid-cols-2 max-sm:grid-cols-1">
          <li v-for="(step, index) in installationSteps" :id="`installation-step-${index + 1}`" :key="step.title" class="relative min-h-[13rem] border-r border-white/12 p-6 last:border-r-0 max-md:border-b max-md:nth-[2n]:border-r-0 max-sm:min-h-0 max-sm:border-r-0 max-sm:px-0 max-sm:py-6">
            <span class="flex items-center justify-between gap-4">
              <span class="grid size-10 place-items-center rounded-full border border-[#63d6df]/25 bg-[#63d6df]/10 text-[#63d6df]"><UIcon :name="step.icon" class="size-4" /></span>
              <small class="font-mono text-[.6rem] text-[#66756d]">STEP 0{{ index + 1 }}</small>
            </span>
            <h3 class="mt-8 mb-0 text-base font-semibold text-[#f1f5f3]">{{ step.title }}</h3>
            <p class="mt-2 mb-0 max-w-[13rem] text-sm leading-6 text-[#8e9c95]">{{ step.description }}</p>
          </li>
        </ol>

        <div class="mt-5 flex flex-wrap items-center justify-between gap-4 text-xs text-[#7f8d86]">
          <p class="m-0 flex items-center gap-2"><UIcon name="i-lucide-info" class="size-4 text-[#63d6df]" /> The installer adds the integration only; it does not open or modify a BIM project.</p>
          <span class="flex items-center gap-2"><UIcon name="i-lucide-lock-keyhole" class="size-4" /> Model actions remain reviewable</span>
        </div>
      </UContainer>
    </section>

    <section aria-labelledby="requirements-title" class="bg-[#f7f9f7] py-24 max-md:py-16">
      <UContainer class="px-5 max-sm:px-4">
        <div class="grid grid-cols-12 gap-x-14 gap-y-12">
          <div class="col-span-7 max-md:col-span-12">
            <p class="mb-4 flex items-center gap-3 text-xs font-bold tracking-[.12em] text-architecton-700 uppercase"><span class="font-mono text-[#8a958f]">03</span> System requirements</p>
            <h2 id="requirements-title" class="m-0 max-w-2xl text-[clamp(2.15rem,3.5vw,3.1rem)] leading-[1.03] font-semibold tracking-[-.035em]">Check the workstation before downloading.</h2>

            <dl class="mt-10 border-y border-[#c6d0ca]">
              <div v-for="requirement in requirements" :key="requirement.label" class="grid grid-cols-[2.75rem_1fr_1.15fr] items-center gap-4 border-b border-[#d2d9d5] py-5 last:border-b-0 max-sm:grid-cols-[2.5rem_1fr]">
                <span class="grid size-10 place-items-center rounded-full border border-[#ccd5d0] bg-white text-architecton-700"><UIcon :name="requirement.icon" class="size-4" /></span>
                <div><dt class="text-[.65rem] font-bold tracking-[.08em] text-[#7b8680] uppercase">{{ requirement.label }}</dt><dd class="mt-1 ml-0 text-sm font-semibold text-[#18221d]">{{ requirement.value }}</dd></div>
                <dd class="m-0 text-sm leading-6 text-[#68736d] max-sm:col-span-2 max-sm:pl-[3.5rem]">{{ requirement.note }}</dd>
              </div>
            </dl>
          </div>

          <aside class="col-span-5 border-l border-[#cbd4cf] pl-12 max-md:col-span-12 max-md:border-t max-md:border-l-0 max-md:pt-10 max-md:pl-0" aria-labelledby="documentation-title">
            <p class="mb-4 text-xs font-bold tracking-[.12em] text-[#77827c] uppercase">Documentation</p>
            <h2 id="documentation-title" class="m-0 text-[clamp(1.8rem,3vw,2.5rem)] leading-[1.06] font-semibold tracking-[-.03em]">Installation guides for your BIM host.</h2>
            <p class="mt-5 mb-0 max-w-md text-sm leading-6 text-[#68736d]">Review permissions, host-specific steps, and the first sign-in before running setup.</p>

            <nav class="mt-8 border-y border-[#c7d0cb]" aria-label="Architecton installation guides">
              <NuxtLink v-for="platformId in platformOrder" :key="platformId" :to="`/docs/${platformId}-installation`" class="group flex items-center justify-between gap-5 border-b border-[#d2d9d5] py-5 last:border-b-0">
                <span class="flex items-center gap-3"><img :src="platforms[platformId].iconUrl" alt="" class="size-5 shrink-0 object-contain" :class="platformId === 'revit' ? 'bg-transparent' : 'rounded bg-white'"><span class="text-sm font-semibold">{{ platforms[platformId].name }} installation guide</span></span>
                <UIcon name="i-lucide-arrow-up-right" class="size-4 text-[#718079] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </NuxtLink>
            </nav>
            <a href="mailto:support@architecton.ai" class="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#29352f] hover:text-architecton-700"><UIcon name="i-lucide-life-buoy" class="size-4" /> Installation support</a>
          </aside>
        </div>

        <div class="mt-24 grid grid-cols-12 gap-x-14 gap-y-8 border-t border-[#c7d0cb] pt-14 max-md:mt-16 max-md:pt-10">
          <div class="col-span-4 max-md:col-span-12">
            <p class="mb-3 text-xs font-bold tracking-[.12em] text-architecton-700 uppercase">Common questions</p>
            <h2 id="faq-title" class="m-0 text-[clamp(1.9rem,3vw,2.5rem)] leading-tight font-semibold tracking-[-.03em]">Before you install.</h2>
          </div>
          <div class="col-span-8 border-t border-[#c7d0cb] max-md:col-span-12">
            <details v-for="(faq, index) in faqs" :key="faq.question" :open="index === 0" class="faq-item group border-b border-[#c7d0cb]">
              <summary class="flex cursor-pointer list-none items-center justify-between gap-5 py-5 text-sm font-semibold marker:content-none">
                {{ faq.question }}
                <span class="grid size-7 shrink-0 place-items-center rounded-full border border-[#c4cec8] transition-colors group-open:bg-[#101412] group-open:text-white"><UIcon name="i-lucide-plus" class="size-3.5 transition-transform group-open:rotate-45" /></span>
              </summary>
              <p class="mt-0 max-w-2xl pb-5 text-sm leading-6 text-[#64706a]">{{ faq.answer }}</p>
            </details>
          </div>
        </div>
      </UContainer>
    </section>
  </main>
</template>

<style scoped>
.hero-grid {
  background-image:
    linear-gradient(rgba(255, 255, 255, .035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, .035) 1px, transparent 1px);
  background-size: 4.5rem 4.5rem;
  mask-image: linear-gradient(to right, transparent, black 45%, black 90%, transparent);
}

.installation-grid {
  background-image:
    linear-gradient(rgba(255, 255, 255, .035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, .035) 1px, transparent 1px);
  background-size: 5rem 5rem;
  mask-image: linear-gradient(to bottom, transparent, black 18%, black 82%, transparent);
}

.signal-dot { animation: signal 2s ease-in-out infinite; }
.hero-glow { animation: glow-drift 8s ease-in-out infinite alternate; }
.journey-window { animation: window-enter .8s cubic-bezier(.2,.75,.25,1) both; }
.journey-scene { aspect-ratio: 720 / 410; }
.journey-route { fill: none; stroke: #63d6df; stroke-width: 1; stroke-dasharray: 4 8; opacity: .22; }
.typed-line { fill: none; stroke: #53635b; stroke-width: 3; stroke-linecap: round; stroke-dasharray: 105; animation: type-prompt 12s linear infinite; }
.typed-line-two { animation-delay: .35s; }
.typed-line-three { animation-delay: .7s; }
.prompt-cursor { animation: cursor-blink .7s step-end infinite; }
.journey-agent { animation: agent-route 12s ease-in-out infinite; }
.bot-hover { animation: bot-hover 2.2s ease-in-out infinite; }
.generated-bot { filter: drop-shadow(0 8px 8px rgba(3, 7, 5, .3)); }
.bot-vector-art { display: none; }
.bot-arm-front,.bot-arm-back { transform-box: fill-box; transform-origin: center top; }
.bot-arm-front,.bot-arm-back { animation: none; }
.bot-face { transform-box: fill-box; transform-origin: center; animation: bot-expression 4s ease-in-out infinite; }
.bot-beacon,.bot-core-ring { transform-box: fill-box; transform-origin: center; animation: bot-pulse 1.8s ease-in-out infinite; }
.bot-beacon-ring { transform-box: fill-box; transform-origin: center; animation: beacon-ring 1.8s ease-out infinite; }
.bot-thrust { transform-box: fill-box; transform-origin: center top; animation: bot-thrust 12s ease-in-out infinite; }
.agent-shadow { transform-box: fill-box; transform-origin: center; animation: shadow-hover 2.2s ease-in-out infinite; }
.plan-station { animation: plan-handoff 12s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
.carried-plan { opacity: 0; animation: carry-plan 12s step-end infinite; }
.architecton-plan-signal { transform-box: fill-box; transform-origin: center; animation: plan-signal 12s ease-in-out infinite; }
.building-result { transform-box: fill-box; transform-origin: center bottom; animation: raise-building 12s cubic-bezier(.2,.75,.25,1) infinite; }
.building-roof { transform-box: fill-box; transform-origin: center; animation: roof-finish 12s ease-in-out infinite; }
.construction-line { fill: none; stroke: #63d6df; stroke-width: 1; stroke-dasharray: 5 5; animation: construction-guide 12s linear infinite; }
.phase-one { animation: phase-one 12s ease-in-out infinite; }
.phase-two { animation: phase-two 12s ease-in-out infinite; }
.phase-three { animation: phase-three 12s ease-in-out infinite; }
.faq-item summary::-webkit-details-marker { display: none; }

@keyframes signal {
  0%, 100% { box-shadow: 0 0 0 0 rgba(99, 214, 223, .35); }
  50% { box-shadow: 0 0 0 .45rem rgba(99, 214, 223, 0); }
}

@keyframes glow-drift {
  from { transform: translate3d(-2rem, -52%, 0) scale(.95); opacity: .65; }
  to { transform: translate3d(2rem, -48%, 0) scale(1.08); opacity: 1; }
}

@keyframes window-enter {
  from { opacity: 0; transform: translateY(1.25rem) scale(.985); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes type-prompt {
  0%, 3% { stroke-dashoffset: 105; }
  18%, 100% { stroke-dashoffset: 0; }
}

@keyframes cursor-blink { 50% { opacity: 0; } }

@keyframes agent-route {
  0%, 23% { transform: translate(0, 0); }
  38%, 47% { transform: translate(126px, 0); }
  65%, 100% { transform: translate(282px, 0); }
}

@keyframes bot-hover {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

@keyframes bot-arm-front {
  0%, 20% { transform: rotate(44deg); }
  24%, 38% { transform: rotate(8deg); }
  42%, 100% { transform: rotate(-9deg); }
}

@keyframes bot-arm-back {
  0%, 20% { transform: rotate(-56deg); }
  24%, 38% { transform: rotate(-8deg); }
  42%, 100% { transform: rotate(6deg); }
}

@keyframes bot-expression {
  0%, 44%, 50%, 100% { transform: scaleY(1); }
  47% { transform: scaleY(.12); }
}

@keyframes bot-pulse {
  0%, 100% { opacity: .65; transform: scale(.9); }
  50% { opacity: 1; transform: scale(1.12); }
}

@keyframes beacon-ring {
  0% { opacity: .7; transform: scale(.55); }
  100% { opacity: 0; transform: scale(1.65); }
}

@keyframes bot-thrust {
  0%, 21%, 39%, 46%, 66%, 100% { opacity: .18; transform: scaleY(.55); }
  26%, 35%, 51%, 62% { opacity: 1; transform: scaleY(1.15); }
}

@keyframes shadow-hover {
  0%, 100% { opacity: .38; transform: scaleX(1); }
  50% { opacity: .23; transform: scaleX(.82); }
}

@keyframes plan-handoff {
  0%, 40% { opacity: 1; transform: scale(1); }
  45%, 100% { opacity: .12; transform: scale(.96); }
}

@keyframes carry-plan {
  0%, 42% { opacity: 0; }
  43%, 100% { opacity: 1; }
}

@keyframes plan-signal {
  0%, 27%, 51%, 100% { opacity: 0; transform: scale(.65); }
  33%, 44% { opacity: 1; transform: scale(1); }
}

@keyframes raise-building {
  0%, 62% { opacity: 0; transform: translateY(18px) scaleY(.08); }
  78%, 100% { opacity: 1; transform: translateY(0) scaleY(1); }
}

@keyframes roof-finish {
  0%, 74% { opacity: 0; transform: translateY(-12px); }
  83%, 100% { opacity: 1; transform: translateY(0); }
}

@keyframes construction-guide {
  0%, 61% { opacity: 0; stroke-dashoffset: 30; }
  68%, 88% { opacity: .7; stroke-dashoffset: 0; }
  100% { opacity: 0; }
}

@keyframes phase-one {
  0%, 28% { color: #63d6df; background: rgba(99, 214, 223, .055); }
  36%, 100% { color: #77857e; background: transparent; }
}

@keyframes phase-two {
  0%, 28%, 52%, 100% { color: #77857e; background: transparent; }
  34%, 46% { color: #63d6df; background: rgba(99, 214, 223, .055); }
}

@keyframes phase-three {
  0%, 57% { color: #77857e; background: transparent; }
  66%, 100% { color: #63d6df; background: rgba(99, 214, 223, .055); }
}

@media (prefers-reduced-motion: reduce) {
  .signal-dot,
  .hero-glow,
  .journey-window,
  .typed-line,
  .prompt-cursor,
  .journey-agent,
  .bot-hover,
  .bot-arm-front,
  .bot-arm-back,
  .bot-face,
  .bot-beacon,
  .bot-beacon-ring,
  .bot-core-ring,
  .bot-thrust,
  .agent-shadow,
  .plan-station,
  .carried-plan,
  .architecton-plan-signal,
  .building-result,
  .building-roof,
  .construction-line,
  .journey-phase { animation: none; }

  .carried-plan,
  .building-result,
  .building-roof { opacity: 1; }
}
</style>
