<template>
  <component :is="icon" v-bind="props" />
</template>

<script setup lang="ts" name="SoraIcon">
const props = defineProps({
  icon: { type: Object, required: true }
});
</script>
