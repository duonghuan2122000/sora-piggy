<template>
  <a-modal v-bind="attrs" :open="modelValue" @update:open="onUpdate">
    <slot />
  </a-modal>
</template>

<script setup lang="ts">
import { useAttrs } from 'vue'

const props = defineProps({ modelValue: { type: Boolean, default: false } })
const emit = defineEmits(['update:modelValue'])
const attrs = useAttrs()

function onUpdate(open: boolean) {
  emit('update:modelValue', open)
}
</script>
