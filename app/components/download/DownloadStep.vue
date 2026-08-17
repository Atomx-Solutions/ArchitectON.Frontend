<script setup lang="ts">
defineProps<{
  number: number
  label: string
}>()
</script>

<template>
  <div class="grid grid-cols-[36px_1fr] gap-[18px] border-b border-[#d9ddd8] p-7 max-[520px]:px-[18px] max-[520px]:py-[22px]">
    <span class="grid size-7 place-items-center rounded-full border border-[#bfc5c0] text-[11px] text-[#69716d]">{{ number }}</span>
    <div>
      <p class="mt-[5px] mb-3.5 text-sm font-bold">{{ label }}</p>
      <slot />
    </div>
  </div>
</template>
