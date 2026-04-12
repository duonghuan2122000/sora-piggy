import { mount } from '@vue/test-utils';
import SoraLanguageSelect from '@renderer/components/ui-wrappers/SoraLanguageSelect.vue';
import { createTestingPinia } from '@pinia/testing';
import { useLanguageStore } from '@renderer/stores/language';
import { describe, it, expect, vi } from 'vitest';
import { nextTick } from 'vue';

describe('SoraLanguageSelect', () => {
  it('renders the select', () => {
    const wrapper = mount(SoraLanguageSelect, {
      global: { plugins: [createTestingPinia()] }
    });

    expect(wrapper.find('select').exists() || wrapper.find('.ant-select').exists()).toBeTruthy();
  });

  it('calls store.setLanguage and emits language-changed when language is changed', async () => {
    const pinia = createTestingPinia({ createSpy: vi.fn });
    const wrapper = mount(SoraLanguageSelect, {
      global: { plugins: [pinia] }
    });

    const store = useLanguageStore();

    // Provide languages and initial state
    // Include required fields (id, order) to satisfy TypeScript types
    store.languages = [
      { id: 1, code: 'en', name: 'English', order: 1 },
      { id: 2, code: 'vi', name: 'Tiếng Việt', order: 2 }
    ];
    store.isLoading = false;
    store.currentLanguage = 'en';

    // Spy on setLanguage
    store.setLanguage = vi.fn();

    // Programmatically change the v-model value on the component
    // Use the component's exposed API to change the value instead of accessing vm as any
    const select = wrapper.findComponent({ name: 'ASelect' });
    if (select.exists()) {
      await select.vm.$emit('update:value', 'vi');
    } else {
      // fallback: set vm directly for non-Ant select implementations
      (wrapper.vm as unknown as { currentLanguage?: string }).currentLanguage = 'vi';
    }
    await nextTick();
    await nextTick();

    expect(store.setLanguage).toHaveBeenCalledWith('vi');

    const emitted = wrapper.emitted('language-changed');
    expect(emitted).toBeTruthy();
    expect(emitted![0]).toEqual(['vi']);
  });
});
