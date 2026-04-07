<template>
  <a-input v-bind="restProps" v-model:value="modelValue" @input="$emit('update:modelValue', $event)" />
</template>

<script setup lang="ts">
import { defineProps, toRefs } from 'vue'
const props = defineProps({
  modelValue: { type: [String, Number], default: '' }
})
const { modelValue, ...restProps } = toRefs(props)
</script>
