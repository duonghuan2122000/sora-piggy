<script setup lang="ts">
import { ref, computed } from 'vue';
import { ElContainer, ElAside, ElHeader, ElMain } from 'element-plus';
import { RouterView, useRoute, useRouter } from 'vue-router';
import TopNav from './TopNav.vue';
import Sidebar from './Sidebar.vue';
import { ROUTE_NAMES } from '@renderer/constants';
import { useTransactionFormStore } from '@renderer/stores/transactionForm';

const isSidebarCollapsed = ref(false);
const route = useRoute();
const router = useRouter();
const transactionFormStore = useTransactionFormStore();

const pageTitle = computed(() => {
  if (route.name === ROUTE_NAMES.TRANSACTIONS_ADD) {
    return 'Add Transaction';
  }
  // Default title based on route name or fallback
  if (typeof route.name === 'string') {
    return route.name;
  }
  return 'Dashboard';
});

const topNavMode = computed(() => {
  return route.name === ROUTE_NAMES.TRANSACTIONS_ADD ? 'add' : 'list';
});

const handleAddTransaction = (): void => {
  router.push({ name: ROUTE_NAMES.TRANSACTIONS_ADD });
};

const handleSaveTransaction = (): void => {
  transactionFormStore.validateAndSubmit();
};
</script>

<template>
  <ElContainer class="sora-layout">
    <ElAside :width="isSidebarCollapsed ? '64px' : '200px'" class="sora-sider">
      <Sidebar :collapsed="isSidebarCollapsed" />
    </ElAside>
    <ElContainer>
      <ElHeader class="sora-header">
        <TopNav
          :page-title="pageTitle"
          :mode="topNavMode"
          :is-loading="transactionFormStore.isLoading"
          @add-transaction="handleAddTransaction"
          @save-transaction="handleSaveTransaction"
        />
      </ElHeader>
      <ElMain class="sora-content">
        <RouterView />
      </ElMain>
    </ElContainer>
  </ElContainer>
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

.sora-header {
  height: 60px;
  padding: 0;
  background-color: #ffffff;
  flex-shrink: 0;
}

.sora-sider {
  background-color: #f8f9fa;
  border-right: 1px solid #e5e7eb;
  overflow-y: auto;
}

.sora-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: $bg-secondary-light;
  overflow: hidden;
}
</style>
