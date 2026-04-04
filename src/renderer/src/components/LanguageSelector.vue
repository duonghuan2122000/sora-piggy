<script setup lang="ts">
import { computed } from 'vue';
import { ElSelect, ElOption } from 'element-plus';
import { useLanguageStore } from '@renderer/stores/language';

const languageStore = useLanguageStore();

const emit = defineEmits<{
  'language-changed': [language: string];
}>();

const currentLanguage = computed({
  get: () => languageStore.currentLanguage,
  set: (value: string) => {
    languageStore.setLanguage(value);
    emit('language-changed', value);
  }
});

const languages = computed(() => languageStore.languages);
</script>

<template>
  <div class="language-selector">
    <ElSelect
      v-model="currentLanguage"
      placeholder="Select language"
      size="small"
      class="language-select"
      :disabled="languageStore.isLoading"
    >
      <ElOption v-for="lang in languages" :key="lang.code" :label="lang.name" :value="lang.code">
        <span class="language-option">
          <span class="language-name">{{ lang.name }}</span>
          <span class="language-code">({{ lang.code }})</span>
        </span>
      </ElOption>
    </ElSelect>
  </div>
</template>

<style scoped lang="scss">
.language-selector {
  display: inline-block;
}

.language-select {
  width: 120px;
}

.language-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.language-name {
  font-weight: 500;
}

.language-code {
  color: #909399;
  font-size: 0.85em;
  margin-left: 8px;
}
</style>
