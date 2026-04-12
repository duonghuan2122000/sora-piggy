<template>
  <a-table v-bind="tableProps" :data-source="dataSource" @change="onChange">
    <template #bodyCell="{ record }">
      <slot name="default" :record="record" />
    </template>
  </a-table>
</template>

<script setup lang="ts" name="SoraTable">
import { getCurrentInstance } from 'vue';
// emits handled via component events
const props = defineProps({
  dataSource: { type: Array, default: () => [] },
  tableProps: { type: Object, default: () => ({}) }
});
function onChange(...args: any[]) {
  const compEmit = (getCurrentInstance() as any)?.emit;
  compEmit && compEmit('change', ...args);
}
</script>
