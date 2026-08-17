export default defineAppConfig({
  icon: {
    mode: 'css',
    cssLayer: 'base'
  },
  ui: {
    colors: {
      primary: 'architecton',
      secondary: 'orange',
      success: 'green',
      info: 'blue',
      warning: 'amber',
      error: 'red',
      neutral: 'zinc'
    },
    icons: {
      loading: 'i-lucide-loader-circle',
      menu: 'i-lucide-menu',
      close: 'i-lucide-x',
      check: 'i-lucide-check',
      chevronDown: 'i-lucide-chevron-down'
    }
  }
})
