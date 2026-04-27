import { describe, it, expect } from 'vitest';

describe('app:getInfo IPC contract', () => {
  it('should return valid shape from preload API', async () => {
    window.api = {
      getAppInfo: () => Promise.resolve({ name: 'Sora Piggy', version: '1.0.0' })
    } as unknown as Window['api'];
    const result = await window.api.getAppInfo();
    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('version');
    expect(typeof result.name).toBe('string');
    expect(typeof result.version).toBe('string');
  });

  it('should handle empty version gracefully', async () => {
    window.api = {
      getAppInfo: () => Promise.resolve({ name: 'Sora Piggy', version: '' })
    } as unknown as Window['api'];
    const result = await window.api.getAppInfo();
    expect(result.name).toBe('Sora Piggy');
    expect(result.version).toBe('');
  });
});
