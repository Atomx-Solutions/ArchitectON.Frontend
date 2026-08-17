export type PlatformId = 'revit' | 'archicad'

export interface PlatformBuild {
  version: string
  os: 'Windows'
  architecture: 'x64'
  releaseUrl: string | null
  status: 'available' | 'preview' | 'planned'
}

export interface PlatformInfo {
  id: PlatformId
  name: string
  company: string
  iconUrl: string
  accent: string
  description: string
  verifiedBuilds: PlatformBuild[]
}

export const platforms: Record<PlatformId, PlatformInfo> = {
  revit: {
    id: 'revit',
    name: 'Revit',
    company: 'Autodesk',
    iconUrl: '/images/platforms/revit.png?v=2',
    accent: '#2f7cf6',
    description: 'Read the active Revit model, query every element, and create anything from a single wall to a coordinated multi-storey building through natural-language prompts.',
    verifiedBuilds: [
      { version: '2026', os: 'Windows', architecture: 'x64', releaseUrl: '/downloads/architecton-revit-2026-setup.exe', status: 'available' },
      { version: '2025', os: 'Windows', architecture: 'x64', releaseUrl: null, status: 'planned' },
      { version: '2024', os: 'Windows', architecture: 'x64', releaseUrl: null, status: 'planned' },
      { version: '2023', os: 'Windows', architecture: 'x64', releaseUrl: null, status: 'planned' },
      { version: '2022', os: 'Windows', architecture: 'x64', releaseUrl: null, status: 'planned' }
    ]
  },
  archicad: {
    id: 'archicad',
    name: 'Archicad',
    company: 'Graphisoft',
    iconUrl: '/images/platforms/archicad.png?v=2',
    accent: '#00a6d6',
    description: 'Use a model-aware chat to inspect the active Archicad project, create native building elements, and coordinate complete multi-level designs with specialized AI experts.',
    verifiedBuilds: [
      { version: '29', os: 'Windows', architecture: 'x64', releaseUrl: '/downloads/architecton-archicad-29-setup.exe', status: 'available' },
      { version: '28', os: 'Windows', architecture: 'x64', releaseUrl: null, status: 'planned' },
      { version: '27', os: 'Windows', architecture: 'x64', releaseUrl: null, status: 'planned' },
      { version: '26', os: 'Windows', architecture: 'x64', releaseUrl: null, status: 'planned' },
      { version: '25', os: 'Windows', architecture: 'x64', releaseUrl: null, status: 'planned' }
    ]
  }
}

export const isPlatformId = (value: string): value is PlatformId => value in platforms
