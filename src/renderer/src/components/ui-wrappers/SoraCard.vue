<template>
  <a-card v-bind="attrs">
    <slot />
  </a-card>
</template>

<script setup lang="ts">
import { useAttrs } from 'vue';
const attrs = useAttrs();
</script>
