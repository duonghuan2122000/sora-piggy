<template>
  <a-table v-bind="tableProps" :data-source="dataSource" @change="onChange">
    <template #bodyCell="{ column, record }">
      <slot name="default" :record="record" />
    </template>
  </a-table>
</template>

<script setup lang="ts" name="SoraTable">
import { defineEmits } from 'vue';
const props = defineProps({
  dataSource: { type: Array, default: () => [] },
  tableProps: { type: Object, default: () => ({}) }
});
const emits = defineEmits(['change']);
function onChange(...args: any[]) {
  emits('change', ...args);
}
</script>
