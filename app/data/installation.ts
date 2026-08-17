import type { PlatformId } from '~/data/platforms'

export interface InstallationStep {
  title: string
  description: string
}

export const installationGuides: Record<PlatformId, ReadonlyArray<InstallationStep>> = {
  revit: [
    { title: 'Close Revit', description: 'Save your active project and close all running Revit sessions.' },
    { title: 'Run the installer', description: 'Open the downloaded Architecton setup file once and approve the Windows UAC prompt.' },
    { title: 'Sign in to Architecton', description: 'Launch Revit, open the Architecton tab, select Open Chat, and sign in with your Architecton account.' },
    { title: 'Start working', description: 'Open a project and begin reading, creating, and editing the model directly through Architecton Chat.' }
  ],
  archicad: [
    { title: 'Close Archicad', description: 'Save your project and close all active Archicad sessions.' },
    { title: 'Install the add-on', description: 'Use Add-On Manager or place the APX build made for your exact Archicad version.' },
    { title: 'Sign in to Architecton', description: 'Launch Archicad, open Architecton Chat from the Architecton menu, and sign in with your Architecton account.' },
    { title: 'Start working', description: 'Open a project and begin reading, creating, and editing the model directly through Architecton Chat.' }
  ]
}

export const installationSlugToPlatform: Record<string, PlatformId | undefined> = {
  'revit-installation': 'revit',
  'archicad-installation': 'archicad'
}
