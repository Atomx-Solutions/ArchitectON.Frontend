import type { PlatformBuild, PlatformId } from '~/data/platforms'
import { platforms } from '~/data/platforms'

interface PlatformBuildResponse {
  platform: PlatformId
  versions: Array<string | Partial<PlatformBuild>>
}

const normalizeBuild = (build: string | Partial<PlatformBuild>): PlatformBuild | null => {
  if (typeof build === 'string') {
    return {
      version: build,
      os: 'Windows',
      architecture: 'x64',
      releaseUrl: null,
      status: 'planned'
    }
  }

  if (!build.version) return null

  return {
    version: build.version,
    os: 'Windows',
    architecture: 'x64',
    releaseUrl: typeof build.releaseUrl === 'string' ? build.releaseUrl : null,
    status: build.status === 'available'
      ? 'available'
      : build.status === 'preview'
        ? 'preview'
        : 'planned'
  }
}

export const usePlatformBuilds = (platform: PlatformId) => {
  const config = useRuntimeConfig()
  const fallbackBuilds = platforms[platform].verifiedBuilds

  return useAsyncData(`builds-${platform}`, async () => {
    if (!config.public.downloadApiBase) return fallbackBuilds

    try {
      const apiBase = config.public.downloadApiBase.replace(/\/$/, '')
      const response = await $fetch<PlatformBuildResponse>(
        `${apiBase}/downloads/platforms/${platform}`
      )

      const builds = response.versions
        .map(normalizeBuild)
        .filter((build): build is PlatformBuild => build !== null)

      return builds.length > 0 ? builds : fallbackBuilds
    } catch {
      return fallbackBuilds
    }
  }, {
    default: () => fallbackBuilds,
    deep: false
  })
}
