import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import vi from '../../src/renderer/src/locales/vi.json';
import AboutView from '../../src/renderer/src/views/AboutView.vue';

const i18n = createI18n({
  legacy: false,
  locale: 'vi',
  messages: { vi }
});

describe('AboutView', () => {
  beforeEach(() => {
    window.api = {
      getAppInfo: () => Promise.resolve({ name: 'Sora Piggy', version: '1.0.0' })
    } as unknown as Window['api'];
  });

  it('renders app name and version from IPC', async () => {
    const wrapper = mount(AboutView, {
      global: { plugins: [i18n] }
    });
    await new Promise((r) => setTimeout(r, 50));
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('Sora Piggy');
    expect(wrapper.text()).toContain('1.0.0');
  });

  it('hides version row when version is unavailable', async () => {
    window.api = {
      getAppInfo: () => Promise.resolve({ name: 'Sora Piggy', version: '' })
    } as unknown as Window['api'];
    const wrapper = mount(AboutView, {
      global: { plugins: [i18n] }
    });
    await new Promise((r) => setTimeout(r, 50));
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('Sora Piggy');
    expect(wrapper.text()).not.toContain('Phiên bản');
  });
});
