import fs from 'fs';
import path from 'path';

describe('SCSS variables - unit', () => {
  const varsPath = path.resolve(__dirname, '../../src/renderer/src/assets/scss/_variables.scss');

  test('should define $color-primary and equal Ant default #1890ff', () => {
    const content = fs.readFileSync(varsPath, 'utf-8');
    const m = content.match(/\$color-primary:\s*([^;]+);/);
    expect(m).not.toBeNull();
    const value = m![1].trim();
    expect(value.toLowerCase()).toBe('#1890ff');
  });
});
