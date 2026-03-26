<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import {
  NButton,
  NConfigProvider,
  NDialogProvider,
  NLayout,
  NLayoutContent,
  NLayoutHeader,
  NMenu,
  NMessageProvider
} from 'naive-ui';
import { h, ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router';

const { t, locale } = useI18n();

const activeKey = ref<string>('home');

const menuOptions = [
  {
    label: () => h(RouterLink, { to: '/' }, { default: () => t('nav.home') }),
    key: 'home',
    icon: () => h('font-awesome-icon', { icon: ['fas', 'home'] })
  },
  {
    label: () => h(RouterLink, { to: '/about' }, { default: () => t('nav.about') }),
    key: 'about',
    icon: () => h('font-awesome-icon', { icon: ['fas', 'info-circle'] })
  }
];

const toggleLanguage = (): void => {
  locale.value = locale.value === 'vi' ? 'en' : 'vi';
};
</script>

<template>
  <NConfigProvider>
    <NMessageProvider>
      <NDialogProvider>
        <NLayout class="sora-layout">
          <NLayoutHeader bordered class="sora-header">
            <div class="header-content">
              <h1>{{ t('app.title') }}</h1>
              <NButton size="small" @click="toggleLanguage">
                {{ locale === 'vi' ? 'EN' : 'VI' }}
              </NButton>
            </div>
          </NLayoutHeader>
          <NLayout has-sider class="sora-layout">
            <NLayoutSider bordered class="sora-sider">
              <NMenu v-model:value="activeKey" :options="menuOptions" />
            </NLayoutSider>
            <NLayoutContent class="sora-content">
              <RouterView />
            </NLayoutContent>
          </NLayout>
        </NLayout>
      </NDialogProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>

<style scoped>
.sora-layout {
  height: 100vh;
}
.sora-header {
  padding: 0 20px;
  display: flex;
  align-items: center;
  height: 60px;
}
.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.sora-sider {
  width: 200px;
}
.sora-content {
  padding: 20px;
}
</style>
