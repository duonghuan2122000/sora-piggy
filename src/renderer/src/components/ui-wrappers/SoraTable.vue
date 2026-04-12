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
defineProps({
  dataSource: { type: Array, default: () => [] },
  tableProps: { type: Object, default: () => ({}) }
});
function onChange(...args: unknown[]): void {
  const inst = getCurrentInstance() as unknown as { emit?: (...args: unknown[]) => void } | null;
  const compEmit = inst?.emit;
  compEmit && compEmit('change', ...args);
}
</script>
