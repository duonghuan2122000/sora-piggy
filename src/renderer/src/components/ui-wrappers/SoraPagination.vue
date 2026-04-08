<template>
  <a-pagination
    :current="current"
    :page-size="pageSize"
    :total="total"
    :page-size-options="pageSizeOptions"
    @change="onChange"
    @showSizeChange="onShowSizeChange"
    v-bind="attrs"
  />
</template>

<script setup lang="ts">
import { useAttrs, defineEmits } from 'vue'

const props = defineProps({
  current: { type: Number, default: 1 },
  pageSize: { type: Number, default: 10 },
  total: { type: Number, default: 0 },
  pageSizeOptions: { type: Array, default: () => [10, 20, 50] }
})

const emits = defineEmits(['update:current', 'update:pageSize', 'change', 'showSizeChange'])
const attrs = useAttrs()

function onChange(page: number) {
  emits('update:current', page)
  emits('change', page)
}

function onShowSizeChange(current: number, size: number) {
  emits('update:pageSize', size)
  emits('showSizeChange', current, size)
}
</script>
