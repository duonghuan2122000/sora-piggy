<template>
  <div class="sora-data-table">
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
  </div>
</template>

<script setup lang="ts" name="SoraTable">
import { getCurrentInstance } from 'vue';
// emits handled via component events
defineProps({
  dataSource: { type: Array, default: () => [] },
  tableProps: { type: Object, default: () => ({}) }
});
function onChange(...args: unknown[]): void {
  // Debug: forward change events and log args
  // eslint-disable-next-line no-console
  console.debug('[SoraTable] onChange args:', ...args);
  const inst = getCurrentInstance() as unknown as { emit?: (...args: unknown[]) => void } | null;
  const compEmit = inst?.emit;
  compEmit && compEmit('change', ...args);
}
</script>

<style lang="scss" scoped>
/* Make Ant Design table wrapper fill the card and layout pagination at bottom */
.sora-data-table :deep(.ant-table-wrapper) {
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.sora-data-table :deep(.ant-spin-nested-loading) {
  overflow: hidden;
}

.sora-data-table :deep(.ant-spin-container),
.sora-data-table :deep(.ant-table),
.sora-data-table :deep(.ant-table-container) {
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.sora-data-table :deep(.ant-table-content),
.sora-data-table :deep(.ant-table-body),
.sora-data-table :deep(.ant-table-scroll) {
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
}

/* Ensure table header stays visible */
.sora-data-table :deep(.ant-table thead) {
  flex: 0 0 auto;
}

/* Keep pagination area outside the scrollable body but inside wrapper */
.sora-data-table :deep(.ant-pagination) {
  flex: 0 0 auto;
  margin-top: 8px !important;
  align-self: flex-end;
}
</style>
