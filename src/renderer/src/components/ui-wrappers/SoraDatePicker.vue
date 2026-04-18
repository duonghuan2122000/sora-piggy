<template>
  <a-date-picker v-bind="attrs" :value="props.modelValue" @change="onChange" />
</template>

<script setup lang="ts">
import { useAttrs } from 'vue';
const props = defineProps({ modelValue: null });
const emit = defineEmits(['update:modelValue']);
const attrs = useAttrs();

function onChange(val: unknown): void {
  emit('update:modelValue', val);
}
</script>
