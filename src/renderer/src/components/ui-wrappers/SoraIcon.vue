<template>
  <component :is="icon" v-bind="props" />
</template>

<script setup lang="ts" name="SoraIcon">
import { defineProps } from 'vue'
const props = defineProps({
  icon: { type: Object, required: true },
})
</script>
