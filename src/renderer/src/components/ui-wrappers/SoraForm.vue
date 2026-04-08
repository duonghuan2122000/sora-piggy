<template>
  <a-form ref="formRef" v-bind="attrs">
    <slot />
  </a-form>
</template>

<script setup lang="ts">
import { ref, useAttrs } from 'vue'

const attrs = useAttrs()
const formRef = ref<any>(null)

function validate() {
  // Ant form exposes validateFields which returns a Promise
  return formRef.value?.validateFields ? formRef.value.validateFields() : Promise.resolve()
}

// Expose validate so parent can call via template ref
defineExpose({ validate })

</script>
