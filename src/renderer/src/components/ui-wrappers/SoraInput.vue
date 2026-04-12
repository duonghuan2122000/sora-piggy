<template>
  <a-input v-bind="attrs" :value="modelValue" @input="onInput" />
</template>

<script setup lang="ts" name="SoraInput">
import { useAttrs } from 'vue';

const props = defineProps({
  modelValue: { type: [String, Number], default: '' }
});
const emit = defineEmits(['update:modelValue']);
const attrs = useAttrs();

const modelValue = props.modelValue as string | number;
function onInput(e: Event | string) {
  // Ant input emits an event whose target.value contains the string
  const value = (e && typeof e === 'object' && 'target' in e) ? (e as any).target.value : e;
  emit('update:modelValue', value);
}
</script>
