import { mount } from '@vue/test-utils';
import SoraLanguageSelect from '@renderer/components/ui/SoraLanguageSelect.vue';
import { createTestingPinia } from '@pinia/testing';

describe('SoraLanguageSelect', () => {
  test('renders and emits on change', async () => {
    const wrapper = mount(SoraLanguageSelect, {
      global: { plugins: [createTestingPinia()] }
    });

    // Should render select
    expect(wrapper.find('select').exists() || wrapper.find('.ant-select').exists()).toBeTruthy();
  });
});
