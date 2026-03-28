<script setup lang="ts">
import { ref } from 'vue';
import { NLayout, NLayoutHeader, NLayoutSider, NLayoutContent } from 'naive-ui';
import { RouterView } from 'vue-router';
import TopNav from './TopNav.vue';
import Sidebar from './Sidebar.vue';

const isSidebarCollapsed = ref(false);
</script>

<template>
  <NLayout class="sora-layout" has-sider>
    <NLayoutSider
      v-model:collapsed="isSidebarCollapsed"
      bordered
      show-trigger
      collapse-mode="width"
      :collapsed-width="64"
      :width="200"
      :native-scrollbar="false"
      class="sora-sider"
    >
      <Sidebar :collapsed="isSidebarCollapsed" />
    </NLayoutSider>
    <NLayout>
      <NLayoutHeader bordered class="sora-header">
        <TopNav />
      </NLayoutHeader>
      <NLayoutContent class="sora-content">
        <RouterView />
      </NLayoutContent>
    </NLayout>
  </NLayout>
</template>

<style scoped>
.sora-layout {
  height: 100vh;
  background-color: #fff;
  margin: 0;
  padding: 0;
  font-family:
    'Anthropic Sans',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
}
.sora-header {
  height: 60px;
  padding: 0;
  background-color: rgb(238, 237, 254);
  border-bottom: 1px solid rgb(83, 74, 183);
}
.sora-sider {
  background-color: #f8f9fa;
  border-right: 1px solid #e5e7eb;
}
.sora-content {
  padding: 20px;
  background-color: #fff;
}
</style>
