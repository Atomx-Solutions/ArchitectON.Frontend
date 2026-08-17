export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  modules: ['@nuxt/ui', '@nuxtjs/i18n'],
  css: ['~/assets/css/main.css'],
  devtools: { enabled: false },
  typescript: {
    strict: true
  },
  runtimeConfig: {
    supabaseSecretKey: process.env.SUPABASE_SECRET_KEY || '',
    public: {
      downloadApiBase: process.env.DOWNLOAD_API_BASE || '',
      apiBaseUrl: process.env.API_BASE_URL || '',
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabasePublishableKey: process.env.SUPABASE_PUBLISHABLE_KEY || ''
    }
  },
  app: {
    head: {
      titleTemplate: '%s | Architecton',
      meta: [
        { name: 'theme-color', content: '#101412' },
        { name: 'description', content: 'Architecton is an AI assistant built into Revit and Archicad workflows.' }
      ]
    }
  },
  routeRules: {
    '/Getstarted': { redirect: { to: '/get-started', statusCode: 301 } }
  },
  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'en',
    langDir: 'locales',
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'sq', language: 'sq-AL', name: 'Shqip', file: 'sq.json' },
      { code: 'de', language: 'de-DE', name: 'Deutsch', file: 'de.json' }
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'architecton_locale',
      redirectOn: 'root'
    }
  }
})
