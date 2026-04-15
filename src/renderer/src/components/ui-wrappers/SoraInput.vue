<template>
  <a-input v-bind="attrs" :value="props.modelValue" @input="onInput" />
</template>

<script setup lang="ts" name="SoraInput">
import { useAttrs } from 'vue';

const props = defineProps({
  modelValue: { type: [String, Number], default: '' }
});
const emit = defineEmits(['update:modelValue']);
const attrs = useAttrs();


function onInput(e: Event | string): void {
  // Ant input emits an event whose target.value contains the string
  const value =
    typeof e === 'string'
      ? e
      : ((e as Event & { target?: { value?: unknown } }).target?.value ?? '');
  emit('update:modelValue', value as string | number);
}
</script>
