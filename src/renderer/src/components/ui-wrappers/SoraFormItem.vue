<template>
  <a-form-item v-bind="attrs">
    <template #label>
      <slot name="label" />
    </template>
    <slot />
  </a-form-item>
</template>

<script setup lang="ts">
import { useAttrs } from 'vue';
const attrs = useAttrs();
</script>
