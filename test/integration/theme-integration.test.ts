import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Integration test: ensure ant-theme.scss no longer uses CSS variables and uses SCSS variables

describe('Theme integration', () => {
  const themePath = path.resolve(__dirname, '../../src/renderer/src/styles/ant-theme.scss');
  test('ant-theme.scss should not reference var(--sora', () => {
    const content = fs.readFileSync(themePath, 'utf-8');
    expect(content.includes('var(--sora')).toBe(false);
  });

  test('ant-theme.scss should reference $color-primary or rgba($color-primary', () => {
    const content = fs.readFileSync(themePath, 'utf-8');
    const usesColorPrimary = content.includes('$color-primary') || content.includes('rgba($color-primary');
    expect(usesColorPrimary).toBe(true);
  });
});
