<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import SoraButton from '@renderer/components/ui-wrappers/SoraButton.vue'
import { faPlus, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import SoraLanguageSelect from '@renderer/components/ui-wrappers/SoraLanguageSelect.vue';
import { useLanguageStore } from '@renderer/stores/language';

const emit = defineEmits<{
  addTransaction: [];
  saveTransaction: [];
}>();

const props = defineProps<{
  pageTitle: string;
  mode?: 'list' | 'add';
  isLoading?: boolean;
}>();

const languageStore = useLanguageStore();
const { t } = useI18n();
const currentMode = computed(() => props.mode || 'list');

const handlePrimaryAction = (): void => {
  if (currentMode.value === 'add') {
    emit('saveTransaction');
  } else {
    emit('addTransaction');
  }
};

const buttonLabel = computed(() =>
  currentMode.value === 'add' ? t('button.save') : t('button.add')
);
const buttonIcon = computed(() => (currentMode.value === 'add' ? faSave : faPlus));

onMounted(async () => {
  await languageStore.loadLanguages();
  await languageStore.loadPreference();
});
</script>

<template>
  <div class="sora-top-nav">
    <div class="sora-left-section">
      <h1 class="sora-page-title">{{ pageTitle }}</h1>
    </div>
    <div class="sora-right-section">
      <SoraLanguageSelect />
      <SoraButton type="primary" :disabled="isLoading" @click="handlePrimaryAction">
          <template #default>
            <FontAwesomeIcon :icon="buttonIcon" /> {{ buttonLabel }}
          </template>
        </SoraButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sora-top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 $spacing-md; @include flex-between;
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
