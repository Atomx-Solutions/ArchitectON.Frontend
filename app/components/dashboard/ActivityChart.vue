<script setup lang="ts">
import type { DashboardChartPoint } from '~/types/admin-dashboard'

const props = defineProps<{
  points: DashboardChartPoint[]
  metric: 'users' | 'tokens'
}>()

const width = 720
const height = 260
const padding = { top: 24, right: 20, bottom: 42, left: 46 }
const values = computed(() => props.points.map(point => point[props.metric]))
const maximum = computed(() => Math.max(...values.value, 1))
const plotWidth = width - padding.left - padding.right
const plotHeight = height - padding.top - padding.bottom

const coordinates = computed(() => props.points.map((point, index) => ({
  ...point,
  value: point[props.metric],
  x: padding.left + (props.points.length === 1 ? plotWidth / 2 : index * plotWidth / (props.points.length - 1)),
  y: padding.top + plotHeight - (point[props.metric] / maximum.value) * plotHeight
})))

const linePath = computed(() => coordinates.value
  .map((point, index) => `${index ? 'L' : 'M'} ${point.x} ${point.y}`)
  .join(' '))

const areaPath = computed(() => {
  if (!coordinates.value.length) return ''
  const first = coordinates.value[0]!
  const last = coordinates.value.at(-1)!
  return `${linePath.value} L ${last.x} ${padding.top + plotHeight} L ${first.x} ${padding.top + plotHeight} Z`
})

const formatValue = (value: number) => props.metric === 'tokens'
  ? Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value)
  : Intl.NumberFormat('en-US').format(value)
</script>

<template>
  <div class="w-full overflow-hidden">
    <svg :viewBox="`0 0 ${width} ${height}`" class="block h-auto w-full" role="img" aria-label="Six month activity chart">
      <defs>
        <linearGradient id="activity-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--ui-primary)" stop-opacity="0.24" />
          <stop offset="100%" stop-color="var(--ui-primary)" stop-opacity="0" />
        </linearGradient>
      </defs>

      <g v-for="step in 4" :key="step">
        <line
          :x1="padding.left"
          :x2="width - padding.right"
          :y1="padding.top + (step - 1) * plotHeight / 3"
          :y2="padding.top + (step - 1) * plotHeight / 3"
          stroke="var(--ui-border)"
          stroke-dasharray="4 5"
        />
        <text
          :x="padding.left - 10"
          :y="padding.top + (step - 1) * plotHeight / 3 + 4"
          text-anchor="end"
          fill="var(--ui-text-dimmed)"
          font-size="11"
        >{{ formatValue(maximum * (4 - step) / 3) }}</text>
      </g>

      <path v-if="areaPath" :d="areaPath" fill="url(#activity-fill)" />
      <path v-if="linePath" :d="linePath" fill="none" stroke="var(--ui-primary)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />

      <g v-for="point in coordinates" :key="point.month">
        <circle :cx="point.x" :cy="point.y" r="5" fill="var(--ui-bg)" stroke="var(--ui-primary)" stroke-width="3">
          <title>{{ point.label }}: {{ formatValue(point.value) }}</title>
        </circle>
        <text :x="point.x" :y="height - 14" text-anchor="middle" fill="var(--ui-text-muted)" font-size="11">{{ point.label }}</text>
      </g>
    </svg>
  </div>
</template>
