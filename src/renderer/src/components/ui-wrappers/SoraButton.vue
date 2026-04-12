<template>
  <a-button :type="type" :disabled="disabled" @click="$emit('click')"><slot /></a-button>
</template>

<script setup lang="ts" name="SoraButton">
const props = defineProps({
  type: { type: String, default: 'default' },
  disabled: { type: Boolean, default: false }
})
</script>
