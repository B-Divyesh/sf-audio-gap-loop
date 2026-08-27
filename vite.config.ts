import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDirectory = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  build: {
    target: 'es2022',
    outDir: 'dist',
    assetsInlineLimit: 4096,
    rollupOptions: {
      input: {
        main: resolve(rootDirectory, 'index.html'),
        privacy: resolve(rootDirectory, 'privacy/index.html'),
        terms: resolve(rootDirectory, 'terms/index.html')
      }
    }
  }
});
