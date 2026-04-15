<template>
  <a-select
    v-bind="attrs"
    show-search
    :filter-option="false"
    :search-value="props.modelValue"
    @search="onSearch"
    @change="handleChange"
    @popup-scroll="onPopupScroll"
    :allow-clear="allowClear"
  >
    <template v-for="opt in internalOptions" :key="getKey(opt)">
      <a-select-option :value="getOptValue(opt)">
        <slot
          :item="opt"
          :value="getOptValue(opt)"
          :label="getOptLabel(opt)"
          :is-add="isOptAdd(opt)"
        >
          {{ getOptLabel(opt) }}
        </slot>
      </a-select-option>
    </template>
  </a-select>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useAttrs } from 'vue';

type OptLike = { value?: string | number; label?: string; isAdd?: boolean; [k: string]: unknown };

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  options: {
    type: Array as () => unknown[],
    default: () => []
  },
  fetchSuggestions: {
    type: Function as unknown as () => (
      q: string,
      cb: (opts: unknown[] | undefined) => void,
      opts?: { append?: boolean; pageSize?: number }
    ) => void,
    required: false
  },
  allowClear: { type: Boolean, default: true },
  pageSize: { type: Number, default: 5 }
});

const emit = defineEmits(['update:modelValue', 'select', 'search']);
const attrs = useAttrs();

const internalOptions = ref<unknown[]>(props.options ? (props.options as unknown[]).slice() : []);

watch(
  () => props.options,
  (v) => {
    internalOptions.value = v ? (v as unknown[]).slice() : [];
  }
);

function serialize(opt: unknown): string {
  try {
    return JSON.stringify(opt);
  } catch {
    const asOpt = opt as OptLike;
    return String(asOpt.value ?? String(opt));
  }
}

function getKey(opt: unknown): string {
  const asOpt = opt as OptLike;
  return String(asOpt?.value ?? serialize(opt));
}

function getOptLabel(opt: unknown): string {
  const o = opt as Record<string, unknown>;
  const labelVal = o['label'] ?? o['value'] ?? '';
  return String(labelVal ?? '');
}

function getOptValue(opt: unknown): string | number | undefined {
  const o = opt as Record<string, unknown>;
  const v = o['value'];
  if (v === undefined || v === null) return undefined;
  if (typeof v === 'string' || typeof v === 'number') return v as string | number;
  return String(v);
}

function isOptAdd(opt: unknown): boolean {
  const o = opt as Record<string, unknown>;
  return Boolean(o['isAdd']);
}

const currentQuery = ref('');
const loadingMore = ref(false);
const hasMore = ref(true);
const pageSize = ref<number>(((props as unknown) as { pageSize?: number }).pageSize ?? 5);

function onSearch(val: string): void {
  currentQuery.value = val ?? '';
  emit('search', val);
  if (props.fetchSuggestions) {
    try {
      props.fetchSuggestions(
        val,
        (results: unknown[] | undefined) => {
          internalOptions.value = results || [];
          hasMore.value = (results?.length ?? 0) >= pageSize.value;
        },
        { append: false, pageSize: pageSize.value }
      );
    } catch (e) {
      console.error('fetchSuggestions error', e);
    }
  } else {
    const q = String(val || '')
      .trim()
      .toLowerCase();
    if (q) {
      internalOptions.value = (props.options as unknown[]).filter((opt) => {
        const asOpt = opt as Record<string, unknown>;
        const labelVal = asOpt['label'] ?? asOpt['value'] ?? '';
        return String(labelVal).toLowerCase().includes(q);
      });
    } else {
      internalOptions.value = (props.options as unknown[]).slice();
    }
  }
}

function onPopupScroll(evt: Event): void {
  const target = evt.target as HTMLElement;
  if (!target) return;
  const nearBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 10;
  if (!nearBottom) return;
  if (loadingMore.value || !props.fetchSuggestions) return;
  if (!hasMore.value) return;
  loadingMore.value = true;
  try {
    props.fetchSuggestions(
      currentQuery.value,
      (results: unknown[] | undefined) => {
        internalOptions.value = internalOptions.value.concat(results || []);
        hasMore.value = (results?.length ?? 0) >= pageSize.value;
        loadingMore.value = false;
      },
      { append: true, pageSize: pageSize.value }
    );
  } catch (e) {
    console.error('fetchSuggestions error', e);
    loadingMore.value = false;
  }
}

function handleChange(value: unknown): void {
  // Update v-model with selected value (string | number)
  emit('update:modelValue', value as string | number);
  // Find full option object if available
  const found = (internalOptions.value as unknown[]).find((opt) => {
    const optVal = getOptValue(opt);
    if (optVal === undefined) return false;
    return optVal === value || String(optVal) === String(value);
  });
  emit('select', found ?? value);
}
</script>
