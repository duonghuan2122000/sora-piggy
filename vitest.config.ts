import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig(async () => {
  // Dynamically import plugin-vue (ESM) to avoid CJS/ESM interop issues
  let plugins = [] as any[];
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = await import('@vitejs/plugin-vue');
    const vue = (mod && (mod as any).default) || mod;
    plugins = [vue()];
  } catch (e) {
    // If plugin cannot be loaded, continue without it; tests may fail with helpful error
    // We keep alias and jsdom environment to attempt running tests
    // The error will be surfaced when running vitest if plugin is required
    // console.warn('Could not load @vitejs/plugin-vue dynamically:', e)
  }

  return {
    plugins,
    resolve: {
      alias: {
        '@renderer': resolve(__dirname, 'src/renderer/src')
      }
    },
    test: {
      globals: false,
      environment: 'jsdom',
      include: [
        'test/**/*.spec.ts',
        'test/**/*.test.ts',
        'tests/**/*.spec.ts',
        'tests/**/*.test.ts'
      ]
    }
  };
});
