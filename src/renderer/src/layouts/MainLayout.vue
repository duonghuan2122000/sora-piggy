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
      <NLayoutHeader class="sora-header">
        <TopNav page-title="Dashboard" />
      </NLayoutHeader>
      <NLayoutContent class="sora-content">
        <RouterView />
      </NLayoutContent>
    </NLayout>
  </NLayout>
</template>

<style scoped lang="scss">
.sora-layout {
  height: 100vh;
  width: 100%;
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

/* Target the nested NLayout inside has-sider layout */
:deep(.n-layout--has-sider) {
  height: 100%;
}

:deep(.n-layout--has-sider .n-layout) {
  height: 100%;
  display: flex;
  flex-direction: column;
}

:deep(.n-layout-scroll-container) {
  display: flex;
  flex-direction: column;
}

.sora-header {
  height: 60px;
  padding: 0;
  background-color: #ffffff;
  flex-shrink: 0;
}

.sora-sider {
  background-color: #f8f9fa;
  border-right: 1px solid #e5e7eb;
}

.sora-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: $bg-secondary-light;
  overflow: hidden;
}
</style>
