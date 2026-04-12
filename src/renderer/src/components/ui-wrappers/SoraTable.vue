<template>
  <a-table v-bind="tableProps" :data-source="dataSource" @change="onChange">
    <template #bodyCell="{ record, column, index, text }">
      <!-- Prefer per-column named slot: column-{dataIndex|key}. Fallback to default slot -->
      <slot
        v-if="$slots[`column-${column && (column.dataIndex || column.key)}`]"
        :name="`column-${column && (column.dataIndex || column.key)}`"
        :record="record"
        :text="text"
        :index="index"
        :column="column"
      />
      <slot v-else name="default" :record="record" :text="text" :index="index" :column="column" />
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
