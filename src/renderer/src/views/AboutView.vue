<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import SoraCard from '@renderer/components/ui-wrappers/SoraCard.vue';

const { t } = useI18n();
const appInfo = ref<{ name: string; version: string } | null>(null);

onMounted(async () => {
  try {
    appInfo.value = await window.api.getAppInfo();
  } catch {
    appInfo.value = null;
  }
});
</script>

<template>
  <div class="about-view">
    <SoraCard>
      <template #header>
        <div>{{ t('about.title') }}</div>
      </template>
      <div class="about-info">
        <div class="about-row">
          <span class="about-label">{{ t('about.appName') }}</span>
          <span class="about-value">{{ appInfo?.name ?? '—' }}</span>
        </div>
        <div v-if="appInfo?.version" class="about-row">
          <span class="about-label">{{ t('about.version') }}</span>
          <span class="about-value">{{ appInfo.version }}</span>
        </div>
      </div>
    </SoraCard>
  </div>
</template>

<style scoped>
.about-view {
  padding: 24px;
}

.about-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.about-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #e5e7eb;
}

.about-row:last-child {
  border-bottom: none;
}

.about-label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.about-value {
  font-size: 14px;
  color: #111827;
  font-weight: 600;
}
</style>
