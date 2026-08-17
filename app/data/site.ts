import type { Component } from 'vue'
import { Blocks, Building2, Files, LockKeyhole, RefreshCw, ScanSearch, ShieldCheck, Workflow } from '@lucide/vue'

export interface Feature {
  icon: Component
  title: string
  description: string
}

export interface TrustItem {
  icon: Component
  title: string
  description: string
}

export interface FooterColumn {
  label: string
  links: ReadonlyArray<{ label: string, to: string, external?: boolean }>
}

export const primaryNavigation = [
  { label: 'Download', to: '/#download' },
  { label: 'Capabilities', to: '/#features' },
  { label: 'How it works', to: '/#how-it-works' },
  { label: 'Documentation', to: '/docs/revit-installation' }
] as const

export const features: ReadonlyArray<Feature> = [
  { icon: ScanSearch, title: 'Read the complete model', description: 'Ask how many doors, windows, walls, rooms, or levels exist. Inspect element data, parameters, selections, and project relationships directly through chat.' },
  { icon: Blocks, title: 'Create and edit BIM elements', description: 'Add or modify walls, doors, windows, slabs, roofs, rooms, and other native elements from a clear prompt instead of repeating manual commands.' },
  { icon: Building2, title: 'Generate multi-storey buildings', description: 'Define the building type, number of floors, spaces, and design intent. Architecton coordinates the work needed to develop houses and apartment schemes across multiple levels.' },
  { icon: Workflow, title: 'Coordinate specialized experts', description: 'A Mixture-of-Experts architecture assigns spatial planning, form, project rules, and BIM logic to focused agents that work together on one coordinated result.' },
  { icon: Files, title: 'Verify and document the result', description: 'Prepare quantities, schedules, model summaries, design checks, and structured outputs from the same project intelligence used to create the model.' }
]

export const trustItems: ReadonlyArray<TrustItem> = [
  { icon: ShieldCheck, title: 'Version-specific', description: 'Every build maps to a tested host API.' },
  { icon: RefreshCw, title: 'Update-aware', description: 'New versions appear after validation.' },
  { icon: LockKeyhole, title: 'Controlled', description: 'Model changes require confirmation.' }
]

export const workflowSteps = [
  'Describe the building or change',
  'Let the MoE experts coordinate',
  'Review and generate in your BIM tool'
] as const

export const footerColumns: ReadonlyArray<FooterColumn> = [
  {
    label: 'Product',
    links: [
      { label: 'Capabilities', to: '/#features' },
      { label: 'How it works', to: '/#how-it-works' },
      { label: 'Download', to: '/get-started' }
    ]
  },
  {
    label: 'Resources',
    links: [
      { label: 'Documentation', to: '/docs/revit-installation' },
      { label: 'Support', to: 'mailto:support@architecton.ai', external: true }
    ]
  },
  {
    label: 'Legal',
    links: [
      { label: 'Privacy', to: '/privacy' },
      { label: 'Terms', to: '/terms' }
    ]
  }
]
