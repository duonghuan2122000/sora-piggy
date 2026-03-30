<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ElButton, ElCard } from 'element-plus';

const { t } = useI18n();
</script>

<template>
  <div class="home-view">
    <ElCard>
      <template #header>
        <div>Home</div>
      </template>
      <p>{{ t('message.welcome') }}</p>
      <ElButton type="primary">
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
