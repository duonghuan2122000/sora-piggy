<template>
  <a-range-picker v-bind="attrs" :value="pickerValue" :format="format" @change="onChange" />
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import dayjs, { Dayjs } from 'dayjs';

const props = defineProps({
  modelValue: { type: Array as () => (number | null)[], default: () => [null, null] },
  format: { type: String, default: 'YYYY-MM-DD' }
});
const emit = defineEmits(['update:modelValue']);
const attrs = useAttrs();

const pickerValue = computed<(Dayjs | null)[] | undefined>(() => {
  const v = props.modelValue;
  if (!v || !Array.isArray(v) || v.length !== 2) return undefined;
  const [s, e] = v;
  return [s ? dayjs(s) : null, e ? dayjs(e) : null] as (Dayjs | null)[];
});

function onChange(val: (Dayjs | null)[] | null): void {
  if (!val || !Array.isArray(val) || val.length !== 2) {
    emit('update:modelValue', [null, null]);
    return;
  }
  const [s, e] = val;
  emit('update:modelValue', [s ? s.valueOf() : null, e ? e.valueOf() : null]);
}
</script>
