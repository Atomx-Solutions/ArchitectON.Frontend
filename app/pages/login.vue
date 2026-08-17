<script setup lang="ts">
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

interface DesktopAuthorizationResponse {
  code: string
}

type AuthMode = 'sign-in' | 'register'
type AuthField = 'displayName' | 'email' | 'password' | 'passwordConfirmation'

const signInSchema = z.object({
  email: z.string().trim().min(1, 'Enter your email address.').email('Enter a valid email address.'),
  password: z.string().min(8, 'Password must contain at least 8 characters.')
})

const registerSchema = signInSchema.extend({
  displayName: z.string().trim().min(2, 'Enter your full name.').max(80, 'Name must contain at most 80 characters.'),
  passwordConfirmation: z.string().min(1, 'Confirm your password.')
}).refine(data => data.password === data.passwordConfirmation, {
  message: 'Passwords do not match.',
  path: ['passwordConfirmation']
})

const route = useRoute()
const config = useRuntimeConfig()
const authMode = ref<AuthMode>('sign-in')
const displayName = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const fieldErrors = ref<Partial<Record<AuthField, string>>>({})
const isSubmitting = ref(false)
const showPassword = ref(false)
const { supabaseUrl, supabasePublishableKey } = config.public
const supabase = supabaseUrl && supabasePublishableKey
  ? createClient(supabaseUrl, supabasePublishableKey)
  : null

const queryValue = (value: unknown) => typeof value === 'string' ? value : ''
const source = queryValue(route.query.source)
const hostVersion = queryValue(route.query.host_version)
const redirectUri = queryValue(route.query.redirect_uri)
const state = queryValue(route.query.state)
const forceLogin = queryValue(route.query.force_login) === '1'
const hasDesktopRequest = Boolean(source || hostVersion || redirectUri || state)
const desktopClients = {
  revit: { version: '2026', name: 'Revit' },
  archicad: { version: '29', name: 'Archicad' }
} as const
const desktopClient = source === 'revit' || source === 'archicad'
  ? desktopClients[source]
  : null
const desktopName = computed(() => desktopClient?.name ?? 'desktop app')

const isTrustedCallback = (() => {
  try {
    const callback = new URL(redirectUri)
    return callback.protocol === 'http:'
      && callback.hostname === '127.0.0.1'
      && callback.pathname === '/callback/'
      && Number(callback.port) >= 1024
      && Number(callback.port) <= 65535
      && !callback.username
      && !callback.password
      && !callback.search
      && !callback.hash
  } catch {
    return false
  }
})()

if (hasDesktopRequest && (!desktopClient || hostVersion !== desktopClient.version || state.length < 32 || state.length > 256 || !isTrustedCallback)) {
  throw createError({ statusCode: 400, statusMessage: 'Invalid desktop login request' })
}

useSeoMeta({
  title: () => authMode.value === 'register' ? 'Create Architecton account' : 'Sign in to Architecton',
  description: 'Create an account or sign in to Architecton.'
})

const authorizeDesktop = async (accessToken: string) => {
  if (!hasDesktopRequest) {
    if (!supabase) throw new Error('Architecton authentication is not configured.')

    const { data: profile, error } = await supabase
      .from('users')
      .select('role')
      .single()
    if (error || !profile) throw new Error('Your Architecton profile could not be loaded.')

    if (profile.role === 'admin') {
      await navigateTo('/admin')
      return
    }

    await navigateTo('/dashboard')
    return
  }

  const authorization = await $fetch<DesktopAuthorizationResponse>(
    '/api/v1/auth/desktop/authorize',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      body: {
        platform: source,
        hostVersion,
        redirectUri,
        state
      }
    }
  )

  const callback = new URL(redirectUri)
  callback.searchParams.set('code', authorization.code)
  callback.searchParams.set('state', state)
  window.location.assign(callback)
}

const setMode = (mode: AuthMode) => {
  authMode.value = mode
  errorMessage.value = ''
  successMessage.value = ''
  password.value = ''
  passwordConfirmation.value = ''
  showPassword.value = false
  fieldErrors.value = {}
}

const clearFieldError = (field: AuthField) => {
  if (!fieldErrors.value[field]) return
  const { [field]: _removed, ...remainingErrors } = fieldErrors.value
  fieldErrors.value = remainingErrors
}

const applyValidationErrors = (issues: z.core.$ZodIssue[]) => {
  const errors: Partial<Record<AuthField, string>> = {}
  for (const issue of issues) {
    const field = issue.path[0] as AuthField | undefined
    if (field && !errors[field]) errors[field] = issue.message
  }
  fieldErrors.value = errors
}

onMounted(async () => {
  if (!hasDesktopRequest || !supabase) return

  isSubmitting.value = true
  try {
    // Desktop sign-in must allow account switching. The plugin session and the
    // browser session are separate, so clear the latter before showing the form.
    if (forceLogin) {
      const { error } = await supabase.auth.signOut({ scope: 'local' })
      if (error) throw error
      return
    }

    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    if (!data.session) return

    await authorizeDesktop(data.session.access_token)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Sign-in failed. Try again.'
  } finally {
    isSubmitting.value = false
  }
})

const submit = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  fieldErrors.value = {}

  const credentials = {
    displayName: displayName.value,
    email: email.value,
    password: password.value,
    passwordConfirmation: passwordConfirmation.value
  }
  const validation = authMode.value === 'register'
    ? registerSchema.safeParse(credentials)
    : signInSchema.safeParse(credentials)

  if (!validation.success) {
    applyValidationErrors(validation.error.issues)
    return
  }

  isSubmitting.value = true

  try {
    if (!supabase) {
      throw new Error('Architecton authentication is not configured.')
    }

    const normalizedEmail = validation.data.email

    if (authMode.value === 'register') {
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password: validation.data.password,
        options: {
          data: { display_name: credentials.displayName.trim() },
          emailRedirectTo: window.location.href
        }
      })

      if (error) throw error
      if (!data.session) {
        setMode('sign-in')
        successMessage.value = 'Account created. Confirm your email, then sign in to continue.'
        return
      }

      await authorizeDesktop(data.session.access_token)
      return
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password: validation.data.password
    })

    if (error) throw error
    if (!data.session) throw new Error('Supabase did not return a session.')
    await authorizeDesktop(data.session.access_token)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Sign-in failed. Try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="relative min-h-svh overflow-x-hidden bg-[linear-gradient(90deg,#0c1110_0_calc(50%+min(5vw,64px)),#f5f5f1_calc(50%+min(5vw,64px))_100%)] text-[#f6f7f4] max-[900px]:bg-[#f5f5f1]">
    <div class="relative mx-auto grid h-svh w-full max-w-7xl grid-cols-[55%_45%] overflow-hidden max-[900px]:block max-[900px]:h-auto max-[900px]:min-h-svh max-[900px]:overflow-visible">
    <header class="pointer-events-none absolute inset-x-0 top-0 z-30 flex h-[76px] items-center justify-between px-[clamp(24px,3.5vw,58px)] max-[900px]:h-[68px] max-[900px]:px-5 max-[480px]:px-4">
      <NuxtLink to="/" aria-label="Architecton home" class="pointer-events-auto inline-flex items-center gap-3 text-sm font-extrabold tracking-[.025em] text-white focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#11c5db]">
        <img src="/images/Logo-transparent.png" alt="ArchitectON" class="h-12 w-auto object-contain" />
      </NuxtLink>
      <NuxtLink to="/" class="pointer-events-auto inline-flex items-center gap-2.5 text-xs font-semibold text-[#737c76] transition-colors hover:text-[#111614] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#11c5db] max-[900px]:text-[#bac3be] max-[480px]:grid max-[480px]:size-9 max-[480px]:place-items-center max-[480px]:gap-0 max-[480px]:border max-[480px]:border-white/20 max-[480px]:text-[0]">
        <UIcon name="i-lucide-arrow-left" class="size-4" />
        <span class="max-[480px]:sr-only">Back to website</span>
      </NuxtLink>
    </header>

    <section class="relative isolate flex h-svh min-h-0 flex-col overflow-hidden bg-[#0c1110] px-[clamp(42px,5vw,82px)] pt-[clamp(92px,12vh,116px)] pb-[clamp(22px,4vh,40px)] max-[900px]:h-auto max-[900px]:min-h-[235px] max-[900px]:px-5 max-[900px]:pt-[86px] max-[900px]:pb-7">
      <div class="pointer-events-none absolute inset-0 -z-20 opacity-[.24] [background-image:linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_bottom,black_8%,transparent_96%)]" aria-hidden="true" />
      <div class="pointer-events-none absolute right-[-120px] bottom-[2%] -z-10 size-[560px] rounded-full bg-[#11c5db]/10 blur-[120px]" aria-hidden="true" />

      <div class="absolute top-[102px] right-[5%] font-mono text-[8px] tracking-[.16em] text-[#53605a] max-[900px]:hidden" aria-hidden="true">N 47°29' / E 19°03'</div>
      <div class="absolute top-1/2 left-[18px] rotate-180 font-mono text-[8px] tracking-[.16em] text-[#53605a] [writing-mode:vertical-rl] max-[900px]:hidden" aria-hidden="true">SECTION A—01</div>

      <div class="relative z-[2] max-w-[610px]">
        <p class="flex items-center gap-3 text-[10px] font-bold tracking-[.16em] text-[#7f8a85] max-[480px]:text-[8px]">
          <span class="size-[5px] rounded-full bg-[#37cfda] shadow-[0_0_14px_rgba(55,207,218,.75)]" />
          BUILT FOR THE WAY ARCHITECTS THINK
        </p>
        <h2 class="mt-5 text-[clamp(3.8rem,6vw,6.2rem)] leading-[.88] font-semibold tracking-[-.065em] max-[1200px]:text-[clamp(3.2rem,5.5vw,4.8rem)] max-[900px]:mt-3 max-[900px]:text-[2.65rem] max-[480px]:text-[2.2rem]">
          From intent<br>to <em class="font-serif font-normal text-[#61d7df]">built form.</em>
        </h2>
        <p class="mt-7 max-w-[510px] text-sm leading-[1.75] text-[#9aa49f] max-[900px]:hidden">
          One secure workspace connecting your ideas, models and every decision in between.
        </p>
      </div>

      <div class="relative mt-4 min-h-0 flex-1 max-h-[610px] max-[900px]:hidden" aria-hidden="true">
        <div class="absolute inset-x-[2%] top-[12%] h-px bg-gradient-to-r from-transparent via-[#47d0da]/70 to-transparent shadow-[0_0_18px_rgba(71,208,218,.35)]" />
        <svg viewBox="0 0 900 620" class="absolute right-[-2%] bottom-[-4%] h-full max-h-[560px] w-[min(94%,760px)] overflow-visible drop-shadow-[0_32px_50px_rgba(0,0,0,.3)]">
          <g class="fill-[#69d2d9]/10 stroke-[#8cdce1] stroke-1">
            <path class="opacity-0 animate-[fade-up_.55s_.05s_ease_forwards] motion-reduce:animate-none motion-reduce:opacity-100" d="M108 427 424 260l369 146-322 171Z" />
            <path class="opacity-0 animate-[fade-up_.55s_.22s_ease_forwards] motion-reduce:animate-none motion-reduce:opacity-100" d="M144 414 423 268l329 130-284 151Z" />
            <path class="opacity-0 animate-[fade-up_.5s_.4s_ease_forwards] motion-reduce:animate-none motion-reduce:opacity-100" d="m144 414 324 135v18L144 431Z" />
            <path class="opacity-0 animate-[fade-up_.5s_.5s_ease_forwards] motion-reduce:animate-none motion-reduce:opacity-100" d="m468 549 284-151v18L468 567Z" />
            <path class="opacity-0 animate-[fade-up_.6s_.68s_ease_forwards] motion-reduce:animate-none motion-reduce:opacity-100" d="M185 400 423 276V143L185 267Z" />
            <path class="opacity-0 animate-[fade-up_.6s_.82s_ease_forwards] motion-reduce:animate-none motion-reduce:opacity-100" d="m185 400 283 118V385L185 267Z" />
            <path class="opacity-0 animate-[fade-up_.6s_.96s_ease_forwards] motion-reduce:animate-none motion-reduce:opacity-100" d="m423 276 286 113V256L423 143Z" />
            <path class="opacity-0 animate-[fade-up_.6s_1.1s_ease_forwards] motion-reduce:animate-none motion-reduce:opacity-100" d="M468 518 709 389V256L468 385Z" />
            <path class="opacity-0 animate-[fade-up_.65s_1.3s_ease_forwards] motion-reduce:animate-none motion-reduce:opacity-100" d="m169 258 254-133 304 120-259 139Z" />
            <path class="opacity-0 animate-[fade-up_.6s_1.5s_ease_forwards] motion-reduce:animate-none motion-reduce:opacity-100" d="M204 248 423 134V35L204 149Z" />
            <path class="opacity-0 animate-[fade-up_.6s_1.64s_ease_forwards] motion-reduce:animate-none motion-reduce:opacity-100" d="m204 248 264 111v-99L204 149Z" />
            <path class="opacity-0 animate-[fade-up_.6s_1.78s_ease_forwards] motion-reduce:animate-none motion-reduce:opacity-100" d="m423 134 267 106v-99L423 35Z" />
            <path class="opacity-0 animate-[fade-up_.6s_1.92s_ease_forwards] motion-reduce:animate-none motion-reduce:opacity-100" d="M468 359 690 240v-99L468 260Z" />
          </g>
          <g class="fill-none stroke-[#47d0da] stroke-1 opacity-0 [stroke-dasharray:7_7] animate-[fade-up_.7s_2.15s_ease_forwards] motion-reduce:animate-none motion-reduce:opacity-70">
            <path d="M185 267 468 385l241-129M204 149l264 111 222-119M423 35v241M468 260v258" />
            <path d="M70 463 423 276l408 161M96 490l375 156 360-192" />
          </g>
          <g class="opacity-0 animate-[fade-up_.6s_2.05s_ease_forwards] motion-reduce:animate-none motion-reduce:opacity-100">
            <g class="fill-[#091314] stroke-[#8cdce1] stroke-1">
              <path d="m505 461 62-33v-55l-62 33Z" />
              <path d="m613 404 59-32v-55l-59 32Z" />
              <path d="m223 349 57 24v-55l-57-24Z" />
              <path d="m439 214 62 24v-55l-62-24Z" />
            </g>
            <g class="fill-[#47d0da]/15 stroke-[#70dce5]/80 stroke-[.8]">
              <path d="m511 450 50-27v-40l-50 27Z" />
              <path d="m619 393 47-26v-40l-47 26Z" />
              <path d="m229 344 45 19v-40l-45-19Z" />
              <path d="m445 209 50 19v-40l-50-19Z" />
            </g>
            <g class="fill-none stroke-[#8cdce1]/70 stroke-[.7]">
              <path d="m536 436v-40M642.5 380v-40M251.5 353.5v-40M470 218.5v-40" />
            </g>
          </g>
          <ellipse cx="474" cy="356" rx="180" ry="78" class="fill-none stroke-[#47d0da]/25 stroke-1" />
          <ellipse cx="474" cy="356" rx="105" ry="48" class="fill-none stroke-[#47d0da]/20 stroke-1" />
        </svg>
        <span class="absolute right-[2%] bottom-[37%] font-mono text-[8px] tracking-[.14em] text-[#6e7974]"><i class="mr-2 inline-block size-1 rounded-full bg-[#47d0da]" />LIVE MODEL</span>
        <span class="absolute bottom-[16%] left-[9%] font-mono text-[8px] tracking-[.14em] text-[#58635e]">AXONOMETRIC / 01</span>
      </div>

      <div class="relative z-[2] flex items-center gap-8 text-[10px] font-semibold tracking-[.04em] text-[#75807a] max-[900px]:hidden">
        <span class="flex items-center gap-2"><UIcon name="i-lucide-shield-check" class="size-3.5" /> Secure by design</span>
        <span class="flex items-center gap-2"><UIcon name="i-lucide-box" class="size-3.5" /> Revit + Archicad</span>
        <span class="ml-auto flex items-center gap-2"><i class="size-[5px] rounded-full bg-[#52d39b] shadow-[0_0_8px_rgba(82,211,155,.5)]" /> Systems online</span>
      </div>
    </section>

    <section class="relative flex h-svh min-h-0 flex-col overflow-y-auto bg-[#f5f5f1] px-[clamp(38px,5vw,88px)] pt-[clamp(78px,10vh,96px)] pb-6 text-[#101412] max-[900px]:h-auto max-[900px]:min-h-[calc(100svh-235px)] max-[900px]:overflow-visible max-[900px]:px-5 max-[900px]:pt-10 max-[480px]:px-4 max-[480px]:pt-8">
      <div class="m-auto w-full max-w-[470px] animate-[fade-up_.7s_.1s_ease_both] motion-reduce:animate-none">
        <div v-if="hasDesktopRequest" class="mb-6 grid grid-cols-[auto_1fr_auto] items-center gap-3 border border-[#d8ded9] bg-[#eef1ed] p-2.5">
          <span class="grid size-9 place-items-center bg-[#101412] text-[#63d6df]"><UIcon name="i-lucide-monitor-check" /></span>
          <span class="grid"><strong class="text-[11px]">{{ desktopName }} {{ hostVersion }}</strong><small class="mt-px text-[9px] text-[#76807a]">Secure desktop connection</small></span>
          <i class="size-1.5 rounded-full bg-[#31bd7b] shadow-[0_0_0_4px_rgba(49,189,123,.11)]" />
        </div>

        <div>
          <p class="text-[9px] font-bold tracking-[.15em] text-[#858e89]">ACCOUNT ACCESS <span class="text-[#13aebe]">— 01</span></p>
          <h1 class="mt-3 mb-2 text-[clamp(2.7rem,4vw,3.6rem)] leading-none font-semibold tracking-[-.05em] max-[480px]:text-[2.35rem]">{{ authMode === 'register' ? 'Create your account.' : 'Welcome back.' }}</h1>
          <p class="text-[13px] leading-[1.6] text-[#737c76]">
            {{ authMode === 'register'
              ? 'A few details and your Architecton workspace is ready.'
              : (hasDesktopRequest ? `Sign in to continue securely in ${desktopName}.` : 'Sign in to continue to your Architecton workspace.') }}
          </p>
        </div>

        <div class="relative mt-7 mb-6 grid h-[43px] grid-cols-2 bg-[#e9ebe6] p-[3px]" role="tablist" aria-label="Account access mode">
          <button type="button" role="tab" :aria-selected="authMode === 'sign-in'" class="z-[2] cursor-pointer border-0 bg-transparent text-[11px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#11c5db]" :class="authMode === 'sign-in' ? 'text-white' : 'text-[#747d78]'" @click="setMode('sign-in')">Sign in</button>
          <button type="button" role="tab" :aria-selected="authMode === 'register'" class="z-[2] cursor-pointer border-0 bg-transparent text-[11px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#11c5db]" :class="authMode === 'register' ? 'text-white' : 'text-[#747d78]'" @click="setMode('register')">Create account</button>
          <span class="absolute inset-y-[3px] left-[3px] z-[1] w-[calc(50%-4.5px)] bg-[#111614] transition-transform duration-300 ease-out" :class="authMode === 'register' ? 'translate-x-[calc(100%+3px)]' : 'translate-x-0'" aria-hidden="true" />
        </div>

        <form class="grid gap-4" novalidate @submit.prevent="submit">
          <Transition enter-active-class="transition duration-200" enter-from-class="-translate-y-2 opacity-0" leave-active-class="transition duration-200" leave-to-class="-translate-y-2 opacity-0">
            <label v-if="authMode === 'register'" class="grid gap-[7px] text-[10px] font-bold tracking-[.035em] text-[#3a413d]" for="auth-name">
              <span>Full name</span>
              <span class="flex min-h-12 items-center gap-3 border bg-[#fafbf8] px-3.5 transition focus-within:border-[#159fad] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(17,197,219,.09)]" :class="fieldErrors.displayName ? 'border-[#d65f5f] shadow-[0_0_0_3px_rgba(214,95,95,.07)]' : 'border-[#d7dbd5]'">
                <UIcon name="i-lucide-user-round" class="size-4 shrink-0 text-[#8c9690]" />
                <input id="auth-name" v-model="displayName" class="w-full border-0 bg-transparent text-[13px] font-medium text-[#111614] shadow-none outline-none placeholder:text-[#a1a8a3] focus:ring-0 focus:outline-none" type="text" autocomplete="name" maxlength="80" placeholder="Your full name" required autofocus :aria-invalid="Boolean(fieldErrors.displayName)" aria-describedby="auth-name-error" @input="clearFieldError('displayName')">
              </span>
              <span v-if="fieldErrors.displayName" id="auth-name-error" class="text-[10px] font-semibold tracking-normal text-[#b84545]">{{ fieldErrors.displayName }}</span>
            </label>
          </Transition>

          <label class="grid gap-[7px] text-[10px] font-bold tracking-[.035em] text-[#3a413d]" for="auth-email">
            <span>Email address</span>
            <span class="flex min-h-12 items-center gap-3 border bg-[#fafbf8] px-3.5 transition focus-within:border-[#159fad] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(17,197,219,.09)]" :class="fieldErrors.email ? 'border-[#d65f5f] shadow-[0_0_0_3px_rgba(214,95,95,.07)]' : 'border-[#d7dbd5]'">
              <UIcon name="i-lucide-mail" class="size-4 shrink-0 text-[#8c9690]" />
              <input id="auth-email" v-model="email" class="w-full border-0 bg-transparent text-[13px] font-medium text-[#111614] shadow-none outline-none placeholder:text-[#a1a8a3] focus:ring-0 focus:outline-none" type="email" autocomplete="email" placeholder="you@company.com" required :autofocus="authMode === 'sign-in'" :aria-invalid="Boolean(fieldErrors.email)" aria-describedby="auth-email-error" @input="clearFieldError('email')">
            </span>
            <span v-if="fieldErrors.email" id="auth-email-error" class="text-[10px] font-semibold tracking-normal text-[#b84545]">{{ fieldErrors.email }}</span>
          </label>

          <label class="grid gap-[7px] text-[10px] font-bold tracking-[.035em] text-[#3a413d]" for="auth-password">
            <span>Password</span>
            <span class="flex min-h-12 items-center gap-3 border bg-[#fafbf8] px-3.5 transition focus-within:border-[#159fad] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(17,197,219,.09)]" :class="fieldErrors.password ? 'border-[#d65f5f] shadow-[0_0_0_3px_rgba(214,95,95,.07)]' : 'border-[#d7dbd5]'">
              <UIcon name="i-lucide-lock-keyhole" class="size-4 shrink-0 text-[#8c9690]" />
              <input id="auth-password" v-model="password" class="w-full border-0 bg-transparent text-[13px] font-medium text-[#111614] shadow-none outline-none placeholder:text-[#a1a8a3] focus:ring-0 focus:outline-none" :type="showPassword ? 'text' : 'password'" :autocomplete="authMode === 'register' ? 'new-password' : 'current-password'" minlength="8" placeholder="At least 8 characters" required :aria-invalid="Boolean(fieldErrors.password)" aria-describedby="auth-password-error" @input="clearFieldError('password')">
              <button type="button" class="grid size-7 cursor-pointer place-items-center border-0 bg-transparent text-[#7f8883] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#11c5db]" :aria-label="showPassword ? 'Hide password' : 'Show password'" @click="showPassword = !showPassword">
                <UIcon :name="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'" class="size-[15px]" />
              </button>
            </span>
            <span v-if="fieldErrors.password" id="auth-password-error" class="text-[10px] font-semibold tracking-normal text-[#b84545]">{{ fieldErrors.password }}</span>
          </label>

          <Transition enter-active-class="transition duration-200" enter-from-class="-translate-y-2 opacity-0" leave-active-class="transition duration-200" leave-to-class="-translate-y-2 opacity-0">
            <label v-if="authMode === 'register'" class="grid gap-[7px] text-[10px] font-bold tracking-[.035em] text-[#3a413d]" for="auth-password-confirmation">
              <span>Confirm password</span>
              <span class="flex min-h-12 items-center gap-3 border bg-[#fafbf8] px-3.5 transition focus-within:border-[#159fad] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(17,197,219,.09)]" :class="fieldErrors.passwordConfirmation ? 'border-[#d65f5f] shadow-[0_0_0_3px_rgba(214,95,95,.07)]' : 'border-[#d7dbd5]'">
                <UIcon name="i-lucide-shield-check" class="size-4 shrink-0 text-[#8c9690]" />
                <input id="auth-password-confirmation" v-model="passwordConfirmation" class="w-full border-0 bg-transparent text-[13px] font-medium text-[#111614] shadow-none outline-none placeholder:text-[#a1a8a3] focus:ring-0 focus:outline-none" :type="showPassword ? 'text' : 'password'" autocomplete="new-password" minlength="8" placeholder="Repeat your password" required :aria-invalid="Boolean(fieldErrors.passwordConfirmation)" aria-describedby="auth-password-confirmation-error" @input="clearFieldError('passwordConfirmation')">
              </span>
              <span v-if="fieldErrors.passwordConfirmation" id="auth-password-confirmation-error" class="text-[10px] font-semibold tracking-normal text-[#b84545]">{{ fieldErrors.passwordConfirmation }}</span>
            </label>
          </Transition>

          <UAlert v-if="errorMessage" color="error" variant="subtle" icon="i-lucide-circle-alert" :description="errorMessage" role="alert" />
          <UAlert v-if="successMessage" color="success" variant="subtle" icon="i-lucide-circle-check" :description="successMessage" role="status" />

          <button class="group mt-1 flex h-[51px] cursor-pointer items-center justify-between overflow-hidden border-0 bg-[#11c5db] pr-2 pl-[18px] text-xs font-extrabold text-[#071112] transition hover:-translate-y-px hover:bg-[#39d0df] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#11c5db] disabled:cursor-wait disabled:opacity-65" type="submit" :disabled="isSubmitting">
            <span>{{ authMode === 'register' ? 'Create account' : (hasDesktopRequest ? `Continue to ${desktopName}` : 'Continue to Architecton') }}</span>
            <span class="grid h-6 w-[39px] place-items-center border-l border-[#071112]/20">
              <UIcon v-if="isSubmitting" name="i-lucide-loader-circle" class="size-[18px] animate-spin motion-reduce:animate-none" />
              <UIcon v-else name="i-lucide-arrow-up-right" class="size-[18px] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </button>

          <p class="mt-1 text-center text-[11px] text-[#7c8580]">
            {{ authMode === 'register' ? 'Already part of Architecton?' : 'New to Architecton?' }}
            <button type="button" class="cursor-pointer border-0 bg-transparent pl-1 font-bold text-[#087f8f] hover:underline hover:underline-offset-3 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#11c5db]" @click="setMode(authMode === 'register' ? 'sign-in' : 'register')">
              {{ authMode === 'register' ? 'Sign in' : 'Create an account' }}
            </button>
          </p>
        </form>
      </div>

      <footer class="flex w-full justify-between text-[9px] tracking-[.04em] text-[#929a95] max-[900px]:mt-10">
        <span>© {{ new Date().getFullYear() }} Architecton</span>
        <span class="flex gap-5"><NuxtLink to="/privacy" class="hover:text-[#111614]">Privacy</NuxtLink><NuxtLink to="/terms" class="hover:text-[#111614]">Terms</NuxtLink></span>
      </footer>
    </section>
    </div>
  </main>
</template>
