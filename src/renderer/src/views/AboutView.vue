<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { NButton, NCard } from 'naive-ui';

const { t } = useI18n();
</script>

<template>
  <div class="about-view">
    <NCard title="About">
      <p>{{ t('app.description') }}</p>
      <NButton type="primary">
        <font-awesome-icon :icon="['fas', 'info-circle']" />
        {{ t('nav.about') }}
      </NButton>
    </NCard>
  </div>
</template>

<style scoped>
.about-view {
  padding: 20px;
}
</style>
