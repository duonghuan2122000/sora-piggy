<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import SoraCard from '@renderer/components/ui-wrappers/SoraCard.vue'
import SoraButton from '@renderer/components/ui-wrappers/SoraButton.vue'

const { t } = useI18n();
</script>

<template>
  <div class="home-view">
    <SoraCard>
      <template #header>
        <div>Home</div>
      </template>
      <p>{{ t('message.welcome') }}</p>
      <SoraButton type="primary">
        <font-awesome-icon :icon="['fas', 'home']" />
        {{ t('nav.home') }}
      </ElButton>
    </ElCard>
  </div>
</template>

<style scoped>
.home-view {
  padding: 20px;
}
</style>
