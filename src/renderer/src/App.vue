<script setup lang="ts">
// ElementPlus config provider removed
import { ConfigProvider as AntConfigProvider } from 'ant-design-vue';
import MainLayout from '@renderer/layouts/MainLayout.vue';
</script>

<template>
  <AntConfigProvider>
    <MainLayout />
  </AntConfigProvider>
</template>
