<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ElButton, ElCard } from 'element-plus';

const { t } = useI18n();
</script>

<template>
  <div class="about-view">
    <ElCard>
      <template #header>
        <div>About</div>
      </template>
      <p>{{ t('app.description') }}</p>
      <ElButton type="primary">
        <font-awesome-icon :icon="['fas', 'info-circle']" />
        {{ t('nav.about') }}
      </ElButton>
    </ElCard>
  </div>
</template>

<style scoped>
.about-view {
  padding: 20px;
}
</style>
