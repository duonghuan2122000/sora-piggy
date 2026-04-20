import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'electron-vite';
import { resolve } from 'path';

export default defineConfig({
  main: {
    build: {
      outDir: 'out/main'
    }
  },
  preload: {
    build: {
      outDir: 'out/preload'
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@assets': resolve('src/renderer/src/assets'),
        '@scss': resolve('src/renderer/src/assets/scss')
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@scss/variables" as *;`
        },
        // Enable less preprocessing for Ant Design theming (javascriptEnabled required)
        less: {
          javascriptEnabled: true
        }
      }
    },
    plugins: [vue()],
    build: {
      outDir: 'out/renderer'
    }
  }
});
