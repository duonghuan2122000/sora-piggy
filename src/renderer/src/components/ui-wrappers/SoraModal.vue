<template>
  <a-modal v-bind="attrs" :open="modelValue" @update:open="onUpdate">
    <slot />
  </a-modal>
</template>

<script setup lang="ts">
import { useAttrs, defineEmits } from 'vue'

const props = defineProps({ modelValue: { type: Boolean, default: false } })
const emits = defineEmits(['update:modelValue'])
const attrs = useAttrs()

function onUpdate(open: boolean) {
  emits('update:modelValue', open)
}
</script>
