<template>
  <a-select v-bind="attrs" :value="modelValue" @change="onChange">
    <a-select-option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label || opt.value }}</a-select-option>
    <slot />
  </a-select>
</template>

<script setup lang="ts">
import { useAttrs, defineEmits } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: null },
  options: { type: Array, default: () => [] }
})
const emits = defineEmits(['update:modelValue'])
const attrs = useAttrs()

function onChange(val: any) {
  emits('update:modelValue', val)
}
</script>
