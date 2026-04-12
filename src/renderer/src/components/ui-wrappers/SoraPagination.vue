<template>
  <a-pagination
    :current="current"
    :page-size="pageSize"
    :total="total"
    :page-size-options="pageSizeOptions"
    v-bind="attrs"
    @change="onChange"
    @show-size-change="onShowSizeChange"
  />
</template>

<script setup lang="ts">
import { useAttrs } from 'vue';

defineProps({
  current: { type: Number, default: 1 },
  pageSize: { type: Number, default: 10 },
  total: { type: Number, default: 0 },
  pageSizeOptions: { type: Array, default: () => [10, 20, 50] }
});

const emit = defineEmits(['update:current', 'update:pageSize', 'change', 'showSizeChange']);
const attrs = useAttrs();

function onChange(page: number): void {
  emit('update:current', page);
  emit('change', page);
}

function onShowSizeChange(current: number, size: number): void {
  emit('update:pageSize', size);
  emit('showSizeChange', current, size);
}
</script>
