<template>
  <a-select v-bind="attrs" :value="modelValue" @change="onChange">
    <a-select-option v-for="opt in options" :key="opt.value" :value="opt.value">{{
      opt.label || opt.value
    }}</a-select-option>
    <slot />
  </a-select>
</template>

<script setup lang="ts">
import { useAttrs } from 'vue';

defineProps({
  modelValue: { type: [String, Number], default: null },
  options: {
    type: Array as () => Array<{ value: string | number; label?: string }>,
    default: () => []
  }
});
const emit = defineEmits(['update:modelValue']);
const attrs = useAttrs();

function onChange(val: unknown): void {
  emit('update:modelValue', val);
}
</script>
