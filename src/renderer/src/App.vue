<script setup lang="ts">
import { ElConfigProvider } from 'element-plus';
import MainLayout from '@renderer/layouts/MainLayout.vue';
</script>

<template>
  <ElConfigProvider>
    <MainLayout />
  </ElConfigProvider>
</template>
