<template>
  <a-input-number v-bind="attrs" :value="props.modelValue" @change="onChange" />
</template>

<script setup lang="ts">
import { useAttrs } from 'vue';
const props = defineProps({ modelValue: { type: Number, default: undefined } });
const emit = defineEmits(['update:modelValue']);
const attrs = useAttrs();

function onChange(val: number): void {
  emit('update:modelValue', val);
}
</script>
