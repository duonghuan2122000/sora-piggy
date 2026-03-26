<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { NButton, NCard } from 'naive-ui';

const { t } = useI18n();
</script>

<template>
  <div class="home-view">
    <NCard title="Home">
      <p>{{ t('message.welcome') }}</p>
      <NButton type="primary">
        <font-awesome-icon :icon="['fas', 'home']" />
        {{ t('nav.home') }}
      </NButton>
    </NCard>
  </div>
</template>

<style scoped>
.home-view {
  padding: 20px;
}
</style>
