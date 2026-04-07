<script setup lang="ts">
import { ElConfigProvider } from 'element-plus';
import { ConfigProvider as AntConfigProvider } from 'ant-design-vue';
import MainLayout from '@renderer/layouts/MainLayout.vue';
</script>

<template>
  <ElConfigProvider>
    <AntConfigProvider>
      <MainLayout />
    </AntConfigProvider>
  </ElConfigProvider>
</template>
