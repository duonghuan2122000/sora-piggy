<script setup lang="ts">
import { NConfigProvider, NDialogProvider, NMessageProvider } from 'naive-ui';
import MainLayout from '@renderer/layouts/MainLayout.vue';
</script>

<template>
  <NConfigProvider>
    <NMessageProvider>
      <NDialogProvider>
        <MainLayout />
      </NDialogProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>
