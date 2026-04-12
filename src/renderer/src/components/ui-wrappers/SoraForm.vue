<template>
  <a-form ref="formRef" v-bind="attrs">
    <slot />
  </a-form>
</template>

<script setup lang="ts">
import { ref, useAttrs } from 'vue';

const attrs = useAttrs();
const formRef = ref<unknown>(null);

type FormFieldsInstance = { validateFields?: () => Promise<unknown> };
function validate(): Promise<unknown> {
  // Ant form exposes validateFields which returns a Promise
  const frm = formRef.value as FormFieldsInstance | undefined;
  return frm?.validateFields ? frm.validateFields() : Promise.resolve();
}

// Expose validate so parent can call via template ref
defineExpose({ validate });
</script>
