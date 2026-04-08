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
import { useAttrs } from 'vue'

const props = defineProps({
  current: { type: Number, default: 1 },
  pageSize: { type: Number, default: 10 },
  total: { type: Number, default: 0 },
  pageSizeOptions: { type: Array, default: () => [10, 20, 50] }
})

const emit = defineEmits(['update:current', 'update:pageSize', 'change', 'showSizeChange'])
const attrs = useAttrs()

function onChange(page: number) {
  emit('update:current', page)
  emit('change', page)
}

function onShowSizeChange(current: number, size: number) {
  emit('update:pageSize', size)
  emit('showSizeChange', current, size)
}
</script>
