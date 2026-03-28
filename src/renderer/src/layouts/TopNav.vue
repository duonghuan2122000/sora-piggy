<script setup lang="ts">
import { NButton } from 'naive-ui';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const emit = defineEmits<{
  addTransaction: [];
}>();

const handleAddTransaction = (): void => {
  emit('addTransaction');
};

defineProps<{
  pageTitle: string;
}>();
</script>

<template>
  <div class="sora-top-nav">
    <div class="sora-left-section">
      <h1 class="sora-page-title">{{ pageTitle }}</h1>
    </div>
    <div class="sora-right-section">
      <NButton type="primary" size="small" @click="handleAddTransaction">
        <template #icon>
          <FontAwesomeIcon :icon="faPlus" />
        </template>
        Add Transaction
      </NButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sora-top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 $spacing-md;
  height: 100%;
  background-color: $bg-primary-light;
  border-bottom: 1px solid #e5e7eb;
}

.sora-left-section {
  flex: 1;
}

.sora-page-title {
  margin: 0;
  font-size: $font-size-md;
  font-weight: 600;
  color: $text-primary-light;
}

.sora-right-section {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}
</style>
