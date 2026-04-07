<template>
  <a-table v-bind="tableProps" :data-source="dataSource" @change="$emit('change', $event)" />
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
const props = defineProps({
  dataSource: { type: Array, default: () => [] },
  tableProps: { type: Object, default: () => ({}) }
})
</script>
