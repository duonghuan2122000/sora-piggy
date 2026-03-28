<script setup lang="ts">
import { computed } from 'vue';
import { NButton } from 'naive-ui';
import { faPlus, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const emit = defineEmits<{
  addTransaction: [];
  saveTransaction: [];
}>();

const props = defineProps<{
  pageTitle: string;
  mode?: 'list' | 'add';
}>();

const currentMode = computed(() => props.mode || 'list');

const handlePrimaryAction = (): void => {
  if (currentMode.value === 'add') {
    emit('saveTransaction');
  } else {
    emit('addTransaction');
  }
};

const buttonLabel = computed(() => (currentMode.value === 'add' ? 'Save' : 'Add Transaction'));
const buttonIcon = computed(() => (currentMode.value === 'add' ? faSave : faPlus));
</script>

<template>
  <div class="sora-top-nav">
    <div class="sora-left-section">
      <h1 class="sora-page-title">{{ pageTitle }}</h1>
    </div>
    <div class="sora-right-section">
      <NButton type="primary" size="small" @click="handlePrimaryAction">
        <template #icon>
          <FontAwesomeIcon :icon="buttonIcon" />
        </template>
        {{ buttonLabel }}
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
