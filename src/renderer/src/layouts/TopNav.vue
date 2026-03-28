<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { NButton } from 'naive-ui';

const { locale } = useI18n();

const toggleLanguage = (): void => {
  locale.value = locale.value === 'vi' ? 'en' : 'vi';
};
</script>

<template>
  <div class="top-nav">
    <div class="logo">
      <h1>Vue.js Renderer (Giao diện người dùng)</h1>
      <span class="subtitle">5 module: Giao dịch · Ngân sách · Mục tiêu · Báo cáo · Cài đặt</span>
    </div>
    <div class="actions">
      <NButton size="small" @click="toggleLanguage">
        {{ locale === 'vi' ? 'EN' : 'VI' }}
      </NButton>
    </div>
  </div>
</template>

<style scoped>
.top-nav {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  height: 100%;
}
.logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.logo h1 {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: rgb(60, 52, 137);
}
.subtitle {
  font-size: 12px;
  color: rgb(83, 74, 183);
  margin-top: 2px;
}
.actions {
  display: none;
}
</style>
