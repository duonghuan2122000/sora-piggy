<script setup lang="ts">
import { onMounted } from 'vue';
import SoraLanguageSelect from '@renderer/components/ui-wrappers/SoraLanguageSelect.vue';
import { useLanguageStore } from '@renderer/stores/language';

const languageStore = useLanguageStore();

onMounted(async () => {
  await languageStore.loadLanguages();
  await languageStore.loadPreference();
});
</script>

<template>
  <div class="sora-top-nav">
    <div class="sora-left-section"></div>
    <div class="sora-right-section">
      <SoraLanguageSelect />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@scss/variables' as *;
@use '@scss/mixins' as *;
.sora-top-nav {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: $topnav-height;
  padding: 0 $topnav-padding;
  background-color: $topnav-bg;
  border-bottom: 1px solid #e5e7eb;

  .sora-left-section {
    flex: 1;
  }

  .sora-right-section {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
  }
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

.sora-language-fallback {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 6px;
  color: $text-primary-light;
  background: transparent;
  border: none;
}
</style>
