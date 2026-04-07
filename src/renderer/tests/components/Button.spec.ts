import { mount } from '@vue/test-utils'
import Button from '@renderer/components/ui-wrappers/Button.vue'

describe('Button wrapper', () => {
  it('renders slot content', () => {
    const wrapper = mount(Button, { slots: { default: 'Click' } })
    expect(wrapper.text()).toContain('Click')
  })
})
