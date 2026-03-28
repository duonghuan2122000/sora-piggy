<script setup lang="ts">
import { NConfigProvider, NDialogProvider, NMessageProvider, lightTheme } from 'naive-ui';
import MainLayout from '@renderer/layouts/MainLayout.vue';
</script>

<template>
  <NConfigProvider :theme="lightTheme">
    <NMessageProvider>
      <NDialogProvider>
        <MainLayout />
      </NDialogProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>
