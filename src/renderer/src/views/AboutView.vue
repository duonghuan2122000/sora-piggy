<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import SoraCard from '@renderer/components/ui-wrappers/SoraCard.vue';
import { SoraButton } from '@renderer/components/ui';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const { t } = useI18n();
</script>

<template>
  <div class="about-view">
    <SoraCard>
      <template #header>
        <div>About</div>
      </template>
      <p>{{ t('app.description') }}</p>
      <SoraButton type="primary">
        <font-awesome-icon :icon="['fas', 'info-circle']" />
        {{ t('nav.about') }}
      </SoraButton>
    </SoraCard>
  </div>
</template>

<style scoped>
.about-view {
  padding: 20px;
}
</style>
